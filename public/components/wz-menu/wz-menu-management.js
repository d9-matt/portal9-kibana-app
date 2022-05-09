/*
 * Portal9 app - React component for registering agents.
 * Copyright (C) 2015-2021 Portal9, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React, { Component } from 'react';
import { EuiFlexItem, EuiFlexGroup, EuiSideNav, EuiIcon, EuiButtonEmpty, EuiToolTip } from '@elastic/eui';
import { WzRequest } from '../../react-services/wz-request';
import { connect } from 'react-redux';
import { AppNavigate } from '../../react-services/app-navigate'
import { PORTAL9_MENU_MANAGEMENT_SECTIONS_ID } from '../../../common/constants';
import { PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID } from '../../../common/wazu-menu/wz-menu-management.cy';

class WzMenuManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: Fix the selected section
      selectedItemName: null
    };

    this.managementSections = {
      management: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.MANAGEMENT,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.MANAGEMENT,
        text: 'Management',
      },
      administration: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.ADMINISTRATION,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.ADMINISTRATION,
        text: 'Administration',
      },
      ruleset: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.RULESET,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.RULESET,
        text: 'Ruleset',
      },
      rules: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.RULES,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.RULES,
        text: 'Rules',
      },
      decoders: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.DECODERS,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.DECODERS,
        text: 'Decoders',
      },
      lists: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.CDB_LISTS,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.CDB_LISTS,
        text: 'CDB lists',
      },
      groups: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.GROUPS,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.GROUPS,
        text: 'Groups',
      },
      configuration: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.CONFIGURATION,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.CONFIGURATION,
        text: 'Configuration',
      },
      statusReports: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.STATUS_AND_REPORTS,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.STATUS_AND_REPORTS,
        text: 'Status and reports',
      },
      status: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.STATUS,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.STATUS,
        text: 'Status',
      },
      cluster: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.CLUSTER,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.CLUSTER,
        text: 'Cluster',
      },
      logs: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.LOGS,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.LOGS,
        text: 'Logs',
      },
      reporting: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.REPORTING,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.REPORTING,
        text: 'Reporting',
      },
      statistics: {
        id: PORTAL9_MENU_MANAGEMENT_SECTIONS_ID.STATISTICS,
        cyTestId: PORTAL9_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.STATISTICS,
        text: 'Statistics',
      },
    };

    this.paths = {
      rules: '/rules',
      decoders: '/decoders',
      lists: '/lists/files'
    };

    this.wzReq = WzRequest;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.section !== this.state.selectedItemName) {
      this.setState({ selectedItemName: nextProps.section });
    }
  }

  clickMenuItem = (ev, section) => {
    this.props.closePopover();
    AppNavigate.navigateToModule(ev, 'manager', { tab: section })
  };

  createItem = (item, data = {}) => {
    // NOTE: Duplicate `name` values will cause `id` collisions.
    return {
      ...data,
      id: item.id,
      name: item.text,
      'data-test-subj': item.cyTestId,
      isSelected: this.props.state.section === item.id,
      onClick: () => { },
      onMouseDown: (ev) => this.clickMenuItem(ev, item.id)
    };
  };

  render() {
    const sideNavAdmin = [
      {
        name: this.managementSections.administration.text,
        id: this.managementSections.administration.id,
        id: 0,
        disabled: false,
        icon: <EuiIcon type="managementApp" color="primary" />,
        items: [
          this.createItem(this.managementSections.rules),
          this.createItem(this.managementSections.decoders),
          this.createItem(this.managementSections.lists),
          this.createItem(this.managementSections.groups),
          this.createItem(this.managementSections.configuration),
        ],
      }
    ];

    const sideNavStatus = [
      {
        name: this.managementSections.statusReports.text,
        id: this.managementSections.statusReports.id,
        disabled: false,
        icon: <EuiIcon type="reportingApp" color="primary" />,
        items: [
          this.createItem(this.managementSections.status),
          this.createItem(this.managementSections.cluster),
          this.createItem(this.managementSections.statistics),
          this.createItem(this.managementSections.logs),
          this.createItem(this.managementSections.reporting)
        ]
      }
    ];

    return (
      <div className="WzManagementSideMenu">
        <EuiFlexGroup>
          <EuiFlexItem grow={false} style={{ marginLeft: 14 }}>
            <EuiButtonEmpty iconType="apps"
              onClick={() => {
                this.props.closePopover();
                window.location.href = '#/manager';
              }}>
              Management directory
              </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiSideNav items={sideNavAdmin} style={{ padding: '4px 12px' }} />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiSideNav items={sideNavStatus} style={{ padding: '4px 12px' }} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.rulesetReducers,
  };
};

export default connect(
  mapStateToProps,
)(WzMenuManagement);
