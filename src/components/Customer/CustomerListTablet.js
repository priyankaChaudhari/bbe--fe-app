import React from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Theme from '../../theme/Theme';
import { WhiteCard } from '../../theme/Global';
import {
  ClockIcon,
  RecurringIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
  ServiceIcon,
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
                      item.contract.contract_company_name}
                  </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    {item && item.contract && item.contract.contract_status}
                  </div>
                  <div className="clear-fix" />
                  <div className="straight-line horizontal-line pt-3 mb-3" />
                  {showPerformance ? (
                    <div className="row">
                      <div className="col-6 pb-2">
                        <div className="label">Revenue</div>
                        <div className="label-info ">
                          {item && item.contract && item.contract.rev_share} %
                          <span className="decrease-rate ml-1">
                            {' '}
                            <img
                              className="red-arrow"
                              src={ArrowDownIcon}
                              alt="arrow-up"
                            />
                            0.15%
                          </span>
                        </div>
                      </div>
                      <div className="col-6 pb-2">
                        <div className="label">Units Sold</div>
                        <div className="label-info ">
                          {item && item.contract && item.contract.rev_share} %
                          <span className="decrease-rate ml-1">
                            {' '}
                            <img
                              className="red-arrow"
                              src={ArrowDownIcon}
                              alt="arrow-up"
                            />
                            0.15%
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        className="black-heading-title mt-0 mb-0"
                        style={{ textTransform: 'capitalize' }}>
                        <img
                          className="solid-icon "
                          src={
                            item &&
                            item.contract &&
                            item.contract.contract_type === 'recurring'
                              ? RecurringIcon
                              : ServiceIcon
                          }
                          alt=""
                        />
                        {item.contract &&
                        item.contract &&
                        item.contract.contract_type
                          ? `${item.contract.contract_type} Contract`
                          : ''}
                      </p>
                      <ul className="recurring-contact mb-2">
                        <li>
                          <p className="basic-text ">
                            {' '}
                            {item && item.contract && item.contract.length}
                          </p>
                        </li>
                        {item && item.contract && item.contract.end_date ? (
                          <li>
                            <p className="basic-text ">
                              {' '}
                              Expires:{' '}
                              {dayjs(item.contract.end_date).format(
                                'MMM DD, YYYY',
                              )}
                            </p>
                          </li>
                        ) : (
                          ''
                        )}
                        {item && item.contract && item.contract.end_date ? (
                          <li>
                            <div className="days-block">
                              {' '}
                              <img
                                className="clock-icon"
                                src={ClockIcon}
                                alt="clock"
                              />{' '}
                              {countDays(item)} days
                            </div>
                          </li>
                        ) : (
                          ''
                        )}
                      </ul>
                    </>
                  )}

                  {!showPerformance ? (
                    <div className="straight-line horizontal-line pt-3 mb-3" />
                  ) : (
                    ''
                  )}
                  <div className="row">
                    {showPerformance ? (
                      <div className="col-6">
                        <div className="label">Traffic</div>
                        <div className="label-info">
                          23,234
                          <span className="increase-rate ml-1">
                            <img
                              width="14px"
                              src={ArrowUpIcon}
                              alt="arrow-up"
                            />{' '}
                            0.51%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="col-6">
                          <div className="label">Monthly Retainer</div>
                          <div className="label-info">
                            {item &&
                            item.contract &&
                            item.contract.monthly_retainer
                              ? `$ ${item.contract.monthly_retainer
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : ''}
                          </div>
                        </div>
                      </>
                    )}

                    {showPerformance ? (
                      <div className="col-6">
                        <div className="label">Conversion</div>
                        <div className="label-info">
                          23.4%
                          <span className="decrease-rate ml-1">
                            {' '}
                            <img
                              className="red-arrow"
                              src={ArrowDownIcon}
                              alt="arrow-up"
                            />
                            0.15%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="col-6">
                        <div className="label">Rev Share %</div>
                        <div className="label-info ">
                          {item && item.contract && item.contract.rev_share
                            ? `${item.contract.rev_share} %`
                            : ''}
                        </div>
                      </div>
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
      margin-right: 5px;
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
  @media (max-width: 768px) {
    padding-top: 190px;
  }
`;
