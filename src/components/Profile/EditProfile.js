/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import Theme from '../../theme/Theme';
import { FormField, Button, PageLoader, ErrorMsg } from '../../common/index';
import { userDetails } from '../../constants/FieldConstants';
import EditPassword from './EditPassword';
import { updateUserInfo } from '../../api/index';
import { userMe } from '../../store/actions/userState';
import CropUploadImage from '../../common/CropUploadImage';
import { InfoIcon } from '../../theme/images';
import CheckPhoneNumber from '../../common/CheckPhoneNumber';

export default function EditProfile({ initials, userInfo }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const { register, handleSubmit, errors } = useForm();
  const [apiError, setApiError] = useState({});
  const [showBtn, setShowBtn] = useState(false);

  const onSubmit = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    updateUserInfo(data, userInfo.id).then((response) => {
      if (response && response.status === 400) {
        setApiError(response.data);
        setIsLoading({ loader: false, type: 'button' });
      } else if (response.status === 200) {
        setShowBtn(false);
        setIsLoading({ loader: false, type: 'button' });
        toast.success('Changes Saved!');
        dispatch(userMe());
      }
    });
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
          type={item.type}
          placeholder={item.placeholder}
          id={item.label}
          name={item.key}
          onChange={(event) => {
            setApiError({
              ...apiError,
              [event.target.name]: '',
            });
            setShowBtn(true);
          }}
          ref={register({
            required: {
              value: true,
              message: 'This field is required.',
            },
            pattern: item.pattern,
          })}
          maxLength={item.key === 'phone_number' ? 15 : ''}
        />
        {item.key === 'phone_number' ? (
          <>
            <img
              src={InfoIcon}
              alt="info"
              data-tip="If you enter a number without country code,<br /> it will be set as United States(+1) by default."
              data-for="phone"
              className="profilephone-input-info "
            />
            <ReactTooltip id="phone" aria-haspopup="true" html place="left" />
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
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" component="modal" width={40} />
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-3">
              <span className="edit-profile-text">
                <CropUploadImage
                  type="user"
                  id={userInfo.id}
                  setDocumentImage={userInfo.documents}
                />
                <span style={{ color: '#2E384D' }}>
                  <div className="m-0 profile-pic">PROFILE PICTURE</div>
                  If you don&apos;t upload a photo, your initials will be
                  used:&nbsp;
                  <span style={{ textTransform: 'uppercase' }}>{initials}</span>
                </span>
              </span>
            </div>
            <div className="row mt-4">
              {userDetails
                .filter((part) => part.section === 1)
                .map((item) => (
                  <React.Fragment key={item.key}>
                    <div className="col-md-6">
                      <FormField className="">
                        {generateHTML(item)}
                        <CheckPhoneNumber name="Phone" />
                        <ErrorMsg>
                          {errors &&
                            errors[item.key] &&
                            errors[item.key].message}
                        </ErrorMsg>
                        <ErrorMsg>
                          {apiError &&
                            apiError[item.key] &&
                            apiError[item.key][0]}
                        </ErrorMsg>
                      </FormField>
                    </div>
                  </React.Fragment>
                ))}

              {userDetails
                .filter((part) => part.section === 2)
                .map((item) => (
                  <React.Fragment key={item.key}>
                    <div className="col-md-6">
                      <FormField className="">
                        {generateHTML(item)}
                        <ErrorMsg>
                          {errors &&
                            errors[item.key] &&
                            errors[item.key].message}
                        </ErrorMsg>
                        <ErrorMsg>
                          {apiError &&
                            apiError[item.key] &&
                            apiError[item.key][0]}
                        </ErrorMsg>
                      </FormField>
                    </div>
                  </React.Fragment>
                ))}

              <Button
                className={
                  !showBtn
                    ? ' btn-primary m-3 p-2 disabled'
                    : ' btn-primary m-3 p-2'
                }
                disabled={!showBtn}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#FFF" type="button" />
                ) : (
                  'Save changes'
                )}
              </Button>
            </div>
          </form>
          <EditPassword userInfo={userInfo} />
        </>
      )}
    </FormContainer>
  );
}

EditProfile.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
    documents: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  initials: PropTypes.string.isRequired,
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

  .profile-pic {
    font-family: ${Theme.titleFontFamily};
    color: ${Theme.gray35};
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
