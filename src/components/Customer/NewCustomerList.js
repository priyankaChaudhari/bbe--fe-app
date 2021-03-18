/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import queryString from 'query-string';
import $ from 'jquery';

import ReactTooltip from 'react-tooltip';
import Theme from '../../theme/Theme';
import {
  CheckBox,
  CommonPagination,
  DropDownSelect,
  GetInitialName,
  InputSearchWithRadius,
  PageLoader,
  Table,
  ModalRadioCheck,
} from '../../common';
import NoRecordFound from '../../common/NoRecordFound';
import {
  SearchIcon,
  CountDayClock,
  SliderHIcon,
  CloseIcon,
  CompanyDefaultUser,
  InfoIcon,
  ArrowUpIcon,
  CaretUp,
  EditFileIcon,
  CheckFileIcon,
  FileIcon,
} from '../../theme/images/index';
import CustomerListTablet from './CustomerListTablet';
import { getCustomerList, getGrowthStrategist, getStatus } from '../../api';
import { PATH_CUSTOMER_DETAILS, PATH_CUSTOMER_LIST } from '../../constants';
import { sortOptions } from '../../constants/FieldConstants';

export default function NewCustomerList() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [brandGrowthStrategist, setBrandGrowthStrategist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { Option, MultiValue, SingleValue } = components;
  const [status, setStatus] = useState([]);
  const [selectedValue, setSelectedValue] = useState({
    view: null,
    'order-by': null,
  });
  const [filters, setFilters] = useState({
    status: [],
    contract_status: [],
    user: [],
    contract_type: [],
  });
  const [showPerformance, setShowPerformance] = useState(false);
  const options = [
    { value: 'performance', label: 'Performance' },
    { value: 'contract_details', label: 'Contract Details' },
  ];
  const contractChoices = [
    { value: 'any', label: 'Any' },
    { value: 'recurring', label: 'Recurring' },
    { value: 'one time', label: 'One Time' },
  ];
  const contractStatus = [
    { value: 'active', label: 'Signed' },
    { value: 'expiring_soon', label: 'Expiring Soon' },
    { value: 'pending contract signature', label: 'Pending Signature' },
    { value: 'pending contract approval', label: 'Pending Approval' },
    { value: 'pending contract', label: 'Pending Contract' },
  ];
  const isDesktop = useMediaQuery({ minWidth: 992 });

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
          style={{ borderRadius: 50, width: '32px', marginBottom: '' }}
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

  const SortOption = (props) => (
    <SingleValue {...props}>
      {props.data.label === 'Performance' ||
      props.data.label === 'Contract Details'
        ? 'View:'
        : 'Sort by:'}
      &nbsp;
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {props.data.label}
      </span>
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

  const getSelectComponents = (key) => {
    if (key === 'user') {
      return {
        Option: IconOption,
        MultiValue: IconSingleOption,
        DropdownIndicator,
      };
    }
    if (key === 'sort') {
      if (isDesktop) {
        return {
          SingleValue: SortOption,
          DropdownIndicator,
        };
      }
      return DropdownIndicator;
    }

    if (key === 'view') {
      if (isDesktop) {
        return {
          SingleValue: SortOption,
          DropdownIndicator,
        };
      }
      return DropdownIndicator;
    }
    return DropdownIndicator;
  };

  const customerList = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });
      getCustomerList(
        currentPage,
        selectedValue,
        filters,
        searchQuery,
        showPerformance,
      ).then((response) => {
        setData(response && response.data && response.data.results);
        setPageNumber(currentPage);
        setCount(response && response.data && response.data.count);
        setIsLoading({ loader: false, type: 'page' });
      });
    },
    [searchQuery, selectedValue, filters, showPerformance],
  );

  useEffect(() => {
    getStatus().then((statusResponse) => {
      setStatus(statusResponse.data);
    });
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
    });
    customerList(1);
  }, [customerList]);

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    const stringified = queryString.stringify({
      page: currentPage,
    });
    history.push({
      pathname: `${PATH_CUSTOMER_LIST}`,
      search: `${stringified}`,
    });
    customerList(currentPage, selectedValue, filters, searchQuery);
  };

  // const cancelFilters = (key) => {
  //   const filter = { ...selectedFilter };
  //   delete filter[key];
  //   setSelectedValue({ ...selectedValue, [key]: null });
  //   setSelectedFilter(filter);
  //   setClearFilter(true);
  //   history.push(PATH_CUSTOMER_LIST);
  //   setIsLoading({ loader: true, type: 'page' });
  //   getCustomerList(1, filter, searchQuery).then((response) => {
  //     setData(response.data && response.data.results);
  //     setPageNumber(pageNumber);
  //     setCount(response && response.data && response.data.count);
  //     setIsLoading({ loader: false, type: 'page' });
  //   });
  //   if (key === 'user') setBrandGrowthStrategist([]);
  // };

  const handleFilters = (event, key, type, action) => {
    if (type === 'status' && key === 'unselected') {
      $('.uncheck-all').on('click', () => {
        $('.checkboxes input:checkbox').prop('checked', false);
      });
      setFilters({
        ...filters,
        status: [],
      });
    }
    if (type === 'contract_status' && key === 'unselected') {
      $('.uncheck-all').on('click', () => {
        $('.checkboxes  input:checkbox').prop('checked', false);
      });
      setFilters({
        ...filters,
        contract_status: [],
      });
    }
    if (type === 'status' && key !== 'unselected') {
      if (
        event.target.checked &&
        filters.status.indexOf(event.target.name) === -1
      ) {
        setFilters({
          ...filters,
          status: [...filters.status, event.target.name],
        });
      } else {
        setFilters({
          ...filters,
          status: filters.status.filter((op) => op !== event.target.name),
        });
      }
    }

    if (type === 'contract_status' && key !== 'unselected') {
      if (
        event.target.checked &&
        filters.contract_status.indexOf(event.target.name) === -1
      ) {
        setFilters({
          ...filters,
          contract_status: [...filters.contract_status, event.target.name],
        });
      } else {
        setFilters({
          ...filters,
          contract_status: filters.contract_status.filter(
            (op) => op !== event.target.name,
          ),
        });
      }
    }

    if (type === 'brand') {
      if (action.action === 'clear') {
        setFilters({
          ...filters,
          user: [],
        });
      }
      if (action.action === 'remove-value') {
        const list = filters.user.filter(
          (op) => op !== action.removedValue.value,
        );
        setFilters({
          ...filters,
          user: list,
        });
      }
      if (event && event.length && action.action === 'select-option') {
        const list = [...filters.user];
        for (const bgs of event) {
          if (list.indexOf(bgs.value) === -1) list.push(bgs.value);
        }
        setFilters({
          ...filters,
          user: list,
        });
      }
    }
    if (type === 'radio') {
      if (event.target.checked) {
        setFilters({
          ...filters,
          contract_type: event.target.value === 'any' ? [] : event.target.value,
        });
      }
    }
  };

  const countDays = (item) => {
    const date1 = new Date();
    const date2 = new Date(item);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSearch = (event, type) => {
    if (type === 'view') {
      if (event.value === 'performance') {
        setShowPerformance(true);
        customerList(pageNumber, selectedValue, filters, searchQuery, true);
      } else {
        setShowPerformance(false);
      }
    }
    if (type === 'sort') {
      setSelectedValue({ ...selectedValue, 'order-by': event.value });
      customerList(
        pageNumber,
        event.value,
        filters,
        searchQuery,
        showPerformance,
      );
    }
    if (type === 'search') {
      setTimeout(() => {
        customerList(
          pageNumber,
          selectedValue,
          filters,
          event.target.value,
          showPerformance,
        );
      }, 1000);
    }
  };

  const getSelectPlaceholder = (item) => {
    if (item === 'user') {
      return 'Any';
    }

    if (item === 'sort') {
      if (isDesktop) {
        return 'Sort by: Recently Added';
      }
      return 'Sort by';
    }
    if (item === 'view') {
      if (isDesktop) {
        return 'View: Contract Details';
      }
      return 'View';
    }
    return '';
  };

  const generateContractHTML = (type) => {
    if (type && type.contract_status === 'pending contract') {
      return (
        <li>
          <div className="recurring-service file">
            {type.contract_type} Service Agreement
            <span className="file-icon">
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
            <span className="file-check-icon">
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
            <span className="edit-file-icon">
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
            <span className="count-clock-icon">
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

  const generateDropdown = (item) => {
    return (
      <>
        <Select
          classNamePrefix="react-select"
          isClearable={false}
          className="active"
          placeholder={getSelectPlaceholder(item)}
          options={
            item === 'user'
              ? brandGrowthStrategist
              : item === 'sort'
              ? sortOptions
              : options
          }
          onChange={(event, action) =>
            item === 'user'
              ? handleFilters(event, item, 'brand', action)
              : handleSearch(event, item === 'sort' ? 'sort' : 'view')
          }
          defaultValue={
            item === 'user'
              ? filters.user
              : selectedValue[item.key] === null
              ? null
              : selectedValue[item.key]
          }
          isMulti={item === 'user'}
          components={getSelectComponents(item)}
          componentsValue={item === 'user' ? { Option: IconOption } : ''}
        />
      </>
    );
  };

  return (
    <CustomerListPage>
      <div className="customer-list-header-sticky">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-12 ">
              {' '}
              <p className="black-heading-title ml-3 pt-1"> Customers</p>
              <div className=" mb-3  d-lg-none d-block ">
                <label
                  className="filter-slider mt-3 cursor "
                  htmlFor="tabletmenu-check"
                  id="responsive-button">
                  <img src={SliderHIcon} alt="Menu Lines" />
                  Filter
                </label>
              </div>
              <MobileLeftSidebar>
                <input type="checkbox" id="tabletmenu-check" />
                <div id="ifp-sidebar-responsive">
                  <SideContent>
                    <p className="black-heading-title mt-0 mb-4">
                      {' '}
                      Filter Customers
                    </p>
                    <label
                      htmlFor="tabletmenu-check"
                      className="close-icon d-xl-none d-block cursor">
                      <img width="25px" src={CloseIcon} alt="cross" />
                    </label>
                    <div className="label">Brand Strategist</div>
                    <DropDownSelect className="w-250">
                      {generateDropdown('user')}
                    </DropDownSelect>
                    <div className="label mt-4">Status</div>
                    <div
                      className="unselected uncheck-all"
                      onClick={(event) =>
                        handleFilters(event, 'unselected', 'status')
                      }
                      role="presentation">
                      Unselect all
                    </div>
                    <div className="clear-fix" />
                    {!isDesktop ? (
                      <ul className="check-box-list checkboxes">
                        {status &&
                          status.map((item) => (
                            <li key={item.value}>
                              <CheckBox>
                                <label
                                  className="check-container customer-pannel"
                                  htmlFor={item.value}>
                                  {item.label}
                                  <input
                                    type="checkbox"
                                    id={item.value}
                                    name={item.value}
                                    onChange={(event) =>
                                      handleFilters(event, item, 'status')
                                    }
                                    defaultChecked={
                                      filters.status
                                        ? filters.status.find(
                                            (op) => op === item.value,
                                          )
                                        : ''
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              </CheckBox>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      ''
                    )}
                    <div className="label mt-4">Contract Type</div>
                    <div className="clear-fix" />
                    {!isDesktop ? (
                      <ul className="check-box-list">
                        {contractChoices.map((item) => (
                          <li key={item.value}>
                            {' '}
                            <ModalRadioCheck>
                              <label
                                className="radio-container customer-list"
                                htmlFor={item.value}>
                                {item.label}
                                <input
                                  type="radio"
                                  name="radio"
                                  id={item.value}
                                  value={item.value}
                                  onChange={(event) =>
                                    handleFilters(event, item, 'radio')
                                  }
                                />
                                <span className="checkmark" />
                              </label>
                            </ModalRadioCheck>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ''
                    )}
                    <div className="label mt-4">Contract Status</div>
                    <div className="clear-fix" />
                    {!isDesktop ? (
                      <>
                        {' '}
                        <div
                          className="unselected uncheck-all"
                          onClick={(event) =>
                            handleFilters(
                              event,
                              'unselected',
                              'contract_status',
                            )
                          }
                          role="presentation">
                          Unselect all
                        </div>
                        <div className="clear-fix" />
                        <ul className="check-box-list checkboxes contract">
                          {contractStatus.map((item) => (
                            <li key={item.value}>
                              <CheckBox>
                                <label
                                  className="check-container customer-pannel"
                                  htmlFor={item.label}>
                                  <input
                                    type="checkbox"
                                    id={item.label}
                                    name={item.value}
                                    onChange={(event) =>
                                      handleFilters(
                                        event,
                                        item,
                                        'contract_status',
                                      )
                                    }
                                    defaultChecked={
                                      filters.status
                                        ? filters.status.find(
                                            (op) => op === item.value,
                                          )
                                        : ''
                                    }
                                  />
                                  <span className="checkmark" />
                                  {item.label}
                                </label>
                              </CheckBox>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      ''
                    )}
                  </SideContent>
                </div>
                <div className="straight-line horizontal-line mb-2" />
              </MobileLeftSidebar>
            </div>

            <div className="col-lg-6 col-md-6 col-12 col-8  mb-2 pr-md-2">
              <InputSearchWithRadius className="customer-list-header w-80">
                <input
                  className=" form-control search-filter"
                  placeholder="Search"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch(event, 'search');
                    }
                  }}
                  value={searchQuery || ''}
                />

                <img
                  src={InfoIcon}
                  alt="search cursor"
                  data-tip="Search by Company Name, Contact First, Last Name or Email"
                  data-for="info"
                  className="info-icon"
                />
                <ReactTooltip id="info" aria-haspopup="true" place="bottom" />

                <img
                  src={SearchIcon}
                  alt="search"
                  className="search-input-icon"
                />
              </InputSearchWithRadius>
            </div>
            <div className="col-lg-2 col-md-3 col-6   mb-2 pl-md-0 pr-lg-2">
              <DropDownSelect className="customer-list-header">
                {generateDropdown('sort')}
              </DropDownSelect>{' '}
            </div>
            <div className="col-lg-2 col-md-3  col-6   mb-2 pl-md-0">
              <DropDownSelect className="customer-list-header">
                {generateDropdown('view')}
              </DropDownSelect>{' '}
            </div>
          </div>
        </div>
        <div className="straight-line horizontal-line mt-n2 d-lg-block d-none" />
        <div className="straight-line horizontal-line  d-lg-none d-block" />
      </div>

      <CustomerLeftPannel className="d-none d-lg-block">
        <div className="label mt-2 mb-2">Brand Strategist</div>
        <DropDownSelect className="w-250">
          {generateDropdown('user')}
        </DropDownSelect>{' '}
        <div className="label mt-4 pt-2">Status</div>
        <div
          className="unselected uncheck-all"
          onClick={(event) => handleFilters(event, 'unselected', 'status')}
          role="presentation">
          Unselect all
        </div>
        <div className="clear-fix" />
        <ul className="check-box-list checkboxes">
          {status &&
            status.map((item) => (
              <li key={item.value}>
                <CheckBox>
                  <label
                    className="check-container customer-pannel"
                    htmlFor={item.value}>
                    {item.label}
                    <input
                      type="checkbox"
                      id={item.value}
                      name={item.value}
                      onChange={(event) => handleFilters(event, item, 'status')}
                    />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
              </li>
            ))}
        </ul>
        <div className="label mt-4 pt-2">Contract Type</div>
        <div className="clear-fix" />
        <ul className="check-box-list">
          {contractChoices.map((item) => (
            <li key={item.value}>
              {' '}
              <ModalRadioCheck>
                <label
                  className="radio-container customer-list"
                  htmlFor={item.value}>
                  {item.label}
                  <input
                    type="radio"
                    name="radio"
                    id={item.value}
                    value={item.value}
                    onChange={(event) => handleFilters(event, item, 'radio')}
                  />
                  <span className="checkmark" />
                </label>
              </ModalRadioCheck>
            </li>
          ))}
        </ul>
        <div className="label mt-4 pt-2">Contract Status</div>
        <div
          className="unselected uncheck-all"
          onClick={(event) =>
            handleFilters(event, 'unselected', 'contract_status')
          }
          role="presentation">
          Unselect all
        </div>
        <div className="clear-fix" />
        <ul className="check-box-list checkboxes contract">
          {contractStatus.map((item) => (
            <li key={item.value}>
              <CheckBox>
                <label
                  className="check-container customer-pannel"
                  htmlFor={item.label}>
                  <input
                    type="checkbox"
                    id={item.label}
                    name={item.value}
                    onChange={(event) =>
                      handleFilters(event, item, 'contract_status')
                    }
                    defaultChecked={
                      filters.status
                        ? filters.status.find((op) => op === item.value)
                        : ''
                    }
                  />
                  <span className="checkmark" />
                  {item.label}
                </label>
              </CheckBox>
            </li>
          ))}
        </ul>
      </CustomerLeftPannel>

      <>
        {isDesktop ? (
          <div className="table-container">
            <div className="table-part">
              {isLoading.loader && isLoading.type === 'page' ? (
                <PageLoader color="#FF5933" type="page" />
              ) : (
                <Table>
                  <thead>
                    <tr className="table-header">
                      <th className="customer-header">Customer</th>
                      <th>
                        {showPerformance ? 'Revenue' : 'Active Contracts'}
                      </th>
                      {showPerformance ? <th>Units Sold</th> : null}
                      {showPerformance ? <th>Traffic</th> : null}
                      {showPerformance ? <th>Conversion</th> : null}
                      <th>Brand Strategist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.length === 0 ? (
                      <NoRecordFound />
                    ) : (
                      data &&
                      data.map((item) => (
                        <tr
                          className="cursor"
                          key={Math.random()}
                          onClick={() =>
                            history.push(
                              PATH_CUSTOMER_DETAILS.replace(':id', item.id),
                            )
                          }>
                          <td width={showPerformance ? '20%' : '25%'}>
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
                          </td>
                          <td width={showPerformance ? '15%' : '60%'}>
                            {showPerformance ? (
                              <>
                                {item &&
                                item.daily_facts &&
                                item.daily_facts.current &&
                                item.daily_facts.current[0]
                                  ? `$${item.daily_facts.current[0].revenue}`
                                  : ''}
                                <div className="increase-rate">
                                  <img
                                    className="red-arrow"
                                    src={ArrowUpIcon}
                                    width="14px"
                                    alt="arrow-up"
                                  />
                                  0.15%
                                </div>
                              </>
                            ) : (
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
                            )}
                          </td>
                          {showPerformance ? (
                            <td width="15%">
                              <>
                                {item &&
                                item.daily_facts &&
                                item.daily_facts.current &&
                                item.daily_facts.current[0]
                                  ? `$${item.daily_facts.current[0].units_sold}`
                                  : ''}
                                <div className="increase-rate">
                                  <img
                                    className="red-arrow"
                                    src={ArrowUpIcon}
                                    width="14px"
                                    alt="arrow-up"
                                  />
                                  0.15%
                                </div>
                              </>
                            </td>
                          ) : null}
                          {showPerformance ? (
                            <td width="15%">
                              <>
                                {item &&
                                item.daily_facts &&
                                item.daily_facts.current &&
                                item.daily_facts.current[0]
                                  ? `$${item.daily_facts.current[0].units_sold}`
                                  : ''}
                                <div className="increase-rate">
                                  <img
                                    className="red-arrow"
                                    src={ArrowUpIcon}
                                    width="14px"
                                    alt="arrow-up"
                                  />
                                  0.15%
                                </div>
                              </>
                            </td>
                          ) : null}
                          {showPerformance ? (
                            <td width="15%">
                              <>
                                {item &&
                                item.daily_facts &&
                                item.daily_facts.current &&
                                item.daily_facts.current[0]
                                  ? `$${item.daily_facts.current[0].units_sold}`
                                  : ''}
                                <div className="increase-rate">
                                  <img
                                    className="red-arrow"
                                    src={ArrowUpIcon}
                                    width="14px"
                                    alt="arrow-up"
                                  />
                                  0.15%
                                </div>
                              </>
                            </td>
                          ) : null}

                          <td width="15%">
                            {item &&
                            item.brand_growth_strategist &&
                            item.brand_growth_strategist.length !== 0 ? (
                              <>
                                {item.brand_growth_strategist.profile_photo ? (
                                  <img
                                    className="user-profile-circle"
                                    src={
                                      item.brand_growth_strategist.profile_photo
                                    }
                                    alt="user"
                                  />
                                ) : (
                                  <GetInitialName
                                    property="float-left mr-3"
                                    userInfo={item.brand_growth_strategist}
                                  />
                                )}
                              </>
                            ) : (
                              ''
                            )}
                            <div className="user-name">
                              {item &&
                                item.brand_growth_strategist &&
                                item.brand_growth_strategist.first_name}{' '}
                              {item &&
                                item.brand_growth_strategist &&
                                item.brand_growth_strategist.last_name}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </div>

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
          </div>
        ) : (
          <CustomerListTablet
            data={data}
            history={history}
            count={count}
            pageNumber={pageNumber}
            handlePageChange={handlePageChange}
            isLoading={isLoading}
            showPerformance={showPerformance}
          />
        )}
      </>
    </CustomerListPage>
  );
}

const CustomerListPage = styled.div`
  padding-left: 62px;
  .table-container {
    padding-left: 290px;
  }

  .customer-list-header-sticky {
    position: fixed;
    left: 64px;
    right: 0;
    z-index: 1;
    background-color: ${Theme.white};
  }

  .table-part {
    // min-height: 560px;
    padding-top: 65px;
    overflow: auto;
    min-height: 892px;
    height: 100%;

    padding-bottom: 69px;
    position: relative;
  }
  .customer-list-header {
    margin: 10px 0;
    &.w-80 {
      float: right;
      width: 94%;
    }
  }

  .footer-sticky {
    position: fixed;
    bottom: 0;
    left: 353px;
    right: 0;
    background: white;
  }
  @media only screen and (min-width: 1920px) {
    .customer-list-header {
      &.w-80 {
        width: 106% !important;
      }
    }
  }
  @media only screen and (min-width: 1600px) {
    .customer-list-header {
      &.w-80 {
        width: 97%;
      }
    }
  }

  @media only screen and (max-width: 991px) {
    padding-left: 10px;

    .customer-list-header-sticky {
      left: 0;
      right: 0;
      padding: 0 15px;
    }
    .customer-list-header {
      &.w-80 {
        width: 100%;
      }
    }

    .filter-slider {
      border: 1px solid #8798ad;
      padding: 8px 15px;
      border-radius: 25px;
      color: ${Theme.black};
      font-size: 15px;
      float: right;
      top: -7px;
      right: 40px;
      position: absolute;
      margin-top: -94px;
      font-weight: 600;

      img {
        width: 16px;
        margin-right: 7px;
        vertical-align: text-top;
      }
    }
  }
  @media only screen and (max-width: 991px) {
    padding-left: 10px;

    .customer-list-header {
      margin: 5px 0;
    }
  }
`;

const CustomerLeftPannel = styled.div`
  max-width: 290px;
  height: 100%;
  position: fixed;
  overflow: auto;
  // padding-bottom: 200px;
  top: 130px;
  width: 100%;
  left: 62px;
  padding: 15px;
  padding-bottom: 150px;
  border-right: 1px solid ${Theme.gray5};

  .label {
    color: ${Theme.gray40};
    text-transform: uppercase;
    line-height: 22px;
    font-family: ${Theme.titleFontFamily};
    font-size: 11px;
    margin-bottom: 3px;
  }

  .check-box-list {
    list-style-type: none;
    padding: 0;
    margin: 10px 0 5px 0;

    li {
      color: ${Theme.gray85};
      font-size: 14px;
      margin-bottom: 15px;
    }
  }

  .unselected {
    color: #556178;
    font-size: 14px;
    float: right;
    margin-top: -19px;
    cursor: pointer;
  }

  .btn-apply {
    color: ${Theme.white};
    bottom: 20px;
    position: fixed;
  }
  @media only screen and (max-width: 991px) {
    dispaly: none;
  }
`;
const MobileLeftSidebar = styled.div`
  display: none;
  #tabletmenu-check {
    display: none;
  }

  @media only screen and (max-width: 991px) {
    background-color: ${Theme['$base-color']};
    display: block;
    #responsive-button {
      display: block;
      position: absolute;
      left: 0px;
      top: 43px;
      z-index: 999;
      .menu-icon {
        width: 24px;
        margin-top: -52px;
        margin-left: -20px;
      }
    }
    #ifp-sidebar-responsive {
      display: none;
      height: 100%;
      position: absolute;
      z-index: 999;
      top: 0px;
      left: 0;
      .close-icon {
        color: ${Theme['$a-white']};
        font-size: ${Theme['$base-f-size-res']};
        font-family: ${Theme['$title-font-family']};
        position: absolute;
        right: 20px;
        top: 10px;
        z-index: 999;

        img {
          width: 18px;
          margin-top: 8px;
        }
      }
    }
    #tabletmenu-check:checked ~ #ifp-sidebar-responsive {
      display: block;
    }
    #mobilemenu-close:checked ~ #ifp-sidebar-responsive {
      display: none;
    }
    .content-header {
      padding: 30px 30px 10px !important;
    }
  }
  @media only screen and (max-width: 767px) {
    #responsive-button {
      .menu-icon {
        width: 24px;
        margin-top: -16px;
        position: absolute;
        margin-left: -20px;
      }
    }
  }
`;

const SideContent = styled.div`
  @media (max-width: 991px) {
    width: 300px;
    min-height: 100%;
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    background: white;
    padding: 15px;
    box-shadow: ${Theme.commonShadow};

    .label {
      color: ${Theme.gray40};
      text-transform: uppercase;
      line-height: 22px;
      font-family: ${Theme.titleFontFamily};
      font-size: 11px;
      margin-bottom: 3px;
    }

    .check-box-list {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        color: ${Theme.gray85};
        font-size: 14px;
        margin-bottom: 15px;
      }
    }

    .unselected {
      color: #556178;
      font-size: 14px;
      float: right;
      margin-top: -19px;
      cursor: pointer;
    }
  }
`;
