import React from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import queryString from 'query-string';

import Theme from '../../theme/Theme';
import UnauthorizedHeader from '../../common/UnauthorizedHeader';
import { AccountSetupIcon } from '../../theme/images';

export default function Thanks() {
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
    font-family: ${Theme.baseFontFamily};
  }
`;
