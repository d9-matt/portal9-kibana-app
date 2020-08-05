/*
 * Wazuh app - User Roles services
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
*/

import axios from 'axios';
import chrome from 'ui/chrome';
import { AppState } from './app-state';
import { ApiCheck } from './wz-api-check';
import { WzMisc } from '../factories/misc';
import { WazuhConfig } from './wazuh-config';

export class wzUserRoles {
  /**
   * Permorn a generic request
   * @param {String} method
   * @param {String} path
   * @param {Object} payload
   */
  static async genericReq(method, path, payload = null, customTimeout = false) {
    try {
      if (!method || !path) {
        throw new Error('Missing parameters');
      }
      this.wazuhConfig = new WazuhConfig();
      const configuration = this.wazuhConfig.getConfig();
      const timeout = configuration ? configuration.timeout : 20000;

      const url = chrome.addBasePath(path);
      const options = {
        method: method,
        headers: { 'Content-Type': 'application/json', 'kbn-xsrf': 'kibana' },
        url: url,
        data: payload,
        timeout: customTimeout || timeout
      };
      const data = await axios(options);
      if (data.error) {
        throw new Error(data.error);
      }
      return Promise.resolve(data);
    } catch (err) {
      //if the requests fails, we need to check if the API is down
      const currentApi = JSON.parse(AppState.getCurrentAPI() || '{}');
      if (currentApi && currentApi.id) {
        try {
          await ApiCheck.checkStored(currentApi.id);
        } catch (err) {
          const wzMisc = new WzMisc();
          wzMisc.setApiIsDown(true);

          if (!window.location.hash.includes('#/settings')) {
            window.location.href = '/app/wazuh#/health-check';
          }
          return;
        }
      }
      const errorMessage = (err && err.response && err.response.data && err.response.data.message) || (err || {}).message;
      return errorMessage
        ? Promise.reject(errorMessage)
        : Promise.reject(err || 'Server did not respond');
    }
  }

  /* TODO: Check when we use token in requests and add redux */
  static async getUserRoles() {
    try {
      const data = await this.genericReq('GET', '/v4/security/users/me');
      return Promise.resolve(data);
    } catch (error) {
      return ((error || {}).data || {}).message || false
        ? Promise.reject(error.data.message)
        : Promise.reject(error.message || error);
    }
  }

  static checkMissingUserRoles(requiredRoles, userRoles) {
    let filtered;
    if (typeof requiredRoles === 'string') {
      return requiredRoles === userRoles.name ? false : filtered = requiredRoles;
    } else if (Array.isArray(requiredRoles)) {
      const rolesUserNotOwn = requiredRoles.filter(requiredRole => !userRoles.includes(requiredRole));
      return rolesUserNotOwn.length ? rolesUserNotOwn : false;
    }
  }
}