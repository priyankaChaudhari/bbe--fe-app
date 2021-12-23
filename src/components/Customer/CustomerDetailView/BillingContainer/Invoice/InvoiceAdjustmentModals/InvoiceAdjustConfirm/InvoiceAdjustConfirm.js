import React from 'react';

import dayjs from 'dayjs';
import { arrayOf, func, shape, string } from 'prop-types';

import {
  ArrowRightBlackIcon,
  ArrowRightIcon,
  LeftArrowIcon,
} from '../../../../../../../theme/images';
import { ModalBox, Button, GreyCard } from '../../../../../../../common';
import numberWithCommas from '../../../../../../../hooks/numberWithComas';
import OneTimeInvoiceAdjustConfirm from './OneTimeInvoiceAdjustConfirm';

const InvoiceAdjustConfirm = ({
  onBackClick,
  adjustmentData,
  returnTotalAmount,
  selectedMonthYear,
  invoiceType,
  onApply,
}) => {
  const { totalCurrentBudget, totalNewBudget } = returnTotalAmount();

  const totalChangeAmount =
    totalNewBudget - totalCurrentBudget > 0
      ? `+$${numberWithCommas(Math.abs(totalCurrentBudget - totalNewBudget))}`
      : `-$${numberWithCommas(Math.abs(totalCurrentBudget - totalNewBudget))}`;

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
                    <div className="label">From</div>
                    <div className={textClass}>
                      ${numberWithCommas(item.old_budget)}
                    </div>
                  </div>
                  <div className="col-2 text-left">
                    <div className="mt-3">
                      <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                    </div>
                  </div>
                  <div className="col-3 text-left">
                    <div className="label">To</div>
                    <div className={textClass}>
                      $
                      {item.newAmount
                        ? item.newAmount
                        : numberWithCommas(item.old_budget)}
                    </div>
                  </div>
                  <div className="col-3 text-left">
                    <div className="label">Change</div>
                    <div className={textClass}>
                      {item.change
                        ? item.change === 0
                          ? '-'
                          : `$${numberWithCommas(item.change)}`
                        : '-'}
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
            <div className="normal-text text-bold">Total invoice</div>
          </div>

          <div className="col-4 text-left">
            <div className="label">From</div>
            <div className="gray-normal-text">
              ${numberWithCommas(totalCurrentBudget)}
            </div>
          </div>
          <div className="col-2 text-left">
            <div className="mt-3">
              <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
            </div>
          </div>
          <div className="col-3 text-left">
            <div className="label">To</div>
            <div className="gray-normal-text">
              ${numberWithCommas(totalNewBudget)}
            </div>
          </div>
          <div className="col-3 text-left">
            <div className="label">Change</div>
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
          <div className="col-3 text-left">
            <div className="label">From</div>
          </div>
          <div className="col-2 text-left">
            <div className="label">To</div>
          </div>
          <div className="col-3 text-left">
            <div className="label">Change</div>
          </div>
        </div>
        <div className=" straight-line horizontal-line pt-1 mb-2 " />

        {adjustmentData &&
          adjustmentData.length > 0 &&
          adjustmentData.map((item) => {
            const textClass =
              item.change && item.change !== 0
                ? 'normal-text text-bold'
                : 'gray-normal-text';
            return (
              <div key={item.id} className="row mt-1">
                <div className="col-4 text-left">
                  <div className={textClass}>{item.marketplace}</div>
                </div>
                <div className="col-2 text-left">
                  <div className={textClass}>
                    ${numberWithCommas(item.old_budget)}
                  </div>
                </div>
                <div className="col-1 text-left">
                  <div className={textClass}>
                    <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
                  </div>
                </div>
                <div className="col-2 text-left">
                  <div className={textClass}>
                    $
                    {item.newAmount
                      ? item.newAmount
                      : numberWithCommas(item.old_budget)}
                  </div>
                </div>
                <div className="col-3 text-left">
                  <div className={textClass}>
                    {item.change
                      ? item.change === 0
                        ? '-'
                        : `$${numberWithCommas(item.change)}`
                      : '-'}
                  </div>
                </div>
              </div>
            );
          })}

        <div className=" straight-line horizontal-line pt-1 mb-2 " />
        <div className="row">
          <div className="col-4 text-left">
            <div className="normal-text text-bold">Total invoice</div>
          </div>
          <div className="col-2 text-left">
            <div className="normal-text text-bold">
              ${numberWithCommas(totalCurrentBudget)}
            </div>
          </div>
          <div className="col-1 text-left">
            <div className="normal-text">
              <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
            </div>
          </div>
          <div className="col-2 text-left">
            <div className="normal-text text-bold">
              ${numberWithCommas(totalNewBudget)}
            </div>
          </div>
          <div className="col-3 text-left">
            <div className="normal-text text-bold"> {totalChangeAmount}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ModalBox>
        <div className="modal-body pb-0 ">
          <h4>
            <img
              role="presentation"
              onClick={onBackClick}
              className="modal-back-arrow"
              src={LeftArrowIcon}
              alt="back-arrow"
            />
            Invoice Adjustment
          </h4>
          <p className="normal-text">
            The following proposal will be send to &#60;brand partner&#62; for
            approval:
          </p>
          <div className=" straight-line horizontal-line pt-1 mb-2 " />
          {invoiceType !== 'one time' ? (
            <>
              {renderDesktopView()}
              {renderResponsiveView()}
            </>
          ) : (
            <OneTimeInvoiceAdjustConfirm
              adjustmentData={adjustmentData}
              totalCurrentBudget={totalCurrentBudget}
              totalNewBudget={totalNewBudget}
              totalChangeAmount={totalChangeAmount}
            />
          )}
          <div className=" straight-line horizontal-line mt-2 mb-2 " />
          <p className="normal-text">
            The new invoice amount willbe available to spend from{' '}
            <b>{selectedMonthYear?.value.split(' ')[0]} onwards.</b>
            <br /> The first bill for this amount will be sent{' '}
            {dayjs(selectedMonthYear?.value)
              .subtract(1, 'M')
              .format('MMMM')}{' '}
            13.
          </p>
          {invoiceType === 'permanent' && (
            <GreyCard className="yellow-card">
              <p className="normal-text text-bold m-0">
                Additional DSP invoice (
                {dayjs(selectedMonthYear?.value)
                  .subtract(1, 'M')
                  .format('MMMM')}{' '}
                only)
              </p>
              <p className="normal-text text-bold mb-0 mt-1">
                {' '}
                {totalChangeAmount.replace('+', '')}
              </p>
              <p className="normal-text mb-0 mt-1">
                The will be a one-off invoice, providing additional budget to
                spend in{' '}
                <b>
                  {dayjs(selectedMonthYear?.value)
                    .subtract(1, 'M')
                    .format('MMMM')}
                </b>
                . This invoice will be sent as soon as brand partner approves
                the proposal.
              </p>
            </GreyCard>
          )}
        </div>

        <div className="footer-line" />
        <div className="modal-footer">
          <Button
            onClick={onApply}
            type="button"
            className="btn-primary on-boarding   w-100">
            Confirm and send for approval
          </Button>
        </div>
      </ModalBox>
    </>
  );
};

export default InvoiceAdjustConfirm;

InvoiceAdjustConfirm.defaultProps = {
  onBackClick: () => {},
  adjustmentData: [],
  returnTotalAmount: () => {},
  selectedMonthYear: {},
  onApply: () => {},
};

InvoiceAdjustConfirm.propTypes = {
  onBackClick: func,
  returnTotalAmount: func,
  adjustmentData: arrayOf(Array),
  selectedMonthYear: shape({}),
  invoiceType: string.isRequired,
  onApply: func,
};
