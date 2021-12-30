import React from 'react';

import queryString from 'query-string';
import { useHistory } from 'react-router-dom';

import UnauthorizedHeader from '../../common/UnauthorizedHeader';
import { ThanksPage } from './DSPBudgetApprovalStyles';
import { AccountSetupIcon } from '../../theme/images';

export default function DSPBudgetApprovalThanks() {
  const history = useHistory();
  const params = queryString.parse(history.location.search);

  return (
    <>
      <UnauthorizedHeader />
      <ThanksPage>
        <img className="mb-3" src={AccountSetupIcon} alt="check" />
        {params && params.step === 'completed' ? (
          <>
            {' '}
            <h5>Thanks!</h5>
            <p className="info">
              We’ve let Jacob know that you’ve provided the information we
              needed. They will get in touch with you if necessary.
            </p>
            <br />
            <p className="info">You can close this tab when you’re ready.</p>
          </>
        ) : (
          <>
            <h5>Thanks!</h5>
            <p className="info">
              We’ve let {params && params.name} know that you’ve provided the
              information we needed.
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
