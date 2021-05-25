/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import queryString from 'query-string';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import $ from 'jquery';

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
import { CloseIcon, SecurityLock } from '../../theme/images';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateUserMe,
  saveBillingInfo,
} from '../../api';
import { PATH_SUMMARY, PATH_THANKS } from '../../constants';
import { userMe } from '../../store/actions';
import {
  ACHDetails,
  BillingAddress,
  creditCardDetails,
  stepPath,
  // PaymentType,
} from '../../constants/FieldConstants';

export default function BillingInfo({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  isLoading,
  data,
  isChecked,
  summaryData,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ach: false,
    credit_card: true,
    billing_address: {},
    billing_contact: {},
    agreed: false,
    card_details: {},
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

  const getIncompleteStep = summaryData.find(
    (op) =>
      Object.keys(op)[0] !== 'billing information' &&
      Object.values(op)[0] === false,
  );

  const CheckStep = (step) => {
    setIsLoading({ loader: true, type: 'button' });
    if (step === 'merchant id' || getIncompleteStep === undefined) {
      history.push(PATH_SUMMARY);
    } else {
      for (const item of stepPath) {
        if (Object.keys(getIncompleteStep)[0] === item.key) {
          history.push(item.view);
        }
      }
    }
    setIsLoading({ loader: false, type: 'button' });
  };

  useEffect(() => {
    if (data && data.id) {
      $('.checkboxes input:checkbox').prop('checked', true);
      setFormData({
        ...formData,
        agreed: true,
        billing_address: data.billing_address[0],
        billing_contact: data.billing_contact[0],
        card_details: data.card_details[0],
      });
    } else {
      setFormData({
        ach: false,
        credit_card: true,
        billing_address: {},
        billing_contact: {},
        agreed: false,
        card_details: {},
      });
    }
  }, [data]);

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
            CheckStep('billing information');
            // history.push(PATH_BILLING_DETAILS);
          }
          updateUserMe(userInfo.id || verifiedStepData.user_id, {
            step: {
              ...(userInfo.step || verifiedStepData.user_step),
              [userInfo.customer || verifiedStepData.customer_id]: 3,
            },
          }).then((user) => {
            if (user && user.status === 200) {
              if (assignedToSomeone) {
                localStorage.removeItem('match');
              } else dispatch(userMe());
            }
          });
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
            CheckStep('billing information');
            // history.push(PATH_AMAZON_MERCHANT);
          }
          updateUserMe(userInfo.id || verifiedStepData.user_id, {
            step: {
              ...(userInfo.step || verifiedStepData.user_step),
              [userInfo.customer || verifiedStepData.customer_id]: 3,
            },
          }).then((user) => {
            if (user && user.status === 200) {
              if (assignedToSomeone) {
                localStorage.removeItem('match');
              } else dispatch(userMe());
            }
          });
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    }
  };

  const saveBillingData = () => {
    setIsLoading({ loader: true, type: 'button' });
    const getYear = new Date().getFullYear().toString().substring(0, 2);
    let format = '';
    if (
      formData.card_details.expiration_date &&
      !formData.card_details.expiration_date.includes(getYear)
    ) {
      format = formData.card_details.expiration_date.split('/');
      formData.card_details.expiration_date = `${getYear + format[1]}-${
        format[0]
      }`;
    }
    delete formData.agreed;
    delete formData.ach;
    delete formData.credit_card;
    if (data && data.id) delete formData.card_details;
    let details = {};

    details = {
      ...formData,
      // payment_type: formData.ach ? 'ach' : 'credit card',
      payment_type: 'credit card',
      billing_address: formData.billing_address,
      billing_contact: formData.billing_contact,
      card_details: formData.card_details,
      customer_onboarding:
        userInfo.customer_onboarding || verifiedStepData.customer_onboarding_id,
    };
    saveBillingInfo(details, (data && data.id) || null).then((res) => {
      if ((res && res.status === 200) || (res && res.status === 201)) {
        saveDetails();
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
          CheckStep('billing information');
        }
      }
      if (res && res.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
        setApiError(res && res.data);
        setFormData({ ...formData, agreed: false });
        $('.checkboxes input:checkbox').prop('checked', false);
      }
    });
  };

  const handleChange = (event, item, type) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [item.key]: item.key === 'card_number' ? event : event.target.value,
      },
    });

    setApiError({
      ...apiError,
      [type]: {
        ...apiError[type],
        [item.key]: '',
      },
      0: '',
    });
  };

  const mapDetails = (item) => {
    if (item === 'card_number')
      return `************${
        data.card_details && data.card_details[0] && data.card_details[0][item]
      }`;
    if (item === 'expiration_date') return '****';
    return '';
  };

  const generateNumeric = (item, type) => {
    return (
      <NumberFormat
        format={item.format}
        className="form-control"
        onChange={(event) =>
          item.key !== 'card_number' ? handleChange(event, item, type) : ''
        }
        placeholder={
          item.key === 'expiration_date'
            ? `Enter ${item.label} (MM/YY)`
            : `Enter ${item.label}`
        }
        value={
          type === 'card_details' && data && data.id
            ? mapDetails(item.key)
            : item.key === 'expiration_date'
            ? [formData.type][item.key]
            : formData[type][item.key]
        }
        onValueChange={(values) =>
          item.key === 'card_number'
            ? handleChange(values.value, item, type)
            : ''
        }
        isNumericString
        readOnly={type === 'card_details' && data && data.id}
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
            // onChange={(event) => {
            //   setFormData({
            //     ...formData,
            //     credit_card_type: event.target.checked ? item.key : '',
            //   });
            // }}
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
        defaultValue={
          data && data[type] && data[type][0] && data[type][0][item.key]
        }
        onChange={(event) => handleChange(event, item, type)}
        readOnly={type === 'card_details' && data && data.id}
      />
    );
  };

  const generatePayment = () => {
    if (formData.ach) {
      return (
        <>
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
        </>
      );
    }
    return creditCardDetails.map((item) => (
      <div key={item.key} style={{ opacity: data && data.id ? 0.5 : '' }}>
        <div className="inner-content">
          {/* <p className="account-steps m-0">Credit Card Type</p> */}
          {/* <ul className="payment-option">
            {item &&
              item.choices.map((field) => (
                <li key={field.key}>{generateRadio(field)}</li>
              ))}
          </ul> */}
          <div className="row">
            {item &&
              item.details.map((field) => (
                <div className={field.property} key={field.key}>
                  <ContractFormField className="mt-3">
                    <label htmlFor={field.label}>
                      {field.label}
                      <br />
                      {field.type === 'number' ? (
                        <>{generateNumeric(field, 'card_details')}</>
                      ) : (
                        <>{generateInput(field, 'card_details')}</>
                      )}
                    </label>
                  </ContractFormField>
                  <ErrorMsg>
                    {apiError &&
                      apiError.card_details &&
                      apiError.card_details[field.key] &&
                      apiError.card_details[field.key][0]}
                  </ErrorMsg>
                </div>
              ))}
          </div>
        </div>
        <ErrorMsg>{apiError && apiError[0]}</ErrorMsg>
      </div>
    ));
  };

  const generateBillingAddressHTML = () => {
    return (
      <>
        <fieldset className="shape-without-border  w-430 mt-3">
          <p className="account-steps m-0">Part 2</p>
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
                        <>{generateNumeric(item, 'billing_address')}</>
                      ) : (
                        <>{generateInput(item, 'billing_address')}</>
                      )}
                    </label>
                  </ContractFormField>
                  <ErrorMsg>
                    {apiError &&
                      apiError.billing_address &&
                      apiError.billing_address[item.key] &&
                      apiError.billing_address[item.key][0]}
                  </ErrorMsg>
                </div>
              ),
            )}
          </div>
        </fieldset>

        <fieldset className="shape-without-border  w-430 mt-3 mb-2">
          <p className="account-steps m-0">Part 3</p>
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
                        <>{generateNumeric(item, 'billing_contact')}</>
                      ) : (
                        <>{generateInput(item, 'billing_contact')}</>
                      )}
                    </label>
                  </ContractFormField>
                  <ErrorMsg>
                    {apiError &&
                      apiError.billing_contact &&
                      apiError.billing_contact[item.key] &&
                      apiError.billing_contact[item.key][0]}
                  </ErrorMsg>
                </div>
              ),
            )}
          </div>
        </fieldset>
      </>
    );
  };

  return (
    <>
      <OnBoardingBody className="body-white">
        <fieldset className="shape-without-border  w-430 mt-3">
          <p className="account-steps m-0">Part 1</p>
          <div className="billing-address mb-3 pb-1"> Payment Type </div>
          {/* <p className="account-steps m-0">Payment Type</p> */}
          <p className="account-steps m-0">Payment Type</p>
          <ul className="payment-type">
            <li>
              <label
                className="radio-container  contact-billing"
                htmlFor="card">
                Credit Card
              </label>
            </li>

            {/* {PaymentType.map((item) => (
              <li key={item.key}>
                <ModalRadioCheck className="mt-1">
                  <label
                    className="radio-container  contact-billing "
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
                    <span className="checkmark checkmark-top" />
                  </label>
                </ModalRadioCheck>
              </li>
            ))} */}
          </ul>
          {/* <p className="text-verify-account mb-0">
            To verify your bank account we’ll be making a small charge
            (typically less than $1) to your account from Buy Box Experts. It
            can take up to 3 days to process this charge. You’ll then receive an
            email from us, asking you to enter the amount charged to complete
            the process. The charge will then be refunded to you.
          </p> */}

          <CollapseOpenContainer>{generatePayment()}</CollapseOpenContainer>
          <img
            className=" mt-2 pt-1"
            width="16px"
            src={SecurityLock}
            alt="lock"
          />
          <p className="info-text-gray security">
            {' '}
            We have partnered with Authorize.Net (link), to capture your credit
            card payment information safely and securely.
          </p>
        </fieldset>
        {generateBillingAddressHTML()}

        <div className="white-card-base panel gap-none">
          <CheckBox className="mt-3 ">
            <label
              className="checkboxes check-container customer-pannel hereby-acknowledge"
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
          {isChecked ? (
            ''
          ) : (
            <Button
              className="btn-primary w-100  mt-3 mb-4"
              onClick={() => saveBillingData()}
              disabled={!formData.agreed}>
              {' '}
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                <>{assignedToSomeone ? 'Submit' : 'Continue'} </>
              )}
            </Button>
          )}
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
  data: PropTypes.shape({
    id: PropTypes.string,
    card_details: PropTypes.objectOf(PropTypes.object),
    billing_address: PropTypes.shape({
      address: PropTypes.string,
    }),
    billing_contact: PropTypes.shape({
      first_name: PropTypes.string,
    }),
  }).isRequired,
  isChecked: PropTypes.bool.isRequired,
  summaryData: PropTypes.arrayOf(PropTypes.object).isRequired,
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
        margin-bottom: 7px;
        &:last-child {
          margin-right: 0px;
          margin-bottom: 0px;
        }
        .card {
          width: 18px;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
    }
  }
`;
