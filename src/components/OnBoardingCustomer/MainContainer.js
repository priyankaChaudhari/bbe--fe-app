/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import queryString from 'query-string';

import {
  OnBoardingBody,
  UnauthorizedHeader,
  GreyCard,
  PageLoader,
} from '../../common';
import { CaretUp } from '../../theme/images';
import AskSomeone from './AskSomeone';
import { getStepDetails, getUserData, verifyStepToken } from '../../api';
import { getCustomerDetails } from '../../store/actions';
import NavigationHeader from './NavigationHeader';
import {
  PATH_AMAZON_ACCOUNT,
  PATH_AMAZON_MERCHANT,
  PATH_BILLING_DETAILS,
  PATH_COMPANY_DETAILS,
  PATH_SUMMARY,
} from '../../constants';
import Header from '../../common/Header';
import CompanyDigital from './CompanyDigital';
import BillingInfo from './BillingInfo';
import { AmazonDeveloperAccess, AmazonMerchant, CreateAccount } from '.';

export default function MainContainer() {
  const history = useHistory();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [assignedToSomeone, setAssignedToSomeone] = useState(false);
  const [stepData, setStepData] = useState({});
  const [verifiedStepData, setVerifiedStepData] = useState({});
  const params = queryString.parse(history.location.search);
  const [userInfo, setUserInfo] = useState({});

  const whichStep = [
    {
      key: 'digital presence',
      stepof: 2,
      title: 'Your company’s digital presence',
      skip: PATH_BILLING_DETAILS,
      bar: '33.2',
      path: 'company-details',
      subTitle: 'Need help on why we need this information?',
      video: true,
    },
    {
      key: 'billing information',
      stepof: 3,
      title: 'Billing Information',
      skip: PATH_AMAZON_MERCHANT,
      back: PATH_COMPANY_DETAILS,
      bar: '49.8',
      path: 'billing-details',
      video: false,
    },
    {
      key: 'merchant id',
      stepof: 4,
      title: 'Your Amazon Merchant ID',
      skip: PATH_AMAZON_ACCOUNT,
      back: PATH_BILLING_DETAILS,
      bar: '66.4',
      path: 'amazon-merchant',
      subTitle:
        'This information will be used by our data BOTS to access data we will use to best manage your account. For a quick tutorial on how to access this information, watch the video below.',
      video: true,
    },
    {
      key: 'developer access',
      stepof: 5,
      title: 'Amazon Developer Access',
      skip: PATH_SUMMARY,
      back: PATH_AMAZON_MERCHANT,
      bar: '83',
      path: 'amazon-account',
      subTitle:
        'Finally, we need you to grant us developer access to your Amazon Seller account.',
      video: true,
    },
  ];

  const getStepName = () => {
    for (const item of whichStep) {
      if (history.location.pathname.includes(item.path)) {
        return item.key === 'summary' ? '' : item.key;
      }
    }
    return '';
  };

  useEffect(() => {
    setIsLoading({ loader: true, type: 'page' });
    if (!history.location.pathname.includes('/account-setup/create-password')) {
      if (
        history.location.pathname.includes('/account-setup/') &&
        params &&
        params.key
      ) {
        localStorage.setItem('match', params.key);
        verifyStepToken(params.key).then((verify) => {
          getStepDetails(
            (verify && verify.data && verify.data.customer_onboarding_id) ||
              (userInfo && userInfo.customer_onboarding),
            getStepName(),
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
              response.data.results[0].step === getStepName()
            ) {
              setIsChecked(true);
            }
            setIsLoading({ loader: false, type: 'page' });
          });
          dispatch(
            getCustomerDetails(
              (verify && verify.data && verify.data.customer_id) ||
                (userInfo && userInfo.customer),
            ),
          );
          setVerifiedStepData(verify && verify.data);
        });
      }
      if (history.location.pathname.includes('assigned')) {
        setAssignedToSomeone(true);
      } else {
        getUserData(localStorage.getItem('customer')).then((res) => {
          if (res && res.status === 200) {
            setUserInfo(res && res.data);
            getStepDetails(
              (res && res.data && res.data.customer_onboarding) ||
                verifiedStepData.customer_onboarding_id,
              getStepName(),
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
                response.data.results[0].step === getStepName()
              ) {
                setIsChecked(true);
              }
              setIsLoading({ loader: false, type: 'page' });
            });
            dispatch(
              getCustomerDetails(
                (res && res.data && res.data.customer) ||
                  verifiedStepData.customer_id,
              ),
            );
          } else {
            setIsLoading({ loader: false, type: 'page' });
          }
        });
        setAssignedToSomeone(false);
      }
    }
  }, [history.location.pathname]);

  const generateHTML = (path) => {
    if (path === 'company-details')
      return (
        <CompanyDigital
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          data={data}
          isLoading={isLoading}
        />
      );
    if (path === 'billing-details')
      return (
        <BillingInfo
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          data={data}
          isLoading={isLoading}
        />
      );
    if (path === 'amazon-merchant')
      return (
        <AmazonMerchant
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          data={data}
          isLoading={isLoading}
        />
      );
    if (path === 'amazon-account')
      return (
        <AmazonDeveloperAccess
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          data={data}
          isLoading={isLoading}
        />
      );
    return '';
  };

  const generateHeader = (item) => {
    if (history.location.pathname.includes(item.path))
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
            <NavigationHeader
              bar={item.bar}
              skipStep={item.skip}
              backStep={item.back}
              showSuccessMsg={item.path === 'summary'}
              stepData={stepData}
              verifiedStepData={verifiedStepData}
              stepName={getStepName()}
              userInfo={userInfo}
            />
          )}

          {loader || (isLoading.loader && isLoading.type === 'page') ? (
            <PageLoader color="#FF5933" type="page" />
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
                      has asked that you provide {item.title}
                      information that will be used for your Buy Box Experts
                      agreement.
                    </div>
                    If you’re unable to provide this information or you think
                    this was sent to you unintentionally please let them know
                    via the email address highlighted above.
                  </GreyCard>
                ) : (
                  <p className="account-steps m-0">Step {item.stepof} of 5</p>
                )}
                <h3 className="page-heading ">{item.title}</h3>
                {item.path === 'billing-details' ? null : (
                  <p className="info-text-gray m-0 mb-4 ">
                    {item.subTitle} <br />
                    {item.video ? (
                      <a className="video-link  " href="*">
                        Click here to watch the video.
                      </a>
                    ) : null}
                  </p>
                )}
                {item.path === 'amazon-account' ? (
                  <p className="information-text mt-0 mb-0">
                    If you don’t have access to your Amazon Seller Central admin
                    account then you can use the checkbox below to assign this
                    step to someone that does.
                  </p>
                ) : (
                  ''
                )}
                {assignedToSomeone ? (
                  ''
                ) : (
                  <AskSomeone
                    setIsChecked={setIsChecked}
                    isChecked={isChecked}
                    step={item.key}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    params={verifiedStepData}
                    stepData={stepData}
                    setStepData={setStepData}
                    userInfo={userInfo}
                  />
                )}
                {assignedToSomeone || !isChecked ? (
                  <>{generateHTML(item.path)}</>
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
                    <Collapse isOpened={openCollapse}>
                      {generateHTML(item.path)}
                    </Collapse>
                  </CollapseOpenContainer>
                </div>
              ) : (
                ''
              )}
            </OnBoardingBody>
          )}
        </>
      );
    return '';
  };

  return (
    <>
      {history.location.pathname.includes('create-password') ? (
        <CreateAccount />
      ) : (
        <>
          {whichStep.map((item) => (
            <React.Fragment key={item.key}>
              {generateHeader(item)}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}

const CollapseOpenContainer = styled.div`
  // opacity: 0.6;
`;
