import React, { useState, useCallback } from 'react';

import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { bool, func, shape, string } from 'prop-types';
import dayjs from 'dayjs';

import EditMarketplaceAllocationModal from './EditMarketplaceAllocationModal';
import { storeAllocatedBudget } from '../../../../api';
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
import { escrowMarketplaceTabs } from '../../../../constants';

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

export default function EscrowBudgetAllocationModalCopy({
  id,
  dspData,
  addThousandSeperator,
  isOpen,
  onClick,
  customerId,
  marketplace,
  getActivityLogInfo,
}) {
  const currentDate = new Date();
  currentDate.setDate(1);
  currentDate.setHours(currentDate.getHours() + 12);

  const dspPacing = dspData?.dsp_pacing;
  const escrowBalance = dspPacing?.escrow_converted_usd
    ? dspPacing?.escrow_converted_usd
    : 0;
  const actualAllocatedMonths = dspPacing?.allocated_balance.length
    ? dspPacing?.allocated_balance
    : [
        {
          month_year: dayjs(currentDate).format('YYYY-MM-DD'),
          escrow_allocated_converted_usd: escrowBalance,
        },
      ];
  const [allocatedMonths, setAllocatedMonths] = useState(actualAllocatedMonths);
  const [isSubmitLoader, setIsSubmitLoader] = useState(false);
  const [isEscrowbalanceExceed, setIsEscrowbalanceExceed] = useState(
    escrowBalance < 0,
  );

  const [viewMarketplace, setViewMarketplace] = useState('US');
  const [
    showMarketPlaceAllocationModal,
    setShowMarketPlaceAllocationModal,
  ] = useState(false);

  const submitAllocatedBudget = useCallback(() => {
    setIsSubmitLoader(true);
    storeAllocatedBudget(allocatedMonths, customerId, marketplace).then(
      (res) => {
        if (res && res.status === 200) {
          onClick();
          getActivityLogInfo();
        }
        setIsSubmitLoader(false);
      },
    );
  }, [onClick, customerId, marketplace, allocatedMonths, getActivityLogInfo]);

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
    const currentMonthAmount = escrowBalance - sumOfFutureMonths;
    tempData[0].escrow_allocated_converted_usd = String(
      currentMonthAmount.toFixed(2),
    );
    if (currentMonthAmount < 0) setIsEscrowbalanceExceed(true);
    else setIsEscrowbalanceExceed(false);
    setAllocatedMonths(tempData);
  };

  const renderEditMarketPlaceAllocationModal = () => {
    return (
      <EditMarketplaceAllocationModal
        id="marketplace-allocation"
        customerId={customerId}
        marketplace={marketplace}
        dspData={dspData}
        isOpen={showMarketPlaceAllocationModal}
        addThousandSeperator={addThousandSeperator}
        onClick={() => {
          setShowMarketPlaceAllocationModal(false);
        }}
        getActivityLogInfo={getActivityLogInfo}
      />
    );
  };
  const renderMarketplaceTab = () => {
    return (
      <>
        <div className="col-12 mt-3">
          <Tabs>
            <ul className="tabs scrollable-container ">
              {escrowMarketplaceTabs.map((item) => {
                return (
                  <li
                    key={item.key}
                    className={
                      viewMarketplace === item.key
                        ? 'active scrollable-tab  mt-1'
                        : ' scrollable-tab mt-1  '
                    }
                    onClick={() => {
                      setViewMarketplace(item.key);
                    }}
                    role="presentation">
                    {item.key} (${item.budget})
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
    return allocatedMonths.map((item, index) => {
      return (
        <React.Fragment key={item.month_year}>
          <div className="col-md-6 col-12 ">
            <InputFormField
              id="BT-escrow-month-budgetAllocaion"
              className="mt-1 hide-spinner">
              <label htmlFor="emailAddress">
                Month
                <br />
                <input
                  className={
                    !index ? ' disabled form-control ' : 'form-control '
                  }
                  value={dayjs(item.month_year).format('MMMM YYYY')}
                  type="text"
                  readOnly
                />
              </label>
            </InputFormField>
          </div>
          <div className="col-md-6 col-12 mt-1 mb-3">
            <InputFormField id="BT-escrow-numberFormat-budgetAllocaion">
              <label htmlFor="amount"> amount </label>
              <div className="input-container  ">
                <span
                  className={!index ? ' disabled input-icon ' : 'input-icon  '}>
                  $
                </span>

                <NumberFormat
                  className={
                    !index ? ' disabled form-control' : ' form-control'
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
            setAllocatedMonths(actualAllocatedMonths);
          }}
          role="presentation"
        />

        <ModalBox>
          <div className="modal-body  pb-0">
            <h4>Allocate Balance</h4>
            <div className="body-content mt-2">
              <div className="row">
                <div className="col-12">
                  <AllocateBar
                    id="BT-escrowBalance-budgetAllocaion"
                    className="mt-3 mb-3">
                    {' '}
                    <div className="row">
                      <div className="col-md-7 ">
                        {' '}
                        <div className="remaing-label text-bold text-right">
                          Total Escrow Balance:{' '}
                          {addThousandSeperator(escrowBalance, 'currency')}
                        </div>
                      </div>
                      <div className="col-md-5 ">
                        {' '}
                        <div className="remaing-label text-bold ">
                          <div
                            className="edit-marketplace cursor text-medium"
                            role="presentation"
                            onClick={() =>
                              setShowMarketPlaceAllocationModal(true)
                            }>
                            Edit marketplace Allocation{' '}
                            <img
                              width="16px"
                              className="orange-left-arrow "
                              src={LeftArrowIcon}
                              alt=""
                            />
                          </div>
                          {/* <div className="clear-fix" /> */}
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
                      allocatedMonths.length > 6 || escrowBalance < 0
                        ? 'btn-add-contact  disabled'
                        : 'btn-add-contact '
                    }
                    onClick={() => handleOnAddAnotherMonth()}>
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
              {isEscrowbalanceExceed ? (
                <ErrorMsgBox className="mt-2">
                  <img className="info-icon" src={InfoRedIcon} alt="info" /> All
                  budgets across the selected months need to add up to the
                  available escrow balance
                </ErrorMsgBox>
              ) : null}
            </div>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="text-center ">
              <Button
                className={
                  isEscrowbalanceExceed || isSubmitLoader
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
        </ModalBox>
      </Modal>{' '}
      {renderEditMarketPlaceAllocationModal()}
    </>
  );
}

EscrowBudgetAllocationModalCopy.defaultProps = {
  id: '',
  customerId: '',
  marketplace: '',
  isOpen: false,
  dspData: {},
  onClick: () => {},
  addThousandSeperator: () => {},
  getActivityLogInfo: () => {},
};

EscrowBudgetAllocationModalCopy.propTypes = {
  id: string,
  customerId: string,
  marketplace: string,
  isOpen: bool,
  dspData: shape({}),
  onClick: func,
  addThousandSeperator: func,
  getActivityLogInfo: func,
};
