import React, { useState, useEffect, useCallback } from 'react';

import dayjs from 'dayjs';
import Modal from 'react-modal';
import Select from 'react-select';
import { bool, func, shape, string } from 'prop-types';

import InvoiceAdjust from './InvoiceAdjust';
import InvoicePause from './InvoicePause';
import InvoiceAdjustConfirm from './InvoiceAdjustConfirm';
import Theme from '../../../../../../theme/Theme';
import { dspInvoiceSubType } from './dummyData';
import { CloseIcon } from '../../../../../../theme/images';
import { getDSPBudgetAdjustData } from '../../../../../../api';
import {
  ModalBox,
  Button,
  Tabs,
  ModalRadioCheck,
  ContractInputSelect,
  DropDownIndicator,
  PageLoader,
} from '../../../../../../common';
import { adjustInvoiceChoices } from '../../../../../../constants/CustomerConstants';

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

const InvoiceAdjustPauseModal = ({ id, isOpen, style, onModalClose }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [invoiceChoices, setInvoiceChoices] = useState({});
  const [invoiceInputs, setInvoiceInputs] = useState([]);
  const [invoiceType, setInvoiceType] = useState('standard');
  const [viewComponent, setViewComponent] = useState('adjustInvoice');
  const [selectedMonthYear, setselectedMonthYear] = useState({
    value: dayjs().add(1, 'M').format('MMMM YYYY'),
    label: dayjs().add(1, 'M').format('MMMM YYYY'),
  });

  const getadjustInvoices = useCallback(
    (type) => {
      setLoader(true);
      getDSPBudgetAdjustData(type, id).then((res) => {
        if (res && res.status === 500) {
          setLoader(false);
        }

        if (res && res.status === 400) {
          setLoader(false);
        }
        if (res && res.status === 200) {
          setLoader(false);
        }
        setInvoiceInputs(dspInvoiceSubType.results);
        setLoader(false);
      });
    },
    [id],
  );

  const getPauseInvoices = useCallback(
    (type) => {
      setLoader(true);
      getDSPBudgetAdjustData(type, id).then((res) => {
        if (res && res.status === 500) {
          setLoader(false);
        }

        if (res && res.status === 400) {
          setLoader(false);
        }
        if (res && res.status === 200) {
          setLoader(false);
        }
        setLoader(false);
      });
    },
    [id],
  );

  useEffect(() => {
    if (viewComponent === 'adjustInvoice') {
      getadjustInvoices(invoiceType);
    } else {
      getPauseInvoices(invoiceType);
    }
  }, [getPauseInvoices, getadjustInvoices, invoiceType, viewComponent]);

  const parseNumber = (value) => {
    return isNaN(parseFloat(value.replace(/,/g, '')))
      ? 0
      : parseFloat(value.replace(/,/g, ''));
  };

  const returnTotalAmount = useCallback(() => {
    if (invoiceInputs && invoiceInputs.length > 0) {
      const temp = { currentBudget: 0, newBudget: 0 };
      // eslint-disable-next-line guard-for-in
      for (const key in invoiceInputs) {
        if (invoiceInputs[key] && invoiceInputs[key].old_budget) {
          temp.currentBudget += parseNumber(
            invoiceInputs[key].old_budget.toString(),
          );
        }
        if (invoiceInputs[key] && invoiceInputs[key].newAmount) {
          temp.newBudget += parseNumber(invoiceInputs[key].newAmount);
        } else {
          temp.newBudget += parseNumber(
            invoiceInputs[key].old_budget.toString(),
          );
        }
      }

      return temp;
    }
    return 0;
  }, [invoiceInputs]);

  const getMonthYearOptions = () => {
    const monthsYears = [];

    for (let i = 0; i <= 5; i += 1) {
      monthsYears.push({
        value: dayjs()
          .add(i + 1, 'M')
          .format('MMMM YYYY'),
        label: dayjs()
          .add(i + 1, 'M')
          .format('MMMM YYYY'),
      });
    }

    return monthsYears;
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
        {!showConfirmationModal ? (
          <ModalBox>
            <div className="modal-body pb-1">
              <h4>Invoice Adjustment</h4>
              <Tabs className="mt-3">
                {' '}
                <ul className="tabs">
                  <li
                    className={`modal-tab ${
                      viewComponent === 'adjustInvoice'
                        ? 'active'
                        : loader
                        ? 'disabled'
                        : ''
                    }`}
                    role="presentation"
                    onClick={() => {
                      setViewComponent('adjustInvoice');
                    }}>
                    Adjust Invoice
                  </li>
                  <li
                    className={`modal-tab ${
                      viewComponent === 'pauseInvoice'
                        ? 'active'
                        : loader
                        ? 'disabled'
                        : ''
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
                      <li key={item.id}>
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
            {loader && <PageLoader color={Theme.orange} type="page" />}
            {viewComponent === 'adjustInvoice' ? (
              <InvoiceAdjust
                invoiceInputs={invoiceInputs}
                setInvoiceInputs={setInvoiceInputs}
                returnTotalAmount={returnTotalAmount}
                parseNumber={parseNumber}
              />
            ) : (
              <InvoicePause
                invoiceChoices={invoiceChoices}
                setInvoiceChoices={setInvoiceChoices}
                returnTotalAmount={returnTotalAmount}
                parseNumber={parseNumber}
              />
            )}
            <div className="modal-body pb-1 pt-3">
              <ContractInputSelect>
                <label htmlFor="amount">applies from </label>
                <Select
                  classNamePrefix="react-select"
                  isSearchable={false}
                  defaultValue={getMonthYearOptions()[0]}
                  value={selectedMonthYear}
                  options={getMonthYearOptions()}
                  name="applies_month_year"
                  components={{ DropDownIndicator }}
                  onChange={(event) => {
                    setselectedMonthYear(event);
                  }}
                  placeholder={getMonthYearOptions()[0].label}
                />
              </ContractInputSelect>
            </div>
            <div className="footer-line" />
            <div className="modal-footer">
              <div className="text-center ">
                <Button
                  disabled={loader}
                  onClick={() => {
                    setShowConfirmationModal(true);
                  }}
                  type="button"
                  className="btn-primary on-boarding   w-100">
                  {loader ? (
                    <PageLoader color={Theme.white} type="button" />
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </div>
          </ModalBox>
        ) : (
          <InvoiceAdjustConfirm
            adjustmentData={invoiceInputs}
            onBackClick={() => {
              setShowConfirmationModal(false);
            }}
            returnTotalAmount={returnTotalAmount}
          />
        )}
      </Modal>

      {/* <InvoiceAdjustDetailsModal
        id="BT-invoiceDetailsModal"
        isOpen={showInvoiceDetailsModal}
        onClick={() => {
          setShowInvoiceDetailsModal(false);
        }}
        onApply={() => {
          setShowInvoiceDetailsModal(false);
        }}
      /> */}
    </>
  );
};

export default InvoiceAdjustPauseModal;

InvoiceAdjustPauseModal.defaultProps = {
  isOpen: false,
  id: '',
  style: {},
  onModalClose: () => {},
};

InvoiceAdjustPauseModal.propTypes = {
  isOpen: bool,
  id: string,
  style: shape({}),
  onModalClose: func,
};
