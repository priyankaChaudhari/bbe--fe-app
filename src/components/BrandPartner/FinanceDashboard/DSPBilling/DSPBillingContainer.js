import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import dayjs from 'dayjs';
// import DateRangePicker from '@wojtekmaj/react-daterange-picker';
// import { DateRange } from 'react-date-range';
import DatePicker from 'react-datepicker';
import { components } from 'react-select';
import { shape, string } from 'prop-types';
import { useHistory } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import Theme from '../../../../theme/Theme';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import DSPBillingFilters from './DSPBillingFilters';
import ErrorMsg from '../../../../common/ErrorMsg';
import { getDSPBillingMetrics, getBills } from '../../../../api';
import { PATH_CUSTOMER_DETAILS } from '../../../../constants';
import {
  Card,
  ModalRadioCheck,
  Button,
  WhiteCard,
  DropDownIndicator,
  PageLoader,
  CommonPagination,
  Status,
  Table,
} from '../../../../common';
import {
  CaretUp,
  CloseIcon,
  CompanyDefaultUser,
} from '../../../../theme/images/index';
import {
  FinanceDateTypeOptions,
  DSPBillingMetrics,
  BillingVendorOptions,
  BillingSortByOptions,
  monthNames,
  InvoiceStatusColorSet,
} from '../../../../constants/DashboardConstants';

