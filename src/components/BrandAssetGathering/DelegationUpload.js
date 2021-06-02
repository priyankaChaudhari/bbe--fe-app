import React, { useState } from 'react';

import {
  Button,
  OnBoardingBody,
  UnauthorizedHeader,
  CheckBox,
  ContractFormField,
  PageLoader,
} from '../../common';
import {
  OrangeCheckMark,
  EditOrangeIcon,
  SecurityLock,
} from '../../theme/images';

export default function UploadDelegation() {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'email' });
  const [formData, setFormData] = useState({ email: '' });

  const sendEmail = () => {
    setIsLoading({ loader: true, type: 'email' });
    setIsLoading({ loader: false, type: 'email' });
  };

  return (
    <div>
      <OnBoardingBody className="body-white">
        <div className="white-card-base panel pb-4">
          <UnauthorizedHeader />{' '}
          <h3 className="page-heading ">Upload Your Brand Assets</h3>
          <CheckBox className="mt-1 mb-4">
            <label className="check-container customer-pannel " htmlFor="step">
              Ask someone else to complete this section
              <input
                type="checkbox"
                id="step"
                readOnly
                onChange={(event) =>
                  event.target.checked
                    ? setIsChecked(true)
                    : setIsChecked(false)
                }
              />
              <span className="checkmark" />
            </label>
          </CheckBox>
          {isChecked ? (
            <fieldset className="shape-without-border w-430 mt-2">
              <ContractFormField>
                <label htmlFor="email">
                  Assign to (email)
                  <input
                    className="form-control"
                    onChange={(event) =>
                      setFormData({ email: event.target.value })
                    }
                  />
                </label>
                <span className="edit-field cursor" role="presentation">
                  <img className="edit-icon" src={EditOrangeIcon} alt="edit" />{' '}
                  Edit email address
                </span>
                {/* <p className="info-text-gray m-0 pt-2 ">
                  We’ve emailed them a link to submit the information in this
                  section.
                </p> */}
                <>
                  <p className="info-text-gray m-0 pt-3 ">
                    We’ll email them a link to submit the information in this
                    section.
                  </p>
                  <Button
                    className="btn-primary w-100  mt-3"
                    onClick={() => sendEmail()}
                    disabled={formData.email === ''}>
                    {isLoading.loader && isLoading.type === 'email' ? (
                      <PageLoader color="#fff" type="button" />
                    ) : (
                      'Send Email'
                    )}
                  </Button>
                </>
              </ContractFormField>
            </fieldset>
          ) : (
            ''
          )}
          <div className="complete-steps mt-3">
            You’ll need the following to complete this step:
          </div>
          <ul className="account-steps-check">
            <li>
              <img src={OrangeCheckMark} alt="check" />
              Your brand logo in vector format (e.g. AI or EPS)
            </li>
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
          {!isChecked ? (
            <Button className="btn-primary w-100 mb-2">Continue</Button>
          ) : (
            ''
          )}
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
