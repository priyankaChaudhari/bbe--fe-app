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
} from '../../common';
import {
  updateAskSomeoneData,
  updateCustomerDetails,
  updateUserMe,
} from '../../api';
import { userMe } from '../../store/actions';
import { SocialIcons } from '../../constants/FieldConstants';
import { PATH_BILLING_DETAILS, PATH_THANKS } from '../../constants';

export default function CompanyDigital({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  data,
  isLoading,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  const params = queryString.parse(history.location.search);

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });

    updateCustomerDetails(
      'CMF9QAS' || verifiedStepData.customer,
      formData,
    ).then((res) => {
      if (res && res.status === 200) {
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
              history.push(PATH_BILLING_DETAILS);
            }
            updateUserMe(userInfo.id, { step: 2 }).then((user) => {
              if (user && user.status === 200) {
                dispatch(userMe());
              }
            });
            localStorage.removeItem('match');
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      }
      if (res && res.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
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
                    className="form-control"
                    type="text"
                    placeholder={`Enter ${item.label} URL`}
                    name={item.key}
                    defaultValue={data && data[item.key]}
                    onChange={(event) => handleChange(event)}
                  />
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
        <div className="white-card-base panel">{generateHTML()}</div>
        <Button
          className="btn-primary w-100  mt-4"
          onClick={() => saveDetails()}>
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            'Continue'
          )}
        </Button>
      </OnBoardingBody>
    </>
  );
}

CompanyDigital.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  setIsLoading: PropTypes.func.isRequired,
  assignedToSomeone: PropTypes.bool.isRequired,
  stepData: PropTypes.arrayOf(PropTypes.array).isRequired,
  verifiedStepData: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string,
    }),
  ).isRequired,
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
};
