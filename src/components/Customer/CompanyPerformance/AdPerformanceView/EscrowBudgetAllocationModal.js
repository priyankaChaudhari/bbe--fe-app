import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';

import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { bool, func, shape, string, arrayOf } from 'prop-types';
import dayjs from 'dayjs';

import EditMarketplaceAllocation from './EditMarketplaceAllocation';
import { getDspPacingData, storeAllocatedBudget } from '../../../../api';
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
  addThousandSeperator,
  isOpen,
  onClick,
  customerId,
  marketplace,
  getActivityLogInfo,
  marketplaceOptions,
}) {
  const mounted = useRef(false);
  const currentDate = useMemo(() => {
    return new Date();
  }, []);
  const currencySymbol = '$';
  currentDate.setDate(1);
  currentDate.setHours(currentDate.getHours() + 12);
  const [escrowMarketplaceData, setEscrowMarketplaceData] = useState({});
  const [selectedMarketplace, setSelectedMarketplace] = useState(marketplace);
  const [totalEscrowBalance, setTotalEscrowBalance] = useState(0);

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
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitLoader, setIsSubmitLoader] = useState(false);
  const [isEscrowBalanceExceed, setIsEscrowBalanceExceed] = useState(
    totalEscrowBalance < 0,
  );
  const getDSPPacing = useCallback(
    (currentMarketplace) => {
      setIsDataLoading(true);

      getDspPacingData(customerId, currentMarketplace).then((res) => {
        if (mounted.current) {
          if (res && res.status === 200) {
            setEscrowMarketplaceData(res?.data);
            const dspPacing = res?.data?.dsp_pacing;
            const currentEscrowBalance = dspPacing?.escrow_converted_usd
              ? dspPacing?.escrow_converted_usd
              : 0;
            setTotalEscrowBalance(30000);
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
          setIsDataLoading(false);
        }
      });
    },
    [currentDate, customerId],
  );
  const submitAllocatedBudget = useCallback(() => {
    setIsSubmitLoader(true);
    storeAllocatedBudget(allocatedMonths, customerId, marketplace).then(
      (res) => {
        if (mounted.current) {
          if (res && res.status === 200) {
            onClick();
            getActivityLogInfo();
          }
          setIsSubmitLoader(false);
        }
      },
    );
  }, [onClick, customerId, marketplace, allocatedMonths, getActivityLogInfo]);
  useEffect(() => {
    mounted.current = true;
    getDSPPacing(selectedMarketplace);
    return () => {
      mounted.current = false;
    };
  }, [getDSPPacing, selectedMarketplace]);

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

  const renderMarketplaceTab = () => {
    const getIndex = marketplaceOptions.findIndex(
      (item) => item.value === selectedMarketplace,
    );
    if (getIndex >= 0) {
      const splicedObj = marketplaceOptions.splice(getIndex, 1)[0];
      marketplaceOptions.splice(0, 0, splicedObj);
    }
    return (
      <>
        <div className="col-12 mt-2 mb-3">
          <Tabs>
            <ul className="tabs scrollable-container" style={{ width: '100%' }}>
              {marketplaceOptions.map((item) => {
                return (
                  <li
                    key={item.label}
                    className={
                      selectedMarketplace === item.value
                        ? 'active scrollable-tab  mt-1'
                        : ' scrollable-tab mt-1  '
                    }
                    onClick={() => {
                      setSelectedMarketplace(item.value);
                      getDSPPacing(item.value);
                    }}
                    role="presentation">
                    {item.label}
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
        <React.Fragment key={item.month_year}>
          <div className="col-md-6 col-12">
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
          <div className="col-md-6 col-12 mt-1 mb-3">
            <InputFormField id="BT-escrow-numberFormat-budgetAllocation">
              <label htmlFor="amount"> amount </label>
              <div className="input-container">
                <span
                  className={!index ? 'disabled input-icon ' : 'input-icon'}>
                  $
                </span>

                <NumberFormat
                  className={!index ? 'disabled form-control' : 'form-control'}
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
        </React.Fragment>
      );
    });
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
                <div className="modal-body  pb-0">
                  <h4>Allocate Balance</h4>
                  {isDataLoading ? (
                    <PageLoader
                      component="Notes-modal-loader"
                      color="#FF5933"
                      type="page"
                    />
                  ) : (
                    <div className="body-content mt-2">
                      <div className="row">
                        <div className="col-12">
                          <AllocateBar
                            id="BT-escrowBalance-budgetAllocaion"
                            className="mt-3 mb-3">
                            <div className="row">
                              <div className="col-md-7 ">
                                <div className="remaing-label text-bold">
                                  Total Escrow Balance:
                                  {addThousandSeperator(
                                    selectedMarketplaceBalance,
                                    'currency',
                                  )}
                                </div>
                              </div>
                              <div className="col-md-5 ">
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
                                      className="orange-left-arrow "
                                      src={LeftArrowIcon}
                                      alt=""
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>{' '}
                            <div className="clear-fix" />
                          </AllocateBar>
                        </div>
                        {renderMarketplaceTab()}
                        {renderMonths()}
                        <div className="col-12">
                          <Button
                            style={{ textTransform: 'uppercase' }}
                            className={
                              allocatedMonths?.length > 6 ||
                              selectedMarketplaceBalance < 0
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
                      {isEscrowBalanceExceed ? (
                        <ErrorMsgBox className="mt-2">
                          <img
                            className="info-icon"
                            src={InfoRedIcon}
                            alt="info"
                          />{' '}
                          All budgets across the selected months need to add up
                          to the available escrow balance
                        </ErrorMsgBox>
                      ) : null}
                    </div>
                  )}
                </div>
                {!isDataLoading ? (
                  <>
                    <div className="footer-line" />
                    <div className="modal-footer">
                      <div className="text-center ">
                        <Button
                          className={
                            isEscrowBalanceExceed || isSubmitLoader
                              ? 'btn-primary on-boarding  w-100 disabled'
                              : 'btn-primary on-boarding  w-100'
                          }
                          onClick={() => submitAllocatedBudget()}
                          type="button">
                          {isSubmitLoader ? (
                            <PageLoader color="#fff" type="button" />
                          ) : (
                            'Confirm'
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
            <EditMarketplaceAllocation
              id="marketplace-allocation"
              customerId={customerId}
              currencySymbol={currencySymbol}
              selectedMarketplace={selectedMarketplace}
              marketplaceOptions={marketplaceOptions}
              escrowMarketplaceData={escrowMarketplaceData}
              totalEscrowBalance={totalEscrowBalance}
              addThousandSeperator={addThousandSeperator}
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
  addThousandSeperator: () => {},
  getActivityLogInfo: () => {},
  marketplaceOptions: [],
};

EscrowBudgetAllocationModal.propTypes = {
  id: string,
  customerId: string,
  marketplace: string,
  isOpen: bool,
  onClick: func,
  addThousandSeperator: func,
  getActivityLogInfo: func,
  marketplaceOptions: arrayOf(shape()),
};
