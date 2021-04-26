/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Select from 'react-select';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { BannerBg, LeftArrowIcon, NextLogo } from '../../theme/images/index';
// import GoogleIcons from '../../theme/images/icons/google.svg';
import {
  Button,
  ErrorMsg,
  FormField,
  PageLoader,
  SuccessMsg,
} from '../../common';
import {
  PATH_BGS_DASHBOARD,
  PATH_CUSTOMER_LIST,
  PATH_FORGOT_PASSWORD,
} from '../../constants';
import { clearErrorMessage, login } from '../../store/actions/userState';
import { getCustomerNames } from '../../api';

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();
  const loader = useSelector((state) => state.userState.isLoading);
  const apiError = useSelector((state) => state.userState.error);
  const forgotPasswordMsg = useSelector(
    (state) => state.userState.showForgotMsg,
  );
  const resetPasswordMsg = useSelector((state) => state.userState.showResetMsg);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [showPassword, setShowPassword] = useState({
    password: false,
    name: false,
    email: true,
  });
  const [customerApiError, setCustomerApiError] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [customerNames, setCustomerNames] = useState([]);
  const [getName, setGetName] = useState({ email: '', customer: '' });

  const onSubmit = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    if (showPassword.email && !showPassword.password) {
      setGetName({ ...getName, email: data.email });
      getCustomerNames(data.email).then((response) => {
        if (response && response.status === 200) {
          if (
            (response && response.data && response.data.length === 0) ||
            (response && response.data === '')
          ) {
            setShowPassword({ name: false, password: true });
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
    } else if (showPassword.name) {
      setShowPassword({ password: true, email: false, name: false });
      setIsLoading({ loader: false, type: 'button' });
    } else {
      const detail = {
        ...data,
        email: getName.email,
      };
      dispatch(login(history, detail, { customer: getName.customer }));
      setIsLoading({ loader: false, type: 'button' });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (
        userInfo &&
        userInfo.role &&
        userInfo.role.includes('Growth Strategist')
      ) {
        history.push(PATH_BGS_DASHBOARD);
      } else history.push(PATH_CUSTOMER_LIST);
    }
  }, [history, userInfo]);

  const handleChange = () => {
    dispatch(clearErrorMessage());
    setCustomerApiError([]);
  };

  return (
    <FormContainer>
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-lg-6 pl-0 pr-0 h-100">
            <div className="inner-form">
              <div className="logo">
                <img src={NextLogo} alt="logo " />
              </div>
              <div className="login-success-msg">
                {forgotPasswordMsg ? (
                  <SuccessMsg message="We have emailed you a reset link, please check your email." />
                ) : (
                  ''
                )}
              </div>
              <div className="login-success-msg">
                {resetPasswordMsg ? (
                  <SuccessMsg message="New Password set!" />
                ) : (
                  ''
                )}
              </div>

              {!showPassword.email ? (
                <div className="container-fluid">
                  {' '}
                  <div className="row">
                    <div className="col-6">
                      <div
                        role="presentation"
                        className="back-link"
                        onClick={() =>
                          setShowPassword({
                            email: !!showPassword.name,
                            name: !!showPassword.password,
                          })
                        }>
                        <img
                          src={LeftArrowIcon}
                          alt="aarow-back"
                          className="arrow-back-icon "
                        />
                        Back a step
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}

              <h2 className={showPassword.email ? 'mb-5' : 'mb-0'}>
                {showPassword.email
                  ? 'Sign in'
                  : showPassword.name
                  ? 'Select Account'
                  : 'Welcome Back!'}
              </h2>

              {showPassword.password ? (
                <p className="small-para sub-text">
                  Please verify that it&apos;s you.
                </p>
              ) : showPassword.name ? (
                <p className="small-para sub-text">
                  Please select the account you want to sign into.
                </p>
              ) : (
                ''
              )}
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormField>
                  {showPassword.email ? (
                    <>
                      <label htmlFor="emailAddress">
                        Email Address
                        <br />
                        <input
                          className={
                            errors && errors.email
                              ? 'form-control'
                              : 'form-control mb-2'
                          }
                          type="text"
                          placeholder=" Enter your Email Address"
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
                      <ErrorMsg>
                        {(errors && errors.email && errors.email.message) ||
                          (customerApiError && customerApiError[0])}
                      </ErrorMsg>
                    </>
                  ) : (
                    <>
                      {showPassword.name ? (
                        <label htmlFor="account" className="mb-2">
                          Select Account
                          <Select
                            options={customerNames}
                            onChange={(event) =>
                              setGetName({ ...getName, customer: event.value })
                            }
                          />
                        </label>
                      ) : (
                        <>
                          <label htmlFor="password">
                            Password
                            <Link
                              className="float-right link"
                              to={PATH_FORGOT_PASSWORD}>
                              Forgot password?
                            </Link>
                            <br />
                            <input
                              className="form-control"
                              type="password"
                              name="password"
                              onChange={() => handleChange()}
                              placeholder=" Enter your Password"
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
                          <ErrorMsg>
                            {errors &&
                              errors.password &&
                              errors.password.message}
                          </ErrorMsg>
                          <ErrorMsg>
                            {apiError &&
                              apiError.data &&
                              apiError.data.non_field_errors &&
                              apiError.data.non_field_errors[0]}
                          </ErrorMsg>
                        </>
                      )}
                    </>
                  )}
                  <Button
                    className="btn-primary w-100 mt-4 mb-4"
                    disabled={showPassword.name && getName.customer === ''}>
                    {loader ||
                    (isLoading.loader && isLoading.type === 'button') ? (
                      <PageLoader color="#fff" type="button" />
                    ) : (
                      <>{showPassword.password ? 'Sign In' : 'Continue'}</>
                    )}
                  </Button>

                  {/* <Button className=" btn-secondary w-100 mt-2">
                    <img
                      className="google-icon"
                      src={GoogleIcons}
                      alt="google "
                    />
                    Login with Google
                  </Button> */}
                </FormField>
              </form>
            </div>
          </div>
          <div className="col-lg-6 pl-0 pr-0">
            <div className="banner-bg  d-lg-block d-none" />
          </div>
        </div>
      </div>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  height: 100%;
  .banner-bg {
    width: 100%;
    height: 100%;
    background-image: url(${BannerBg});
    background-position: center;
    background-size: cover;
  }

  .inner-form {
    max-width: 327px;
    margin: 0 auto;
    width: 100%;
    vertical-align: middle;

    .logo {
      img {
        width: 160px;
        display: inline-table;
        padding: 40px 0 100px 0;
      }
    }
    .sub-text {
      margin-bottom: 35px;
    }

    .google-icon {
      width: 40px;
      position: absolute;
      top: 2px;
      margin-right: 10px;
      left: 2px;
      bottom: -2px;
      vertical-align: bottom;
    }

    // .login-success-msg {
    //   max-width: 364px;
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   right: 0;
    //   width: 100%;
    //   margin: 0 auto;
    // }
  }

  @media only screen and (max-width: 991px) {
    background-position: center;
    background-size: cover;
    background-image: url(${BannerBg});
    background-repeat: no-repeat;
    height: 100%;

    .inner-form {
      background: rgb(91 91 91 / 0.9);
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;
    }
  }
`;
