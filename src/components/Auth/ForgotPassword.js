import React, { useState, useEffect } from 'react';

import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { NextLogo, LeftArrowIcon } from '../../theme/images';
import { Button, ContractFormField, ErrorMsg, PageLoader } from '../../common';
import { PATH_LOGIN } from '../../constants';
import { getEmail } from '../../api';
import { FormContainer } from '../../theme/Global';
import { showOnboardingMsg } from '../../store/actions/userState';

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const { register, handleSubmit, errors } = useForm();
  const [apiError, setApiError] = useState([]);

  useEffect(() => {
    setIsLoading({ loader: false, type: 'page' });
  }, []);

  const onSubmit = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    getEmail(data).then((response) => {
      if (response && response.status === 400) {
        setApiError(response && response.data && response.data[0]);
        setIsLoading({ loader: false, type: 'button' });
      } else {
        dispatch(showOnboardingMsg());
        history.push(PATH_LOGIN);
        setIsLoading({ loader: false, type: 'button' });
      }
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
                  <div role="presentation" className="back-link">
                    <img
                      src={LeftArrowIcon}
                      alt="aarow-back"
                      className="arrow-back "
                    />
                    Back a step
                  </div>
                </Link>

                <h2 className="mt-3 mb-0">Forgot your password?</h2>
                <p className=" sub-text">
                  Enter your email address and we’ll send you instructions to
                  reset your password.
                </p>
                <form className="inner-form" onSubmit={handleSubmit(onSubmit)}>
                  <ContractFormField>
                    <label htmlFor="emailAddress">
                      Email address
                      <input
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter email address"
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
                        onChange={() => setApiError([])}
                      />
                    </label>
                  </ContractFormField>
                  <ErrorMsg>
                    {errors && errors.email && errors.email.message}
                  </ErrorMsg>{' '}
                  <ErrorMsg>{apiError}</ErrorMsg>
                  <Button className="btn btn-primary w-100 mt-3">
                    {isLoading.loader && isLoading.type === 'button' ? (
                      <PageLoader color="#fff" type="button" />
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </Button>
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
