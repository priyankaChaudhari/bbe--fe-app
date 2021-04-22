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
  GreyCard,
  PageLoader,
  UnauthorizedHeader,
} from '../../common';

import AskSomeone from './AskSomeone';
import {
  PATH_AMAZON_MERCHANT,
  PATH_SUMMARY,
  PATH_THANKS,
} from '../../constants';
import NavigationHeader from './NavigationHeader';
import { userMe, getCustomerDetails } from '../../store/actions';
import {
  getStepDetails,
  updateAskSomeoneData,
  updateCustomerDetails,
  updateUserMe,
  verifyStepToken,
} from '../../api';

export default function AmazonMerchantId() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userState.userInfo);
  // const data = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const [isLoading, setIsLoading] = useState({
    loader: false,
    type: 'button',
  });
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
        'developer access',
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
          response.data.results[0].step === 'developer access'
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
          bar="90"
          skipStep={PATH_SUMMARY}
          backStep={PATH_AMAZON_MERCHANT}
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
                  has asked that you provide the Amazon Developer Access that
                  will be used for your Buy Box Experts agreement.
                </div>
                If you’re unable to provide this information or you think this
                was sent to you unintentionally please let them know via the
                email address highlighted above.
              </GreyCard>
            ) : (
              <p className="account-steps m-0">Step 5 of 5</p>
            )}
            <h3 className="page-heading ">Amazon Developer Access</h3>
            <p className="info-text-gray m-0 ">
              Finally, we need you to grant us developer access to your Amazon
              Seller account.
            </p>
            <p className="information-text mt-2 mb-0">
              If you don’t have access to your Amazon Seller Central admin
              account then you can use the checkbox below to assign this step to
              someone that does.
            </p>
            {assignedToSomeone ? (
              ''
            ) : (
              <AskSomeone
                setIsChecked={setIsChecked}
                isChecked={isChecked}
                step="developer access"
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                params={verifiedStepData}
                stepData={stepData}
                setStepData={setStepData}
              />
            )}
            <div className=" straight-line  horizontal-line mb-4 mt-4" />
            <p className="account-steps m-0">Part 1</p>
            <p className="information-text mt-0 mb-0">
              Log into your Amazon Seller Central admin account below. You
              should see pre-filled information detailing our Developer Name and
              ID. If so, just click ‘Next’.{' '}
              <a className="video-link" href="*">
                {' '}
                Developer fields not pre-filled?
              </a>
            </p>
            <Button className="btn-transparent w-100 mt-2">
              Log into your Amazon Account
            </Button>
            <div className=" straight-line  horizontal-line mb-4 mt-4" />
            <p className="account-steps m-0">Part 2</p>
            <p className="information-text mt-0 mb-0">
              Copy the ‘Seller ID’ and ‘MWS Auth Token’ values shown on the
              resultant screen and paste into the field below.
            </p>
            <ContractFormField>
              <label htmlFor="id">
                Seller ID
                <input
                  className="form-control"
                  onChange={(event) =>
                    setFormData({ merchant_id: event.target.value })
                  }
                />
              </label>
            </ContractFormField>
            <ContractFormField className="mt-3">
              <label htmlFor="token">
                MWS Auth Token
                <input className="form-control" />
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
          </div>
        </OnBoardingBody>
      )}
    </>
  );
}
