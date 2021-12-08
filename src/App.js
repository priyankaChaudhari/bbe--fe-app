import React, { useEffect } from 'react';

import { Route, Switch, BrowserRouter } from 'react-router-dom';

import GlobalStyle from './theme/css/GlobalStyle';

import WarningComponent from './common/WarningComponent';
import UnauthorizedHeader from './common/UnauthorizedHeader';
import AuthenticationComponent from './common/AuthenticationComponent';
import MainContainer from './components/OnBoardingCustomer/MainContainer';
import DSPBudgetApprovalContainer from './components/DspBudgetApproval/DSPBudgetApprovalContainer';
import { ProdFavicon } from './theme/images';
import { ProductDelegation } from './components/Customer';
import { HelloSignComponent } from './components/Contract';
import { Login, ForgotPassword, ResetPassword } from './components/Auth';
import {
  BrandAssetSummary,
  BrandAssetUpload,
  DelegationUpload,
} from './components/BrandAssetGathering';
import {
  AmazonDeveloperAccess,
  AmazonMerchant,
  BillingInfo,
  CompanyDigital,
  CreateAccount,
  Info,
  Thanks,
} from './components/OnBoardingCustomer';
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
  PATH_ACCOUNT_SETUP_CHOOSE,
  PATH_UNAUTHORIZED_CHOOSE_BRAND_DELEGATE,
  PATH_UNAUTHORIZED_BRAND_ASSET,
  PATH_UNAUTHROIZED_BRAND_ASSET_SUMMARY,
  PATH_UNAUTHORIZED_CHOOSE_PRODUCT_DELEGATE,
  PATH_DSP_BUDGET_APPROVAL,
} from './constants';

export default function App() {
  useEffect(() => {
    const favicon = document.getElementById('favicon');
    if (
      process.env.REACT_APP_ENVIRONMENT &&
      process.env.REACT_APP_ENVIRONMENT.includes('production')
    ) {
      favicon.href = ProdFavicon;
    }
  }, []);

  return (
    <BrowserRouter>
      <GlobalStyle />

      <Switch>
        {/* Auth */}
        <Route path={PATH_LOGIN} component={Login} />
        <Route path={PATH_FORGOT_PASSWORD} component={ForgotPassword} />
        <Route path={PATH_RESET_PASSWORD} component={ResetPassword} />
        <Route path={PATH_UNAUTHORIZED_HEADER} component={UnauthorizedHeader} />

        {/* Contract */}
        <Route path={PATH_HELLO_SIGN} component={HelloSignComponent} />
        <Route path={PATH_WARNING} component={WarningComponent} />

        {/* DSP budget proposal to BP */}
        <Route
          path={PATH_DSP_BUDGET_APPROVAL}
          component={DSPBudgetApprovalContainer}
        />

        {/* Onboarding Customer */}
        <Route path={PATH_ACCOUNT_SETUP_CHOOSE} exact component={Info} />
        <Route path={PATH_ACCOUNT_SETUP} component={MainContainer} />
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
        <Route
          path={PATH_UNAUTHORIZED_CHOOSE_BRAND_DELEGATE}
          component={DelegationUpload}
        />
        <Route
          path={PATH_UNAUTHORIZED_BRAND_ASSET}
          component={BrandAssetUpload}
        />
        <Route
          path={PATH_UNAUTHROIZED_BRAND_ASSET_SUMMARY}
          component={BrandAssetSummary}
        />
        <Route
          path={PATH_UNAUTHORIZED_CHOOSE_PRODUCT_DELEGATE}
          component={ProductDelegation}
        />

        {/*  Default */}
        <Route path={PATH_ROOT} component={AuthenticationComponent} />
      </Switch>
    </BrowserRouter>
  );
}
