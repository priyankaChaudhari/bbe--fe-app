/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import $ from 'jquery';
import axios from 'axios';
import queryString from 'query-string';
import NumberFormat from 'react-number-format';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { string, shape, bool, func, number, arrayOf } from 'prop-types';

import { userMe } from '../../store/actions';

import {
  CheckBox,
  OnBoardingBody,
  InputFormField,
  Button,
  PageLoader,
  ErrorMsg,
} from '../../common';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateUserMe,
  saveBillingInfo,
  saveDSPContact,
} from '../../api';
import {
  PATH_SUMMARY,
  PATH_THANKS,
  stepPath,
  billingInformation,
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
    billing_address: {},
    billing_contact: {},
    dsp_contact: {},
  });

  const params = queryString.parse(history.location.search);
  const [apiError, setApiError] = useState({});
  const [sameAsBillingContact, setSameAsBillingContact] = useState(true);

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
        billing_address: data.billing_address[0],
        billing_contact: data.billing_contact[0],
        dsp_contact: data.billing_contact[0],
      });
    } else {
      setFormData({
        billing_address: {},
        billing_contact: {},
        dsp_contact: {},
      });
    }
  }, [data]);

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });

    if (
      (stepData === undefined ||
        (stepData && Object.keys(stepData)?.length === 0)) &&
      verifiedStepData &&
      Object.keys(verifiedStepData)?.length === 0
    ) {
      const detail = {
        is_completed: true,
        email: userInfo.email,
        step: 'billing information',
        customer_onboarding: userInfo.customer_onboarding,
      };
      askSomeoneData(detail).then((stepResponse) => {
        if (stepResponse?.status === 201) {
          if (assignedToSomeone) {
            const stringified = queryString?.stringify({
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
            if (user?.status === 200) {
              if (assignedToSomeone) {
                localStorage.removeItem('match');
              } else dispatch(userMe());
            }
          });
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    } else {
      updateAskSomeoneData(stepData?.id || verifiedStepData.step_id, {
        token: assignedToSomeone ? params?.key : '',
        is_completed: true,
      }).then((response) => {
        if (response?.status === 200) {
          if (assignedToSomeone) {
            const stringified = queryString?.stringify({
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
            if (user?.status === 200) {
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
    if (
      (formData && formData.billing_contact.phone_number === '') ||
      (formData && formData.billing_contact.phone_number === null)
    )
      delete formData.billing_contact.phone_number;

    let details = {};

    details = {
      ...formData,
      billing_address: formData.billing_address,
      billing_contact: formData.billing_contact,
      customer_onboarding:
        userInfo.customer_onboarding || verifiedStepData.customer_onboarding_id,
      dsp_contact: sameAsBillingContact
        ? formData.billing_contact
        : formData.dsp_contact,
    };
    axios
      .all([
        saveBillingInfo(details, data?.id || null),
        saveDSPContact(
          {
            ...formData.dsp_contact,
            customer: userInfo.customer || verifiedStepData.customer_id,
          },
          formData?.dsp_contact?.id,
        ),
      ])
      .then(
        axios.spread((...res) => {
          if (
            (res?.[0]?.status === 201 || res?.[0]?.status === 200) &&
            (res?.[1]?.status === 201 || res?.[1]?.status === 200)
          ) {
            saveDetails();
            if (assignedToSomeone) {
              const stringified = queryString?.stringify({
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

          if (res?.[0]?.status === 400 || res?.[1]?.status === 400) {
            let billing = {};
            let dsp = {};
            if (res?.[0]?.status === 400) {
              billing = res?.[0]?.data;
            }
            if (res?.[1]?.status === 400) {
              dsp = res?.[1]?.data;
            }

            setIsLoading({ loader: false, type: 'button' });
            setApiError({ dsp_contact: dsp, billing_address: billing });
            if (
              (res?.data && res.data.billing_address) ||
              (res?.data && res.data[0])
            ) {
              document.body.scrollTop = 0; // For Safari
              document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            }
          }
        }),
      );
  };

  //   saveBillingInfo(details, data?.id || null).then((res) => {
  //     if (res?.status === 200 || res?.status === 201) {
  //       saveDetails();
  //       if (assignedToSomeone) {
  //         const stringified = queryString?.stringify({
  //           name: verifiedStepData.user_name,
  //         });
  //         history.push({
  //           pathname: PATH_THANKS,
  //           search: `${stringified}`,
  //         });
  //       } else {
  //         CheckStep('billing information');
  //       }
  //     }
  //     if (res?.status === 400) {
  //       setIsLoading({ loader: false, type: 'button' });
  //       setApiError(res?.data);
  //       if (
  //         (res?.data && res.data.billing_address) ||
  //         (res?.data && res.data[0])
  //       ) {
  //         document.body.scrollTop = 0; // For Safari
  //         document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  //       }
  //     }
  //   });
  // };

  const handleChange = (event, item, type) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [item.key]: event.target.value,
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

  const generateNumeric = (item, type) => {
    return (
      <NumberFormat
        format={item.format}
        className="form-control"
        onChange={(event) => handleChange(event, item, type)}
        placeholder={`Enter ${item.label}`}
        value={formData?.[type]?.[item.key]}
        isNumericString
      />
    );
  };

  const generateInput = (item, type) => {
    return (
      <input
        className="form-control"
        placeholder={`Enter ${item.label}`}
        type={item.type}
        defaultValue={data?.[type]?.[0]?.[item.key]}
        onChange={(event) => handleChange(event, item, type)}
        maxLength={item.key === 'postal_code' ? 10 : ''}
      />
    );
  };

  const checkBoxHTML = () => {
    return (
      <CheckBox className="mt-3 ">
        <label
          className="checkboxes check-container customer-pannel hereby-acknowledge"
          htmlFor="same as billing">
          Same as Billing Contact
          <input
            type="checkbox"
            id="same as billing"
            defaultChecked={sameAsBillingContact}
            onChange={() => setSameAsBillingContact(!sameAsBillingContact)}
          />
          <span className="checkmark" />
        </label>
      </CheckBox>
    );
  };

  const generateBillingAddressHTML = () => {
    return (
      <>
        {billingInformation.map((field) => (
          <fieldset className="shape-without-border  w-430 mt-3">
            <p className="account-steps m-0">{field.part}</p>
            <div className="billing-address"> {field.label}</div>
            <p className="mt-2">{field.subTitle}</p>
            {field.hasCheckbox ? (
              <div className="mt-3">{checkBoxHTML()}</div>
            ) : (
              ''
            )}
            {sameAsBillingContact && field.hasCheckbox ? (
              ''
            ) : (
              <div className="row">
                {field.array.map((item) => (
                  <div className={item.property} key={item.key}>
                    <InputFormField className="mt-3">
                      <label htmlFor={item.label}>
                        {item.label}
                        <br />
                        {item.type === 'number' ? (
                          <>{generateNumeric(item, field.key)}</>
                        ) : (
                          <>{generateInput(item, field.key)}</>
                        )}
                      </label>
                    </InputFormField>
                    <ErrorMsg>
                      {apiError?.[field.key]?.[item.key]?.[0]}
                    </ErrorMsg>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        ))}
      </>
    );
  };

  return (
    <>
      <OnBoardingBody className="body-white">
        {generateBillingAddressHTML()}

        <div className="white-card-base panel gap-none">
          {isChecked ? (
            ''
          ) : (
            <Button
              className="btn-primary w-100  mt-3 mb-4"
              onClick={() => saveBillingData()}>
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
