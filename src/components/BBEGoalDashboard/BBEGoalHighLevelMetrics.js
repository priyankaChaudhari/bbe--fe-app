/* eslint-disable no-empty */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Dayjs from 'dayjs';
import ReactTooltip from 'react-tooltip';
import { func, instanceOf } from 'prop-types';

import Theme from '../../theme/Theme';
import useFormatNumber from '../../hooks/useFormatNumber';
import { PageLoader, WhiteCard } from '../../common';
import { getBBEGoalMetrics } from '../../api';
import { InfoIcons } from '../../theme/images';
import BBEGoalChart from './BBEGoalChart';

export default function BBEGoalHighLevelMetrics({
  selectedMonthYear,
  onSendDate,
}) {
  const [metricsData, setMetricsData] = useState(null);
  const [loader, setLoader] = useState(false);
  const initialOnSendDateRef = useRef(() =>
    onSendDate(metricsData?.last_updated),
  );

  const getKPIMetrics = useCallback(() => {
    setLoader(true);
    getBBEGoalMetrics(selectedMonthYear).then((res) => {
      if (
        res &&
        (res.status === 500 || res.status === 400 || res.status === 403)
      ) {
        setMetricsData(null);
        setLoader(false);
      }

      if (res && res.status === 200) {
        setMetricsData(res.data);

        setLoader(false);
      }
      setLoader(false);
    });
  }, [selectedMonthYear]);

  useEffect(() => {
    getKPIMetrics();
    initialOnSendDateRef.current();
  }, [getKPIMetrics]);

  const returnClassName = (value) => {
    if (value < 0) {
      return 'red-text';
    }
    if (value > 0) {
      return 'green-text';
    }
    return 'label-info-medium';
  };

  const renderPartners = (formatNumber) => {
    return (
      <div className="col-lg-3 col-md-12">
        <WhiteCard className="card-with-border mt-4">
          <div className="d-lg-block d-none">
            <p className="black-heading-title mt-0">Partners</p>
            <div className="label">Net New Customers</div>
            <h3>{metricsData?.actual?.net_new_customers}</h3>
            <div
              className={`${returnClassName(
                metricsData?.planned?.net_new_customers,
              )} large-size mt-2`}>
              {formatNumber(
                metricsData?.planned?.net_new_customers,
                '',
                '',
                true,
                true,
              )}{' '}
              {metricsData?.planned?.net_new_customers ? 'vs plan' : ''}
            </div>
            <div className="horizontal-line straight-line mt-3 d-lg-block d-none" />
          </div>
          <div className="row">
            <div className="d-lg-none col-md-3 col-12">
              <p className="black-heading-title mt-0 ">Partners</p>
              <div className="label">Net New Customers</div>
              <ul className="d-lg-none d-block bbe-goals-partners">
                <li>
                  <h3>{metricsData?.actual?.net_new_customers}</h3>
                </li>
                <li>
                  <div
                    className={`${returnClassName(
                      metricsData?.planned?.net_new_customers,
                    )} large-size mt-2`}>
                    {formatNumber(
                      metricsData?.planned?.net_new_customers,
                      '',
                      '',
                      true,
                      true,
                    )}{' '}
                    {metricsData?.planned?.net_new_customers ? 'vs plan' : ''}
                  </div>
                </li>
              </ul>
              <div className="horizontal-line straight-line mt-3 mb-0 d-md-none d-block" />
            </div>
            <div className="col-lg-6 col-md-3 col-6   pt-3">
              <div className="label mb-2 mt-md-3 mt-lg-0">Onboarded</div>
              <div className="d-lg-block d-none">
                <h3 className="small-title-heading">
                  {metricsData?.actual?.onboarded}
                </h3>
                <div
                  className={`${returnClassName(
                    metricsData?.planned?.onboarded,
                  )} large-size mt-2`}>
                  {formatNumber(
                    metricsData?.planned?.onboarded,
                    '',
                    '',
                    true,
                    true,
                  )}
                </div>
              </div>

              <ul className="d-lg-none d-block bbe-goals-partners">
                <li>
                  <h3 className="small-title-heading">
                    {metricsData?.actual?.onboarded}
                  </h3>
                </li>
                <li>
                  <div
                    className={`${returnClassName(
                      metricsData?.planned?.onboarded,
                    )} large-size mt-2`}>
                    {formatNumber(
                      metricsData?.planned?.onboarded,
                      '',
                      '',
                      true,
                      true,
                    )}
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-3 col-6  pt-3">
              <div className="label mb-2 mt-md-3 mt-lg-0">OFfboarded</div>
              <div className="d-lg-block d-none">
                <h3 className="small-title-heading">
                  {metricsData?.actual?.offboarded}
                </h3>
                <div
                  className={`${returnClassName(
                    metricsData?.planned?.offboarded,
                  )} large-size mt-2`}>
                  {formatNumber(
                    metricsData?.planned?.offboarded,
                    '',
                    '',
                    true,
                    true,
                  )}
                </div>
              </div>
              <ul className="d-lg-none d-block bbe-goals-partners">
                <li>
                  <h3 className="small-title-heading">
                    {metricsData?.actual?.offboarded}
                  </h3>
                </li>
                <li>
                  <div
                    className={`${returnClassName(
                      metricsData?.planned?.offboarded,
                    )} large-size mt-2`}>
                    {formatNumber(
                      metricsData?.planned?.offboarded,
                      '',
                      '',
                      true,
                      true,
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </WhiteCard>
      </div>
    );
  };

  const renderFinancial = (formatNumber) => {
    return (
      <WhiteCard className="card-with-border mt-4">
        <div className="row">
          <div className="col-md-5 col-12">
            <p className="black-heading-title mt-0">Financials</p>
            <div className="label">Total Revenue</div>
            <h3>
              {formatNumber(metricsData?.actual?.total_revenue, '$', '', true)}
            </h3>
            <div
              className={`${returnClassName(
                metricsData?.planned?.total_revenue,
              )} large-size mt-2`}>
              {formatNumber(
                metricsData?.planned?.total_revenue,
                '$',
                '',
                true,
                true,
              )}{' '}
              {metricsData?.planned?.total_revenue ? 'vs plan' : ''}
            </div>
          </div>

          <div style={{ zIndex: 50 }} className="col-md-7 col-12 mb-n4">
            {loader ? (
              <PageLoader
                component="performance-graph"
                type="detail"
                width={40}
                height={40}
                color={Theme.orange}
              />
            ) : (
              <BBEGoalChart
                CHART_ID="revenue_chart"
                data={metricsData?.graph_data}
                selectedMonthYear={Dayjs(selectedMonthYear).format('MMMM-YYYY')}
                formatNumber={useFormatNumber}
              />
            )}
          </div>
        </div>
        <div className="horizontal-line straight-line mt-3 mb-3" />
        <div className="row">
          <div className="col-md-3 col-6">
            <div className="label mb-2">Avg. Billings/BP</div>
            <h3 className="small-title-heading">
              {formatNumber(
                metricsData?.actual?.avg_billing_cap,
                '$',
                '',
                true,
              )}
            </h3>

            <div
              className={`${returnClassName(
                metricsData?.planned?.avg_billing_cap,
              )} large-size mt-2`}>
              {formatNumber(
                metricsData?.planned?.avg_billing_cap,
                '$',
                '',
                true,
                true,
              )}
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
                data-tip="Revenue Sharing values are updated on <br/>the 3rd of each month for the previous <br/> month as this is when the rev share <br/>invoices are issued."
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
              {formatNumber(metricsData?.actual?.rev_share, '$', '', true)}
            </h3>

            <div
              className={`${returnClassName(
                metricsData?.planned?.rev_share,
              )} large-size mt-2`}>
              {formatNumber(
                metricsData?.planned?.rev_share,
                '$',
                '',
                true,
                true,
              )}
            </div>
          </div>
          <div className="horizontal-line straight-line mt-3 mb-3 mx-3 d-md-none d-block" />
          <div className="col-md-3 col-6">
            <div className="label mb-2">Rev Per Employee</div>
            <h3 className="small-title-heading">
              {formatNumber(
                metricsData?.actual?.rev_per_employee,
                '$',
                '',
                true,
              )}
            </h3>
          </div>
          <div className="col-md-3 col-6">
            <div className="label mb-2">Average LTV</div>
            <h3 className="small-title-heading">
              {formatNumber(metricsData?.actual?.average_ltv, '$', '', true)}
            </h3>

            <div
              className={`${returnClassName(
                metricsData?.planned?.average_ltv,
              )} large-size mt-2`}>
              {formatNumber(
                metricsData?.planned?.average_ltv,
                '$',
                '',
                true,
                true,
              )}
            </div>
          </div>
        </div>
      </WhiteCard>
    );
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-9 col-md-12">
          {renderFinancial(useFormatNumber)}
        </div>
        {renderPartners(useFormatNumber)}
      </div>
    </>
  );
}

BBEGoalHighLevelMetrics.defaultProps = {
  onSendDate: () => {},
};
BBEGoalHighLevelMetrics.propTypes = {
  selectedMonthYear: instanceOf(Date).isRequired,
  onSendDate: func,
};
