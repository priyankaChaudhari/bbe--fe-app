import React from 'react';

import { arrayOf, func } from 'prop-types';

import {
  ArrowRightBlackIcon,
  ArrowRightIcon,
  LeftArrowIcon,
} from '../../../../../../theme/images';
import { ModalBox, Button, GreyCard } from '../../../../../../common';
import numberWithCommas from '../../../../../../hooks/numberWithComas';

const InvoiceAdjustConfirm = ({
  onBackClick,
  adjustmentData,
  returnTotalAmount,
}) => {
  const { currentBudget, newBudget } = returnTotalAmount();
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
                return (
                  <div className="row mt-1">
                    <div className="col-4 text-left">
                      <div className="normal-text ">{item.marketplace}</div>
                    </div>
                    <div className="col-2 text-left">
                      <div className="gray-normal-text">
                        ${numberWithCommas(item.old_budget)}
                      </div>
                    </div>
                    <div className="col-1 text-left">
                      <div className="normal-text">
                        <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
                      </div>
                    </div>
                    <div className="col-2 text-left">
                      <div className="gray-normal-text">
                        ${item.newAmount ? item.newAmount : item.old_budget}
                      </div>
                    </div>
                    <div className="col-3 text-left">
                      <div className="gray-normal-text">
                        {item.change
                          ? item.change === 0
                            ? '-'
                            : item.change
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
                <div className="normal-text text-bold">${currentBudget}</div>
              </div>
              <div className="col-1 text-left">
                <div className="normal-text">
                  <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                </div>
              </div>
              <div className="col-2 text-left">
                <div className="normal-text text-bold">${newBudget}</div>
              </div>
              <div className="col-3 text-left">
                <div className="normal-text text-bold">
                  {' '}
                  {newBudget - currentBudget > 0
                    ? `+${Math.abs(currentBudget - newBudget)}`
                    : `-${Math.abs(currentBudget - newBudget)}`}
                </div>
              </div>
            </div>
          </div>
          <div className="d-md-none d-block">
            {adjustmentData &&
              adjustmentData.length > 0 &&
              adjustmentData.map((item) => {
                return (
                  <>
                    <div className="row">
                      <div className="col-12 text-left">
                        <div className="label">Marketplace</div>
                        <div className="normal-text text-bold">
                          {item.marketplace}
                        </div>
                      </div>

                      <div className="col-4 text-left">
                        <div className="label">From</div>
                        <div className="normal-text text-bold">
                          ${numberWithCommas(item.old_budget)}
                        </div>
                      </div>
                      <div className="col-2 text-left">
                        <div className="mt-3">
                          <img
                            src={ArrowRightBlackIcon}
                            width="18px"
                            alt="arrow"
                          />{' '}
                        </div>
                      </div>
                      <div className="col-3 text-left">
                        <div className="label">To</div>
                        <div className="normal-text text-bold">
                          ${item.newAmount ? item.newAmount : 0}
                        </div>
                      </div>
                      <div className="col-3 text-left">
                        <div className="label">Change</div>
                        <div className="normal-text text-bold">
                          {' '}
                          {item.change
                            ? item.change === 0
                              ? '-'
                              : item.change
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
                <div className="gray-normal-text">$5,000</div>
              </div>
              <div className="col-2 text-left">
                <div className="mt-3">
                  <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
                </div>
              </div>
              <div className="col-3 text-left">
                <div className="label">To</div>
                <div className="gray-normal-text">$10,000</div>
              </div>
              <div className="col-3 text-left">
                <div className="label">Change</div>
                <div className="gray-normal-text">+$5,000</div>
              </div>
            </div>
          </div>
          <div className=" straight-line horizontal-line mt-2 mb-2 " />
          <p className="normal-text">
            The new invoice amount willbe available to spend from December
            onwards.
            <br /> The first bill for this amount willbe sent November 13.
          </p>
          <GreyCard className="yellow-card">
            <p className="normal-text text-bold m-0">
              Additional DSP invoice (November only)
            </p>
            <p className="normal-text text-bold mb-0 mt-1"> $5,000</p>
            <p className="normal-text mb-0 mt-1">
              The will be a one-off invoice, providing additional budget to
              spend in the current month. This invoice will be sent as soon as
              brand partner approves the proposal.
            </p>
          </GreyCard>
        </div>

        <div className="footer-line" />
        <div className="modal-footer">
          <Button
            //   onClick={() => {
            //     setShowInvoiceConfirmModal(true);
            //     onApply();
            //   }}
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
};

InvoiceAdjustConfirm.propTypes = {
  onBackClick: func,
  returnTotalAmount: func,
  adjustmentData: arrayOf(Array),
};
