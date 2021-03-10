import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { NextLogo, BannerBg, ArrowIcons } from '../../theme/images/index';
import { Button, FormField, ErrorMsg, PageLoader } from '../../common';
import { PATH_LOGIN } from '../../constants';
import { getEmail } from '../../api/index';
import { showForgotPasswordMsg } from '../../store/actions/userState';

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
        dispatch(showForgotPasswordMsg());
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

                <h2 className="mt-2 mb-0">Forgot your Password?</h2>
                <p className="small-para sub-text">
                  Enter your email address and we’ll send you instructions to
                  reset your password.
                </p>
                <form className="inner-form" onSubmit={handleSubmit(onSubmit)}>
                  <FormField>
                    <input
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter email"
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
                    <ErrorMsg>
                      {errors && errors.email && errors.email.message}
                    </ErrorMsg>{' '}
                    <ErrorMsg>{apiError}</ErrorMsg>
                    <Button className="btn btn-primary w-100 mt-4">
                      {isLoading.loader && isLoading.type === 'button' ? (
                        <PageLoader color="#fff" type="button" />
                      ) : (
                        'Send Reset Instructions'
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
    .arrow-icon {
      width: 13px;
      margin-right: 5px;
      vertical-align: top;
      cursor: pointer;
    }
  }
  .sub-text {
    margin-bottom: 35px;
  }

  @media only screen and (max-width: 991px) {
    background-position: center;
    background-size: cover;
    background-image: url(${BannerBg});
    background-repeat: no-repeat;
    height: 100%;

    .inner-form {
      // background: rgb(15 15 17 / 0.9);
      background: rgb(91 91 91 / 0.9);
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;
    }
  }
`;
