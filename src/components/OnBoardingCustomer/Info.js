import React from 'react';
import { Link } from 'react-router-dom';

import { Button, OnBoardingBody } from '../../common';
import { PATH_CREATE_PASSWORD } from '../../constants';
import { LockFinish, OrangeCheckMark } from '../../theme/images';

export default function Info() {
  return (
    <OnBoardingBody>
      {' '}
      <div className="white-card-base">
        <img className="lock-finish" src={LockFinish} alt="lock" />
        <p className="account-steps m-0">Step 1 of 4</p>
        <h3 className="page-heading ">Create your account</h3>
        <p className="information-text m-0 ">
          <div className="hi-name"> Hi Newton,</div>
          We need some essential information in order to set up your account on
          Buy Box Experts NEXT. We hate paperwork so we ask for as little as
          necessary to get going.
        </p>
        <div className="complete-steps mt-3">
          You’ll need the following to complete your account setup:
        </div>
        <ul className="account-steps-check">
          <li>
            <img src={OrangeCheckMark} alt="check" />
            Your company website url & social links
          </li>
          <li>
            <img src={OrangeCheckMark} alt="check" />
            Your Amazon account credentials
          </li>
          <li>
            <img src={OrangeCheckMark} alt="check" />
            Billing and payment details
          </li>
          <li>
            <img src={OrangeCheckMark} alt="check" />
            Details of co-workers that will help manage the account
          </li>
        </ul>
        <Link to={PATH_CREATE_PASSWORD}>
          <Button className="btn-primary w-100 mb-3">
            Continue to account creation
          </Button>
        </Link>
        <Link to={PATH_CREATE_PASSWORD}>
          <Button className="btn-transparent w-100">
            Assign to someone else
          </Button>
        </Link>
      </div>
    </OnBoardingBody>
  );
}
