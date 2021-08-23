/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes, { string } from 'prop-types';

import { Tabs } from '../../../common';
import { DashboardCard } from '../../../theme/Global';
import DSPDashboard from './DSPDashboard/DSPDashboard';
import SponsoredDashboard from './SponsoredDashboard/SponsoredDashboard';
import { getMarketPlaceList } from '../../../api';

export default function AdManagerAdminContainer({ userInfo }) {
  const setTab =
    userInfo &&
    (userInfo.role === 'Ad Manager Admin' ||
      userInfo.role === 'Sponsored Advertising Ad Manager' ||
      userInfo.role === 'Hybrid Ad Manager')
      ? 'sponsored'
      : 'dsp';
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
  return (
    <DashboardCard className="ad-manager-dashboard">
      <div className="dashboard-container-body">
        {' '}
        <Tabs>
          <ul className="tabs">
            {userInfo.role !== 'DSP Ad Manager' ? (
              <li
                className={viewComponent === 'sponsored' ? 'active' : ''}
                onClick={() => setViewComponent('sponsored')}
                role="presentation">
                Sponsored Advertising
              </li>
            ) : null}
            {userInfo.role !== 'Sponsored Advertising Ad Manager' ? (
              <li
                className={viewComponent === 'dsp' ? 'active' : ''}
                onClick={() => setViewComponent('dsp')}
                role="presentation">
                DSP Advertising
              </li>
            ) : null}
          </ul>
        </Tabs>
        {viewComponent === 'sponsored' ? (
          <SponsoredDashboard
            marketplaceChoices={marketplaceChoices}
            userInfo={userInfo}
          />
        ) : (
          <DSPDashboard
            marketplaceChoices={marketplaceChoices}
            userInfo={userInfo}
          />
        )}
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
