/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';
import { toast } from 'react-toastify';
import $ from 'jquery';
import queryString from 'query-string';

import Theme from '../../theme/Theme';
import {
  Button,
  OnBoardingBody,
  UnauthorizedHeader,
  CheckBox,
  InputFormField,
  PageLoader,
  ErrorMsg,
} from '../../common';
import {
  PATH_BRAND_ASSET,
  PATH_CUSTOMER_DETAILS,
  PATH_THANKS,
  PATH_UNAUTHORIZED_BRAND_ASSET,
  PATH_UNAUTHROIZED_BRAND_ASSET_SUMMARY,
  PATH_BRAND_ASSET_SUMMARY,
} from '../../constants';
import {
  OrangeCheckMark,
  EditOrangeIcon,
  SecurityLock,
  LeftArrowIcon,
} from '../../theme/images';
import { getBrandAssetsDetail, updateBrandAssetStep } from '../../api';

export default function UploadDelegation() {
  const { id, brandId } = useParams();
  const history = useHistory();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'email' });
  const [formData, setFormData] = useState({ email: '' });
  const [ifStepsNull, setIfStepsNull] = useState(false);
  const [data, setData] = useState({});
  const [editEmail, setEditEmail] = useState(false);
  const [apiError, setApiError] = useState({});
  const params = queryString.parse(history.location.search);

  const brandAssetData = useCallback(() => {
    setIsLoading({ loader: true, type: 'page' });

    getBrandAssetsDetail(brandId).then((response) => {
      if (response && response.status === 401) {
        history.push({ pathname: PATH_THANKS, search: 'step=completed' });
        setIsLoading({ loader: false, type: 'page' });
      } else {
        setData(response && response.data);
        if (
          (response && response.data && response.data.steps === undefined) ||
          (response && response.data && response.data.steps === null)
        ) {
          setIfStepsNull(true);
        } else {
          setIfStepsNull(false);
        }
        if (
          response &&
          response.data &&
          (response.data.re_assigned_email === null ||
            response.data.re_assigned_email === '')
        ) {
          setIsChecked(false);
          $('.checkboxes input:checkbox').prop('checked', false);
        } else {
          setIsChecked(true);
          $('.checkboxes input:checkbox').prop('checked', true);
        }
        setIsLoading({ loader: false, type: 'page' });
      }
    });
  }, [brandId]);

  useEffect(() => {
    if (params && params.key) {
      localStorage.setItem('match', params.key);
      setIsChecked(false);
    }
    brandAssetData();
  }, [brandAssetData]);

  const sendEmail = () => {
    setIsLoading({ loader: true, type: 'email' });
    const detail = {
      customer: id,
      re_assigned_email: formData && formData.email,
    };
    updateBrandAssetStep(brandId, detail).then((res) => {
      if (res && res.status === 200) {
        setEditEmail(false);
        setFormData({ email: '' });
        toast.success('Request Sent Successfully!');
        setIsLoading({ loader: false, type: 'email' });
        brandAssetData();
      }
      if (res && res.status === 400) {
        setApiError(res && res.data);
        setIsLoading({ loader: false, type: 'email' });
      }
    });
  };

  const redirectTO = () => {
    if (
      !history.location.pathname.includes('/assigned-choose-delegate/') &&
      data &&
      data.re_assigned_email
    ) {
      history.push(PATH_CUSTOMER_DETAILS.replace(':id', id));
    } else if (ifStepsNull) {
      updateBrandAssetStep(brandId, {
        steps: {
          brand_logo: null,
          font_files: null,
          brand_guidelines: null,
          iconography: null,
          additional_brand_material: null,
        },
      }).then((response) => {
        if (response && response.status === 200) {
          if (data && data.last_visited_step === 'summary') {
            history.push(
              history.location.pathname.includes('/assigned-brand-asset/')
                ? PATH_UNAUTHROIZED_BRAND_ASSET_SUMMARY.replace(
                    ':id',
                    id,
                  ).replace(':brandId', brandId)
                : PATH_BRAND_ASSET_SUMMARY.replace(':id', id).replace(
                    ':brandId',
                    brandId,
                  ),
            );
          } else {
            history.push({
              pathname:
                params && params.key
                  ? PATH_UNAUTHORIZED_BRAND_ASSET.replace(':id', id).replace(
                      ':brandId',
                      brandId,
                    )
                  : PATH_BRAND_ASSET.replace(':id', id).replace(
                      ':brandId',
                      brandId,
                    ),
              search:
                data && data.last_visited_step
                  ? `step=${data.last_visited_step}`
                  : 'step=brand-logo',
            });
          }
        }
      });
    } else if (data && data.last_visited_step === 'summary') {
      history.push(
        history.location.pathname.includes('/assigned-choose-delegate/')
          ? PATH_UNAUTHROIZED_BRAND_ASSET_SUMMARY.replace(':id', id).replace(
              ':brandId',
              brandId,
            )
          : PATH_BRAND_ASSET_SUMMARY.replace(':id', id).replace(
              ':brandId',
              brandId,
            ),
      );
    } else {
      history.push({
        pathname:
          params && params.key
            ? PATH_UNAUTHORIZED_BRAND_ASSET.replace(':id', id).replace(
                ':brandId',
                brandId,
              )
            : PATH_BRAND_ASSET.replace(':id', id).replace(':brandId', brandId),
        search:
          data && data.last_visited_step
            ? `step=${data.last_visited_step}`
            : 'step=brand-logo',
      });
    }
  };

  const updateEmail = () => {
    updateBrandAssetStep(brandId, {
      re_assigned_email: '',
    }).then((response) => {
      if (response && response.status === 200) {
        setIsChecked(false);
        brandAssetData();
      }
    });
  };

  const updateInput = () => {
    setIsChecked(true);
    if (data && data.re_assigned_email) {
      setEditEmail(false);
    } else setEditEmail(true);
  };

  return (
    <>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <>
          {params && params.key ? (
            <UnauthorizedHeader />
          ) : (
            <BackToStep>
              {' '}
              <div className="container-fluid">
                {' '}
                <div className="row">
                  <div className="col-12">
                    <div
                      role="presentation"
                      className="back-link"
                      onClick={() =>
                        history.push(PATH_CUSTOMER_DETAILS.replace(':id', id))
                      }>
                      <img
                        src={LeftArrowIcon}
                        alt="aarow-back"
                        className="arrow-back-icon "
                      />
                      Back to Dashboard
                    </div>
                  </div>
                </div>
              </div>{' '}
            </BackToStep>
          )}

          <OnBoardingBody className="grey-bg-asset pb-3">
            <div className="white-card-base  pb-4 ">
              {/* <UnauthorizedHeader />{' '} */}
              <h3 className="page-heading ">Upload Your Brand Assets</h3>
              {params && params.key ? (
                ''
              ) : (
                <>
                  <CheckBox className="mt-1 mb-4">
                    <label
                      className="check-container customer-pannel "
                      htmlFor="step">
                      Ask someone else to complete this section
                      <input
                        className="checkboxes"
                        type="checkbox"
                        id="step"
                        readOnly
                        checked={data && data.re_assigned_email}
                        onChange={(event) =>
                          event.target.checked
                            ? updateInput()
                            : data && data.re_assigned_email
                            ? updateEmail()
                            : setIsChecked(false)
                        }
                      />
                      <span className="checkmark" />
                    </label>
                  </CheckBox>
                  {isChecked ? (
                    <fieldset className="shape-without-border w-430 mt-2">
                      <InputFormField>
                        <label htmlFor="email">
                          Assign to (email)
                          <input
                            className="form-control"
                            style={{
                              opacity: isChecked && !editEmail ? 0.5 : '',
                            }}
                            defaultValue={data && data.re_assigned_email}
                            onChange={(event) => {
                              setFormData({ email: event.target.value });
                              setApiError({ re_assigned_email: '' });
                            }}
                            readOnly={
                              (isChecked && !editEmail) || isLoading.loader
                            }
                          />
                        </label>
                        <ErrorMsg>
                          {apiError &&
                            apiError.re_assigned_email &&
                            apiError.re_assigned_email[0]}
                        </ErrorMsg>
                        {data && data.re_assigned_email ? (
                          <span
                            className="edit-field cursor"
                            role="presentation"
                            onClick={() => setEditEmail(true)}>
                            <img
                              className="edit-icon"
                              src={EditOrangeIcon}
                              alt="edit"
                            />{' '}
                            Edit email address
                          </span>
                        ) : (
                          ''
                        )}
                        {data && data.re_assigned_email ? (
                          <p className="info-text-gray m-0 pt-2">
                            We???ve emailed them a link to submit the information
                            in this section.
                          </p>
                        ) : (
                          <p className="info-text-gray m-0 pt-3 ">
                            We???ll email them a link to submit the information in
                            this section.
                          </p>
                        )}
                        <Button
                          className="btn-primary w-100  mt-3"
                          onClick={() => sendEmail()}
                          disabled={formData.email === '' || isLoading.loader}>
                          {isLoading.loader && isLoading.type === 'email' ? (
                            <PageLoader color="#fff" type="button" />
                          ) : (
                            'Send Email'
                          )}
                        </Button>
                      </InputFormField>
                    </fieldset>
                  ) : (
                    ''
                  )}
                </>
              )}
              <div className="complete-steps mt-3">
                You???ll need the following to complete this step:
              </div>
              <ul className="account-steps-check">
                <li>
                  <img src={OrangeCheckMark} alt="check" />
                  Your brand logo in vector format (e.g. AI or EPS)
                </li>
                <li>
                  <img src={OrangeCheckMark} alt="check" />A brand guidelines or
                  style guide document
                </li>
                <li>
                  <img src={OrangeCheckMark} alt="check" />
                  Brand font files
                </li>
                <li>
                  <img src={OrangeCheckMark} alt="check" />
                  Iconography
                </li>
                <li>
                  <img src={OrangeCheckMark} alt="check" />
                  Any other brand material
                </li>
              </ul>
              <Button
                className="btn-primary w-100 mb-2"
                onClick={() => redirectTO()}
                disabled={
                  !history.location.pathname.includes(
                    '/assigned-choose-delegate/',
                  ) &&
                  isChecked &&
                  !(data && data.re_assigned_email)
                }>
                Continue
              </Button>
              <p className="info-text-gray security-lock text-center  mb-0">
                <img width="16px" src={SecurityLock} alt="lock" />
                <span>
                  {' '}
                  All files will be stored securely and never shared with a 3rd
                  party.
                </span>
              </p>
            </div>
          </OnBoardingBody>
        </>
      )}
    </>
  );
}

const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 2;
  top: 70px;
  padding: 22px 0px 18px 0px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};

  .skip-steps {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    cursor: pointer;
  }
`;
