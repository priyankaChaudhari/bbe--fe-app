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
} from '../../theme/images';
import { PATH_CUSTOMER_DETAILS } from '../../constants';
import NoRecordFound from '../../common/NoRecordFound';

export default function Dashboard({ isLoading, data }) {
  const history = useHistory();

  const calculatePercentage = (current, previous, type) => {
    if (current && previous) {
      let percentage = '';
      if (type === 'conversion') {
        const diff = current - previous;
        percentage = diff / 2;
      }
      const diff = current - previous;
      const mean = diff / previous;
      percentage = mean * 100;

      if (percentage.toString().includes('-')) {
        return (
          <>
            <div className="decrease-rate">
              {' '}
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
              {percentage
                ? `${Number(percentage.toString().split('-')[1]).toFixed(2)} %`
                : ''}
            </div>
          </>
        );
      }
      return (
        <>
          <div className="increase-rate">
            <img
              className="green-arrow "
              src={ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {percentage ? `${percentage.toFixed(2)} %` : ''}
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
                          <div className="card-label">Revenue</div>
                          {calculatePercentage(
                            item &&
                              item.daily_facts &&
                              item.daily_facts.current &&
                              item.daily_facts.current.length
                              ? item.daily_facts.current
                                  .map((rev) => rev.revenue)
                                  .reduce((val, rev) => rev + val)
                              : 0,
                            item &&
                              item.daily_facts &&
                              item.daily_facts.previous &&
                              item.daily_facts.previous.length
                              ? item.daily_facts.previous
                                  .map((rev) => rev.revenue)
                                  .reduce((val, rev) => rev + val)
                              : 0,
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.current &&
                            item.daily_facts.current.length ? (
                              <>
                                $
                                {item.daily_facts.current
                                  .map((rev) => rev.revenue)
                                  .reduce((val, rev) => rev + val)
                                  ? item.daily_facts.current
                                      .map((rev) => rev.revenue)
                                      .reduce((val, rev) => rev + val)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                              </>
                            ) : (
                              0
                            )}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.previous &&
                            item.daily_facts.previous.length ? (
                              <>
                                $
                                {item.daily_facts.previous
                                  .map((rev) => rev.revenue)
                                  .reduce((val, rev) => rev + val)
                                  ? item.daily_facts.previous
                                      .map((rev) => rev.revenue)
                                      .reduce((val, rev) => rev + val)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                              </>
                            ) : (
                              0
                            )}
                          </div>
                        </div>
                        <div className="straight-line horizontal-line spacing" />
                        <div className="col-6">
                          <div className="card-label">Units Sold</div>
                          {calculatePercentage(
                            item &&
                              item.daily_facts &&
                              item.daily_facts.current &&
                              item.daily_facts.current.length
                              ? item.daily_facts.current
                                  .map((rev) => rev.units_sold)
                                  .reduce((val, rev) => rev + val)
                              : 0,
                            item &&
                              item.daily_facts &&
                              item.daily_facts.previous &&
                              item.daily_facts.previous.length
                              ? item.daily_facts.previous
                                  .map((rev) => rev.units_sold)
                                  .reduce((val, rev) => rev + val)
                              : 0,
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.current &&
                            item.daily_facts.current.length ? (
                              <>
                                {item.daily_facts.current
                                  .map((rev) => rev.units_sold)
                                  .reduce((val, rev) => rev + val)
                                  ? item.daily_facts.current
                                      .map((rev) => rev.units_sold)
                                      .reduce((val, rev) => rev + val)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                              </>
                            ) : (
                              0
                            )}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.previous &&
                            item.daily_facts.previous.length ? (
                              <>
                                {item.daily_facts.previous
                                  .map((rev) => rev.units_sold)
                                  .reduce((val, rev) => rev + val)
                                  ? item.daily_facts.previous
                                      .map((rev) => rev.units_sold)
                                      .reduce((val, rev) => rev + val)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                              </>
                            ) : (
                              0
                            )}
                          </div>
                        </div>
                        <div className="straight-line horizontal-line spacing" />

                        <div className="col-6">
                          <div className="card-label">Traffic</div>
                          {calculatePercentage(
                            item &&
                              item.daily_facts &&
                              item.daily_facts.current &&
                              item.daily_facts.current.length
                              ? item.daily_facts.current
                                  .map((rev) => rev.traffic)
                                  .reduce((val, rev) => rev + val)
                              : 0,
                            item &&
                              item.daily_facts &&
                              item.daily_facts.previous &&
                              item.daily_facts.previous.length
                              ? item.daily_facts.previous
                                  .map((rev) => rev.traffic)
                                  .reduce((val, rev) => rev + val)
                              : 0,
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.current &&
                            item.daily_facts.current.length ? (
                              <>
                                {item.daily_facts.current
                                  .map((rev) => rev.traffic)
                                  .reduce((val, rev) => rev + val)
                                  ? item.daily_facts.current
                                      .map((rev) => rev.traffic)
                                      .reduce((val, rev) => rev + val)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                              </>
                            ) : (
                              0
                            )}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.previous &&
                            item.daily_facts.previous.length ? (
                              <>
                                {item.daily_facts.previous
                                  .map((rev) => rev.traffic)
                                  .reduce((val, rev) => rev + val)
                                  ? item.daily_facts.previous
                                      .map((rev) => rev.traffic)
                                      .reduce((val, rev) => rev + val)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                              </>
                            ) : (
                              0
                            )}
                          </div>
                        </div>

                        <div className="straight-line horizontal-line spacing" />
                        <div className="col-6">
                          <div className="card-label">Conversion</div>
                          {calculatePercentage(
                            item &&
                              item.daily_facts &&
                              item.daily_facts.current &&
                              item.daily_facts.current.length
                              ? item.daily_facts.current
                                  .map((rev) => rev.conversion)
                                  .reduce((val, rev) => rev + val)
                              : 0,
                            item &&
                              item.daily_facts &&
                              item.daily_facts.previous &&
                              item.daily_facts.previous.length
                              ? item.daily_facts.previous
                                  .map((rev) => rev.conversion)
                                  .reduce((val, rev) => rev + val)
                              : 0,
                            'conversion',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price">
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.current &&
                            item.daily_facts.current.length ? (
                              <>
                                {item.daily_facts.current
                                  .map((rev) => rev.conversion)
                                  .reduce((val, rev) => rev + val)
                                  ? item.daily_facts.current
                                      .map((rev) => rev.conversion)
                                      .reduce((val, rev) => rev + val)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                                %
                              </>
                            ) : (
                              0
                            )}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.previous &&
                            item.daily_facts.previous.length ? (
                              <>
                                {item.daily_facts.previous
                                  .map((rev) => rev.conversion)
                                  .reduce((val, rev) => rev + val)
                                  ? item.daily_facts.previous
                                      .map((rev) => rev.conversion)
                                      .reduce((val, rev) => rev + val)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                                %
                              </>
                            ) : (
                              0
                            )}
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
