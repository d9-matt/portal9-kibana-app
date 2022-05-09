/*
 * Portal9 app - Module for agent info fetching functions
 * Copyright (C) 2015-2021 Portal9, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import cron from 'node-cron';
import { log } from '../../lib/logger';
import { monitoringTemplate } from '../../integration-files/monitoring-template';
import { getConfiguration } from '../../lib/get-configuration';
import { parseCron } from '../../lib/parse-cron';
import { indexDate } from '../../lib/index-date';
import { buildIndexSettings } from '../../lib/build-index-settings';
import { Portal9HostsCtrl } from '../../controllers/portal9-hosts';
import { 
  PORTAL9_MONITORING_PATTERN,
  PORTAL9_INDEX_REPLICAS,
  PORTAL9_MONITORING_TEMPLATE_NAME,
  PORTAL9_MONITORING_DEFAULT_INDICES_SHARDS,
  PORTAL9_MONITORING_DEFAULT_CREATION,
  PORTAL9_MONITORING_DEFAULT_ENABLED,
  PORTAL9_MONITORING_DEFAULT_FREQUENCY,
} from '../../../common/constants';
import { tryCatchForIndexPermissionError } from '../tryCatchForIndexPermissionError';

const bluePortal9 = '\u001b[34mportal9\u001b[39m';
const monitoringErrorLogColors = [bluePortal9, 'monitoring', 'error'];
const portal9HostController = new Portal9HostsCtrl();

let MONITORING_ENABLED, MONITORING_FREQUENCY, MONITORING_CRON_FREQ, MONITORING_CREATION, MONITORING_INDEX_PATTERN, MONITORING_INDEX_PREFIX;

// Utils functions

/**
 * Delay as promise
 * @param timeMs
 */
function delay(timeMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
}

/**
 * Get the setting value from the configuration
 * @param setting
 * @param configuration
 * @param defaultValue
 */
function getAppConfigurationSetting(setting: string, configuration: any, defaultValue: any){
  return typeof configuration[setting] !== 'undefined' ? configuration[setting] : defaultValue;
};

/**
 * Set the monitoring variables
 * @param context
 */
function initMonitoringConfiguration(context){
  try{
    const appConfig = getConfiguration();
    MONITORING_ENABLED = appConfig && typeof appConfig['portal9.monitoring.enabled'] !== 'undefined'
      ? appConfig['portal9.monitoring.enabled'] &&
        appConfig['portal9.monitoring.enabled'] !== 'worker'
      : PORTAL9_MONITORING_DEFAULT_ENABLED;
    MONITORING_FREQUENCY = getAppConfigurationSetting('portal9.monitoring.frequency', appConfig, PORTAL9_MONITORING_DEFAULT_FREQUENCY);
    MONITORING_CRON_FREQ = parseCron(MONITORING_FREQUENCY);
    MONITORING_CREATION = getAppConfigurationSetting('portal9.monitoring.creation', appConfig, PORTAL9_MONITORING_DEFAULT_CREATION);

    MONITORING_INDEX_PATTERN = getAppConfigurationSetting('portal9.monitoring.pattern', appConfig, PORTAL9_MONITORING_PATTERN);
    const lastCharIndexPattern = MONITORING_INDEX_PATTERN[MONITORING_INDEX_PATTERN.length - 1];
    if (lastCharIndexPattern !== '*') {
      MONITORING_INDEX_PATTERN += '*';
    };
    MONITORING_INDEX_PREFIX = MONITORING_INDEX_PATTERN.slice(0,MONITORING_INDEX_PATTERN.length - 1);

    log(
      'monitoring:initMonitoringConfiguration',
      `portal9.monitoring.enabled: ${MONITORING_ENABLED}`,
      'debug'
    );

    log(
      'monitoring:initMonitoringConfiguration',
      `portal9.monitoring.frequency: ${MONITORING_FREQUENCY} (${MONITORING_CRON_FREQ})`,
      'debug'
    );

    log(
      'monitoring:initMonitoringConfiguration',
      `portal9.monitoring.pattern: ${MONITORING_INDEX_PATTERN} (index prefix: ${MONITORING_INDEX_PREFIX})`,
      'debug'
    );
  }catch(error){
    const errorMessage = error.message || error;
    log(
      'monitoring:initMonitoringConfiguration',
      errorMessage
    );
    context.portal9.logger.error(errorMessage)
  }
};

