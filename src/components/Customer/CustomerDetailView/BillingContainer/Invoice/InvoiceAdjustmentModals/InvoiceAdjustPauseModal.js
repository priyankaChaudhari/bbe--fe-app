import React, { useState, useEffect, useCallback, useRef } from 'react';

import dayjs from 'dayjs';
import Modal from 'react-modal';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';
import { bool, func, shape, string } from 'prop-types';

import InvoiceAdjust from './InvoiceAdjust';
import InvoicePause from './InvoicePause';
import InvoiceAdjustConfirm from './InvoiceAdjustPauseConfirm/InvoiceAdjustConfirm';
import Theme from '../../../../../../theme/Theme';
import { CloseIcon } from '../../../../../../theme/images';
import {
  getDSPBudgetAdjustData,
  getDSPEmptyBudgetAdjustment,
  postDSPBudgetAdjustPauseInvoiceData,
} from '../../../../../../api';
import {
  ModalBox,
  Button,
  Tabs,
  ModalRadioCheck,
  ContractInputSelect,
  DropdownIndicator,
  PageLoader,
} from '../../../../../../common';
import { adjustInvoiceChoices } from '../../../../../../constants/CustomerConstants';
import { PATH_CUSTOMER_DETAILS } from '../../../../../../constants';
import InvoicePauseConfirm from './InvoiceAdjustPauseConfirm/InvoicePauseConfirm';

