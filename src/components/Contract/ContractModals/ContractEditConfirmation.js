import React from 'react';

import Modal from 'react-modal';
import { bool, func } from 'prop-types';

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

function ContractEditConfirmation({
  showEditContractConfirmationModal,
  editAgreementChanges,
}) {
  return (
    <Modal
      isOpen={showEditContractConfirmationModal}
      style={customStylesForAlert}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <ModalBox>
        <div className="modal-body">
          <div className="alert-msg  ">
            Making any edits to this contract will void the version of the
            contract that&apos;s out for signature.
            <div className="sure-to-proceed">
              Are you sure you want to proceed?
            </div>
          </div>
          <div className="text-center ">
            <Button
              onClick={() => editAgreementChanges('Yes')}
              type="button"
              className="btn-primary on-boarding  mr-2 pb-2 mb-1">
              Yes, Make Edits
            </Button>
            <Button
              onClick={() => editAgreementChanges('No')}
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

export default ContractEditConfirmation;

ContractEditConfirmation.defaultProps = {
  showEditContractConfirmationModal: false,
  editAgreementChanges: () => {},
};

ContractEditConfirmation.propTypes = {
  showEditContractConfirmationModal: bool,
  editAgreementChanges: func,
};
