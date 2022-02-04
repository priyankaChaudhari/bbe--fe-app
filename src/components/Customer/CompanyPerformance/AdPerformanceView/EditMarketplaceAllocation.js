import React, { useState } from 'react';

import NumberFormat from 'react-number-format';
import { bool, func, shape, string } from 'prop-types';
// import dayjs from 'dayjs';

// import { storeAllocatedBudget } from '../../../../api';
import { LeftArrowIcon } from '../../../../theme/images';
import {
  Button,
  InputFormField,
  // PageLoader,
  AllocateBar,
} from '../../../../common';
import ConfirmMarketPlaceAllocation from './ConfirmMarketPlaceAllocation';

export default function EditMarketplaceAllocation({
  customerId,
  currencySymbol,
  selectedMarketplace,
  escrowMarketplaceData,
  addThousandSeperator,
  showMarketPlaceAllocation,
  setShowMarketPlaceAllocation,
  setShowEscrowMonthlyAllocation,
}) {
  const [isAllowToContinue, setIsAllowToContinue] = useState(false);
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
      escrow_allocated_converted_usd: 12000,
      new_escrow_allocated_converted_usd: 12000,
      balanceChanged: 0,
    },
    {
      marketplace: 'Canada',
      label: 'CAD',
      value: 'Amazon.ca',
      escrow_allocated_converted_usd: 14000,
      new_escrow_allocated_converted_usd: 14000,
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
      escrow_allocated_converted_usd: 8800,
      new_escrow_allocated_converted_usd: 8800,
      balanceChanged: 0,
    },
  ]);

  const escrowBalance = escrowMarketplaceData?.dsp_pacing?.escrow_converted_usd
    ? escrowMarketplaceData?.dsp_pacing?.escrow_converted_usd
    : 0;

  const handleOnChange = (event, index) => {
    const tempData = [...allocatedMarketplaceBalance];
    const newAllocatedBalance = event.target.value.replace(/,/g, '');
    const oldEscrowBalance = tempData[index].escrow_allocated_converted_usd;
    let newEscrowBalance = '';
    if (newAllocatedBalance === '' || newAllocatedBalance === null) {
      newEscrowBalance = oldEscrowBalance;
      setIsAllowToContinue(false);
    } else {
      newEscrowBalance = newAllocatedBalance;
      setIsAllowToContinue(true);
    }
    const balanceChanged = newEscrowBalance - oldEscrowBalance;
    tempData[index].balanceChanged = balanceChanged;
    tempData[index].new_escrow_allocated_converted_usd = newEscrowBalance;
    setAllocatedMarketPlaceBalance(tempData);
  };
  const renderMarketplace = () => {
    const getIndex = allocatedMarketplaceBalance.findIndex(
      (item) => item.value === selectedMarketplace,
    );
    if (getIndex >= 0) {
      let numberOfDeletedElm = 1;
      const obj = allocatedMarketplaceBalance.splice(
        getIndex,
        numberOfDeletedElm,
      )[0];
      numberOfDeletedElm = 0;
      allocatedMarketplaceBalance.splice(0, numberOfDeletedElm, obj);
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
                  // value={item.new_escrow_allocated_converted_usd}
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
                      {addThousandSeperator(escrowBalance, 'currency')}
                    </div>{' '}
                    <div className="clear-fix" />
                  </AllocateBar>
                </div>
              </div>
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
          escrowBalance={escrowBalance}
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
  escrowMarketplaceData: {},
  addThousandSeperator: () => {},
  showMarketPlaceAllocation: bool,
  setShowMarketPlaceAllocation: () => {},
  setShowEscrowMonthlyAllocation: () => {},
};

EditMarketplaceAllocation.propTypes = {
  customerId: string,
  currencySymbol: string,
  selectedMarketplace: string,
  escrowMarketplaceData: shape({}),
  addThousandSeperator: func,
  showMarketPlaceAllocation: bool,
  setShowMarketPlaceAllocation: func,
  setShowEscrowMonthlyAllocation: func,
};
