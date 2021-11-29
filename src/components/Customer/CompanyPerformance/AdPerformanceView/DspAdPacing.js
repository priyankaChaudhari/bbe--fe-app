import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import PropTypes, { arrayOf, func, shape, string } from 'prop-types';
import styled from 'styled-components';

import EscrowBudgetAllocationModal from './EscrowBudgetAllocationModal';
import Theme from '../../../../theme/Theme';
import { LeftArrowIcon } from '../../../../theme/images';
import { PageLoader, AllocateBar } from '../../../../common';

export default function DspAdPacing({
  dspData,
  isDspPacingLoading,
  currencySymbol,
  customerId,
  marketplace,
  onModalClose,
  memberData,
}) {
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [showAllocatedBalanceModal, setShowAllocatedBalanceModal] = useState(
    false,
  );
  const dspPacing = dspData?.dsp_pacing;
  const [isAllowToSplitBalance, setIsAllowToSplitBalance] = useState(false);
  useEffect(() => {
    if (userInfo.role === 'Ad Manager Admin') {
      setIsAllowToSplitBalance(true);
    } else if (
      userInfo.role === 'Hybrid Ad Manager' ||
      userInfo.role === 'DSP Ad Manager' ||
      userInfo.role === 'BGS'
    ) {
      for (const user of memberData) {
        if (user.user === userInfo.id) {
          setIsAllowToSplitBalance(true);
          break;
        }
      }
    }
  }, [isAllowToSplitBalance, memberData, userInfo]);

  const addThousandSeperator = (value) => {
    if (value && value !== null && value !== 0) {
      value = Number(value.toFixed(2));
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return 0;
  };

  const calculateDspDiff = () => {
    const result = dspPacing?.planed_to_spend - dspPacing?.total_spend;

    if (Math.sign(result) === 1) {
      return 'Underspend to Date';
    }
    if (Math.sign(result) === -1) {
      return 'Overspend to Date';
    }
    return '';
  };

  const displayMonth = () => {
    const currentDateOfMonth = new Date().getDate();
    if (currentDateOfMonth === 1 || currentDateOfMonth === 2) {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 1, 1);
      return dayjs(new Date(currentDate)).format('MMMM');
    }
    return dayjs(new Date()).format('MMMM');
  };

  const renderDspPacingLabel = () => {
    if (dspData?.dsp_pacing?.dsp_pacing_flag === '1') {
      return (
        <>
          <div className="status-heading-red">Overspending</div>
          <p className="basic-text">
            {' '}
            You are currently overspending by an average of {currencySymbol}
            {addThousandSeperator(dspPacing?.current_spend_status)} per day.
          </p>
        </>
      );
    }

    if (dspData?.dsp_pacing?.dsp_pacing_flag === '0') {
      return (
        <>
          <div className="status-heading-red green">On Track</div>
          <p className="basic-text">
            {' '}
            You are currently on tract to hit your monthly DSP budget.
          </p>
        </>
      );
    }
    if (dspData?.dsp_pacing?.dsp_pacing_flag === '-1') {
      return (
        <>
          <div className="status-heading-red">Underspending</div>
          <p className="basic-text">
            {' '}
            You are currently underspending by an average of {currencySymbol}
            {addThousandSeperator(dspPacing?.current_spend_status)}
            per day.
          </p>
        </>
      );
    }
    return '';
  };

  const renderBreakdownFields = () => {
    return (
      <div className="row">
        <div className="col-7">
          <div className="label-info mt-2">Invoice Amount</div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-right">
            {' '}
            {currencySymbol}
            {addThousandSeperator(dspPacing?.invoice_amount)}
          </div>{' '}
        </div>

        <div className="col-7">
          <div className="label-info mt-2">Carry-over</div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-right">
            {' '}
            {currencySymbol}
            {addThousandSeperator(dspPacing?.carry_over)}
          </div>{' '}
        </div>

        <div className="col-7">
          <div className="label-info  text-bold mt-2">
            Initial Total Budget for {displayMonth()}
          </div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-right">
            {' '}
            {currencySymbol}
            {addThousandSeperator(dspPacing?.total_budget)}
          </div>{' '}
        </div>

        <div className="col-7">
          <div className="label-info text-bold mt-2">Initial Daily Budget</div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-right">
            {' '}
            {currencySymbol}
            {addThousandSeperator(dspPacing?.daily_budget)}
          </div>{' '}
        </div>
        <div className="col-7">
          <div className="label-info mt-2">Days Passed</div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-right">
            {' '}
            {dspPacing?.days_passed}
          </div>{' '}
        </div>
      </div>
    );
  };

  const renderSpendDetails = () => {
    return (
      <div className="row">
        <div className="col-7">
          <div className="label-info mt-2">Planned Spend to Date</div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-right mt-2">
            {' '}
            {currencySymbol}
            {addThousandSeperator(dspPacing?.planed_to_spend)}(
            {addThousandSeperator(dspPacing?.planed_to_spend_percentage)}
            %)
          </div>{' '}
        </div>
        <div className="col-7">
          <div className="label-info mt-2">Actual Spend to Date</div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-right mt-2">
            {' '}
            {currencySymbol}
            {addThousandSeperator(dspPacing?.total_spend)}(
            {addThousandSeperator(dspPacing?.total_spend_percentage)}
            %)
          </div>{' '}
        </div>
        <div className="col-7">
          <div
            className={
              dspData &&
              dspData.dsp_pacing &&
              dspData.dsp_pacing.dsp_pacing_flag === '0'
                ? 'label-info mt-2'
                : 'label-info text-red mt-2'
            }>
            {' '}
            {calculateDspDiff()}{' '}
          </div>
        </div>
        <div className="col-5">
          {' '}
          <div
            className={
              dspData &&
              dspData.dsp_pacing &&
              dspData.dsp_pacing.dsp_pacing_flag === '0'
                ? 'label-info text-right mt-2'
                : 'label-info text-right text-red mt-2'
            }>
            {' '}
            {currencySymbol}
            {addThousandSeperator(dspPacing?.dsp_pacing_diff)}(
            {addThousandSeperator(dspPacing?.dsp_pacing_diff_percentage)}
            %)
          </div>{' '}
        </div>

        <div className="col-7">
          <div className="label-info text-bold mt-2">
            Remaining Budget for {displayMonth()}
          </div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-right mt-2">
            {' '}
            {currencySymbol}
            {addThousandSeperator(dspPacing?.remaining_budget)}
          </div>{' '}
        </div>
      </div>
    );
  };

  const renderDailyBudget = () => {
    return (
      <div className="row">
        <div className="col-7">
          <div className="label-info text-bold ">Suggested Daily Budget</div>
        </div>
        <div className="col-5">
          {' '}
          <div className="label-info text-bold text-right">
            {' '}
            {dspPacing?.suggested_spend === 0 ||
            dspPacing?.suggested_spend === 0.0
              ? 'N/A'
              : currencySymbol}
            {dspPacing?.suggested_spend !== 0 ||
            dspPacing?.suggested_spend !== 0.0
              ? addThousandSeperator(dspPacing?.suggested_spend)
              : null}
          </div>{' '}
        </div>
        <div className="col-7">
          <div className="label-info  budget-text mt-1">
            For rest of month to hit budget
          </div>
        </div>
        {isNaN(dspPacing?.suggested_spend) ? (
          ''
        ) : (
          <div className="col-5">
            {' '}
            <div className="label-info budget-text text-right mt-1">
              Per day
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEscrowBalance = () => {
    return (
      <>
        <div className="row mb-3">
          <div className="col-7">
            <div className="label-info text-bold ">Escrow Balance</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-bold text-right">
              {currencySymbol}
              {addThousandSeperator(dspPacing?.escrow)}
            </div>{' '}
          </div>
        </div>

        {isAllowToSplitBalance ? (
          <AllocateBar
            id="BT-escrow-dspPacing-AllocateBalance"
            className="mb-4">
            <div className="row">
              <div className="col-8">
                {' '}
                <div className="remaing-label">
                  {currencySymbol}
                  {addThousandSeperator(dspPacing?.escrow_sum)} of the escrow is
                  planned carry-over for future months
                </div>{' '}
              </div>
              <div className="col-4">
                <div
                  className="allocate-balance cursor"
                  onClick={() => setShowAllocatedBalanceModal(true)}
                  role="presentation">
                  Allocate Balance{' '}
                  <img
                    className="orange-left-arrow"
                    src={LeftArrowIcon}
                    alt=""
                  />
                </div>
                <div className="clear-fix" />
              </div>
            </div>
          </AllocateBar>
        ) : null}
      </>
    );
  };

  const renderEscrowBudgetAllocationModal = () => {
    return (
      <EscrowBudgetAllocationModal
        id="BT-escrowAllocation"
        customerId={customerId}
        marketplace={marketplace}
        dspData={dspData}
        isOpen={showAllocatedBalanceModal}
        addThousandSeperator={addThousandSeperator}
        onClick={() => {
          setShowAllocatedBalanceModal(false);
          onModalClose();
        }}
      />
    );
  };

  return (
    <>
      {isDspPacingLoading ? (
        <PageLoader
          component="Notes-modal-loader"
          color="#FF5933"
          type="page"
        />
      ) : Object.keys(dspData).length ? (
        <>
          <DspAdPacingModal
            id="BT-dsp-adpacing"
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 className="on-boarding ">DSP Monthly Budget Pacing</h4>
              <p className="basic-text">
                {' '}
                {displayMonth()} 1 - {dspPacing?.last_day}{' '}
                <span className="dot" /> &nbsp;&nbsp;&nbsp;
                {dspPacing?.days_remains} days remaining
              </p>
            </div>
            <div className="straight-line horizontal-line  mt-3 mb-3" />
            <div className="modal-body-section">
              <div className="label-heading mb-2 pb-1">Spend Status</div>
              {renderDspPacingLabel()}

              <div className="straight-line horizontal-line  mt-3 mb-3" />
              <div className="label-heading mb-2">Breakdown</div>
              {renderBreakdownFields()}

              <div className="dotted-horizontal-line  mt-3 mb-3" />
              {renderSpendDetails()}

              <div className="straight-line horizontal-line  mt-3 mb-3" />
              {renderDailyBudget()}
              <div className="straight-line horizontal-line  mt-3 mb-3" />

              {renderEscrowBalance()}
            </div>
          </DspAdPacingModal>
          {renderEscrowBudgetAllocationModal()}
        </>
      ) : (
        <PageLoader
          component="Notes-modal-loader"
          color="#FF5933"
          type="page"
        />
      )}
    </>
  );
}

const DspAdPacingModal = styled.div`
  top: 0;
  background: ${Theme.white};
  height: 100%;
  .modal-header {
    padding: 15px 15px 0 15px;

    .dot {
      background-color: ${Theme.gray35};
      border-radius: 50%;
      width: 3px;
      height: 3px;
      position: absolute;
      top: 38px;
      margin-left: 3px;
    }
  }
  .modal-body-section {
    padding: 0 15px;

    .status-heading-red {
      color: ${Theme.red};
      font-size: 26px;

      &.green {
        color: ${Theme.lighterGreen};
      }
    }
    .dotted-horizontal-line {
      border-bottom: 2px dotted ${Theme.gray4};
    }

    .text-red {
      color: ${Theme.red};
    }
    .text-bold {
      font-weight: bold;
    }
    .budget-text {
      color: ${Theme.gray85};
      font-size: ${Theme.extraSmall};
    }
  }
`;

DspAdPacing.defaultProps = {
  dspData: {},
  isDspPacingLoading: false,
  currencySymbol: '',
  customerId: '',
  marketplace: '',
  memberData: [],
  onModalClose: () => {},
};

DspAdPacing.propTypes = {
  customerId: string,
  marketplace: string,
  dspData: shape({}),
  memberData: arrayOf(shape({})),
  isDspPacingLoading: PropTypes.bool,
  currencySymbol: PropTypes.string,
  onModalClose: func,
};
