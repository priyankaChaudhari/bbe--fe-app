import React, { useState } from 'react';

import NumberFormat from 'react-number-format';
import { bool, func, number, string, arrayOf, shape } from 'prop-types';

import ConfirmMarketPlaceAllocation from './ConfirmMarketPlaceAllocation';
import { InfoRedIcon, LeftArrowIcon } from '../../../../theme/images';
import {
  Button,
  InputFormField,
  AllocateBar,
  ErrorMsgBox,
} from '../../../../common';

export default function EditMarketplaceAllocation({
  customerId,
  currencySymbol,
  currentMonthYear,
  selectedMarketplace,
  escrowBalanceMarketplace,
  setEscrowBalanceMarketplace,
  totalEscrowBalance,
  addThousandSeperator,
  setIsDataLoading,
  getEscrowBalanceMarketplace,
  showMarketPlaceAllocation,
  setShowMarketPlaceAllocation,
  setShowEscrowMonthlyAllocation,
}) {
  const [isAllowToContinue, setIsAllowToContinue] = useState(false);
  const [isEscrowBalanceExceed, setIsEscrowBalanceExceed] = useState(
    totalEscrowBalance < 0,
  );
  const [
    showConfirmMarketplaceAllocation,
    setShowConfirmMarketplaceAllocation,
  ] = useState(false);

  const calculateSumOfNewEscrowBalance = (newValues) => {
    const sumAll = newValues
      .map((item, index) => index !== 0 && item.escrowReallocatedBalance)
      .reduce((prev, curr) => Number(prev) + Number(curr), 0);
    return sumAll;
  };

  const handleOnChange = (event, index) => {
    const tempData = [...escrowBalanceMarketplace];
    const newAllocatedBalance = event.target.value.replace(/,/g, '');
    const oldEscrowBalance = tempData[index].escrowBalance;

    let newEscrowBalance = '';
    if (newAllocatedBalance === '' || newAllocatedBalance === null) {
      setIsAllowToContinue(false);
    } else {
      newEscrowBalance = newAllocatedBalance;
      setIsAllowToContinue(true);
    }

    const balanceChanged = newEscrowBalance - oldEscrowBalance;
    tempData[index].balanceChanged = balanceChanged;
    tempData[index].escrowReallocatedBalance = Number(newEscrowBalance);

    const sumOfNewEscrowBalance = calculateSumOfNewEscrowBalance(tempData);
    const updatedBalance = totalEscrowBalance - sumOfNewEscrowBalance;
    tempData[0].escrowReallocatedBalance = Number(updatedBalance.toFixed(2));
    tempData[0].balanceChanged = updatedBalance - tempData[0].escrowBalance;
    setEscrowBalanceMarketplace(tempData);
    if (updatedBalance < 0) {
      setIsEscrowBalanceExceed(true);
      setIsAllowToContinue(false);
    } else setIsEscrowBalanceExceed(false);
  };

  const renderAllocateBar = () => {
    return (
      <div className="col-12 mb-2">
        <AllocateBar
          id="BT-escrowBalance-budgetAllocaion"
          className="mt-3 mb-3">
          {' '}
          <div className="remaing-label text-bold text-right">
            Total Escrow Balance:&nbsp;
            {addThousandSeperator(totalEscrowBalance, 'currency')}
          </div>{' '}
          <div className="clear-fix" />
        </AllocateBar>
      </div>
    );
  };

  const renderMarketplace = () => {
    const getIndex = escrowBalanceMarketplace.findIndex(
      (item) => item.value === selectedMarketplace,
    );
    if (getIndex >= 0) {
      const splicedObj = escrowBalanceMarketplace.splice(getIndex, 1)[0];
      escrowBalanceMarketplace.splice(0, 0, splicedObj);
    }
    return escrowBalanceMarketplace?.map((item, index) => {
      return (
        <div className="row" key={item.key}>
          <div className="col-1 mt-4 pt-3">
            <p className="m-0 gray-normal-text">{item.label}</p>
          </div>
          <div className="col-11  mb-3">
            <InputFormField id="BT-escrow-numberFormat-budgetAllocation">
              <label htmlFor="amount"> amount </label>
              <div className="input-container ">
                <span
                  className={
                    selectedMarketplace === item.value
                      ? 'disabled input-icon'
                      : 'input-icon'
                  }>
                  $
                </span>
                <NumberFormat
                  className={
                    selectedMarketplace === item.value
                      ? ' disabled form-control'
                      : ' form-control'
                  }
                  name={item.lavel}
                  defaultValue={item.escrowBalance}
                  value={item.escrowReallocatedBalance}
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
      );
    });
  };
  const renderErrorMessageBox = () => {
    return (
      <ErrorMsgBox className="mt-2 mb-2">
        <img className="info-icon" src={InfoRedIcon} alt="info" /> All budgets
        across the selected marketplaces need to add up to the available escrow
        balance
      </ErrorMsgBox>
    );
  };
  const renderModalFooter = () => {
    return (
      <div className="modal-footer">
        <div className="text-center ">
          <Button
            className={
              isAllowToContinue
                ? 'btn-primary on-boarding w-100'
                : 'btn-primary on-boarding w-100 disabled'
            }
            onClick={() => {
              setShowConfirmMarketplaceAllocation(true);
              setShowMarketPlaceAllocation(false);
            }}
            type="button"
            role="presentation">
            Continue
          </Button>
        </div>
      </div>
    );
  };
  return (
    <>
      {showMarketPlaceAllocation ? (
        <>
          <div className="modal-body  pb-0">
            <h4>
              <img
                className="modal-back-arrow "
                src={LeftArrowIcon}
                alt="close"
                onClick={() => {
                  setShowMarketPlaceAllocation(false);
                  setShowEscrowMonthlyAllocation(true);
                  getEscrowBalanceMarketplace();
                  setIsAllowToContinue(false);
                }}
                role="presentation"
              />
              Marketplace Allocation
            </h4>
            <div className="body-content mt-2">
              <div className="row">{renderAllocateBar()}</div>
              {isEscrowBalanceExceed ? renderErrorMessageBox() : null}
              {renderMarketplace()}
            </div>
          </div>
          <div className="footer-line" />
          {renderModalFooter()}
        </>
      ) : (
        ''
      )}
      {showConfirmMarketplaceAllocation ? (
        <ConfirmMarketPlaceAllocation
          id="confirm-marketplace-allocation"
          customerId={customerId}
          currencySymbol={currencySymbol}
          currentMonthYear={currentMonthYear}
          selectedMarketplace={selectedMarketplace}
          addThousandSeperator={addThousandSeperator}
          setIsDataLoading={setIsDataLoading}
          totalEscrowBalance={totalEscrowBalance}
          escrowBalanceMarketplace={escrowBalanceMarketplace}
          getEscrowBalanceMarketplace={getEscrowBalanceMarketplace}
          setShowMarketPlaceAllocation={setShowMarketPlaceAllocation}
          showConfirmMarketplaceAllocation={showConfirmMarketplaceAllocation}
          setShowConfirmMarketplaceAllocation={
            setShowConfirmMarketplaceAllocation
          }
          setShowEscrowMonthlyAllocation={setShowEscrowMonthlyAllocation}
        />
      ) : (
        ''
      )}
    </>
  );
}

EditMarketplaceAllocation.defaultProps = {
  customerId: '',
  currencySymbol: '',
  currentMonthYear: '',
  selectedMarketplace: '',
  totalEscrowBalance: 0,
  escrowBalanceMarketplace: [],
  setEscrowBalanceMarketplace: () => {},
  setIsDataLoading: () => {},
  addThousandSeperator: () => {},
  getEscrowBalanceMarketplace: () => {},
  showMarketPlaceAllocation: bool,
  setShowMarketPlaceAllocation: () => {},
  setShowEscrowMonthlyAllocation: () => {},
};

EditMarketplaceAllocation.propTypes = {
  customerId: string,
  currencySymbol: string,
  currentMonthYear: string,
  selectedMarketplace: string,
  totalEscrowBalance: number,
  escrowBalanceMarketplace: arrayOf(shape()),
  setEscrowBalanceMarketplace: func,
  addThousandSeperator: func,
  setIsDataLoading: func,
  getEscrowBalanceMarketplace: func,
  showMarketPlaceAllocation: bool,
  setShowMarketPlaceAllocation: func,
  setShowEscrowMonthlyAllocation: func,
};
