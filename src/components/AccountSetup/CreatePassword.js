import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import LoadingBar from 'react-top-loading-bar';
import queryString from 'query-string';

import {
  Button,
  ErrorMsg,
  FormField,
  InnerContainer,
  PageLoader,
} from '../../common';
import { LockFinish, Logo } from '../../theme/images/index';
import AccountInfoPage from './AccountInfoPage';
import { resetPassword } from '../../api';
import { login } from '../../store/actions/userState';

export default function CreatePassword() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(true);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [apiError, setApiError] = useState({});
  const [formData, setFormData] = useState({});
  const params = queryString.parse(history.location.search);

  const savePassword = () => {
    setIsLoading({ loader: true, type: 'button' });
    const data = {
      ...formData,
      key: params.key,
    };
    const loginData = {
      ...formData,
      email:
        history.location.search.split('email=') &&
        history.location.search.split('email=')[1],
    };

    resetPassword(data).then((response) => {
      if (response && response.status === 400) {
        setApiError(response && response.data);
        setIsLoading({ loader: false, type: 'button' });
      } else if (response && response.status === 200) {
        dispatch(login(history, loginData, '', ''));
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <div>
      {showInfo ? (
        <AccountInfoPage
          icon={LockFinish}
          step="1"
          title="Finish setting up your account"
          info={[
            `Hi ${(params && params.name) || ''}`,
            <React.Fragment key="para">
              <br />
              <br />
            </React.Fragment>,
            'Just a few more steps to setup your account on Buy Box Experts Central. We hate paper work, too.',
            <React.Fragment key="sub">
              <br />
              <br />
            </React.Fragment>,
            'Get started by creating a password for you company account.',
          ]}
          name="Get Started"
          setShowInfo={setShowInfo}
          progress=""
        />
      ) : (
        <>
          <LoadingBar color="#FF5933" progress="25" />
          <InnerContainer>
            <div className="logo text-center">
              <img className="header-logo" src={Logo} alt="logo " />{' '}
              <span> CENTRAL</span>
            </div>

            <p className="account-steps">Step 1 of 4</p>
            <h3 className="page-heading"> Create a password</h3>
            <FormField className="mt-3">
              <label htmlFor="emailAddress">
                Email address
                <br />
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter your  Email address"
                  defaultValue={(params && params.email) || ''}
                  readOnly
                />
              </label>
            </FormField>
            <FormField className="mt-4 mb-2">
              <label htmlFor="emailAddress">
                Password
                <br />
                <input
                  className="form-control"
                  type="password"
                  placeholder="Enter your Password"
                  name="password"
                  onChange={(event) => {
                    setFormData({ [event.target.name]: event.target.value });
                    setApiError({
                      [event.target.name]: '',
                    });
                  }}
                />
              </label>
              <ErrorMsg>
                {(apiError && apiError.password && apiError.password[0]) ||
                  (apiError && apiError.key && apiError.key[0])}
              </ErrorMsg>
            </FormField>
            <Button
              className=" mt-4 btn-primary w-100 on-boaring"
              onClick={() => savePassword()}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#FFF" type="button" />
              ) : (
                'Continue'
              )}
            </Button>
          </InnerContainer>
        </>
      )}
    </div>
  );
}
