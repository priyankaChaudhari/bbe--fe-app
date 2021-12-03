import React, { useState } from 'react';

import Modal from 'react-modal';
import { bool, func, shape, string } from 'prop-types';

import InvoiceAdjustDetailsModal from './InvoiceAdjustDetailsModal';
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

const InvoiceAdjustPauseModal = ({
  id,
  isOpen,
  style,
  onModalClose,
  onApply,
}) => {
  const [showInvoiceDetailsModal, setShowInvoiceDetailsModal] = useState(false);
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
          onClick={onModalClose}
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body">
            <h4>Invoice Adjustment</h4>
            <div className="text-center mt-3">
              <Button
                onClick={() => {
                  onApply();
                  setShowInvoiceDetailsModal(true);
                }}
                type="button"
                className="btn-primary on-boarding   w-100">
                Continue
              </Button>
            </div>
          </div>
        </ModalBox>
      </Modal>

      <InvoiceAdjustDetailsModal
        id="BT-invoiceDetailsModal"
        isOpen={showInvoiceDetailsModal}
        onClick={() => {
          setShowInvoiceDetailsModal(false);
        }}
        onApply={() => {
          setShowInvoiceDetailsModal(false);
        }}
      />
    </>
  );
};

export default InvoiceAdjustPauseModal;

InvoiceAdjustPauseModal.defaultProps = {
  isOpen: false,
  id: '',
  style: {},
  onModalClose: () => {},
  onApply: () => {},
};

InvoiceAdjustPauseModal.propTypes = {
  isOpen: bool,
  id: string,
  style: shape({}),
  onModalClose: func,
  onApply: func,
};
