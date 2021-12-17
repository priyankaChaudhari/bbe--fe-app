import React from 'react';

import queryString from 'query-string';
import { useHistory } from 'react-router-dom';

import UnauthorizedHeader from '../../common/UnauthorizedHeader';
import { ThanksPage } from './OnBoardingStyles';
import { AccountSetupIcon } from '../../theme/images';

export default function Thanks() {
  const history = useHistory();
  const params = queryString.parse(history.location.search);
  const type = history.location?.type;
  return (
    <>
      <UnauthorizedHeader />
      <ThanksPage>
        <img className="mb-3" src={AccountSetupIcon} alt="check" />
        {params && params.step === 'completed' ? (
          <>
            {' '}
            <h5>Information already provided</h5>
            <p className="info">
              Looks like someone has provided the requested information already.
              <br />
              <br /> You can close this tab when you’re ready.
            </p>
          </>
        ) : (
          <>
            <h5>Thanks!</h5>
            <p className="info">
              We’ve let {params && params.name} know that you’ve provided the
              information we needed.{' '}
              {type === 'dspSignOff'
                ? 'They will get in touch with you if necessary.'
                : null}
              <br />
              <br />
              You can close this tab when you’re ready.
            </p>
          </>
        )}
      </ThanksPage>
    </>
  );
}
