import React from 'react';

import { arrayOf, func, shape, string } from 'prop-types';

import numberWithCommas from '../../../../../../../hooks/numberWithComas';
import { Button, ModalBox } from '../../../../../../../common';
import {
  EditOrangeIcon,
  LeftArrowIcon,
} from '../../../../../../../theme/images';

const InvoicePauseConfirm = ({
  adjustmentData,
  totalChangeAmount,
  returnTotalAmount,
  onApply,
  onBackClick,
  selectedMonthYear,
  dspContact,
}) => {
  const { totalNewBudget } = returnTotalAmount();
  const renderResponsiveView = () => {
    return (
      <div className="d-md-none d-block">
        {adjustmentData &&
          adjustmentData.length > 0 &&
          adjustmentData.map((item) => {
            const textClass =
              item && item.is_sent_for_pause
                ? 'normal-text text-bold'
                : 'gray-normal-text';
            return (
              <>
                <div className="row">
                  <div className="col-12 text-left mb-2">
                    <div className="label">Marketplace</div>
                    <div className={textClass}>{item.marketplace}</div>
                  </div>

                  <div className="col-6 text-left">
                    <div className="label">Invoice Amount</div>
                    <div className={textClass}>
                      ${numberWithCommas(item.new_budget)}
                    </div>
                  </div>
                  <div className="col-6 text-left">
                    <div className="label">Pause Invoice</div>
                    <div className={textClass}>
                      {item.is_sent_for_pause ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
                <div className=" straight-line horizontal-line mt-2 mb-2 " />
              </>
            );
          })}

        <div className="row">
          <div className="col-12 text-left mb-2">
            <div className="label text-bold"> </div>
            <div className="normal-text text-bold">Total invoice</div>
          </div>

          <div className="col-6 text-left">
            <div className="label">Invoice Amount</div>
            <div className="gray-normal-text">
              ${numberWithCommas(totalChangeAmount)}
            </div>
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
          <div className="col-4 px-1 text-left">
            <div className="label">Invoice Amount</div>
          </div>
          <div className="col-4 pl-1 text-left">
            <div className="label">Pause Invoice</div>
          </div>
        </div>
        <div className=" straight-line horizontal-line pt-1 mb-2 " />

        {adjustmentData &&
          adjustmentData.length > 0 &&
          adjustmentData.map((item) => {
            const textClass =
              item && item.is_sent_for_pause
                ? 'normal-text text-bold'
                : 'gray-normal-text';
            return (
              <div className="row mt-1">
                <div className="col-4 pr-2 text-left">
                  <div className={textClass}>{item.marketplace}</div>
                </div>
                <div className="col-4 px-1 text-left">
                  <div className={textClass}>
                    ${numberWithCommas(item.new_budget)}
                  </div>
                </div>
                <div className="col-4 pl-1 text-left">
                  <div className={textClass}>
                    {item.is_sent_for_pause ? 'Yes' : 'No'}
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
          <div className="col-4 px-1 text-left">
            <div className="normal-text text-bold">
              ${numberWithCommas(totalNewBudget)}
            </div>
          </div>
          <div className="col-4 pl-1 text-left" />
        </div>
        <div className=" straight-line horizontal-line mt-2 mb-2 " />
        <p className="normal-text">
          The change will apply to{' '}
          <b>{selectedMonthYear?.value.split(' ')[0]} only.</b>
        </p>
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
            Confirm Pause
          </h4>
          <div className="body-content">
            <p className="normal-text">
              This proposal will be send to the following contact:
            </p>
            <div className="row">
              <div className="col-10">
                <div className="normal-text text-bold">
                  {dspContact?.first_name} {dspContact?.last_name}
                </div>
                <div className="normal-text">{dspContact?.email}</div>
              </div>
              <div className="col-2">
                <div
                  className="edit-details"
                  role="presentation"
                  onClick={() => {}}>
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>
              </div>
            </div>
            <div className=" straight-line horizontal-line pt-1 mb-2 " />
            {renderDesktopView()}
            {renderResponsiveView()}
          </div>
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

export default InvoicePauseConfirm;

InvoicePauseConfirm.defaultProps = {
  adjustmentData: [],
  onApply: () => {},
  onBackClick: () => {},
  returnTotalAmount: () => {},
  selectedMonthYear: {},
  dspContact: null,
};

InvoicePauseConfirm.propTypes = {
  adjustmentData: arrayOf(Array),
  totalChangeAmount: string.isRequired,
  onApply: func,
  onBackClick: func,
  returnTotalAmount: func,
  selectedMonthYear: shape({}),
  dspContact: shape({}),
};
