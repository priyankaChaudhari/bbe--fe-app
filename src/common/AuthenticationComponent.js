/* eslint no-else-return: "off" */

import React, { useEffect } from 'react';

import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { userMe } from '../store/actions/index';
import {
  PATH_CUSTOMER_LIST,
  PATH_LOGIN,
  PATH_CUSTOMER_DETAILS,
  PATH_AGREEMENT,
  PATH_STATEMENT,
  PATH_ADDENDUM,
  PATH_COMPANY_DETAILS,
  PATH_BILLING_DETAILS,
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
  PATH_CREATE_ACCOUNT,
  PATH_AMAZON_MERCHANT_ID,
  PATH_AMAZON_DEVELOPER_ACCESS,
  // PATH_SUMMARY,
  // PATH_THANKS,
  // PATH_COMPANY_DIGITAL,
} from '../constants/index';

import { CustomerListTablet } from '../components/Customer';

import { PageLoader, PageNotFound } from './index';
import Header from './Header';
import LeftSideBar from './LeftSideBar';
import { ContractContainer } from '../components/Contract';
import { CompanyDetails } from '../components/AccountSetup';
import { ArticleDetails, ArticleList } from '../components/Knowledge Base';
import CustomerMainContainer from '../components/Customer/CustomerMainContainer';
import NewCustomerList from '../components/Customer/NewCustomerList';
import {
  Dashboard,
  TeamMember,
  TabletTeamMember,
} from '../components/Brand Partner';
import CreateAccount from '../components/OnBoardingCustomer/CreateAccount';
import {
  AmazonDeveloperAccess,
  AmazonMerchantId,
  BillingInfo,
  // CompanyDigital,
  // Summary,
  // Thanks,
} from '../components/OnBoardingCustomer';

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
    if (userInfo && userInfo.role === 'Customer') return <Header />;
    if (
      !history.location.pathname.includes('account-setup') &&
      userInfo &&
      userInfo.role !== 'Customer'
    )
      return (
        <>
          <div className="common-header-sticky">
            <Header />
          </div>

          <LeftSideBar userInfo={userInfo} />
        </>
      );
    return '';
  };

  const generateAccountSetup = () => {
    if (userInfo && userInfo.role === 'Customer') {
      if (userInfo.step === null) {
        return <Route path={PATH_CREATE_ACCOUNT} component={CreateAccount} />;
      }
      if (userInfo.step === 1) {
        return '';
        // return <Route path={PATH_COMPANY_DETAILS} component={CompanyDigital} />;
      }
      if (userInfo.step === 2) {
        return <Route path={PATH_BILLING_DETAILS} component={BillingInfo} />;
      }
      if (userInfo.step === 3) {
        return (
          <Route path={PATH_AMAZON_MERCHANT_ID} component={AmazonMerchantId} />
        );
      }
      if (userInfo.step === 4) {
        return (
          // <Route
          //   path={PATH_CUSTOMER_DETAILS}
          //   exact
          //   component={CustomerMainContainer}
          // />
          <Route
            path={PATH_AMAZON_DEVELOPER_ACCESS}
            component={AmazonDeveloperAccess}
          />
        );
      }
    }
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
          <Route path={PATH_COMPANY_DETAILS} component={CompanyDetails} />
          {/* Contract */}
          <Route path={PATH_AGREEMENT} exact component={ContractContainer} />
          <Route path={PATH_STATEMENT} exact component={ContractContainer} />
          <Route path={PATH_ADDENDUM} exact component={ContractContainer} />
          <Route path={PATH_ONE_TIME_AGREEMENT} component={ContractContainer} />
          <Route path={PATH_SERVICE_AMENDMENT} component={ContractContainer} />
          <Route path={PATH_DSP_ADDENDUM} component={ContractContainer} />
          {/* Account Setup */}
          {generateAccountSetup()}
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
          <Route path={PATH_BGS_DASHBOARD} component={Dashboard} />
          <Route path={PATH_TEAM_MEMBER} component={TeamMember} />
          <Route path={PATH_TABLET_TEAM_MEMBER} component={TabletTeamMember} />

          {/* On-Boarding Customer */}
          {/* <Route path={PATH_COMPANY_DIGITAL} component={CompanyDigital} />;
          <Route path={PATH_SUMMARY} component={Summary} />
          <Route path={PATH_THANKS} component={Thanks} /> */}
          <Route component={PageNotFound} />
        </Switch>
      </>
    );
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(userMe(history));
      return <PageLoader color="#FF5933" type="page" />;
    } else {
      return (
        <Redirect
          to={{
            pathname: PATH_LOGIN,
          }}
        />
      );
    }
  }
}
