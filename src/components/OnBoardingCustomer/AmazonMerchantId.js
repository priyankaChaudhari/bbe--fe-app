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
          <p className="account-steps m-0">Step 4 of 4</p>
          <h3 className="page-heading ">Your Amazon Merchant ID</h3>
          <p className="info-text-gray m-0 ">
            This information will be used by our data BOTS to access data we
            will use to best manage your account. For a quick tutorial on how to
            access this information, watch the video below.
            <br />
            <a className="video-link" href="*">
              Click here to watch the video.
            </a>
          </p>
          <CheckBox className="mt-3 mb-1">
            <label
              className="check-container customer-pannel "
              htmlFor="contract-copy-check">
              Ask someone else to complete this section
              <input type="checkbox" id="contract-copy-check" />
              <span className="checkmark" />
            </label>
          </CheckBox>
          <ContractFormField className="mt-4">
            <label>
              Merchant ID
              <input className="form-control" />
            </label>
          </ContractFormField>
          <Button className="btn-transparent w-100 mt-4">
            Log into your Amazon Account
          </Button>
          <Button className="btn-primary w-100 mt-3">Continue</Button>
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
