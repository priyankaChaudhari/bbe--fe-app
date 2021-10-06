import React, { useState } from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Theme from '../../theme/Theme';
import { FormField, Button, ErrorMsg, PageLoader } from '../../common';
import { userDetails } from '../../constants';
import { updatePassword } from '../../api';
import { CloseEyeIcon, smallEyeIcon } from '../../theme/images';

export default function EditPassword({ userInfo }) {
  const { register, handleSubmit, errors, watch, reset } = useForm();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [showPassword, setShowPassword] = useState({
    old_password: false,
    new_password: false,
  });
  const [apiError, setApiError] = useState({});

  const onSubmit = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    updatePassword(data, userInfo.id).then((response) => {
      if (response.status === 400) {
        setApiError(response.data);
        setIsLoading({ loader: false, type: 'button' });
      } else if (response.status === 200) {
        setIsLoading({ loader: false, type: 'button' });
        toast.success('Password Updated!');
        reset();
      }
    });
  };

  const checkFields = () => {
    if (
      Object.values(watch()).length === 0 ||
      (Object.values(watch())[0] === undefined &&
        Object.values(watch())[1] === undefined) ||
      (Object.values(watch())[0] === '' && Object.values(watch())[1] === '')
    ) {
      return true;
    }
    return false;
  };

  const generateHTML = (item) => {
    const fields = [];
    fields.push(
      <label htmlFor={item.label} key={item.key}>
        {item.label}
        <br />
        <input
          className={
            errors && errors.email ? 'form-control' : 'form-control mb-2'
          }
          defaultValue={userInfo[item.key]}
          type={showPassword[item.key] ? 'text' : item.type}
          placeholder={item.placeholder}
          id={item.label}
          name={item.key}
          onChange={(event) =>
            setApiError({
              ...apiError,
              [event.target.name]: '',
            })
          }
          ref={register({
            required: {
              value: true,
              message: 'This field is required.',
            },
            minLength: {
              value: 8,
              message: 'Password must have at least 8 characters.',
            },
          })}
        />
        {watch()[item.key] && watch()[item.key].length !== 0 ? (
          <>
            {showPassword[item.key] ? (
              <img
                src={smallEyeIcon}
                className="hide-icon cursor"
                alt="see"
                onClick={() =>
                  setShowPassword({ ...showPassword, [item.key]: false })
                }
                role="presentation"
              />
            ) : (
              <img
                src={CloseEyeIcon}
                className="show-icon cursor"
                alt="close"
                onClick={() =>
                  setShowPassword({ ...showPassword, [item.key]: true })
                }
                role="presentation"
              />
            )}
          </>
        ) : (
          ''
        )}
      </label>,
    );
    return fields;
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <FormField className="mt-3">
              {userDetails
                .filter((part) => part.section === 3)
                .map((item) => (
                  <React.Fragment key={item.key}>
                    {generateHTML(item)}
                    <ErrorMsg>
                      {errors && errors[item.key] && errors[item.key].message}
                    </ErrorMsg>
                    <ErrorMsg>
                      {apiError && apiError[item.key] && apiError[item.key][0]}
                    </ErrorMsg>
                  </React.Fragment>
                ))}
            </FormField>
          </div>
          <div className="col-md-6">
            <FormField className="mt-3">
              {userDetails
                .filter((part) => part.section === 4)
                .map((item) => (
                  <React.Fragment key={item.key}>
                    {generateHTML(item)}
                    <ErrorMsg>
                      {errors && errors[item.key] && errors[item.key].message}
                    </ErrorMsg>
                    <ErrorMsg>
                      {apiError && apiError[item.key] && apiError[item.key][0]}
                    </ErrorMsg>
                  </React.Fragment>
                ))}
            </FormField>
          </div>
          <Button
            className={
              checkFields()
                ? 'btn btn-primary m-3 p-2 disabled'
                : 'btn btn-primary m-3 p-2'
            }
            disabled={checkFields()}>
            {isLoading.loader && isLoading.type === 'button' ? (
              <PageLoader color="#FFF" type="button" />
            ) : (
              'Update password'
            )}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
}

EditPassword.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

const FormContainer = styled.div`
  height: 100%;
  .banner-bg {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
  }

  .inner-form {
    max-width: 327px;
    margin: 0 auto;
    width: 100%;
    vertical-align: middle;

    .logo {
      width: 190px;
      padding: 35px 0 45px 0;

      span {
        position: absolute;
        top: 46px;
        margin-left: 6px;
        font-size: 16px;
        font-weight: bold;
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
    .google-icon {
      width: 20px;
      margin-right: 10px;
      vertical-align: bottom;
    }
    .or-else {
      text-align: center;
      margin-top: 8px;
    }
  }

  @media only screen and (max-width: 991px) {
    background-position: center;
    background-size: cover;
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
