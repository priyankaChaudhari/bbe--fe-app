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
  PATH_CREATE_PASSWORD,
  PATH_COMPANY_DETAILS,
  PATH_AMAZON_ACCOUNT,
  PATH_BILLING_DETAILS,
  PATH_ROOT,
  PATH_ONE_TIME_AGREEMENT,
  PATH_SERVICE_AMENDMENT,
  PATH_DSP_ADDENDUM,
  PATH_ARTICLE_LIST,
  PATH_ARTICLE_DETAILS,
} from '../constants/index';

import { CustomerList, CustomerDetails } from '../components/Customer';
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
} from '../components/Contract';
import {
  CreatePassword,
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

  if (isAuthenticated && Object.keys(userInfo).length > 0) {
    return (
      <>
        {!history.location.pathname.includes('account-setup') ? (
          <>
            <Header />
            <LeftSideBar />
          </>
        ) : (
          ''
        )}
        <Switch>
          {/* Customer */}
          <Route path={PATH_CUSTOMER_LIST} exact component={CustomerList} />
          <Route
            path={PATH_CUSTOMER_DETAILS}
            exact
            component={CustomerDetails}
          />
          <Route path={PATH_CREATE_PASSWORD} component={CreatePassword} />
          <Route path={PATH_COMPANY_DETAILS} component={CompanyDetails} />

          {/* Contract */}
          <Route path={PATH_AGREEMENT} exact component={Agreement} />
          <Route path={PATH_STATEMENT} exact component={Statement} />
          <Route path={PATH_ADDENDUM} exact component={Addendum} />
          <Route path={PATH_ONE_TIME_AGREEMENT} component={OneTimeAgreement} />
          <Route path={PATH_SERVICE_AMENDMENT} component={ServicesAmendment} />
          <Route path={PATH_DSP_ADDENDUM} component={DSPAddendum} />
          {/* Account Setup */}
          <Route path={PATH_AMAZON_ACCOUNT} component={AmazonAccount} />
          <Route path={PATH_BILLING_DETAILS} component={BillingDetails} />

          {/* Knowledge Base */}
          <Route path={PATH_ARTICLE_LIST} exact component={ArticleList} />
          <Route path={PATH_ARTICLE_DETAILS} component={ArticleDetails} />

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
