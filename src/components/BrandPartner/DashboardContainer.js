import React from 'react';

import { useSelector } from 'react-redux';

import AdManagerAdminContainer from './AdManagerAdminDashboard/AdManagerAdminContainer';
import FinanceDashboardContainer from './FinanceDashboard/FinanceDashboardContainer';
import { BrandPartnerDashboard } from '../../theme/Global';

const _ = require('lodash');

function DashboardContainer() {
  const userInfo = useSelector((state) => state.userState.userInfo);

  const dashboardHeaders = {
    'Ad Manager Admin': 'Advertising Dashboard',
    'Sponsored Advertising Ad Manager': 'Ad Manager Dashboard',
    'DSP Ad Manager': 'Ad Manager Dashboard',
    'Hybrid Ad Manager': 'Ad Manager Dashboard',
    BGS: 'Dashboard',
    'BGS Manager': 'Dashboard',
    'BGS Admin': 'Dashboard',
    Finance: 'Dashboard',
  };

  const dashboardRole = {
    'Ad Manager Admin': '',
    'Sponsored Advertising Ad Manager': '',
    'DSP Ad Manager': '',
    'Hybrid Ad Manager': '',
    'BGS Manager': '',
    'BGS Admin': '',
    BGS: '',
  };

  const displayHeader = () => {
    return (
      <>
        <div className="dashboard-header-sticky">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-12">
                <p className="black-heading-title ml-1 pt-1">
                  {dashboardHeaders[userInfo?.role]}
                </p>
              </div>
              <div className="straight-line horizontal-line  d-lg-none d-md-block" />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <BrandPartnerDashboard>
      {displayHeader()}

      {_.has(dashboardRole, userInfo?.role) ? (
        <AdManagerAdminContainer userInfo={userInfo} />
      ) : null}

      {userInfo?.role?.includes('Finance') ? (
        <FinanceDashboardContainer />
      ) : null}
    </BrandPartnerDashboard>
  );
}

export default DashboardContainer;
