/*
 * Portal9 app - React component for building the Overview welcome screen.
 *
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
import {
  EuiTitle,
  EuiBadge,
  EuiToolTip
} from '@elastic/eui';
import { updateGlobalBreadcrumb } from '../../../redux/actions/globalBreadcrumbActions';
import { updateCurrentTab } from '../../../redux/actions/appStateActions';
import store from '../../../redux/store';
import { connect } from 'react-redux';
import { PORTAL9_MODULES } from '../../../../common/portal9-modules';
import { AppNavigate } from '../../../react-services/app-navigate';

class WzCurrentOverviewSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  getBadgeColor(agentStatus){
    if (agentStatus.toLowerCase() === 'active') { return 'secondary'; }
    else if (agentStatus.toLowerCase() === 'disconnected') { return '#BD271E'; }
    else if (agentStatus.toLowerCase() === 'never connected') { return 'default'; }
  }

  setGlobalBreadcrumb() {
    const currentAgent = store.getState().appStateReducers.currentAgentData;

    if(PORTAL9_MODULES[this.props.currentTab]){
      const breadcrumb = currentAgent.id ? [
        { text: '' },
        { text: 'Modules', href: '#/overview' },
        { agent: currentAgent },
        { text: PORTAL9_MODULES[this.props.currentTab].title},
      ] :
      [
        { text: '' },
        { text: 'Modules', href: '#/overview' },
        
        
        { text: PORTAL9_MODULES[this.props.currentTab].title},
      ];
      store.dispatch(updateGlobalBreadcrumb(breadcrumb));
      $('#breadcrumbNoTitle').attr("title","");
    }
  }

  componentDidMount() {
    this.setGlobalBreadcrumb();
    store.dispatch(updateCurrentTab(this.props.currentTab));
  }


  async componentDidUpdate() {
    if(this.props.state.currentTab !== this.props.currentTab){
      const forceUpdate = this.props.tabView === 'discover';
      if(this.props.state.currentTab) this.props.switchTab(this.props.state.currentTab,forceUpdate);
    }
    this.setGlobalBreadcrumb();
  }
  
  componentWillUnmount(){
    store.dispatch(updateCurrentTab("")); 
  }

  render() {
    return (
      <span>
      {/*this.props.currentTab && PORTAL9_MODULES[this.props.currentTab] && PORTAL9_MODULES[this.props.currentTab].title && (
      <EuiTitle size='s'>
        <h2>
          {PORTAL9_MODULES[this.props.currentTab].title}
       </h2>
      </EuiTitle>)*/}
        </span>
    );
  }
}



const mapStateToProps = state => {
  return {
    state: state.appStateReducers,
  };
};

export default connect(mapStateToProps, null)(WzCurrentOverviewSection);