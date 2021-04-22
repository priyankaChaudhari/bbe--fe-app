/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import queryString from 'query-string';

import {
  OnBoardingBody,
  ContractFormField,
  // FormField,
  Button,
  PageLoader,
  UnauthorizedHeader,
  GreyCard,
} from '../../common';
import { CaretUp } from '../../theme/images';
import AskSomeone from './AskSomeone';
import {
  getStepDetails,
  updateAskSomeoneData,
  updateCustomerDetails,
  updateUserMe,
  verifyStepToken,
} from '../../api';
import { getCustomerDetails, userMe } from '../../store/actions';
import { SocialIcons } from '../../constants/FieldConstants';
import NavigationHeader from './NavigationHeader';
import { PATH_BILLING_DETAILS, PATH_THANKS } from '../../constants';
import Header from '../../common/Header';

export default function CompanyDigital() {
  const history = useHistory();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [assignedToSomeone, setAssignedToSomeone] = useState(false);
  const [stepData, setStepData] = useState([]);
  const [verifiedStepData, setVerifiedStepData] = useState({});
  const params = queryString.parse(history.location.search);

  useEffect(() => {
    if (params && params.key) {
      localStorage.setItem('match', params && params.key);
      verifyStepToken(params.key).then((response) => {
        setVerifiedStepData(response && response.data);
      });
    }
    if (history.location.pathname.includes('assigned')) {
      setAssignedToSomeone(true);
    } else {
      setAssignedToSomeone(false);
      getStepDetails(
        verifiedStepData.customer_onboarding_id || 'CBZQuki',
        'digital presence',
      ).then((response) => {
        setStepData(
          response &&
            response.data &&
            response.data.results &&
            response.data.results[0],
        );
        if (
          response &&
          response.data &&
          response.data.results &&
          response.data.results[0] &&
          response.data.results[0].step === 'digital presence'
        ) {
          setIsChecked(true);
        }
        setIsLoading({ loader: false, type: 'page' });
      });
    }
    // dispatch(getCustomerDetails(userInfo.customer));
    dispatch(getCustomerDetails(verifiedStepData.customer_id || 'CMF9QAS'));
  }, [dispatch, userInfo.customer]);

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
      <>
        <ContractFormField className="mt-3">
          <label>
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
      </>
    );
  };

  return (
    <>
      {assignedToSomeone ? (
        <UnauthorizedHeader />
      ) : (
        <Header type="onboarding" />
      )}
      {assignedToSomeone ? (
        ''
      ) : (
        <NavigationHeader bar="40" skipStep={PATH_BILLING_DETAILS} />
      )}

      {loader || (isLoading.loader && isLoading.type === 'page') ? (
        <PageLoader component="modal" color="#FF5933" type="page" />
      ) : (
        <OnBoardingBody className="body-white">
          <div className="white-card-base panel">
            {assignedToSomeone ? (
              <GreyCard className="yellow-card mt-2 mb-4">
                <div className="hi-name mb-2">
                  {' '}
                  <span className="video-link ">
                    {' '}
                    {verifiedStepData && verifiedStepData.user_email}{' '}
                  </span>
                  has asked that you provide the company’s digital presence
                  information that will be used for your Buy Box Experts
                  agreement.
                </div>
                If you’re unable to provide this information or you think this
                was sent to you unintentionally please let them know via the
                email address highlighted above.
              </GreyCard>
            ) : (
              <p className="account-steps m-0">Step 2 of 4</p>
            )}
            <h3 className="page-heading ">Your company’s digital presence</h3>
            <p className="info-text-gray m-0 ">
              Need help on why we need this information? <br />{' '}
              <a className="video-link" href="*">
                Click here to watch the video.
              </a>
            </p>
            {assignedToSomeone ? (
              ''
            ) : (
              <AskSomeone
                setIsChecked={setIsChecked}
                isChecked={isChecked}
                step="digital presence"
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                params={verifiedStepData}
                stepData={stepData}
                setStepData={setStepData}
              />
            )}
            {assignedToSomeone || !isChecked ? (
              <>
                {generateHTML()}
                <Button
                  className="btn-primary w-100  mt-4"
                  onClick={() => saveDetails()}>
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Continue'
                  )}
                </Button>
              </>
            ) : (
              ''
            )}
          </div>
          {!assignedToSomeone && isChecked ? (
            <div className="white-card-base panel gap-none">
              <div
                className="label-title cursor mt-4"
                type="button"
                role="presentation"
                onClick={() => setOpenCollapse(!openCollapse)}>
                Expand questions
                <img
                  className="arrow-up"
                  src={CaretUp}
                  alt="arrow"
                  style={{
                    transform: openCollapse ? 'rotate(180deg)' : '',
                  }}
                />
                <div className="clear-fix" />
              </div>
              <CollapseOpenContainer>
                <Collapse isOpened={openCollapse}>{generateHTML()}</Collapse>
              </CollapseOpenContainer>
              <Button
                className="btn-primary w-100  mt-4"
                onClick={() => saveDetails()}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          ) : (
            ''
          )}
        </OnBoardingBody>
      )}
    </>
  );
}

const CollapseOpenContainer = styled.div`
  opacity: 0.6;
`;
