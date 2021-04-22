/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import queryString from 'query-string';

import Header from '../../common/Header';
import {
  OnBoardingBody,
  ContractFormField,
  Button,
  PageLoader,
  UnauthorizedHeader,
  GreyCard,
} from '../../common';
import {
  getStepDetails,
  updateAskSomeoneData,
  updateCustomerDetails,
  updateUserMe,
  verifyStepToken,
} from '../../api';
import {
  PATH_AMAZON_ACCOUNT,
  PATH_BILLING_DETAILS,
  PATH_THANKS,
} from '../../constants';
import { userMe, getCustomerDetails } from '../../store/actions';
import NavigationHeader from './NavigationHeader';
import AskSomeone from './AskSomeone';

export default function AmazonMerchant() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userState.userInfo);
  const data = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  // const [openCollapse, setOpenCollapse] = useState(false);
  const [assignedToSomeone, setAssignedToSomeone] = useState(false);
  const [verifiedStepData, setVerifiedStepData] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [stepData, setStepData] = useState([]);
  const [formData, setFormData] = useState({});
  const params = queryString.parse(history.location.search);

  useEffect(() => {
    if (params && params.key) {
      localStorage.setItem('match', params && params.key);
      verifyStepToken(params.key).then((response) => {
        setVerifiedStepData(response && response.data);
      });
    }
    if (history.location.pathname.includes('assigned')) {
      setAssignedToSomeone(true);
    } else {
      setAssignedToSomeone(false);
      getStepDetails(
        verifiedStepData.customer_onboarding_id || 'CBZQuki',
        'merchant id',
      ).then((response) => {
        setStepData(
          response &&
            response.data &&
            response.data.results &&
            response.data.results[0],
        );
        if (
          response &&
          response.data &&
          response.data.results &&
          response.data.results[0] &&
          response.data.results[0].step === 'merchant id'
        ) {
          setIsChecked(true);
        }
        // dispatch(getCustomerDetails(userInfo.customer));
        dispatch(getCustomerDetails(verifiedStepData.customer_id || 'CMF9QAS'));
        setIsLoading({ loader: false, type: 'page' });
      });
    }
  }, []);

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
              history.push(PATH_AMAZON_ACCOUNT);
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
    <>
      {assignedToSomeone ? (
        <UnauthorizedHeader />
      ) : (
        <Header type="onboarding" />
      )}
      {assignedToSomeone ? (
        ''
      ) : (
        <NavigationHeader
          bar="80"
          skipStep={PATH_AMAZON_ACCOUNT}
          backStep={PATH_BILLING_DETAILS}
        />
      )}
      {loader || (isLoading.loader && isLoading.type === 'page') ? (
        <PageLoader component="modal" color="#FF5933" type="page" />
      ) : (
        <OnBoardingBody className="body-white">
          <div className="white-card-base panel">
            {assignedToSomeone ? (
              <GreyCard className="yellow-card mt-2 mb-4">
                <div className="hi-name mb-2">
                  {' '}
                  <a href="*" className="video-link ">
                    {' '}
                    newton@ashersapparel.com{' '}
                  </a>
                  has asked that you provide the Merchant ID that will be used
                  for your Buy Box Experts agreement.
                </div>
                If you’re unable to provide this information or you think this
                was sent to you unintentionally please let them know via the
                email address highlighted above.
              </GreyCard>
            ) : (
              <p className="account-steps m-0">Step 4 of 4</p>
            )}
            <h3 className="page-heading ">Your Amazon Merchant ID</h3>
            <p className="info-text-gray m-0 ">
              This information will be used by our data BOTS to access data we
              will use to best manage your account. For a quick tutorial on how
              to access this information, watch the video below.
              <br />
              <a className="video-link" href="*">
                Click here to watch the video.
              </a>
            </p>
            {assignedToSomeone ? (
              ''
            ) : (
              <AskSomeone
                setIsChecked={setIsChecked}
                isChecked={isChecked}
                step="merchant id"
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                params={verifiedStepData}
                stepData={stepData}
                setStepData={setStepData}
              />
            )}
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
            <Button className="btn-transparent w-100 mt-4">
              Log into your Amazon Account
            </Button>
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
          </div>
        </OnBoardingBody>
      )}
    </>
  );
}
