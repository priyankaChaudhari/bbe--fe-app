import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import NavigationHeader from './NavigationHeader';
import { logout, userMe } from '../../store/actions';
import { showOnboardingMsg } from '../../store/actions/userState';
import { GrayClockIcon, OrangeCheckMark } from '../../theme/images';
import { accountSummary, updateUserMe } from '../../api';
import { OnBoardingBody, GreyCard, Button, PageLoader } from '../../common';
import {
  PATH_AMAZON_MERCHANT,
  PATH_BILLING_DETAILS,
  PATH_CUSTOMER_DETAILS,
  stepPath,
} from '../../constants';

export default function Summary() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [skipAmazonAccount, setSkipAmazonAccount] = useState(false);

  useEffect(() => {
    accountSummary(userInfo.customer_onboarding).then((response) => {
      setData(response && response.data);
      const skip =
        response &&
        response.data &&
        response.data.find((op) => op.step === 'merchant id');
      setSkipAmazonAccount(skip && skip.step_not_applicable);
      setIsLoading({ loader: false, type: 'page' });
      if (response && response.data && response.data.length < 3) {
        setShowDashboard(false);
      } else if (response.data.some((item) => item.is_completed === false)) {
        setShowDashboard(false);
      } else {
        setShowDashboard(true);
      }
    });
  }, [userInfo.customer_onboarding]);

  const getPath = (step, type) => {
    for (const item of stepPath) {
      if (item.key === step) {
        if (type === 'label') {
          return item.title;
        }
        return item.view;
      }
    }
    return '';
  };

  const redirect = () => {
    setIsLoading({ loader: true, type: 'button' });
    updateUserMe(userInfo.id, {
      step: { ...userInfo.step, [userInfo.customer]: 6 },
    }).then((user) => {
      if (user && user.status === 200) {
        dispatch(userMe());
        dispatch(showOnboardingMsg(true));
        history.push(PATH_CUSTOMER_DETAILS.replace(':id', userInfo.customer));
        setIsLoading({ loader: false, type: 'button' });
      } else {
        setIsLoading({ loader: false, type: 'button' });
      }
    });
    localStorage.removeItem('match');
  };

  return (
    <>
      <NavigationHeader
        bar="99.9"
        backStep={
          skipAmazonAccount ? PATH_BILLING_DETAILS : PATH_AMAZON_MERCHANT
        }
        userInfo={userInfo}
        verifiedStepData={{}}
        stepData={{}}
        stepName="summary"
      />
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <OnBoardingBody className="body-white pt-5">
          <div className="white-card-base panel pb-4">
            <h3 className="page-heading ">Account Summary</h3>

            <div className="sub-information mb-3">
              Thanks! Below is a summary of everything that’s been submitted.
            </div>

            <div className="complete-steps mt-1 mb-3">
              Within 24 hours of completing your account setup, expect to hear
              from your On-boarding Specialist.
              <span>
                They will be walking you through those final set up items and
                getting you in contact with your Brand Growth Strategist.
              </span>
            </div>
            <GreyCard>
              <div className="information-text mt-2">
                Create Your Account
                <div className="completed-status">
                  <img
                    className="orange-check"
                    src={OrangeCheckMark}
                    alt="check"
                  />
                  Completed
                </div>
              </div>

              {data &&
                data.map((item) => (
                  <div className="information-text mt-1" key={item.step}>
                    {getPath(item.step, 'label')}
                    {item.is_completed ? (
                      <div
                        className={
                          skipAmazonAccount && item.step === 'merchant id'
                            ? 'pending-status'
                            : 'completed-status'
                        }>
                        {skipAmazonAccount && item.step === 'merchant id' ? (
                          ''
                        ) : (
                          <img
                            className="orange-check"
                            src={OrangeCheckMark}
                            alt="check"
                          />
                        )}
                        {skipAmazonAccount && item.step === 'merchant id'
                          ? 'Step not applicable for your contract type'
                          : userInfo.email === item.email || item.email === ''
                          ? ' Completed'
                          : `Provided by ${item.email}`}
                      </div>
                    ) : (
                      <div className="pending-status">
                        <img
                          className="pending-icon"
                          src={GrayClockIcon}
                          alt="clock"
                        />

                        {item.email === userInfo.email || item.email === ''
                          ? 'Skipped'
                          : `Assigned to ${item.email}`}
                      </div>
                    )}

                    {skipAmazonAccount && item.step === 'merchant id' ? (
                      ''
                    ) : (
                      <div
                        className="view-details"
                        onClick={() => history.push(getPath(item.step, 'path'))}
                        role="presentation">
                        {' '}
                        View
                      </div>
                    )}
                  </div>
                ))}
            </GreyCard>

            {showDashboard ? (
              <Button
                className="btn-primary w-100 mt-4 "
                onClick={() => redirect()}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'View Dashboard'
                )}
              </Button>
            ) : (
              <GreyCard className="yellow-card mt-2  ">
                Once all the sections above have been completed you’ll get full
                access to your account dashboard. Your progress so far has been
                saved so you can{' '}
                <u
                  onClick={() => dispatch(logout())}
                  role="presentation"
                  style={{ fontSize: '15px' }}
                  className="cursor link-url">
                  sign out
                </u>{' '}
                or close this tab until you or an assignee provides the
                remaining information.
              </GreyCard>
            )}
          </div>
        </OnBoardingBody>
      )}
    </>
  );
}
