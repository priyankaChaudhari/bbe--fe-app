import React from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import Theme from '../../theme/Theme';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
  CheckFileIcon,
  EditFileIcon,
  CountDayClock,
  FileIcon,
  UpDowGrayArrow,
} from '../../theme/images/index';
import { PATH_AGREEMENT, PATH_CUSTOMER_DETAILS } from '../../constants';
import { CommonPagination, PageLoader, WhiteCard } from '../../common';
import { getcontract } from '../../api/AgreementApi';

export default function CustomerListTablet({
  data,
  history,
  count,
  pageNumber,
  handlePageChange,
  isLoading,
  showPerformance,
  showAdPerformance,
}) {
  const countDays = (item) => {
    const date1 = new Date();
    const date2 = new Date(item && item.contract && item.contract.end_date);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const redirectIfContractExists = (type, id) => {
    getcontract(type.contract_id).then((res) => {
      if (res && res.status === 200) {
        if (res && res.data && res.data.contract_url) {
          history.push({
            pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
              ':contract_id',
              type.contract_id,
            )}`,
          });
        }
      }
    });
  };

  const generateContractHTML = (type, id) => {
    if (
      countDays(type.end_date) <= 90 &&
      type.contract_type !== 'one time' &&
      type.contract_status !== 'inactive'
    ) {
      return (
        <li
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service count-days">
            {type.contract_type} Service Agreement
            <span className=" active-contract-icon count-clock-icon">
              <img className="clock-icon" src={CountDayClock} alt="clock" />
              {countDays(type.end_date)}d
            </span>
          </div>
        </li>
      );
    }
    if (type && type.contract_status === 'pending contract') {
      return (
        <li
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service file">
            {type.contract_type} Service Agreement
            <span className=" active-contract-icon file-icon">
              <img src={FileIcon} alt="file" />{' '}
            </span>
          </div>
        </li>
      );
    }
    if (type && type.contract_status === 'pending contract approval') {
      return (
        <li
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service file-check">
            {type.contract_type} Service Agreement
            <span className=" active-contract-icon file-check-icon">
              <img
                className="clock-icon"
                src={CheckFileIcon}
                alt="check-file"
              />{' '}
            </span>
          </div>
        </li>
      );
    }
    if (type && type.contract_status === 'pending contract signature') {
      return (
        <li
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service edit">
            {type.contract_type} Service Agreement
            <span className=" active-contract-icon edit-file-icon">
              <img width="16px" src={EditFileIcon} alt="edit" />{' '}
            </span>
          </div>
        </li>
      );
    }
    if (type && type.contract_status === 'active') {
      return (
        <li
          data-tip="Signed"
          style={{ textTransform: 'capitalize' }}
          onClickCapture={(e) => {
            e.stopPropagation();
            redirectIfContractExists(type, id);
            // history.push(PATH_AGREEMENT.replace(':id', id));
            // localStorage.setItem('agreementID', type.contract_id);
          }}
          role="presentation">
          <div className="recurring-service agreement">
            {type.contract_type} Service Agreement
          </div>
        </li>
      );
    }
    return (
      <li
        onClickCapture={(e) => {
          e.stopPropagation();
          redirectIfContractExists(type, id);
          // history.push(PATH_AGREEMENT.replace(':id', id));
          // localStorage.setItem('agreementID', type.contract_id);
        }}
        role="presentation"
        data-tip={type.contract_status}
        style={{ textTransform: 'capitalize' }}>
        <div className="recurring-service agreement">
          {type.contract_type} Service Agreement
        </div>
      </li>
    );
  };

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
            <span className="decrease-rate ml-1">
              {' '}
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
              {percentage
                ? `${Number(percentage.toString().split('-')[1]).toFixed(2)} %`
                : ''}
            </span>
          </>
        );
      }
      return (
        <span className="increase-rate ml-1">
          <img
            className="green-arrow"
            src={ArrowUpIcon}
            width="14px"
            alt="arrow-up"
          />
          {percentage ? `${percentage.toFixed(2)} %` : ''}
        </span>
      );
    }
    return '';
  };

  const renderAdPerformanceDifference = (value, grayArrow = false) => {
    if (value) {
      if (value.toString().includes('-')) {
        return (
          <>
            <span
              className={
                grayArrow ? 'decrease-rate grey ml-1' : 'decrease-rate ml-1 '
              }>
              {' '}
              <img
                className="red-arrow"
                src={grayArrow ? UpDowGrayArrow : ArrowDownIcon}
                alt="arrow-up"
              />
              {value
                ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
                : ''}
            </span>
          </>
        );
      }
      return (
        <span
          className={
            grayArrow ? 'increase-rate grey ml-1' : 'increase-rate ml-1 '
          }>
          <img
            className="green-arrow"
            src={grayArrow ? UpDowGrayArrow : ArrowUpIcon}
            width="14px"
            alt="arrow-up"
          />
          {value ? `${value.toFixed(2)} %` : ''}
        </span>
      );
    }
    return '';
  };

  const renderCustomerDetails = (item) => {
    if (showPerformance) {
      return (
        <WhiteCard className="mt-2">
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

          <div className="company-name">{item && item.company_name}</div>
          <div className="status" style={{ textTransform: 'capitalize' }}>
            {item && item.status}
          </div>
          <div className="clear-fix" />
          <div className=" straight-line horizontal-line pt-3 mb-3 " />

          <div className="row">
            <div className="col-6 pb-2">
              <div className="label">Revenue</div>
              <div className="label-info ">
                <>
                  $
                  {item &&
                    item.daily_facts &&
                    item.daily_facts.current &&
                    item.daily_facts.current.length &&
                    item.daily_facts.current
                      .map((rev) => (rev.revenue === null ? 0 : rev.revenue))
                      .reduce((val, rev) => rev + val)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                </>
              </div>
            </div>
            <div className="col-6 pb-2">
              <div className="label">Units Sold</div>
              <div className="label-info ">
                <>
                  {item &&
                    item.daily_facts &&
                    item.daily_facts.current &&
                    item.daily_facts.current.length &&
                    item.daily_facts.current
                      .map((rev) =>
                        rev.units_sold === null ? 0 : rev.units_sold,
                      )
                      .reduce((val, rev) => rev + val)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                </>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="label">Traffic</div>
              <div className="label-info">
                <>
                  $
                  {item &&
                    item.daily_facts &&
                    item.daily_facts.current &&
                    item.daily_facts.current.length &&
                    item.daily_facts.current
                      .map((rev) => (rev.traffic === null ? 0 : rev.traffic))
                      .reduce((val, rev) => rev + val)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                </>
              </div>
            </div>

            <div className="col-6">
              <div className="label">Conversion</div>
              <div className="label-info">
                <>
                  $
                  {item &&
                    item.daily_facts &&
                    item.daily_facts.current &&
                    item.daily_facts.current.length &&
                    item.daily_facts.current
                      .map((rev) =>
                        rev.conversion === null ? 0 : rev.conversion,
                      )
                      .reduce((val, rev) => rev + val)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  %
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
                </>
              </div>
            </div>

            <div className="straight-line horizontal-line pt-3 " />

            <div className="col-12 mt-3">
              <div className="label">Brand Strategist</div>
              <div className="label-info">
                {' '}
                {item &&
                  item.brand_growth_strategist &&
                  item.brand_growth_strategist.first_name}{' '}
                {item &&
                  item.brand_growth_strategist &&
                  item.brand_growth_strategist.last_name}
              </div>
            </div>
          </div>
        </WhiteCard>
      );
    }
    if (showAdPerformance) {
      return (
        <WhiteCard className="mt-2">
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

          <div className="company-name">{item && item.company_name}</div>
          <div className="status" style={{ textTransform: 'capitalize' }}>
            {item && item.status}
          </div>
          <div className="clear-fix" />
          <div className=" straight-line horizontal-line pt-3 mb-3 " />

          <div className="row">
            <div className="col-6 pb-2">
              <div className="label">Ad Sales</div>
              <div className="label-info ">
                <>
                  {item &&
                  item.ad_performace &&
                  item.ad_performace.current_sum &&
                  item.ad_performace.current_sum.ad_sales
                    ? `$${item.ad_performace.current_sum.ad_sales
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    : '$0'}
                  {renderAdPerformanceDifference(
                    item &&
                      item.ad_performace &&
                      item.ad_performace.difference_data &&
                      item.ad_performace.difference_data.ad_sales,
                  )}
                </>
              </div>
            </div>
            <div className="col-6 pb-2">
              <div className="label">Ad Spend</div>
              <div className="label-info ">
                <>
                  {item &&
                  item.ad_performace &&
                  item.ad_performace.current_sum &&
                  item.ad_performace.current_sum.ad_spend
                    ? `$${item.ad_performace.current_sum.ad_spend
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    : '$0'}
                  {renderAdPerformanceDifference(
                    item &&
                      item.ad_performace &&
                      item.ad_performace.difference_data &&
                      item.ad_performace.difference_data.ad_spend,
                    true,
                  )}
                </>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="label">Ad Impressions</div>
              <div className="label-info">
                <>
                  {item &&
                  item.ad_performace &&
                  item.ad_performace.current_sum &&
                  item.ad_performace.current_sum.impressions
                    ? item.ad_performace.current_sum.impressions
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                  {renderAdPerformanceDifference(
                    item &&
                      item.ad_performace &&
                      item.ad_performace.difference_data &&
                      item.ad_performace.difference_data.impressions,
                  )}
                </>
              </div>
            </div>

            <div className="col-6">
              <div className="label">Acos</div>
              <div className="label-info">
                <>
                  {item &&
                  item.ad_performace &&
                  item.ad_performace.current_sum &&
                  item.ad_performace.current_sum.acos
                    ? `${item.ad_performace.current_sum.acos.toFixed(2)}%`
                    : '0%'}
                  {renderAdPerformanceDifference(
                    item &&
                      item.ad_performace &&
                      item.ad_performace.difference_data &&
                      item.ad_performace.difference_data.acos,
                  )}
                </>
              </div>
            </div>

            <div className="straight-line horizontal-line pt-3 " />

            <div className="col-12 mt-3">
              <div className="label">Ad Manager</div>
              <div className="label-info">
                {' '}
                {item && item.ad_manager && item.ad_manager.first_name}{' '}
                {item && item.ad_manager && item.ad_manager.last_name}
              </div>
            </div>
          </div>
        </WhiteCard>
      );
    }
    // for- view contract details
    return (
      <WhiteCard className="mt-2">
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

        <div className="company-name">{item && item.company_name}</div>
        <div className="status" style={{ textTransform: 'capitalize' }}>
          {item && item.status}
        </div>
        <div className="clear-fix" />
        <div className=" straight-line horizontal-line pt-3 mb-3 " />

        <ul
          className="recurring-contact"
          style={{ textTransform: 'capitalize' }}>
          {item && item.contract && item.contract.length ? (
            item &&
            item.contract &&
            item.contract.map((type) => (
              <React.Fragment key={Math.random()}>
                <ReactTooltip />
                {generateContractHTML(type, item.id)}
              </React.Fragment>
            ))
          ) : (
            <li className="no-active-contract">No active contracts</li>
          )}
        </ul>

        <div className=" straight-line horizontal-line pt-3" />
        <div className="row">
          <div className="col-12 mt-3">
            <div className="label">Brand Strategist</div>
            <div className="label-info">
              {' '}
              {item &&
                item.brand_growth_strategist &&
                item.brand_growth_strategist.first_name}{' '}
              {item &&
                item.brand_growth_strategist &&
                item.brand_growth_strategist.last_name}
            </div>
          </div>
        </div>
      </WhiteCard>
    );
  };

  return (
    <CustomerListTabletView>
      <div className="row cursor">
        {data &&
          data.map((item) => (
            <div
              key={Math.random()}
              className="col-md-6 col-12"
              onClick={() =>
                history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
              }
              role="presentation">
              {isLoading.loader && isLoading.type === 'page' ? (
                <PageLoader color="#FF5933" type="page" />
              ) : (
                renderCustomerDetails(item)
                // <WhiteCard className="mt-2">
                //   <img
                //     className="company-logo"
                //     src={
                //       item &&
                //       item.documents &&
                //       item.documents[0] &&
                //       Object.values(item.documents[0])
                //         ? Object.values(item.documents[0])[0]
                //         : CompanyDefaultUser
                //     }
                //     alt="logo"
                //   />

                //   <div className="company-name">
                //     {item &&
                //       item.contract &&
                //       item.contract[0] &&
                //       item.contract[0].contract_company_name}
                //   </div>
                //   <div
                //     className="status"
                //     style={{ textTransform: 'capitalize' }}>
                //     {item && item.status}
                //   </div>
                //   <div className="clear-fix" />
                //   <div className=" straight-line horizontal-line pt-3 mb-3 " />
                //   {showPerformance ? (
                //     <div className="row">
                //       <div className="col-6 pb-2">
                //         <div className="label">Revenue</div>
                //         <div className="label-info ">
                //           <>
                //             $
                //             {item &&
                //               item.daily_facts &&
                //               item.daily_facts.current &&
                //               item.daily_facts.current.length &&
                //               item.daily_facts.current
                //                 .map((rev) =>
                //                   rev.revenue === null ? 0 : rev.revenue,
                //                 )
                //                 .reduce((val, rev) => rev + val)
                //                 .toString()
                //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                //             {calculatePercentage(
                //               item &&
                //                 item.daily_facts &&
                //                 item.daily_facts.current &&
                //                 item.daily_facts.current.length
                //                 ? item.daily_facts.current
                //                     .map((rev) => rev.revenue)
                //                     .reduce((val, rev) => rev + val)
                //                 : 0,
                //               item &&
                //                 item.daily_facts &&
                //                 item.daily_facts.previous &&
                //                 item.daily_facts.previous.length
                //                 ? item.daily_facts.previous
                //                     .map((rev) => rev.revenue)
                //                     .reduce((val, rev) => rev + val)
                //                 : 0,
                //             )}
                //           </>
                //         </div>
                //       </div>
                //       <div className="col-6 pb-2">
                //         <div className="label">Units Sold</div>
                //         <div className="label-info ">
                //           <>
                //             {item &&
                //               item.daily_facts &&
                //               item.daily_facts.current &&
                //               item.daily_facts.current.length &&
                //               item.daily_facts.current
                //                 .map((rev) =>
                //                   rev.units_sold === null ? 0 : rev.units_sold,
                //                 )
                //                 .reduce((val, rev) => rev + val)
                //                 .toString()
                //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                //             {calculatePercentage(
                //               item &&
                //                 item.daily_facts &&
                //                 item.daily_facts.current &&
                //                 item.daily_facts.current.length
                //                 ? item.daily_facts.current
                //                     .map((rev) => rev.units_sold)
                //                     .reduce((val, rev) => rev + val)
                //                 : 0,
                //               item &&
                //                 item.daily_facts &&
                //                 item.daily_facts.previous &&
                //                 item.daily_facts.previous.length
                //                 ? item.daily_facts.previous
                //                     .map((rev) => rev.units_sold)
                //                     .reduce((val, rev) => rev + val)
                //                 : 0,
                //             )}
                //           </>
                //         </div>
                //       </div>
                //     </div>
                //   ) : (
                //     <>
                //       <ul
                //         className="recurring-contact"
                //         style={{ textTransform: 'capitalize' }}>
                //         {item && item.contract && item.contract.length ? (
                //           item &&
                //           item.contract &&
                //           item.contract.map((type) => (
                //             <React.Fragment key={Math.random()}>
                //               <ReactTooltip />
                //               {generateContractHTML(type, item.id)}
                //             </React.Fragment>
                //           ))
                //         ) : (
                //           <li className="no-active-contract">
                //             No active contracts
                //           </li>
                //         )}
                //       </ul>
                //     </>
                //   )}

                //   {!showPerformance ? (
                //     <div className=" straight-line horizontal-line pt-3" />
                //   ) : (
                //     ''
                //   )}
                //   <div className="row">
                //     {showPerformance ? (
                //       <div className="col-6">
                //         <div className="label">Traffic</div>
                //         <div className="label-info">
                //           <>
                //             $
                //             {item &&
                //               item.daily_facts &&
                //               item.daily_facts.current &&
                //               item.daily_facts.current.length &&
                //               item.daily_facts.current
                //                 .map((rev) =>
                //                   rev.traffic === null ? 0 : rev.traffic,
                //                 )
                //                 .reduce((val, rev) => rev + val)
                //                 .toString()
                //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                //             {calculatePercentage(
                //               item &&
                //                 item.daily_facts &&
                //                 item.daily_facts.current &&
                //                 item.daily_facts.current.length
                //                 ? item.daily_facts.current
                //                     .map((rev) => rev.traffic)
                //                     .reduce((val, rev) => rev + val)
                //                 : 0,
                //               item &&
                //                 item.daily_facts &&
                //                 item.daily_facts.previous &&
                //                 item.daily_facts.previous.length
                //                 ? item.daily_facts.previous
                //                     .map((rev) => rev.traffic)
                //                     .reduce((val, rev) => rev + val)
                //                 : 0,
                //             )}
                //           </>
                //         </div>
                //       </div>
                //     ) : (
                //       ''
                //     )}

                //     {showPerformance ? (
                //       <div className="col-6">
                //         <div className="label">Conversion</div>
                //         <div className="label-info">
                //           <>
                //             $
                //             {item &&
                //               item.daily_facts &&
                //               item.daily_facts.current &&
                //               item.daily_facts.current.length &&
                //               item.daily_facts.current
                //                 .map((rev) =>
                //                   rev.conversion === null ? 0 : rev.conversion,
                //                 )
                //                 .reduce((val, rev) => rev + val)
                //                 .toString()
                //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                //             %
                //             {calculatePercentage(
                //               item &&
                //                 item.daily_facts &&
                //                 item.daily_facts.current &&
                //                 item.daily_facts.current.length
                //                 ? item.daily_facts.current
                //                     .map((rev) => rev.conversion)
                //                     .reduce((val, rev) => rev + val)
                //                 : 0,
                //               item &&
                //                 item.daily_facts &&
                //                 item.daily_facts.previous &&
                //                 item.daily_facts.previous.length
                //                 ? item.daily_facts.previous
                //                     .map((rev) => rev.conversion)
                //                     .reduce((val, rev) => rev + val)
                //                 : 0,
                //               'conversion',
                //             )}
                //           </>
                //         </div>
                //       </div>
                //     ) : (
                //       ''
                //     )}
                //     {showPerformance ? (
                //       <div className="straight-line horizontal-line pt-3 " />
                //     ) : (
                //       ''
                //     )}
                //     <div className="col-12 mt-3">
                //       <div className="label">Brand Strategist</div>
                //       <div className="label-info">
                //         {' '}
                //         {item &&
                //           item.brand_growth_strategist &&
                //           item.brand_growth_strategist.first_name}{' '}
                //         {item &&
                //           item.brand_growth_strategist &&
                //           item.brand_growth_strategist.last_name}
                //       </div>
                //     </div>
                //   </div>
                // </WhiteCard>
              )}
            </div>
          ))}
      </div>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <CommonPagination
          count={count}
          pageNumber={pageNumber}
          handlePageChange={handlePageChange}
        />
      )}
    </CustomerListTabletView>
  );
}

CustomerListTablet.defaultProps = {
  count: null,
  pageNumber: 1,
  handlePageChange: () => {},
  showPerformance: false,
  showAdPerformance: false,
};

CustomerListTablet.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.shape({
    length: PropTypes.number,
    push: PropTypes.func,
  }).isRequired,
  count: PropTypes.number,
  pageNumber: PropTypes.number,
  handlePageChange: PropTypes.func,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  showPerformance: PropTypes.bool,
  showAdPerformance: PropTypes.bool,
};

const CustomerListTabletView = styled.div`
  background: ${Theme.gray6};
  height: 100%;
  padding-top: 130px;

  .black-heading-title {
    font-size: ${Theme.extraNormal};
  }
  .solid-icon {
    width: 36px;
    margin-right: 15px;
  }
  .recurring-contact {
    li {
      margin-right: 7px;
      margin-bottom: 6px;

      .recurring-service {
        border: 1px solid ${Theme.gray45};
        border-radius: 5px;
        border: none;
        padding: 10px 4px 10px 12px;
        color: ${Theme.gray85};
        font-size: 14px;
        // flex-wrap: wrap;
        // flex: initial;
        // height: 100%;

        &.agreement {
          border: 1px solid ${Theme.gray45};
          padding: 9px 12px;
          background-color: ${Theme.white};
        }

        &.edit {
          background: ${Theme.lightPink};
        }

        &.count-days {
          background: ${Theme.lighterOrange};
        }

        &.file-check {
          background: ${Theme.extraLightYellow};
        }

        &.file {
          background: ${Theme.gray8};
        }

        .active-contract-icon {
          padding: 8px 10px;
          border-radius: 3px;
          margin-left: 10px;
          font-size: 14px;

          &.edit-file-icon {
            background: ${Theme.pink};

            img {
              vertical-align: middle;
              width: 16px;
            }
          }
          &.count-clock-icon {
            background: ${Theme.extraLighOrange};
            margin-left: 10px;

            img {
              vertical-align: text-top;
              width: 14px;
              margin-right: 3px;
            }
          }
          &.file-check-icon {
            background: ${Theme.lightYellow};
            img {
              vertical-align: text-top;
              width: 13px;
            }
          }
          &.file-icon {
            background: ${Theme.gray12};

            img {
              vertical-align: text-top;
              width: 14px;
            }
          }
        }
      }
      &.no-active-contract {
        color: ${Theme.gray40};
        font-size: 14px;
        text-transform: initial;
      }
    }
  }
  .company-logo {
    border-radius: 10px;
    width: 45px;
    height: 45px;
    margin-right: 14px;
    float: left;
  }
  .company-name {
    vertical-align: middle;
    position: relative;
    color: ${Theme.black};
    font-size: ${Theme.title};
    font-weight: 600;
  }

  .status {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
  }
  .label-info {
    font-weight: 600;
  }
  .increase-rate {
    color: ${Theme.lighterGreen};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
    img {
      vertical-align: bottom;
    }
    &.grey {
      color: ${Theme.gray40};
    }
  }
  .decrease-rate {
    color: ${Theme.darkRed};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
    .red-arrow {
      width: 14px;
      transform: rotate(180deg);
      vertical-align: middle;
    }
    &.grey {
      color: ${Theme.gray40};
    }
  }
  @media (max-width: 991px) {
    padding-top: 195px;
  }
  @media (max-width: 767px) {
    padding-top: 300px;
  }
`;
