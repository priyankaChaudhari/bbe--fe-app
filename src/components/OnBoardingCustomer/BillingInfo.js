/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import Theme from '../../theme/Theme';
import Header from '../../common/Header';
import {
  CheckBox,
  OnBoardingBody,
  ContractFormField,
  Button,
  ModalRadioCheck,
  GreyCard,
} from '../../common';
import {
  VisaCardIcons,
  MasterCardIcons,
  DiscoverCardIcons,
  AmercianExpressCardIcons,
  LeftArrowIcon,
  CaretUp,
} from '../../theme/images';

export default function BillingInfo() {
  const [openCollapse, setOpenCollapse] = useState(false);
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
          <GreyCard className="yellow-card mt-2 mb-4">
            <div className="hi-name mb-2">
              {' '}
              <a href="*" className="video-link ">
                {' '}
                newton@ashersapparel.com{' '}
              </a>
              has asked that you provide the billing information that will be
              used for your Buy Box Experts agreement.
            </div>
            If you’re unable to provide this information or you think this was
            sent to you unintentionally please let them know via the email
            address highlighted above.
          </GreyCard>
          <p className="account-steps m-0">Step 3 of 4</p>
          <h3 className="page-heading ">Billing Information</h3>
          <CheckBox className="mt-2 mb-3">
            <label
              className="check-container customer-pannel "
              htmlFor="contract-copy-check">
              Ask someone else to complete this section
              <input type="checkbox" id="contract-copy-check" />
              <span className="checkmark" />
            </label>
          </CheckBox>
          <ContractFormField className="mt-3">
            <label>
              Name on Account
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label>
              Bank Name
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label>
              Routing Number
              <input className="form-control" />
            </label>
          </ContractFormField>
          <ContractFormField className="mt-3">
            <label>
              Account Number
              <input className="form-control" />
            </label>
          </ContractFormField>
          <div className="label-title mt-4"> Payment Type</div>
          <ModalRadioCheck className="mt-3 ">
            <label className="radio-container contact-billing">
              ACH
              <br />
              <input type="radio" checked="checked" name="radio" />
              <span className="checkmark checkmark-top" />
            </label>
          </ModalRadioCheck>
          <div
            className="label-title cursor mt-4"
            type="button"
            role="presentation"
            onClick={() => setOpenCollapse(!openCollapse)}>
            Explore other payment options{' '}
            <img className="arrow-up" src={CaretUp} alt="arrow" />
            <div className="clear-fix" />
          </div>
        </div>
        <CollapseOpenContainer>
          <Collapse isOpened={openCollapse}>
            <fieldset className="shape-without-border  w-430 mt-2 mb-4">
              <div className="inner-content">
                <p className="pay-card mt-0 mb-4">Pay By Credit Card</p>
                <div className="label-title mb-2">Credit Card Type</div>
                <ul className="payment-option">
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label className="radio-container contact-billing">
                        <img className="card" src={VisaCardIcons} alt="card" />{' '}
                        Visa
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label className="radio-container contact-billing">
                        <img
                          className="card"
                          src={MasterCardIcons}
                          alt="card"
                        />{' '}
                        Mastercard
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label className="radio-container contact-billing">
                        <img
                          className="card"
                          src={DiscoverCardIcons}
                          alt="card"
                        />{' '}
                        Discover
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                  <li>
                    <ModalRadioCheck className="mt-2">
                      <label className="radio-container contact-billing">
                        <img
                          className="card"
                          src={AmercianExpressCardIcons}
                          alt="card"
                        />{' '}
                        American Express
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                </ul>
                <ContractFormField className="mt-3">
                  <label>
                    Cardholder name
                    <input className="form-control" />
                  </label>
                </ContractFormField>
                <ContractFormField className="mt-3">
                  <label>
                    Credit card number
                    <input className="form-control" />
                  </label>
                </ContractFormField>
                <div className="row">
                  <div className="col-8 pr-0">
                    {' '}
                    <ContractFormField className="mt-3">
                      <label>
                        Exp. Date
                        <input className="form-control" />
                      </label>
                    </ContractFormField>
                  </div>
                  <div className="col-4 ">
                    <ContractFormField className="mt-3">
                      <label>
                        CVV
                        <input className="form-control" />
                      </label>
                    </ContractFormField>
                  </div>
                </div>
              </div>
            </fieldset>
          </Collapse>
        </CollapseOpenContainer>
        <div className="white-card-base panel gap-none">
          <CheckBox className="mt-2 ">
            <label
              className="check-container customer-pannel hereby-acknowledge"
              htmlFor="contract-copy-check">
              I hereby acknowledge that I am an authorized signer on the account
              listed above and hereby authorize payments to be made to BBE using
              this payment method to satisfy any and all invoices or bills on
              our account with BBE moving forward until or unless further notice
              is provided in writing. I further agree to the additional Terms &
              Conditions for these payment and agree to the terms and conditions
              found{' '}
              <a className="link-url" href="*">
                here.
              </a>
              <input type="checkbox" id="contract-copy-check" />
              <span className="checkmark" />
            </label>
          </CheckBox>
          <Button className="btn-primary w-100  mt-3">Continue</Button>
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

const CollapseOpenContainer = styled.div`
  .ReactCollapse--collapse {
    max-width: 430px !important;
    margin: 0 auto;

    .inner-content {
      background-color: ${Theme.white};
      padding: 12px 0px 4px 0px;

      .pay-card {
        font-size: ${Theme.extraNormal};
        color: ${Theme.black};
        font-weight: 600;
      }
      .label-title {
        color: ${Theme.gray40};
        font-size: ${Theme.verySmall};
        text-transform: uppercase;
        font-weight: bold;
        font-family: ${Theme.titleFontFamily};
      }
      .payment-option {
        list-style-type: none;
        margin: 0;
        padding: 0;
        li {
          display: inline-block;
          margin-right: 23px;

          &:last-child {
            margin-right: 0px;
          }

          .card {
            width: 20px;
            margin-right: 2px;
            vertical-align: top;
          }
        }
      }
    }
  }
`;
