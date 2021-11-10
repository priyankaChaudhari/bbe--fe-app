/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import $ from 'jquery';
import queryString from 'query-string';
import NumberFormat from 'react-number-format';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { string, shape, bool, func, number, arrayOf } from 'prop-types';

import BillingTermsModal from './Modals/BillingTermsModal';
import { userMe } from '../../store/actions';
import { SecurityLock } from '../../theme/images';
import { CollapseOpenContainer } from './OnBoardingStyles';
import {
  CheckBox,
  OnBoardingBody,
  InputFormField,
  Button,
  ModalRadioCheck,
  PageLoader,
  ErrorMsg,
} from '../../common';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateUserMe,
  saveBillingInfo,
} from '../../api';
import {
  PATH_SUMMARY,
  PATH_THANKS,
  achDetails,
  billingAddress,
  creditCardDetails,
  stepPath,
  authorizeLink,
  billingTerms,
} from '../../constants';

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
  skipAmazonAccount,
  summaryDetails,
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

  const getIncompleteStep = summaryData.find(
    (op) =>
      Object.keys(op)[0] !== 'billing information' &&
      Object.values(op)[0] === false,
  );

  const CheckStep = (step) => {
    if (skipAmazonAccount) {
      history.push(PATH_SUMMARY);
    } else if (step === 'merchant id' || getIncompleteStep === undefined) {
      history.push(PATH_SUMMARY);
    } else {
      for (const item of stepPath) {
        if (Object.keys(getIncompleteStep)[0] === item.key) {
          history.push(item.view);
        }
      }
    }
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
    summaryDetails(
      userInfo.customer_onboarding || verifiedStepData.customer_onboarding_id,
    );
  };

  const saveBillingData = () => {
    setIsLoading({ loader: true, type: 'button' });
    const getYear = new Date().getFullYear().toString().substring(0, 2);
    let format = '';
    if (
      formData &&
      formData.card_details &&
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

    if (
      (formData && formData.billing_contact.phone_number === '') ||
      (formData && formData.billing_contact.phone_number === null)
    )
      delete formData.billing_contact.phone_number;
    if (data && data.id) {
      delete formData.card_details;
      delete formData.billing_contact.email;
    }
    let details = {};

    details = {
      ...formData,
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
        if (
          (res && res.data && res.data.card_details) ||
          (res && res.data && res.data[0])
        ) {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }
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
    if (item === 'expiration_date') {
      const getDate =
        data.card_details && data.card_details[0] && data.card_details[0][item]
          ? data.card_details[0][item].split('-')
          : '';
      return getDate ? `${getDate[1] + getDate[0].substring(2)}` : '****';
    }

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
            : formData && formData[type] && formData[type][item.key]
        }
        onValueChange={(values) =>
          item.key === 'card_number'
            ? handleChange(values.value, item, type)
            : ''
        }
        isNumericString
        readOnly={
          (type === 'card_details' || type === 'billing_address') &&
          data &&
          data.id
        }
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
          <input type="radio" name="radio" id={item.key} readOnly />
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
        maxLength={item.key === 'postal_code' ? 10 : ''}
        readOnly={
          (type === 'card_details' ||
            type === 'billing_address' ||
            item.key === 'email') &&
          data &&
          data.id
        }
      />
    );
  };

  const generatePayment = () => {
    if (formData.ach) {
      return (
        <>
          {achDetails.map((item) => (
            <React.Fragment key={item.key}>
              <InputFormField
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
              </InputFormField>
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
          <div className="row">
            {item &&
              item.details.map((field) => (
                <div className={field.property} key={field.key}>
                  <InputFormField className="mt-3">
                    <label htmlFor={field.label}>
                      {field.label}
                      <br />
                      {field.type === 'number' ? (
                        <>{generateNumeric(field, 'card_details')}</>
                      ) : (
                        <>{generateInput(field, 'card_details')}</>
                      )}
                    </label>
                  </InputFormField>
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
      </div>
    ));
  };

  const generateBillingAddressHTML = () => {
    return (
      <>
        <fieldset
          className="shape-without-border  w-430 mt-3"
          style={{ opacity: data && data.id ? 0.5 : '' }}>
          <p className="account-steps m-0">Part 2</p>
          <div className="billing-address"> Billing Address </div>
          <div className="row">
            {billingAddress
              .filter((op) => op.section === 'address')
              .map((item) => (
                <div className={item.property} key={item.key}>
                  <InputFormField className="mt-3">
                    <label htmlFor={item.label}>
                      {item.label}
                      <br />
                      {item.type === 'number' ? (
                        <>{generateNumeric(item, 'billing_address')}</>
                      ) : (
                        <>{generateInput(item, 'billing_address')}</>
                      )}
                    </label>
                  </InputFormField>
                  <ErrorMsg>
                    {apiError &&
                      apiError.billing_address &&
                      apiError.billing_address[item.key] &&
                      apiError.billing_address[item.key][0]}
                  </ErrorMsg>
                </div>
              ))}
          </div>
        </fieldset>

        <fieldset className="shape-without-border  w-430 mt-3 mb-2">
          <p className="account-steps m-0">Part 3</p>
          <div className="billing-address">Billing Contact</div>
          <div className="row">
            {billingAddress
              .filter((op) => op.section === 'contact')
              .map((item) => (
                <div
                  className={item.property}
                  key={item.key}
                  style={{
                    opacity: data && data.id && item.key === 'email' ? 0.5 : '',
                  }}>
                  <InputFormField className="mt-3">
                    <label htmlFor={item.label}>
                      {item.label}
                      <br />
                      {item.type === 'number' ? (
                        <>{generateNumeric(item, 'billing_contact')}</>
                      ) : (
                        <>{generateInput(item, 'billing_contact')}</>
                      )}
                    </label>
                  </InputFormField>
                  <ErrorMsg>
                    {apiError &&
                      apiError.billing_contact &&
                      apiError.billing_contact[item.key] &&
                      apiError.billing_contact[item.key][0]}
                  </ErrorMsg>
                </div>
              ))}
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
          <p className="account-steps m-0">Payment Type</p>
          <ul className="payment-type">
            <li>
              {/* <label
                className="radio-container  contact-billing"
                htmlFor="card">
                Credit Card
              </label> */}
              Credit Card
            </li>
          </ul>

          <CollapseOpenContainer>{generatePayment()}</CollapseOpenContainer>

          <img
            className=" mt-2 pt-1"
            width="16px"
            src={SecurityLock}
            alt="lock"
          />
          <p className="info-text-gray security mb-0">
            {' '}
            We have partnered with{' '}
            <a
              className="cursor link-url"
              style={{ fontSize: '12px' }}
              href={authorizeLink}
              target="_BLANK"
              rel="noopener noreferrer">
              Authorize.Net
            </a>
            , to capture your credit card payment information safely and
            securely.
          </p>

          <div className="clear-fix" />
          <ErrorMsg>{apiError && apiError[0]}</ErrorMsg>
        </fieldset>
        {generateBillingAddressHTML()}

        <div className="white-card-base panel gap-none">
          <CheckBox className="mt-3 ">
            <label
              className="checkboxes check-container customer-pannel hereby-acknowledge"
              htmlFor="contract-copy-check">
              {billingTerms}
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
      <BillingTermsModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

BillingInfo.defaultProps = {
  stepData: {},
  summaryDetails: () => {},
};

BillingInfo.propTypes = {
  userInfo: shape({
    id: string,
    email: string,
    customer: string,
    customer_onboarding: string,
    step: shape({
      step: number,
    }),
  }).isRequired,
  setIsLoading: func.isRequired,
  assignedToSomeone: bool.isRequired,
  stepData: shape({
    id: string,
  }),
  verifiedStepData: shape(
    shape({
      user_name: string,
    }),
  ).isRequired,
  isLoading: shape({
    loader: bool,
    type: string,
  }).isRequired,
  data: shape({
    id: string,
    card_details: shape({}),
    billing_address: shape({
      address: string,
    }),
    billing_contact: shape({
      first_name: string,
    }),
  }).isRequired,
  isChecked: bool.isRequired,
  summaryData: arrayOf(shape({})).isRequired,
  skipAmazonAccount: bool.isRequired,
  summaryDetails: func,
};
