/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import queryString from 'query-string';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';

import Theme from '../../theme/Theme';
import {
  CheckBox,
  OnBoardingBody,
  ContractFormField,
  Button,
  ModalRadioCheck,
  PageLoader,
  ModalBox,
} from '../../common';
import {
  AmercianExpressCardIcons,
  CaretUp,
  CloseIcon,
  DiscoverCardIcons,
  MasterCardIcons,
  VisaCardIcons,
} from '../../theme/images';
import { updateAskSomeoneData, updateUserMe } from '../../api';
import { PATH_AMAZON_MERCHANT, PATH_THANKS } from '../../constants';
import { userMe } from '../../store/actions';

export default function BillingInfo({
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
  // const [formData, setFormData] = useState({});
  const [openCollapse, setOpenCollapse] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const params = queryString.parse(history.location.search);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      minHeight: '200px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

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
        updateUserMe(userInfo.id, {
          step: { ...userInfo.step, [userInfo.customer]: 3 },
        }).then((user) => {
          if (user && user.status === 200) {
            dispatch(userMe());
          }
        });
        localStorage.removeItem('match');
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const generatePayment = () => {
    return (
      <>
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
                        htmlFor="card">
                        <img className="card" src={VisaCardIcons} alt="card" />{' '}
                        Visa
                        <br />
                        <input
                          type="radio"
                          checked="checked"
                          name="radio"
                          readOnly
                        />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label
                        className="radio-container contact-billing"
                        htmlFor="card">
                        <img
                          className="card"
                          src={MasterCardIcons}
                          alt="card"
                        />{' '}
                        Mastercard
                        <br />
                        <input
                          type="radio"
                          checked="checked"
                          name="radio"
                          readOnly
                        />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label
                        className="radio-container contact-billing"
                        htmlFor="card">
                        <img
                          className="card"
                          src={DiscoverCardIcons}
                          alt="card"
                        />{' '}
                        Discover
                        <br />
                        <input
                          type="radio"
                          checked="checked"
                          name="radio"
                          readOnly
                        />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label
                        className="radio-container contact-billing"
                        htmlFor="card">
                        <img
                          className="card"
                          src={AmercianExpressCardIcons}
                          alt="card"
                        />{' '}
                        American Express
                        <br />
                        <input
                          type="radio"
                          checked="checked"
                          name="radio"
                          readOnly
                        />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                </ul>
                <ContractFormField className="mt-3">
                  <label htmlFor="card">
                    Cardholder name
                    <input className="form-control" />
                  </label>
                </ContractFormField>
                <ContractFormField className="mt-3">
                  <label htmlFor="card">
                    Credit card number
                    <input className="form-control" />
                  </label>
                </ContractFormField>
                <div className="row">
                  <div className="col-8 pr-0">
                    {' '}
                    <ContractFormField className="mt-3">
                      <label htmlFor="card">
                        Exp. Date
                        <input className="form-control" />
                      </label>
                    </ContractFormField>
                  </div>
                  <div className="col-4 ">
                    <ContractFormField className="mt-3">
                      <label htmlFor="card">
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
      </>
    );
  };

  return (
    <>
      <OnBoardingBody className="body-white">
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
          <img
            className="arrow-up"
            src={CaretUp}
            alt="arrow"
            style={{
              transform: openCollapse ? 'rotate(180deg)' : '',
            }}
          />
          <div className="clear-fix" />
        </div>
        {generatePayment()}
        <div className="white-card-base panel gap-none">
          <CheckBox className="mt-3 ">
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
              <span
                className="link-url"
                onClick={() => setShowModal(true)}
                role="presentation">
                here.
              </span>
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
      <Modal
        isOpen={showModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => setShowModal(false)}
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body" style={{ color: '#2E384D' }}>
            By accepting the terms on the Payment Information page, I
            acknowledge that I am an authorized signer, user or representative
            of the account provided and have the authority to set up payments
            against that account on a recurring basis moving forward. <br />
            <br /> I understand that this authorization will remain in effect
            until I cancel it in writing, and I agree to notify the merchant in
            writing of any changes in my account information or termination of
            this authorization at least 15 days prior to the next billing date.
            If the monthly billing date falls on a weekend or holiday, I
            understand that the payments may be executed automatically over
            those days or may be processed on the next business day. <br />
            <br /> A prorated initial billing may be charged to cover the dates
            between the signature date and the selected monthly billing date, if
            different. <br />
            <br /> For ACH debits to my checking/savings account, I understand
            that because these are electronic transactions, the funds may be
            withdrawn from my account as soon as electronic payment is
            processed. In the case of an ACH Transaction or Credit Card
            transactions being rejected for Non-Sufficient Funds (NSF), I
            understand that Buy Box Experts (“BBE”) may, at its discretion
            attempt to process the charge again within 30 days, and agree to an
            additional $25 charge for each attempt returned NSF which will be
            initiated as a separate transaction from the authorized recurring
            payment method. <br />
            <br /> I acknowledge that the origination of ACH transactions to my
            account must comply with the provisions of U.S. law. I certify that
            I am an authorized user/signer of this credit card/bank account and
            will not dispute these scheduled transactions with my bank or credit
            card company; so long as the transactions correspond to the terms
            indicated in this authorization form, our service agreement with
            BBE, and any invoice provided by BBE to me in conjunction with the
            payment.
          </div>
        </ModalBox>
      </Modal>
    </>
  );
}

BillingInfo.defaultProps = {
  stepData: {},
};

BillingInfo.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
    customer: PropTypes.string,
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
  // data: PropTypes.objectOf(PropTypes.object).isRequired,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
};

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
        letter-spacing: 1.13px;
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
