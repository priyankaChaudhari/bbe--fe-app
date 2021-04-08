/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import styled from 'styled-components';
// import Select from 'react-select';
import { Collapse } from 'react-collapse';
import Theme from '../../theme/Theme';
import Header from '../../common/Header';
import {
  CheckBox,
  OnBoardingBody,
  ContractFormField,
  // FormField,
  Button,
} from '../../common';
import {
  SquareFbIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  LeftArrowIcon,
  EditOrangeIcon,
  CloseArrowIcons,
} from '../../theme/images';

export default function CompanyDigital() {
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
          <p className="account-steps m-0">Step 2 of 4</p>
          <h3 className="page-heading ">Your company’s digital presence</h3>
          <p className="info-text-gray m-0 ">
            Need help on why we need this information? <br />{' '}
            <a className="video-link" href="*">
              Click here to watch the video.
            </a>
          </p>
          <CheckBox className="mt-3">
            <label
              className="check-container customer-pannel "
              htmlFor="contract-copy-check">
              Ask someone else to complete this section
              <input type="checkbox" id="contract-copy-check" />
              <span className="checkmark" />
            </label>
          </CheckBox>
          {/* <ContractFormField className="mt-3">
            <label>
              Website
              <input className="form-control" />
            </label>
          </ContractFormField>
          <div className="label-title mb-1 mt-4">Social</div>
          <div className="row">
            <div className="col-4 mt-3 pr-0">
              <span>
                <img
                  src={SquareFbIcon}
                  alt="fb"
                  className="social-media face-book mr-1"
                />{' '}
                Facebook
              </span>
            </div>
            <div className="col-8 ">
              {' '}
              <ContractFormField>
                <input className="form-control" type="text" />
              </ContractFormField>
            </div>
            <div className="col-4 mt-3 pr-0">
              <span>
                <img
                  src={TwitterIcon}
                  alt="twitter"
                  className="social-media mr-1"
                />{' '}
                Twitter
              </span>
            </div>
            <div className="col-8 ">
              {' '}
              <ContractFormField>
                <input className="form-control" type="text" />
              </ContractFormField>
            </div>
            <div className="col-4 mt-3 pr-0">
              <span>
                <img
                  src={LinkedinIcon}
                  alt="fb"
                  className="social-media linedin mr-1"
                />{' '}
                Linkedin
              </span>
            </div>
            <div className="col-8">
              {' '}
              <ContractFormField>
                <input className="form-control" type="text" />
              </ContractFormField>
            </div>
            <div className="col-4 mt-3 pr-0">
              <span>
                <img
                  src={InstagramIcon}
                  alt="fb"
                  className="social-media  insta mr-1"
                />{' '}
                Instagram
              </span>
            </div>
            <div className="col-8 ">
              {' '}
              <ContractFormField>
                <input className="form-control" type="text" />
              </ContractFormField>
            </div>
          </div>
          <Button className="btn-primary w-100  mt-4">
            Continue to account creation
          </Button> */}
        </div>
        <fieldset className="shape-without-border w-430 mt-4">
          <ContractFormField>
            <label>
              Assign to (email)
              <input className="form-control" />
            </label>
            <span className="edit-field">
              <img className="edit-icon" src={EditOrangeIcon} alt="edit" /> Edit
              email address
            </span>
          </ContractFormField>
          <p className="info-text-gray m-0 pt-3 ">
            We’ll email them a link to submit the information in this section.
          </p>
          <Button className="btn-primary w-100  mt-3">Send Email</Button>
        </fieldset>
        <div className="white-card-base panel gap-none">
          <div
            className="label-title cursor mt-4"
            type="button"
            role="presentation"
            onClick={() => setOpenCollapse(!openCollapse)}>
            Expand questions
            <img className="arrow-up" src={CloseArrowIcons} alt="arrow" />
            <div className="clear-fix" />
          </div>
          <CollapseOpenContainer>
            <Collapse isOpened={openCollapse}>
              <ContractFormField className="mt-3">
                <label>
                  Website
                  <input className="form-control" />
                </label>
              </ContractFormField>
              <div className="label-title mb-1 mt-4">Social</div>
              <div className="row">
                <div className="col-4 mt-3 pr-0">
                  <span>
                    <img
                      src={SquareFbIcon}
                      alt="fb"
                      className="social-media face-book mr-1"
                    />{' '}
                    Facebook
                  </span>
                </div>
                <div className="col-8 ">
                  {' '}
                  <ContractFormField>
                    <input className="form-control" type="text" />
                  </ContractFormField>
                </div>
                <div className="col-4 mt-3 pr-0">
                  <span>
                    <img
                      src={TwitterIcon}
                      alt="twitter"
                      className="social-media mr-1"
                    />{' '}
                    Twitter
                  </span>
                </div>
                <div className="col-8 ">
                  {' '}
                  <ContractFormField>
                    <input className="form-control" type="text" />
                  </ContractFormField>
                </div>
                <div className="col-4 mt-3 pr-0">
                  <span>
                    <img
                      src={LinkedinIcon}
                      alt="fb"
                      className="social-media linedin mr-1"
                    />{' '}
                    Linkedin
                  </span>
                </div>
                <div className="col-8">
                  {' '}
                  <ContractFormField>
                    <input className="form-control" type="text" />
                  </ContractFormField>
                </div>
                <div className="col-4 mt-3 pr-0">
                  <span>
                    <img
                      src={InstagramIcon}
                      alt="fb"
                      className="social-media  insta mr-1"
                    />{' '}
                    Instagram
                  </span>
                </div>
                <div className="col-8 ">
                  {' '}
                  <ContractFormField>
                    <input className="form-control" type="text" />
                  </ContractFormField>
                </div>
              </div>
            </Collapse>
          </CollapseOpenContainer>
          <Button className="btn-primary w-100  mt-4">Continue</Button>
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
  opacity: 0.6;
`;
