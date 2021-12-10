import React, { useState, useEffect, useCallback } from 'react';

import PropTypes, { string } from 'prop-types';

import DSPDashboard from './DSPDashboard/DSPDashboard';
import SponsoredDashboard from './SponsoredDashboard/SponsoredDashboard';
import SalesDashboard from './SalesDashboard/SalesDashboard';
import { Tabs } from '../../../common';
import { DashboardCard } from '../../../theme/Global';
import { getMarketPlaceList } from '../../../api';
import BGSComissionContainer from './BGSComission/BGSComissionContainer';

export default function AdManagerAdminContainer({ userInfo }) {
  const [viewComponent, setViewComponent] = useState('comissions');
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

      case 'comissions':
        return <BGSComissionContainer userInfo={userInfo} />;

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
            <li
              className={viewComponent === 'sales' ? 'active' : ''}
              onClick={() => setViewComponent('sales')}
              role="presentation">
              Sales
            </li>
            <li
              className={viewComponent === 'sponsored' ? 'active' : ''}
              onClick={() => setViewComponent('sponsored')}
              role="presentation">
              Sponsored Advertising
            </li>
            <li
              className={viewComponent === 'dsp' ? 'active' : ''}
              onClick={() => setViewComponent('dsp')}
              role="presentation">
              DSP Advertising
            </li>

            {userInfo && userInfo.role === 'BGS Admin' ? (
              <li
                className={viewComponent === 'comissions' ? 'active' : ''}
                onClick={() => setViewComponent('comissions')}
                role="presentation">
                Comissions
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
