import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { OnBoardingBody, GreyCard, Button, PageLoader } from '../../common';
import { GrayClockIcon, OrangeCheckMark } from '../../theme/images';
import NavigationHeader from './NavigationHeader';
import {
  PATH_AMAZON_ACCOUNT,
  PATH_AMAZON_MERCHANT,
  PATH_BILLING_DETAILS,
  PATH_COMPANY_DETAILS,
  PATH_CUSTOMER_DETAILS,
} from '../../constants';
import { accountSummary, updateUserMe } from '../../api';
import { logout, userMe } from '../../store/actions';

export default function Summary() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const userInfo = useSelector((state) => state.userState.userInfo);

  const whichStep = [
    {
      key: 'digital presence',
      view: PATH_COMPANY_DETAILS,
      title: 'Company Details',
    },
    {
      key: 'billing information',
      title: 'Billing Information',
      view: PATH_BILLING_DETAILS,
    },
    {
      key: 'merchant id',
      title: 'Amazon Merchant ID',
      view: PATH_AMAZON_MERCHANT,
    },
    {
      key: 'developer access',
      title: 'Amazon Developer Access',
      view: PATH_AMAZON_ACCOUNT,
    },
  ];

  useEffect(() => {
    accountSummary('CBZQuki').then((response) => {
      setData(response && response.data);
      setIsLoading({ loader: false, type: 'page' });
      if (response.data.some((item) => item.is_completed === false)) {
        setShowDashboard(false);
      } else {
        setShowDashboard(true);
      }
    });
  }, []);

  const getPath = (step, type) => {
    for (const item of whichStep) {
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
    updateUserMe(userInfo.id, { step: 6 }).then((user) => {
      if (user && user.status === 200) {
        dispatch(userMe());
        history.push(PATH_CUSTOMER_DETAILS.replace('CMF9QAS'));
      }
    });
    localStorage.removeItem('match');
    setIsLoading({ loader: false, type: 'button' });
  };

  return (
    <>
      <NavigationHeader bar="99.9" backStep={PATH_AMAZON_ACCOUNT} />
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader component="modal" color="#FF5933" type="page" />
      ) : (
        <OnBoardingBody className="body-white">
          <div className="white-card-base panel account-reassign pt-5">
            <h3 className="page-heading ">Account Summary</h3>
            <p className="information-text mt-2 mb-0">
              <div className="hi-name">
                Thanks! Below is a summary of everything that’s been submitted.
              </div>
              Now that you have sent us the invitations for account access, our
              On-boarding team will accept those and follow up with an email
              with detailed instructions on the permissions you need to provide
              to each of the email profiles.
            </p>
            <div className="complete-steps mt-1 mb-3">
              Expect to hear from your On-boarding Specialist in the next 24
              hours to walk through those final set up items.{' '}
              <span>
                They will also get you in contact with your Brand Growth
                Strategist.
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
                      <div className="completed-status">
                        <img
                          className="orange-check"
                          src={OrangeCheckMark}
                          alt="check"
                        />
                        Completed
                      </div>
                    ) : (
                      <div className="pending-status">
                        <img
                          className="pending-icon"
                          src={GrayClockIcon}
                          alt="clock"
                        />
                        Skipped
                      </div>
                    )}
                    {item.email !== userInfo.email ? (
                      <div className="pending-status">
                        <img
                          className="pending-icon"
                          src={GrayClockIcon}
                          alt="clock"
                        />
                        Assigned to {item.email}
                      </div>
                    ) : (
                      ''
                    )}
                    <div
                      className="view-details"
                      onClick={() => history.push(getPath(item.step, 'path'))}
                      role="presentation">
                      {' '}
                      View
                    </div>
                  </div>
                ))}
            </GreyCard>

            {showDashboard ? (
              <Button
                className="btn-primary w-100 mt-4"
                onClick={() => redirect()}>
                {' '}
                View Dashboard
              </Button>
            ) : (
              <GreyCard className="yellow-card mt-2">
                Once all the sections above have been completed you’ll get full
                access to your account dashboard. Your progress so far has been
                saved so you can{' '}
                <u
                  onClick={() => dispatch(logout())}
                  role="presentation"
                  className="cursor">
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
