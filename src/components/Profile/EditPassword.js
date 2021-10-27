import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { shape, string } from 'prop-types';

import { updatePassword } from '../../api';
import { userDetails } from '../../constants';
import { PasswordFormContainer } from '../../common/Styles/HeaderStyles';
import { CloseEyeIcon, smallEyeIcon } from '../../theme/images';
import { FormField, Button, ErrorMsg, PageLoader } from '../../common';

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
          className={errors?.email ? 'form-control' : 'form-control mb-2'}
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
        {watch()[item.key]?.length !== 0 ? (
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
    <PasswordFormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <FormField className="mt-3">
              {userDetails
                .filter((part) => part.section === 3)
                .map((item) => (
                  <React.Fragment key={item.key}>
                    {generateHTML(item)}
                    <ErrorMsg>{errors?.[item.key]?.message}</ErrorMsg>
                    <ErrorMsg>{apiError?.[item.key]?.[0]}</ErrorMsg>
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
                    <ErrorMsg>{errors?.[item.key]?.message}</ErrorMsg>
                    <ErrorMsg>{apiError?.[item.key]?.[0]}</ErrorMsg>
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
    </PasswordFormContainer>
  );
}

EditPassword.propTypes = {
  userInfo: shape({
    id: string,
  }).isRequired,
};
