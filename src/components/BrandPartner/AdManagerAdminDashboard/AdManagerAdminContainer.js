import React, { useState, useEffect, useCallback, useRef } from 'react';

import { string, shape } from 'prop-types';

import DSPDashboard from './DSPDashboard/DSPDashboard';
import SponsoredDashboard from './SponsoredDashboard/SponsoredDashboard';
import SalesDashboard from './SalesDashboard/SalesDashboard';
import BGSCommissionContainer from './BGSCommission/BGSCommissionContainer';
import { Tabs } from '../../../common';
import { DashboardCard } from '../../../theme/Global';
import { getMarketPlaceList } from '../../../api';

export default function AdManagerAdminContainer({ userInfo }) {
  const mounted = useRef(false);
  const [viewComponent, setViewComponent] = useState('sales');
  const [marketplaceChoices, setMarketplaceChoices] = useState([]);
  const getMarketPlace = useCallback(() => {
    getMarketPlaceList().then((res) => {
      if (mounted.current) {
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
      }
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    getMarketPlace();
    return () => {
      mounted.current = false;
    };
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

      case 'commissions':
        return <BGSCommissionContainer userInfo={userInfo} />;

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

            {/* {userInfo && userInfo.role === 'BGS Admin' ? (
              <li
                className={viewComponent === 'commissions' ? 'active' : ''}
                onClick={() => setViewComponent('commissions')}
                role="presentation">
                Commissions
              </li>
            ) : null} */}
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
  userInfo: shape({
    role: string.isRequired,
  }),
};
