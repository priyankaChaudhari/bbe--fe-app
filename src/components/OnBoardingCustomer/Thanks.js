import React from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import queryString from 'query-string';

import Theme from '../../theme/Theme';
import UnauthorizedHeader from '../../common/UnauthorizedHeader';
import { AccountSetupIcon } from '../../theme/images';
// import { OnBoardingBody, Button } from '../../common';

export default function Thanks() {
  const history = useHistory();
  const params = queryString.parse(history.location.search);

  return (
    <>
      <UnauthorizedHeader />
      <ThanksPage>
        <img className="mb-3" src={AccountSetupIcon} alt="check" />
        <h5>Thanks!</h5>
        <p className="info">
          We’ve let {params && params.name} know that you’ve provided the
          information we needed.
          <br />
          <br />
          You can close this tab when you’re ready.
        </p>

        <h5>Information already provided</h5>
        <p className="info">
          Looks like someone has provided the requested information already.
          <br />
          <br /> You can close this tab when you’re ready.
        </p>
      </ThanksPage>

      {/* <OnBoardingBody>
        <div className="white-card-base">
          <img className="mb-3" src={AccountSetupIcon} alt="company-icon" />

          <h3 className="page-heading">Account Set Up Complete</h3>
          <p className="information-text m-0 ">
            {' '}
            Congratulations on completing your account setup with Buy Box
            Experts! If you haven’t already, expect to hear from your
            On-boarding Specialist in the next 24 hours to walk through final
            setup items and get you in contact with your Brand Growth
            Strategist.
          </p>

          <p className="reach-out m-0">
            If you have any questions in the meantime please reach out to{' '}
            <a className="reach-out-link" href="*">
              onboarding@buyboxexperts.com.
            </a>
          </p>
          <Button className="btn-primary w-100 mt-4">Ok. Got it!</Button>
        </div>
      </OnBoardingBody> */}
    </>
  );
}

const ThanksPage = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;

  .info {
    color: ${Theme.gray90};
    font-size: ${Theme.title};
  }
`;
