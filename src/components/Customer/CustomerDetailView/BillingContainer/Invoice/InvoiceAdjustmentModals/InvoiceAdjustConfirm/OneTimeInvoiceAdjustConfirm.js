import React from 'react';

import { arrayOf, number, string } from 'prop-types';
import numberWithCommas from '../../../../../../../hooks/numberWithComas';

const OneTimeInvoiceAdjustConfirm = ({
  adjustmentData,
  totalCurrentBudget,
  totalNewBudget,
  totalChangeAmount,
}) => {
  const renderResponsiveView = () => {
    return (
      <div className="d-md-none d-block">
        {adjustmentData &&
          adjustmentData.length > 0 &&
          adjustmentData.map((item) => {
            const textClass =
              item.change && item.change !== 0
                ? 'normal-text text-bold'
                : 'gray-normal-text';
            return (
              <>
                <div className="row">
                  <div className="col-12 text-left">
                    <div className="label">Marketplace</div>
                    <div className={textClass}>{item.marketplace}</div>
                  </div>

                  <div className="col-4 text-left">
                    <div className="label">Existing Budget</div>
                    <div className={textClass}>
                      ${numberWithCommas(item.old_budget)}
                    </div>
                  </div>
                  <div className="col-4 text-left">
                    <div className="label">To</div>
                    <div className={textClass}>
                      $
                      {item.newAmount
                        ? item.newAmount
                        : numberWithCommas(item.old_budget)}
                    </div>
                  </div>
                </div>
                <div className=" straight-line horizontal-line mt-2 mb-2 " />
              </>
            );
          })}

        <div className="row">
          <div className="col-12 text-left">
            <div className="label text-bold"> </div>
            <div className="normal-text text-bold">One-time invoice</div>
          </div>

          <div className="col-4 text-left">
            <div className="label">Existing budget</div>
            <div className="gray-normal-text">
              ${numberWithCommas(totalCurrentBudget)}
            </div>
          </div>
          <div className="col-4 text-left">
            <div className="label">Additional Budget</div>
            <div className="gray-normal-text">{totalChangeAmount}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderDesktopView = () => {
    return (
      <div className="d-md-block d-none">
        <div className="row">
          <div className="col-4 text-left">
            <div className="label">Marketplace</div>
          </div>
          <div className="col-4 text-left">
            <div className="label">Exisiting Budget</div>
          </div>
          <div className="col-4 text-left">
            <div className="label">Additional amount</div>
          </div>
        </div>
        <div className=" straight-line horizontal-line pt-1 mb-2 " />

        {adjustmentData &&
          adjustmentData.length > 0 &&
          adjustmentData.map((item) => {
            console.log(
              '---',
              item.newAmount,
              numberWithCommas(item.old_budget),
            );
            const textClass =
              item.change && item.change !== 0
                ? 'normal-text text-bold'
                : 'gray-normal-text';
            return (
              <div className="row mt-1">
                <div className="col-4 text-left">
                  <div className={textClass}>{item.marketplace}</div>
                </div>
                <div className="col-4 text-left">
                  <div className={textClass}>
                    ${numberWithCommas(item.old_budget)}
                  </div>
                </div>
                <div className="col-4 text-left">
                  <div className={textClass}>
                    {!item.newAmount || item.newAmount === 0
                      ? '-'
                      : `$${item.newAmount}`}
                  </div>
                </div>
              </div>
            );
          })}

        <div className=" straight-line horizontal-line pt-1 mb-2 " />
        <div className="row">
          <div className="col-4 text-left">
            <div className="normal-text text-bold">One-time invoice</div>
          </div>
          <div className="col-4 text-left" />
          <div className="col-4 text-left">
            <div className="normal-text text-bold">
              ${numberWithCommas(totalNewBudget)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderDesktopView()}
      {renderResponsiveView()}
    </>
  );
};

export default OneTimeInvoiceAdjustConfirm;

OneTimeInvoiceAdjustConfirm.defaultProps = {
  adjustmentData: [],
};

OneTimeInvoiceAdjustConfirm.propTypes = {
  adjustmentData: arrayOf(Array),
  totalCurrentBudget: number.isRequired,
  totalNewBudget: number.isRequired,
  totalChangeAmount: string.isRequired,
};
