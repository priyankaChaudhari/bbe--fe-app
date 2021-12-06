import React, { useState } from 'react';

import Modal from 'react-modal';
import Select from 'react-select';
import { bool, func, shape, string } from 'prop-types';
import styled from 'styled-components';

import InvoiceAdjustDetailsModal from './InvoiceAdjustDetailsModal';
import { CloseIcon } from '../../../../../../theme/images';
import {
  ModalBox,
  Button,
  Tabs,
  ModalRadioCheck,
  ContractInputSelect,
  InputFormField,
} from '../../../../../../common';

const todaysDate = new Date();
todaysDate.setDate(todaysDate.getDate() - 2);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
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
          <div className="modal-body pb-1">
            <h4>Invoice Adjustment</h4>
            <Tabs className="mt-3">
              {' '}
              <ul className="tabs">
                <li className="modal-tab active" role="presentation">
                  Adjust Invoice
                </li>
                <li className="modal-tab " role="presentation">
                  Pause Invoice
                </li>
              </ul>
            </Tabs>
            <ul className="invoice-adj-radio mt-4">
              <li>
                <ModalRadioCheck className="mb-3">
                  {' '}
                  <label
                    className=" checkboxes radio-container customer-list"
                    htmlFor="standard">
                    <input type="radio" name="radio" id="standard" />
                    <span className="checkmark checkmark-customer-list" />
                    Standard
                  </label>
                </ModalRadioCheck>
              </li>
              <li>
                <ModalRadioCheck className="mb-3">
                  {' '}
                  <label
                    className=" checkboxes radio-container customer-list"
                    htmlFor="standard">
                    <input type="radio" name="radio" id="standard" />
                    <span className="checkmark checkmark-customer-list" />
                    Permanent Additional
                  </label>
                </ModalRadioCheck>
              </li>
              <li>
                <ModalRadioCheck className="mb-3">
                  {' '}
                  <label
                    className=" checkboxes radio-container customer-list"
                    htmlFor="standard">
                    <input type="radio" name="radio" id="standard" />
                    <span className="checkmark checkmark-customer-list" />
                    One Time
                  </label>
                </ModalRadioCheck>
              </li>
            </ul>
          </div>

          <GrayTable>
            <div className="modal-body pb-3">
              <div className="row">
                <div className="col-4 text-left">
                  <div className="label">Marketplace</div>
                </div>
                <div className="col-4 text-left">
                  <div className="label">Current</div>
                </div>
                <div className="col-4 text-left">
                  <div className="label">New amount</div>
                </div>

                <div className=" straight-line horizontal-line pt-1 mb-2 " />
                <div className="col-4 text-left mt-3">
                  <div className="normal-text ">US</div>
                </div>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text ">$5,000</div>
                </div>
                <div className="col-4 text-left">
                  {/* <InputFormField id="BT-InvoiceAdjustPause">
                    <div className="input-container  ">
                      <span className="input-icon ">$</span>

                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        placeholder="Enter your Password"
                        id="password"
                      />
                    </div>
                  </InputFormField> */}
                  <ul className="invoice-adj-radio mt-4">
                    <li>
                      <ModalRadioCheck className="mb-3">
                        {' '}
                        <label
                          className=" checkboxes radio-container customer-list"
                          htmlFor="yes">
                          <input type="radio" name="radio" id="yes" />
                          <span className="checkmark checkmark-customer-list" />
                          Yes
                        </label>
                      </ModalRadioCheck>
                    </li>
                    <li>
                      <ModalRadioCheck className="mb-3">
                        {' '}
                        <label
                          className=" checkboxes radio-container customer-list"
                          htmlFor="no">
                          <input type="radio" name="radio" id="no" />
                          <span className="checkmark checkmark-customer-list" />
                          No
                        </label>
                      </ModalRadioCheck>
                    </li>
                  </ul>
                </div>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text ">UK</div>
                </div>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text ">$5,000</div>
                </div>
                <div className="col-4 text-left">
                  <InputFormField id="BT-escrow-numberFormat-budgetAllocaion">
                    <div className="input-container  ">
                      <span className="input-icon ">$</span>

                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        id="password"
                      />
                    </div>
                  </InputFormField>
                </div>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text ">Canada</div>
                </div>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text ">$5,000</div>
                </div>
                <div className="col-4 text-left">
                  <InputFormField id="BT-escrow-numberFormat-budgetAllocaion">
                    <div className="input-container  ">
                      <span className="input-icon ">$</span>

                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        id="password"
                      />
                    </div>
                  </InputFormField>
                </div>
                <div className=" straight-line horizontal-line pt-2 " />
                <div className="col-4 text-left mt-3">
                  <div className="normal-text text-bold ">Total</div>
                </div>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text text-bold">$10,000</div>
                </div>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text text-bold">$10,000 </div>
                </div>
              </div>
            </div>
          </GrayTable>
          <div className="modal-body pb-1 pt-3">
            <ContractInputSelect>
              <label htmlFor="amount">applies from </label>
              <Select />
            </ContractInputSelect>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="text-center ">
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

const GrayTable = styled.div`
  background-color: #f4f6fc;
`;
