import React, { useState } from 'react';

import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { shape, string, arrayOf } from 'prop-types';

import EditPassword from './EditPassword';
import CropUploadImage from '../../common/CropUploadImage';
import CheckPhoneNumber from '../../common/CheckPhoneNumber';
import { updateUserInfo } from '../../api';
import { InfoIcon } from '../../theme/images';
import { userDetails } from '../../constants';
import { userMe } from '../../store/actions/userState';
import { FormContainer } from '../../common/Styles/HeaderStyles';
import {
  FormField,
  Button,
  PageLoader,
  ErrorMsg,
  GetInitialName,
} from '../../common';

export default function EditProfile({ userInfo }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const { register, handleSubmit, errors } = useForm();
  const [apiError, setApiError] = useState({});
  const [showBtn, setShowBtn] = useState(false);

  const onSubmit = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    updateUserInfo(data, userInfo.id).then((response) => {
      if (response?.status === 400) {
        setApiError(response.data);
        setIsLoading({ loader: false, type: 'button' });
      } else if (response?.status === 200) {
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
          className={errors?.email ? 'form-control' : 'form-control mb-2'}
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
                  <span style={{ textTransform: 'uppercase' }}>
                    <GetInitialName userInfo={userInfo} type="profile" />
                  </span>
                </span>
              </span>
            </div>
            <div className="row ">
              {userDetails
                .filter((part) => part.section === 1)
                .map((item) => (
                  <React.Fragment key={item.key}>
                    <div className="col-md-6 mt-2">
                      <FormField className="">
                        {generateHTML(item)}
                        <CheckPhoneNumber name="Phone" />
                        <ErrorMsg>{errors?.[item.key]?.message}</ErrorMsg>
                        <ErrorMsg>{apiError?.[item.key]?.[0]}</ErrorMsg>
                      </FormField>
                    </div>
                  </React.Fragment>
                ))}

              {userDetails
                .filter((part) => part.section === 2)
                .map((item) => (
                  <React.Fragment key={item.key}>
                    <div className="col-md-6 mt-2">
                      <FormField className="">
                        {generateHTML(item)}
                        <ErrorMsg>{errors?.[item.key]?.message}</ErrorMsg>
                        <ErrorMsg>{apiError?.[item.key]?.[0]}</ErrorMsg>
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
  userInfo: shape({
    id: string,
    documents: arrayOf(shape({})),
  }).isRequired,
};