export default function DSPBillingContainer() {
  const currentDate = new Date();
  const dropdownRef = useRef(null);
  const history = useHistory();

  const [timeFrame, setTimeFrame] = useState({
    startDate: `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`,
    endDate: `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('any');
  const [billingLoader, setBillingLoader] = useState(false);
  const [billingData, setBillingData] = useState([]);
  const [billsCount, setBillsCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  // const isDesktop = useMediaQuery({ minWidth: 768 });
  const [showDropdown, setShowDropdown] = useState({ show: false });
  const [dspData, setDSPData] = useState([]);
  const { Option, SingleValue } = components;
  const [dateError, setDateError] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [selectedSortBy, setSelectedSortBy] = useState({
    value: '',
    label: 'Newest',
  });
  currentDate.setDate(currentDate.getDate() - 3);
  const [state, setState] = useState([currentDate, currentDate]);
  const [selectedDateType, setSelectedDateType] = useState(
    FinanceDateTypeOptions[0].value,
  );
  const [dummyDateType, setDummayDateType] = useState(
    FinanceDateTypeOptions[0].value,
  );

  const getBillingMetricsdata = useCallback((dateType, startDate, endDate) => {
    getDSPBillingMetrics(dateType, startDate, endDate).then((res) => {
      if (res && res.status === 400) {
        // setInvoiceLoader(false);
      }
      if (res && res.status === 200) {
        if (res.data && res.data) {
          setDSPData(res.data);
        }
      }
    });
  }, []);

  const getBillsData = useCallback(
    (searchKey, status, sortBy, page) => {
      setBillingLoader(true);
      getBills(
        searchKey,
        status,
        sortBy,
        selectedDateType,
        timeFrame,
        page,
      ).then((res) => {
        if (res && res.status === 400) {
          setBillingLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.results) {
            setBillingData(res.data.results);
            setBillsCount(res.data.count);
          }
          setBillingLoader(false);
          setPageNumber(page);
        }
        setBillingLoader(false);
      });
    },
    [selectedDateType, timeFrame],
  );

  useEffect(() => {
    if (responseId === null) {
      getBillingMetricsdata(dummyDateType);
      getBillsData(searchQuery, selectedStatus, selectedSortBy.value, 1);
      setResponseId('12345');
    }
  }, [
    responseId,
    getBillingMetricsdata,
    dummyDateType,
    getBillsData,
    searchQuery,
    selectedStatus,
    selectedSortBy,
  ]);

  const handleTimeTypeChange = (event) => {
    setDummayDateType(event.target.value);
  };

  const handleApply = () => {
    if (state !== null) {
      setDateError(null);
      let sd = state[0];
      let ed = state[1];
      setSelectedDateType(dummyDateType);

      setShowDropdown({ show: !showDropdown.show });

      if (dummyDateType === 'custom') {
        sd = `${state[0].getMonth() + 1}-${state[0].getFullYear()}`;
        ed = `${state[1].getMonth() + 1}-${state[1].getFullYear()}`;
        setTimeFrame({
          startDate: sd,
          endDate: ed,
        });

        getBillingMetricsdata(dummyDateType, sd, ed);
        return;
      }
      getBillingMetricsdata(dummyDateType);
    } else {
      setDateError('Please select valid date');
    }
  };

  const handleSortByFilter = (event) => {
    setSelectedSortBy(event);
    getBillsData(searchQuery, selectedStatus, event.value, 1);
  };

  const onHandleSearch = (event) => {
    setSearchQuery(event.target.value);
    getBillsData(event.target.value, selectedStatus, selectedSortBy.value, 1);
  };

  const handleResetFilter = () => {
    $('.checkboxes input:radio').filter("[value='any']").prop('checked', true);
    setSelectedStatus('any');
    setSearchQuery('');
    setSelectedSortBy({ value: 'created_at', label: 'Newest' });
    getBillsData('', 'any', 'created_at', 1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    getBillsData(searchQuery, event.target.value, selectedSortBy.value, 1);
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getBillsData(
      searchQuery,
      selectedStatus,
      selectedSortBy.value,
      currentPage,
    );
  };

  const filterOption = ({ data, ...props }) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>{data.label}</span>

        <div style={{ fontSize: '12px', color: '#556178' }}>{data.sub}</div>
      </div>
    </Option>
  );

  const singleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {`Sort by: ${props.data.label}`}
      </span>
      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
    </SingleValue>
  );

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropDownIndicator,
    };
  };

  const bindAmount = (orignalNumber, decimalDigits = 2) => {
    const number = Number(orignalNumber);
    if (number !== undefined && number !== null) {
      return number
        .toFixed(decimalDigits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return number;
  };

  const displayTimeFilterOption = () => {
    return showDropdown.show ? (
      <DateRangeDropDown>
        <h4 className="mb-3 text-left">Select Date Range</h4>
        <img
          className="float-right cursor cross-icon "
          src={CloseIcon}
          alt="close"
          role="presentation"
          onClick={() => {
            setDummayDateType(selectedDateType);
            setShowDropdown({ show: !showDropdown.show });
          }}
        />
        <ul>
          {FinanceDateTypeOptions.map((item, index) => (
            <li className="date-range" key={item.value}>
              <ModalRadioCheck className="mb-3">
                {' '}
                <label
                  className={`${
                    index === 0
                      ? 'checkboxes radio-container customer-list'
                      : 'checkboxes radio-container customer-list mt-2'
                  }`}
                  htmlFor={item.value}>
                  {item.label}
                  <input
                    type="radio"
                    name="timeFilter"
                    label={item.label}
                    id={item.value}
                    value={item.value}
                    onChange={(event) => handleTimeTypeChange(event)}
                    defaultChecked={item.value === selectedDateType}
                  />
                  <span className="checkmark checkmark-customer-list" />
                </label>
              </ModalRadioCheck>
            </li>
          ))}
        </ul>{' '}
        {dummyDateType === 'custom' ? (
          <div className="text-left">
            <DatePicker
              selected={new Date()}
              onChange={setState}
              startDate={state[0]}
              endDate={state[1]}
              maxDate={new Date()}
              selectsRange
              inline
              dateFormat="MM/yyyy"
              showMonthYearPicker
            />
          </div>
        ) : null}
        <ErrorMsg className="text-left">{dateError}</ErrorMsg>
        <Button
          className="btn-primary w-100 mt-3"
          onClick={() => handleApply()}>
          Apply
        </Button>
      </DateRangeDropDown>
    ) : null;
  };

  const renderTimeFilterLabel = () => {
    if (selectedDateType === 'allTime') {
      return 'All-Time';
    }
    const customDateLabel = `${
      monthNames[state[0].getMonth()]
    } '${state[0].getFullYear()} - ${
      monthNames[state[1].getMonth()]
    } '${state[1].getFullYear()}`;
    return customDateLabel;
  };

  const renderSortByDropDown = () => {
    return DropDown(
      '',
      BillingSortByOptions,
      BillingSortByOptions &&
        BillingSortByOptions[0] &&
        BillingSortByOptions[0].label,
      getSelectComponents,
      BillingSortByOptions && BillingSortByOptions[0],
      handleSortByFilter,
      false,
      null,
      selectedSortBy,
    );
  };

  const renderTimeFilterDropDown = () => {
    return (
      <div className="col-md-6 col-lg-6 col-7 text-right">
        <DropDownSelectMonthPicker
          id="BT-finance-dash-monthpicker-dropdown"
          ref={dropdownRef}>
          <div
            className="dropdown-select-all-notes"
            role="presentation"
            id="clickbox"
            onClick={() => {
              setShowDropdown({ show: !showDropdown.show });
            }}>
            {renderTimeFilterLabel()}
            <img
              src={CaretUp}
              alt="caret"
              style={{
                transform: showDropdown.show ? 'rotate(180deg)' : '',
                width: '25px',
                height: '25px',
                position: 'absolute',
                top: '8px',
                right: '21px',
              }}
            />
          </div>
          <div>{displayTimeFilterOption()}</div>
        </DropDownSelectMonthPicker>
      </div>
    );
  };

  const renderTitle = (data, key) => {
    if (data[key] === null) {
      return 'N/A';
    }
    if (
      key === 'total_overdue' ||
      key === 'expected_by_end_of_month' ||
      key === 'open_invoices'
    ) {
      return bindAmount(data[key], 0);
    }
    if (key === 'percentage_past_due') {
      return bindAmount(data[key], 2);
    }
    if (key === 'avg_days_past_due') {
      return bindAmount(data[key], 1);
    }

    return data[key];
  };

  const renderDSPFinanceMetrics = () => {
    return (
      <div className="row mt-3">
        {DSPBillingMetrics.map((item) => (
          <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
            {' '}
            <Card
              className="fix-height"
              heading={item.label}
              title={renderTitle(dspData, item.key)}
              titleColor={item.titleColor}
              prefix={dspData[item.key] !== null ? item.prefix : ''}
              postfix={item.postfix}
            />
          </div>
        ))}
      </div>
      // <div className="row mt-3">
      //   <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
      //     <Card
      //       className="fix-height "
      //       heading="Amazon Advertising LLC"
      //       noBill="12"
      //       noBillText="No. Bills"
      //       totalBill="$118,396"
      //       totalBillText="Total Billed"
      //       type="billing"
      //     />
      //   </div>
      //   <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
      //     <Card
      //       className="fix-height"
      //       heading="Amazon Online UK Limited"
      //       noBill="12"
      //       noBillText="No. Bills"
      //       totalBill="£27,396"
      //       totalBillText="Total Billed"
      //     />
      //   </div>
      //   <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
      //     <Card
      //       className="fix-height"
      //       heading="Amazon Online UK Limited (EUR)"
      //       noBill="12"
      //       noBillText="No. Bills"
      //       totalBill="€44,692"
      //       totalBillText="Total Billed"
      //     />
      //   </div>
      //   <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
      //     <Card
      //       className="fix-height"
      //       heading="Amazon Commercial Services Pty Ltd"
      //       noBill="12"
      //       noBillText="No. Bills"
      //       totalBill="A$3,295"
      //       totalBillText="Total Billed"
      //     />
      //   </div>
      // </div>
    );
  };

  const renderTableData = (item) => {
    const billDate = dayjs(item.generated_at).format('MM/DD/YY');
    const dueDate = dayjs(item.due_date).format('MM/DD/YY');
    return (
      <tr
        className="cursor"
        key={item.invoiced_id}
        onClick={() =>
          history.push(
            PATH_CUSTOMER_DETAILS.replace(
              ':id',
              item.customer && item.customer.id,
            ),
            'finance',
          )
        }>
        <td className="product-body">
          {' '}
          <img className="company-logo" src={CompanyDefaultUser} alt="logo" />
          <div className="company-name">
            {item.customer && item.customer.name}
          </div>
          <div className="status">#{item.invoiced_id}</div>
        </td>
        <td className="product-table-body">
          ${bindAmount(item.monthly_budget, 0, true)}
        </td>
        <td className="product-table-body light-font">{billDate}</td>
        <td className="product-table-body light-font">{dueDate}</td>
        <td className="product-table-body text-right">
          <Status
            className="float-right"
            label={item.invoice_status}
            backgroundColor={
              InvoiceStatusColorSet[item.invoice_status.split(' ')[0]]
            }
          />
          <div className="clear-fix" />
        </td>
      </tr>
    );
  };

  const renderInvoicesTable = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th width="31%" className="product-header">
              Bill #
            </th>
            <th width="17%" className="product-header">
              Amount
            </th>
            <th width="17%" className="product-header">
              Bill Date
            </th>
            <th width="15%" className="product-header">
              {' '}
              Due Date
            </th>
            <th width="20%" className="product-header text-right pr-2">
              {' '}
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {billingData && billingData.map((item) => renderTableData(item))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-6 col-lg-6 col-5 mt-2 ">
          <div className="medium-text-title ">DSP Billing</div>{' '}
        </div>
        {renderTimeFilterDropDown()}
      </div>
      {renderDSPFinanceMetrics()}

      <div className="row ">
        <DSPBillingFilters
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          statusOptions={BillingVendorOptions}
          onHandleSearch={onHandleSearch}
          handleResetFilter={handleResetFilter}
          handleStatusChange={handleStatusChange}
        />
        <div className="col-lg-9">
          <WhiteCard className="d-lg-block d-md-block d-none">
            <div className="row">
              <div className="col-9 ">
                <div className="black-heading-title mt-3">Bills</div>{' '}
              </div>
              <div
                id="BT-finace-dah-invoice-dropdown"
                className="col-3  text-right">
                {renderSortByDropDown()}
              </div>
            </div>
            <div className="straight-line horizontal-line  mt-3 mb-1" />

            {billingLoader ? (
              <PageLoader
                component="performance-graph"
                color="#FF5933"
                type="detail"
                width={40}
                height={40}
              />
            ) : billingData && billingData.length > 0 ? (
              <>
                {renderInvoicesTable()}
                <CommonPagination
                  count={billsCount}
                  pageNumber={pageNumber}
                  handlePageChange={handlePageChange}
                />
              </>
            ) : (
              <NoData>No Invoices Found</NoData>
            )}
          </WhiteCard>
        </div>
      </div>
    </>
  );
}

DSPBillingContainer.defaultProps = {
  data: shape({
    label: '',
    sub: '',
  }),
};
DSPBillingContainer.propTypes = {
  data: shape({
    label: string,
    sub: string,
  }),
};

const DateRangeDropDown = styled.div`
  background-color: ${Theme.white};
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  position: absolute;
  right: 15px;
  z-index: 22;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  top: 45px;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: left;
    .date-range {
      display: inline-block;
      text-align: left;
      margin-right: 20px;
    }
  }
  .cross-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 16px;
  }
`;

const DropDownSelectMonthPicker = styled.div`
  .dropdown-select-all-notes {
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2};
    border-radius: 20px;
    width: 230px;
    height: 40px;
    color: ${Theme.black};
    padding: 11px 2px 0 14px;
    text-align: left;
    cursor: pointer;

    @media only screen and (max-width: 450px) {
      width: 160px;
    }
  }
`;

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
