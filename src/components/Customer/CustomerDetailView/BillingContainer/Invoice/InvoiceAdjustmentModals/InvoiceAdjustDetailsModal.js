import React, { useState } from 'react';

import Modal from 'react-modal';
import { bool, func, shape, string } from 'prop-types';

import InvoiceConfirmModal from './InvoiceConfirmModal';
import { CloseIcon, LeftArrowIcon } from '../../../../../../theme/images';
import { ModalBox, Button } from '../../../../../../common';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
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
          <div className="modal-body pb-0">
            <h4>
              {' '}
              <img className="modal-back-arrow" src={LeftArrowIcon} alt="" />
              Confirm Adjustment
            </h4>
            <p className="normal-text">
              The following proposal will be send to &#60;brand partner&#62; for
              approval:
            </p>
            <p className="normal-text text-bold mb-0">
              Additional DSP invoice for December 2021 only
            </p>
            <p className="normal-text text-medium mt-0">$5,000</p>
            <p className="gray-normal-text">Markeplaces to be used in: US</p>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
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
