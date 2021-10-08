/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react';

import PropTypes, { string } from 'prop-types';

import DSPDashboard from './DSPDashboard/DSPDashboard';
import SponsoredDashboard from './SponsoredDashboard/SponsoredDashboard';
import SalesDashboard from './SalesDashboard/SalesDashboard';
import { Tabs } from '../../../common';
import { DashboardCard } from '../../../theme/Global';
import { getMarketPlaceList } from '../../../api';

export default function AdManagerAdminContainer({ userInfo }) {
  const setTab = () => {
    let flag = '';
    if (
      userInfo &&
      (userInfo.role === 'Ad Manager Admin' ||
        userInfo.role === 'Sponsored Advertising Ad Manager' ||
        userInfo.role === 'Hybrid Ad Manager')
    ) {
      flag = 'sponsored';
    } else if (userInfo && userInfo.role === 'DSP Ad Manager') {
      flag = 'dsp';
    } else if (
      userInfo &&
      (userInfo.role === 'BGS' || userInfo.role === 'BGS Manager')
    ) {
      flag = 'sales';
    }
    return flag;
  };

  const [viewComponent, setViewComponent] = useState(setTab);
  const [marketplaceChoices, setMarketplaceChoices] = useState([]);
  const getMarketPlace = useCallback(() => {
    getMarketPlaceList().then((res) => {
      if (res && res.data && res.data.length) {
        const list = [
          {
            name: 'all',
            country: 'All Marketplaces',
            currency: 'USD',
          },
        ];

        for (const marketplace of res.data) {
          list.push(marketplace);
          setMarketplaceChoices(list);
        }
      }
    });
  }, []);

  useEffect(() => {
    getMarketPlace();
  }, [getMarketPlace]);

  const renderComponent = () => {
    switch (viewComponent) {
      case 'sales':
        return (
          <SalesDashboard
            marketplaceChoices={marketplaceChoices}
            userInfo={userInfo}
          />
        );

      case 'sponsored':
        return (
          <SponsoredDashboard
            marketplaceChoices={marketplaceChoices}
            userInfo={userInfo}
          />
        );

      case 'dsp':
        return (
          <DSPDashboard
            marketplaceChoices={marketplaceChoices}
            userInfo={userInfo}
          />
        );

      default:
        return '';
    }
  };
  return (
    <DashboardCard className="ad-manager-dashboard">
      <div className="dashboard-container-body">
        {' '}
        <Tabs>
          <ul className="tabs">
            {userInfo.role === 'BGS' || userInfo.role === 'BGS Manager' ? (
              <li
                className={viewComponent === 'sales' ? 'active' : ''}
                onClick={() => setViewComponent('sales')}
                role="presentation">
                Sales
              </li>
            ) : null}

            {userInfo.role === 'Sponsored Advertising Ad Manager' ||
            userInfo.role === 'Ad Manager Admin' ||
            userInfo.role === 'Hybrid Ad Manager' ? (
              <li
                className={viewComponent === 'sponsored' ? 'active' : ''}
                onClick={() => setViewComponent('sponsored')}
                role="presentation">
                Sponsored Advertising
              </li>
            ) : null}
            {userInfo.role === 'DSP Ad Manager' ||
            userInfo.role === 'Ad Manager Admin' ||
            userInfo.role === 'Hybrid Ad Manager' ? (
              <li
                className={viewComponent === 'dsp' ? 'active' : ''}
                onClick={() => setViewComponent('dsp')}
                role="presentation">
                DSP Advertising
              </li>
            ) : null}
          </ul>
        </Tabs>
        {renderComponent(viewComponent)}
      </div>
    </DashboardCard>
  );
}

AdManagerAdminContainer.defaultProps = {
  userInfo: {},
};
AdManagerAdminContainer.propTypes = {
  userInfo: PropTypes.shape({
    role: string,
  }),
};
