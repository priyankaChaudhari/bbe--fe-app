import React from 'react';

import Modal from 'react-modal';
import { bool, func, string } from 'prop-types';

import { ModalBox, Button, InputFormField } from '../../../../common';
import { CloseIcon, AddIcons } from '../../../../theme/images';

const todaysDate = new Date();
todaysDate.setDate(todaysDate.getDate() - 2);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '518px ',
    width: '100% ',
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
        <div className="modal-body pb-0">
          <h4>Allocate Balance</h4>
          <div className="row">
            <div className="col-6">
              {' '}
              <InputFormField className="mt-3">
                <label htmlFor="emailAddress">
                  Month
                  <br />
                  <input className="form-control" />
                </label>
              </InputFormField>
            </div>
            <div className="col-6">
              {' '}
              <InputFormField className="mt-3">
                <label className="modal-field " htmlFor="emailAddress">
                  Amount
                  <div className="input-container">
                    <span className="input-icon">$</span>
                    <input className="form-control" />
                  </div>
                </label>
              </InputFormField>
            </div>
            <div className="col-6">
              {' '}
              <InputFormField className="mt-3">
                <label htmlFor="emailAddress">
                  Month
                  <br />
                  <input className="form-control" />
                </label>
              </InputFormField>
            </div>
            <div className="col-6">
              {' '}
              <InputFormField className="mt-3">
                <label className="modal-field " htmlFor="emailAddress">
                  Amount
                  <div className="input-container">
                    <span className="input-icon">$</span>
                    <input className="form-control" />
                  </div>
                </label>
              </InputFormField>
            </div>
            <Button
              style={{ textTransform: 'uppercase' }}
              className="btn-add-contact mt-3">
              {' '}
              <img
                width="14px"
                style={{ verticalAlign: 'middle' }}
                src={AddIcons}
                className="ml-1 add-icon"
                alt="add"
              />{' '}
              Add another Month
            </Button>
          </div>
        </div>
        <div className="footer-line" />
        <div className="modal-footer">
          <div className="text-center ">
            <Button
              className="btn-primary on-boarding  w-100"
              onClick={onApply}
              type="button">
              Confirm
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
