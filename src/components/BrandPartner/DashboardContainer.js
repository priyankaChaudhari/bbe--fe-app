import React from 'react';

import { useSelector } from 'react-redux';

import AdManagerAdminContainer from './AdManagerAdminDashboard/AdManagerAdminContainer';
import FinanceDashboardContainer from './FinanceDashboard/FinanceDashboardContainer';
import { BrandPartnerDashboard } from '../../theme/Global';
import { GlobalNavbar } from '../../common';

const _ = require('lodash');

function DashboardContainer() {
  const userInfo = useSelector((state) => state.userState.userInfo);

  // const dashboardHeaders = {
  //   'Ad Manager': 'Ad Manager Dashboard',
  //   'Ad Manager Admin': 'Advertising Dashboard',
  //   BGS: 'Dashboard',
  //   'BGS Manager': 'Dashboard',
  //   'BGS Admin': 'Dashboard',
  //   Finance: 'Dashboard',
  // };

  const dashboardRole = {
    'Ad Manager': '',
    'Ad Manager Admin': '',
    'BGS Manager': '',
    'BGS Admin': '',
    BGS: '',
  };

  const displayHeader = () => {
    return (
      <>
        {/* <div className="dashboard-header-sticky">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-12">
                <p className="black-heading-title ml-1 pt-1">
                  {dashboardHeaders[userInfo?.role]}
                </p>
              </div>
              <div className="straight-line horizontal-line  d-lg-none d-md-block" />
            </div>
            <div className="straight-line horizontal-line  d-lg-none d-md-block" />
          </div>
        </div> */}
      </>
    );
  };

  return (
    <>
      <GlobalNavbar />
      <BrandPartnerDashboard>
        {displayHeader()}

        {_.has(dashboardRole, userInfo?.role) ? (
          <AdManagerAdminContainer userInfo={userInfo} />
        ) : null}

        {userInfo?.role?.includes('Finance') ? (
          <FinanceDashboardContainer />
        ) : null}
      </BrandPartnerDashboard>
    </>
  );
}

export default DashboardContainer;
