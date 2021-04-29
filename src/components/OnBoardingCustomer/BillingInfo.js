/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import queryString from 'query-string';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import NumberFormat from 'react-number-format';

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
import { CaretUp, CloseIcon } from '../../theme/images';
import { updateAskSomeoneData, updateUserMe } from '../../api';
import { PATH_AMAZON_MERCHANT, PATH_THANKS } from '../../constants';
import { userMe } from '../../store/actions';
import { Billing, BillingAddress } from '../../constants/FieldConstants';
import { showBillingAddress } from '../../store/actions/userState';

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
  const [formData, setFormData] = useState({});
  const [openCollapse, setOpenCollapse] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const params = queryString.parse(history.location.search);
  const billingAddress = useSelector(
    (state) => state.userState.showBillingAddress,
  );

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

  const saveDetails = (type) => {
    if (type === 'billing') {
      dispatch(showBillingAddress(true));
    } else {
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
    }
  };

  const generateNumeric = (item, type) => {
    return (
      <NumberFormat
        format={item.format}
        className="form-control"
        onChange={(event) =>
          setFormData({ ...formData, [item.key]: event.target.value })
        }
        placeholder={`Enter ${item.label}`}
        disabled={type === 'credit' && formData.ach}
        value={type === 'credit' && formData.ach ? '' : formData[item.key]}
      />
    );
  };

  const generateRadio = (item) => {
    return (
      <ModalRadioCheck className="mt-1">
        <label className="radio-container contact-billing" htmlFor={item.key}>
          {item.key === 'ach' ? (
            ''
          ) : (
            <img className="card" src={item.icon} alt="card" />
          )}{' '}
          {item.label === 'payment type' ? 'ACH' : item.label}
          <br />
          <input
            type={item.type}
            name={item.key === 'ach' ? item.key : 'radio'}
            id={item.key}
            checked={
              item.key !== 'ach' && formData.ach ? '' : formData[item.key]
            }
            onChange={(event) => {
              setFormData({
                ...formData,
                [item.key]: event.target.checked,
              });
            }}
            disabled={item.key !== 'ach' && formData.ach}
            readOnly
          />
          <span className="checkmark" />
        </label>
      </ModalRadioCheck>
    );
  };

  const generateInput = (item, isDisabled, type) => {
    return (
      <input
        className="form-control"
        placeholder={`Enter ${item.label}`}
        type={item.type}
        value={type === 'credit' && formData.ach ? '' : formData[item.key]}
        onChange={(event) =>
          setFormData({
            ...formData,
            [item.key]: event.target.value,
          })
        }
        disabled={isDisabled && formData.ach}
      />
    );
  };

  const generatePayment = (item) => {
    return (
      <>
        <CollapseOpenContainer>
          <Collapse isOpened={openCollapse}>
            <fieldset className="shape-without-border  w-430 mt-2 mb-4">
              <div className="inner-content">
                <p className="pay-card mt-0 mb-4">Pay By Credit Card</p>
                <div className="label-title mb-2">Credit Card Type</div>
                <ul className="payment-option">
                  {item &&
                    item.choices.map((field) => (
                      <li key={field.key}>{generateRadio(field)}</li>
                    ))}
                </ul>
                {item &&
                  item.details
                    .filter((op) => op.property === '')
                    .map((field) => (
                      <ContractFormField className="mt-3" key={field.key}>
                        <label htmlFor={field.label}>
                          {field.label}
                          <br />
                          {field.type === 'number' ? (
                            <>{generateNumeric(field, 'credit')}</>
                          ) : (
                            <>{generateInput(field, false, 'credit')}</>
                          )}
                        </label>
                      </ContractFormField>
                    ))}
                <div className="row">
                  {item &&
                    item.details
                      .filter((op) => op.property !== '')
                      .map((field) => (
                        <div className="col-6" key={field.key}>
                          <ContractFormField className="mt-3">
                            <label htmlFor={field.label}>
                              {field.label}
                              <br />
                              {field.type === 'number' ? (
                                <>{generateNumeric(field, 'credit')}</>
                              ) : (
                                <>{generateInput(field, false, 'credit')}</>
                              )}
                            </label>
                          </ContractFormField>
                        </div>
                      ))}
                </div>
              </div>
            </fieldset>
          </Collapse>
        </CollapseOpenContainer>
      </>
    );
  };

  const generateBillingAddressHTML = () => {
    return (
      <>
        <div className="billing-address"> Billing Address </div>
        {BillingAddress.filter(
          (op) => op.section === 'address' && op.property === '',
        ).map((item) => (
          <ContractFormField className="mt-3" key={item.key}>
            <label htmlFor={item.label}>
              {item.label}
              <br />
              {item.type === 'number' ? (
                <>{generateNumeric(item)}</>
              ) : (
                <>{generateInput(item, false)}</>
              )}
            </label>
          </ContractFormField>
        ))}
        <div className="row">
          {BillingAddress.filter(
            (op) => op.section === 'address' && op.property !== '',
          ).map((item) => (
            <div className="col-6" key={item.key}>
              <ContractFormField className="mt-3">
                <label htmlFor={item.label}>
                  {item.label}
                  <br />
                  {item.type === 'number' ? (
                    <>{generateNumeric(item)}</>
                  ) : (
                    <>{generateInput(item, false)}</>
                  )}
                </label>
              </ContractFormField>
            </div>
          ))}
        </div>
        <br />
        <div className=" straight-line horizontal-line mt-2 mb-4" />
        <div className="billing-address">Billing Contact</div>
        <div className="row">
          {BillingAddress.filter(
            (op) => op.section === 'contact' && op.property === '',
          ).map((item) => (
            <div className="col-6" key={item.key}>
              <ContractFormField className="mt-3">
                <label htmlFor={item.label}>
                  {item.label}
                  <br />
                  {item.type === 'number' ? (
                    <>{generateNumeric(item)}</>
                  ) : (
                    <>{generateInput(item, false)}</>
                  )}
                </label>
              </ContractFormField>
            </div>
          ))}
        </div>
        <div className="row">
          {BillingAddress.filter(
            (op) => op.section === 'contact' && op.property !== '',
          ).map((item) => (
            <div className="col-6" key={item.key}>
              <ContractFormField className="mt-3">
                <label htmlFor={item.label}>
                  {item.label}
                  <br />
                  {item.type === 'number' ? (
                    <>{generateNumeric(item)}</>
                  ) : (
                    <>{generateInput(item, false)}</>
                  )}
                </label>
              </ContractFormField>
            </div>
          ))}
        </div>
        <Button
          className="btn-primary w-100  mt-4 mb-4"
          onClick={() => saveDetails('address')}>
          {' '}
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            'Continue'
          )}
        </Button>
      </>
    );
  };

  return (
    <>
      {!billingAddress ? (
        <>
          <OnBoardingBody className="body-white">
            {Billing.map((item) => (
              <ContractFormField className="mt-3" key={item.key}>
                <label htmlFor={item.label}>
                  {item.label}

                  {item.type === 'number' ? (
                    <>{generateNumeric(item)}</>
                  ) : item.type === 'checkbox' ? (
                    <>{generateRadio(item)}</>
                  ) : item.key === 'credit_card' ? (
                    <>
                      {' '}
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
                      {generatePayment(item)}
                    </>
                  ) : (
                    <>{generateInput(item, false)}</>
                  )}
                </label>
              </ContractFormField>
            ))}

            <div className="white-card-base panel gap-none">
              <CheckBox className="mt-3 ">
                <label
                  className="check-container customer-pannel hereby-acknowledge"
                  htmlFor="contract-copy-check">
                  I hereby acknowledge that I am an authorized signer on the
                  account listed above and hereby authorize payments to be made
                  to BBE using this payment method to satisfy any and all
                  invoices or bills on our account with BBE moving forward until
                  or unless further notice is provided in writing. I further
                  agree to the additional Terms & Conditions for these payment
                  and agree to the terms and conditions found{' '}
                  <span
                    className="link-url"
                    onClick={() => setShowModal(true)}
                    role="presentation">
                    here.
                  </span>
                  <input
                    type="checkbox"
                    id="contract-copy-check"
                    defaultChecked={formData.agreed}
                    onChange={(event) =>
                      setFormData({ ...formData, agreed: event.target.checked })
                    }
                  />
                  <span className="checkmark" />
                </label>
              </CheckBox>
              <Button
                className="btn-primary w-100  mt-3 mb-4"
                onClick={() => saveDetails('billing')}
                disabled={!formData.agreed}>
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
                acknowledge that I am an authorized signer, user or
                representative of the account provided and have the authority to
                set up payments against that account on a recurring basis moving
                forward. <br />
                <br /> I understand that this authorization will remain in
                effect until I cancel it in writing, and I agree to notify the
                merchant in writing of any changes in my account information or
                termination of this authorization at least 15 days prior to the
                next billing date. If the monthly billing date falls on a
                weekend or holiday, I understand that the payments may be
                executed automatically over those days or may be processed on
                the next business day. <br />
                <br /> A prorated initial billing may be charged to cover the
                dates between the signature date and the selected monthly
                billing date, if different. <br />
                <br /> For ACH debits to my checking/savings account, I
                understand that because these are electronic transactions, the
                funds may be withdrawn from my account as soon as electronic
                payment is processed. In the case of an ACH Transaction or
                Credit Card transactions being rejected for Non-Sufficient Funds
                (NSF), I understand that Buy Box Experts (“BBE”) may, at its
                discretion attempt to process the charge again within 30 days,
                and agree to an additional $25 charge for each attempt returned
                NSF which will be initiated as a separate transaction from the
                authorized recurring payment method. <br />
                <br /> I acknowledge that the origination of ACH transactions to
                my account must comply with the provisions of U.S. law. I
                certify that I am an authorized user/signer of this credit
                card/bank account and will not dispute these scheduled
                transactions with my bank or credit card company; so long as the
                transactions correspond to the terms indicated in this
                authorization form, our service agreement with BBE, and any
                invoice provided by BBE to me in conjunction with the payment.
              </div>
            </ModalBox>
          </Modal>
        </>
      ) : (
        <>{generateBillingAddressHTML()}</>
      )}
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
