import React from 'react';
import { WhiteCard } from '../../common';

export default function BBEGoalHighLevelMetrics() {
  return (
    <>
      <div className="row">
        <div className="col-lg-9 col-md-12">
          <WhiteCard className="card-with-border mt-4">
            <div className="row">
              <div className="col-md-4 col-12">
                <p className="black-heading-title mt-0">Financials</p>
                <div className="label">Total Revenue</div>
                <h3>$1,550,295</h3>
                <div className="green-text mt-2">+$113,624 vs plan</div>
                {/* <div className="horizontal-line straight-line mt-3 mb-4 d-md-none d-block" /> */}
              </div>

              <div className="col-md-8 col-12" />
            </div>
            <div className="horizontal-line straight-line mt-3 mb-3" />
            <div className="row">
              <div className="col-md-3 col-6">
                <div className="label mb-2">Avg. Billings/BP</div>
                <h3 className="small-title-heading">$38,295</h3>

                <div className="green-text large-size mt-2">
                  +$113,624 vs plan
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="label mb-2">Rev Share</div>
                <h3 className="small-title-heading">$38,295</h3>

                <div className="green-text large-size mt-2">
                  +$113,624 vs plan
                </div>
              </div>
              <div className="horizontal-line straight-line mt-3 mb-3 mx-3 d-md-none d-block" />
              <div className="col-md-3 col-6">
                <div className="label mb-2">Rev Per Employee</div>
                <h3 className="small-title-heading">$38,295</h3>

                <div className="green-text large-size mt-2">
                  +$113,624 vs plan
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="label mb-2">Average LTV</div>
                <h3 className="small-title-heading">$38,295</h3>

                <div className="red-text large-size mt-2">
                  +$113,624 vs plan
                </div>
              </div>
            </div>
          </WhiteCard>
        </div>
        <div className="col-lg-3 col-md-12">
          <WhiteCard className="card-with-border mt-4">
            <div className="d-lg-block d-none">
              <p className="black-heading-title mt-0">Partners</p>
              <div className="label">Total Revenue</div>
              <h3>$1,550,295</h3>
              <div className="green-text mt-2">+$113,624 vs plan</div>
              <div className="horizontal-line straight-line mt-3 d-lg-block d-none" />
            </div>
            <div className="row">
              <div className="d-lg-none col-md-3 col-12">
                <p className="black-heading-title mt-0 ">Partners</p>
                <div className="label">Net New Customers</div>
                <div className="d-lg-block d-none">
                  <h3>$1,550,295</h3>
                  <div className="green-text mt-2">+$113,624 vs plan</div>
                </div>
                <ul className="d-lg-none d-block bbe-goals-partners">
                  <li>
                    <h3>$1,550,295</h3>
                  </li>
                  <li>
                    {' '}
                    <div className="green-text mt-2">+$113,624 vs plan</div>
                  </li>
                </ul>
                <div className="horizontal-line straight-line mt-3 mb-0 d-md-none d-block" />
              </div>
              <div className="col-lg-6 col-md-3 col-6  pt-3">
                <div className="label mb-2">Onboarded</div>
                <div className="d-lg-block d-none">
                  <h3 className="small-title-heading">5</h3>
                  <div className="green-text large-size mt-2">+3</div>
                </div>

                <ul className="d-lg-none d-block bbe-goals-partners">
                  <li>
                    <h3 className="small-title-heading">5</h3>
                  </li>
                  <li>
                    <div className="green-text large-size mt-2">+3</div>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 col-md-3 col-6  pt-3">
                <div className="label mb-2">OFfboarded</div>
                <div className="d-lg-block d-none">
                  <h3 className="small-title-heading">5</h3>
                  <div className="green-text large-size mt-2">+3</div>
                </div>
                <ul className="d-lg-none d-block bbe-goals-partners">
                  <li>
                    <h3 className="small-title-heading">5</h3>
                  </li>
                  <li>
                    <div className="green-text large-size mt-2">+3</div>
                  </li>
                </ul>
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
