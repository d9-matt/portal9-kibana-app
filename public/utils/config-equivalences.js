export const configEquivalences = {
  pattern: 'Default index pattern to use on the app.',
  'customization.logo.app':'Define the name of the app logo saved in the path /plugins/portal9/assets/',
  'customization.logo.sidebar':'Define the name of the sidebar logo saved in the path /plugins/portal9/assets/',
  'customization.logo.healthcheck':'Define the name of the health-check logo saved in the path /plugins/portal9/assets/',
  'customization.logo.reports':'Define the name of the reports logo (.png) saved in the path /plugins/portal9/assets/',
  'checks.pattern':
    'Enable or disable the index pattern health check when opening the app.',
  'checks.template':
    'Enable or disable the template health check when opening the app.',
  'checks.api': 'Enable or disable the API health check when opening the app.',
  'checks.setup':
    'Enable or disable the setup health check when opening the app.',
  'checks.fields':
    'Enable or disable the known fields health check when opening the app.',
    'checks.metaFields':
      'Change the default value of the Kibana metaField configuration',
    'checks.timeFilter':
      'Change the default value of the Kibana timeFilter configuration',
    'checks.maxBuckets':
      'Change the default value of the Kibana max buckets configuration',
  'extensions.pci': 'Enable or disable the PCI DSS tab on Overview and Agents.',
  'extensions.gdpr': 'Enable or disable the GDPR tab on Overview and Agents.',
  'extensions.audit': 'Enable or disable the Audit tab on Overview and Agents.',
  'extensions.oscap':
    'Enable or disable the Open SCAP tab on Overview and Agents.',
  'extensions.ciscat':
    'Enable or disable the CIS-CAT tab on Overview and Agents.',
  'extensions.aws': 'Enable or disable the Amazon (AWS) tab on Overview.',
  'extensions.gcp': 'Enable or disable the Google Cloud Platform tab on Overview.',
  'extensions.virustotal':
    'Enable or disable the VirusTotal tab on Overview and Agents.',
  'extensions.osquery':
    'Enable or disable the Osquery tab on Overview and Agents.',
  'extensions.mitre': 'Enable or disable the MITRE tab on Overview and Agents.',
  'extensions.docker':
    'Enable or disable the Docker listener tab on Overview and Agents.',
  timeout:
    'Defines the maximum time the app will wait for an API response when making requests to it.',
  'api.selector':
    'Defines if the user is allowed to change the selected API directly from the top menu bar.',
  'ip.selector':
    'Defines if the user is allowed to change the selected index pattern directly from the top menu bar.',
  'ip.ignore':
    'Disable certain index pattern names from being available in index pattern selector from the Wazuh app.',
  'portal9.monitoring.enabled':
    'Enable or disable the portal9-monitoring index creation and/or visualization.',
  'portal9.monitoring.frequency':
    'Define in seconds the frequency the app generates a new document on the portal9-monitoring index.',
  'portal9.monitoring.shards':
    'Define the number of shards to use for the portal9-monitoring-* indices.',
  'portal9.monitoring.replicas':
    'Define the number of replicas to use for the portal9-monitoring-* indices.',
  'portal9.monitoring.creation':
    'Define the interval in which the portal9-monitoring index will be created.',
  'portal9.monitoring.pattern':
    'Default index pattern to use on the app for Wazuh monitoring.',
  hideManagerAlerts:
    'Hide the alerts of the manager in all dashboards.',
  'logs.level':
    'Set the app logging level, allowed values are info and debug. Default is info.',
  'enrollment.dns':
    'Set the Wazuh server address in the agent deployment.',
  'cron.prefix':
    'Define the index prefix of predefined jobs.',
  'cron.statistics.status':
    'Enable or disable the statistics tasks.',
  'cron.statistics.apis':
    'Enter the ID of the APIs you want to save data from, leave this empty to run the task on all configured APIs.',
  'cron.statistics.interval': 'Define the frequency of task execution using cron schedule expressions.',
  'cron.statistics.index.name': 'Define the name of the index in which the documents are to be saved.',
  'cron.statistics.index.creation': 'Define the interval in which the index will be created.',
  'cron.statistics.index.shards': 'Define the number of shards to use for the statistics indices.',
  'cron.statistics.index.replicas': 'Define the number of replicas to use for the statistics indices.',
  'alerts.sample.prefix': 'Define the index name prefix of sample alerts. It must match with the template used by the index pattern to avoid unknown fields in dashboards.',
};

export const nameEquivalence = {
  pattern: 'Index pattern',
  'customization.logo.app': 'Logo App',
  'customization.logo.sidebar': 'Logo Sidebar',
  'customization.logo.healthcheck': 'Logo Health Check',
  'customization.logo.reports': 'Logo Reports',
  'checks.pattern': 'Index pattern',
  'checks.template': 'Index template',
  'checks.api': 'API connection',
  'checks.setup': 'API version',
  'checks.fields': 'Know fields',
  'checks.metaFields': 'Remove meta fields',
  'checks.timeFilter': 'Set time filter to 24h',
  'checks.maxBuckets': 'Set max buckets to 200000',
  timeout: 'Request timeout',
  'api.selector': 'API selector',
  'ip.selector': 'IP selector',
  'ip.ignore': 'IP ignore',
  'xpack.rbac.enabled': 'X-Pack RBAC',
  'portal9.monitoring.enabled': 'Status',
  'portal9.monitoring.frequency': 'Frequency',
  'portal9.monitoring.shards': 'Index shards',
  'portal9.monitoring.replicas': 'Index replicas',
  'portal9.monitoring.creation': 'Index creation',
  'portal9.monitoring.pattern': 'Index pattern',
  hideManagerAlerts: 'Hide manager alerts',
  'logs.level': 'Log level',
  'enrollment.dns': 'Enrollment DNS',
  'cron.prefix': 'Cron prefix',
  'cron.statistics.status': 'Status',
  'cron.statistics.apis': 'Includes apis',
  'cron.statistics.interval': 'Interval',
  'cron.statistics.index.name': 'Index name',
  'cron.statistics.index.creation': 'Index creation',
  'cron.statistics.index.shards': 'Index shards',
  'cron.statistics.index.replicas': 'Index replicas',
  'alerts.sample.prefix': 'Sample alerts prefix',
}

