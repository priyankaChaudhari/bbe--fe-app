/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { PageLoader, WhiteCard } from '../../common';
import { DashboardCard, BrandPartnerDashboard } from '../../theme/Global';

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

export default function AdManagerDashboard({ isLoading, data }) {
  const history = useHistory();

  const renderAdPerformanceDifference = (actualValue, grayArrow, matrics) => {
    const value = actualValue;
    let selectedClass = '';
    let selectedArrow = '';

    if (value) {
      if (matrics === 'ACOS') {
        if (value.toString().includes('-')) {
          selectedClass = 'increase-rate';
          selectedArrow = ArrowUpIcon;
        } else {
          selectedClass = 'decrease-rate';
          selectedArrow = ArrowDownIcon;
        }
      } else if (grayArrow) {
        if (value.toString().includes('-')) {
          selectedClass = 'decrease-rate grey';
          selectedArrow = UpDowGrayArrow;
        } else {
          selectedClass = 'increase-rate grey';
          selectedArrow = UpDowGrayArrow;
        }
      } else if (value.toString().includes('-')) {
        selectedClass = 'decrease-rate';
        selectedArrow = ArrowDownIcon;
      } else {
        selectedClass = 'increase-rate';
        selectedArrow = ArrowUpIcon;
      }

      if (value.toString().includes('-')) {
        return (
          <>
            <span className={selectedClass}>
              {' '}
              <img className="red-arrow" src={selectedArrow} alt="arrow-up" />
              {`${Number(value.toString().split('-')[1]).toFixed(2)} %`}
            </span>
          </>
        );
      }

      return (
        <>
          <span className={selectedClass}>
            <img
              className="green-arrow"
              src={selectedArrow}
              width="14px"
              alt="arrow-up"
            />
            {value}
          </span>
        </>
      );
    }
    return '';
    // let flag = '';
    // let value = actualValue;
    // if (value) {
    //   if (matrics === 'ACOS') {
    //     if (value.toString().includes('-')) {
    //       flag = 'green';
    //       value = value
    //         ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
    //         : '';
    //     } else {
    //       flag = 'red';
    //       value = value ? `${value.toFixed(2)} %` : '';
    //     }
    //   } else if (value.toString().includes('-')) {
    //     flag = 'red';
    //     value = value
    //       ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
    //       : '';
    //   } else {
    //     flag = 'green';
    //     value = value ? `${value.toFixed(2)} %` : '';
    //   }

    //   if (flag === 'red') {
    //     return (
    //       <>
    //         <span
    //           className={grayArrow ? 'decrease-rate grey' : 'decrease-rate'}>
    //           {' '}
    //           <img
    //             className="red-arrow"
    //             src={grayArrow ? UpDowGrayArrow : ArrowDownIcon}
    //             alt="arrow-up"
    //           />
    //           {value}
    //         </span>
    //       </>
    //     );
    //   }
    //   return (
    //     <>
    //       <div className={grayArrow ? 'increase-rate grey' : 'increase-rate'}>
    //         <img
    //           className="green-arrow"
    //           src={grayArrow ? UpDowGrayArrow : ArrowUpIcon}
    //           width="14px"
    //           alt="arrow-up"
    //         />
    //         {value}
    //       </div>
    //     </>
    //   );
    // }
    // return '';
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
                    onClick={() =>
                      history.push(
                        PATH_CUSTOMER_DETAILS.replace(':id', item.id),
                        'adManager',
                      )
                    }
                    role="presentation">
                    <WhiteCard className="cursor">
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
                          <div className="card-label">Ad Sales</div>

                          {renderAdPerformanceDifference(
                            item &&
                              item.sponsored_ad_performance &&
                              item.sponsored_ad_performance.difference_data &&
                              item.sponsored_ad_performance.difference_data
                                .ad_sales,
                            false,
                            'AdSales',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.sponsored_ad_performance &&
                            item.sponsored_ad_performance.current_sum &&
                            item.sponsored_ad_performance.current_sum.ad_sales
                              ? `$${item.sponsored_ad_performance.current_sum.ad_sales
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.sponsored_ad_performance &&
                            item.sponsored_ad_performance.previous_sum &&
                            item.sponsored_ad_performance.previous_sum.ad_sales
                              ? `$${item.sponsored_ad_performance.previous_sum.ad_sales
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                        </div>
                        <div className="straight-line horizontal-line spacing" />
                        <div className="col-6">
                          <div className="card-label">ad Spend</div>
                          {renderAdPerformanceDifference(
                            item &&
                              item.sponsored_ad_performance &&
                              item.sponsored_ad_performance.difference_data &&
                              item.sponsored_ad_performance.difference_data
                                .ad_spend,
                            true,
                            'AdSpend',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.sponsored_ad_performance &&
                            item.sponsored_ad_performance.current_sum &&
                            item.sponsored_ad_performance.current_sum.ad_spend
                              ? `$${item.sponsored_ad_performance.current_sum.ad_spend
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.sponsored_ad_performance &&
                            item.sponsored_ad_performance.previous_sum &&
                            item.sponsored_ad_performance.previous_sum.ad_spend
                              ? `$${item.sponsored_ad_performance.previous_sum.ad_spend
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                        </div>
                        <div className="straight-line horizontal-line spacing" />

                        <div className="col-6">
                          <div className="card-label">Ad Impressions</div>
                          {renderAdPerformanceDifference(
                            item &&
                              item.sponsored_ad_performance &&
                              item.sponsored_ad_performance.difference_data &&
                              item.sponsored_ad_performance.difference_data
                                .impressions,
                            false,
                            'AdImpressions',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.sponsored_ad_performance &&
                            item.sponsored_ad_performance.current_sum &&
                            item.sponsored_ad_performance.current_sum
                              .impressions
                              ? item.sponsored_ad_performance.current_sum.impressions
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              : 0}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.sponsored_ad_performance &&
                            item.sponsored_ad_performance.previous_sum &&
                            item.sponsored_ad_performance.previous_sum
                              .impressions
                              ? item.sponsored_ad_performance.previous_sum.impressions
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              : 0}
                          </div>
                        </div>

                        <div className="straight-line horizontal-line spacing" />
                        <div className="col-6">
                          <div className="card-label">ACOS</div>
                          {renderAdPerformanceDifference(
                            item &&
                              item.sponsored_ad_performance &&
                              item.sponsored_ad_performance.difference_data &&
                              item.sponsored_ad_performance.difference_data
                                .acos,
                            false,
                            'ACOS',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price">
                            {item &&
                            item.sponsored_ad_performance &&
                            item.sponsored_ad_performance.current_sum &&
                            item.sponsored_ad_performance.current_sum.acos
                              ? `${item.sponsored_ad_performance.current_sum.acos.toFixed(
                                  2,
                                )}%`
                              : '0%'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.sponsored_ad_performance &&
                            item.sponsored_ad_performance.previous_sum &&
                            item.sponsored_ad_performance.previous_sum.acos
                              ? `${item.sponsored_ad_performance.previous_sum.acos.toFixed(
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