/**
 * Main. First execution when installing / loading App.
 * @param context
 */
async function init(context) {
  try {
    if (MONITORING_ENABLED) {
      await checkTemplate(context);
    };
  } catch (error) {
    const errorMessage = error.message || error;
    log('monitoring:init', error.message || error);
    context.portal9.logger.error(errorMessage);
  }
}

/**
 * Verify portal9-agent template
 */
async function checkTemplate(context) {
  try {
    log(
      'monitoring:checkTemplate',
      'Updating the monitoring template',
      'debug'
    );

    try {
      // Check if the template already exists
      const currentTemplate = await context.core.elasticsearch.client.asInternalUser.indices.getTemplate({
        name: PORTAL9_MONITORING_TEMPLATE_NAME
      });
      // Copy already created index patterns
      monitoringTemplate.index_patterns = currentTemplate.body[PORTAL9_MONITORING_TEMPLATE_NAME].index_patterns;
    }catch (error) {
      // Init with the default index pattern
      monitoringTemplate.index_patterns = [PORTAL9_MONITORING_PATTERN];
    }

    // Check if the user is using a custom pattern and add it to the template if it does
    if (!monitoringTemplate.index_patterns.includes(MONITORING_INDEX_PATTERN)) {
      monitoringTemplate.index_patterns.push(MONITORING_INDEX_PATTERN);
    };

    // Update the monitoring template
    await context.core.elasticsearch.client.asInternalUser.indices.putTemplate({
      name: PORTAL9_MONITORING_TEMPLATE_NAME,
      body: monitoringTemplate
    });
    log(
      'monitoring:checkTemplate',
      'Updated the monitoring template',
      'debug'
    );
  } catch (error) {
    const errorMessage = `Something went wrong updating the monitoring template ${error.message || error}`;
    log(
      'monitoring:checkTemplate',
      errorMessage
    );
    context.portal9.logger.error(monitoringErrorLogColors, errorMessage);
    throw error;
  }
}

/**
 * Save agent status into elasticsearch, create index and/or insert document
 * @param {*} context
 * @param {*} data
 */
async function insertMonitoringDataElasticsearch(context, data) {
  const monitoringIndexName = MONITORING_INDEX_PREFIX + indexDate(MONITORING_CREATION);
    if (!MONITORING_ENABLED){
      return;
    };
    try {
      await tryCatchForIndexPermissionError(monitoringIndexName) (async() => {
        const exists = await context.core.elasticsearch.client.asInternalUser.indices.exists({index: monitoringIndexName});
        if(!exists.body){
          await createIndex(context, monitoringIndexName);
        };

        // Update the index configuration
        const appConfig = getConfiguration();
        const indexConfiguration = buildIndexSettings(
          appConfig,
          'portal9.monitoring',
          PORTAL9_MONITORING_DEFAULT_INDICES_SHARDS
        );

        // To update the index settings with this client is required close the index, update the settings and open it
        // Number of shards is not dynamic so delete that setting if it's given
        delete indexConfiguration.settings.index.number_of_shards;
        await context.core.elasticsearch.client.asInternalUser.indices.putSettings({
          index: monitoringIndexName,
          body: indexConfiguration
        });

        // Insert data to the monitoring index
        await insertDataToIndex(context, monitoringIndexName, data);
      })();
    }catch(error){
      log('monitoring:insertMonitoringDataElasticsearch', error.message || error);
      context.portal9.logger.error(error.message);
    }
}

/**
 * Inserting one document per agent into Elastic. Bulk.
 * @param {*} context Endpoint
 * @param {String} indexName The name for the index (e.g. daily: portal9-monitoring-YYYY.MM.DD)
 * @param {*} data
 */