const todaysDate = new Date();
const day = todaysDate.getDate();

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
  customerId,
  isOpen,
  style,
  onModalClose,
  onApply,
}) => {
  const history = useHistory();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [invoiceInputs, setInvoiceInputs] = useState([]);
  const [invoiceType, setInvoiceType] = useState('standard');
  const [viewComponent, setViewComponent] = useState('adjustInvoice');
  const [selectedMonthYear, setselectedMonthYear] = useState(
    day >= 10
      ? {
          value: dayjs().add(2, 'M').format('MMMM YYYY'),
          label: dayjs().add(2, 'M').format('MMMM YYYY'),
        }
      : {
          value: dayjs().add(1, 'M').format('MMMM YYYY'),
          label: dayjs().add(1, 'M').format('MMMM YYYY'),
        },
  );
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      if (
        day >= 10 &&
        ['standard', 'permanent additional'].includes(invoiceType)
      ) {
        setselectedMonthYear({
          value: dayjs().add(2, 'M').format('MMMM YYYY'),
          label: dayjs().add(2, 'M').format('MMMM YYYY'),
        });
      } else {
        setselectedMonthYear({
          value: dayjs().add(1, 'M').format('MMMM YYYY'),
          label: dayjs().add(1, 'M').format('MMMM YYYY'),
        });
      }
    }
    return () => {
      mounted.current = false;
    };
  }, [invoiceType]);

  const getDSPEmptyBudget = useCallback(() => {
    getDSPEmptyBudgetAdjustment(customerId).then((res) => {
      if (mounted.current) {
        if (res && res.status === 500) {
          setLoader(false);
        }

        if (res && res.status === 400) {
          setLoader(false);
        }
        if (res && res.status === 200) {
          setInvoiceInputs(res.data[0]?.adjustments);
          setLoader(false);
        }
        setLoader(false);
      }
    });
  }, [customerId]);

  const getAdjustInvoices = useCallback(() => {
    setLoader(true);
    setInvoiceInputs([]);

    getDSPBudgetAdjustData('standard', customerId, true).then((res) => {
      if (mounted.current) {
        if (res && res.status === 500) {
          setLoader(false);
        }

        if (res && res.status === 400) {
          setLoader(false);
        }
        if (res && res.status === 200) {
          const finalData = res?.data.results.filter(
            (item) =>
              item.applicable_from <=
              dayjs(selectedMonthYear.value).format('YYYY-MM-DD'),
          );
          if (finalData.length === 0) {
            getDSPEmptyBudget();
          } else {
            setInvoiceInputs(finalData[0]?.adjustments);
            setLoader(false);
          }
        }
        setLoader(false);
      }
    });
  }, [customerId, getDSPEmptyBudget, selectedMonthYear.value]);

  const onSendDSPBudgetAdjustInvoice = useCallback(() => {
    setLoader(true);
    postDSPBudgetAdjustPauseInvoiceData(
      invoiceInputs,
      selectedMonthYear,
      invoiceType,
      customerId,
      'adjust',
    ).then((res) => {
      if (res && res.status === 500) {
        setLoader(false);
      }

      if (res && res.status === 400) {
        setLoader(false);
      }
      if (res && res.status === 201) {
        history.push(
          PATH_CUSTOMER_DETAILS.replace(':id', customerId),
          'dsp service',
        );
        setLoader(false);
      }
      setLoader(false);
    });
  }, [customerId, history, invoiceInputs, invoiceType, selectedMonthYear]);

  const onSendDSPBudgetPauseInvoice = useCallback(() => {
    setLoader(true);
    postDSPBudgetAdjustPauseInvoiceData(
      invoiceInputs,
      selectedMonthYear,
      invoiceType,
      customerId,
      'pause',
    ).then((res) => {
      if (res && res.status === 500) {
        setLoader(false);
      }

      if (res && res.status === 400) {
        setLoader(false);
      }
      if (res && res.status === 201) {
        history.push(
          PATH_CUSTOMER_DETAILS.replace(':id', customerId),
          'dsp service',
        );
        setLoader(false);
      }
      setLoader(false);
    });
  }, [customerId, history, invoiceInputs, invoiceType, selectedMonthYear]);

  const onSendInvoice = () => {
    // onApply();
    if (viewComponent === 'adjustInvoice') {
      onSendDSPBudgetAdjustInvoice();
    } else {
      onSendDSPBudgetPauseInvoice();
    }
    onApply();
  };

  useEffect(() => {
    mounted.current = true;
    getAdjustInvoices(invoiceType);
    return () => {
      mounted.current = false;
    };
  }, [getAdjustInvoices, invoiceType]);

  const parseNumber = (value) => {
    return value
      ? isNaN(parseFloat(value.toString().replace(/,/g, '')))
        ? 0
        : parseFloat(value.toString().replace(/,/g, ''))
      : 0;
  };

  const returnTotalAmount = useCallback(() => {
    if (invoiceInputs && invoiceInputs.length > 0) {
      const temp = { totalCurrentBudget: 0, totalNewBudget: 0 };
      invoiceInputs.forEach((item) => {
        if (
          item &&
          item.new_budget &&
          ['standard', 'permanent additional'].includes(invoiceType)
        ) {
          temp.totalCurrentBudget += parseNumber(item.new_budget.toString());
        }
        if (Object.prototype.hasOwnProperty.call(item, 'newAmount')) {
          temp.totalNewBudget += parseNumber(item.newAmount);
        } else if (
          Object.prototype.hasOwnProperty.call(item, 'new_budget') &&
          ['standard', 'permanent additional'].includes(invoiceType)
        ) {
          temp.totalNewBudget += parseNumber(item.new_budget.toString());
        }
      });

      return temp;
    }
    return 0;
  }, [invoiceInputs, invoiceType]);

  const getMonthYearOptions = () => {
    const monthsYears = [];

    if (
      day >= 10 &&
      ['standard', 'permanent additional'].includes(invoiceType)
    ) {
      for (let i = 0; i <= 5; i += 1) {
        monthsYears.push({
          value: dayjs()
            .add(i + 2, 'M')
            .format('MMMM YYYY'),
          label: dayjs()
            .add(i + 2, 'M')
            .format('MMMM YYYY'),
        });
      }
    } else {
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
            <div className="modal-body pb-1 pt-3 mb-2">
              <ContractInputSelect>
                <label htmlFor="amount">applies from </label>
                <Select
                  classNamePrefix="react-select"
                  isSearchable={false}
                  defaultValue={getMonthYearOptions()[0]}
                  value={selectedMonthYear}
                  options={getMonthYearOptions()}
                  name="applies_month_year"
                  components={{ DropdownIndicator }}
                  onChange={(event) => {
                    setselectedMonthYear(event);
                  }}
                  placeholder={getMonthYearOptions()[0].label}
                />
              </ContractInputSelect>
            </div>
            {viewComponent === 'adjustInvoice' ? (
              <InvoiceAdjust
                invoiceInputs={invoiceInputs}
                setInvoiceInputs={setInvoiceInputs}
                returnTotalAmount={returnTotalAmount}
                parseNumber={parseNumber}
                invoiceType={invoiceType}
                selectedMonthYear={selectedMonthYear}
                loading={loader}
              />
            ) : (
              <InvoicePause
                invoiceChoices={invoiceInputs}
                setInvoiceChoices={setInvoiceInputs}
                returnTotalAmount={returnTotalAmount}
                parseNumber={parseNumber}
                loading={loader}
              />
            )}

            <div className="footer-line" />
            <div className="modal-footer">
              <div className="text-center">
                <Button
                  disabled={
                    loader ||
                    returnTotalAmount().totalCurrentBudget ===
                      returnTotalAmount().totalNewBudget
                  }
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
        ) : viewComponent === 'pauseInvoice' ? (
          <InvoicePauseConfirm
            adjustmentData={invoiceInputs}
            onBackClick={() => {
              setShowConfirmationModal(false);
            }}
            returnTotalAmount={returnTotalAmount}
            selectedMonthYear={selectedMonthYear}
            invoiceType={invoiceType}
            onApply={() => {
              onSendInvoice();
            }}
          />
        ) : (
          <InvoiceAdjustConfirm
            adjustmentData={invoiceInputs}
            onBackClick={() => {
              setShowConfirmationModal(false);
            }}
            returnTotalAmount={returnTotalAmount}
            selectedMonthYear={selectedMonthYear}
            invoiceType={invoiceType}
            onApply={() => {
              onSendInvoice();
            }}
          />
        )}
      </Modal>
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
  customerId: string.isRequired,
  style: shape({}),
  onModalClose: func,
  onApply: func,
};
