import React from 'react';
import styled from 'styled-components';
import Theme from '../../theme/Theme';

export default function DspAdPacing() {
  return (
    <DspAdPacingModal id="BT-dsp-adpacing">
      <div className="modal-header">
        <h4 className="on-boarding ">DSP Monthly Budget Pacing</h4>
        <p className="basic-text">
          {' '}
          January 1 - 31 <span className="dot" /> &nbsp;&nbsp; 21 days remaining
        </p>
      </div>
      <div className="straight-line horizontal-line  mt-3 mb-3" />
      <div className="modal-body-section">
        <div className="label-heading mb-2 pb-1">Spend Status</div>
        <div className="status-heading-red ">Overspending</div>
        <p className="basic-text">
          {' '}
          You are currently overspending by an average of $237 per day.
        </p>
        <div className="straight-line horizontal-line  mt-3 mb-3" />
        <div className="label-heading mb-2">Breakdown</div>
        <div className="row">
          <div className="col-7">
            <div className="label-info mt-2">Monthly Budget</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right"> $31,000</div>{' '}
          </div>
          <div className="col-7">
            <div className="label-info mt-2">Daily Budget</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right"> $1,000</div>{' '}
          </div>
          <div className="col-7">
            <div className="label-info mt-2">Days Passed</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right"> 10</div>{' '}
          </div>
        </div>
        <div className="dotted-horizontal-line  mt-3 mb-3" />
        <div className="row">
          <div className="col-7">
            <div className="label-info mt-2">Planned Spend to Date</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right"> $10,000 (32%)</div>{' '}
          </div>
          <div className="col-7">
            <div className="label-info mt-2">Actual Spend to Date</div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right"> $12,370 (40%)</div>{' '}
          </div>
          <div className="col-7">
            <div className="label-info text-red mt-2"> Overspend to Date </div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info text-right text-red">
              {' '}
              $12,370 (40%)
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
            <div className="label-info text-bold text-right"> $887</div>{' '}
          </div>
          <div className="col-7">
            <div className="label-info  budget-text mt-1">
              For rest of month to hit budget
            </div>
          </div>
          <div className="col-5">
            {' '}
            <div className="label-info budget-text text-right mt-1">
              Per day
            </div>
          </div>{' '}
        </div>
        <div className="straight-line horizontal-line  mt-3 mb-3" />
      </div>
    </DspAdPacingModal>
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
      margin-left: 2px;
    }
  }
  .modal-body-section {
    padding: 0 15px;

    .status-heading-red {
      color: ${Theme.red};
      font-size: 26px;
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
