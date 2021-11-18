import React from 'react';

import Modal from 'react-modal';
import { bool, func, string } from 'prop-types';

import { ModalBox, Button } from '../../../../common';
import { CloseIcon } from '../../../../theme/images';

const todaysDate = new Date();
todaysDate.setDate(todaysDate.getDate() - 2);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '420px ',
    width: '100% ',
    minHeight: '390px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const EscrowBudgetAllocationModal = ({ id, isOpen, onClick, onApply }) => {
  return (
    <Modal
      id={id}
      isOpen={isOpen}
      style={{ ...customStyles }}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={onClick}
        role="presentation"
      />
      <ModalBox>
        <div className="modal-body">
          <h4>Allocation Balance</h4>

          <div className="text-center mt-3">
            <Button
              onClick={onApply}
              type="button"
              className="btn-primary on-boarding   w-100">
              Apply
            </Button>
          </div>
        </div>
      </ModalBox>
    </Modal>
  );
};

export default EscrowBudgetAllocationModal;

EscrowBudgetAllocationModal.defaultProps = {
  id: '',
  isOpen: false,
  onClick: () => {},
  onApply: () => {},
};

EscrowBudgetAllocationModal.propTypes = {
  id: string,
  onClick: func,
  onApply: func,
  isOpen: bool,
};
