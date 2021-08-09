/* eslint no-else-return: "off" */

import React, { useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import queryString from 'query-string';

import { userMe } from '../store/actions/index';
import {
  PATH_CUSTOMER_LIST,
  PATH_LOGIN,
  PATH_CUSTOMER_DETAILS,
  PATH_AGREEMENT,
  PATH_STATEMENT,
  PATH_ADDENDUM,
  PATH_ROOT,
  PATH_ONE_TIME_AGREEMENT,
  PATH_SERVICE_AMENDMENT,
  PATH_DSP_ADDENDUM,
  PATH_ARTICLE_LIST,
  PATH_ARTICLE_DETAILS,
  PATH_CUSTOMER_LIST_TABLET,
  PATH_BGS_DASHBOARD,
  PATH_TEAM_MEMBER,
  PATH_TABLET_TEAM_MEMBER,
  PATH_SUMMARY,
  PATH_ADM_DASHBOARD,
  PATH_CHOOSE_BRAND_DELEGATE,
  PATH_BRAND_ASSET,
  PATH_BRAND_ASSET_SUMMARY,
  PATH_BRAND_ASSET_PREVIEW,
  PATH_DSP_DASHBOARD,
  PATH_HYBRID_DASHBOARD,
  PATH_UPLOAD_PRODUCT_ASSET,
  PATH_AD_MANAGER_ADMIN_DASHBOARD,
} from '../constants/index';

import { CustomerListTablet, ProductDelegation } from '../components/Customer';

import { PageLoader, PageNotFound } from './index';
import Header from './Header';
import LeftSideBar from './LeftSideBar';
import { ContractContainer } from '../components/Contract';
import { ArticleDetails, ArticleList } from '../components/Knowledge Base';
import CustomerMainContainer from '../components/Customer/CustomerMainContainer';
import NewCustomerList from '../components/Customer/NewCustomerList';
import {
  // Dashboard,
  TeamMember,
  TabletTeamMember,
  // AdManagerDashboard,
  DashboardContainer,
} from '../components/BrandPartner';
import { Summary } from '../components/OnBoardingCustomer';
import {
  BrandAssetSummary,
  BrandAssetUpload,
  DelegationUpload,
  BrandAssetsPreview,
} from '../components/BrandAssetGathering';

export default function AuthenticationComponent() {
  const isAuthenticated = useSelector(
    (state) => state.userState.isAuthenticated,
  );
  const userInfo = useSelector((state) => state.userState.userInfo);
  const dispatch = useDispatch();
  const history = useHistory();

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

  if (isAuthenticated && Object.keys(userInfo).length > 0) {
    return (
      <>
        {generateHeader()}
        <Switch>
          {/* Customer */}
          {userInfo && userInfo.role !== 'Customer' ? (
            <Route
              path={PATH_CUSTOMER_LIST}
              exact
              component={NewCustomerList}
            />
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
          <Route path={PATH_STATEMENT} exact component={ContractContainer} />
          <Route path={PATH_ADDENDUM} exact component={ContractContainer} />
          <Route path={PATH_ONE_TIME_AGREEMENT} component={ContractContainer} />
          <Route path={PATH_SERVICE_AMENDMENT} component={ContractContainer} />
          <Route path={PATH_DSP_ADDENDUM} component={ContractContainer} />
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
          {/* Brand Partner */}
          {(userInfo && userInfo.role === 'Growth Strategist') ||
          (userInfo && userInfo.role === 'BGS') ||
          (userInfo && userInfo.role === 'BGS Manager') ? (
            <Route path={PATH_BGS_DASHBOARD} component={DashboardContainer} />
          ) : (
            ''
          )}
          {(userInfo && userInfo.role === 'Sponsored Advertising Ad Manager') ||
          (userInfo && userInfo.role === 'Ad Manager') ? (
            <Route path={PATH_ADM_DASHBOARD} component={DashboardContainer} />
          ) : (
            ''
          )}
          {userInfo && userInfo.role === 'DSP Ad Manager' ? (
            <Route path={PATH_DSP_DASHBOARD} component={DashboardContainer} />
          ) : (
            ''
          )}
          {userInfo && userInfo.role === 'Hybrid Ad Manager' ? (
            <Route
              path={PATH_HYBRID_DASHBOARD}
              component={DashboardContainer}
            />
          ) : (
            ''
          )}

          {userInfo && userInfo.role === 'Ad Manager Admin' ? (
            <Route
              path={PATH_AD_MANAGER_ADMIN_DASHBOARD}
              component={DashboardContainer}
            />
          ) : (
            ''
          )}

          <Route path={PATH_TEAM_MEMBER} component={TeamMember} />
          <Route path={PATH_TABLET_TEAM_MEMBER} component={TabletTeamMember} />
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
          {/* {userInfo && userInfo.role === 'Customer' ? ( */}
          <Route
            path={PATH_UPLOAD_PRODUCT_ASSET}
            component={ProductDelegation}
          />
          {/* ) : (
            ''
          )} */}

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
