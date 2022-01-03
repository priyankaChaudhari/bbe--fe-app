import React, { useState, useEffect, useCallback, useRef } from 'react';

import dayjs from 'dayjs';
import Modal from 'react-modal';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import { useHistory } from 'react-router-dom';
import { bool, func, shape, string } from 'prop-types';
import { toast } from 'react-toastify';

import InvoiceAdjust from './InvoiceAdjust';
import InvoicePause from './InvoicePause';
import InvoiceAdjustConfirm from './InvoiceAdjustPauseConfirm/InvoiceAdjustConfirm';
import Theme from '../../../../../../theme/Theme';
import { CloseIcon, helpCircleIcon } from '../../../../../../theme/images';
import {
  getDSPBudgetAdjustData,
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
  bpName,
}) => {
  const history = useHistory();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [invoiceInputs, setInvoiceInputs] = useState([]);
  const [invoiceType, setInvoiceType] = useState('standard');
  const [viewComponent, setViewComponent] = useState('adjustInvoice');
  const [selectedMonthYear, setselectedMonthYear] = useState({
    value: dayjs().format('MMMM YYYY'),
    label: dayjs().format('MMMM YYYY'),
  });
  const mounted = useRef(false);
  const [monthsYears, setMonthsYears] = useState([
    {
      value: dayjs().format('MMMM YYYY'),
      label: dayjs().format('MMMM YYYY'),
    },
  ]);

  const getAdjustInvoices = useCallback(
    (date) => {
      setLoader(true);
      setInvoiceInputs([]);

      getDSPBudgetAdjustData('standard', customerId, viewComponent).then(
        (res) => {
          if (mounted.current) {
            if (res && res.status === 500) {
              setLoader(false);
            }

            if (res && res.status === 400) {
              setLoader(false);
            }
            if (res && res.status === 200) {
              let temp =
                viewComponent === 'adjustInvoice'
                  ? res?.data.results.filter(
                      (item) =>
                        item.applicable_from <=
                        dayjs(date).format('YYYY-MM-DD'),
                    )
                  : res?.data.results.filter(
                      (item) =>
                        dayjs(item.applicable_from).format('YYYY-MM') ===
                        dayjs(date).format('YYYY-MM'),
                    );

              temp =
                temp && temp.length === 0
                  ? res?.data.results.filter(
                      (item) =>
                        dayjs(item.applicable_from).format('YYYY-MM') <=
                          dayjs(date).format('YYYY-MM') &&
                        item.pause_approved !== true,
                    )
                  : temp;

              const finalResult =
                temp.length > 0
                  ? temp[0]?.adjustments
                  : viewComponent === 'adjustInvoice'
                  ? [
                      ...new Map(
                        res?.data?.results[0]?.adjustments.map((item) => [
                          item.marketplace,
                          item,
                        ]),
                      ).values(),
                    ]
                  : temp;

              setInvoiceInputs(finalResult);
              setLoader(false);
            }
          }
        },
      );
    },
    [customerId, viewComponent],
  );

  useEffect(() => {
    mounted.current = true;
    const monthsDropDown = [];
    if (day > 10) {
      if (invoiceType === 'standard') {
        for (let index = 0; index <= 5; index += 1) {
          monthsDropDown.push({
            value: dayjs()
              .add(index + 2, 'M')
              .format('MMMM YYYY'),
            label: dayjs()
              .add(index + 2, 'M')
              .format('MMMM YYYY'),
          });
        }
      } else if (invoiceType === 'permanent additional') {
        for (let index = 0; index <= 5; index += 1) {
          monthsDropDown.push({
            value: dayjs()
              .add(index + 1, 'M')
              .format('MMMM YYYY'),
            label: dayjs()
              .add(index + 1, 'M')
              .format('MMMM YYYY'),
          });
        }
      } else {
        for (let index = 0; index <= 5; index += 1) {
          monthsDropDown.push({
            value: dayjs().add(index, 'M').format('MMMM YYYY'),
            label: dayjs().add(index, 'M').format('MMMM YYYY'),
          });
        }
      }
    } else if (invoiceType === 'standard') {
      for (let index = 0; index <= 5; index += 1) {
        monthsDropDown.push({
          value: dayjs()
            .add(index + 1, 'M')
            .format('MMMM YYYY'),
          label: dayjs()
            .add(index + 1, 'M')
            .format('MMMM YYYY'),
        });
      }
    } else {
      for (let index = 0; index <= 5; index += 1) {
        monthsDropDown.push({
          value: dayjs().add(index, 'M').format('MMMM YYYY'),
          label: dayjs().add(index, 'M').format('MMMM YYYY'),
        });
      }
    }
    setMonthsYears(monthsDropDown);
    setselectedMonthYear(monthsDropDown[0]);
    getAdjustInvoices(monthsDropDown[0].value);
    return () => {
      mounted.current = false;
    };
  }, [getAdjustInvoices, invoiceType]);

  const renderToastMessage = useCallback(
    (message) => {
      toast.success(message);
      setTimeout(() => {
        history.push(
          PATH_CUSTOMER_DETAILS.replace(':id', customerId),
          'dsp service',
        );
        history.go(0);
      }, 4000);
    },
    [customerId, history],
  );

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
        toast.error('Something went wrong');
      }
      if (res && res.status === 400) {
        setLoader(false);
        toast.error('Something went wrong');
      }
      if (res && res.status === 201) {
        renderToastMessage(
          `${bpName}Invoice Adjust Created Successfuly for ${selectedMonthYear.value}`,
        );
        setLoader(false);
      }
      setLoader(false);
    });
  }, [
    bpName,
    customerId,
    invoiceInputs,
    invoiceType,
    renderToastMessage,
    selectedMonthYear,
  ]);

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
        toast.error('Something went wrong');
      }
      if (res && res.status === 400) {
        setLoader(false);
        toast.error('Something went wrong');
      }
      if (res && res.status === 201) {
        renderToastMessage(
          `${bpName}Invoice Pause Successfuly for ${selectedMonthYear.value}`,
        );
        setLoader(false);
      }
      setLoader(false);
    });
  }, [
    bpName,
    customerId,
    invoiceInputs,
    invoiceType,
    renderToastMessage,
    selectedMonthYear,
  ]);

  const onSendInvoice = () => {
    // onApply();
    if (viewComponent === 'adjustInvoice') {
      onSendDSPBudgetAdjustInvoice();
    } else {
      onSendDSPBudgetPauseInvoice();
    }
    onApply();
  };

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
          temp.totalNewBudget += parseNumber(
            item.newAmount === '' ? item.new_budget : item.newAmount,
          );
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
                      setInvoiceType('standard');
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

              {loader && <PageLoader color={Theme.orange} type="page" />}
              <div className=" pb-1 pt-3 mb-2">
                <ContractInputSelect>
                  <label htmlFor="amount">
                    applies from{' '}
                    <img
                      src={helpCircleIcon}
                      alt="helpCircleIcon"
                      style={{
                        width: '14px',
                        verticalAlign: 'middle',
                        paddingBottom: '3px',
                      }}
                      data-tip="Current value will be populated based on selected month "
                      data-for="dspAdditionalInfo"
                    />
                    <ReactTooltip
                      id="dspAdditionalInfo"
                      aria-haspopup="true"
                      place="bottom"
                      effect="solid"
                      html
                    />
                  </label>
                  {monthsYears && (
                    <Select
                      classNamePrefix="react-select"
                      isSearchable={false}
                      defaultValue={monthsYears[0]}
                      value={selectedMonthYear}
                      options={monthsYears}
                      name="applies_month_year"
                      components={{ DropdownIndicator }}
                      onChange={(event) => {
                        getAdjustInvoices(event.value);
                        setselectedMonthYear(event);
                      }}
                      placeholder={monthsYears[0].label}
                    />
                  )}
                </ContractInputSelect>
              </div>
            </div>
            <div className="inner-body-content">
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
            </div>
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
            bpName={bpName}
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
            bpName={bpName}
            today={day}
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
  bpName: '',
};

InvoiceAdjustPauseModal.propTypes = {
  isOpen: bool,
  id: string,
  customerId: string.isRequired,
  style: shape({}),
  onModalClose: func,
  onApply: func,
  bpName: string,
};
