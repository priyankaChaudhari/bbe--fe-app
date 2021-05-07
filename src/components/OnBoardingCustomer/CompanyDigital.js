import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import queryString from 'query-string';
import PropTypes from 'prop-types';

import {
  OnBoardingBody,
  ContractFormField,
  Button,
  PageLoader,
  ErrorMsg,
} from '../../common';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateCustomerDetails,
  updateUserMe,
} from '../../api';
import { getCustomerDetails, userMe } from '../../store/actions';
import { SocialIcons } from '../../constants/FieldConstants';
import { PATH_AMAZON_MERCHANT, PATH_THANKS } from '../../constants';
import { TrashIcons } from '../../theme/images';

export default function CompanyDigital({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  data,
  isLoading,
  isChecked,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [apiError, setApiError] = useState({});
  const params = queryString.parse(history.location.search);
  const [clearSocialInput, setClearSocialInput] = useState({
    facebook: '',
    instagram: '',
    linkedin: '',
    pinterest: '',
    twitter: '',
  });

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });

    updateCustomerDetails(
      userInfo.customer || verifiedStepData.customer_id,
      formData,
    ).then((res) => {
      if (res && res.status === 200) {
        if (
          (stepData === undefined ||
            (stepData &&
              Object.keys(stepData) &&
              Object.keys(stepData).length === 0)) &&
          verifiedStepData &&
          Object.keys(verifiedStepData) &&
          Object.keys(verifiedStepData).length === 0
        ) {
          const detail = {
            is_completed: true,
            email: userInfo.email,
            step: 'digital presence',
            customer_onboarding: userInfo.customer_onboarding,
          };
          askSomeoneData(detail).then((stepResponse) => {
            if (stepResponse && stepResponse.status === 201) {
              if (assignedToSomeone) {
                const stringified =
                  queryString &&
                  queryString.stringify({
                    name: verifiedStepData.user_name,
                  });
                history.push({
                  pathname: PATH_THANKS,
                  search: `${stringified}`,
                });
              } else {
                history.push(PATH_AMAZON_MERCHANT);
              }
              updateUserMe(userInfo.id, {
                step: { ...userInfo.step, [userInfo.customer]: 2 },
              }).then((user) => {
                if (user && user.status === 200) {
                  dispatch(userMe());
                }
              });
              localStorage.removeItem('match');
              setIsLoading({ loader: false, type: 'button' });
            }
          });
        } else {
          updateAskSomeoneData(
            (stepData && stepData.id) || verifiedStepData.step_id,
            {
              token: assignedToSomeone ? params && params.key : '',
              is_completed: true,
            },
          ).then((response) => {
            if (response && response.status === 200) {
              if (assignedToSomeone) {
                const stringified =
                  queryString &&
                  queryString.stringify({
                    name: verifiedStepData.user_name,
                  });
                history.push({
                  pathname: PATH_THANKS,
                  search: `${stringified}`,
                });
              } else {
                history.push(PATH_AMAZON_MERCHANT);
              }
              updateUserMe(userInfo.id, {
                step: { ...userInfo.step, [userInfo.customer]: 2 },
              }).then((user) => {
                if (user && user.status === 200) {
                  dispatch(userMe());
                }
              });
              localStorage.removeItem('match');
              setIsLoading({ loader: false, type: 'button' });
            }
          });
        }
      }
      if (res && res.status === 400) {
        setApiError(res && res.data);
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setApiError({
      ...apiError,
      [event.target.name]: '',
    });
  };

  const clearSocialURL = (key) => {
    setClearSocialInput({ ...clearSocialInput, [key]: null });
    updateCustomerDetails(userInfo.customer || verifiedStepData.customer_id, {
      [key]: null,
    }).then((response) => {
      if (response && response.status === 200) {
        dispatch(
          getCustomerDetails(userInfo.customer || verifiedStepData.customer_id),
        );
        setIsLoading({ loader: false, type: 'social' });
      }
      if (response && response.status === 400) {
        setApiError(response && response.data);
        setIsLoading({ loader: false, type: 'social' });
      }
    });
  };

  const generateHTML = () => {
    return (
      <OnBoardingBody className="body-white">
        <ContractFormField className="mt-3">
          <label htmlFor="website">
            Website
            <input
              className="form-control"
              type="text"
              placeholder="Enter Website"
              defaultValue={data && data.website}
              name="website"
              onChange={(event) => handleChange(event)}
              readOnly={isChecked}
            />
          </label>
        </ContractFormField>
        <div className="label-title mb-1 mt-4">Social</div>

        <div className="row">
          {SocialIcons.map((item) => (
            <React.Fragment key={item.key}>
              <div className="col-4 mt-3 pr-0">
                <span>
                  <img
                    src={item.onboard}
                    alt={item.key}
                    className={item.property}
                  />{' '}
                  {item.label}
                </span>
              </div>

              <div className="col-8 ">
                {' '}
                <ContractFormField>
                  <input
                    className="form-control extra-space"
                    type="text"
                    placeholder={`Enter ${item.label} URL`}
                    name={item.key}
                    defaultValue={data && data[item.key]}
                    onChange={(event) => handleChange(event)}
                    readOnly={isChecked}
                  />
                  {data && data[item.key] ? (
                    <img
                      src={TrashIcons}
                      alt="delete"
                      className="trash cursor deleteSocial"
                      onClick={() => clearSocialURL(item.key)}
                      role="presentation"
                    />
                  ) : (
                    ''
                  )}
                  <ErrorMsg>
                    {apiError && apiError[item.key] && apiError[item.key][0]}
                  </ErrorMsg>
                </ContractFormField>
              </div>
            </React.Fragment>
          ))}
        </div>
      </OnBoardingBody>
    );
  };

  return (
    <>
      <OnBoardingBody className="body-white">
        <div className="white-card-base panel gap-none">{generateHTML()}</div>
        {isChecked ? (
          ''
        ) : (
          <Button
            className="btn-primary w-100  mt-4 mb-4"
            onClick={() => saveDetails()}
            disabled={isChecked}>
            {isLoading.loader && isLoading.type === 'button' ? (
              <PageLoader color="#fff" type="button" />
            ) : (
              'Continue'
            )}
          </Button>
        )}
      </OnBoardingBody>
    </>
  );
}

CompanyDigital.defaultProps = {
  stepData: {},
};

CompanyDigital.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    customer: PropTypes.string,
    customer_onboarding: PropTypes.string,
    step: PropTypes.shape({
      step: PropTypes.number,
    }),
  }).isRequired,
  setIsLoading: PropTypes.func.isRequired,
  assignedToSomeone: PropTypes.bool.isRequired,
  stepData: PropTypes.shape({
    id: PropTypes.string,
  }),
  verifiedStepData: PropTypes.shape({
    user_name: PropTypes.string,
    step_id: PropTypes.string,
    customer_id: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    website: PropTypes.string,
  }).isRequired,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  isChecked: PropTypes.bool.isRequired,
};
