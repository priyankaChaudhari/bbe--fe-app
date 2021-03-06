import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { string, shape, bool, func } from 'prop-types';

import { EditOrangeIcon } from '../../theme/images';
import {
  askSomeoneData,
  updateAskSomeoneData,
  editCustomerEmail,
} from '../../api';
import {
  Button,
  CheckBox,
  InputFormField,
  ErrorMsg,
  PageLoader,
} from '../../common';

export default function AskSomeone({
  setIsChecked,
  isChecked,
  step,
  setIsLoading,
  isLoading,
  stepData,
  setStepData,
  userInfo,
  setDisableBtn,
  setOpenCollapse,
  noAmazonAccount,
  accountType,
}) {
  const [formData, setFormData] = useState({});
  const [apiError, setApiError] = useState({});
  const [editEmail, setEditEmail] = useState(false);

  useEffect(() => {
    if (
      stepData &&
      stepData.email !== '' &&
      stepData.step === step &&
      stepData.email !== userInfo.email
    ) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [stepData, setIsChecked, step, userInfo]);

  const handleChanges = (event) => {
    setOpenCollapse(false);
    if (event.target.checked) {
      setIsChecked(true);
      setDisableBtn(true);
    } else {
      setIsLoading({ loader: true, type: 'check' });
      setIsChecked(false);
      setFormData({});
      if (stepData && stepData.step === step && stepData && stepData.id) {
        updateAskSomeoneData(stepData.id, {
          email: userInfo && userInfo.email,
        }).then((res) => {
          if (res && res.status === 200) {
            setStepData(res && res.data);
            setIsLoading({ loader: false, type: 'check' });
            setEditEmail(false);
          }
          if (res && res.status === 400) {
            setApiError(res && res.data);
            setIsLoading({ loader: false, type: 'check' });
          }
        });
      } else {
        const data = {
          email: userInfo && userInfo.email,
          customer_onboarding: userInfo && userInfo.customer_onboarding,
          step,
        };
        askSomeoneData(data).then((response) => {
          if (response && response.status === 201) {
            setStepData(response && response.data);
            setIsLoading({ loader: false, type: 'check' });
          }
          if (response && response.status === 400) {
            setApiError(response && response.data);
            setIsLoading({ loader: false, type: 'check' });
          }
        });
      }
    }
    setApiError({});
  };

  const sendEmail = () => {
    setIsLoading({ loader: true, type: 'email' });

    if (
      stepData &&
      stepData.step === step &&
      stepData &&
      stepData.id &&
      stepData.email === ''
    ) {
      updateAskSomeoneData(stepData.id, { email: formData.email }).then(
        (res) => {
          if (res && res.status === 200) {
            setStepData(res && res.data);
            toast.success('Request Sent Successfully!');
            setIsLoading({ loader: false, type: 'email' });
            setEditEmail(false);
            setDisableBtn(false);
          }
          if (res && res.status === 400) {
            setApiError(res && res.data);
            setIsLoading({ loader: false, type: 'email' });
            setDisableBtn(false);
          }
        },
      );
    } else if (
      stepData &&
      stepData.step === step &&
      stepData &&
      stepData.id &&
      stepData.email !== ''
    ) {
      editCustomerEmail({
        email: formData.email,
        step_assigned_id: stepData.id,
      }).then((res) => {
        if (res && res.status === 200) {
          setStepData(res && res.data);
          toast.success('Request Sent Successfully!');
          setIsLoading({ loader: false, type: 'email' });
          setEditEmail(false);
          setDisableBtn(false);
        }
        if (res && res.status === 400) {
          setApiError(res && res.data);
          setIsLoading({ loader: false, type: 'email' });
          setDisableBtn(false);
        }
      });
    } else {
      const data = {
        ...formData,
        customer_onboarding: userInfo && userInfo.customer_onboarding,
        step,
      };
      if (step === 'digital presence') {
        askSomeoneData({
          is_completed: false,
          email: '',
          step: 'billing information',
          customer_onboarding: userInfo && userInfo.customer_onboarding,
        });
      }
      askSomeoneData(data).then((response) => {
        if (response && response.status === 201) {
          setStepData(response && response.data);
          toast.success('Request Sent Successfully!');
          setIsLoading({ loader: false, type: 'email' });
          setDisableBtn(false);
        }
        if (response && response.status === 400) {
          setApiError(response && response.data);
          setIsLoading({ loader: false, type: 'email' });
          setDisableBtn(false);
        }
      });
    }
  };

  return (
    <>
      <CheckBox
        className={
          (isLoading.loader && isLoading.type === 'check') ||
          (accountType === 'Hybrid'
            ? noAmazonAccount &&
              (stepData.email === undefined ||
                stepData.email === '' ||
                stepData.email === userInfo.email) &&
              stepData.is_completed
            : noAmazonAccount && !isChecked)
            ? 'mt-1 mb-4 isDisabled'
            : 'mt-1 mb-4'
        }>
        <label className="check-container customer-pannel" htmlFor={step}>
          Ask someone else to complete this section
          <input
            type="checkbox"
            id={step}
            name={step}
            onChange={(event) => handleChanges(event)}
            defaultChecked={
              stepData &&
              stepData.email !== '' &&
              stepData.email !== userInfo.email &&
              stepData.step === step
            }
            readOnly
          />
          <span className="checkmark" />
        </label>
      </CheckBox>

      {isChecked ||
      (stepData &&
        stepData.email !== '' &&
        stepData.step === step &&
        stepData.email !== userInfo.email) ? (
        <fieldset className="shape-without-border w-430 mt-2">
          <InputFormField>
            <label htmlFor="email">
              Assign to (email)
              <input
                className="form-control"
                onChange={(event) => {
                  setFormData({ email: event.target.value });
                  setApiError({ email: '' });
                }}
                readOnly={
                  !editEmail &&
                  stepData &&
                  stepData.email !== '' &&
                  stepData.step === step &&
                  stepData.email !== userInfo.email
                }
                defaultValue={
                  stepData &&
                  stepData.email !== '' &&
                  stepData.step === step &&
                  stepData.email !== userInfo.email
                    ? stepData && stepData.email
                    : ''
                }
              />
            </label>
            <ErrorMsg>
              {apiError && apiError.email && apiError.email[0]}
            </ErrorMsg>
            {stepData.email !== '' &&
            stepData.step === step &&
            stepData.email !== userInfo.email ? (
              <span
                className={
                  isLoading.loader && isLoading.type === 'check'
                    ? 'edit-field cursor isDisabled'
                    : 'edit-field cursor'
                }
                role="presentation"
                onClick={() => {
                  setEditEmail(true);
                  setDisableBtn(true);
                }}>
                <img className="edit-icon" src={EditOrangeIcon} alt="edit" />{' '}
                Edit email address
              </span>
            ) : (
              ''
            )}
          </InputFormField>
          {!editEmail &&
          stepData &&
          stepData.email !== '' &&
          stepData.step === step &&
          stepData.email !== userInfo.email ? (
            <p className="info-text-gray m-0 pt-3 ">
              We???ve emailed them a link to submit the information in this
              section.
            </p>
          ) : (
            <>
              <p className="info-text-gray m-0 pt-3 ">
                We???ll email them a link to submit the information in this
                section.
              </p>
              <Button
                className="btn-primary w-100  mt-3"
                onClick={() => sendEmail()}
                disabled={
                  formData.email === '' || formData.email === undefined
                }>
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
  setDisableBtn: () => {},
  setOpenCollapse: () => {},
  noAmazonAccount: false,
  accountType: null,
};

AskSomeone.propTypes = {
  userInfo: shape({
    email: string,
    customer_onboarding: string,
  }).isRequired,
  isChecked: bool.isRequired,
  setIsChecked: func,
  step: string,
  setIsLoading: func,
  isLoading: shape({
    loader: bool,
    type: string,
  }).isRequired,
  setStepData: func,
  stepData: shape({
    id: string,
    email: string,
    step: string,
    is_completed: bool,
  }),
  setDisableBtn: func,
  setOpenCollapse: func,
  noAmazonAccount: bool,
  accountType: string,
};