const HEALTH_CHECK = 'Health Check';
const GENERAL = 'General';
const SECURITY = 'Security';
const MONITORING = 'Monitoring';
const STATISTICS = 'Statistics';
const CUSTOMIZATION = 'Logo Customization';
export const categoriesNames = [HEALTH_CHECK, GENERAL, SECURITY, MONITORING, STATISTICS, CUSTOMIZATION];

export const categoriesEquivalence = {
  pattern: GENERAL,
  'customization.logo.app':CUSTOMIZATION,
  'customization.logo.sidebar':CUSTOMIZATION,
  'customization.logo.healthcheck':CUSTOMIZATION,
  'customization.logo.reports':CUSTOMIZATION,
  'checks.pattern': HEALTH_CHECK,
  'checks.template': HEALTH_CHECK,
  'checks.api': HEALTH_CHECK,
  'checks.setup': HEALTH_CHECK,
  'checks.fields': HEALTH_CHECK,
  'checks.metaFields': HEALTH_CHECK,
  'checks.timeFilter': HEALTH_CHECK,
  'checks.maxBuckets': HEALTH_CHECK,
  timeout: GENERAL,
  'api.selector': GENERAL,
  'ip.selector': GENERAL,
  'ip.ignore': GENERAL,
  'portal9.monitoring.enabled': MONITORING,
  'portal9.monitoring.frequency': MONITORING,
  'portal9.monitoring.shards': MONITORING,
  'portal9.monitoring.replicas': MONITORING,
  'portal9.monitoring.creation': MONITORING,
  'portal9.monitoring.pattern': MONITORING,
  hideManagerAlerts: GENERAL,
  'logs.level': GENERAL,
  'enrollment.dns': GENERAL,
  'cron.prefix': GENERAL,
  'cron.statistics.status': STATISTICS,
  'cron.statistics.apis': STATISTICS,
  'cron.statistics.interval': STATISTICS,
  'cron.statistics.index.name': STATISTICS,
  'cron.statistics.index.creation': STATISTICS,
  'cron.statistics.index.shards': STATISTICS,
  'cron.statistics.index.replicas': STATISTICS,
  'alerts.sample.prefix': GENERAL,
}

const TEXT = 'text';
const NUMBER = 'number';
const LIST = 'list';
const BOOLEAN = 'boolean';
const ARRAY = 'array';
const INTERVAL = 'interval'

export const formEquivalence = {
  pattern: { type: TEXT },
  'customization.logo.app': { type: TEXT },
  'customization.logo.sidebar': { type: TEXT },
  'customization.logo.healthcheck': { type: TEXT },
  'customization.logo.reports': { type: TEXT },
  'checks.pattern': { type: BOOLEAN },
  'checks.template': { type: BOOLEAN },
  'checks.api': { type: BOOLEAN },
  'checks.setup': { type: BOOLEAN },
  'checks.fields': { type: BOOLEAN },
  'checks.metaFields': { type: BOOLEAN },
  'checks.timeFilter': { type: BOOLEAN },
  'checks.maxBuckets': { type: BOOLEAN },
  timeout: { type: NUMBER },
  'api.selector': { type: BOOLEAN },
  'ip.selector': { type: BOOLEAN },
  'ip.ignore': { type: ARRAY },
  'xpack.rbac.enabled': { type: BOOLEAN },
  'portal9.monitoring.enabled': { type: BOOLEAN },
  'portal9.monitoring.frequency': { type: NUMBER },
  'portal9.monitoring.shards': { type: NUMBER },
  'portal9.monitoring.replicas': { type: NUMBER },
  'portal9.monitoring.creation': {
    type: LIST, params: {
      options: [
        { text: 'Hourly', value: 'h' },
        { text: 'Daily', value: 'd' },
        { text: 'Weekly', value: 'w' },
        { text: 'Monthly', value: 'm' },
      ]
    }
  },
  'portal9.monitoring.pattern': { type: TEXT },
  hideManagerAlerts: { type: BOOLEAN },
  'logs.level': {
    type: LIST, params: {
      options: [
        { text: 'Info', value: 'info' },
        { text: 'Debug', value: 'debug' },
      ]
    }
  },
  'enrollment.dns': { type: TEXT },
  'cron.prefix': { type: TEXT },
  'cron.statistics.status': { type: BOOLEAN },
  'cron.statistics.apis': { type: ARRAY },
  'cron.statistics.interval': { type: INTERVAL },
  'cron.statistics.index.name': { type: TEXT },
  'cron.statistics.index.creation': {
    type: LIST, params: {
      options: [
        { text: 'Hourly', value: 'h' },
        { text: 'Daily', value: 'd' },
        { text: 'Weekly', value: 'w' },
        { text: 'Monthly', value: 'm' },
      ]
    }
  },
  'cron.statistics.index.shards': { type: NUMBER },
  'cron.statistics.index.replicas': { type: NUMBER },
  'alerts.sample.prefix': { type: TEXT },
}