async function insertDataToIndex(context, indexName: string, data: {agents: any[], apiHost}) {
  const { agents, apiHost } = data;
  try {
    if (agents.length > 0) {
      log(
        'monitoring:insertDataToIndex',
        `Bulk data to index ${indexName} for ${agents.length} agents`,
        'debug'
      );

      const bodyBulk = agents.map(agent => {
        const agentInfo = {...agent};
        agentInfo['timestamp'] = new Date(Date.now()).toISOString();
        agentInfo.host = agent.manager;
        agentInfo.cluster = { name: apiHost.clusterName ? apiHost.clusterName : 'disabled' };
        return `{ "index":  { "_index": "${indexName}" } }\n${JSON.stringify(agentInfo)}\n`;
      }).join('');

      await context.core.elasticsearch.client.asInternalUser.bulk({
        index: indexName,
        body: bodyBulk
      });
      log(
        'monitoring:insertDataToIndex',
        `Bulk data to index ${indexName} for ${agents.length} agents completed`,
        'debug'
      );
    }
  } catch (error) {
    log(
      'monitoring:insertDataToIndex',
      `Error inserting agent data into elasticsearch. Bulk request failed due to ${error.message ||
        error}`
    );
  }
}

/**
 * Create the portal9-monitoring index
 * @param {*} context context
 * @param {String} indexName The name for the index (e.g. daily: portal9-monitoring-YYYY.MM.DD)
 */
async function createIndex(context, indexName: string) {
  try {
    if (!MONITORING_ENABLED) return;
    const appConfig = getConfiguration();

    const IndexConfiguration = {
      settings: {
        index: {
          number_of_shards: getAppConfigurationSetting('portal9.monitoring.shards', appConfig, PORTAL9_MONITORING_DEFAULT_INDICES_SHARDS),
          number_of_replicas: getAppConfigurationSetting('portal9.monitoring.replicas', appConfig, PORTAL9_INDEX_REPLICAS)
        }
      }
    };

    await context.core.elasticsearch.client.asInternalUser.indices.create({
      index: indexName,
      body: IndexConfiguration
    });

    log(
      'monitoring:createIndex',
      `Successfully created new index: ${indexName}`,
      'debug'
    );
  } catch (error) {
    const errorMessage = `Could not create ${indexName} index on elasticsearch due to ${error.message || error}`;
    log(
      'monitoring:createIndex',
      errorMessage
    );
    context.portal9.logger.error(errorMessage);
  }
}

/**
* Wait until Kibana server is ready
*/
async function checkKibanaStatus(context) {
 try {
    log(
      'monitoring:checkKibanaStatus',
      'Waiting for Kibana and Elasticsearch servers to be ready...',
      'debug'
    );

   await checkElasticsearchServer(context);
   await init(context);
   return;
 } catch (error) {
    log(
      'monitoring:checkKibanaStatus',
      error.mesage ||error
    );
    try{
      await delay(3000);
      await checkKibanaStatus(context);
    }catch(error){};
 }
}


/**
 * Check Elasticsearch Server status and Kibana index presence
 */
async function checkElasticsearchServer(context) {
  try {
    const data = await context.core.elasticsearch.client.asInternalUser.indices.exists({
      index: context.server.config.kibana.index
    });

    return data.body;
    // TODO: check if Elasticsearch can receive requests
    // if (data) {
    //   const pluginsData = await this.server.plugins.elasticsearch.waitUntilReady();
    //   return pluginsData;
    // }
    return Promise.reject(data);
  } catch (error) {
    log('monitoring:checkElasticsearchServer', error.message || error);
    return Promise.reject(error);
  }
}

const fakeResponseEndpoint = {
  ok: (body: any) => body,
  custom: (body: any) => body,
}
/**
 * Get API configuration from elastic and callback to loadCredentials
 */
async function getHostsConfiguration() {
  try {
    const hosts = await portal9HostController.getHostsEntries(false, false, fakeResponseEndpoint);
    if (hosts.body.length) {
      return hosts.body;
    };

    log(
      'monitoring:getConfig',
      'There are no Portal9 API entries yet',
      'debug'
    );
    return Promise.reject({
      error: 'no credentials',
      error_code: 1
    });
  } catch (error) {
    log('monitoring:getHostsConfiguration', error.message || error);
    return Promise.reject({
      error: 'no portal9 hosts',
      error_code: 2
    });
  }
}

/**
   * Task used by the cron job.
   */
