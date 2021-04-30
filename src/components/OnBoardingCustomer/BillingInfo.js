import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import queryString from 'query-string';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
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
  ErrorMsg,
} from '../../common';
import { CloseIcon } from '../../theme/images';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateUserMe,
  saveBillingInfo,
} from '../../api';
import { PATH_AMAZON_MERCHANT, PATH_THANKS } from '../../constants';
import { userMe } from '../../store/actions';
import {
  ACHDetails,
  BillingAddress,
  creditCardDetails,
  PaymentType,
} from '../../constants/FieldConstants';

export default function BillingInfo({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  isLoading,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ach: true,
    credit_card: false,
    billing_address: {},
    billing_contact: {},
  });

  const [showModal, setShowModal] = useState(false);
  const params = queryString.parse(history.location.search);
  const [apiError, setApiError] = useState({});

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
        step: 'billing information',
        customer_onboarding: userInfo.customer_onboarding,
      };
      askSomeoneData(detail).then((stepResponse) => {
        if (stepResponse && stepResponse.status === 201) {
          const details = {
            payment_type: formData.ach ? 'ach' : 'credit_card',
            billing_address: formData.billing_address,
            billing_contact: formData.billing_contact,
            step: stepResponse && stepResponse.data && stepResponse.data.id,
          };
          saveBillingInfo(details).then((response) => {
            if (response && response.status === 201) {
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
                step: { ...userInfo.step, [userInfo.customer]: 4 },
              }).then((user) => {
                if (user && user.status === 200) {
                  dispatch(userMe());
                }
              });
              localStorage.removeItem('match');
              setIsLoading({ loader: false, type: 'button' });
            }
            if (response && response.status === 400) {
              setApiError(response && response.data);
            }
          });
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
          const details = {
            payment_type: formData.ach ? 'ach' : 'credit_card',
            billing_address: formData.billing_address,
            billing_contact: formData.billing_contact,
            step: stepData.id,
          };
          saveBillingInfo(details).then((res) => {
            if (res && res.status === 200) {
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
            }
            if (res && res.status === 400) {
              setApiError(res && res.data);
            }
          });

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
        onChange={(event) => {
          if (type === 'address') {
            setFormData({
              ...formData,
              billing_address: {
                ...formData.billing_address,
                [item.key]: event.target.value,
              },
            });
          } else if (type === 'contact') {
            setFormData({
              ...formData,
              billing_contact: {
                ...formData.billing_contact,
                [item.key]: event.target.value,
              },
            });
          } else {
            setFormData({ ...formData, [item.key]: event.target.value });
          }
        }}
        placeholder={`Enter ${item.label}`}
        value={formData[item.key]}
      />
    );
  };

  const generateRadio = (item) => {
    return (
      <ModalRadioCheck className="mt-1">
        <label className="radio-container contact-billing" htmlFor={item.key}>
          <img className="card" src={item.icon} alt="card" />

          {item.label}
          <br />
          <input
            type="radio"
            name="radio"
            id={item.key}
            onChange={(event) => {
              setFormData({
                ...formData,
                [item.key]: event.target.checked,
              });
            }}
            readOnly
          />
          <span className="checkmark" />
        </label>
      </ModalRadioCheck>
    );
  };

  const generateInput = (item, type) => {
    return (
      <input
        className="form-control"
        placeholder={`Enter ${item.label}`}
        type={item.type}
        defaultValue={formData[item.key]}
        onChange={(event) => {
          if (type === 'address') {
            setFormData({
              ...formData,
              billing_address: {
                ...formData.billing_address,
                [item.key]: event.target.value,
              },
            });
          } else if (type === 'contact') {
            setFormData({
              ...formData,
              billing_contact: {
                ...formData.billing_contact,
                [item.key]: event.target.value,
              },
            });
          } else {
            setFormData({
              ...formData,
              [item.key]: event.target.value,
            });
          }
        }}
      />
    );
  };

  const generatePayment = () => {
    if (formData.ach) {
      return (
        <fieldset className="shape-without-border  w-430 mt-4 mb-4">
          {ACHDetails.map((item) => (
            <React.Fragment key={item.key}>
              <ContractFormField
                className={item.key !== 'account_name' ? 'mt-3' : ''}>
                <label htmlFor={item.label}>
                  {item.label}
                  {item.type === 'number' ? (
                    <>{generateNumeric(item)}</>
                  ) : item.type === 'checkbox' ? (
                    <>{generateRadio(item)}</>
                  ) : (
                    <>{generateInput(item)}</>
                  )}
                </label>
              </ContractFormField>
              <ErrorMsg>
                {apiError && apiError[item.key] && apiError[item.key][0]}
              </ErrorMsg>
            </React.Fragment>
          ))}
        </fieldset>
      );
    }
    return creditCardDetails.map((item) => (
      <fieldset
        className="shape-without-border  w-430 mt-4 mb-4"
        key={item.key}>
        <div className="inner-content">
          <div className="label-title mb-2">Credit Card Type</div>
          <ul className="payment-option">
            {item &&
              item.choices.map((field) => (
                <li key={field.key}>{generateRadio(field)}</li>
              ))}
          </ul>
          <div className="row">
            {item &&
              item.details.map((field) => (
                <div className={field.property} key={field.key}>
                  <ContractFormField className="mt-3">
                    <label htmlFor={field.label}>
                      {field.label}
                      <br />
                      {field.type === 'number' ? (
                        <>{generateNumeric(field)}</>
                      ) : (
                        <>{generateInput(field)}</>
                      )}
                    </label>
                  </ContractFormField>
                  <ErrorMsg>
                    {apiError && apiError[item.key] && apiError[item.key][0]}
                  </ErrorMsg>
                </div>
              ))}
          </div>
        </div>
      </fieldset>
    ));
  };

  const generateBillingAddressHTML = () => {
    return (
      <>
        <div className=" straight-line horizontal-line mt-2 mb-3" />
        <div className="billing-address"> Billing Address </div>
        <div className="row">
          {BillingAddress.filter((op) => op.section === 'address').map(
            (item) => (
              <div className={item.property} key={item.key}>
                <ContractFormField className="mt-3">
                  <label htmlFor={item.label}>
                    {item.label}
                    <br />
                    {item.type === 'number' ? (
                      <>{generateNumeric(item, 'address')}</>
                    ) : (
                      <>{generateInput(item, 'address')}</>
                    )}
                  </label>
                </ContractFormField>
                <ErrorMsg>
                  {apiError && apiError[item.key] && apiError[item.key][0]}
                </ErrorMsg>
              </div>
            ),
          )}
        </div>

        <br />
        <div className=" straight-line horizontal-line mt-1 mb-3" />
        <div className="billing-address">Billing Contact</div>
        <div className="row">
          {BillingAddress.filter((op) => op.section === 'contact').map(
            (item) => (
              <div className={item.property} key={item.key}>
                <ContractFormField className="mt-3">
                  <label htmlFor={item.label}>
                    {item.label}
                    <br />
                    {item.type === 'number' ? (
                      <>{generateNumeric(item, 'contact')}</>
                    ) : (
                      <>{generateInput(item, 'contact')}</>
                    )}
                  </label>
                </ContractFormField>
                <ErrorMsg>
                  {apiError && apiError[item.key] && apiError[item.key][0]}
                </ErrorMsg>
              </div>
            ),
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <OnBoardingBody className="body-white">
        <div className="billing-address"> Payment Type </div>
        <div className="row">
          {PaymentType.map((item) => (
            <div className="col-4" key={item.key}>
              <ModalRadioCheck className="mt-1">
                <label
                  className="radio-container contact-billing"
                  htmlFor={item.key}>
                  {item.label}
                  <br />
                  <input
                    type="radio"
                    name="radio1"
                    id={item.key}
                    defaultChecked={formData[item.key]}
                    onChange={() => {
                      setFormData({
                        ...formData,
                        ach: !formData.ach,
                        credit_card: !formData.credit_card,
                      });
                    }}
                    readOnly
                  />
                  <span className="checkmark" />
                </label>
              </ModalRadioCheck>
            </div>
          ))}
        </div>

        <CollapseOpenContainer>{generatePayment()}</CollapseOpenContainer>

        {generateBillingAddressHTML()}
        <br />
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
            onClick={() => saveDetails()}
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
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
};

const CollapseOpenContainer = styled.div`
  max-width: 430px !important;
  margin: 0 auto;
  .inner-content {
    background-color: ${Theme.white};
    padding: 4px 0px 4px 0px;
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
`;
