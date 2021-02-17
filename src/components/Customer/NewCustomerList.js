/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react';
// import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import queryString from 'query-string';
import dayjs from 'dayjs';

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
  Button,
} from '../../common';
import {
  SearchIcon,
  ClockIcon,
  SliderHIcon,
  CloseIcon,
  CompanyDefaultUser,
  whiteCross,
  InfoIcon,
  ArrowDownIcon,
  ArrowUpIcon,
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

  // const userInfo = useSelector((state) => state.userState.userInfo);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const { Option, MultiValue } = components;
  const [selectedFilter, setSelectedFilter] = useState({});
  const [clearFilter, setClearFilter] = useState(true);
  const [status, setStatus] = useState([]);
  const [enableBtn, setEnableBtn] = useState(false);

  const [selectedValue, setSelectedValue] = useState({
    view: null,
    'order-by': null,
  });

  const [filters, setFilters] = useState([]);
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
          style={{ borderRadius: 50, width: '32px', marginBottom: '-11px' }}
        />
      ) : (
        <GetInitialName userInfo={props.data.label} type="list" property="" />
      )}{' '}
      &nbsp;
      <span style={{ lineHeight: 4 }}>{props.data.label}</span>
    </MultiValue>
  );

  const getSelectComponents = (key) => {
    if (key === 'user') {
      return {
        Option: IconOption,
        MultiValue: IconSingleOption,
      };
    }
    return '';
  };

  const customerList = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });
      getCustomerList(currentPage, selectedValue, searchQuery).then(
        (response) => {
          setData(response && response.data && response.data.results);
          setPageNumber(currentPage);
          setCount(response && response.data && response.data.count);
          setIsLoading({ loader: false, type: 'page' });
        },
      );
    },
    [searchQuery, selectedValue],
  );

  useEffect(() => {
    getStatus().then((statusResponse) => {
      setStatus(statusResponse.data);
    });
    getGrowthStrategist().then((gs) => {
      if (gs && gs.data) {
        for (const brand of gs.data) {
          setBrandGrowthStrategist((prev) => [
            ...prev,
            {
              value: brand.id,
              label: `${brand.first_name} ${brand.last_name}`,
              icon:
                brand.documents &&
                brand.documents[0] &&
                Object.values(brand.documents[0]) &&
                Object.values(brand.documents[0])[0],
            },
          ]);
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
    customerList(currentPage, selectedValue, searchQuery);
  };

  const cancelFilters = (key) => {
    const filter = { ...selectedFilter };
    delete filter[key];
    setSelectedValue({ ...selectedValue, [key]: null });
    setSelectedFilter(filter);
    setClearFilter(true);
    history.push(PATH_CUSTOMER_LIST);
    setIsLoading({ loader: true, type: 'page' });
    getCustomerList(1, filter, searchQuery).then((response) => {
      setData(response.data && response.data.results);
      setPageNumber(pageNumber);
      setCount(response && response.data && response.data.count);
      setIsLoading({ loader: false, type: 'page' });
    });
    if (key === 'user') setBrandGrowthStrategist([]);
  };

  const handleFilters = (event, key, type) => {
    setEnableBtn(true);
    if (type === 'status') {
      setFilters([...filters, { status: event.target.name }]);
    }
    if (type === 'brand') {
      setFilters([...filters, { user: event.value }]);
    }
    if (type === 'radio') {
      const list = [...filters];
      list.filter((el) => {
        return Object.keys(el) !== 'contract_type';
      });
      setFilters([...list, { contract_type: key.value }]);
    }
  };

  const countDays = (item) => {
    const date1 = new Date();
    const date2 = new Date(item && item.contract && item.contract.end_date);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSearch = (event, type) => {
    if (type === 'view') {
      if (event.value === 'performance') {
        setShowPerformance(true);
      } else {
        setShowPerformance(false);
      }
    }
    if (type === 'sort') {
      setSelectedValue({ ...selectedValue, 'order-by': event.value });
      customerList(pageNumber, event.value, searchQuery);
    }
    if (type === 'search') {
      setTimeout(() => {
        customerList(pageNumber, selectedValue, event.target.value);
      }, 1000);
    }
  };

  const generateDropdown = (item) => {
    return (
      <>
        <Select
          classNamePrefix="react-select"
          className="active"
          placeholder={
            item === 'user'
              ? 'Any'
              : item === 'sort'
              ? 'Sort by: Recently Added'
              : 'View: Contract Details'
          }
          options={
            item === 'user'
              ? brandGrowthStrategist
              : item === 'sort'
              ? sortOptions
              : options
          }
          onChange={(event) =>
            item === 'user'
              ? handleFilters(event, item, 'brand')
              : handleSearch(event, item === 'sort' ? 'sort' : 'view')
          }
          value={
            item === 'user'
              ? filters.user
              : clearFilter && selectedValue[item.key] === null
              ? null
              : selectedValue[item.key]
          }
          isMulti={item === 'user'}
          components={getSelectComponents(item)}
          componentsValue={item === 'user' ? { Option: IconOption } : ''}
        />
        {item === 'user' ? (
          <img
            onClick={() => cancelFilters(item)}
            src={whiteCross}
            alt="remove"
            role="presentation"
            className="remove-icon cursor"
          />
        ) : (
          ''
        )}
      </>
    );
  };

  return (
    <CustomerListPage>
      <div className="customer-list-header-sticky">
        <div className="row">
          <div className="col-lg-2 col-12 ">
            {' '}
            <p className="black-heading-title ml-3 "> Customers</p>
            <div className=" mb-3 d-lg-none d-block ">
              <label
                className="filter-slider mt-4 "
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
                    className="close-icon d-xl-none d-block">
                    <img width="25px" src={CloseIcon} alt="cross" />
                  </label>
                  <div className="label">Brand Strategist</div>
                  <DropDownSelect>{generateDropdown('user')}</DropDownSelect>
                  <div className="label mt-4">Status</div>
                  <div className="unselected ">Unselect all</div>
                  <div className="clear-fix" />
                  <ul className="check-box-list">
                    <li>
                      <CheckBox>
                        <label
                          className="container customer-pannel"
                          htmlFor="contract-copy-check">
                          Active
                          <input type="checkbox" id="contract-copy-check" />
                          <span className="checkmark" />
                        </label>
                      </CheckBox>
                    </li>
                    <li>
                      <CheckBox>
                        <label
                          className="container customer-pannel"
                          htmlFor="contract-copy-check">
                          At Risk
                          <input type="checkbox" id="contract-copy-check" />
                          <span className="checkmark" />
                        </label>
                      </CheckBox>
                    </li>
                    <li>
                      <CheckBox>
                        <label
                          className="container customer-pannel"
                          htmlFor="contract-copy-check">
                          Pending Cancellation
                          <input type="checkbox" id="contract-copy-check" />
                          <span className="checkmark" />
                        </label>
                      </CheckBox>
                    </li>
                    <li>
                      <CheckBox>
                        <label
                          className="container customer-pannel"
                          htmlFor="contract-copy-check">
                          Inactive
                          <input type="checkbox" id="contract-copy-check" />
                          <span className="checkmark" />
                        </label>
                      </CheckBox>
                    </li>
                  </ul>
                  <div className="label mt-4">Contract Type</div>
                  <div className="unselected ">Unselect all</div>
                  <div className="clear-fix" />
                  <ul className="check-box-list">
                    <li>
                      {' '}
                      <CheckBox>
                        <label
                          className="container customer-pannel"
                          htmlFor="contract-copy-check">
                          Recurring
                          <input type="checkbox" id="2" />
                          <span className="checkmark" />
                        </label>
                      </CheckBox>
                    </li>
                    <li>
                      {' '}
                      <CheckBox>
                        <label
                          className="container customer-pannel"
                          htmlFor="contract-copy-check">
                          One Time
                          <input type="checkbox" id="3" />
                          <span className="checkmark" />
                        </label>
                      </CheckBox>
                    </li>
                  </ul>
                </SideContent>
              </div>
              <div className="straight-line horizontal-line" />
            </MobileLeftSidebar>
          </div>

          <div className="col-lg-6 col-md-6 col-12 col-8  mb-2 pr-lg-2">
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
              <ReactTooltip id="info" aria-haspopup="true" />

              <img
                src={SearchIcon}
                alt="search"
                className="search-input-icon"
              />
            </InputSearchWithRadius>
          </div>
          <div className="col-lg-2 col-md-3 col-6   mb-2 pl-lg-0 pr-lg-2">
            <DropDownSelect className="customer-list-header">
              {generateDropdown('sort')}
            </DropDownSelect>{' '}
          </div>
          <div className="col-lg-2 col-md-3  col-6   mb-2 pl-lg-0">
            <DropDownSelect className="customer-list-header">
              {generateDropdown('detail')}
            </DropDownSelect>{' '}
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
        <div className="label mt-4">Status</div>
        <div className="unselected ">Unselect all</div>
        <div className="clear-fix" />
        <ul className="check-box-list">
          {status &&
            status.map((item) => (
              <li key={item.value}>
                <CheckBox>
                  <label
                    className="container customer-pannel"
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
        <div className="label mt-4">Contract Type</div>
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
                    onChange={(event) => handleFilters(event, item, 'radio')}
                  />
                  <span className="checkmark" />
                </label>
              </ModalRadioCheck>
            </li>
          ))}
        </ul>
        <Button
          className={
            enableBtn
              ? 'btn-primary  w-90 btn-apply'
              : 'light-orange w-90 btn-apply disabled'
          }
          disabled={!enableBtn}>
          Apply
        </Button>
      </CustomerLeftPannel>
      <>
        {isDesktop ? (
          <div className="table-container">
            <div className="table-part">
              {isLoading.loader && isLoading.type === 'page' ? (
                <PageLoader color="#FF5933" type="page" />
              ) : (
                <Table>
                  <tbody>
                    <tr className="table-header">
                      <th className="customer-header">Customer</th>
                      <th>{showPerformance ? 'Revenue' : 'Contract'}</th>
                      <th>{showPerformance ? 'Units Sold' : 'Retainer'}</th>
                      <th>{showPerformance ? 'Traffic' : 'Rev. Share'}</th>
                      {showPerformance ? <th>Conversion</th> : null}
                      <th>Brand Strategist</th>
                    </tr>
                    {data &&
                      data.map((item) => (
                        <tr
                          className="cursor"
                          key={Math.random()}
                          onClick={() =>
                            history.push(
                              PATH_CUSTOMER_DETAILS.replace(':id', item.id),
                            )
                          }>
                          <td width="25%">
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
                              {item && item.status}
                            </div>
                          </td>
                          <td width={showPerformance ? '10%' : '35%'}>
                            {showPerformance ? (
                              <>
                                ${' '}
                                {item &&
                                  item.contract &&
                                  item.contract.rev_share}
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
                              <>
                                <p
                                  className="black-heading-title mt-0 mb-0"
                                  style={{ textTransform: 'capitalize' }}>
                                  {' '}
                                  {item &&
                                    item.contract &&
                                    item.contract.contract_type}{' '}
                                  Contract
                                </p>
                                <ul className="recurring-contact ">
                                  <li>
                                    <p className="basic-text ">
                                      {item &&
                                        item.contract &&
                                        item.contract.length}
                                    </p>
                                  </li>
                                  {item &&
                                  item.contract &&
                                  item.contract.end_date ? (
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
                                  {item &&
                                  item.contract &&
                                  item.contract.end_date ? (
                                    <li>
                                      <div className="days-block">
                                        {' '}
                                        <img
                                          className="clock-icon"
                                          src={ClockIcon}
                                          alt="clock"
                                        />{' '}
                                        {countDays(item)}
                                      </div>
                                    </li>
                                  ) : (
                                    ''
                                  )}
                                </ul>
                              </>
                            )}
                          </td>
                          <td width="10%">
                            {showPerformance ? (
                              <>
                                12
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
                              <>
                                ${' '}
                                {item &&
                                  item.contract &&
                                  item.contract.monthly_retainer &&
                                  item.contract.monthly_retainer
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              </>
                            )}
                          </td>
                          <td width="10%">
                            {showPerformance ? (
                              <>
                                12,234
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
                              <>
                                {item &&
                                  item.contract &&
                                  item.contract.rev_share}{' '}
                                %
                              </>
                            )}
                          </td>
                          {showPerformance ? (
                            <td width="10%">
                              23.4%
                              <div className="decrease-rate">
                                <img
                                  className="red-arrow"
                                  src={ArrowDownIcon}
                                  alt="arrow-up"
                                />
                                0.15%
                              </div>{' '}
                            </td>
                          ) : null}
                          <td width="20%">
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
                      ))}
                  </tbody>
                </Table>
              )}
            </div>

            <div className="fotter-sticky">
              <div className="straight-line horizontal-line" />
              <CommonPagination
                count={count}
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}
              />
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
    left: 62px;
    right: 0;
    z-index: 2;
    background-color: ${Theme.white};
  }

  .table-part {
    // min-height: 560px;
    padding-top: 68px;
    overflow: auto;
  }
  .customer-list-header {
    margin-top: 12px;

    &.w-80 {
      float: right;
      max-width: 632px;
      margin-bottom: 10px;
    }
  }

  .fotter-sticky {
    position: fixed;
    bottom: 0;
    left: 353px;
    right: 0;
    background: white;
  }

  @media only screen and (max-width: 991px) {
    padding-left: 10px;

    .customer-list-header-sticky {
      left: 0;
      right: 0;
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
`;

const CustomerLeftPannel = styled.div`
  max-width: 290px;
  height: 100%;
  position: absolute;
  top: 130px;
  width: 100%;
  left: 62px;
  padding: 15px;
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
  @media only screen and (max-width: 768px) {
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
