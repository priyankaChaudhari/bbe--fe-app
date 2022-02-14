import React, { useState, useCallback } from 'react';

import { arrayOf, bool, func, number, shape, string } from 'prop-types';

import { storeEscrowReallocation } from '../../../../api';
import { LeftArrowIcon } from '../../../../theme/images';
import { Button, PageLoader, Table, AllocateBar } from '../../../../common';

export default function ConfirmMarketPlaceAllocation({
  customerId,
  selectedMarketplace,
  currentMonthYear,
  currencySymbol,
  onClick,
  getActivityLogInfo,
  addThousandSeperator,
  totalEscrowBalance,
  escrowBalanceMarketplace,
  getEscrowBalanceMarketplace,
  setShowMarketPlaceAllocation,
  showConfirmMarketplaceAllocation,
  setShowConfirmMarketplaceAllocation,
  setShowEscrowMonthlyAllocation,
}) {
  const [isApiCall, setIsApiCall] = useState(false);

  const balanceChangeValue = (value, type = '') => {
    if (value && value !== null && value !== 0) {
      value = Number(value.toFixed(2));
      return `${value < 0 ? '-' : '+'}${
        type === 'currency' ? currencySymbol : ''
      }${value
        .toString()
        .replace('-', '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    return 0;
  };

  const submitEscrowReallocatedData = useCallback(
    (reallocatedData) => {
      setIsApiCall(true);
      const filteReallocatedData = reallocatedData.filter(
        (item, index) => index !== 0 && item.balanceChanged,
      );
      const tempData = [];
      filteReallocatedData.forEach((item) => {
        if (item?.balanceChanged > 0) {
          tempData.push({
            customer: `${customerId}`,
            month_year: `${currentMonthYear}`,
            from_marketplace: `${selectedMarketplace}`,
            to_marketplace: `${item.value}`,
            escrow_reallocated_amount_usd: Number(
              item.balanceChanged.toFixed(2),
            ),
          });
        }
        if (item?.balanceChanged < 0) {
          tempData.push({
            customer: `${customerId}`,
            month_year: `${currentMonthYear}`,
            from_marketplace: `${item.value}`,
            to_marketplace: `${selectedMarketplace}`,
            escrow_reallocated_amount_usd: Number(
              Math.abs(item.balanceChanged.toFixed(2)),
            ),
          });
        }
        return tempData;
      });
      storeEscrowReallocation(tempData).then((res) => {
        if (res && res.status === 201) {
          onClick();
          getActivityLogInfo();
          setShowConfirmMarketplaceAllocation(false);
          setShowEscrowMonthlyAllocation(true);
          getEscrowBalanceMarketplace();
        }
        setIsApiCall(true);
      });
    },
    [
      currentMonthYear,
      customerId,
      getActivityLogInfo,
      getEscrowBalanceMarketplace,
      onClick,
      selectedMarketplace,
      setShowConfirmMarketplaceAllocation,
      setShowEscrowMonthlyAllocation,
    ],
  );
  const renderAllocateBar = () => {
    return (
      <div className="col-12">
        <AllocateBar id="BT-escrowBalance-DSPAllocaion" className="mt-3 mb-2">
          <div className="remaing-label text-bold text-right">
            Total Escrow Balance:&nbsp;
            {totalEscrowBalance === 0
              ? `$${totalEscrowBalance}`
              : addThousandSeperator(totalEscrowBalance, 'currency')}
          </div>
          <div className="clear-fix" />
        </AllocateBar>
      </div>
    );
  };
  const renderReallocationTableHead = () => {
    return (
      <thead>
        <tr>
          <th className="product-header" width="30%">
            Marketplace
          </th>
          <th className="product-header" width="25%">
            From
          </th>
          <th className="product-header" width="25%">
            To
          </th>
          <th className="product-header" width="20%">
            change
          </th>
        </tr>
      </thead>
    );
  };

  const renderReallocationTableBody = () => {
    const results = escrowBalanceMarketplace.filter(
      (item) => item.balanceChanged,
    );
    return (
      <tbody>
        {results?.map((item) => {
          return (
            <tr key={item.key}>
              <td
                width="30%"
                className="small-label-text light-font product-body">
                {item.label}
              </td>
              <td
                width="25%"
                className=" small-label-text light-font product-body">
                ${item.escrowBalance}
              </td>
              <td
                width="25%"
                className=" small-label-text light-font product-body">
                ${item.escrowReallocatedBalance}
              </td>
              <td
                width="20%"
                className=" small-label-text light-font product-body">
                {item.balanceChanged === 0
                  ? `$0`
                  : balanceChangeValue(item.balanceChanged, 'currency')}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };
  const renderReallocationDesktopView = () => {
    return (
      <Table style={{ borderCollapse: 'collapse' }} width="100%">
        {renderReallocationTableHead()}
        {renderReallocationTableBody()}
      </Table>
    );
  };
  const renderReallocationMobileView = () => {
    const results = escrowBalanceMarketplace.filter(
      (item) => item.balanceChanged,
    );
    return results?.map((item) => {
      return (
        <>
          <div className="row mt-3 mb-3" key={item.key}>
            <div className="col-12 mb-2">
              <div className="label">Marketplace</div>
              <div className="label-info">{item.label}</div>
            </div>
            <div className="col-4">
              <div className="label">From</div>
              <div className="label-info"> ${item.escrowBalance}</div>
            </div>
            <div className="col-4">
              <div className="label">To</div>
              <div className="label-info">${item.escrowReallocatedBalance}</div>
            </div>
            <div className="col-4">
              <div className="label">Change</div>
              <div className="label-info">
                {item.balanceChanged === 0
                  ? `$0`
                  : balanceChangeValue(item.balanceChanged, 'currency')}
              </div>
            </div>
          </div>
        </>
      );
    });
  };
  const renderReallocatedBalanceTable = () => {
    return (
      <>
        <div className="d-md-block d-none">
          {renderReallocationDesktopView()}
        </div>
        <div className="d-md-none d-block">
          {renderReallocationMobileView()}
        </div>
      </>
    );
  };
  return (
    <>
      {showConfirmMarketplaceAllocation ? (
        <>
          <div className="modal-body  pb-0">
            <h4>
              <img
                className="modal-back-arrow"
                src={LeftArrowIcon}
                alt="close"
                onClick={() => {
                  setShowMarketPlaceAllocation(true);
                  setShowConfirmMarketplaceAllocation(false);
                }}
                role="presentation"
              />
              Allocate Balance
            </h4>
            <div className="body-content mt-2">
              <p className="normal-text-black mb-0">
                Please confirm you wish to make the following changes. A
                confirmation email will be sent to the BGS, BGS Manager, DSP Ad
                Manager.
              </p>
              <div className="row">
                {renderAllocateBar()}
                <div className="col-12">{renderReallocatedBalanceTable()}</div>
              </div>
            </div>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="text-center ">
              <Button
                className="btn-primary on-boarding w-100"
                type="button"
                onClick={() => {
                  submitEscrowReallocatedData(escrowBalanceMarketplace);
                }}>
                {isApiCall ? (
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
  );
}

ConfirmMarketPlaceAllocation.defaultProps = {
  customerId: '',
  selectedMarketplace: '',
  currencySymbol: '',
  currentMonthYear: '',
  totalEscrowBalance: number,
  onClick: () => {},
  getActivityLogInfo: () => {},
  addThousandSeperator: () => {},
  escrowBalanceMarketplace: [],
  getEscrowBalanceMarketplace: () => {},
  setShowMarketPlaceAllocation: func,
  showConfirmMarketplaceAllocation: bool,
  setShowConfirmMarketplaceAllocation: func,
  setShowEscrowMonthlyAllocation: func,
};

ConfirmMarketPlaceAllocation.propTypes = {
  customerId: string,
  selectedMarketplace: string,
  currencySymbol: string,
  currentMonthYear: string,
  totalEscrowBalance: number,
  addThousandSeperator: func,
  onClick: func,
  getActivityLogInfo: func,
  escrowBalanceMarketplace: arrayOf(shape()),
  getEscrowBalanceMarketplace: func,
  setShowMarketPlaceAllocation: func,
  showConfirmMarketplaceAllocation: bool,
  setShowConfirmMarketplaceAllocation: func,
  setShowEscrowMonthlyAllocation: func,
};
