/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import $ from 'jquery';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { components } from 'react-select';
import { useHistory } from 'react-router-dom';
import { func, string, bool, objectOf } from 'prop-types';

import DSPInvoiceFilters from './InvoiceFilters';
import Theme from '../../../../theme/Theme';
import DSPInvoiceTabs from './InvoiceTabs';
import TableMobileView from '../../../../common/TableMobileView';
import { CompanyDefaultUser } from '../../../../theme/images';
import { getFinanceInvoices } from '../../../../api';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import {
  InvoicesStatusOptions,
  InvoicesSortByOptions,
  StatusColorSet,
  PATH_CUSTOMER_DETAILS,
} from '../../../../constants';
import {
  WhiteCard,
  Table,
  Status,
  DropdownIndicator,
  PageLoader,
  CommonPagination,
  NoData,
} from '../../../../common';

export default function InvoicesList({
  timeFrame,
  timeFrameType,
  isTimeFrameChange,
  setIsTimeFrameChange,
  onTabClick,
  viewComponent,
  isDesktop,
  isTablet,
  selectedNavigation,
}) {
  const mounted = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('any');
  const [invoiceLoader, setInvoiceLoader] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [invoiceCount, setInvoiceCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const { Option, SingleValue } = components;
  const [responseId, setResponseId] = useState(null);

  const [selectedSortBy, setSelectedSortBy] = useState({
    value: '',
    label: 'Status',
  });
  const history = useHistory();

  const getInvoices = useCallback(
    (searchKey, status, sortBy, page) => {
      setInvoiceLoader(true);
      getFinanceInvoices(
        'invoice',
        searchKey,
        status,
        sortBy,
        timeFrameType,
        timeFrame,
        page,
        selectedNavigation,
      ).then((res) => {
        if (mounted.current) {
          if (res && res.status === 400) {
            setInvoiceLoader(false);
          }
          if (res && res.status === 200) {
            if (res.data && res.data.results) {
              setInvoiceData(res.data.results);
              setInvoiceCount(res.data.count);
            }
            setInvoiceLoader(false);
            setPageNumber(page);
          }
        }
      });
    },
    [timeFrameType, timeFrame, selectedNavigation],
  );

  useEffect(() => {
    mounted.current = true;
    if (responseId === null || isTimeFrameChange) {
      getInvoices(searchQuery, selectedStatus, selectedSortBy.value, 1);
      setResponseId('12345');
      setIsTimeFrameChange(false);
    }
    return () => {
      mounted.current = false;
    };
  }, [
    getInvoices,
    searchQuery,
    selectedStatus,
    selectedSortBy,
    responseId,
    setIsTimeFrameChange,
    isTimeFrameChange,
  ]);

  const debouncedSave = useCallback(
    debounce(
      (searchKey, status, sortBy, page) =>
        getInvoices(searchKey, status, sortBy, page),
      500,
    ),
    [],
  );

  const onHandleSearch = (event) => {
    setSearchQuery(event.target.value);
    debouncedSave(event.target.value, selectedStatus, selectedSortBy.value, 1);
  };

  const handleResetFilter = () => {
    $('.checkboxes input:radio').filter("[value='any']").prop('checked', true);
    setSelectedStatus('any');
    setSearchQuery('');
    setSelectedSortBy({ value: '', label: 'Status' });
    getInvoices('', 'any', '', 1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    getInvoices(searchQuery, event.target.value, selectedSortBy.value, 1);
  };

  const handleSortByFilter = (event) => {
    setSelectedSortBy(event);
    getInvoices(searchQuery, selectedStatus, event.value, 1);
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getInvoices(searchQuery, selectedStatus, selectedSortBy.value, currentPage);
  };

  const filterOption = ({ data, ...props }) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>{data.label}</span>

        <div style={{ fontSize: '12px', color: '#556178' }}>{data.sub}</div>
      </div>
    </Option>
  );

  const bindAmount = (orignalNumber, decimalDigits = 2, isRounded = false) => {
    let number = Number(orignalNumber);
    if (number !== undefined && number !== null) {
      number = number
        .toFixed(decimalDigits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (isRounded) {
      const no = number.toString().split('.');
      if (no[1] === '00') {
        return no[0];
      }
    }

    return number;
  };

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
      DropdownIndicator,
    };
  };

  const renderSortByDropDown = () => {
    return DropDown(
      '',
      InvoicesSortByOptions,
      InvoicesSortByOptions &&
        InvoicesSortByOptions[0] &&
        InvoicesSortByOptions[0].label,
      getSelectComponents,
      InvoicesSortByOptions && InvoicesSortByOptions[0],
      handleSortByFilter,
      false,
      null,
      selectedSortBy,
    );
  };

  const renderTableData = (item) => {
    const cretaedDate = dayjs(item.generated_at).format('MM/DD/YY');
    const dueDate = dayjs(item.due_date).format('MM/DD/YY');
    return (
      <tr
        className="cursor"
        key={item.next_invoiced_id}
        onClick={() =>
          history.push(
            PATH_CUSTOMER_DETAILS.replace(
              ':id',
              item.customer && item.customer.id,
            ),
            selectedNavigation,
          )
        }>
        <td className="product-body">
          {' '}
          <img
            className="company-logo"
            src={
              item && item.customer && item.customer.profile_picture
                ? item.customer.profile_picture
                : CompanyDefaultUser
            }
            alt="logo"
          />
          <div className="company-info-details">
            <div className="company-name">
              {item.customer && item.customer.name}
            </div>
            <div className="status">
              {item.invoice_type} | #{item.next_invoiced_id}
            </div>
          </div>
        </td>
        <td className="product-table-body">
          ${bindAmount(item.monthly_budget, 0, true)}
        </td>
        <td className="product-table-body light-font">{cretaedDate}</td>
        <td className="product-table-body light-font">{dueDate}</td>
        <td className="product-table-body text-right">
          <Status
            className="float-right"
            label={item.invoice_status.replace(' )', ')')}
            backgroundColor={StatusColorSet[item.invoice_status.split(' ')[0]]}
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
              Invoice Type / Number
            </th>
            <th width="17%" className="product-header">
              Amount
            </th>
            <th width="17%" className="product-header">
              Created On
            </th>
            <th width="15%" className="product-header">
              {' '}
              Due
            </th>
            <th width="20%" className="product-header text-right pr-2">
              {' '}
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceData && invoiceData.map((item) => renderTableData(item))}
        </tbody>
      </Table>
    );
  };

  const renderTabletInvoicesTable = () => {
    return (
      <>
        {invoiceData && invoiceData.length > 0 ? (
          invoiceData &&
          invoiceData.map((item) => (
            <TableMobileView
              onClick={() =>
                history.push(
                  PATH_CUSTOMER_DETAILS.replace(
                    ':id',
                    item.customer && item.customer.id,
                  ),
                  selectedNavigation,
                )
              }
              key={item.next_invoiced_id}
              className="mb-3 cursor"
              CompanyName={item.customer && item.customer.name}
              invoiceType={item.invoice_type}
              invoiceId={`#${item?.next_invoiced_id}`}
              label="AMOUNT"
              labelInfo={`$${bindAmount(item.monthly_budget, 0, true)}`}
              label1="CREATED ON"
              labelInfo1={dayjs(item.generated_at).format('MM/DD/YY')}
              label2="DUE"
              labelInfo2={dayjs(item.due_date).format('MM/DD/YY')}
              status={item.invoice_status.replace(' )', ')')}
              statusColor={StatusColorSet[item.invoice_status.split(' ')[0]]}
            />
          ))
        ) : (
          <NoData>No Invoices Found</NoData>
        )}
      </>
    );
  };

  return (
    <>
      <div className="col-lg-3 col-md-12">
        {isDesktop ? (
          <DSPInvoiceTabs
            onTabClick={onTabClick}
            viewComponent={viewComponent}
          />
        ) : null}
        <DSPInvoiceFilters
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          statusOptions={InvoicesStatusOptions}
          onHandleSearch={onHandleSearch}
          handleResetFilter={handleResetFilter}
          handleStatusChange={handleStatusChange}
        />
      </div>
      <div className="col-lg-9">
        {isDesktop || isTablet ? (
          // for dekstop/tablet View

          <WhiteCard className="d-lg-block d-md-block d-none">
            <div className="row">
              <div className="col-9 ">
                <div className="black-heading-title mt-3">Invoices</div>{' '}
              </div>
              <div
                id="BT-finace-dah-invoice-dropdown"
                className="col-3  text-right">
                {renderSortByDropDown()}
              </div>
            </div>
            <div className="straight-line horizontal-line  mt-3 mb-1" />

            {invoiceLoader ? (
              <PageLoader
                component="performance-graph"
                color={Theme.orange}
                type="detail"
                width={40}
                height={40}
              />
            ) : invoiceData && invoiceData.length > 0 ? (
              <>
                {renderInvoicesTable()}
                <CommonPagination
                  count={invoiceCount}
                  pageNumber={pageNumber}
                  handlePageChange={handlePageChange}
                />
              </>
            ) : (
              <NoData>No Invoices Found</NoData>
            )}
          </WhiteCard>
        ) : (
          // for mobile View
          <>
            <div className="d-lg-none d-md-none d-sm-block mt-3 mb-3">
              <div className="row mt-2">
                <div className="col-5 pl-4 mt-3 ">
                  <div className="black-heading-title ">Invoices</div>{' '}
                </div>
                <div className="col-7  pr-4 mb-3">{renderSortByDropDown()}</div>
              </div>

              {invoiceLoader ? (
                <PageLoader
                  component="performance-graph"
                  color={Theme.orange}
                  type="detail"
                  width={40}
                  height={40}
                />
              ) : (
                <>
                  {renderTabletInvoicesTable()}
                  <CommonPagination
                    count={invoiceCount}
                    pageNumber={pageNumber}
                    handlePageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

InvoicesList.defaultProps = {
  data: () => {},
  onTabClick: () => {},
  timeFrame: new Date(),
  timeFrameType: '',
  isTimeFrameChange: false,
  setIsTimeFrameChange: () => {},
  selectedNavigation: '',
};
InvoicesList.propTypes = {
  data: func,
  onTabClick: func,
  viewComponent: string.isRequired,
  isDesktop: bool.isRequired,
  isTablet: bool.isRequired,
  timeFrame: objectOf(Object),
  timeFrameType: string,
  isTimeFrameChange: bool,
  setIsTimeFrameChange: func,
  selectedNavigation: string,
};