async function cronTask(context) {
  try {
    const templateMonitoring = await context.core.elasticsearch.client.asInternalUser.indices.getTemplate({name: PORTAL9_MONITORING_TEMPLATE_NAME});

    const apiHosts = await getHostsConfiguration();
    const apiHostsUnique = (apiHosts || []).filter(
      (apiHost, index, self) =>
        index ===
        self.findIndex(
          t =>
            t.user === apiHost.user &&
            t.password === apiHost.password &&
            t.url === apiHost.url &&
            t.port === apiHost.port
        )
    );
    for(let apiHost of apiHostsUnique){
      try{
        const { agents, apiHost: host} = await getApiInfo(context, apiHost);
        await insertMonitoringDataElasticsearch(context, {agents, apiHost: host});
      }catch(error){

      };
    }
  } catch (error) {
    // Retry to call itself again if Kibana index is not ready yet
    // try {
    //   if (
    //     this.wzWrapper.buildingKibanaIndex ||
    //     ((error || {}).status === 404 &&
    //       (error || {}).displayName === 'NotFound')
    //   ) {
    //     await delay(1000);
    //     return cronTask(context);
    //   }
    // } catch (error) {} //eslint-disable-line

    log('monitoring:cronTask', error.message || error);
    context.portal9.logger.error(error.message || error);
  }
}

/**
 * Get API and agents info
 * @param context
 * @param apiHost
 */
async function getApiInfo(context, apiHost){
  try{
    log('monitoring:getApiInfo', `Getting API info for ${apiHost.id}`, 'debug');
    const responseIsCluster = await context.portal9.api.client.asInternalUser.request('GET', '/cluster/status', {}, { apiHostID: apiHost.id });
    const isCluster = (((responseIsCluster || {}).data || {}).data || {}).enabled === 'yes';
    if(isCluster){
      const responseClusterInfo = await context.portal9.api.client.asInternalUser.request('GET', `/cluster/local/info`, {},  { apiHostID: apiHost.id });
      apiHost.clusterName = responseClusterInfo.data.data.affected_items[0].cluster;
    };
    const agents = await fetchAllAgentsFromApiHost(context, apiHost);
    return { agents, apiHost };
  }catch(error){
    log('monitoring:getApiInfo', error.message || error);
    throw error;
  }
};

/**
 * Fetch all agents for the API provided
 * @param context
 * @param apiHost
 */
async function fetchAllAgentsFromApiHost(context, apiHost){
  let agents = [];
  try{
    log('monitoring:fetchAllAgentsFromApiHost', `Getting all agents from ApiID: ${apiHost.id}`, 'debug');
    const responseAgentsCount = await context.portal9.api.client.asInternalUser.request(
      'GET',
      '/agents',
      {
        params: {
          offset: 0,
          limit: 1,
          q: 'id!=000'
        }
      }, {apiHostID: apiHost.id});

    const agentsCount = responseAgentsCount.data.data.total_affected_items;
    log('monitoring:fetchAllAgentsFromApiHost', `ApiID: ${apiHost.id}, Agent count: ${agentsCount}`, 'debug');

    let payload = {
      offset: 0,
      limit: 500,
      q: 'id!=000'
    };

    while (agents.length < agentsCount && payload.offset < agentsCount) {
      try{
        const responseAgents = await context.portal9.api.client.asInternalUser.request(
          'GET',
          `/agents`,
          {params: payload},
          {apiHostID: apiHost.id}
        );
        agents = [...agents, ...responseAgents.data.data.affected_items];
        payload.offset += payload.limit;
      }catch(error){
        log('monitoring:fetchAllAgentsFromApiHost', `ApiID: ${apiHost.id}, Error request with offset/limit ${payload.offset}/${payload.limit}: ${error.message || error}`);
      }
    }
    return agents;
  }catch(error){
    log('monitoring:fetchAllAgentsFromApiHost', `ApiID: ${apiHost.id}. Error: ${error.message || error}`);
    throw error;
  }
};

/**
 * Start the cron job
 */
export async function jobMonitoringRun(context) {
  // Init the monitoring variables
  initMonitoringConfiguration(context);
  // Check Kibana index and if it is prepared, start the initialization of Portal9 App.
  await checkKibanaStatus(context);
  // // Run the cron job only it it's enabled
  if (MONITORING_ENABLED) {
    cronTask(context);
    cron.schedule(MONITORING_CRON_FREQ, () => cronTask(context));
  }
}

