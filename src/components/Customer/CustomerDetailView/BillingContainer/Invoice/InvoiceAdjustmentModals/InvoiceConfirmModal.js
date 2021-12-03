import React from 'react';

import Modal from 'react-modal';
import { bool, func, shape, string } from 'prop-types';

import { CloseIcon } from '../../../../../../theme/images';
import { ModalBox, Button } from '../../../../../../common';

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

const InvoiceConfirmModal = ({ id, isOpen, style, onClick, onApply }) => {
  return (
    <Modal
      id={id}
      isOpen={isOpen}
      style={{ ...customStyles, ...style }}
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
          <h4>Confirm Adjustment</h4>
          <div className="text-center mt-3">
            <Button
              onClick={onApply}
              type="button"
              className="btn-primary on-boarding   w-100">
              Confirm and send for approval
            </Button>
          </div>
        </div>
      </ModalBox>
    </Modal>
  );
};

export default InvoiceConfirmModal;

InvoiceConfirmModal.defaultProps = {
  isOpen: false,
  id: '',
  style: {},
  onClick: () => {},
  onApply: () => {},
};

InvoiceConfirmModal.propTypes = {
  isOpen: bool,
  id: string,
  style: shape({}),
  onClick: func,
  onApply: func,
};
