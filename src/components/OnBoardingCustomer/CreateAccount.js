import React from 'react';
// import styled from 'styled-components';
// import Select from 'react-select';
// import Theme from '../../theme/Theme';
import UnauthorizedHeader from '../../common/UnauthorizedHeader';
import {
  //   LeftArrowIcon,
  LockFinish,
  OrangeCheckMark,
} from '../../theme/images/index';
import { Button, OnBoardingBody } from '../../common';

export default function CreateAccount() {
  return (
    <>
      <UnauthorizedHeader />
      {/* <BackToStep>
        {' '}
        <div role="presentation" className="back-link">
          <img
            src={LeftArrowIcon}
            alt="aarow-back"
            className="arrow-back-icon "
          />
          Back a step
        </div>
      </BackToStep> */}
      <OnBoardingBody>
        <div className="white-card-base">
          <img className="lock-finish" src={LockFinish} alt="lock" />
          <p className="account-steps m-0">Step 1 of 4</p>
          <h3 className="page-heading ">Create your account</h3>
          <p className="information-text m-0 ">
            <div className="hi-name"> Hi Newton,</div>
            We need some essential information in order to set up your account
            on Buy Box Experts NEXT. We hate paperwork so we ask for as little
            as necessary to get going.
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
          <Button className="btn-primary w-100 mb-3">
            Continue to account creation
          </Button>
          <Button className="btn-transparent w-100">
            Assign to someone else
          </Button>
        </div>

        {/* Re-assign account setup */}
        {/* <div className="white-card-base panel">
          <h3 className="page-heading ">Re-assign account setup</h3>
          <p className="information-text m-0 ">
            <div className="hi-name">
              {' '}
              If you’d like someone else to administrate the Buy Box Experts
              account then you can reassign the setup process to them.
            </div>

            <span className="note">
              Note: Only the nominated email address will be able to add and
              remove access for other members of your team.
            </span>
          </p>
          <ContractFormField className="">
            <label>
              Email Address
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label>
              Confiirm Email Address
              <input className="form-control" />
            </label>
          </ContractFormField>
          <Button className="btn-primary w-100 mt-4">Confirm</Button>
        </div> */}

        {/* Re-assign account setup */}
        {/* <div className="white-card-base">
          <h3 className="page-heading ">Account Setup Reassigned</h3>
          <p className="information-text m-0 ">
            You have successfully reassigned the account setup process to the
            following email address:
          </p>
          <div className="complete-steps mb-2">newton@ashersapparel.com</div>
          <p className="reach-out m-0 ">
            If you need any assistance please reach out to
            <br />
            <a className="reach-out-link" href="*">
              onboarding@buyboxexperts.com
            </a>
          </p>
        </div> */}

        {/* Please set your password to create your account. */}
        {/* <div className="white-card-base panel">
          <p className="account-steps m-0">Step 1 of 4</p>
          <h3 className="page-heading ">
            Please set your password to create your account.
          </h3>
          <p className="info-text-gray m-0 ">
            If you’d like someone else to administrate the Buy Box Experts
            account then you can reassign the setup process to them.
          </p>
          <ContractFormField className="mt-3">
            <label>
              Email Address
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label>
              Password
              <input className="form-control" />
            </label>
          </ContractFormField>
          <Button className="btn-primary w-100 mt-4">Continue</Button>
        </div> */}
      </OnBoardingBody>
    </>
  );
}

// const BackToStep = styled.div`
//   position: fixed;
//   background-color: ${Theme.white};
//   z-index: 2;
//   padding: 20px 0px 20px 25px;
//   width: 100%;
//   border-bottom: 1px solid ${Theme.gray5};
// `;
