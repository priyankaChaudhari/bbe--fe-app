import React from 'react';
import UnauthorizedHeader from '../../common/UnauthorizedHeader';
import { OnBoardingBody } from '../../common';

export default function CompanyDigital() {
  return (
    <>
      <UnauthorizedHeader />
      <OnBoardingBody className="body-white">
        <div className="white-card-base panel">
          <p className="account-steps m-0">Step 1 of 4</p>
          <h3 className="page-heading ">Create your account</h3>
        </div>
      </OnBoardingBody>
    </>
  );
}
