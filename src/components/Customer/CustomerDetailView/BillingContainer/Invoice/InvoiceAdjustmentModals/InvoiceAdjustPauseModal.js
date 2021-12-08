import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import Select from 'react-select';
import { bool, func, shape, string } from 'prop-types';

import InvoiceAdjustDetailsModal from './InvoiceAdjustDetailsModal';
import { CloseIcon } from '../../../../../../theme/images';
import {
  ModalBox,
  Button,
  Tabs,
  ModalRadioCheck,
  ContractInputSelect,
} from '../../../../../../common';
import { adjustInvoiceChoices } from '../../../../../../constants/CustomerConstants';
import InvoiceAdjust from './InvoiceAdjust';
import InvoicePause from './InvoicePause';

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
  const [newAmount, setNewAmount] = useState({});
  const [invoiceType, setInvoiceType] = useState('standard');
  const [viewComponent, setViewComponent] = useState('adjustInvoice');

  useEffect(() => {
    console.log('new amount----', newAmount);
  }, [newAmount]);

  const returnTotalAmount = () => {
    const amounts = Object.values(newAmount);
    if (amounts && amounts.length > 0) {
      let temp = 0;
      amounts.forEach((value) => {
        temp += isNaN(parseFloat(value.replace(/,/g, '')))
          ? 0
          : parseFloat(value.replace(/,/g, ''));
      });
      return temp;
    }
    return 0;
  };

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
                <li
                  className={`modal-tab ${
                    viewComponent === 'adjustInvoice' ? 'active' : ''
                  }`}
                  role="presentation"
                  onClick={() => {
                    setViewComponent('adjustInvoice');
                  }}>
                  Adjust Invoice
                </li>
                <li
                  className={`modal-tab ${
                    viewComponent === 'pauseInvoice' ? 'active' : ''
                  }`}
                  role="presentation"
                  onClick={() => {
                    setViewComponent('pauseInvoice');
                  }}>
                  Pause Invoice
                </li>
              </ul>
            </Tabs>
            {viewComponent === 'adjustInvoice' ? (
              <ul className="invoice-adj-radio mt-4">
                {adjustInvoiceChoices.map((item) => {
                  return (
                    <li>
                      <ModalRadioCheck className="mb-3">
                        <label
                          className=" checkboxes radio-container customer-list"
                          htmlFor={item.id}>
                          <input
                            type="radio"
                            name={item.name}
                            checked={invoiceType === item.name}
                            onChange={(e) => {
                              setInvoiceType(e.target.name);
                            }}
                            id={item.id}
                          />
                          <span className="checkmark checkmark-customer-list" />
                          {item.label}
                        </label>
                      </ModalRadioCheck>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {viewComponent === 'adjustInvoice' ? (
            <InvoiceAdjust
              newAmount={newAmount}
              setNewAmount={setNewAmount}
              returnTotalAmount={returnTotalAmount}
            />
          ) : (
            <InvoicePause returnTotalAmount={returnTotalAmount} />
          )}
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
