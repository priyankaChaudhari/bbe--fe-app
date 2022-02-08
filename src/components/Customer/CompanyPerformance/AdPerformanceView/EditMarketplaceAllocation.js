import React, { useState } from 'react';

import NumberFormat from 'react-number-format';
import { bool, func, number, string } from 'prop-types';

import { InfoRedIcon, LeftArrowIcon } from '../../../../theme/images';
import {
  Button,
  InputFormField,
  // PageLoader,
  AllocateBar,
  ErrorMsgBox,
} from '../../../../common';
import ConfirmMarketPlaceAllocation from './ConfirmMarketPlaceAllocation';

export default function EditMarketplaceAllocation({
  customerId,
  currencySymbol,
  selectedMarketplace,
  // escrowMarketplaceData,
  totalEscrowBalance,
  addThousandSeperator,
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
  const [
    allocatedMarketplaceBalance,
    setAllocatedMarketPlaceBalance,
  ] = useState([
    {
      marketplace: 'United States',
      label: 'US',
      value: 'Amazon.com',
      escrow_allocated_converted_usd: 10000,
      new_escrow_allocated_converted_usd: 10000,
      balanceChanged: 0,
    },
    {
      marketplace: 'United Kingdom',
      label: 'UK',
      value: 'Amazon.co.uk',
      escrow_allocated_converted_usd: 4000,
      new_escrow_allocated_converted_usd: 4000,
      balanceChanged: 0,
    },
    {
      marketplace: 'United Arab Emirates (U.A.E.)',
      label: 'UAE',
      value: 'Amazon.ae',
      escrow_allocated_converted_usd: 2000,
      new_escrow_allocated_converted_usd: 2000,
      balanceChanged: 0,
    },
    {
      marketplace: 'Canada',
      label: 'CAD',
      value: 'Amazon.ca',
      escrow_allocated_converted_usd: 1000,
      new_escrow_allocated_converted_usd: 1000,
      balanceChanged: 0,
    },
    {
      marketplace: 'Australia',
      label: 'AUS',
      value: 'Amazon.com.au',
      escrow_allocated_converted_usd: 4000,
      new_escrow_allocated_converted_usd: 4000,
      balanceChanged: 0,
    },
    {
      marketplace: 'Mexico',
      label: 'MX',
      value: 'Amazon.com.mx',
      escrow_allocated_converted_usd: 6000,
      new_escrow_allocated_converted_usd: 6000,
      balanceChanged: 0,
    },
    {
      marketplace: 'Japan',
      label: 'JP',
      value: 'Amazon.co.jp',
      escrow_allocated_converted_usd: 3000,
      new_escrow_allocated_converted_usd: 3000,
      balanceChanged: 0,
    },
  ]);

  // const escrowBalance = escrowMarketplaceData?.dsp_pacing?.escrow_converted_usd
  //   ? escrowMarketplaceData?.dsp_pacing?.escrow_converted_usd
  //   : 0;
  const calculateSumOfNewEscrowBalance = (newValues) => {
    const sumAll = newValues
      .map(
        (item, index) => index !== 0 && item.new_escrow_allocated_converted_usd,
      )
      .reduce((prev, curr) => Number(prev) + Number(curr), 0);
    return sumAll;
  };

  const handleOnChange = (event, index) => {
    const tempData = [...allocatedMarketplaceBalance];
    const newAllocatedBalance = event.target.value.replace(/,/g, '');
    const oldEscrowBalance = tempData[index].escrow_allocated_converted_usd;
    let newEscrowBalance = '';
    if (newAllocatedBalance === '' || newAllocatedBalance === null) {
      setIsAllowToContinue(false);
    } else {
      newEscrowBalance = newAllocatedBalance;
      setIsAllowToContinue(true);
    }

    const balanceChanged = newEscrowBalance - oldEscrowBalance;
    tempData[index].balanceChanged = balanceChanged;
    tempData[index].new_escrow_allocated_converted_usd = newEscrowBalance;

    const sumOfNewEscrowBalance = calculateSumOfNewEscrowBalance(tempData);
    const newSelectedMarketplaceBalance =
      totalEscrowBalance - sumOfNewEscrowBalance;

    tempData[0].new_escrow_allocated_converted_usd = String(
      newSelectedMarketplaceBalance.toFixed(2),
    );
    tempData[0].balanceChanged =
      newSelectedMarketplaceBalance -
      tempData[0].escrow_allocated_converted_usd;
    if (newSelectedMarketplaceBalance < 0) {
      setIsEscrowBalanceExceed(true);
      setIsAllowToContinue(false);
    } else setIsEscrowBalanceExceed(false);
    setAllocatedMarketPlaceBalance(tempData);
  };

  const renderMarketplace = () => {
    const getIndex = allocatedMarketplaceBalance.findIndex(
      (item) => item.value === selectedMarketplace,
    );
    if (getIndex >= 0) {
      const splicedObj = allocatedMarketplaceBalance.splice(getIndex, 1)[0];
      allocatedMarketplaceBalance.splice(0, 0, splicedObj);
    }
    return allocatedMarketplaceBalance?.map((item, index) => {
      return (
        <div className="row" key={item.marketplace}>
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
                  name={item.marketplace}
                  defaultValue={item.escrow_allocated_converted_usd}
                  value={item.new_escrow_allocated_converted_usd}
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
                }}
                role="presentation"
              />
              Marketplace Allocation
            </h4>
            <div className="body-content mt-2">
              <div className="row">
                <div className="col-12 mb-2">
                  <AllocateBar
                    id="BT-escrowBalance-budgetAllocaion"
                    className="mt-3 mb-3">
                    {' '}
                    <div className="remaing-label text-bold text-right">
                      Total Escrow Balance:{' '}
                      {addThousandSeperator(totalEscrowBalance, 'currency')}
                    </div>{' '}
                    <div className="clear-fix" />
                  </AllocateBar>
                </div>
              </div>{' '}
              {isEscrowBalanceExceed ? (
                <ErrorMsgBox className="mt-2">
                  <img className="info-icon" src={InfoRedIcon} alt="info" /> All
                  budgets across the selected marketplaces need to add up to the
                  available escrow balance
                </ErrorMsgBox>
              ) : null}
              {renderMarketplace()}
            </div>
          </div>
          <div className="footer-line" />
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
        </>
      ) : (
        ''
      )}
      {showConfirmMarketplaceAllocation ? (
        <ConfirmMarketPlaceAllocation
          id="confirm-marketplace-allocation"
          customerId={customerId}
          currencySymbol={currencySymbol}
          selectedMarketplace={selectedMarketplace}
          addThousandSeperator={addThousandSeperator}
          totalEscrowBalance={totalEscrowBalance}
          allocatedMarketplaceBalance={allocatedMarketplaceBalance}
          setShowMarketPlaceAllocation={setShowMarketPlaceAllocation}
          showConfirmMarketplaceAllocation={showConfirmMarketplaceAllocation}
          setShowConfirmMarketplaceAllocation={
            setShowConfirmMarketplaceAllocation
          }
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
  selectedMarketplace: '',
  totalEscrowBalance: number,
  // escrowMarketplaceData: {},
  addThousandSeperator: () => {},
  showMarketPlaceAllocation: bool,
  setShowMarketPlaceAllocation: () => {},
  setShowEscrowMonthlyAllocation: () => {},
};

EditMarketplaceAllocation.propTypes = {
  customerId: string,
  currencySymbol: string,
  selectedMarketplace: string,
  totalEscrowBalance: number,
  // escrowMarketplaceData: shape({}),
  addThousandSeperator: func,
  showMarketPlaceAllocation: bool,
  setShowMarketPlaceAllocation: func,
  setShowEscrowMonthlyAllocation: func,
};
