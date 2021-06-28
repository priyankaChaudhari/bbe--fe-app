/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { DashboardCard, BrandPartnerDashboard } from '../../theme/Global';

import { PageLoader, WhiteCard } from '../../common';

import {
  RecurringIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ServiceIcon,
  CompanyDefaultUser,
  UpDowGrayArrow,
} from '../../theme/images';
import { PATH_CUSTOMER_DETAILS } from '../../constants';
import NoRecordFound from '../../common/NoRecordFound';

function DspAdDashboard({ isLoading, data }) {
  const history = useHistory();

  const renderAdPerformanceDifference = (actualValue, grayArrow, matrics) => {
    let flag = '';
    let value = actualValue;
    if (value) {
      if (matrics === 'ACOS') {
        if (value.toString().includes('-')) {
          flag = 'green';
          value = value
            ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
            : '';
        } else {
          flag = 'red';
          value = value ? `${value.toFixed(2)} %` : '';
        }
      } else if (value.toString().includes('-')) {
        flag = 'red';
        value = value
          ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
          : '';
      } else {
        flag = 'green';
        value = value ? `${value.toFixed(2)} %` : '';
      }

      if (flag === 'red') {
        return (
          <>
            <span
              className={grayArrow ? 'decrease-rate grey' : 'decrease-rate'}>
              {' '}
              <img
                className="red-arrow"
                src={grayArrow ? UpDowGrayArrow : ArrowDownIcon}
                alt="arrow-up"
              />
              {value}
            </span>
          </>
        );
      }
      return (
        <>
          <div className={grayArrow ? 'increase-rate grey' : 'increase-rate'}>
            <img
              className="green-arrow"
              src={grayArrow ? UpDowGrayArrow : ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {value}
          </div>
        </>
      );
    }
    return <div className="perentage-value down">N/A</div>;
  };

  return (
    <BrandPartnerDashboard>
      <DashboardCard>
        <div className="dashboard-body">
          {isLoading.loader && isLoading.type === 'page' ? (
            <PageLoader component="modal" color="#FF5933" type="page" />
          ) : (
            <div className="row">
              {data && data.length === 0 ? (
                <NoRecordFound type="brand" />
              ) : (
                data &&
                data.map((item) => (
                  <div
                    key={item.id}
                    className="col-lg-3 mb-4 col-md-6 col-sm-12 "
                    role="presentation">
                    <WhiteCard
                      className="cursor"
                      onClick={() =>
                        history.push(
                          PATH_CUSTOMER_DETAILS.replace(':id', item.id),
                          'adManager',
                        )
                      }>
                      <img
                        className="company-logo"
                        src={
                          item &&
                          item.documents &&
                          item.documents[0] &&
                          Object.values(item.documents[0])
                            ? Object.values(item.documents[0])[0]
                            : CompanyDefaultUser
                        }
                        alt="logo"
                      />

                      <div
                        className="company-name"
                        title={item && item.company_name}>
                        {item && item.company_name}
                      </div>
                      <div
                        className="status"
                        title={item && item.category && item.category.label}>
                        {item && item.category && item.category.label}
                      </div>
                      <div className="straight-line horizontal-line spacing " />
                      <div className="row">
                        <div className="col-12 pt-1 pb-1">
                          <img
                            className="solid-icon "
                            src={
                              item &&
                              item.contract &&
                              item.contract[0] &&
                              (item.contract[0].contract_type === 'One Time' ||
                                item.contract[0].contract_type === 'one time')
                                ? ServiceIcon
                                : RecurringIcon
                            }
                            alt=""
                          />
                          <p className="black-heading-title mt-0 mb-0 capitalize">
                            {item &&
                              item.contract &&
                              item.contract[0] &&
                              item.contract[0].contract_type}{' '}
                            Service Agreement
                          </p>

                          <ul className="recurring-contact ">
                            <li>
                              <p className="basic-text ">
                                {item &&
                                  item.contract &&
                                  item.contract[0] &&
                                  item.contract[0].length}
                              </p>
                            </li>

                            <li>
                              {' '}
                              <div className="dot" />
                              <p className="basic-text ">
                                Started{' '}
                                {item &&
                                item.contract &&
                                item.contract[0] &&
                                item.contract[0].start_date
                                  ? dayjs(item.contract[0].start_date).format(
                                      'MMM DD, YYYY',
                                    )
                                  : ''}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="straight-line horizontal-line spacing " />
                      <div className="row">
                        <div className="col-6">
                          <div className="card-label">IMPRESSIONS</div>

                          {renderAdPerformanceDifference(
                            item &&
                              item.dsp_ad_performance &&
                              item.dsp_ad_performance.difference_data &&
                              item.dsp_ad_performance.difference_data
                                .impressions,
                            false,
                            'impressions',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.dsp_ad_performance &&
                            item.dsp_ad_performance.current_sum &&
                            item.dsp_ad_performance.current_sum.impressions
                              ? `$${item.dsp_ad_performance.current_sum.impressions
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.dsp_ad_performance &&
                            item.dsp_ad_performance.previous_sum &&
                            item.dsp_ad_performance.previous_sum.impressions
                              ? `$${item.dsp_ad_performance.previous_sum.impressions
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                        </div>
                        <div className="straight-line horizontal-line spacing" />
                        <div className="col-6">
                          <div className="card-label">DSP Spend</div>
                          {renderAdPerformanceDifference(
                            item &&
                              item.dsp_ad_performance &&
                              item.dsp_ad_performance.difference_data &&
                              item.dsp_ad_performance.difference_data.dsp_spend,
                            true,
                            'dsp_spend',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.dsp_ad_performance &&
                            item.dsp_ad_performance.current_sum &&
                            item.dsp_ad_performance.current_sum.dsp_spend
                              ? `$${item.dsp_ad_performance.current_sum.dsp_spend
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.dsp_ad_performance &&
                            item.dsp_ad_performance.previous_sum &&
                            item.dsp_ad_performance.previous_sum.dsp_spend
                              ? `$${item.dsp_ad_performance.previous_sum.dsp_spend
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                        </div>
                        <div className="straight-line horizontal-line spacing" />

                        <div className="col-6">
                          <div className="card-label">TOTAL PRODUCT SALES</div>
                          {renderAdPerformanceDifference(
                            item &&
                              item.dsp_ad_performance &&
                              item.dsp_ad_performance.difference_data &&
                              item.dsp_ad_performance.difference_data
                                .total_product_sales,
                            false,
                            'total_product_sales',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.dsp_ad_performance &&
                            item.dsp_ad_performance.current_sum &&
                            item.dsp_ad_performance.current_sum
                              .total_product_sales
                              ? item.dsp_ad_performance.current_sum.total_product_sales
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              : 0}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.dsp_ad_performance &&
                            item.dsp_ad_performance.previous_sum &&
                            item.dsp_ad_performance.previous_sum
                              .total_product_sales
                              ? item.dsp_ad_performance.previous_sum.total_product_sales
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              : 0}
                          </div>
                        </div>

                        <div className="straight-line horizontal-line spacing" />
                        <div className="col-6">
                          <div className="card-label">TOTAL ROAS</div>
                          {renderAdPerformanceDifference(
                            item &&
                              item.dsp_ad_performance &&
                              item.dsp_ad_performance.difference_data &&
                              item.dsp_ad_performance.difference_data
                                .total_roas,
                            false,
                            'total_roas',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price">
                            {item &&
                            item.dsp_ad_performance &&
                            item.dsp_ad_performance.current_sum &&
                            item.dsp_ad_performance.current_sum.total_roas
                              ? `${item.dsp_ad_performance.current_sum.total_roas.toFixed(
                                  2,
                                )}%`
                              : '0%'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.dsp_ad_performance &&
                            item.dsp_ad_performance.previous_sum &&
                            item.dsp_ad_performance.previous_sum.total_roas
                              ? `${item.dsp_ad_performance.previous_sum.total_roas.toFixed(
                                  2,
                                )}%`
                              : '0%'}
                          </div>
                        </div>
                      </div>
                    </WhiteCard>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </DashboardCard>
    </BrandPartnerDashboard>
  );
}

export default DspAdDashboard;
