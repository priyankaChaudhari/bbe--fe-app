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
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (stepData && stepData.step === step) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [stepData, setIsChecked, step]);

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
            defaultChecked={stepData && stepData.step === step}
            disabled={
              stepData && stepData.step === step && stepData.is_completed
            }
            readOnly
          />
          <span className="checkmark" />
        </label>
      </CheckBox>
      {isChecked || (stepData && stepData.step === step) ? (
        <fieldset className="shape-without-border w-430 mt-4">
          <ContractFormField>
            <label htmlFor="email">
              Assign to (email)
              <input
                className="form-control"
                onChange={(event) => setFormData({ email: event.target.value })}
                readOnly={stepData && stepData.step === step}
                defaultValue={
                  stepData && stepData.step === step
                    ? stepData && stepData.email
                    : ''
                }
              />
            </label>
            {/* <span className="edit-field">
              <img className="edit-icon" src={EditOrangeIcon} alt="edit" /> Edit
              email address
            </span> */}
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
  stepData: [],
};

AskSomeone.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  setIsChecked: PropTypes.func,
  step: PropTypes.string,
  setIsLoading: PropTypes.func,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  setStepData: PropTypes.func,
  stepData: PropTypes.arrayOf(PropTypes.array),
};
