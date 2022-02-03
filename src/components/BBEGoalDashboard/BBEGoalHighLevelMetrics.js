import React from 'react';
import { WhiteCard } from '../../common';

export default function BBEGoalHighLevelMetrics() {
  return (
    <>
      <div className="row">
        <div className="col-9">
          <WhiteCard className="card-with-border mt-4">
            <div className="row">
              <div className="col-4">
                <p className="black-heading-title mt-0">Financials</p>
                <div className="label">Total Revenue</div>
                <h3>$1,550,295</h3>
                <div className="green-text mt-2">+$113,624 vs plan</div>
              </div>

              <div className="col-8" />
            </div>
            <div className="horizontal-line straight-line mt-3 mb-4" />
            <div className="row">
              <div className="col-3">
                <div className="label mb-2">Avg. Billings/BP</div>
                <h3 className="small-title-heading">$38,295</h3>

                <div className="green-text large-size mt-2">
                  +$113,624 vs plan
                </div>
              </div>
              <div className="col-3">
                <div className="label mb-2">Rev Share</div>
                <h3 className="small-title-heading">$38,295</h3>

                <div className="green-text large-size mt-2">
                  +$113,624 vs plan
                </div>
              </div>
              <div className="col-3">
                <div className="label mb-2">Rev Per Employee</div>
                <h3 className="small-title-heading">$38,295</h3>

                <div className="green-text large-size mt-2">
                  +$113,624 vs plan
                </div>
              </div>
              <div className="col-3">
                <div className="label mb-2">Average LTV</div>
                <h3 className="small-title-heading">$38,295</h3>

                <div className="red-text large-size mt-2">
                  +$113,624 vs plan
                </div>
              </div>
            </div>
          </WhiteCard>
        </div>
        <div className="col-3">
          <WhiteCard className="card-with-border mt-4">
            <p className="black-heading-title mt-0">Financials</p>
            <div className="label">Total Revenue</div>
            <h3>$1,550,295</h3>
            <div className="green-text mt-2">+$113,624 vs plan</div>
            <div className="horizontal-line straight-line mt-3 mb-4" />
            <div className="row">
              <div className="col-6">
                <div className="label mb-2">Rev Per Employee</div>
                <h3 className="small-title-heading">5</h3>

                <div className="green-text large-size mt-2">+3</div>
              </div>
              <div className="col-6">
                <div className="label mb-2">Rev Per Employee</div>
                <h3 className="small-title-heading">5</h3>

                <div className="red-text large-size mt-2">-9</div>
              </div>
            </div>
          </WhiteCard>
        </div>
      </div>
    </>
  );
}

BBEGoalHighLevelMetrics.defaultProps = {};
BBEGoalHighLevelMetrics.propTypes = {};
