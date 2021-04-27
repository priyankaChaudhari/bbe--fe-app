import React from 'react';
import { useHistory } from 'react-router-dom';

import queryString from 'query-string';

import { Button, OnBoardingBody, UnauthorizedHeader } from '../../common';
import { PATH_CREATE_PASSWORD } from '../../constants';
import { LockFinish, OrangeCheckMark } from '../../theme/images';

export default function Info() {
  const history = useHistory();
  const params = queryString.parse(history.location.search);

  const redirect = (type) => {
    localStorage.setItem(
      'email',
      history.location.search.split('email=')[1].split('&')[0] ||
        (params && params.email),
    );
    if (type === 'continue') {
      const stringified =
        queryString &&
        queryString.stringify({
          ...params,
          type: 'continue',
        });

      history.push({
        pathname: PATH_CREATE_PASSWORD,
        search: stringified,
      });
    }
    if (type === 'assign') {
      const stringified =
        queryString &&
        queryString.stringify({
          ...params,
          type: 'new',
        });

      history.push({
        pathname: PATH_CREATE_PASSWORD,
        search: stringified,
      });
    }
  };

  return (
    <OnBoardingBody>
      <UnauthorizedHeader />{' '}
      <div className="white-card-base ">
        <img className="lock-finish" src={LockFinish} alt="lock" />
        <p className="account-steps m-0">Step 1 of 5</p>
        <h3 className="page-heading ">Create your account</h3>
        <p className="information-text m-0 ">
          <div className="hi-name capitalize">
            Hi {(params && params.name) || 'Customer'},
          </div>
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

        <Button
          className="btn-primary w-100 mb-3"
          onClick={() => redirect('continue')}>
          Continue to account creation
        </Button>

        <Button
          className="btn-transparent w-100"
          onClick={() => redirect('assign')}>
          Assign to someone else
        </Button>
      </div>
    </OnBoardingBody>
  );
}
