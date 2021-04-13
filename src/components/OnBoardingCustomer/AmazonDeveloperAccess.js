/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styled from 'styled-components';
import Theme from '../../theme/Theme';
import Header from '../../common/Header';
import {
  CheckBox,
  OnBoardingBody,
  ContractFormField,
  Button,
} from '../../common';
import { LeftArrowIcon } from '../../theme/images';

export default function AmazonMerchantId() {
  return (
    <>
      <Header />
      <BackToStep>
        <div className="container-fluid">
          {' '}
          <div className="row">
            <div className="col-6">
              {' '}
              <div role="presentation" className="back-link">
                <img
                  src={LeftArrowIcon}
                  alt="aarow-back"
                  className="arrow-back-icon "
                />
                Back a step
              </div>
            </div>
            <div className="col-6 text-right ">
              <div className="skip-steps pr-2">Skip this step</div>
            </div>
          </div>
        </div>
      </BackToStep>
      <OnBoardingBody className="body-white">
        <div className="white-card-base panel">
          <p className="account-steps m-0">Step 5 of 5</p>
          <h3 className="page-heading ">Amazon Developer Access</h3>
          <p className="info-text-gray m-0 ">
            Finally, we need you to grant us developer access to your Amazon
            Seller account.
          </p>
          <p className="information-text mt-2 mb-0">
            If you don’t have access to your Amazon Seller Central admin account
            then you can use the checkbox below to assign this step to someone
            that does.
          </p>
          <CheckBox>
            <label
              className="check-container customer-pannel "
              htmlFor="contract-copy-check">
              Ask someone else to complete this section
              <input type="checkbox" id="contract-copy-check" />
              <span className="checkmark" />
            </label>
          </CheckBox>
          <div className=" straight-line  horizontal-line mb-4 mt-4" />
          <p className="account-steps m-0">Part 1</p>
          <p className="information-text mt-0 mb-0">
            Log into your Amazon Seller Central admin account below. You should
            see pre-filled information detailing our Developer Name and ID. If
            so, just click ‘Next’.{' '}
            <a className="video-link" href="*">
              {' '}
              Developer fields not pre-filled?
            </a>
          </p>
          <Button className="btn-transparent w-100 mt-2">
            Log into your Amazon Account
          </Button>
          <div className=" straight-line  horizontal-line mb-4 mt-4" />
          <p className="account-steps m-0">Part 2</p>
          <p className="information-text mt-0 mb-0">
            Copy the ‘Seller ID’ and ‘MWS Auth Token’ values shown on the
            resultant screen and paste into the field below.
          </p>
          <ContractFormField>
            <label>
              Seller ID
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label>
              MWS Auth Token
              <input className="form-control" />
            </label>
          </ContractFormField>
          <Button className="btn-primary w-100 mt-4">Continue</Button>
        </div>
      </OnBoardingBody>
    </>
  );
}
const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 2;
  padding: 20px 0px 20px 0px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};

  .skip-steps {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    cursor: pointer;
  }
`;
