/* eslint-disable camelcase */

import React from 'react';
import dayjs from 'dayjs';
import PropTypes, { instanceOf } from 'prop-types';
import styled from 'styled-components';
import Theme from '../../theme/Theme';
import { PageLoader } from '../../common';

export default function DspAdPacing({
  dspData,
  isDspPacingLoading,
  currencySymbol,
}) {
  const { dsp_pacing } = dspData;
  const displayDspPacingLabel = () => {
    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === 1
    ) {
      return (
        <>
          <div className="status-heading-red">Overspending</div>
          <p className="basic-text">
            {' '}
            You are currently overspending by an average of {currencySymbol}
            {dsp_pacing &&
              dsp_pacing.current_spend_status &&
              dsp_pacing.current_spend_status
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            per day.
          </p>
        </>
      );
    }

    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === 0
    ) {
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
    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === -1
    ) {
      return (
        <>
          <div className="status-heading-red">Underspending</div>
          <p className="basic-text">
            {' '}
            You are currently underspending by an average of {currencySymbol}
            {dsp_pacing &&
              dsp_pacing.current_spend_status &&
              dsp_pacing.current_spend_status
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            per day.
          </p>
        </>
      );
    }
    return '';
  };

  const calculateDspDiff = () => {
    const result =
      (dsp_pacing && dsp_pacing.planed_to_spend) -
      (dsp_pacing && dsp_pacing.total_spend);

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

  return isDspPacingLoading &&
    isDspPacingLoading.loader &&
    isDspPacingLoading.type === 'modal' ? (
    <PageLoader component="Notes-modal-loader" color="#FF5933" type="page" />
  ) : Object.keys(dspData).length ? (
    <DspAdPacingModal id="BT-dsp-adpacing" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h4 className="on-boarding ">DSP Monthly Budget Pacing</h4>
        <p className="basic-text">
          {' '}
          {displayMonth()} 1 - {dsp_pacing && dsp_pacing.last_day}{' '}
          <span className="dot" /> &nbsp;&nbsp;&nbsp;
          {dsp_pacing && dsp_pacing.days_remains} days remaining
        </p>
      </div>
      <div className="straight-line horizontal-line  mt-3 mb-3" />
      <div className="modal-body-section">
        <div className="label-heading mb-2 pb-1">Spend Status</div>
        {displayDspPacingLabel()}

        <div className="straight-line horizontal-line  mt-3 mb-3" />
        <div className="label-heading mb-2">Breakdown</div>
        <div className="row">
          <div className="col-7">
            <div className="label-info mt-2">Monthly Budget</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right">
              {' '}
              {currencySymbol}
              {dsp_pacing &&
                dsp_pacing.total_budget &&
                dsp_pacing.total_budget
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>{' '}
          </div>
          <div className="col-7">
            <div className="label-info mt-2">Daily Budget</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right">
              {' '}
              {currencySymbol}
              {dsp_pacing &&
                dsp_pacing.daily_budget &&
                dsp_pacing.daily_budget
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>{' '}
          </div>
          <div className="col-7">
            <div className="label-info mt-2">Days Passed</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right">
              {' '}
              {dsp_pacing && dsp_pacing.days_passed}
            </div>{' '}
          </div>
        </div>
        <div className="dotted-horizontal-line  mt-3 mb-3" />
        <div className="row">
          <div className="col-7">
            <div className="label-info mt-2">Planned Spend to Date</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right mt-2">
              {' '}
              {currencySymbol}
              {dsp_pacing &&
                dsp_pacing.planed_to_spend &&
                dsp_pacing.planed_to_spend
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              (
              {dsp_pacing &&
                dsp_pacing.planed_to_spend_percentage &&
                dsp_pacing.planed_to_spend_percentage
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
              {dsp_pacing &&
                dsp_pacing.total_spend &&
                dsp_pacing.total_spend
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              (
              {dsp_pacing &&
                dsp_pacing.total_spend_percentage &&
                dsp_pacing.total_spend_percentage
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              %)
            </div>{' '}
          </div>
          <div className="col-7">
            <div
              className={
                dspData &&
                dspData.dsp_pacing &&
                dspData.dsp_pacing.dsp_pacing_flag === 0
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
                dspData.dsp_pacing.dsp_pacing_flag === 0
                  ? 'label-info text-right mt-2'
                  : 'label-info text-right text-red mt-2'
              }>
              {' '}
              {currencySymbol}
              {dsp_pacing &&
                dsp_pacing.dsp_pacing_diff &&
                dsp_pacing.dsp_pacing_diff
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              (
              {dsp_pacing &&
                dsp_pacing.dsp_pacing_diff_percentage &&
                dsp_pacing.dsp_pacing_diff_percentage
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              %)
            </div>{' '}
          </div>
        </div>
        <div className="straight-line horizontal-line  mt-3 mb-3" />
        <div className="row">
          <div className="col-7">
            <div className="label-info text-bold ">Suggested Daily Budget</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-bold text-right">
              {' '}
              {isNaN(dsp_pacing && dsp_pacing.suggested_spend)
                ? ''
                : currencySymbol}
              {dsp_pacing &&
              dsp_pacing.suggested_spend &&
              isNaN(dsp_pacing && dsp_pacing.suggested_spend)
                ? dsp_pacing && dsp_pacing.suggested_spend
                : dsp_pacing.suggested_spend
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>{' '}
          </div>
          <div className="col-7">
            <div className="label-info  budget-text mt-1">
              For rest of month to hit budget
            </div>
          </div>
          {isNaN(dsp_pacing && dsp_pacing.suggested_spend) ? (
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
        <div className="straight-line horizontal-line  mt-3 mb-3" />
      </div>
    </DspAdPacingModal>
  ) : (
    <PageLoader component="Notes-modal-loader" color="#FF5933" type="page" />
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
};

DspAdPacing.propTypes = {
  dspData: instanceOf(Object),
  isDspPacingLoading: PropTypes.bool,
  currencySymbol: PropTypes.string,
};
