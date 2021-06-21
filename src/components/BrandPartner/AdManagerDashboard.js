/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';

import dayjs from 'dayjs';
import {
  DropDownSelect,
  GetInitialName,
  PageLoader,
  WhiteCard,
  CommonPagination,
} from '../../common';
import { DashboardCard, BrandPartnerDashboard } from '../../theme/Global';

import {
  RecurringIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ServiceIcon,
  CompanyDefaultUser,
  CaretUp,
  UpDowGrayArrow,
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
  const [pageNumber, setPageNumber] = useState();
  const [count, setCount] = useState(null);

  const timeOptions = [
    { value: 'week', label: 'Recent 7 days', sub: 'vs Previous 7 days' },
    { value: 'month', label: 'Recent Month', sub: 'vs Previous month' },
    { value: '30days', label: 'Recent 30 Days', sub: 'vs Previous 30 days' },
    { value: 'year', label: 'Year to Date', sub: 'vs previous year' },
    {
      value: 'custom',
      label: 'Custom Range',
      sub: 'Select start and end dates',
    },
  ];

  const adManagerCustomerList = useCallback(
    (currentPage, selectedUser, dateFilter) => {
      setIsLoading({ loader: true, type: 'page' });
      getAdManagerCustomerList(
        currentPage,
        selectedUser || userInfo.id,
        dateFilter,
      ).then((response) => {
        setData(response && response.data && response.data.results);
        setPageNumber(currentPage);
        setCount(response && response.data && response.data.count);
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
    },
    [userInfo],
  );

  useEffect(() => {
    adManagerCustomerList(1, userInfo.id, selectedValue);
  }, []);

  // useEffect((currentPage) => {
  //   setIsLoading({ loader: true, type: 'page' });
  //   getAdManagerCustomerList(
  //     (selectedValue && selectedValue.bgs) || userInfo.id,
  //     selectedValue,
  //   ).then((response) => {
  //     setData(response && response.data && response.data.results);
  //     setPageNumber(currentPage);
  //     setCount(response && response.data && response.data.count);
  //     getAdManagers().then((gs) => {
  //       if (gs && gs.data) {
  //         const list = [];
  //         for (const brand of gs.data) {
  //           list.push({
  //             value: brand.id,
  //             label: `${brand.first_name} ${brand.last_name}`,
  //             icon:
  //               brand.documents &&
  //               brand.documents[0] &&
  //               Object.values(brand.documents[0]) &&
  //               Object.values(brand.documents[0])[0],
  //           });
  //           setBrandGrowthStrategist(list);
  //         }
  //       }
  //       setIsLoading({ loader: false, type: 'page' });
  //     });
  //   });
  // }, [userInfo, selectedValue, pageNumber]);

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

  const handleOnchange = (event, type) => {
    if (type === 'manager') {
      setSelectedValue({ ...selectedValue, bgs: event.value });
      adManagerCustomerList(1, event.value, selectedValue);
    } else if (type === 'date') {
      setSelectedValue({
        ...selectedValue,
        type: event.value,
        group: event.group,
      });
      adManagerCustomerList(pageNumber, selectedValue.bgs, {
        type: event.value,
      });
    }
  };
  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    adManagerCustomerList(currentPage, selectedValue.bgs, selectedValue);
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
                      onChange={(event) => handleOnchange(event, 'manager')}
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
                      onChange={(event) => handleOnchange(event, 'date')}
                      // onChange={(event) =>
                      //   setSelectedValue({
                      //     ...selectedValue,
                      //     type: event.value,
                      //     group: event.group,
                      //   })
                      // }
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
                              item.ad_performace &&
                              item.ad_performace.difference_data &&
                              item.ad_performace.difference_data.ad_sales,
                            false,
                            'AdSales',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.current_sum &&
                            item.ad_performace.current_sum.ad_sales
                              ? `$${item.ad_performace.current_sum.ad_sales
                                  .toFixed(2)
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
                              item.ad_performace &&
                              item.ad_performace.difference_data &&
                              item.ad_performace.difference_data.ad_spend,
                            true,
                            'AdSpend',
                          )}
                        </div>
                        <div className="col-6 text-right">
                          <div className="sold-price ">
                            {item &&
                            item.ad_performace &&
                            item.ad_performace.current_sum &&
                            item.ad_performace.current_sum.ad_spend
                              ? `$${item.ad_performace.current_sum.ad_spend
                                  .toFixed(2)
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
                              item.ad_performace &&
                              item.ad_performace.difference_data &&
                              item.ad_performace.difference_data.impressions,
                            false,
                            'AdImpressions',
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
                            false,
                            'ACOS',
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
      <div className="footer-sticky">
        <div className="straight-line horizontal-line" />
        <div className="container-fluid">
          <CommonPagination
            count={count}
            pageNumber={pageNumber}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </BrandPartnerDashboard>
  );
}
