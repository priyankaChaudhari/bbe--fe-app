import React, { useState, useEffect, useCallback, useRef } from 'react';

import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import Theme from '../../theme/Theme';
import NoRecordFound from '../../common/NoRecordFound';
import {
  CommonPagination,
  GetInitialName,
  PageLoader,
  Table,
  ModalBox,
  Button,
} from '../../common';
import {
  performanceSortOptions,
  sadSortOptions,
  dadSortOptions,
  sortOptions,
} from '../../constants/FieldConstants';

import {
  CountDayClock,
  CloseIcon,
  CompanyDefaultUser,
  ArrowUpIcon,
  EditFileIcon,
  CheckFileIcon,
  FileIcon,
  ArrowDownIcon,
  UpDowGrayArrow,
  SortUp,
} from '../../theme/images/index';
import CustomerListTablet from './CustomerListTablet';
import { getCustomerList, getGrowthStrategist, getStatus } from '../../api';
import { getManagersList } from '../../api/ChoicesApi';
import { getcontract } from '../../api/AgreementApi';
import { PATH_AGREEMENT, PATH_CUSTOMER_DETAILS } from '../../constants';

import { CustomerListPage } from '../../theme/CustomerListStyle';
import CustomerListFilters from './CustomerListFilters';

const salesSortOptions = sortOptions.concat(performanceSortOptions);
const sponsorAdSortOptions = sortOptions.concat(sadSortOptions);
const dspAdSortOptions = sortOptions.concat(dadSortOptions);

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

