/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import queryString from 'query-string';

import Theme from '../../theme/Theme';
import Header from '../../common/Header';
import {
  CheckBox,
  OnBoardingBody,
  ContractFormField,
  Button,
  ModalRadioCheck,
  GreyCard,
  UnauthorizedHeader,
  PageLoader,
} from '../../common';
import {
  VisaCardIcons,
  MasterCardIcons,
  DiscoverCardIcons,
  AmercianExpressCardIcons,
  CaretUp,
} from '../../theme/images';
import {
  getStepDetails,
  updateAskSomeoneData,
  updateUserMe,
  verifyStepToken,
} from '../../api';
import NavigationHeader from './NavigationHeader';
import {
  PATH_AMAZON_MERCHANT,
  PATH_COMPANY_DETAILS,
  PATH_THANKS,
} from '../../constants';
import AskSomeone from './AskSomeone';
import { userMe } from '../../store/actions';

export default function BillingInfo() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [openCollapse, setOpenCollapse] = useState(false);
  const [assignedToSomeone, setAssignedToSomeone] = useState(false);
  const [verifiedStepData, setVerifiedStepData] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [stepData, setStepData] = useState([]);

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
        'billing information',
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
          response.data.results[0].step === 'billing information'
        ) {
          setIsChecked(true);
        }
        setIsLoading({ loader: false, type: 'page' });
      });
    }
  }, []);

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
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
          history.push(PATH_AMAZON_MERCHANT);
        }
        updateUserMe(userInfo.id, { step: 3 }).then((user) => {
          if (user && user.status === 200) {
            dispatch(userMe());
          }
        });
        localStorage.removeItem('match');
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
          bar="60"
          skipStep={PATH_AMAZON_MERCHANT}
          backStep={PATH_COMPANY_DETAILS}
        />
      )}

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
                has asked that you provide the billing information that will be
                used for your Buy Box Experts agreement.
              </div>
              If you’re unable to provide this information or you think this was
              sent to you unintentionally please let them know via the email
              address highlighted above.
            </GreyCard>
          ) : (
            <p className="account-steps m-0">Step 3 of 4</p>
          )}
          <h3 className="page-heading ">Billing Information</h3>
          {assignedToSomeone ? (
            ''
          ) : (
            <AskSomeone
              setIsChecked={setIsChecked}
              isChecked={isChecked}
              step="billing information"
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              params={verifiedStepData}
              stepData={stepData}
              setStepData={setStepData}
            />
          )}
          <ContractFormField className="mt-3">
            <label htmlFor="routing">
              Name on Account
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label htmlFor="routing">
              Bank Name
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label htmlFor="routing">
              Routing Number
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label htmlFor="account">
              Account Number
              <input className="form-control" />
            </label>
          </ContractFormField>
          <div className="label-title mt-4"> Payment Type</div>
          <ModalRadioCheck className="mt-3 ">
            <label className="radio-container contact-billing" htmlFor="ACH">
              ACH
              <br />
              <input type="radio" checked="checked" name="radio" readOnly />
              <span className="checkmark checkmark-top" />
            </label>
          </ModalRadioCheck>
          <div
            className="label-title cursor mt-4"
            type="button"
            role="presentation"
            onClick={() => setOpenCollapse(!openCollapse)}>
            Explore other payment options{' '}
            <img className="arrow-up" src={CaretUp} alt="arrow" />
            <div className="clear-fix" />
          </div>
        </div>
        <CollapseOpenContainer>
          <Collapse isOpened={openCollapse}>
            <fieldset className="shape-without-border  w-430 mt-2 mb-4">
              <div className="inner-content">
                <p className="pay-card mt-0 mb-4">Pay By Credit Card</p>
                <div className="label-title mb-2">Credit Card Type</div>
                <ul className="payment-option">
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label
                        className="radio-container contact-billing"
                        htmlFor="routing">
                        <img className="card" src={VisaCardIcons} alt="card" />{' '}
                        Visa
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label
                        className="radio-container contact-billing"
                        htmlFor="routing">
                        <img
                          className="card"
                          src={MasterCardIcons}
                          alt="card"
                        />{' '}
                        Mastercard
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label
                        className="radio-container contact-billing"
                        htmlFor="routing">
                        <img
                          className="card"
                          src={DiscoverCardIcons}
                          alt="card"
                        />{' '}
                        Discover
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label
                        className="radio-container contact-billing"
                        htmlFor="routing">
                        <img
                          className="card"
                          src={AmercianExpressCardIcons}
                          alt="card"
                        />{' '}
                        American Express
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                </ul>
                <ContractFormField className="mt-3">
                  <label htmlFor="routing">
                    Cardholder name
                    <input className="form-control" />
                  </label>
                </ContractFormField>
                <ContractFormField className="mt-3">
                  <label htmlFor="routing">
                    Credit card number
                    <input className="form-control" />
                  </label>
                </ContractFormField>
                <div className="row">
                  <div className="col-8 pr-0">
                    {' '}
                    <ContractFormField className="mt-3">
                      <label htmlFor="routing">
                        Exp. Date
                        <input className="form-control" />
                      </label>
                    </ContractFormField>
                  </div>
                  <div className="col-4 ">
                    <ContractFormField className="mt-3">
                      <label htmlFor="routing">
                        CVV
                        <input className="form-control" />
                      </label>
                    </ContractFormField>
                  </div>
                </div>
              </div>
            </fieldset>
          </Collapse>
        </CollapseOpenContainer>
        <div className="white-card-base panel gap-none">
          <CheckBox className="mt-2 ">
            <label
              className="check-container customer-pannel hereby-acknowledge"
              htmlFor="contract-copy-check">
              I hereby acknowledge that I am an authorized signer on the account
              listed above and hereby authorize payments to be made to BBE using
              this payment method to satisfy any and all invoices or bills on
              our account with BBE moving forward until or unless further notice
              is provided in writing. I further agree to the additional Terms &
              Conditions for these payment and agree to the terms and conditions
              found{' '}
              <a className="link-url" href="*">
                here.
              </a>
              <input type="checkbox" id="contract-copy-check" />
              <span className="checkmark" />
            </label>
          </CheckBox>
          <Button
            className="btn-primary w-100  mt-3"
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
    </>
  );
}

const CollapseOpenContainer = styled.div`
  .ReactCollapse--collapse {
    max-width: 430px !important;
    margin: 0 auto;

    .inner-content {
      background-color: ${Theme.white};
      padding: 12px 0px 4px 0px;

      .pay-card {
        font-size: ${Theme.extraNormal};
        color: ${Theme.black};
        font-weight: 600;
      }
      .label-title {
        color: ${Theme.gray40};
        font-size: ${Theme.verySmall};
        text-transform: uppercase;
        font-weight: bold;
        font-family: ${Theme.titleFontFamily};
      }
      .payment-option {
        list-style-type: none;
        margin: 0;
        padding: 0;
        li {
          display: inline-block;
          margin-right: 23px;

          &:last-child {
            margin-right: 0px;
          }

          .card {
            width: 20px;
            margin-right: 2px;
            vertical-align: top;
          }
        }
      }
    }
  }
`;
