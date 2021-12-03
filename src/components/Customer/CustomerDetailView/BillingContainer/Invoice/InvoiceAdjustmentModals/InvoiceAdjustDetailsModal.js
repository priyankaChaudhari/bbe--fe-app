import React, { useState } from 'react';

import Modal from 'react-modal';
import { bool, func, shape, string } from 'prop-types';

import InvoiceConfirmModal from './InvoiceConfirmModal';
import { CloseIcon } from '../../../../../../theme/images';
import { ModalBox, Button } from '../../../../../../common';

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

const InvoiceAdjustDetailsModal = ({ id, isOpen, style, onClick, onApply }) => {
  const [showInvoiceConfirmModal, setShowInvoiceConfirmModal] = useState(false);
  return (
    <>
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
            <h4>Invoice Adjustment</h4>
            <div className="text-center mt-3">
              <Button
                onClick={() => {
                  setShowInvoiceConfirmModal(true);
                  onApply();
                }}
                type="button"
                className="btn-primary on-boarding   w-100">
                Confirm and send for approval
              </Button>
            </div>
          </div>
        </ModalBox>
      </Modal>

      <InvoiceConfirmModal
        id="BT-invoiceConfirmModal"
        isOpen={showInvoiceConfirmModal}
        onClick={() => {
          setShowInvoiceConfirmModal(false);
        }}
        onApply={() => {
          setShowInvoiceConfirmModal(false);
        }}
      />
    </>
  );
};

export default InvoiceAdjustDetailsModal;

InvoiceAdjustDetailsModal.defaultProps = {
  isOpen: false,
  id: '',
  style: {},
  onClick: () => {},
  onApply: () => {},
};

InvoiceAdjustDetailsModal.propTypes = {
  isOpen: bool,
  id: string,
  style: shape({}),
  onClick: func,
  onApply: func,
};
