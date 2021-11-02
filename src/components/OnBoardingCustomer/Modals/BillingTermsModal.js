import React from 'react';

import Modal from 'react-modal';
import { string, func } from 'prop-types';

import { ModalBox } from '../../../common';
import { CloseIcon } from '../../../theme/images';

export default function BillingTermsModal({ showModal, setShowModal }) {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      minHeight: '200px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <Modal
      isOpen={showModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={() => setShowModal(false)}
        role="presentation"
      />
      <ModalBox>
        <div className="modal-body" style={{ color: '#2E384D' }}>
          By accepting the terms on the Payment Information page, I acknowledge
          that I am an authorized signer, user or representative of the account
          provided and have the authority to set up payments against that
          account on a recurring basis moving forward. <br />
          <br /> I understand that this authorization will remain in effect
          until I cancel it in writing, and I agree to notify the merchant in
          writing of any changes in my account information or termination of
          this authorization at least 15 days prior to the next billing date. If
          the monthly billing date falls on a weekend or holiday, I understand
          that the payments may be executed automatically over those days or may
          be processed on the next business day. <br />
          <br /> A prorated initial billing may be charged to cover the dates
          between the signature date and the selected monthly billing date, if
          different. <br />
          <br /> For ACH debits to my checking/savings account, I understand
          that because these are electronic transactions, the funds may be
          withdrawn from my account as soon as electronic payment is processed.
          In the case of an ACH Transaction or Credit Card transactions being
          rejected for Non-Sufficient Funds (NSF), I understand that Buy Box
          Experts (“BBE”) may, at its discretion attempt to process the charge
          again within 30 days, and agree to an additional $25 charge for each
          attempt returned NSF which will be initiated as a separate transaction
          from the authorized recurring payment method. <br />
          <br /> I acknowledge that the origination of ACH transactions to my
          account must comply with the provisions of U.S. law. I certify that I
          am an authorized user/signer of this credit card/bank account and will
          not dispute these scheduled transactions with my bank or credit card
          company; so long as the transactions correspond to the terms indicated
          in this authorization form, our service agreement with BBE, and any
          invoice provided by BBE to me in conjunction with the payment.
        </div>
      </ModalBox>
    </Modal>
  );
}

BillingTermsModal.propTypes = {
  showModal: string.isRequired,
  setShowModal: func.isRequired,
};
