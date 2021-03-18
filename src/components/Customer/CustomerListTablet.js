import React from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';

import Theme from '../../theme/Theme';
import { WhiteCard } from '../../theme/Global';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
  CheckFileIcon,
  EditFileIcon,
  CountDayClock,
  FileIcon,
} from '../../theme/images/index';
import { PATH_CUSTOMER_DETAILS } from '../../constants';
import { CommonPagination, PageLoader } from '../../common';

export default function CustomerListTablet({
  data,
  history,
  count,
  pageNumber,
  handlePageChange,
  isLoading,
  showPerformance,
}) {
  const countDays = (item) => {
    const date1 = new Date();
    const date2 = new Date(item && item.contract && item.contract.end_date);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const generateContractHTML = (type) => {
    if (type && type.contract_status === 'pending contract') {
      return (
        <li>
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
        <li>
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
        <li>
          <div className="recurring-service edit">
            {type.contract_type} Service Agreement
            <span className=" active-contract-icon edit-file-icon">
              <img width="16px" src={EditFileIcon} alt="edit" />{' '}
            </span>
          </div>
        </li>
      );
    }
    if (countDays(type.end_date) <= 90) {
      return (
        <li>
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
    return (
      <li>
        <div className="recurring-service agreement">
          {type.contract_type} Service Agreement
        </div>
      </li>
    );
  };

  const calculatePercentage = (current, previous) => {
    if (current && previous) {
      const diff = current - previous;
      const mean = diff / previous;
      const percentage = mean * 100;

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
        <div className="increase-rate">
          <img
            className="red-arrow"
            src={ArrowUpIcon}
            width="14px"
            alt="arrow-up"
          />
          {percentage ? `${percentage.toFixed(2)} %` : ''}
        </div>
      );
    }
    return '';
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

                  <div className="company-name">
                    {item &&
                      item.contract &&
                      item.contract[0] &&
                      item.contract[0].contract_company_name}
                  </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    {item && item.status}
                  </div>
                  <div className="clear-fix" />
                  <div className=" pt-4 " />
                  {showPerformance ? (
                    <div className="row">
                      <div className="col-6 pb-2">
                        <div className="label">Revenue</div>
                        <div className="label-info ">
                          <>
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.current &&
                            item.daily_facts.current[0] &&
                            item.daily_facts.current[0].revenue ? (
                              <>
                                {item.daily_facts.current[0].revenue}
                                {calculatePercentage(
                                  item.daily_facts.current[0].revenue,
                                  item.daily_facts.previous[0].revenue,
                                )}
                              </>
                            ) : (
                              ''
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
                            item.daily_facts.current[0] &&
                            item.daily_facts.current[0].units_sold ? (
                              <>
                                {item.daily_facts.current[0].units_sold}
                                {calculatePercentage(
                                  item.daily_facts.current[0].units_sold,
                                  item.daily_facts.previous[0].units_sold,
                                )}
                              </>
                            ) : (
                              ''
                            )}
                          </>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ul
                        className="recurring-contact"
                        style={{ textTransform: 'capitalize' }}>
                        {item &&
                          item.contract &&
                          item.contract.map((type) => (
                            <React.Fragment key={Math.random()}>
                              {generateContractHTML(type)}
                            </React.Fragment>
                          ))}
                      </ul>
                    </>
                  )}

                  {!showPerformance ? <div className=" " /> : ''}
                  <div className="row">
                    {showPerformance ? (
                      <div className="col-6">
                        <div className="label">Traffic</div>
                        <div className="label-info">
                          <>
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.current &&
                            item.daily_facts.current[0] &&
                            item.daily_facts.current[0].traffic ? (
                              <>
                                {item.daily_facts.current[0].traffic}
                                {calculatePercentage(
                                  item.daily_facts.current[0].traffic,
                                  item.daily_facts.previous[0].traffic,
                                )}
                              </>
                            ) : (
                              ''
                            )}
                          </>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}

                    {showPerformance ? (
                      <div className="col-6">
                        <div className="label">Conversion</div>
                        <div className="label-info">
                          <>
                            {item &&
                            item.daily_facts &&
                            item.daily_facts.current &&
                            item.daily_facts.current[0] &&
                            item.daily_facts.current[0].conversion ? (
                              <>
                                {item.daily_facts.current[0].conversion}
                                {calculatePercentage(
                                  item.daily_facts.current[0].conversion,
                                  item.daily_facts.previous[0].conversion,
                                )}
                              </>
                            ) : (
                              ''
                            )}
                          </>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    {showPerformance ? (
                      <div className="straight-line horizontal-line pt-3 mb-3" />
                    ) : (
                      ''
                    )}
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
  }
  @media (max-width: 991px) {
    padding-top: 145px;
  }
  @media (max-width: 767px) {
    padding-top: 190px;
  }
`;
