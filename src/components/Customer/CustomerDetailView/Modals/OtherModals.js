import React from 'react';

import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';

import { showOnboardingMsg } from '../../../../store/actions/userState';
import { showBrandAsset } from '../../../../store/actions/customerState';
import { AccountSetupIcon } from '../../../../theme/images';
import { ModalBox, Button } from '../../../../common';

export default function OtherModals() {
  const dispatch = useDispatch();
  const AccountSetupcustomStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '480px ',
      width: '100% ',
      minHeight: '200px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const showOnBoardingSuccessMsg = useSelector(
    (state) => state.userState.showForgotMsg,
  );
  const showBrandAssetSuccessMsg = useSelector(
    (state) => state.customerState.showBrandAssetMsg,
  );
  return (
    <>
      <Modal
        isOpen={showOnBoardingSuccessMsg}
        style={AccountSetupcustomStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <ModalBox>
          <div className="modal-body account-setup-complete">
            <img className="mt-2" src={AccountSetupIcon} alt="company-icon" />

            <h3 className="page-heading mb-3 mt-3 ">Account Set Up Complete</h3>
            <p className="extra-bold ">
              {' '}
              Congratulations on completing your account setup with Buy Box
              Experts! Expect to hear from your On-boarding Specialist in the
              next 24 hours to walk through final set up items and get you in
              contact with your Brand Growth Strategist.
            </p>

            <p className="extra-bold mt-2">
              If you have any questions in the meantime please reach out to{' '}
              <a
                className="link-url"
                target="_BLANK"
                rel="noopener noreferrer"
                href="https://www.buyboxexperts.com/">
                onboarding@buyboxexperts.com.
              </a>
            </p>
            <Button
              className="btn-primary w-100 on-boarding mt-3"
              onClick={() => dispatch(showOnboardingMsg(false))}>
              Ok. Got it!
            </Button>
          </div>
        </ModalBox>
      </Modal>

      <Modal
        isOpen={showBrandAssetSuccessMsg}
        style={AccountSetupcustomStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <ModalBox>
          <div className="modal-body account-setup-complete">
            <img className="mt-2" src={AccountSetupIcon} alt="company-icon" />

            <h3 className="page-heading mb-3 mt-3 ">Brand Assets Received</h3>
            <p className="extra-bold ">
              {' '}
              Thank you for uploading your brand assets. Once you’ve spoken with
              our Brand Growth Strategist and Creative Strategist, they will
              review your products and request assets for the products we will
              use in our brand sample, which will act as a guide for future
              optimization work. You will receive an email as well as a
              notification in NEXT that will take you to where you can upload
              the requested product assets.
            </p>

            <Button
              className="btn-primary w-100 on-boarding mt-3"
              onClick={() => dispatch(showBrandAsset(false))}>
              Ok. Got it!
            </Button>
          </div>
        </ModalBox>
      </Modal>
    </>
  );
}
