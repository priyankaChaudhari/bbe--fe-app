import React from 'react';
import styled from 'styled-components';
import UnauthorizedHeader from './UnauthorizedHeader';
import Theme from '../theme/Theme';
import ErrorMsg from './ErrorMsg';
import ContractVoided from '../theme/images/contract-voided.svg';
// import PageNotFoundImg from '../theme/images/page-not-found.svg';

export default function WarningComponent() {
  return (
    <>
      <UnauthorizedHeader />

      <PageNotFounds>
        <div className="page-container">
          <ErrorMsg className="  contract-cancel">
            <img className="contract-cancel-img" src={ContractVoided} alt="" />
            <br />
            {/* {location && location.state && location.state.error
              ? location && location.state && location.state.error
              : ''} */}

            {/* <h5 className="mt-3">Contract voided</h5>
            <p className="not-found">
              The contract signature package you&apos;re trying to access has
              been voided. Please
              <br /> check your email for a new version or contact your Buy Box
              Experts sales agent.
            </p> */}
            <h5 className="mt-3">Document Unavailable</h5>
            <p className="not-found">
              The document you&apos;re trying to access is no longer available.
              This is due to one of two reasons: <br />
              (1) You already signed the document, or <br />
              (2) A change has been made to document that was originally sent to
              you for signature.
              <br /> <br />
              Please check your email for a new version of the document, or
              contact your Buy Box Experts sales agent for help.
            </p>
          </ErrorMsg>
        </div>
      </PageNotFounds>
    </>
  );
}
const PageNotFounds = styled.div`
  background: ${Theme.gray8};
  height: 100%;
  .page-container {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .not-found {
    color: ${Theme.gray90};
    font-size: 16px;
    text-align: center;
    font-weight: 600;
    font-family: ${Theme.baseFontFamily};
  }

  // .contract-cancel {
  //   text-transform: capitalize;
  //   color: ${Theme.red};
  //   font-size: 18px;
  //   text-align: center;
  // }

  .contract-cancel-img {
    // vertical-align: middle;
    // margin-right: 15px;
    margin-bottom: 15px;
  }
`;
