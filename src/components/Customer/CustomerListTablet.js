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
  showContractDetails,
  showPerformance,
  showAdPerformance,
  showDspAdPerformance,
  showContracts,
  setShowContracts,
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
          <span className={grayArrow ? 'increase-rate grey' : 'increase-rate'}>
            <img
              className="green-arrow"
              src={grayArrow ? UpDowGrayArrow : ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {value}
          </span>
        </>
      );
    }
    return '';
  };
  const generateLogoCompanyNameAndGs = (item, name, bgs) => {
    return (
      <>
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
        <div className="company-name">{name}</div>
        <div className="user-name">
          {bgs.first_name} {bgs.last_name}
        </div>
      </>
    );
  };
  const generatePerformance = (value, toFixedValue, isTwiceReplace, prefix) => {
    if (isTwiceReplace) {
      return value
        ? `${
            prefix +
            value
              .toFixed(toFixedValue)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              .replace('.00', '')
          }`
        : `${prefix}0`;
    }
    return value
      ? `${prefix === '$' ? '$' : ''} ${value
          .toFixed(toFixedValue)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${prefix === '%' ? '%' : ''}`
      : `${prefix === '$' ? '$0' : prefix === '%' ? '0%' : 0}`;
  };

  const showContractsList = (item) => {
    const contractLength = item.contract.length;
    const reduceContractLength = item.contract.length - 2;

    return (
      <ul className="recurring-contact" style={{ textTransform: 'capitalize' }}>
        {item && item.contract && item.contract.length ? (
          <>
            {!showContracts
              ? item.contract.slice(0, 2).map((type) => (
                  <React.Fragment key={Math.random()}>
                    <ReactTooltip />
                    {generateContractHTML(type, item.id)}
                  </React.Fragment>
                ))
              : item.contract.map((type) => (
                  <React.Fragment key={Math.random()}>
                    <ReactTooltip />
                    {generateContractHTML(type, item.id)}
                  </React.Fragment>
                ))}
          </>
        ) : (
          <li className="no-active-contract">No active contracts</li>
        )}
        {reduceContractLength > 0 ? (
          <span
            onClickCapture={(e) => {
              e.stopPropagation();
              setShowContracts(!showContracts);
            }}
            aria-hidden="true">
            {showContracts ? 'show less' : `+ ${contractLength - 2} more`}
          </span>
        ) : (
          ''
        )}
      </ul>
    );
  };
  const generateContractDetails = (item) => {
    return (
      <WhiteCard className="mt-2">
        {generateLogoCompanyNameAndGs(
          item,
          item && item.company_name,
          item && item.brand_growth_strategist,
        )}
        <div className="clear-fix" />
        <div className=" straight-line horizontal-line pt-3 mb-3 " />
        {showContractsList(item)}
      </WhiteCard>
    );
  };
  const renderCustomerDetails = (item) => {
    if (showPerformance) {
      return (
        <WhiteCard className="mt-2">
          {generateLogoCompanyNameAndGs(
            item,
            item && item.company_name,
            item && item.brand_growth_strategist,
          )}
          <div className="clear-fix" />
          <div className=" straight-line horizontal-line pt-3 mb-3 " />

          <div className="row">
            <div className="col-6 pb-2">
              <div className="label">Revenue</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.current_sum &&
                      item.sales_performance.current_sum.revenue,
                    2,
                    'isTwiceReplace',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.difference_data &&
                      item.sales_performance.difference_data.revenue,
                    false,
                    'revenue',
                  )}
                </>
              </div>
            </div>
            <div className="col-6 pb-2">
              <div className="label">Units Sold</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.current_sum &&
                      item.sales_performance.current_sum.units_sold,
                    0,
                    '',
                    '',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.difference_data &&
                      item.sales_performance.difference_data.units_sold,
                    false,
                    'units_sold',
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
                  {generatePerformance(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.current_sum &&
                      item.sales_performance.current_sum.traffic,
                    0,
                    '',
                    '',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.difference_data &&
                      item.sales_performance.difference_data.traffic,
                    false,
                    'traffic',
                  )}
                </>
              </div>
            </div>

            <div className="col-6">
              <div className="label">Conversion</div>
              <div className="label-info">
                <>
                  {generatePerformance(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.current_sum &&
                      item.sales_performance.current_sum.conversion,
                    2,
                    '',
                    '%',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.difference_data &&
                      item.sales_performance.difference_data.conversion,
                    false,
                    'conversion',
                  )}
                </>
              </div>
            </div>

            <div className="straight-line horizontal-line pt-3 " />
          </div>
        </WhiteCard>
      );
    }
    if (showAdPerformance) {
      return (
        <WhiteCard className="mt-2">
          {generateLogoCompanyNameAndGs(
            item,
            item && item.company_name,
            item && item.ad_manager,
          )}
          <div className="clear-fix" />
          <div className=" straight-line horizontal-line pt-3 mb-3 " />

          <div className="row">
            <div className="col-6 pb-2">
              <div className="label">Ad Sales</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.current_sum &&
                      item.sponsored_ad_performance.current_sum.ad_sales,
                    2,
                    '',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.difference_data &&
                      item.sponsored_ad_performance.difference_data.ad_sales,
                    false,
                    'AdSales',
                  )}
                </>
              </div>
            </div>
            <div className="col-6 pb-2">
              <div className="label">Ad Spend</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.current_sum &&
                      item.sponsored_ad_performance.current_sum.ad_spend,
                    2,
                    '',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.difference_data &&
                      item.sponsored_ad_performance.difference_data.ad_spend,
                    true,
                    'AdSpend',
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
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.current_sum &&
                  item.sponsored_ad_performance.current_sum.impressions
                    ? item.sponsored_ad_performance.current_sum.impressions
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.difference_data &&
                      item.sponsored_ad_performance.difference_data.impressions,
                    false,
                    'AdImpressions',
                  )}
                </>
              </div>
            </div>

            <div className="col-6">
              <div className="label">Acos</div>
              <div className="label-info">
                <>
                  {item &&
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.current_sum &&
                  item.sponsored_ad_performance.current_sum.acos
                    ? `${item.sponsored_ad_performance.current_sum.acos.toFixed(
                        2,
                      )}%`
                    : '0%'}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.difference_data &&
                      item.sponsored_ad_performance.difference_data.acos,
                    false,
                    'ACOS',
                  )}
                </>
              </div>
            </div>
          </div>
        </WhiteCard>
      );
    }
    if (showDspAdPerformance) {
      return (
        <WhiteCard className="mt-2">
          {generateLogoCompanyNameAndGs(
            item,
            item && item.company_name,
            item && item.ad_manager,
          )}
          <div className="clear-fix" />
          <div className=" straight-line horizontal-line pt-3 mb-3 " />

          <div className="row">
            <div className="col-6 pb-2">
              <div className="label">IMPRESSIONS</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item.dsp_ad_performance &&
                      item.dsp_ad_performance.current_sum &&
                      item.dsp_ad_performance.current_sum.impressions,
                    2,
                    '',
                    '',
                  )}

                  {renderAdPerformanceDifference(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.difference_data &&
                      item.dsp_ad_performance.difference_data.impressions,
                    false,
                    'impressions',
                  )}
                </>
              </div>
            </div>
            <div className="col-6 pb-2">
              <div className="label">DSP Spend</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.current_sum &&
                      item.dsp_ad_performance.current_sum.dsp_spend,
                    2,
                    '',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.difference_data &&
                      item.dsp_ad_performance.difference_data.dsp_spend,
                    true,
                    'DspSpend',
                  )}
                </>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="label">Total Product Sales</div>
              <div className="label-info">
                <>
                  {generatePerformance(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.current_sum &&
                      item.dsp_ad_performance.current_sum.total_product_sales,
                    2,
                    '',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.difference_data &&
                      item.dsp_ad_performance.difference_data
                        .total_product_sales,
                    false,
                    'totalProductSales',
                  )}
                </>
              </div>
            </div>

            <div className="col-6">
              <div className="label">ROAS</div>
              <div className="label-info">
                <>
                  {item &&
                  item.dsp_ad_performance &&
                  item.dsp_ad_performance.current_sum &&
                  item.dsp_ad_performance.current_sum.total_roas
                    ? item.dsp_ad_performance.current_sum.total_roas.toFixed(2)
                    : '0'}
                  {renderAdPerformanceDifference(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.difference_data &&
                      item.dsp_ad_performance.difference_data.total_roas,
                    false,
                    'totalRoas',
                  )}
                </>
              </div>
            </div>
          </div>
        </WhiteCard>
      );
    }

    // for- view contract details
    if (showContractDetails) {
      return <>{generateContractDetails(item)}</>;
    }
    return <>{generateContractDetails(item)}</>;
  };

  return (
    <CustomerListTabletView>
      <div className="container-fluid">
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
                )}
              </div>
            ))}
        </div>
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
  showDspAdPerformance: false,
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
  showContractDetails: PropTypes.bool.isRequired,
  showPerformance: PropTypes.bool,
  showAdPerformance: PropTypes.bool,
  showDspAdPerformance: PropTypes.bool,
  showContracts: PropTypes.bool.isRequired,
  setShowContracts: PropTypes.func.isRequired,
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
  @media (max-width: 996px) {
    padding-top: 195px;
  }
  @media (max-width: 767px) {
    padding-top: 300px;
  }
`;
