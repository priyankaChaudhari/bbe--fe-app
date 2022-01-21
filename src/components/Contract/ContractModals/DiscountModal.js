import React from 'react';

import Modal from 'react-modal';
import { string, bool, func, shape, oneOfType, number } from 'prop-types';

import Discount from '../Discount';
import { ModalBox } from '../../../common';
import { CloseIcon } from '../../../theme/images';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    minHeight: '170px',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function DiscountModal({
  showDiscountModal,
  closeDiscountModal,
  details,
  setShowDiscountModal,
  formData,
  setFormData,
  discountFlag,
  setDetails,
  selectedDiscount,
  getDiscountData,
  updatedFormData,
  setIsEditContract,
  getAmendmentData,
  getServicesAccordingToAccType,
  getContractActivityLogInfo,
}) {
  return (
    <Modal
      isOpen={showDiscountModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={() => closeDiscountModal()}
        role="presentation"
      />
      <ModalBox>
        <Discount
          agreementData={details}
          setShowDiscountModal={setShowDiscountModal}
          formData={formData}
          setFormData={setFormData}
          discountFlag={discountFlag}
          setDetails={setDetails}
          selectedDiscount={selectedDiscount}
          getDiscountData={getDiscountData}
          updatedFormData={updatedFormData}
          setIsEditContract={setIsEditContract}
          getAmendmentData={getAmendmentData}
          getServicesAccordingToAccType={getServicesAccordingToAccType}
          getContractActivityLogInfo={getContractActivityLogInfo}
        />
      </ModalBox>
    </Modal>
  );
}

export default DiscountModal;

DiscountModal.defaultProps = {
  showDiscountModal: false,
  closeDiscountModal: () => {},
  details: {},
  setShowDiscountModal: () => {},
  formData: {},
  setFormData: () => {},
  discountFlag: '',
  setDetails: () => {},
  selectedDiscount: {},
  getDiscountData: () => {},
  updatedFormData: {},
  setIsEditContract: () => {},
  getAmendmentData: () => {},
  getServicesAccordingToAccType: () => {},
  getContractActivityLogInfo: () => {},
};

DiscountModal.propTypes = {
  showDiscountModal: bool,
  closeDiscountModal: func,
  details: shape({
    id: string,
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
    one_time_discount_type: oneOfType([string, number]),
    one_time_discount_amount: oneOfType([string, number]),
  }),
  setShowDiscountModal: func,
  formData: shape({
    id: string,
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
    one_time_discount_type: oneOfType([string, number]),
    one_time_discount_amount: oneOfType([string, number]),
  }),
  setFormData: func,
  discountFlag: string,
  setDetails: func,
  selectedDiscount: shape({}),
  getDiscountData: func,
  updatedFormData: shape({}),
  setIsEditContract: func,
  getAmendmentData: func,
  getServicesAccordingToAccType: func,
  getContractActivityLogInfo: func,
};
