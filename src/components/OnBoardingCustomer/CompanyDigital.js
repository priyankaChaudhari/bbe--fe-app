import React, { useState } from 'react';

import queryString from 'query-string';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TrashIcons } from '../../theme/images';
import { getCustomerDetails, userMe } from '../../store/actions';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateCustomerDetails,
  updateUserMe,
} from '../../api';
import {
  PATH_SUMMARY,
  PATH_THANKS,
  socialIcons,
  stepPath,
} from '../../constants';
import {
  OnBoardingBody,
  ContractFormField,
  Button,
  PageLoader,
  ErrorMsg,
} from '../../common';

export default function CompanyDigital({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  data,
  isLoading,
  isChecked,
  summaryData,
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

  const getIncompleteStep = summaryData.find(
    (op) =>
      Object.keys(op)[0] !== 'digital presence' &&
      Object.values(op)[0] === false,
  );

  const CheckStep = (step) => {
    setIsLoading({ loader: true, type: 'button' });
    if (step === 'merchant id' || getIncompleteStep === undefined) {
      history.push(PATH_SUMMARY);
    } else {
      stepPath.map((item) => {
        if (Object.keys(getIncompleteStep)[0] === item.key) {
          return history.push(item.view);
        }
        return '';
      });
    }
    setIsLoading({ loader: false, type: 'button' });
  };

  const createBillingStep = () => {
    const detail = {
      is_completed: false,
      email: '',
      step: 'billing information',
      customer_onboarding: userInfo.customer_onboarding,
    };
    askSomeoneData(detail);
  };

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
                CheckStep('digital presence');
              }
              updateUserMe(userInfo.id || verifiedStepData.user_id, {
                step: {
                  ...(userInfo.step || verifiedStepData.user_step),
                  [userInfo.customer || verifiedStepData.customer_id]: 2,
                },
              }).then((user) => {
                if (user && user.status === 200) {
                  if (assignedToSomeone) {
                    localStorage.removeItem('match');
                  } else dispatch(userMe());
                }
              });
              createBillingStep();
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
                CheckStep('digital presence');
              }
              updateUserMe(userInfo.id || verifiedStepData.user_id, {
                step: {
                  ...(userInfo.step || verifiedStepData.user_step),
                  [userInfo.customer || verifiedStepData.customer_id]: 2,
                },
              }).then((user) => {
                if (user && user.status === 200) {
                  if (assignedToSomeone) {
                    localStorage.removeItem('match');
                  } else dispatch(userMe());
                }
              });
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
          <ErrorMsg>
            {apiError && apiError.website && apiError.website[0]}
          </ErrorMsg>
        </ContractFormField>
        <div className="label-title mb-1 mt-4">Social</div>

        <div className="row">
          {socialIcons.map((item) => (
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
                  {data && data[item.key] && !isChecked ? (
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
              <>{assignedToSomeone ? 'Submit' : 'Continue'} </>
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
    user_id: PropTypes.string,
    user_step: PropTypes.objectOf(PropTypes.object),
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
  summaryData: PropTypes.arrayOf(PropTypes.object).isRequired,
};
