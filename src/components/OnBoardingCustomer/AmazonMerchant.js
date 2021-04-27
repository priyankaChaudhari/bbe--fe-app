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
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateCustomerDetails,
  updateUserMe,
} from '../../api';
import { PATH_AMAZON_ACCOUNT, PATH_THANKS } from '../../constants';
import { userMe } from '../../store/actions';

export default function AmazonMerchant({
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
      userInfo.customer || verifiedStepData.customer,
      formData,
    ).then((res) => {
      if (res && res.status === 200) {
        if (
          stepData === undefined &&
          verifiedStepData &&
          Object.keys(verifiedStepData) &&
          Object.keys(verifiedStepData).length === 0
        ) {
          const detail = {
            is_completed: true,
            email: userInfo.email,
            step: 'merchant id',
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
                history.push(PATH_AMAZON_ACCOUNT);
              }
              updateUserMe(userInfo.id, {
                step: { ...userInfo.step, [userInfo.customer]: 4 },
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
                history.push(PATH_AMAZON_ACCOUNT);
              }
              updateUserMe(userInfo.id, {
                step: { ...userInfo.step, [userInfo.customer]: 4 },
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
    <>
      <OnBoardingBody className="body-white">
        <ContractFormField className="mt-4">
          <label htmlFor="merchant">
            Merchant ID
            <input
              className="form-control"
              onChange={(event) =>
                setFormData({ merchant_id: event.target.value })
              }
              defaultValue={data && data.merchant_id}
            />
          </label>
        </ContractFormField>
        <a
          href="https://www.amazon.com/"
          target="_blank"
          rel="noopener noreferrer">
          <Button className="btn-transparent font-style-regular w-100 mt-4">
            Log into your Amazon Account
          </Button>
        </a>
        <Button
          className="btn-primary w-100 mt-3"
          onClick={() => saveDetails()}>
          {' '}
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            'Continue'
          )}
        </Button>
      </OnBoardingBody>
    </>
  );
}

AmazonMerchant.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    customer: PropTypes.string,
    customer_onboarding: PropTypes.string,
    step: PropTypes.objectOf(PropTypes.object),
  }).isRequired,
  setIsLoading: PropTypes.func.isRequired,
  assignedToSomeone: PropTypes.bool.isRequired,
  stepData: PropTypes.arrayOf(PropTypes.array).isRequired,
  verifiedStepData: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string,
    }),
  ).isRequired,
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
};
