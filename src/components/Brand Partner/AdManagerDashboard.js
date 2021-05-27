/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import Select, { components } from 'react-select';

import dayjs from 'dayjs';
import {
  DropDownSelect,
  GetInitialName,
  PageLoader,
  WhiteCard,
} from '../../common';
import Theme from '../../theme/Theme';

import {
  RecurringIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ServiceIcon,
  CompanyDefaultUser,
  CaretUp,
} from '../../theme/images';
import getAdManagerCustomerList from '../../api/AdManagerApi';
import { getAdManagers } from '../../api';

// import { getGrowthStrategist } from '../../api';
import { PATH_CUSTOMER_DETAILS } from '../../constants';
import NoRecordFound from '../../common/NoRecordFound';

export default function AdManagerDashboard() {
  const history = useHistory();
  const userInfo = useSelector((state) => state.userState.userInfo);
  const { Option, SingleValue, MultiValue } = components;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [selectedValue, setSelectedValue] = useState({
    type: 'week',
    group: 'weekly',
    bgs: '',
  });
  const [brandGrowthStrategist, setBrandGrowthStrategist] = useState([]);

  const timeOptions = [
    { value: 'week', label: 'Recent Week', sub: 'vs Previous week' },
    { value: 'month', label: 'Recent Month', sub: 'vs Previous month' },
    { value: '30days', label: 'Recent 30 Days', sub: 'vs Previous 30 days' },
    { value: 'year', label: 'Year to Date', sub: 'vs previous year' },
    // {
    //   value: 'custom',
    //   label: 'Custom Range',
    //   sub: 'Select start and end dates',
    // },
  ];

  useEffect(() => {
    setIsLoading({ loader: true, type: 'page' });
    getAdManagerCustomerList(
      (selectedValue && selectedValue.bgs) || userInfo.id,
      selectedValue,
    ).then((response) => {
      setData(response && response.data && response.data.results);
      getAdManagers().then((gs) => {
        if (gs && gs.data) {
          const list = [];
          for (const brand of gs.data) {
            list.push({
              value: brand.id,
              label: `${brand.first_name} ${brand.last_name}`,
              icon:
                brand.documents &&
                brand.documents[0] &&
                Object.values(brand.documents[0]) &&
                Object.values(brand.documents[0])[0],
            });
            setBrandGrowthStrategist(list);
          }
        }
        setIsLoading({ loader: false, type: 'page' });
      });
    });
  }, [userInfo, selectedValue]);

  const filterOption = (props) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>
          {props.data.label}
        </span>

        <div style={{ fontSize: '12px', color: '#556178' }}>
          {props.data.sub}
        </div>
      </div>
    </Option>
  );

  const singleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
    </SingleValue>
  );

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };
  const IconOption = (props) => (
    <Option {...props}>
      {props.data.icon ? (
        <img
          className="drop-down-user"
          src={props.data.icon}
          alt="user"
          style={{
            borderRadius: 50,
            marginRight: '9px',
            height: '32px',
            verticalAlign: 'middle',
          }}
        />
      ) : (
        <GetInitialName
          userInfo={props.data.label}
          type="list"
          property="mr-2"
        />
      )}{' '}
      {props.data.label}
    </Option>
  );
  const IconSingleOption = (props) => (
    <MultiValue {...props}>
      {props.data.icon ? (
        <img
          className="drop-down-user"
          src={props.data.icon}
          alt="user"
          style={{
            borderRadius: 50,
            width: '32px',
            marginBottom: '',
            verticalAlign: 'middle',
          }}
        />
      ) : (
        <GetInitialName userInfo={props.data.label} type="list" property="" />
      )}{' '}
      &nbsp;
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {props.data.label}
      </span>
    </MultiValue>
  );

  const getSelectComponents = (type) => {
    if (type === 'user') {
      return {
        Option: IconOption,
        MultiValue: IconSingleOption,
        DropdownIndicator,
      };
    }
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropdownIndicator,
    };
  };

  const renderAdPerformanceDifference = (value) => {
    if (value) {
      if (value.toString().includes('-')) {
        return (
          <>
            <br />
            <span className="decrease-rate">
              {' '}
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
              {value
                ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
                : ''}
            </span>
          </>
        );
      }
      return (
        <>
          <br />
          <div className="increase-rate">
            <img
              className="green-arrow"
              src={ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {value ? `${value.toFixed(2)} %` : ''}
          </div>
        </>
      );
    }
    return '';
  };

  return (
    <BrandPartnerDashboard>
      <div className="dashboard-header-sticky">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <p className="black-heading-title ml-1 pt-1">
                {' '}
                Ad Manager Dashboard
              </p>
            </div>
            <div className="straight-line horizontal-line spacing d-md-none d-sm-block" />
            <div className="col-md-9 col-sm-12 text-md-right text-sm-left  mb-2 ">
              <ul className="partner-select">
                <li className="partner">
                  <DropDownSelect>
                    <Select
                      className="text-left active"
                      classNamePrefix="react-select"
                      placeholder="My Partners"
                      options={brandGrowthStrategist}
                      components={getSelectComponents('user')}
                      componentsValue={{ Option: IconOption }}
                      onChange={(event) =>
                        setSelectedValue({ ...selectedValue, bgs: event.value })
                      }
                    />
                  </DropDownSelect>
                </li>
                <li>
                  <DropDownSelect className="days-performance">
                    <Select
                      classNamePrefix="react-select"
                      className="active"
                      components={getSelectComponents()}
                      options={timeOptions}
                      defaultValue={timeOptions[0]}
                      onChange={(event) =>
                        setSelectedValue({
                          ...selectedValue,
                          type: event.value,
                          group: event.group,
                        })
                      }
                    />
                  </DropDownSelect>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="straight-line horizontal-line mt-n2" />
      </div>
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
                    className="col-lg-3 mb-4 col-md-6 col-sm-12 cursor"
                    onClick={() =>
                      history.push(
                        PATH_CUSTOMER_DETAILS.replace(':id', item.id),
                      )
                    }
                    role="presentation">
                    <WhiteCard>
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
                      <div className="status">
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
                              item.ad_performace &&
                              item.ad_performace.difference_data &&
                              item.ad_performace.difference_data.ad_sales,
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.current_sum &&
                            item.ad_performace.current_sum.ad_sales
                              ? `$${item.ad_performace.current_sum.ad_sales
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.previous_sum &&
                            item.ad_performace.previous_sum.ad_sales
                              ? `$${item.ad_performace.previous_sum.ad_sales
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
                              item.ad_performace &&
                              item.ad_performace.difference_data &&
                              item.ad_performace.difference_data.ad_spend,
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.current_sum &&
                            item.ad_performace.current_sum.ad_spend
                              ? `$${item.ad_performace.current_sum.ad_spend
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                              : '$0'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.previous_sum &&
                            item.ad_performace.previous_sum.ad_spend
                              ? `$${item.ad_performace.previous_sum.ad_spend
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
                              item.ad_performace &&
                              item.ad_performace.difference_data &&
                              item.ad_performace.difference_data.impressions,
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.current_sum &&
                            item.ad_performace.current_sum.impressions
                              ? item.ad_performace.current_sum.impressions
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              : 0}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.previous_sum &&
                            item.ad_performace.previous_sum.impressions
                              ? item.ad_performace.previous_sum.impressions
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
                              item.ad_performace &&
                              item.ad_performace.difference_data &&
                              item.ad_performace.difference_data.acos,
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price">
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.current_sum &&
                            item.ad_performace.current_sum.acos
                              ? `${item.ad_performace.current_sum.acos.toFixed(
                                  2,
                                )}%`
                              : '0%'}
                          </div>
                          <div className="vs">
                            vs{' '}
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.previous_sum &&
                            item.ad_performace.previous_sum.acos
                              ? `${item.ad_performace.previous_sum.acos.toFixed(
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

const BrandPartnerDashboard = styled.div`
  padding-left: 62px;

  .partner-select {
    list-style-type: none;
    padding: 0;
    margin: 10px 0;
    li {
      display: inline-block;
      width: 220px;
      margin-right: 15px;
      vertical-align: top;

      &.partner {
        width: 230px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .text-md-right {
    text-align: right;
  }
  .text-sm-left {
    dispaly: none;
  }
  .dashboard-header-sticky {
    position: fixed;
    left: 64px;
    right: 0;
    z-index: 1;
    background-color: ${Theme.white};
  }
  @media only screen and (max-width: 700px) {
    .partner-select {
      li {
        width: 335px;

        &.partner {
          width: 335px;
          margin-bottom: 15px;
        }
      }
    }
  }
  @media only screen and (max-width: 767px) {
    .text-md-right {
      dispaly: none;
    }
    .text-sm-left {
      text-align: left;
    }
    .partner-select {
      list-style-type: none;
      text-align: left;

      li {
        width: 335px;

        &.partner {
          width: 335px;
        }
      }
    }
  }
  @media only screen and (max-width: 991px) {
    padding-left: 0;

    .dashboard-header-sticky {
      left: 0;
    }
  }
`;

const DashboardCard = styled.div`
  background: ${Theme.gray6};
  min-height: 100vh;
  hright: 100%;
  padding-top: 70px;

  .dashboard-body {
    max-width: 1334px;
    width: 100%;
    margin: 0 auto;
    padding-top: 40px;

    .company-logo {
      border-radius: 10px;
      width: 66px;
      height: 66px;
      // margin-right: 14px;
      margin-bottom: 8px;
    }

    .company-name {
      vertical-align: middle;
      position: relative;
      color: ${Theme.black};
      font-size: ${Theme.title};
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 270px;
    }

    .status {
      color: ${Theme.gray85};
      font-size: ${Theme.extraNormal};
    }

    .solid-icon {
      border-radius: 6px;
      width: 36px;
      height: 36px;
    }

    p.black-heading-title {
      font-size: 14px;
    }
    .card-label {
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
      font-family: ${Theme.titleFontFamil};
      text-transform: uppercase;
      font-weight: 800;
      margin-bottom: 5px;
    }
    .sold-price {
      color: ${Theme.gray80};
      font-size: 20px;
      font-weight: 500;
    }
    .vs {
      color: ${Theme.gray40};
      font-size: ${Theme.normal};
    }
    .spacing {
      margin: 9px 0 9px 0;
    }
  }
  @media only screen and (max-width: 768px) {
    padding-top: 155px;
  }
  @media only screen and (max-width: 991px) {
    .dashboard-body {
      padding-top: 20px;
    }
  }

  @media only screen and (min-width: 1600px) {
    .dashboard-body {
      max-width: 1434px;
    }
  }

  @media only screen and (min-width: 1700px) and (min-width: 1920px) {
    .dashboard-body {
      max-width: 85%;
    }
  }
`;
