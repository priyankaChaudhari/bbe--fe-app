import React from 'react';

import Modal from 'react-modal';
import { func, shape, bool, string } from 'prop-types';

import CustomerStatus from '../CustomerStatus';
import { CloseIcon } from '../../../../theme/images';

export default function CustomerStatusModal({
  statusModal,
  customStyles,
  setStatusModal,
  customer,
  getActivityLogInfo,
}) {
  return (
    <Modal
      isOpen={statusModal.show}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Status modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={() => setStatusModal({ ...statusModal, show: false })}
        role="presentation"
      />
      <CustomerStatus
        type={statusModal.type}
        setStatusModal={setStatusModal}
        customer={customer}
        getActivityLogInfo={getActivityLogInfo}
      />
    </Modal>
  );
}

CustomerStatusModal.defaultProps = {
  customStyles: {},
  setStatusModal: () => {},
};

CustomerStatusModal.propTypes = {
  statusModal: shape({
    show: bool,
  }).isRequired,
  customStyles: shape({}),
  setStatusModal: func,
  customer: shape({ id: string }).isRequired,
  getActivityLogInfo: func.isRequired,
};
