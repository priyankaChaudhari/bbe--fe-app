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
          <span className="recurring-service file">
            {type.contract_type} Service Agreement
            <span className="file-icon">
              <img src={FileIcon} alt="file" />{' '}
            </span>
          </span>
        </li>
      );
    }
    if (type && type.contract_status === 'pending contract approval') {
      return (
        <li>
          <span className="recurring-service file-check">
            {type.contract_type} Service Agreement
            <span className="file-check-icon">
              <img
                className="clock-icon"
                src={CheckFileIcon}
                alt="check-file"
              />{' '}
            </span>
          </span>
        </li>
      );
    }
    if (type && type.contract_status === 'pending contract signature') {
      return (
        <li>
          <span className="recurring-service edit">
            {type.contract_type} Service Agreement
            <span className="edit-file-icon">
              <img width="16px" src={EditFileIcon} alt="edit" />{' '}
            </span>
          </span>
        </li>
      );
    }
    if (countDays(type.end_date) <= 90) {
      return (
        <li>
          <span className="recurring-service count-days">
            {type.contract_type} Service Agreement
            <span className="count-clock-icon">
              <img className="clock-icon" src={CountDayClock} alt="clock" />
              {countDays(type.end_date)}d
            </span>
          </span>
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
                      ''
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
  @media (max-width: 767px) {
    padding-top: 190px;
  }
`;
