import React from 'react';

import Modal from 'react-modal';
import { bool, func, shape } from 'prop-types';

import { ModalBox, Button } from '../../../common';

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

function DiscardChangesConfirmation({
  showDiscardModal,
  discardAgreementChanges,
}) {
  return (
    <Modal
      isOpen={showDiscardModal.show}
      style={customStylesForAlert}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <ModalBox>
        <div className="modal-body">
          <div className="alert-msg ">
            <span>Are you sure you want to discard all the changes?</span>
          </div>
          <div className="text-center ">
            <Button
              onClick={() => discardAgreementChanges('No')}
              type="button"
              className="btn-primary on-boarding  mr-2 pb-2 mb-1">
              Keep Editing
            </Button>
            <Button
              onClick={() => discardAgreementChanges('Yes')}
              type="button"
              className=" btn-transparent w-50 on-boarding ">
              Discard Changes
            </Button>
          </div>
        </div>
      </ModalBox>
    </Modal>
  );
}

export default DiscardChangesConfirmation;

DiscardChangesConfirmation.defaultProps = {
  showDiscardModal: {},
  discardAgreementChanges: () => {},
};

DiscardChangesConfirmation.propTypes = {
  showDiscardModal: shape({
    show: bool,
  }),
  discardAgreementChanges: func,
};
