import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import queryString from 'query-string';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';

import {
  Button,
  ContractFormField,
  ErrorMsg,
  OnBoardingBody,
  PageLoader,
  UnauthorizedHeader,
} from '../../common';
import { resetPassword, updateOnBoardCustomer } from '../../api';
import { login } from '../../store/actions/userState';
import NavigationHeader from './NavigationHeader';

export default function CreateAccount() {
  const { register, handleSubmit, errors, watch } = useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const loader = useSelector((state) => state.userState.isLoading);
  const [apiError, setApiError] = useState({});
  const [formData, setFormData] = useState({});
  const params = queryString.parse(history.location.search);
  const [assignTo, setAssignTo] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [getEmail, setGetEmail] = useState('');
  const newDetails = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 're_assigned_user_email', label: 'Email Address' },
    { key: 'confirm_email', label: 'Confirm Email Address' },
  ];

  useEffect(() => {
    if (params && params.type && params.type === 'new') {
      setAssignTo(true);
    } else {
      setAssignTo(false);
    }
  }, [params]);

  const savePassword = () => {
    setIsLoading({ loader: true, type: 'button' });
    const data = {
      ...formData,
      key: params.key,
    };
    const loginData = {
      ...formData,
      email: localStorage.getItem('email') || (params && params.email),
    };

    resetPassword(data).then((response) => {
      if (response && response.status === 400) {
        setApiError(response && response.data);
        setIsLoading({ loader: false, type: 'button' });
      } else if (response && response.status === 200) {
        dispatch(login(history, loginData, '', params && params.id));
        localStorage.removeItem('email');
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const onSubmit = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    const detail = {
      ...data,
      is_reassigned: true,
    };

    updateOnBoardCustomer(params.id, detail).then((response) => {
      if (response && response.status === 200) {
        setIsLoading({ loader: false, type: 'button' });
        setShowSuccessMsg(true);
        setGetEmail(data.re_assigned_user_email);
        localStorage.removeItem('email');
      }
      if (
        (response && response.status === 400) ||
        (response && response.status === 403)
      ) {
        setShowSuccessMsg(false);
        setApiError(response && response.data);
        setIsLoading({ loader: false, type: 'button' });
      }
      if (response && response.status === 401) {
        setShowSuccessMsg(false);
        setApiError(response && response.data);
        setIsLoading({ loader: false, type: 'button' });
        localStorage.removeItem('email');
      }
    });
  };

  const getHTML = (type) => {
    if (type === 'confirm_email') {
      return register({
        required: {
          value: true,
          message: 'This field is required.',
        },
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          message: 'Invalid email address.',
        },
        validate: (value) =>
          value === watch('re_assigned_user_email') ||
          'The Email IDs do not match!',
      });
    }
    if (type === 're_assigned_user_email') {
      return register({
        required: {
          value: true,
          message: 'This field is required.',
        },
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          message: 'Invalid email address.',
        },
      });
    }
    if (type === 'first_name' || type === 'last_name') {
      return register({
        required: {
          value: true,
          message: 'This field is required.',
        },
        pattern: {
          value: /^[0-9a-zA-Z_-]*$/i,
          message: 'Special characters are not allowed.',
        },
      });
    }
    return register({
      required: {
        value: true,
        message: 'This field is required.',
      },
    });
  };

  return (
    <>
      {showSuccessMsg ? (
        ''
      ) : (
        <NavigationHeader
          bar="20"
          backStep={showSuccessMsg ? '' : '1'}
          showSuccessMsg={showSuccessMsg}
        />
      )}
      <UnauthorizedHeader />
      <OnBoardingBody className={showSuccessMsg ? 'grey-bg' : 'body-white'}>
        {!assignTo ? (
          <div className="white-card-base panel">
            <p className="account-steps m-0">Step 1 of 4</p>
            <h3 className="page-heading ">
              Please set your password to create your account.
            </h3>
            <p className="info-text-gray m-0 ">
              If you’d like someone else to administrate the Buy Box Experts
              account then you can reassign the setup process to them.
            </p>
            <ContractFormField className="mt-3">
              <label htmlFor="email">
                Email Address
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter your  Email address"
                  defaultValue={
                    localStorage.getItem('email') || (params && params.email)
                  }
                  readOnly
                />
              </label>
            </ContractFormField>
            <ContractFormField className="mt-3">
              <label htmlFor="password">
                Password
                <input
                  className="form-control"
                  type="password"
                  placeholder="Enter your Password"
                  name="password"
                  onChange={(event) => {
                    setFormData({ [event.target.name]: event.target.value });
                    setApiError({
                      ...apiError,
                      [event.target.name]: '',
                    });
                  }}
                />
              </label>
            </ContractFormField>
            <ErrorMsg>
              {(apiError && apiError.password && apiError.password[0]) ||
                (apiError && apiError.key && apiError.key[0])}
            </ErrorMsg>
            <Button
              className="btn-primary w-100 mt-4"
              onClick={() => savePassword()}>
              {loader || (isLoading.loader && isLoading.type === 'button') ? (
                <PageLoader color="#FFF" type="button" />
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        ) : (
          <>
            {showSuccessMsg ? (
              <div className="white-card-base account-reassign">
                <h3 className="page-heading ">Account Setup Reassigned</h3>
                <p className="information-text m-0 ">
                  You have successfully reassigned the account setup process to
                  the following email address:
                </p>
                <div className="complete-steps mb-2">{getEmail}</div>
                <p className="reach-out m-0 ">
                  If you need any assistance please reach out to
                  <br />
                  <a
                    className="reach-out-link"
                    target="_BLANK"
                    rel="noopener noreferrer"
                    href="https://www.buyboxexperts.com/">
                    onboarding@buyboxexperts.com
                  </a>
                </p>
              </div>
            ) : (
              <div className="white-card-base panel">
                <h3 className="page-heading ">Re-assign account setup</h3>
                <p className="information-text m-0 ">
                  <div className="sub-information">
                    {' '}
                    If you’d like someone else to administer the Buy Box Experts
                    account then you can reassign the setup process to them.
                  </div>

                  <span className="note">
                    Note: Only the nominated email address will be able to add
                    and remove access for other members of your team.
                  </span>
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {newDetails.map((item) => (
                    <ContractFormField key={item.key} className="mt-3">
                      <label htmlFor={item.key}>
                        {item.label}
                        <br />
                        <input
                          className={
                            errors && errors.email
                              ? 'form-control'
                              : 'form-control mt-2'
                          }
                          type="text"
                          placeholder={`Enter ${item.label}`}
                          onChange={() =>
                            setApiError({
                              ...apiError,
                              detail: '',
                            })
                          }
                          id={item.key}
                          name={item.key}
                          ref={getHTML(item.key)}
                        />
                      </label>
                      <ErrorMsg>
                        {errors && errors[item.key] && errors[item.key].message}
                      </ErrorMsg>
                      <ErrorMsg>
                        {apiError &&
                          apiError[item.key] &&
                          apiError[item.key][0]}
                      </ErrorMsg>
                    </ContractFormField>
                  ))}
                  <ErrorMsg>{apiError && apiError.detail}</ErrorMsg>
                  <ErrorMsg>
                    {apiError &&
                      apiError.non_field_errors &&
                      apiError.non_field_errors[0]}
                  </ErrorMsg>
                  <Button className="btn-primary w-100 mt-4">
                    {' '}
                    {isLoading.loader && isLoading.type === 'button' ? (
                      <PageLoader color="#FFF" type="button" />
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </OnBoardingBody>
    </>
  );
}
