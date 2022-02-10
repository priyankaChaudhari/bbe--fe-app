/* eslint-disable no-empty */
import React, { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { string } from 'prop-types';
import ReactTooltip from 'react-tooltip';

import BBEGoalChart from './BBEGoalChart';
import { WhiteCard } from '../../common';
import { data } from './dummyData';
import { getBBEGoalMetrics } from '../../api';
import numberWithCommas from '../../hooks/numberWithCommas';
import { InfoIcons } from '../../theme/images';

export default function BBEGoalHighLevelMetrics({ selectedMonthYear }) {
  const [metricsData, setMetricsData] = useState(null);

  const getKPIMetrics = useCallback(() => {
    getBBEGoalMetrics().then((res) => {
      if (res && res.status === 500) {
      }

      if (res && res.status === 400) {
      }
      if (res && res.status === 200) {
        setMetricsData(data);
      }
      setMetricsData(data);
    });
  }, []);

  useEffect(() => {
    getKPIMetrics();
  }, [getKPIMetrics]);

  return (
    <>
      <div className="row">
        <div className="col-lg-9 col-md-12">
          <WhiteCard className="card-with-border mt-4">
            <div className="row">
              <div className="col-md-5 col-12">
                <p className="black-heading-title mt-0">Financials</p>
                <div className="label">Total Revenue</div>
                <h3>
                  {numberWithCommas(
                    metricsData?.actual?.total_total_rev_share,
                    '$',
                  )}
                </h3>
                <div className="green-text mt-2">
                  {numberWithCommas(
                    metricsData?.planned?.total_total_rev_share,
                    '$',
                  )}{' '}
                  vs plan
                </div>
                {/* <div className="horizontal-line straight-line mt-3 mb-4 d-md-none d-block" /> */}
              </div>

              <div className="col-md-7 col-12 mb-n4">
                <BBEGoalChart
                  CHART_ID="revenue_chart"
                  data={metricsData?.graph_data}
                  selectedMonthYear={dayjs(selectedMonthYear)
                    .format('MMMM')
                    .toUpperCase()}
                />
              </div>
            </div>
            <div className="horizontal-line straight-line mt-3 mb-3" />
            <div className="row">
              <div className="col-md-3 col-6">
                <div className="label mb-2">Avg. Billings/BP</div>
                <h3 className="small-title-heading">
                  {numberWithCommas(metricsData?.actual?.avg_billing_cap, '$')}
                </h3>

                <div className="green-text large-size mt-2">
                  +
                  {numberWithCommas(metricsData?.planned?.avg_billing_cap, '$')}{' '}
                  vs plan
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="label mb-2">
                  Rev Share{' '}
                  <img
                    className="ml-1 cursor"
                    style={{ verticalAlign: 'text-bottom', fontWeight: '300' }}
                    width="14px"
                    src={InfoIcons}
                    alt="info"
                    data-tip="The rev share value gets <br/>updated on the 4th of each<br/> month for the prior month"
                    data-for="dspAdditionalInfo"
                  />{' '}
                  <ReactTooltip
                    id="dspAdditionalInfo"
                    aria-haspopup="true"
                    place="bottom"
                    effect="solid"
                    html
                  />
                </div>
                <h3 className="small-title-heading">
                  {numberWithCommas(metricsData?.actual?.rev_share, '$')}
                </h3>

                <div className="green-text large-size mt-2">
                  +{numberWithCommas(metricsData?.planned?.rev_share, '$')} vs
                  plan
                </div>
              </div>
              <div className="horizontal-line straight-line mt-3 mb-3 mx-3 d-md-none d-block" />
              <div className="col-md-3 col-6">
                <div className="label mb-2">Rev Per Employee</div>
                <h3 className="small-title-heading">
                  {numberWithCommas(metricsData?.actual?.rev_per_employee, '$')}
                </h3>

                <div className="green-text large-size mt-2">
                  +
                  {numberWithCommas(
                    metricsData?.planned?.rev_per_employee,
                    '$',
                  )}{' '}
                  vs plan
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="label mb-2">Average LTV</div>
                <h3 className="small-title-heading">
                  {numberWithCommas(metricsData?.actual?.average_ltv, '$')}
                </h3>

                <div className="red-text large-size mt-2">
                  +{numberWithCommas(metricsData?.planned?.average_ltv, '$')} vs
                  plan
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
              <h3>
                {numberWithCommas(
                  metricsData?.actual?.total_total_rev_share,
                  '$',
                )}
              </h3>
              <div className="green-text mt-2">
                +
                {numberWithCommas(
                  metricsData?.planned?.total_total_rev_share,
                  '$',
                )}{' '}
                vs plan
              </div>
              <div className="horizontal-line straight-line mt-3 d-lg-block d-none" />
            </div>
            <div className="row">
              <div className="d-lg-none col-md-3 col-12">
                <p className="black-heading-title mt-0 ">Partners</p>
                <div className="label">Net New Customers</div>
                <div className="d-lg-block d-none">
                  <h3>
                    {numberWithCommas(
                      metricsData?.actual?.total_total_rev_share,
                      '$',
                    )}
                  </h3>
                  <div className="green-text mt-2">
                    +
                    {numberWithCommas(
                      metricsData?.planned?.total_total_rev_share,
                      '$',
                    )}
                  </div>
                </div>
                <ul className="d-lg-none d-block bbe-goals-partners">
                  <li>
                    <h3>
                      {numberWithCommas(
                        metricsData?.planned?.total_total_rev_share,
                        '$',
                      )}
                    </h3>
                  </li>
                  <li>
                    {' '}
                    <div className="green-text mt-2">
                      +
                      {numberWithCommas(
                        metricsData?.planned?.total_total_rev_share,
                        '$',
                      )}{' '}
                      vs plan
                    </div>
                  </li>
                </ul>
                <div className="horizontal-line straight-line mt-3 mb-0 d-md-none d-block" />
              </div>
              <div className="col-lg-6 col-md-3 col-6   pt-3">
                <div className="label mb-2 mt-md-3 mt-lg-0">Onboarded</div>
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
                <div className="label mb-2 mt-md-3 mt-lg-0">OFfboarded</div>
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
BBEGoalHighLevelMetrics.propTypes = {
  selectedMonthYear: string.isRequired,
};
