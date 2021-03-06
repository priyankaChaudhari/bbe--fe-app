import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useForm } from 'react-hook-form';
import queryString from 'query-string';

import { ArrowIcons, NextLogo } from '../../theme/images';
import { Button, FormField, PageLoader, ErrorMsg } from '../../common';
import { PATH_LOGIN } from '../../constants';
import { resetPassword } from '../../api';
import { showResetPasswordMsg } from '../../store/actions/userState';
import { FormContainer } from '../../theme/Global';

export default function ResetPassword() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, watch, reset } = useForm();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [apiError, setApiError] = useState({});
  const params = queryString.parse(history.location.search);

  useEffect(() => {
    setIsLoading({ loader: false, type: 'page' });
  }, []);

  const onSubmit = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    const formData = {
      password: data.password,
      key: params.key,
    };

    resetPassword(formData).then((response) => {
      if (response && response.status === 400) {
        setApiError(response && response.data);
        setIsLoading({ loader: false, type: 'button' });
      } else if (response && response.status === 200) {
        dispatch(showResetPasswordMsg());
        history.push(PATH_LOGIN);
        setIsLoading({ loader: false, type: 'button' });
        reset();
      }
    });
  };

  const handleChange = (event) => {
    setApiError({
      [event.target.name]: '',
    });
  };

  return (
    <FormContainer>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <div className="container-fluid">
          <div className="row h-100">
            <div className="col-lg-6 pl-0 pr-0 h-100">
              <div className="inner-form">
                <div
                  className="logo cursor"
                  onClick={() => history.push(PATH_LOGIN)}
                  role="presentation">
                  <img src={NextLogo} alt="logo " />
                </div>
                <Link className="link" to={PATH_LOGIN}>
                  <p className="small-para">
                    {' '}
                    <img
                      src={ArrowIcons}
                      alt="aarow-back"
                      className="arrow-icon"
                    />
                    Back to Sign in
                  </p>
                </Link>
                <h2 className="mb-0">Set your Password</h2>
                <p className="small-para">
                  Please enter your password to proceed.{' '}
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormField className="mt-5">
                    <label htmlFor="password">
                      New password
                      <br />
                      <input
                        className={
                          errors && errors.email
                            ? 'form-control'
                            : 'form-control mb-2'
                        }
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter new password"
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
                        onChange={(event) => handleChange(event)}
                      />
                    </label>
                    <ErrorMsg>
                      {errors && errors.password && errors.password.message}
                    </ErrorMsg>
                    <br />
                    <label htmlFor="confirm_password">
                      Confirm password
                      <br />
                      <input
                        className="form-control"
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        placeholder="Enter confirm password"
                        ref={register({
                          required: {
                            value: true,
                            message: 'This field is required.',
                          },
                          minLength: {
                            value: 8,
                            message: 'Password must have at least 8 characters',
                          },
                          validate: (value) =>
                            value === watch('password') ||
                            'The passwords do not match!',
                        })}
                        onChange={(event) => handleChange(event)}
                      />
                    </label>
                    <ErrorMsg>
                      {errors &&
                        errors.confirm_password &&
                        errors.confirm_password.message}
                    </ErrorMsg>
                    <ErrorMsg
                      dangerouslySetInnerHTML={{
                        __html:
                          (apiError &&
                            apiError.password &&
                            apiError.password[0]) ||
                          (apiError && apiError.key && apiError.key[0]),
                      }}
                    />
                    <Button className="btn btn-primary w-100 mt-5">
                      {isLoading.loader && isLoading.type === 'button' ? (
                        <PageLoader color="#FFF" type="button" />
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </FormField>
                </form>
              </div>
            </div>
            <div className="col-lg-6 pl-0 pr-0 ">
              <div className="banner-bg d-lg-block d-none" />
            </div>
          </div>
        </div>
      )}
    </FormContainer>
  );
}
