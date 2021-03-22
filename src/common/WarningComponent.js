import React from 'react';
import { useLocation } from 'react-router-dom';

import styled from 'styled-components';
import Theme from '../theme/Theme';
import ErrorMsg from './ErrorMsg';
import ContractVoided from '../theme/images/contract-voided.svg';
// import PageNotFoundImg from '../theme/images/page-not-found.svg';

export default function WarningComponent() {
  const location = useLocation();

  return (
    <PageNotFounds>
      <ErrorMsg className="  contract-cancel">
        <img className="contract-cancel-img" src={ContractVoided} alt="" />
        <br />
        {location && location.state && location.state.error
          ? location && location.state && location.state.error
          : ''}

        <h5 className="mt-3">Contract voided</h5>
        <p className="not-found">
          The contract signature package you&apos;re trying to access has been
          voided. Please
          <br /> check your email for a new version or contact your Buy Box
          Experts sales agent.
        </p>
      </ErrorMsg>
    </PageNotFounds>
  );
}
const PageNotFounds = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .not-found {
    color: ${Theme.gray90};
    font-size: 16px;
    text-align: center;
    font-weight: 600;
    font-family: ${Theme.baseFontFamily};
  }

  .contract-cancel {
    text-transform: capitalize;
    color: ${Theme.red};
    font-size: 18px;
    text-align: center;
  }

  .contract-cancel-img {
    // vertical-align: middle;
    // margin-right: 15px;
    margin-bottom: 15px;
  }
`;
