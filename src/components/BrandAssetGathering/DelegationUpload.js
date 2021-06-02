import React from 'react';
import {
  Button,
  OnBoardingBody,
  UnauthorizedHeader,
  CheckBox,
  ContractFormField,
} from '../../common';
import {
  OrangeCheckMark,
  EditOrangeIcon,
  SecurityLock,
} from '../../theme/images';

export default function UploadDelegation() {
  return (
    <div>
      <OnBoardingBody className="body-white">
        <div className="white-card-base panel pb-4">
          <UnauthorizedHeader />{' '}
          <h3 className="page-heading ">Upload Your Brand Assets</h3>
          <CheckBox className="mt-1 mb-4">
            <label className="check-container customer-pannel " htmlFor="step">
              Ask someone else to complete this section
              <input type="checkbox" id="step" readOnly />
              <span className="checkmark" />
            </label>
          </CheckBox>
          <fieldset className="shape-without-border w-430 mt-2">
            <ContractFormField>
              <label htmlFor="email">
                Assign to (email)
                <input className="form-control" />
              </label>
              <span className="edit-field cursor" role="presentation">
                <img className="edit-icon" src={EditOrangeIcon} alt="edit" />{' '}
                Edit email address
              </span>
              <p className="info-text-gray m-0 pt-2 ">
                We’ve emailed them a link to submit the information in this
                section.
              </p>
            </ContractFormField>
          </fieldset>
          <div className="complete-steps mt-3">
            You’ll need the following to complete this step:
          </div>
          <ul className="account-steps-check">
            <li>
              <img src={OrangeCheckMark} alt="check" />
              Your brand logo in vector format (e.g. AI or EPS)
            </li>
            {/* and MWS token */}
            <li>
              <img src={OrangeCheckMark} alt="check" />A brand guidelines or
              style guide document
            </li>
            <li>
              <img src={OrangeCheckMark} alt="check" />
              Brand font files
            </li>
            <li>
              <img src={OrangeCheckMark} alt="check" />
              Iconography
            </li>
            <li>
              <img src={OrangeCheckMark} alt="check" />
              Any other brand material
            </li>
          </ul>
          <Button className="btn-primary w-100 mb-2">Continue</Button>
          <p className="info-text-gray security-lock text-center  mb-0">
            <img width="16px" src={SecurityLock} alt="lock" />
            <span>
              {' '}
              All files will be stored securely and never shared with a 3rd
              party.
            </span>
          </p>
        </div>
      </OnBoardingBody>
    </div>
  );
}
