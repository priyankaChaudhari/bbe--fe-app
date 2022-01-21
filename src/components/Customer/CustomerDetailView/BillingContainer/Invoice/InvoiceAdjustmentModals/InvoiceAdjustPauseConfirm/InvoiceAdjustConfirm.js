import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { arrayOf, func, number, shape, string } from 'prop-types';

import numberWithCommas from '../../../../../../../hooks/numberWithComas';
import OneTimeInvoiceAdjustConfirm from './OneTimeInvoiceAdjustConfirm';
import Theme from '../../../../../../../theme/Theme';
import {
  ArrowRightBlackIcon,
  ArrowRightIcon,
  EditOrangeIcon,
  LeftArrowIcon,
} from '../../../../../../../theme/images';
import {
  ModalBox,
  Button,
  GreyCard,
  ErrorMsgBox,
} from '../../../../../../../common';

const InvoiceAdjustConfirm = ({
  onBackClick,
  adjustmentData,
  returnTotalAmount,
  selectedMonthYear,
  invoiceType,
  onApply,
  today,
  dspContact,
  onEditDspContact,
}) => {
  const isPermanentAdditional = invoiceType === 'permanent additional';
  const [showError, setShoeError] = useState(false);
  const { totalCurrentBudget, totalNewBudget } = returnTotalAmount();

  useEffect(() => {
    if (isPermanentAdditional) {
      const isRecordExits = adjustmentData.filter((element) => {
        return element.change && element.change < 0;
      });
      if (isRecordExits.length) {
        setShoeError(true);
      }
    }
  }, [isPermanentAdditional, adjustmentData]);

  const returnInvoiceBillDate = () => {
    if (today > 10) {
      if (invoiceType === 'standard') {
        return `${dayjs(selectedMonthYear?.value)
          .subtract(1, 'M')
          .format('MMMM')}`;
      }
      if (
        dayjs(selectedMonthYear?.value).subtract(1, 'M').format('MMMM') ===
        dayjs().format('MMMM')
      ) {
        return `${dayjs(selectedMonthYear?.value).format('MMMM')}`;
      }
      return `${dayjs(selectedMonthYear?.value).format('MMMM')}`;
    }
    if (invoiceType === 'standard') {
      return `${dayjs(selectedMonthYear?.value)
        .subtract(1, 'M')
        .format('MMMM')}`;
    }
    if (
      dayjs(selectedMonthYear?.value).format('MMMM') !== dayjs().format('MMMM')
    ) {
      return `${dayjs(selectedMonthYear?.value).format('MMMM')}`;
    }
    return `${dayjs().format('MMMM')}`;
  };

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
                  <div className="col-12  text-left">
                    <div className="label">Marketplace</div>
                    <div className={textClass}>{item.marketplace}</div>
                  </div>

                  <div className="col-4 pr-2 text-left">
                    <div className="label">From</div>
                    <div className={textClass}>
                      ${numberWithCommas(item.new_budget)}
                    </div>
                  </div>
                  <div className="col-2 px-1 text-left">
                    <div className="mt-3">
                      <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                    </div>
                  </div>
                  <div className="col-3 px-1 text-left">
                    <div className="label">To</div>
                    <div className={textClass}>
                      $
                      {item.newAmount
                        ? item.newAmount
                        : numberWithCommas(item.new_budget)}
                    </div>
                  </div>
                  <div className="col-3 pl-1 text-left">
                    <div className="label">Change</div>
                    <div className={textClass}>
                      {item.change
                        ? item.change === 0
                          ? '-'
                          : item.change > 0
                          ? `+$${numberWithCommas(item.change)}`
                          : `-$${numberWithCommas(item.change).replace(
                              '-',
                              '',
                            )}`
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

          <div className="col-4 pr-2 text-left">
            <div className="label">From</div>
            <div className="gray-normal-text">
              ${numberWithCommas(totalCurrentBudget)}
            </div>
          </div>
          <div className="col-2 px-1 text-left">
            <div className="mt-3">
              <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
            </div>
          </div>
          <div className="col-3 px-1 text-left">
            <div className="label">To</div>
            <div className="gray-normal-text">
              ${numberWithCommas(totalNewBudget)}
            </div>
          </div>
          <div className="col-3 pl-1 text-left">
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
          <div className="col-4 pr-2 text-left">
            <div className="label">Marketplace</div>
          </div>
          <div className="col-3 px-1 text-left">
            <div className="label">From</div>
          </div>
          <div className="col-2 px-1 text-left">
            <div className="label">To</div>
          </div>
          <div className="col-3 pl-1 text-left">
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
                <div className="col-4 pr-2 text-left">
                  <div className={textClass}>{item.marketplace}</div>
                </div>
                <div className="col-2 px-1 text-left">
                  <div className={textClass}>
                    ${numberWithCommas(item.new_budget)}
                  </div>
                </div>
                <div className="col-1 px-1 text-left">
                  <div className={textClass}>
                    <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
                  </div>
                </div>
                <div className="col-2 px-1 text-left">
                  <div className={textClass}>
                    $
                    {item.newAmount
                      ? item.newAmount
                      : numberWithCommas(item.new_budget)}
                  </div>
                </div>
                <div className="col-3 pl-1 text-left">
                  <div className={textClass}>
                    {item.change
                      ? item.change === 0
                        ? '-'
                        : item.change > 0
                        ? `+$${numberWithCommas(item.change)}`
                        : `-$${numberWithCommas(item.change).replace('-', '')}`
                      : '-'}
                  </div>
                </div>
              </div>
            );
          })}

        <div className=" straight-line horizontal-line pt-1 mb-2 " />
        <div className="row">
          <div className="col-4 pr-2 text-left">
            <div className="normal-text text-bold">Total invoice</div>
          </div>
          <div className="col-2 px-1 text-left">
            <div className="normal-text text-bold">
              ${numberWithCommas(totalCurrentBudget)}
            </div>
          </div>
          <div className="col-1 px-1 text-left">
            <div className="normal-text">
              <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
            </div>
          </div>
          <div className="col-2 px-1 text-left">
            <div className="normal-text text-bold">
              ${numberWithCommas(totalNewBudget)}
            </div>
          </div>
          <div className="col-3 pl-1 text-left">
            <div className="normal-text text-bold"> {totalChangeAmount}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ModalBox>
        <div style={{ wordBreak: 'break-all' }} className="modal-body pb-0 ">
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
          <div className="body-content">
            {dspContact &&
            Object.keys(dspContact).length === 0 &&
            Object.getPrototypeOf(dspContact) === Object.prototype ? (
              <div
                style={{ color: Theme.orange }}
                className="mt-2 mb-2 normal-text cursor"
                onClick={() => onEditDspContact('add')}
                aria-hidden="true">
                Please Click here to add DSP Contact
              </div>
            ) : (
              <>
                {' '}
                <p className="normal-text">
                  This proposal will be send to the following contact:
                </p>
                <fieldset className="less-border mb-3">
                  <div className="row">
                    <div className="col-9 pl-4">
                      <div className="normal-text text-bold">
                        {dspContact?.first_name} {dspContact?.last_name}
                      </div>
                      <div className="normal-text">{dspContact?.email}</div>
                    </div>
                    <div className="col-3">
                      <div
                        className="edit-contact"
                        role="presentation"
                        onClick={() => onEditDspContact('update')}>
                        <img src={EditOrangeIcon} alt="" />
                        Edit
                      </div>
                    </div>
                  </div>
                </fieldset>{' '}
              </>
            )}

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
            {invoiceType !== 'one time' ? (
              <p className="normal-text">
                The new invoice amount will be available to spend from{' '}
                <b>
                  {invoiceType === 'standard'
                    ? selectedMonthYear?.value.split(' ')[0]
                    : dayjs(selectedMonthYear?.value)
                        .add(1, 'M')
                        .format('MMMM')}{' '}
                  onwards.
                </b>
                <br /> The first bill for this amount will be sent{' '}
                {returnInvoiceBillDate()} 13.
              </p>
            ) : null}
            {invoiceType === 'permanent additional' && (
              <GreyCard className="yellow-card">
                <p className="normal-text text-bold m-0">
                  Additional DSP invoice ({returnInvoiceBillDate()} only)
                </p>
                <p className="normal-text text-bold mb-0 mt-1">
                  {' '}
                  {totalChangeAmount.replace('+', '')}
                </p>
                <p className="normal-text mb-0 mt-1">
                  The will be a one-off invoice, providing additional budget to
                  spend in the {returnInvoiceBillDate()}. This invoice will be
                  sent as soon as brand partner approves the proposal.
                </p>
              </GreyCard>
            )}
            {invoiceType === 'one time' ? (
              <p className="normal-text mb-0 mt-1">
                The will be a one-off invoice, providing additional budget to
                spend in the{' '}
                <b>{dayjs(selectedMonthYear?.value).format('MMMM')} only.</b>{' '}
                This invoice will be sent as soon as brand partner approves the
                proposal.
              </p>
            ) : null}
            <div>
              {showError ? (
                <ErrorMsgBox className="mt-3 mb-3" font>
                  Please enter a value that is higher than the initial budget.
                </ErrorMsgBox>
              ) : null}
            </div>
          </div>
        </div>

        <div className="footer-line" />

        <div className="modal-footer">
          <Button
            onClick={onApply}
            type="button"
            className={
              showError
                ? 'btn-primary on-boarding w-100 disabled '
                : 'btn-primary on-boarding w-100'
            }>
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
  dspContact: {},
  onEditDspContact: () => {},
};

InvoiceAdjustConfirm.propTypes = {
  onBackClick: func,
  returnTotalAmount: func,
  adjustmentData: arrayOf(Array),
  selectedMonthYear: shape({}),
  invoiceType: string.isRequired,
  onApply: func,
  today: number.isRequired,
  dspContact: shape({}),
  onEditDspContact: func,
};
