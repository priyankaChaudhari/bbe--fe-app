import React, { useEffect } from 'react';

import Modal from 'react-modal';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { func, shape, bool, arrayOf } from 'prop-types';

import Theme from '../../../../theme/Theme';
import { CloseIcon, RecurringIcon } from '../../../../theme/images';
import { ModalBox, Button, ModalRadioCheck } from '../../../../common';

const AddNewContractModal = ({
  customStyles,
  showAddContractModal,
  setShowAddContractModal,
  typeOfNewAgreement,
  existingContracts,
}) => {
  useEffect(() => {
    console.log('old', existingContracts);
  }, [existingContracts]);

  const renderExistigContracts = () => {
    return existingContracts.map((contract) => (
      <OrangeFieldSet className="mt-4 " key={contract.id}>
        <CheckBoxContract>
          <div className="checkbox" role="presentation">
            <input type="checkbox" id="check1" name="check1" value="check12" />
            <label htmlFor="check1">
              <div className="solid-icon mt-2">
                <img
                  width="48px"
                  className="solid-icon"
                  src={RecurringIcon}
                  alt="sync"
                />
              </div>
              <div className="contract-status" role="presentation">
                <p className="black-heading-title mt-2 pt-1 mb-0">
                  {typeOfNewAgreement.label}
                </p>
                <ul className="recurring-contact">
                  <li>
                    <p className="basic-text ">
                      Expires {dayjs(contract.end_date).format('MMM DD, YYYY')}
                    </p>
                  </li>
                  <li>
                    <span className="dot" />
                    <p className="basic-text ">
                      {contract.primary_marketplace?.name}{' '}
                      (Primary),Amazon.ca,Amazon.co.uk
                    </p>
                  </li>
                </ul>
              </div>
            </label>
          </div>
        </CheckBoxContract>
        <div className="clear-fix" />
      </OrangeFieldSet>
    ));
  };

  return (
    <Modal
      isOpen={showAddContractModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={() => setShowAddContractModal(false)}
        role="presentation"
      />
      <ModalBox>
        <div className="modal-body">
          <h4 className="on-boarding ">
            ADD {typeOfNewAgreement.label} &#60;{typeOfNewAgreement.sub}&#62;{' '}
          </h4>{' '}
          <p className="long-text-agr">
            This partner already has an active {typeOfNewAgreement.label}.
            Please confirm whether this is a new agreement to run in parallel
            with the existing agreement(s).
          </p>
          <ModalRadioCheck className="pb-3" key="alongside">
            <label
              className="checkboxes radio-container medium-text-label"
              htmlFor="alongside">
              Yes, this agreement will run alongside the existing one(s)
              <input
                type="radio"
                name="radio"
                id="alongside"
                value="alongside"
              />
              <span className="checkmark checkmark-customer-list" />
            </label>
          </ModalRadioCheck>
          <ModalRadioCheck key="replace">
            <label
              className="checkboxes radio-container medium-text-label"
              htmlFor="replace">
              No, this agreement will replace an existing agreement
              <input type="radio" name="radio" id="replace" value="replace" />
              <span className="checkmark checkmark-customer-list" />
            </label>
          </ModalRadioCheck>
          {renderExistigContracts()}
          <Button className="btn-primary w-100 mt-4">Confirm</Button>
        </div>
      </ModalBox>
    </Modal>
  );
};

export default AddNewContractModal;

AddNewContractModal.defaultProps = {
  existingContracts: [],
};

AddNewContractModal.propTypes = {
  customStyles: shape({}).isRequired,
  showAddContractModal: bool.isRequired,
  setShowAddContractModal: func.isRequired,
  typeOfNewAgreement: shape({}).isRequired,
  existingContracts: arrayOf(shape({})),
};

const OrangeFieldSet = styled.div`
  border-radius: 4px;
  border: 1px solid ${Theme.gray11};
  padding: 0 11px 8px 11px;
  cursor: pointer;
  &.active {
    border: 1px solid ${Theme.orange};
  }
`;

const CheckBoxContract = styled.div`
  label {
    cursor: pointer;
  }

  .checkbox input:checked ~ label:before {
    background-repeat: no-repeat;
    z-index: 2;
    background-position-y: 8px;
    background-position-x: 8px;
    content: '';
  }
  .checkbox input {
    display: none;
  }

  .checkbox label:before {
    margin-top: 25px;
    width: 6px;
    float: right;
    height: 11px;
    border: solid ${Theme.orange};
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;
