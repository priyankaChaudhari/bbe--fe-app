import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import LoadingBar from 'react-top-loading-bar';

import { Button, FormField, InnerContainer } from '../../common';
import { PATH_COMPANY_DETAILS } from '../../constants';
import { LockFinish, Logo } from '../../theme/images/index';
import AccountInfoPage from './AccountInfoPage';

export default function CreatePassword() {
  const history = useHistory();
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div>
      {showInfo ? (
        <AccountInfoPage
          icon={LockFinish}
          step="1"
          title="Finish setting up your account"
          info={[
            'Hi Newtwon',
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
            <form>
              <FormField className="mt-3">
                <label htmlFor="emailAddress">
                  Email address
                  <br />
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter your  Email address"
                  />
                </label>
              </FormField>
              <FormField className="mt-4 mb-2">
                <label htmlFor="emailAddress">
                  Password
                  <br />
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter your Password"
                  />
                </label>
              </FormField>
              <Button
                className=" mt-4 btn-primary w-100 on-boaring"
                onClick={() => history.push(PATH_COMPANY_DETAILS)}>
                Continue
              </Button>
            </form>
          </InnerContainer>
        </>
      )}
    </div>
  );
}
