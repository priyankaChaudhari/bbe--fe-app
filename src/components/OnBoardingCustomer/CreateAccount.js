import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import LoadingBar from 'react-top-loading-bar';
import queryString from 'query-string';
import styled from 'styled-components';
// import Select from 'react-select';

import Theme from '../../theme/Theme';
import UnauthorizedHeader from '../../common/UnauthorizedHeader';
import { LeftArrowIcon } from '../../theme/images/index';
import {
  Button,
  ContractFormField,
  ErrorMsg,
  OnBoardingBody,
  PageLoader,
} from '../../common';
import { resetPassword } from '../../api';
import { login } from '../../store/actions/userState';

export default function CreateAccount() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState({
    loader: false,
    type: 'button',
  });
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
        dispatch(login(history, loginData));
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <>
      <UnauthorizedHeader />
      <LoadingBar color="#FF5933" progress="25" />
      <BackToStep>
        {' '}
        <div role="presentation" className="back-link">
          <img
            src={LeftArrowIcon}
            alt="aarow-back"
            className="arrow-back-icon "
          />
          Back a step
        </div>
      </BackToStep>
      <OnBoardingBody>
        <div className="white-card-base panel">
          <p className="account-steps m-0">Step 1 of 4</p>
          <h3 className="page-heading ">
            Please set your password to create your account.
          </h3>
          <p className="info-text-gray m-0 ">
            If you’d like someone else to administrate the Buy Box Experts
            account then you can reassign the setup process to them.
          </p>
          <ContractFormField className="mt-3">
            <label htmlFor="email">
              Email Address
              <input
                className="form-control"
                type="text"
                placeholder="Enter your  Email address"
                defaultValue={(params && params.email) || ''}
                readOnly
              />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label htmlFor="password">
              Password
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
          </ContractFormField>
          <ErrorMsg>
            {(apiError && apiError.password && apiError.password[0]) ||
              (apiError && apiError.key && apiError.key[0])}
          </ErrorMsg>
          <Button
            className="btn-primary w-100 mt-4"
            onClick={() => savePassword()}>
            {isLoading.loader && isLoading.type === 'button' ? (
              <PageLoader color="#FFF" type="button" />
            ) : (
              'Continue'
            )}
          </Button>
        </div>
        {/* Re-assign account setup */}
        {/* <div className="white-card-base panel">
          <h3 className="page-heading ">Re-assign account setup</h3>
          <p className="information-text m-0 ">
            <div className="hi-name">
              {' '}
              If you’d like someone else to administrate the Buy Box Experts
              account then you can reassign the setup process to them.
            </div>

            <span className="note">
              Note: Only the nominated email address will be able to add and
              remove access for other members of your team.
            </span>
          </p>
          <ContractFormField className="">
            <label>
              Email Address
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label>
              Confirm Email Address
              <input className="form-control" />
            </label>
          </ContractFormField>
          <Button className="btn-primary w-100 mt-4">Confirm</Button>
        </div> */}
        {/* Re-assign account setup */}
        {/* <div className="white-card-base">
          <h3 className="page-heading ">Account Setup Reassigned</h3>
          <p className="information-text m-0 ">
            You have successfully reassigned the account setup process to the
            following email address:
          </p>
          <div className="complete-steps mb-2">newton@ashersapparel.com</div>
          <p className="reach-out m-0 ">
            If you need any assistance please reach out to
            <br />
            <a className="reach-out-link" href="*">
              onboarding@buyboxexperts.com
            </a>
          </p>
        </div> */}
      </OnBoardingBody>
    </>
  );
}

const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 2;
  padding: 20px 0px 20px 25px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};
`;
