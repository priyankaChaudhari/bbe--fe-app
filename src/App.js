import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import {
  PATH_FORGOT_PASSWORD,
  PATH_LOGIN,
  PATH_ROOT,
  PATH_RESET_PASSWORD,
  PATH_CREATE_PASSWORD,
  PATH_HELLO_SIGN,
  PATH_WARNING,
  PATH_UNAUTHORIZED_HEADER,
  PATH_ACCOUNT_SETUP,
  PATH_UNAUTHORIZED_COMPANY_DETAILS,
  PATH_THANKS,
  PATH_UNAUTHORIZED_BILLING_DETAILS,
  PATH_UNAUTHORIZED_AMAZON_MERCHANT,
  PATH_UNAUTHORIZED_AMAZON_ACCOUNT,
} from './constants/index';
import AuthenticationComponent from './common/AuthenticationComponent';
import { Login, ForgotPassword, ResetPassword } from './components/Auth';

import { HelloSignComponent } from './components/Contract';
import WarningComponent from './common/WarningComponent';
import UnauthorizedHeader from './common/UnauthorizedHeader';
import {
  AmazonDeveloperAccess,
  AmazonMerchant,
  BillingInfo,
  CompanyDigital,
  CreateAccount,
  Info,
  Thanks,
} from './components/OnBoardingCustomer';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        {/* Auth */}
        <Route path={PATH_LOGIN} component={Login} />
        <Route path={PATH_FORGOT_PASSWORD} component={ForgotPassword} />
        <Route path={PATH_RESET_PASSWORD} component={ResetPassword} />
        <Route path={PATH_UNAUTHORIZED_HEADER} component={UnauthorizedHeader} />

        {/* Contract */}
        <Route path={PATH_HELLO_SIGN} component={HelloSignComponent} />
        <Route path={PATH_WARNING} component={WarningComponent} />

        {/* Onboarding Customer */}
        <Route path={PATH_ACCOUNT_SETUP} exact component={Info} />
        <Route path={PATH_CREATE_PASSWORD} component={CreateAccount} />
        <Route
          path={PATH_UNAUTHORIZED_COMPANY_DETAILS}
          component={CompanyDigital}
        />
        <Route
          path={PATH_UNAUTHORIZED_BILLING_DETAILS}
          component={BillingInfo}
        />
        <Route
          path={PATH_UNAUTHORIZED_AMAZON_MERCHANT}
          component={AmazonMerchant}
        />
        <Route
          path={PATH_UNAUTHORIZED_AMAZON_ACCOUNT}
          component={AmazonDeveloperAccess}
        />

        <Route path={PATH_THANKS} component={Thanks} />

        {/*  Default */}
        <Route path={PATH_ROOT} component={AuthenticationComponent} />
      </Switch>
    </BrowserRouter>
  );
}
