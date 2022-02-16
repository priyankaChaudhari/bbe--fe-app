import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';

import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { bool, func, string } from 'prop-types';

import EditMarketplaceAllocation from './EditMarketplaceAllocation';
import {
  getDspPacingData,
  getEscrowBalanceMarketplaceData,
  storeAllocatedBudget,
} from '../../../../api';
import {
  CloseIcon,
  AddIcons,
  InfoRedIcon,
  LeftArrowIcon,
} from '../../../../theme/images';
import {
  ModalBox,
  Button,
  InputFormField,
  PageLoader,
  AllocateBar,
  ErrorMsgBox,
  Tabs,
} from '../../../../common';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    minHeight: '220px',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
export default function EscrowBudgetAllocationModal({
  id,
  isOpen,
  onClick,
  customerId,
  marketplace,
  getActivityLogInfo,
}) {
  const mounted = useRef(false);
  const currencySymbol = '$';
  const currentDate = useMemo(() => {
    return new Date();
  }, []);
  currentDate.setDate(1);
  currentDate.setHours(currentDate.getHours() + 12);
  const newCurrentDate = useMemo(() => {
    return new Date();
  }, []);
  newCurrentDate.setDate(1);
  newCurrentDate.setHours(currentDate.getHours());
  const currentMonthYear = dayjs(newCurrentDate).format('YYYY-MM-DD');

  const [escrowBalanceMarketplace, setEscrowBalanceMarketplace] = useState([]);
  const [oldEscrowAllocation, setOldEscrowAllocation] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(marketplace);
  const [totalEscrowBalance, setTotalEscrowBalance] = useState();

  const [
    selectedMarketplaceBalance,
    setSelectedMarketplaceBalance,
  ] = useState();
  const [
    showEscrowMonthlyAllocation,
    setShowEscrowMonthlyAllocation,
  ] = useState(true);
  const [showMarketPlaceAllocation, setShowMarketPlaceAllocation] = useState(
    false,
  );
  const [allocatedMonths, setAllocatedMonths] = useState();
  const [isAllowToEdit, setIsAllowToEdit] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isMonthlyDataLoading, setIsMonthlyDataLoading] = useState(true);
  const [isSubmitLoader, setIsSubmitLoader] = useState(true);
  const [isApiCall, setIsApiCall] = useState(false);
  const [isEscrowBalanceExceed, setIsEscrowBalanceExceed] = useState(
    totalEscrowBalance < 0,
  );

  const addThousandSeperator = (value, type = '') => {
    if (value && value !== null && value !== 0) {
      value = Number(value.toFixed(2));
      return `${value < 0 ? '-' : ''}${
        type === 'currency' ? currencySymbol : ''
      }${value
        .toString()
        .replace('-', '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    return 0;
  };
  const bindEscrowMarketplaceData = useCallback((response) => {
    const tempData = [];
    if (response) {
      setTotalEscrowBalance(
        response?.total_escrow ? response?.total_escrow : 0,
      );
      if (response?.marketplace?.length) {
        response.marketplace.forEach((item, index) => {
          tempData.push({
            label: item?.label ? item?.label : null,
            value: item?.value ? item?.value : null,
            key: item?.id ? item.id : `${item.label}${index}`,
            escrowBalance: item?.total ? item?.total : 0,
            escrowReallocatedBalance: item?.total ? item?.total : 0,
          });
          setOldEscrowAllocation(tempData);
          setIsSubmitLoader(false);
        });
      } else {
        setIsSubmitLoader(true);
      }
    }
    return tempData;
  }, []);

  const getEscrowBalanceMarketplace = useCallback(() => {
    setIsDataLoading(true);
    getEscrowBalanceMarketplaceData(customerId).then((response) => {
      if (mounted.current) {
        if (response?.status === 200) {
          const getData = bindEscrowMarketplaceData(response?.data);
          setEscrowBalanceMarketplace(getData);
        }
        setIsDataLoading(false);
      }
    });
  }, [bindEscrowMarketplaceData, customerId]);

  const getDSPPacing = useCallback(
    (currentMarketplace) => {
      setIsMonthlyDataLoading(true);
      getDspPacingData(customerId, currentMarketplace).then((res) => {
        if (mounted.current) {
          if (res && res.status === 200) {
            const dspPacing = res?.data?.dsp_pacing;
            const currentEscrowBalance = dspPacing?.escrow_converted_usd
              ? dspPacing?.escrow_converted_usd
              : 0;
            setSelectedMarketplaceBalance(currentEscrowBalance);
            setIsEscrowBalanceExceed(currentEscrowBalance < 0);
            setAllocatedMonths(
              dspPacing?.allocated_balance.length
                ? dspPacing?.allocated_balance
                : [
                    {
                      month_year: dayjs(currentDate).format('YYYY-MM-DD'),
                      escrow_allocated_converted_usd: currentEscrowBalance,
                    },
                  ],
            );
          }
          setIsMonthlyDataLoading(false);
        }
      });
    },
    [currentDate, customerId],
  );

  const submitAllocatedBudget = useCallback(() => {
    setIsApiCall(true);
    storeAllocatedBudget(allocatedMonths, customerId, selectedMarketplace).then(
      (res) => {
        if (mounted.current) {
          if (res && res.status === 200) {
            onClick();
            getActivityLogInfo();
          }
          setIsApiCall(false);
        }
      },
    );
  }, [
    allocatedMonths,
    customerId,
    selectedMarketplace,
    onClick,
    getActivityLogInfo,
  ]);

  useEffect(() => {
    mounted.current = true;
    getEscrowBalanceMarketplace();
    return () => {
      mounted.current = false;
    };
  }, [getEscrowBalanceMarketplace]);
  useEffect(() => {
    mounted.current = true;
    getDSPPacing(marketplace);
    return () => {
      mounted.current = false;
    };
  }, [getDSPPacing, marketplace]);

  const calculateSumOfFutureMonths = (newValues) => {
    const sumAll = newValues
      .map((item, index) => index !== 0 && item.escrow_allocated_converted_usd)
      .reduce((prev, curr) => Number(prev) + Number(curr), 0);
    return sumAll;
  };

  const handleOnChange = (event, index) => {
    const tempData = [...allocatedMonths];
    tempData[index].escrow_allocated_converted_usd = event.target.value.replace(
      /,/g,
      '',
    );
    const sumOfFutureMonths = calculateSumOfFutureMonths(tempData);
    const currentMonthAmount = selectedMarketplaceBalance - sumOfFutureMonths;
    tempData[0].escrow_allocated_converted_usd = String(
      currentMonthAmount.toFixed(2),
    );
    if (currentMonthAmount < 0) setIsEscrowBalanceExceed(true);
    else setIsEscrowBalanceExceed(false);
    setAllocatedMonths(tempData);
  };

  const handleOnAddAnotherMonth = () => {
    const lastRecord = allocatedMonths[allocatedMonths.length - 1];
    const nextMonth = new Date(lastRecord?.month_year);
    nextMonth.setHours(nextMonth.getHours() + 12);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setAllocatedMonths([
      ...allocatedMonths,
      {
        month_year: dayjs(nextMonth).format('YYYY-MM-DD'),
        escrow_allocated_converted_usd: addThousandSeperator(0),
      },
    ]);
  };

  const renderAllocateBar = () => {
    return (
      <div className="col-12" key="allocateBar01">
        <AllocateBar
          id="BT-escrowBalance-budgetAllocaion"
          className="mt-3 mb-3">
          <div className="row">
            <div className="col-12 col-md-7">
              <div className="remaing-label text-bold">
                Total Escrow Balance:&nbsp;
                {totalEscrowBalance === 0
                  ? `$${totalEscrowBalance}`
                  : addThousandSeperator(totalEscrowBalance, 'currency')}
              </div>
            </div>
            <div className="col-12 col-md-5">
              {escrowBalanceMarketplace?.length > 1 && isAllowToEdit ? (
                <div className="text-bold text-right">
                  <div
                    className="edit-marketplace cursor text-medium"
                    role="presentation"
                    onClick={() => {
                      setShowMarketPlaceAllocation(true);
                      setShowEscrowMonthlyAllocation(false);
                    }}>
                    Edit marketplace Allocation
                    <img
                      width="16px"
                      className="orange-left-arrow"
                      src={LeftArrowIcon}
                      alt=""
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="clear-fix" />
        </AllocateBar>
      </div>
    );
  };
  const renderMarketplaceTab = () => {
    const getIndex = escrowBalanceMarketplace.findIndex(
      (item) => item.value === selectedMarketplace,
    );
    if (getIndex >= 0) {
      const splicedObj = escrowBalanceMarketplace.splice(getIndex, 1)[0];
      escrowBalanceMarketplace.splice(0, 0, splicedObj);
    }
    return (
      <>
        <div className="col-12 mt-2 mb-3" key="scrollableTabs01">
          <Tabs>
            <ul className="tabs scrollable-container" style={{ width: '100%' }}>
              {escrowBalanceMarketplace.map((item) => {
                return (
                  <li
                    id={item.key}
                    key={item.key}
                    className={
                      selectedMarketplace === item.value
                        ? 'active scrollable-tab mt-1'
                        : ' scrollable-tab mt-1 '
                    }
                    onClick={() => {
                      setSelectedMarketplace(item.value);
                      getDSPPacing(item.value);
                      setIsAllowToEdit(item.escrowBalance >= 0);
                    }}
                    role="presentation">
                    {item.label}&nbsp; (
                    {item.escrowBalance === 0
                      ? `$${item.escrowBalance}`
                      : addThousandSeperator(item.escrowBalance, 'currency')}
                    )
                  </li>
                );
              })}
            </ul>
          </Tabs>
        </div>
      </>
    );
  };

  const renderMonths = () => {
    return allocatedMonths?.map((item, index) => {
      return (
        <>
          <div className="row" key={item.month_year}>
            <div className="col-md-6 col-12" key={item.month_year}>
              <InputFormField
                id="BT-escrow-month-budgetAllocation"
                className="mt-1 hide-spinner">
                <label htmlFor="emailAddress">
                  Month
                  <br />
                  <input
                    className={
                      !index ? 'disabled form-control ' : 'form-control '
                    }
                    value={dayjs(item.month_year).format('MMMM YYYY')}
                    type="text"
                    readOnly
                  />
                </label>
              </InputFormField>
            </div>
            <div
              className="col-md-6 col-12 mt-1 mb-3"
              key={dayjs(item.month_year).format('MM/DD/YYYY')}>
              <InputFormField id="BT-escrow-numberFormat-budgetAllocation">
                <label htmlFor="amount"> amount </label>
                <div className="input-container">
                  <span
                    className={!index ? 'disabled input-icon ' : 'input-icon'}>
                    $
                  </span>

                  <NumberFormat
                    className={
                      !index ? 'disabled form-control' : 'form-control'
                    }
                    name={item.month_year}
                    defaultValue={item.escrow_allocated_converted_usd}
                    value={item.escrow_allocated_converted_usd}
                    placeholder={0}
                    onChange={(event) => handleOnChange(event, index)}
                    thousandSeparator
                    decimalScale={2}
                    allowNegative={!index}
                  />
                </div>
              </InputFormField>
            </div>
          </div>
        </>
      );
    });
  };

  const renderAddAnotherMonth = () => {
    return (
      <div className="row" key="ANOTHERMONTH001">
        <div className="col-12">
          <Button
            style={{ textTransform: 'uppercase' }}
            className={
              allocatedMonths?.length > 6 || selectedMarketplaceBalance < 0
                ? 'btn-add-contact  disabled'
                : 'btn-add-contact '
            }
            onClick={() => handleOnAddAnotherMonth()}>
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
    );
  };
  const renderErrorMessageBox = () => {
    return (
      <ErrorMsgBox className="mt-2">
        <img className="info-icon" src={InfoRedIcon} alt="info" />
        All budgets across the selected months need to add up to the available
        escrow balance
      </ErrorMsgBox>
    );
  };
  const renderModalFooter = () => {
    return (
      <div className="modal-footer">
        <div className="text-center ">
          <Button
            className={
              isEscrowBalanceExceed || isMonthlyDataLoading || isSubmitLoader
                ? 'btn-primary on-boarding  w-100 disabled'
                : 'btn-primary on-boarding  w-100'
            }
            onClick={() => submitAllocatedBudget()}
            type="button">
            {isApiCall ? <PageLoader color="#fff" type="button" /> : 'Confirm'}
          </Button>
        </div>
      </div>
    );
  };
  return (
    <>
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
          onClick={() => {
            onClick();
          }}
          role="presentation"
        />
        <ModalBox>
          <>
            {showEscrowMonthlyAllocation ? (
              <>
                <div className="modal-body pb-0">
                  <h4>Allocate Balance</h4>
                  {isDataLoading ? (
                    <PageLoader
                      component="modal"
                      type="page"
                      width={40}
                      height={40}
                      color="#FF5933"
                    />
                  ) : (
                    <div className="body-content mt-2">
                      <div className="row" key="renderBar00">
                        {renderAllocateBar()}
                        {escrowBalanceMarketplace?.length > 0
                          ? renderMarketplaceTab()
                          : null}
                      </div>
                      <div
                        className="row"
                        key="renderMonth00"
                        style={{ minHeight: '60px' }}>
                        {isMonthlyDataLoading ? (
                          <PageLoader
                            component="escrow-modal-loader"
                            color="#FF5933"
                            type="page"
                          />
                        ) : escrowBalanceMarketplace?.length > 0 ? (
                          <div className="col-12">
                            {renderMonths()}
                            {renderAddAnotherMonth()}
                            {isEscrowBalanceExceed
                              ? renderErrorMessageBox()
                              : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                {!isDataLoading ? (
                  <>
                    <div className="footer-line" />
                    {renderModalFooter()}
                  </>
                ) : null}
              </>
            ) : null}
            <EditMarketplaceAllocation
              id="marketplace-allocation"
              customerId={customerId}
              currencySymbol={currencySymbol}
              currentMonthYear={currentMonthYear}
              getActivityLogInfo={getActivityLogInfo}
              selectedMarketplace={selectedMarketplace}
              escrowBalanceMarketplace={escrowBalanceMarketplace}
              setEscrowBalanceMarketplace={setEscrowBalanceMarketplace}
              oldEscrowAllocation={oldEscrowAllocation}
              getEscrowBalanceMarketplace={getEscrowBalanceMarketplace}
              totalEscrowBalance={totalEscrowBalance}
              addThousandSeperator={addThousandSeperator}
              setIsDataLoading={setIsDataLoading}
              getDSPPacing={getDSPPacing}
              showMarketPlaceAllocation={showMarketPlaceAllocation}
              setShowMarketPlaceAllocation={setShowMarketPlaceAllocation}
              setShowEscrowMonthlyAllocation={setShowEscrowMonthlyAllocation}
            />
          </>
        </ModalBox>
      </Modal>
    </>
  );
}

EscrowBudgetAllocationModal.defaultProps = {
  id: '',
  customerId: '',
  marketplace: '',
  isOpen: false,
  onClick: () => {},
  getActivityLogInfo: () => {},
};

EscrowBudgetAllocationModal.propTypes = {
  id: string,
  customerId: string,
  marketplace: string,
  isOpen: bool,
  onClick: func,
  getActivityLogInfo: func,
};
