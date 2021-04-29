import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import queryString from 'query-string';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

import {
  OnBoardingBody,
  ContractFormField,
  Button,
  PageLoader,
} from '../../common';

import { PATH_SUMMARY, PATH_THANKS } from '../../constants';

import { userMe } from '../../store/actions';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateCustomerDetails,
  updateUserMe,
} from '../../api';
import { CopyLinkIcon } from '../../theme/images';

export default function AmazonDeveloperAccess({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  data,
  isLoading,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const params = queryString.parse(history.location.search);

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
    updateCustomerDetails(
      userInfo.customer || verifiedStepData.customer_id,
      formData,
    ).then((res) => {
      if (res && res.status === 200) {
        if (
          (stepData === undefined ||
            (stepData &&
              Object.keys(stepData) &&
              Object.keys(stepData).length === 0)) &&
          verifiedStepData &&
          Object.keys(verifiedStepData) &&
          Object.keys(verifiedStepData).length === 0
        ) {
          const detail = {
            is_completed: true,
            email: userInfo.email,
            step: 'developer access',
            customer_onboarding: userInfo.customer_onboarding,
          };
          askSomeoneData(detail).then((stepResponse) => {
            if (stepResponse && stepResponse.status === 201) {
              if (assignedToSomeone) {
                const stringified =
                  queryString &&
                  queryString.stringify({
                    name: verifiedStepData.user_name,
                  });
                history.push({
                  pathname: PATH_THANKS,
                  search: `${stringified}`,
                });
              } else {
                history.push(PATH_SUMMARY);
              }
              updateUserMe(userInfo.id, {
                step: { ...userInfo.step, [userInfo.customer]: 5 },
              }).then((user) => {
                if (user && user.status === 200) {
                  dispatch(userMe());
                }
              });
              localStorage.removeItem('match');
              setIsLoading({ loader: false, type: 'button' });
            }
          });
        } else {
          updateAskSomeoneData(
            (stepData && stepData.id) || verifiedStepData.step_id,
            {
              token: assignedToSomeone ? params && params.key : '',
              is_completed: true,
            },
          ).then((response) => {
            if (response && response.status === 200) {
              if (assignedToSomeone) {
                const stringified =
                  queryString &&
                  queryString.stringify({
                    name: verifiedStepData.user_name,
                  });
                history.push({
                  pathname: PATH_THANKS,
                  search: `${stringified}`,
                });
              } else {
                history.push(PATH_SUMMARY);
              }
              updateUserMe(userInfo.id, {
                step: { ...userInfo.step, [userInfo.customer]: 5 },
              }).then((user) => {
                if (user && user.status === 200) {
                  dispatch(userMe());
                }
              });
              localStorage.removeItem('match');
              setIsLoading({ loader: false, type: 'button' });
            }
          });
        }
      }
      if (res && res.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <OnBoardingBody className="body-white w-430 pb-4">
      <fieldset className="shape-without-border w-430   mt-4">
        <p className="account-steps m-0">Part 1</p>
        <p className="information-text mt-0 mb-0">
          Log into your Amazon Seller Central admin account and navigate to
          <span className="text-bold"> Appstore {'>'} Manage Your Apps</span>
        </p>
        <a
          href="https://www.amazon.com/"
          target="_blank"
          rel="noopener noreferrer">
          <Button className="btn-transparent font-style-regular w-100 mt-2">
            Log into your Amazon Account
          </Button>
        </a>
      </fieldset>
      <fieldset className="shape-without-border mt-2">
        <p className="account-steps m-0">Part 2</p>
        <p className="information-text mt-0 mb-0">
          Click on ‘Authorize new developer’ and enter the following information
          on the resulting screen.
        </p>
        <p className="account-steps m-0">Developer’s Name</p>
        <div className="information-text mb-1">
          {process.env.REACT_APP_DEVELOPERS_NAME || 'Buy Box Experts'}
          <div
            className="copy-info"
            onClick={() =>
              copy(process.env.REACT_APP_DEVELOPERS_NAME || 'Buy Box Experts')
            }
            role="presentation">
            <img className="copy-icon" src={CopyLinkIcon} alt="copy" />
            Copy
          </div>
        </div>
        <p className="account-steps m-0">Developer ID</p>
        <div
          className="information-text"
          onClick={() =>
            copy(process.env.REACT_APP_DEVELOPERS_ID || 'AMC184CK5LKV1129F')
          }
          role="presentation">
          {process.env.REACT_APP_DEVELOPERS_ID || 'AMC184CK5LKV1129F'}
          <div className="copy-info">
            <img className="copy-icon" src={CopyLinkIcon} alt="copy" />
            Copy
          </div>
        </div>
      </fieldset>
      <fieldset className="shape-without-border mt-2 ">
        <p className="account-steps m-0">Part 3</p>
        <p className="information-text mt-0 mb-0">
          Copy and paste the ‘MWS Auth Token’ value shown on the resultant
          screen below.
        </p>
        <ContractFormField>
          <label htmlFor="token">
            MWS Auth Token
            <input
              className="form-control"
              onChange={(event) =>
                setFormData({ mws_auth_token: event.target.value })
              }
              defaultValue={data && data.mws_auth_token}
            />
          </label>
        </ContractFormField>
        <Button
          className="btn-primary w-100 mt-4"
          onClick={() => saveDetails()}
          disabled={
            formData.mws_auth_token === '' ||
            formData.mws_auth_token === undefined
          }>
          {' '}
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            'Confirm'
          )}
        </Button>
      </fieldset>
    </OnBoardingBody>
  );
}

AmazonDeveloperAccess.defaultProps = {
  stepData: {},
};

AmazonDeveloperAccess.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    customer: PropTypes.string,
    customer_onboarding: PropTypes.string,
    step: PropTypes.shape({
      step: PropTypes.number,
    }),
  }).isRequired,
  setIsLoading: PropTypes.func.isRequired,
  assignedToSomeone: PropTypes.bool.isRequired,
  stepData: PropTypes.shape({
    id: PropTypes.string,
  }),
  verifiedStepData: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string,
    }),
  ).isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    mws_auth_token: PropTypes.string,
  }).isRequired,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
};
