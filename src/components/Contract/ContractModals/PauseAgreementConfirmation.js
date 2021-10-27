import React from 'react';

import Modal from 'react-modal';
import { string, bool, func, shape } from 'prop-types';

import { PageLoader, Button, ModalBox } from '../../../common';

function PauseAgreementConfirmation({
  showPauseModal,
  onClickOfUpdatePauseContract,
  isLoading,
  setShowPauseModal,
}) {
  const customStylesForAlert = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '474px ',
      width: '100% ',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <Modal
      isOpen={showPauseModal.show}
      style={customStylesForAlert}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <ModalBox>
        <div className="modal-body">
          <div className="alert-msg ">
            <span>
              Agreement pause duration was {showPauseModal.data?.start_date} to{' '}
              {showPauseModal.data?.end_date}.
            </span>
            <p>Are you sure you want to pause this Agreement?</p>
          </div>
          <div className="text-center ">
            <Button
              onClick={() => {
                onClickOfUpdatePauseContract({ getPauseAgreement: false });
              }}
              type="button"
              className="btn-primary on-boarding  mr-2 pb-2 mb-1">
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                'Pause Agreement'
              )}
            </Button>
            <Button
              onClick={() => setShowPauseModal({ show: false, data: {} })}
              type="button"
              className=" btn-transparent w-50 on-boarding ">
              Cancel
            </Button>
          </div>
        </div>
      </ModalBox>
    </Modal>
  );
}

export default PauseAgreementConfirmation;

PauseAgreementConfirmation.defaultProps = {
  showPauseModal: {},
  onClickOfUpdatePauseContract: () => {},
  isLoading: {},
  setShowPauseModal: () => {},
};

PauseAgreementConfirmation.propTypes = {
  showPauseModal: shape({
    show: bool,
  }),
  onClickOfUpdatePauseContract: func,
  isLoading: shape({
    loader: bool,
    type: string,
  }),
  setShowPauseModal: func,
};
