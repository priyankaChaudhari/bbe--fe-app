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
  PATH_AMAZON_ACCOUNT,
  PATH_BILLING_DETAILS,
  PATH_ROOT,
  PATH_ONE_TIME_AGREEMENT,
  PATH_SERVICE_AMENDMENT,
  PATH_DSP_ADDENDUM,
  PATH_ARTICLE_LIST,
  PATH_ARTICLE_DETAILS,
  PATH_HELLO_SIGN,
  PATH_COMPANY_DETAIL,
  PATH_CUSTOMER_ACTIVITY,
} from '../constants/index';

import {
  CustomerList,
  CustomerDetails,
  CompanyDetail,
  CustomerActivity,
} from '../components/Customer';
import { PageLoader, PageNotFound } from './index';
import Header from './Header';
import LeftSideBar from './LeftSideBar';
import {
  Addendum,
  Agreement,
  Statement,
  OneTimeAgreement,
  ServicesAmendment,
  DSPAddendum,
  HelloSignComponent,
} from '../components/Contract';
import {
  CompanyDetails,
  AmazonAccount,
  BillingDetails,
} from '../components/AccountSetup';
import { ArticleDetails, ArticleList } from '../components/Knowledge Base';

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
          <Header />
          <LeftSideBar />
        </>
      );
    return '';
  };

  const generateAccountSetup = () => {
    if (userInfo && userInfo.role === 'Customer') {
      if (userInfo.step === null) {
        return <Route path={PATH_COMPANY_DETAILS} component={CompanyDetails} />;
      }
      if (userInfo.step === 2) {
        return <Route path={PATH_AMAZON_ACCOUNT} component={AmazonAccount} />;
      }
      if (userInfo.step === 3) {
        return <Route path={PATH_BILLING_DETAILS} component={BillingDetails} />;
      }
      if (userInfo.step === 4) {
        return (
          <Route
            path={PATH_CUSTOMER_DETAILS}
            exact
            component={CustomerDetails}
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
            <Route path={PATH_CUSTOMER_LIST} exact component={CustomerList} />
          ) : (
            ''
          )}
          <Route
            path={PATH_CUSTOMER_DETAILS}
            exact
            component={CustomerDetails}
          />
          <Route path={PATH_COMPANY_DETAIL} component={CompanyDetail} />
          <Route path={PATH_CUSTOMER_ACTIVITY} component={CustomerActivity} />

          <Route path={PATH_COMPANY_DETAILS} component={CompanyDetails} />

          {/* Contract */}
          <Route path={PATH_AGREEMENT} exact component={Agreement} />
          <Route path={PATH_STATEMENT} exact component={Statement} />
          <Route path={PATH_ADDENDUM} exact component={Addendum} />
          <Route path={PATH_ONE_TIME_AGREEMENT} component={OneTimeAgreement} />
          <Route path={PATH_SERVICE_AMENDMENT} component={ServicesAmendment} />
          <Route path={PATH_DSP_ADDENDUM} component={DSPAddendum} />
          <Route path={PATH_HELLO_SIGN} component={HelloSignComponent} />

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
