/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';

import Select, { components } from 'react-select';
import dayjs from 'dayjs';
import { DashboardCard, BrandPartnerDashboard } from '../../theme/Global';

import {
  DropDownSelect,
  GetInitialName,
  PageLoader,
  WhiteCard,
  CommonPagination,
  ModalBox,
  Button,
} from '../../common';

import {
  RecurringIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ServiceIcon,
  CompanyDefaultUser,
  CaretUp,
  CloseIcon,
} from '../../theme/images';
import getBGSCustomerList from '../../api/BgsApi';
import { getGrowthStrategist } from '../../api';
import { PATH_CUSTOMER_DETAILS } from '../../constants';
import NoRecordFound from '../../common/NoRecordFound';

export default function Dashboard() {
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
  const [showBgsCustomDateModal, setShowBgsCustomDateModal] = useState(false);
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '420px ',
      width: '100% ',
      minHeight: '390px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  const currentDate = new Date();

  const [bgsData, setBgsData] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'bgsSelection',
    },
  ]);

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

  const bgsCustomerList = useCallback(
    (
      currentPage,
      selectedUser,
      dateFilter,
      startDate = null,
      endDate = null,
    ) => {
      setIsLoading({ loader: true, type: 'page' });
      getBGSCustomerList(
        currentPage,
        selectedUser || userInfo.id,
        dateFilter,
        startDate,
        endDate,
      ).then((response) => {
        setData(response && response.data && response.data.results);
        setPageNumber(currentPage);
        setCount(response && response.data && response.data.count);
        getGrowthStrategist().then((gs) => {
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
    [userInfo.id],
  );

  useEffect(() => {
    bgsCustomerList(1, userInfo.id, selectedValue);
  }, []);

  // useEffect(() => {
  //   setIsLoading({ loader: true, type: 'page' });
  //   getBGSCustomerList(
  //     (selectedValue && selectedValue.bgs) || userInfo.id,
  //     selectedValue,
  //   ).then((response) => {
  //     setData(response && response.data && response.data.results);
  //     getGrowthStrategist().then((gs) => {
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
  // }, [userInfo, selectedValue]);

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
    return '';
  };

  const BgsYearAndCustomDateFilter = (startDate, endDate, type) => {
    let sd = startDate;
    let ed = endDate;

    if (type === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;

      bgsCustomerList(
        pageNumber,
        selectedValue.bgs,
        {
          type,
        },
        sd,
        ed,
      );
    }
  };

  const applyCustomDate = () => {
    BgsYearAndCustomDateFilter(
      bgsData[0].startDate,
      bgsData[0].endDate,
      'custom',
    );
    setShowBgsCustomDateModal(false);
  };

  const renderBgsCustomDateModal = () => {
    return (
      <Modal
        isOpen={showBgsCustomDateModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowBgsCustomDateModal(false);
            setBgsData([
              {
                startDate: currentDate,
                endDate: currentDate,
                key: 'bgsSelection',
              },
            ]);
          }}
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body">
            <h4>Select Date Range</h4>
            <DateRange
              editableDateInputs
              onChange={(item) => {
                setBgsData([item.bgsSelection]);
              }}
              showMonthAndYearPickers={false}
              ranges={bgsData}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
              maxDate={currentDate}
              rangeColors={['#FF5933']}
              weekdayDisplayFormat="EEEEE"
              locale={enGB}
            />
            <div className="text-center mt-3">
              <Button
                onClick={() => applyCustomDate()}
                type="button"
                className="btn-primary on-boarding   w-100">
                Apply
              </Button>
            </div>
          </div>
        </ModalBox>
      </Modal>
    );
  };

  const handleOnchange = (event, type) => {
    if (type === 'bgs') {
      setSelectedValue({ ...selectedValue, bgs: event.value });
      bgsCustomerList(1, event.value, selectedValue);
    } else if (type === 'date') {
      if (event && event.value === 'custom') {
        setShowBgsCustomDateModal(true);
      } else {
        setSelectedValue({
          ...selectedValue,
          type: event.value,
          group: event.group,
        });
        bgsCustomerList(pageNumber, selectedValue.bgs, {
          type: event.value,
        });
      }
    }
  };
  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    bgsCustomerList(currentPage, selectedValue.bgs, selectedValue);
  };

  return (
    <BrandPartnerDashboard>
      {renderBgsCustomDateModal()}
      <div className="dashboard-header-sticky">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <p className="black-heading-title ml-1 pt-1"> BGS Dashboard</p>
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
                      onChange={(event) => handleOnchange(event, 'bgs')}
                      // onChange={(event) =>
                      //   setSelectedValue({ ...selectedValue, bgs: event.value })
                      // }
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
