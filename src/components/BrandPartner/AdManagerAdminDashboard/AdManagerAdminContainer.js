/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useEffect, useCallback } from 'react';

import { Tabs } from '../../../common';
import { DashboardCard } from '../../../theme/Global';
import DSPDashboard from './DSPDashboard/DSPDashboard';
import SponsoredDashboard from './SponsoredDashboard/SponsoredDashboard';
import { getMarketPlaceList } from '../../../api';

export default function AdManagerAdminContainer() {
  const [viewComponent, setViewComponent] = useState('sponsored');

  const [marketplaceChoices, setMarketplaceChoices] = useState([]);

  const getMarketPlace = useCallback(() => {
    getMarketPlaceList().then((res) => {
      if (res && res.data && res.data.length) {
        const list = [
          {
            value: 'all',
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
  return (
    <DashboardCard className="ad-manager-dashboard">
      <div className="dashboard-container-body">
        {' '}
        <Tabs>
          <ul className="tabs">
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
          </ul>
        </Tabs>
        {viewComponent === 'sponsored' ? (
          <SponsoredDashboard marketplaceChoices={marketplaceChoices} />
        ) : (
          <DSPDashboard marketplaceChoices={marketplaceChoices} />
        )}
      </div>
    </DashboardCard>
  );
}
