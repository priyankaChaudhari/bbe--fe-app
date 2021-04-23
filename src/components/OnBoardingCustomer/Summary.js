import React from 'react';
import Header from '../../common/Header';
import { OnBoardingBody, GreyCard, Button } from '../../common';
import { GrayClockIcon, OrangeCheckMark } from '../../theme/images';
import NavigationHeader from './NavigationHeader';
import { PATH_AMAZON_ACCOUNT } from '../../constants';

export default function Summary() {
  return (
    <>
      <Header type="onboarding" />
      <NavigationHeader bar="99.9" backStep={PATH_AMAZON_ACCOUNT} />
      <OnBoardingBody className="body-white">
        <div className="white-card-base panel account-reassign pt-5">
          <h3 className="page-heading ">Account Summary</h3>
          <p className="information-text mt-2 mb-0">
            <div className="hi-name">
              Thanks! Below is a summary of everything that’s been submitted.
            </div>
            Now that you have sent us the invitations for account access, our
            On-boarding team will accept those and follow up with an email with
            detailed instructions on the permissions you need to provide to each
            of the email profiles.
          </p>
          <div className="complete-steps mt-1 mb-3">
            Expect to hear from your On-boarding Specialist in the next 24 hours
            to walk through those final set up items.{' '}
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
            <div className="information-text mt-1">
              Company Details
              <div className="completed-status">
                <img
                  className="orange-check"
                  src={OrangeCheckMark}
                  alt="check"
                />
                Completed
              </div>
              <div className="view-details"> View</div>
            </div>
            <div className="information-text mt-1">
              Billing Information
              <div className="pending-status">
                <img className="pending-icon" src={GrayClockIcon} alt="clock" />
                Assigned to john@asherapparel.com
              </div>
              <div className="view-details"> View</div>
            </div>
            <div className="information-text mt-1">
              Amazon Account Access
              <div className="pending-status">
                <img className="pending-icon" src={GrayClockIcon} alt="clock" />
                Skipped
              </div>
              <div className="view-details"> View</div>
            </div>
          </GreyCard>
          <GreyCard className="yellow-card mt-2">
            Once all the sections above have been completed you’ll get full
            access to your account dashboard. Your progress so far has been
            saved so you can <u>sign out</u> or close this tab until you or an
            assignee provides the remaining information.
          </GreyCard>
          <Button className="btn-primary w-100 mt-4"> View Dashboard</Button>
        </div>
      </OnBoardingBody>
    </>
  );
}
