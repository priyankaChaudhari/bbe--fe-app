import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';

import { FormContainer } from '../../theme/Global';
import { LeftArrowIcon, NextLogo } from '../../theme/images';

import {
  Button,
  ErrorMsg,
  InputFormField,
  PageLoader,
  SuccessMsg,
  ContractInputSelect,
} from '../../common';
import {
  PATH_AMAZON_MERCHANT,
  PATH_COMPANY_DETAILS,
  PATH_CUSTOMER_DETAILS,
  PATH_CUSTOMER_LIST,
  PATH_SUMMARY,
} from '../../constants';
import { clearErrorMessage, login } from '../../store/actions/userState';
import { getCustomerNames, getEmail } from '../../api';

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();
  const loader = useSelector((state) => state.userState.isLoading);
  const apiError = useSelector((state) => state.userState.error);
  const resetPasswordMsg = useSelector((state) => state.userState.showResetMsg);
  const [showPassword, setShowPassword] = useState({
    password: false,
    name: false,
    email: true,
  });
  const [customerApiError, setCustomerApiError] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [customerNames, setCustomerNames] = useState([]);
  const [getName, setGetName] = useState({ email: '', customer: '' });
  const [forgotApiError, setforgotApiError] = useState([]);
  const params = queryString.parse(history.location.search);
  const role = localStorage.getItem('role') || '';
  const customerId = localStorage.getItem('customer') || '';
  const step = JSON.parse(localStorage.getItem('step')) || '';

  const onSubmit = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    if (showPassword.email && !showPassword.password) {
      setGetName({ ...getName, email: data.email });
      if (params && params.customer && params.step) {
        setGetName({
          email: data.email,
          customer: params && params.customer,
        });
        setShowPassword({ email: false, name: false, password: true });
        localStorage.setItem('customer', params && params.customer);
        setIsLoading({ loader: false, type: 'button' });
      } else {
        getCustomerNames(data.email).then((response) => {
          if (response && response.status === 200) {
            if (
              (response && response.data && response.data.length === 0) ||
              (response && response.data === '')
            ) {
              setShowPassword({ name: false, password: true });
            } else if (
              response &&
              response.data &&
              response.data.length === 1
            ) {
              setCustomerNames(response && response.data);
              setGetName({
                email: data.email,
                customer:
                  response &&
                  response.data &&
                  response.data[0] &&
                  response.data[0].value,
              });
              setShowPassword({ email: false, name: false, password: true });
            } else {
              setCustomerNames(response && response.data);
              setShowPassword({ name: true, password: false });
            }
            setIsLoading({ loader: false, type: 'button' });
          }
          if (response && response.status === 400) {
            setCustomerApiError(response && response.data);
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      }
    } else if (showPassword.name) {
      setShowPassword({ password: true, email: false, name: false });
      setIsLoading({ loader: false, type: 'button' });
    } else {
      const detail = {
        ...data,
        email: getName.email,
      };
      localStorage.setItem('customer', getName.customer);
      dispatch(login(history, detail, { customer: getName.customer }, ''));
      setIsLoading({ loader: false, type: 'button' });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (role.includes('Customer') || role === 'Customer') {
        const id =
          step &&
          Object.keys(step) &&
          Object.keys(step).find((op) => op === customerId);
        if (step === null || id === '' || id === null) {
          history.push(PATH_COMPANY_DETAILS);
        }
        if (step[id] === 1) {
          history.push(PATH_COMPANY_DETAILS);
        }
        if (step[id] === 2 || step[id] === 3) {
          history.push(PATH_AMAZON_MERCHANT);
        }
        if (step[id] === 4 || step[id] === 5) {
          history.push(PATH_SUMMARY);
        }
        if (step[id] === 6) {
          history.push(PATH_CUSTOMER_DETAILS.replace(':id', id));
        }
      } else history.push(PATH_CUSTOMER_LIST);
    }
  }, [history, role, customerId, step, dispatch]);

  const handleChange = () => {
    dispatch(clearErrorMessage());
    setCustomerApiError([]);
    setforgotApiError([]);
  };

  const forgotPassword = () => {
    setIsLoading({ loader: true, type: 'forgot' });
    getEmail({ email: getName.email }).then((response) => {
      if (response && response.status === 400) {
        setforgotApiError(response && response.data && response.data[0]);
        setIsLoading({ loader: false, type: 'forgot' });
        setShowPassword({ email: true, name: false, password: false });
      } else {
        toast.success(
          'We have emailed you a reset link, please check your email.',
        );
        setShowPassword({ email: false, name: false, password: true });
        setIsLoading({ loader: false, type: 'forgot' });
      }
    });
  };

  return (
    <FormContainer>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        pauseOnFocusLoss={false}
      />
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-lg-5 pl-0 pr-0 h-100">
            <div className="inner-form">
              <div className="logo">
                <img src={NextLogo} alt="logo " />
              </div>
              <div className="login-success-msg">
                {resetPasswordMsg ? (
                  <SuccessMsg message="New Password set!" />
                ) : (
                  ''
                )}
              </div>

              {!showPassword.email ? (
                <>
                  {' '}
                  <div className="row">
                    <div className="col-12">
                      <div
                        role="presentation"
                        className="back-link"
                        onClick={() =>
                          customerNames?.length === 0 ||
                          customerNames?.length === 1 ||
                          customerNames === ''
                            ? setShowPassword({
                                email: true,
                                name: false,
                                password: false,
                              })
                            : setShowPassword({
                                email: !!showPassword.name,
                                name: !!showPassword.password,
                              })
                        }>
                        <img
                          src={LeftArrowIcon}
                          alt="aarow-back"
                          className="arrow-back "
                        />
                        Back a step
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}

              <h2 className={showPassword.email ? 'mb-4' : 'mb-0 mt-3'}>
                {showPassword.email
                  ? 'Sign in'
                  : showPassword.name
                  ? 'Select Account'
                  : 'Welcome Back!'}
              </h2>

              {showPassword.password ? (
                <p className=" sub-text">Please verify that it&apos;s you.</p>
              ) : showPassword.name ? (
                <p className=" sub-text">
                  Please select the account you want to sign into.
                </p>
              ) : (
                ''
              )}
              <form onSubmit={handleSubmit(onSubmit)}>
                {showPassword.email ? (
                  <>
                    <InputFormField className="mt-2">
                      <label htmlFor="emailAddress">
                        Email Address
                        <br />
                        <input
                          className={
                            errors?.email ? 'form-control' : 'form-control '
                          }
                          type="text"
                          placeholder="Enter your Email Address"
                          onChange={() => handleChange()}
                          id="emailAddress"
                          name="email"
                          ref={register({
                            required: {
                              value: true,
                              message: 'This field is required.',
                            },
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: 'Invalid email address.',
                            },
                          })}
                        />
                      </label>
                    </InputFormField>
                    <ErrorMsg>
                      {errors?.email?.message || customerApiError?.[0]}
                    </ErrorMsg>
                    <ErrorMsg>{forgotApiError}</ErrorMsg>
                  </>
                ) : (
                  <>
                    {showPassword.name ? (
                      <ContractInputSelect>
                        <label htmlFor="account" className="mb-2">
                          Select Account
                          <Select
                            options={customerNames}
                            onChange={(event) =>
                              setGetName({
                                ...getName,
                                customer: event.value,
                              })
                            }
                            defaultValue={getName.customer}
                          />
                        </label>
                      </ContractInputSelect>
                    ) : (
                      <>
                        {showPassword.password ? (
                          <>
                            <InputFormField>
                              <label htmlFor="password">
                                Enter password
                                <br />
                                <input
                                  className="form-control"
                                  type="password"
                                  name="password"
                                  onChange={() => handleChange()}
                                  placeholder="Enter your Password"
                                  id="password"
                                  ref={register({
                                    required: {
                                      value: true,
                                      message: 'This field is required.',
                                    },
                                    minLength: {
                                      value: 8,
                                      message:
                                        'Password must have at least 8 characters.',
                                    },
                                  })}
                                />
                              </label>
                            </InputFormField>
                            <ErrorMsg>{errors?.password?.message}</ErrorMsg>
                            <ErrorMsg>
                              {apiError?.data?.non_field_errors?.[0]}
                            </ErrorMsg>
                            <ErrorMsg>{forgotApiError}</ErrorMsg>
                          </>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  </>
                )}
                <Button
                  className="btn-primary w-100 mt-3 mb-3"
                  disabled={
                    (showPassword.name && getName.customer === '') ||
                    (isLoading.loader && isLoading.type === 'forgot')
                  }>
                  {loader ||
                  (isLoading.loader && isLoading.type === 'button') ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    <>{showPassword.password ? 'Sign In' : 'Continue'}</>
                  )}
                </Button>
                {showPassword.password ? (
                  <span
                    className=" forgot-pswd-link cursor "
                    onClick={() => forgotPassword()}
                    role="presentation">
                    Forgot password?
                  </span>
                ) : (
                  ''
                )}
              </form>
            </div>
          </div>
          <div className="col-lg-7 pl-0 pr-0">
            <div className="banner-bg  d-lg-block d-none" />
          </div>
        </div>
      </div>
    </FormContainer>
  );
}
