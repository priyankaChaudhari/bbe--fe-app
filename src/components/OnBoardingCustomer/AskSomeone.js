import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Button, CheckBox, ContractFormField, PageLoader } from '../../common';
import { askSomeoneData } from '../../api';

export default function AskSomeone({
  setIsChecked,
  isChecked,
  step,
  setIsLoading,
  isLoading,
  stepData,
  setStepData,
  userInfo,
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (
      stepData &&
      stepData.step === step &&
      stepData.email !== userInfo.email
    ) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [stepData, setIsChecked, step, userInfo]);

  const handleChanges = (event) => {
    if (event.target.checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  const sendEmail = () => {
    setIsLoading({ loader: true, type: 'email' });

    const data = {
      ...formData,
      customer_onboarding: 'CBZQuki',
      step,
    };
    askSomeoneData(data).then((response) => {
      if (response && response.status === 201) {
        setStepData(response && response.data);
        toast.success('Request Sent Successfully!');
        setIsLoading({ loader: false, type: 'email' });
      }
      if (response && response.status === 400) {
        setIsLoading({ loader: false, type: 'email' });
      }
    });
  };

  return (
    <>
      <CheckBox className="mt-1">
        <label className="check-container customer-pannel " htmlFor={step}>
          Ask someone else to complete this section
          <input
            type="checkbox"
            id={step}
            name={step}
            onChange={(event) => handleChanges(event)}
            checked={
              stepData &&
              stepData.email !== userInfo.email &&
              stepData.step === step
            }
            // disabled={
            //   stepData && stepData.step === step && stepData.is_completed
            // }
            readOnly
          />
          <span className="checkmark" />
        </label>
      </CheckBox>
      {isChecked ||
      (stepData &&
        stepData.step === step &&
        stepData.email !== userInfo.email) ? (
        <fieldset className="shape-without-border w-430 mt-4">
          <ContractFormField>
            <label htmlFor="email">
              Assign to (email)
              <input
                className="form-control"
                onChange={(event) => setFormData({ email: event.target.value })}
                readOnly={
                  stepData &&
                  stepData.step === step &&
                  stepData.email !== userInfo.email
                }
                defaultValue={
                  stepData &&
                  stepData.step === step &&
                  stepData.email !== userInfo.email
                    ? stepData && stepData.email
                    : ''
                }
              />
            </label>
          </ContractFormField>
          {stepData && stepData.step === step ? (
            <p className="info-text-gray m-0 pt-3 ">
              We’ve emailed them a link to submit the information in this
              section.
            </p>
          ) : (
            <>
              <p className="info-text-gray m-0 pt-3 ">
                We’ll email them a link to submit the information in this
                section.
              </p>
              <Button
                className="btn-primary w-100  mt-3"
                onClick={() => sendEmail()}>
                {isLoading.loader && isLoading.type === 'email' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Send Email'
                )}
              </Button>
            </>
          )}
        </fieldset>
      ) : (
        ''
      )}
    </>
  );
}

AskSomeone.defaultProps = {
  setIsChecked: () => {},
  step: '',
  setIsLoading: () => {},
  setStepData: () => {},
  stepData: {},
};

AskSomeone.propTypes = {
  userInfo: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
  isChecked: PropTypes.bool.isRequired,
  setIsChecked: PropTypes.func,
  step: PropTypes.string,
  setIsLoading: PropTypes.func,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  setStepData: PropTypes.func,
  stepData: PropTypes.objectOf(PropTypes.object),
};
