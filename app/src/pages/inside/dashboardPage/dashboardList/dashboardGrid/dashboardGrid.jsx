import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { DASHBOARD_PAGE_EVENTS } from 'components/main/analytics/events';
import { DashboardGridList } from './dashboardGridList';

const messages = defineMessages({
  myDashboards: {
    id: 'DashboardGrid.myDashboards',
    defaultMessage: 'My Dashboards',
  },
  sharedDashboards: {
    id: 'DashboardGrid.sharedDashboards',
    defaultMessage: 'Shared Dashboards',
  },
});

@injectIntl
export class DashboardGrid extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    dashboardItems: PropTypes.array,
  };

  static defaultProps = {
    dashboardItems: [],
  };

  render() {
    const { dashboardItems, intl, ...rest } = this.props;
    const {
      userInfo: { userId },
    } = rest;
    const userDashboards = dashboardItems.filter((item) => item.owner === userId);
    const sharedDashboards = dashboardItems.filter((item) => item.owner !== userId);

    return (
      <Fragment>
        <DashboardGridList
          name={intl.formatMessage(messages.myDashboards)}
          dashboardList={userDashboards}
          userDashboards
          nameEventInfo={DASHBOARD_PAGE_EVENTS.DASHBOARD_NAME_CLICK}
          {...rest}
        />
        <DashboardGridList
          name={intl.formatMessage(messages.sharedDashboards)}
          dashboardList={sharedDashboards}
          userDashboards={false}
          nameEventInfo={DASHBOARD_PAGE_EVENTS.SHARED_DASHBOARD_NAME}
          {...rest}
        />
      </Fragment>
    );
  }
}
