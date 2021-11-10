/* eslint no-else-return: "off" */

import React, { useEffect } from 'react';

import queryString from 'query-string';
import { useIdleTimer } from 'react-idle-timer';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import LeftSideBar from './LeftSideBar';
import CustomerMainContainer from '../components/Customer/CustomerDetailView/CustomerMainContainer';
import { userMe } from '../store/actions/index';
import { Summary } from '../components/OnBoardingCustomer';
import { clearToken } from '../store/actions/userState';
import { ContractContainer } from '../components/Contract';
import { PageLoader, PageNotFound } from './index';
import { ArticleDetails, ArticleList } from '../components/KnowledgeBase';
import {
  CustomerListTablet,
  ProductDelegation,
  CustomerList,
} from '../components/Customer';
import { DashboardContainer } from '../components/BrandPartner';
import {
  BrandAssetSummary,
  BrandAssetUpload,
  DelegationUpload,
  BrandAssetsPreview,
} from '../components/BrandAssetGathering';
import {
  PATH_CUSTOMER_LIST,
  PATH_LOGIN,
  PATH_CUSTOMER_DETAILS,
  PATH_AGREEMENT,
  PATH_PAUSE_AGREEMENT,
  PATH_ROOT,
  PATH_ARTICLE_LIST,
  PATH_ARTICLE_DETAILS,
  PATH_CUSTOMER_LIST_TABLET,
  PATH_BGS_MANAGER_DASHBOARD,
  PATH_BGS_DASHBOARD,
  PATH_SUMMARY,
  PATH_SPONSORED_DASHBOARD,
  PATH_CHOOSE_BRAND_DELEGATE,
  PATH_BRAND_ASSET,
  PATH_BRAND_ASSET_SUMMARY,
  PATH_BRAND_ASSET_PREVIEW,
  PATH_DSP_DASHBOARD,
  PATH_HYBRID_DASHBOARD,
  PATH_UPLOAD_PRODUCT_ASSET,
  PATH_AD_MANAGER_ADMIN_DASHBOARD,
  PATH_FINANCE_DASHBOARD,
} from '../constants/index';

const _ = require('lodash');

export default function AuthenticationComponent() {
  const isAuthenticated = useSelector(
    (state) => state.userState.isAuthenticated,
  );
  const userInfo = useSelector((state) => state.userState.userInfo);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleOnIdle = () => {
    dispatch(clearToken());
  };

  useIdleTimer({
    timeout: 1800000,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  useEffect(() => {
    if (
      isAuthenticated &&
      Object.keys(userInfo).length > 0 &&
      history.location.pathname === PATH_ROOT
    ) {
      history.push(PATH_CUSTOMER_LIST);
    }
  }, [history, isAuthenticated, userInfo]);

  const generateHeader = () => {
    if (history.location.pathname.includes('account-setup')) return '';
    if (history.location.pathname.includes('agreement')) return '';
    if (userInfo && userInfo.role === 'Customer')
      return <Header userInfo={userInfo} />;
    if (
      !history.location.pathname.includes('account-setup') &&
      userInfo &&
      userInfo.role !== 'Customer' &&
      !history.location.pathname.includes('/brand-asset/')
    )
      return (
        <>
          <div className="common-header-sticky">
            <Header userInfo={userInfo} />
          </div>

          <LeftSideBar userInfo={userInfo} />
        </>
      );
    return '';
  };

  const dashboardRolePaths = {
    'Ad Manager Admin': PATH_AD_MANAGER_ADMIN_DASHBOARD,
    'Sponsored Advertising Ad Manager': PATH_SPONSORED_DASHBOARD,
    'DSP Ad Manager': PATH_DSP_DASHBOARD,
    'Hybrid Ad Manager': PATH_HYBRID_DASHBOARD,
    'BGS Manager': PATH_BGS_MANAGER_DASHBOARD,
    BGS: PATH_BGS_DASHBOARD,
    Finance: PATH_FINANCE_DASHBOARD,
  };

  if (isAuthenticated && Object.keys(userInfo).length > 0) {
    return (
      <>
        {generateHeader()}
        <Switch>
          {/* Customer */}
          {userInfo && userInfo.role !== 'Customer' ? (
            <Route path={PATH_CUSTOMER_LIST} exact component={CustomerList} />
          ) : (
            ''
          )}
          <Route
            path={PATH_CUSTOMER_LIST_TABLET}
            component={CustomerListTablet}
          />
          <Route
            path={PATH_CUSTOMER_DETAILS}
            exact
            component={CustomerMainContainer}
          />
          {/* Contract */}
          <Route path={PATH_AGREEMENT} exact component={ContractContainer} />
          <Route
            path={PATH_PAUSE_AGREEMENT}
            exact
            component={ContractContainer}
          />

          {/* Account Setup */}
          {/* Knowledge Base  */}
          {userInfo && userInfo.role !== 'Customer' ? (
            <Route path={PATH_ARTICLE_LIST} exact component={ArticleList} />
          ) : (
            ''
          )}
          {userInfo && userInfo.role !== 'Customer' ? (
            <Route path={PATH_ARTICLE_DETAILS} component={ArticleDetails} />
          ) : (
            ''
          )}

          {/* AD MANAGER DASHBOARD, BGS DASHBOARD, FINANCE DASHBOARD PATH */}
          {_.has(dashboardRolePaths, userInfo && userInfo.role) ? (
            <Route
              path={dashboardRolePaths[userInfo.role]}
              component={DashboardContainer}
            />
          ) : null}

          {/* 
          <Route path={PATH_TEAM_MEMBER} component={TeamMember} />
          <Route path={PATH_TABLET_TEAM_MEMBER} component={TabletTeamMember} /> */}

          {/* On-Boarding Customer */}
          <Route path={PATH_SUMMARY} component={Summary} />
          {/* Brand Assets */}
          <Route
            path={PATH_CHOOSE_BRAND_DELEGATE}
            component={DelegationUpload}
          />
          <Route path={PATH_BRAND_ASSET} component={BrandAssetUpload} />
          <Route
            path={PATH_BRAND_ASSET_SUMMARY}
            component={BrandAssetSummary}
          />
          <Route
            path={PATH_BRAND_ASSET_PREVIEW}
            component={BrandAssetsPreview}
          />

          <Route
            path={PATH_UPLOAD_PRODUCT_ASSET}
            component={ProductDelegation}
          />
          <Route component={PageNotFound} />
          {/* Brand Asset Gathering */}
          {/* <Route path={PATH_UPLOAD_DELEGATION} component={UploadDelegation} /> */}
        </Switch>
      </>
    );
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(userMe(history));
      return <PageLoader color="#FF5933" type="page" />;
    } else {
      let stringified = '';
      if (history.location.pathname !== '/') {
        stringified = queryString.stringify({
          callback: history.location.pathname + history.location.search,
        });
      }
      return (
        <Redirect
          to={{
            pathname: PATH_LOGIN,
            search: `${stringified}`,
          }}
        />
      );
    }
  }
}
