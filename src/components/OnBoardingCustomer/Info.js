/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import queryString from 'query-string';

import {
  Button,
  OnBoardingBody,
  PageLoader,
  UnauthorizedHeader,
} from '../../common';
import { PATH_CREATE_PASSWORD, PATH_LOGIN } from '../../constants';
import {
  AccountSetupIcon,
  LockFinish,
  OrangeCheckMark,
} from '../../theme/images';
import { verifyStepUser } from '../../api';

export default function Info() {
  const history = useHistory();
  const params = queryString.parse(history.location.search);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [alreadyUser, setAlreadyUser] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      'email',
      history.location.search.split('email=')[1].split('&')[0] ||
        (params && params.email),
    );
    verifyStepUser(localStorage.getItem('email'), params.id).then(
      (response) => {
        if (
          (response && response.status === 403) ||
          (response && response.status === 401)
        ) {
          setIsLoading({ loader: false, type: 'page' });
          setAlreadyUser(true);
        }
        if (response && response.status === 200) {
          setIsLoading({ loader: false, type: 'page' });
          setAlreadyUser(false);
        }
      },
    );
  }, [params.email, params.id]);

  const redirect = (type) => {
    if (
      localStorage.getItem('email') === null ||
      localStorage.getItem('email') === undefined
    ) {
      localStorage.setItem(
        'email',
        history.location.search.split('email=')[1].split('&')[0] ||
          (params && params.email),
      );
    }

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
    <>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <OnBoardingBody className="grey-bg">
          <UnauthorizedHeader />{' '}
          <div className="white-card-base ">
            {!alreadyUser ? (
              <>
                <img className="lock-finish" src={LockFinish} alt="lock" />
                <p className="account-steps m-0">Step 1 of 3</p>
                <h3 className="page-heading ">Create your account</h3>
                <p className="information-text m-0 ">
                  <div className="hi-name capitalize">
                    Hi {(params && params.name) || 'Customer'},
                  </div>
                  We need some essential information in order to set up your
                  account on Buy Box Experts NEXT. We hate paperwork so we ask
                  for as little as necessary to get going.
                </p>
                <div className="complete-steps mt-3">
                  You’ll need the following to complete your account setup:
                </div>
                <ul className="account-steps-check">
                  <li>
                    <img src={OrangeCheckMark} alt="check" />
                    Your company website url & social links
                  </li>
                  {/* <li>
            <img src={OrangeCheckMark} alt="check" />
            Billing and payment details and MWS token
          </li> */}
                  <li>
                    <img src={OrangeCheckMark} alt="check" />
                    Your Amazon merchant ID
                  </li>
                </ul>

                <Button
                  className="btn-primary w-100 mb-3"
                  onClick={() => redirect('continue')}>
                  Continue to account creation
                </Button>

                {params && params.re_assigned === 'None' ? (
                  <Button
                    className="btn-transparent w-100"
                    onClick={() => redirect('assign')}>
                    Assign to someone else
                  </Button>
                ) : (
                  ''
                )}
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center' }}>
                  <img className="mb-3" src={AccountSetupIcon} alt="check" />
                </div>
                <>
                  <h5>You are already registered</h5>
                  <p className="info">
                    This invitation link has expired because your account has
                    already been created. Click on one of the below options to
                    proceed.
                    <br />
                  </p>
                  <p className="reach-out  mt-2">
                    If you have any questions in the meantime please reach out
                    to{' '}
                    <a
                      className="reach-out-link"
                      target="_BLANK"
                      rel="noopener noreferrer"
                      href="https://www.buyboxexperts.com/">
                      onboarding@buyboxexperts.com.
                    </a>
                  </p>
                  <Button
                    className="btn-primary w-100 on-boarding mt-3"
                    onClick={() => history.push(PATH_LOGIN)}>
                    Sign In
                  </Button>
                </>
              </>
            )}
          </div>
        </OnBoardingBody>
      )}
    </>
  );
}
