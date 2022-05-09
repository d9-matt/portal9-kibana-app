/*
 * Portal9 app - Reporting handler service
 * Copyright (C) 2015-2021 Portal9, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import { WzRequest } from '../../../../../../react-services/wz-request';

export default class ReportingHandler {
  /**
   * Get list reports
   * @param {String} name
   */
  static async listReports() {
    try {
      const result = await WzRequest.genericReq('GET', '/reports', {});
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Delete report
   * @param {String} name
   */
  static async deleteReport(name) {
    try {
      const result = await WzRequest.genericReq(
        'DELETE',
        `/reports/${name}`,
        {}
      );
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
