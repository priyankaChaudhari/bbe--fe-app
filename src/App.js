import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import {
  PATH_FORGOT_PASSWORD,
  PATH_LOGIN,
  PATH_ROOT,
  PATH_RESET_PASSWORD,
  PATH_HELLO_SIGN,
} from './constants/index';
import AuthenticationComponent from './common/AuthenticationComponent';
import { Login, ForgotPassword, ResetPassword } from './components/Auth';
import HelloSignComponent from './components/Contract/HelloSignComponent';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        {/* Auth */}
        <Route path={PATH_LOGIN} component={Login} />
        <Route path={PATH_FORGOT_PASSWORD} component={ForgotPassword} />
        <Route path={PATH_RESET_PASSWORD} component={ResetPassword} />
        <Route path={PATH_HELLO_SIGN} component={HelloSignComponent} />

        {/*  Default */}
        <Route path={PATH_ROOT} component={AuthenticationComponent} />
      </Switch>
    </BrowserRouter>
  );
}
