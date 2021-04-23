import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import queryString from 'query-string';
import PropTypes from 'prop-types';

import {
  OnBoardingBody,
  ContractFormField,
  Button,
  PageLoader,
} from '../../common';

import { PATH_SUMMARY, PATH_THANKS } from '../../constants';

import { userMe } from '../../store/actions';
import {
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
  // data,
  isLoading,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const params = queryString.parse(history.location.search);

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
    updateCustomerDetails(
      'CMF9QAS' || verifiedStepData.customer,
      formData,
    ).then((res) => {
      if (res && res.status === 200) {
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
            updateUserMe(userInfo.id, { step: 4 }).then((user) => {
              if (user && user.status === 200) {
                dispatch(userMe());
              }
            });
            localStorage.removeItem('match');
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      }
      if (res && res.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <OnBoardingBody className="body-white w-430 ">
      <fieldset className="shape-without-border w-430   mt-4">
        <p className="account-steps m-0">Part 1</p>
        <p className="information-text mt-0 mb-0">
          Log into your Amazon Seller Central admin account and navigate to
          <strong> Appstore {'>'} Manage Your Apps</strong>
        </p>
        <Button className="btn-transparent w-100 mt-2">
          Log into your Amazon Account
        </Button>
      </fieldset>
      <fieldset className="shape-without-border mt-2">
        <p className="account-steps m-0">Part 2</p>
        <p className="information-text mt-0 mb-0">
          Click on ‘Authorize new developer’ and enter the following information
          on the resulting screen.
        </p>
        <p className="account-steps m-0">Developer’s Name</p>
        <div className="information-text mb-1">
          Buy Box Experts
          <div className="copy-info">
            <img className="copy-icon" src={CopyLinkIcon} alt="copy" />
            Copy
          </div>
        </div>
        <p className="account-steps m-0">Developer ID</p>
        <div className="information-text ">
          AMC184CK5LKV1129F
          <div className="copy-info">
            <img className="copy-icon" src={CopyLinkIcon} alt="copy" />
            Copy
          </div>
        </div>
      </fieldset>
      <fieldset className="shape-without-border mt-2">
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
                setFormData({ merchant_id: event.target.value })
              }
            />
          </label>
        </ContractFormField>
        <Button
          className="btn-primary w-100 mt-4"
          onClick={() => saveDetails()}>
          {' '}
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            'Continue'
          )}
        </Button>
      </fieldset>
    </OnBoardingBody>
  );
}

AmazonDeveloperAccess.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  setIsLoading: PropTypes.func.isRequired,
  assignedToSomeone: PropTypes.bool.isRequired,
  stepData: PropTypes.arrayOf(PropTypes.array).isRequired,
  verifiedStepData: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string,
    }),
  ).isRequired,
  // data: PropTypes.objectOf(PropTypes.object).isRequired,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
};
