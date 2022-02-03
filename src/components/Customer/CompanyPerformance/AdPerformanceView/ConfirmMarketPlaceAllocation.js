import React from 'react';

import { arrayOf, bool, func, number, shape } from 'prop-types';

// import { storeAllocatedBudget } from '../../../../api';
import { LeftArrowIcon } from '../../../../theme/images';
import {
  Button,
  // PageLoader,
  Table,
  AllocateBar,
} from '../../../../common';

export default function ConfirmMarketPlaceAllocation({
  // customerId,
  // marketplace,
  escrowBalance,
  allocatedMarketplaceBalance,
  addThousandSeperator,
  setShowMarketPlaceAllocation,
  showConfirmMarketplaceAllocation,
  setShowConfirmMarketplaceAllocation,
}) {
  // const submitAllocatedBudget = useCallback(() => {
  //   setIsSubmitLoader(true);
  //   storeAllocatedBudget(allocatedMonths, customerId, marketplace).then(
  //     (res) => {
  //       if (res && res.status === 200) {
  //         onClick();
  //         getActivityLogInfo();
  //       }
  //       setIsSubmitLoader(false);
  //     },
  //   );
  // }, [onClick, customerId, marketplace, allocatedMonths, getActivityLogInfo]);
  const renderAllocatedBalanceTable = () => {
    return (
      <>
        {/* <div className="d-md-block d-none">
          <div className="row">
            <div className="col-3">
              <div className="label">Marketplace</div>
            </div>
            <div className="col-3">
              <div className="label">From</div>
            </div>
            <div className="col-3">
              <div className="label"> To</div>
            </div>
            <div className="col-3">
              <div className="label text-right">change</div>
            </div>
          </div>
          <div className="horizontal-line straight-line mt-2 mb-2" />
          <div className="row mt-3">
            <div className="col-3">
              <div className="normal-text-black "> US</div>
            </div>
            <div className="col-3">
              <div className="normal-text-black "> $6,000</div>
            </div>
            <div className="col-3">
              <div className="normal-text-black "> $6,000</div>
            </div>
            <div className="col-3">
              <div className="normal-text-black text-right"> $6,000</div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-3">
              <div className="normal-text-black "> US</div>
            </div>
            <div className="col-3">
              <div className="normal-text-black "> $6,000</div>
            </div>
            <div className="col-3">
              <div className="normal-text-black "> $6,000</div>
            </div>
            <div className="col-3">
              <div className="normal-text-black text-right"> $6,000</div>
            </div>
          </div>
        </div> */}
        <Table className="d-md-block d-none">
          <table style={{ borderCollapse: 'collapse' }} width="100%">
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
                <th className="product-header text-right" width="20%">
                  change
                </th>
              </tr>
            </thead>
            <tbody>
              {allocatedMarketplaceBalance?.map((item) => {
                return (
                  <tr key={item.marketplace}>
                    <td
                      width="30%"
                      className="small-label-text light-font product-body">
                      {item.label}
                    </td>
                    <td
                      width="25%"
                      className=" small-label-text light-font product-body">
                      ${item.escrow_allocated_converted_usd}
                    </td>
                    <td
                      width="25%"
                      className=" small-label-text light-font product-body">
                      ${item.new_escrow_allocated_converted_usd}
                    </td>
                    <td
                      width="20%"
                      className=" small-label-text light-font product-body text-right">
                      {item.balanceChanged === 0
                        ? `$0`
                        : addThousandSeperator(item.balanceChanged, 'currency')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Table>
        <div className="d-md-none d-block">
          <div className="row">
            <div className="col-12 mb-2">
              <div className="label">Marketplace</div>
              <div className="label-info"> US</div>
            </div>
            <div className="col-4">
              {' '}
              <div className="label"> From</div>
              <div className="label-info"> $6,000</div>
            </div>
            <div className="col-4">
              <div className="label"> To</div>
              <div className="label-info"> $6,000</div>
            </div>
            <div className="col-4">
              <div className="label"> change</div>
              <div className="label-info"> $6,000</div>
            </div>
          </div>
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
                Manager
              </p>
              <div className="row">
                <div className="col-12">
                  <AllocateBar
                    id="BT-escrowBalance-DSPAllocaion"
                    className="mt-3 mb-4">
                    <div className="remaing-label text-bold text-right">
                      Total Escrow Balance:{' '}
                      {addThousandSeperator(escrowBalance, 'currency')}
                    </div>
                    <div className="clear-fix" />
                  </AllocateBar>
                </div>
                <div className="col-12">{renderAllocatedBalanceTable()}</div>
              </div>
            </div>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="text-center ">
              <Button
                className="btn-primary on-boarding  w-100"
                type="button"
                onClick={() => {}}>
                Confirm
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
  // customerId: '',
  // marketplace: '',
  escrowBalance: number,
  allocatedMarketplaceBalance: [],
  // getActivityLogInfo: () => {},
  addThousandSeperator: () => {},
  setShowMarketPlaceAllocation: func,
  showConfirmMarketplaceAllocation: bool,
  setShowConfirmMarketplaceAllocation: func,
};

ConfirmMarketPlaceAllocation.propTypes = {
  // customerId: string,
  // marketplace: string,
  escrowBalance: number,
  allocatedMarketplaceBalance: arrayOf(shape()),
  addThousandSeperator: func,
  setShowMarketPlaceAllocation: func,
  showConfirmMarketplaceAllocation: bool,
  setShowConfirmMarketplaceAllocation: func,
};