export default function NewCustomerList() {
  const history = useHistory();
  const selectInputRefMobile = useRef();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [brandGrowthStrategist, setBrandGrowthStrategist] = useState([]);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).searchQuery
      : '',
  );
  const [status, setStatus] = useState([]);
  const [selectedValue, setSelectedValue] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? {
          view: null,
          'order-by': JSON.parse(localStorage.getItem('filters')).sort_by,
        }
      : {
          view: null,
          'order-by': null,
        },
  );
  const [filters, setFilters] = useState(
    JSON.parse(localStorage.getItem('filters')) || {
      status: [],
      contract_status: [],
      user: [],
      ad_user: [],
      dsp_user: [],
      contract_type: [],
    },
  );
  const [showPerformance, setShowPerformance] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).showPerformance
      : false,
  );

  const [showAdPerformance, setShowAdPerformance] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).showAdPerformance
      : false,
  );
  const [showDspAdPerformance, setShowDspAdPerformance] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).showDspAdPerformance
      : false,
  );
  const [selectedTimeFrame, setSelectedTimeFrame] = useState({
    daily_facts: JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).daily_facts
      : 'week',
  });
  const [orderByFlag, setOrderByFlag] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).sequence
      : false,
  );
  const [showOrderOption, setShowOrderOption] = useState(false);

  const isDesktop = useMediaQuery({ minWidth: 991 });
  const currentDate = new Date();
  const [isCustomDateApply, setIsCustomDateApply] = useState(false);
  const [customDateData, setCustomDateData] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'bgsSelection',
    },
  ]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [expiringSoon, setExpiringSoon] = useState(
    !!(
      JSON.parse(localStorage.getItem('filters')) &&
      JSON.parse(localStorage.getItem('filters')).sort_by === 'expiring_soon'
    ),
  );

  const CustomDateFilter = (startDate, endDate, type) => {
    let sd = startDate;
    let ed = endDate;

    if (type === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;

      setSelectedTimeFrame({
        daily_facts: 'custom',
        start_date: sd,
        end_date: ed,
        startDate,
        endDate,
      });
    }
  };

  const applyCustomDate = () => {
    CustomDateFilter(
      customDateData[0].startDate,
      customDateData[0].endDate,
      'custom',
    );
    setIsCustomDateApply(true);
    setShowCustomDateModal(false);
  };

  const setMaxDate = () => {
    const d = currentDate;
    if (showPerformance) {
      d.setDate(d.getDate() - 4);
    }
    if (showAdPerformance || showDspAdPerformance) {
      d.setDate(d.getDate() - 3);
    }

    return d;
  };

  const renderCustomDateModal = () => {
    return (
      <Modal
        isOpen={showCustomDateModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowCustomDateModal(false);
            setCustomDateData([
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
                setCustomDateData([item.bgsSelection]);
              }}
              showMonthAndYearPickers={false}
              ranges={customDateData}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
              maxDate={setMaxDate()}
              rangeColors={[Theme.baseColor]}
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

  const customerList = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });
      getCustomerList(
        currentPage,
        selectedValue,
        JSON.parse(localStorage.getItem('filters')) || filters,
        searchQuery,
        showPerformance,
        showAdPerformance,
        showDspAdPerformance,
        expiringSoon,
        selectedTimeFrame,
        orderByFlag ? { sequence: 'desc' } : { sequence: 'asc' },
      ).then((response) => {
        setData(response && response.data && response.data.results);
        setPageNumber(currentPage);
        setCount(response && response.data && response.data.count);
        setIsLoading({ loader: false, type: 'page' });
      });
    },

    [
      searchQuery,
      selectedValue,
      filters,
      orderByFlag,
      showPerformance,
      expiringSoon,
      showAdPerformance,
      showDspAdPerformance,
      selectedTimeFrame,
    ],
  );

  useEffect(() => {
    getStatus().then((statusResponse) => {
      if (statusResponse && statusResponse.status === 200) {
        setStatus(statusResponse.data);
      }
    });
    if (showAdPerformance || showDspAdPerformance) {
      const type = showAdPerformance
        ? 'Sponsored Advertising Ad Manager'
        : 'DSP Ad Manager';
      getManagersList(type).then((adm) => {
        if (adm && adm.data) {
          const list = [{ value: 'any', label: 'All' }]; // for select one user
          for (const brand of adm.data) {
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
    } else {
      getGrowthStrategist().then((gs) => {
        if (gs && gs.data) {
          const list = [{ value: 'any', label: 'All' }]; // for select one use
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
    }
    customerList(1);
  }, [customerList, showAdPerformance, showDspAdPerformance]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowSortDropdown(false);
    }
  };

  useEffect(() => {
    if (showSortDropdown)
      document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showSortDropdown]);

  const handlePageChange = (currentPage) => {
    localStorage.setItem('page', currentPage || 1);
    setPageNumber(currentPage);
    customerList(currentPage, selectedValue, filters, searchQuery);
  };
  const handleSortFilters = (orderKey) => {
    setOrderByFlag(!orderByFlag);
    setExpiringSoon(false);
    setSelectedValue({
      ...selectedValue,
      'order-by': orderKey,
      sequence: !orderByFlag,
    });
    setFilters({
      ...filters,
      sort_by: orderKey,
      sequence: !orderByFlag,
    });
    localStorage.setItem(
      'filters',
      JSON.stringify({
        ...filters,
        sort_by: orderKey,
        sequence: !orderByFlag,
      }),
    );
  };

  const countDays = (item) => {
    const date1 = new Date();
    const date2 = new Date(item);
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
            state: `${history.location.pathname}`,
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
          data-tip={type.contract_status}
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
              state: `${history.location.pathname}`,
            });
          }}
          role="presentation">
          <div className="recurring-service count-days">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
            <span className="count-clock-icon active-contract-icon">
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
              state: `${history.location.pathname}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service file">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
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
              state: `${history.location.pathname}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service file-check">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
            <span className=" active-contract-icon file-check-icon ">
              <img src={CheckFileIcon} alt="check-file" />{' '}
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
              state: `${history.location.pathname}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service edit">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
            <span className="edit-file-icon  active-contract-icon">
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
          }}
          role="presentation">
          <div className="recurring-service agreement">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
          </div>
        </li>
      );
    }
    return (
      <li
        onClickCapture={(e) => {
          e.stopPropagation();
          redirectIfContractExists(type, id);
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
    const value = actualValue;
    let selectedClass = '';
    let selectedArrow = '';

    if (value) {
      if (matrics === 'ACOS') {
        if (value.toString().includes('-')) {
          selectedClass = 'increase-rate';
          selectedArrow = ArrowUpIcon;
        } else {
          selectedClass = 'decrease-rate';
          selectedArrow = ArrowDownIcon;
        }
      } else if (grayArrow) {
        if (value.toString().includes('-')) {
          selectedClass = 'decrease-rate grey';
          selectedArrow = UpDowGrayArrow;
        } else {
          selectedClass = 'increase-rate grey';
          selectedArrow = UpDowGrayArrow;
        }
      } else if (value.toString().includes('-')) {
        selectedClass = 'decrease-rate';
        selectedArrow = ArrowDownIcon;
      } else {
        selectedClass = 'increase-rate';
        selectedArrow = ArrowUpIcon;
      }

      if (value.toString().includes('-')) {
        return (
          <>
            <div className={selectedClass}>
              {' '}
              <img className="red-arrow" src={selectedArrow} alt="arrow-up" />
              {`${Number(value.toString().split('-')[1]).toFixed(2)} %`}
            </div>
          </>
        );
      }

      return (
        <>
          <div className={selectedClass}>
            <img
              className="green-arrow"
              src={selectedArrow}
              width="14px"
              alt="arrow-up"
            />
            {value} %
          </div>
        </>
      );
    }
    return '';
  };

  const renderHeaders = () => {
    if (showPerformance) {
      return (
        <div className="row position-relative">
          <div className="col-lg-2 col-12 customer-header">Customer</div>

          {performanceSortOptions.map((item) => {
            return (
              <div
                key={item.label}
                style={{
                  cursor: 'pointer',
                  color:
                    item.value === selectedValue['order-by']
                      ? Theme.red
                      : Theme.gray40,
                }}
                className={`col-lg-2 col-12 ${item.class}`}
                onClick={() => handleSortFilters(item.value)}
                aria-hidden="true">
                {item.label}
                <img
                  className={`sort-arrow-up ${
                    item.value === selectedValue['order-by'] && orderByFlag
                      ? 'rotate'
                      : ''
                  }`}
                  src={SortUp}
                  alt="arrow-up"
                />
              </div>
            );
          })}
          <div className="col-lg-2 col-12 Brand_Strategist">
            Brand Strategist
          </div>
        </div>
      );
    }
    if (showAdPerformance) {
      return (
        <div className="row">
          <div className="col-lg-2 col-12 customer-header">Customer</div>
          {sadSortOptions.map((item) => {
            return (
              <div
                key={item.label}
                style={{
                  cursor: 'pointer',
                  color:
                    item.value === selectedValue['order-by']
                      ? Theme.red
                      : Theme.gray40,
                }}
                className={`col-lg-2 col-12 ${item.class}`}
                onClick={() => handleSortFilters(item.value)}
                aria-hidden="true">
                {item.label}
                <img
                  className={`sort-arrow-up ${
                    item.value === selectedValue['order-by'] && orderByFlag
                      ? 'rotate'
                      : ''
                  }`}
                  src={SortUp}
                  alt="arrow-up"
                />
              </div>
            );
          })}
          <div className="col-lg-2 col-12 Brand_Strategist">
            Sponsored Ad Manager
          </div>
        </div>
      );
    }
    if (showDspAdPerformance) {
      return (
        <div className="row">
          <div className="col-lg-2 col-12 customer-header">Customer</div>
          {dadSortOptions.map((item) => {
            return (
              <div
                key={item.label}
                style={{
                  cursor: 'pointer',
                  color:
                    item.value === selectedValue['order-by']
                      ? Theme.red
                      : Theme.gray40,
                }}
                className={`col-lg-2 col-12 ${item.class}`}
                onClick={() => handleSortFilters(item.value)}
                aria-hidden="true">
                {item.label}
                <img
                  className={`sort-arrow-up ${
                    item.value === selectedValue['order-by'] && orderByFlag
                      ? 'rotate'
                      : ''
                  }`}
                  src={SortUp}
                  alt="arrow-up"
                />
              </div>
            );
          })}
          <div className="col-lg-2 col-12 Brand_Strategist">DSP AD MANAGER</div>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="col-lg-3 col-12 customer-header">Customer</div>
        <div className="col-lg-7 col-12">Active Contracts</div>
        <div className="col-lg-2 col-12 Brand_Strategist">Brand Strategist</div>
      </div>
    );
  };
  const generateCompanyNameAndStatus = (name, companyStatus) => {
    return (
      <>
        <div className="company-name">{name}</div>
        {companyStatus === 'at risk' ? (
          <div className="status">At Risk</div>
        ) : (
          <div className="status" style={{ textTransform: 'capitalize' }}>
            {companyStatus}
          </div>
        )}
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

  const renderCustomerDetails = (item) => {
    if (showPerformance) {
      return (
        <tr
          className="cursor"
          key={Math.random()}
          onClick={() =>
            history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
          }>
          <td width="20%">
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

            {generateCompanyNameAndStatus(
              item && item.company_name,
              item.status,
            )}
          </td>

          <td width="15%">
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
          </td>

          <td width="15%">
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
          </td>

          <td width="15%">
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
          </td>
          <td width="15%">
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
          </td>

          <td width="15%">
            {item &&
            item.brand_growth_strategist &&
            item.brand_growth_strategist.length !== 0 ? (
              <>
                {item.brand_growth_strategist.profile_photo ? (
                  <img
                    className="user-profile-circle"
                    src={item.brand_growth_strategist.profile_photo}
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
                item.brand_growth_strategist.first_name}
              <br />
              {item &&
                item.brand_growth_strategist &&
                item.brand_growth_strategist.last_name}
            </div>
          </td>
        </tr>
      );
    }
    if (showAdPerformance) {
      return (
        <tr
          className="cursor"
          key={Math.random()}
          onClick={() =>
            history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
          }>
          <td width="20%">
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

            {generateCompanyNameAndStatus(
              item && item.company_name,
              item.status,
            )}
          </td>
          <td width="15%">
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
                item.sponsored_ad_performance &&
                item.sponsored_ad_performance.difference_data &&
                item.sponsored_ad_performance.difference_data.ad_sales,
              false,
              'AdSales',
            )}
          </td>

          <td width="15%">
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
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.difference_data &&
                  item.sponsored_ad_performance.difference_data.ad_spend,
                true,
                'AdSpend',
              )}
            </>
          </td>

          <td width="15%">
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
          </td>

          <td width="15%">
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
          </td>

          <td width="15%">
            {item && item.ad_manager && item.ad_manager.length !== 0 ? (
              <>
                {item.ad_manager.profile_photo ? (
                  <img
                    className="user-profile-circle"
                    src={item.ad_manager.profile_photo}
                    alt="user"
                  />
                ) : (
                  <GetInitialName
                    property="float-left mr-3"
                    userInfo={item.ad_manager}
                  />
                )}
              </>
            ) : (
              ''
            )}
            <div className="user-name">
              {item && item.ad_manager && item.ad_manager.first_name}
              <br />
              {item && item.ad_manager && item.ad_manager.last_name}
            </div>
          </td>
        </tr>
      );
    }
    if (showDspAdPerformance) {
      return (
        <tr
          className="cursor"
          key={Math.random()}
          onClick={() =>
            history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
          }>
          <td width="20%">
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

            {generateCompanyNameAndStatus(
              item && item.company_name,
              item.status,
            )}
          </td>
          <td width="15%">
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
          </td>

          <td width="15%">
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
                  item.dsp_ad_performance.difference_data.dsp_spend,
                true,
                'DspSpend',
              )}
            </>
          </td>

          <td width="15%">
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
                  item.dsp_ad_performance.difference_data.total_product_sales,
                false,
                'totalProductSales',
              )}
            </>
          </td>

          <td width="15%">
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
          </td>

          <td width="15%">
            {item && item.ad_manager && item.ad_manager.length !== 0 ? (
              <>
                {item.ad_manager.profile_photo ? (
                  <img
                    className="user-profile-circle"
                    src={item.ad_manager.profile_photo}
                    alt="user"
                  />
                ) : (
                  <GetInitialName
                    property="float-left mr-3"
                    userInfo={item.ad_manager}
                  />
                )}
              </>
            ) : (
              ''
            )}
            <div className="user-name">
              {item && item.ad_manager && item.ad_manager.first_name}
              <br />
              {item && item.ad_manager && item.ad_manager.last_name}
            </div>
          </td>
        </tr>
      );
    }
    // for view-contract Details
    return (
      <tr
        className="cursor"
        key={Math.random()}
        onClick={() =>
          history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
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

          {generateCompanyNameAndStatus(item && item.company_name, item.status)}
        </td>
        <td width="60%">
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
        </td>

        <td width="15%">
          {item &&
          item.brand_growth_strategist &&
          item.brand_growth_strategist.length !== 0 ? (
            <>
              {item.brand_growth_strategist.profile_photo ? (
                <img
                  className="user-profile-circle"
                  src={item.brand_growth_strategist.profile_photo}
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
              item.brand_growth_strategist.first_name}
            <br />
            {item &&
              item.brand_growth_strategist &&
              item.brand_growth_strategist.last_name}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <CustomerListPage>
      {' '}
      {renderCustomDateModal()}
      <CustomerListFilters
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showPerformance={showPerformance}
        showAdPerformance={showAdPerformance}
        showDspAdPerformance={showDspAdPerformance}
        setShowPerformance={setShowPerformance}
        setShowAdPerformance={setShowAdPerformance}
        setShowDspAdPerformance={setShowDspAdPerformance}
        showOrderOption={showOrderOption}
        setShowOrderOption={setShowOrderOption}
        orderByFlag={orderByFlag}
        setOrderByFlag={setOrderByFlag}
        selectedTimeFrame={selectedTimeFrame}
        setSelectedTimeFrame={setSelectedTimeFrame}
        setExpiringSoon={setExpiringSoon}
        setSelectedValue={setSelectedValue}
        isCustomDateApply={isCustomDateApply}
        setIsCustomDateApply={setIsCustomDateApply}
        setShowCustomDateModal={setShowCustomDateModal}
        brandGrowthStrategist={brandGrowthStrategist}
        status={status}
        selectInputRefMobile={selectInputRefMobile}
        salesSortOptions={salesSortOptions}
        sponsorAdSortOptions={sponsorAdSortOptions}
        dspAdSortOptions={dspAdSortOptions}
        selectedValue={selectedValue}
        customerList={customerList}
        pageNumber={pageNumber}
      />
      <>
        {isDesktop ? (
          <div className="table-container">
            <div className="table-part">
              <div className="sticky-header">
                <div className="table-header">{renderHeaders()}</div>
              </div>
              {isLoading.loader && isLoading.type === 'page' ? (
                <PageLoader
                  component="customer-list-loader"
                  color={Theme.baseColor}
                  type="page"
                />
              ) : (
                <Table>
                  <tbody>
                    {data && data.length === 0 ? (
                      <NoRecordFound />
                    ) : (
                      data && data.map((item) => renderCustomerDetails(item))
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
                  pageNumber={
                    JSON.parse(localStorage.getItem('page')) || pageNumber
                  }
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
            showAdPerformance={showAdPerformance}
            showDspAdPerformance={showDspAdPerformance}
            setShowPerformance={setShowPerformance}
            setShowAdPerformance={setShowAdPerformance}
            setShowDspAdPerformance={setShowDspAdPerformance}
            setStatus={status}
            brandGrowthStrategist={brandGrowthStrategist}
            salesSortOptions={salesSortOptions}
            sponsorAdSortOptions={sponsorAdSortOptions}
            dspAdSortOptions={dspAdSortOptions}
          />
        )}
      </>
    </CustomerListPage>
  );
}
