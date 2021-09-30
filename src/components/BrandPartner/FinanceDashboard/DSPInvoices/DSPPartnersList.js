/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import $ from 'jquery';
import { components } from 'react-select';
import { useHistory } from 'react-router-dom';
import { bool, func, string } from 'prop-types';

import DSPInvoiceTabs from './DSPInvoiceTabs';
import EnableInvoiceing from './EnableInvoiceing';
import DSPInvoiceFilters from './DSPInvoiceFilters';
import TableMobileView from '../../../../common/TableMobileView';
import { getFinanceInvoices } from '../../../../api';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { PATH_CUSTOMER_DETAILS } from '../../../../constants';
import { CompanyDefaultUser } from '../../../../theme/images/index';
import {
  PartnersStatusOptions,
  PartnersSortByOptions,
} from '../../../../constants/DashboardConstants';
import {
  WhiteCard,
  Table,
  DropDownIndicator,
  PageLoader,
  CommonPagination,
  NoData,
} from '../../../../common';

export default function DSPPartnersList({
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('any');
  const [partnerLoader, setPartnerLoader] = useState(false);
  const [partnerData, setPartnerData] = useState([]);
  const [partnerCount, setPartnerCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const { Option, SingleValue } = components;
  const [responseId, setResponseId] = useState(null);

  const [selectedSortBy, setSelectedSortBy] = useState({
    value: 'total_outstanding',
    label: 'Total Outstanding',
  });

  const history = useHistory();

  const getPartners = useCallback(
    (searchKey, status, sortBy, page) => {
      setPartnerLoader(true);
      getFinanceInvoices(
        'partner',
        searchKey,
        status,
        sortBy,
        timeFrameType,
        timeFrame,
        page,
        selectedNavigation,
      ).then((res) => {
        if (res && res.status === 400) {
          setPartnerLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.results) {
            setPartnerData(res.data.results);
            setPartnerCount(res.data.count);
          }
          setPartnerLoader(false);
          setPageNumber(page);
        }
      });
    },
    [timeFrameType, timeFrame, selectedNavigation],
  );

  useEffect(() => {
    if (responseId === null || isTimeFrameChange) {
      getPartners(searchQuery, selectedStatus, selectedSortBy.value, 1);
      setResponseId('12345');
      setIsTimeFrameChange(false);
    }
  }, [
    getPartners,
    searchQuery,
    selectedStatus,
    selectedSortBy,
    responseId,
    setIsTimeFrameChange,
    isTimeFrameChange,
  ]);

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
        {`Sort by: ${props.data.label}`}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
    </SingleValue>
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

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropDownIndicator,
    };
  };

  const onHandleSearch = (event) => {
    setSearchQuery(event.target.value);
    getPartners(event.target.value, selectedStatus, selectedSortBy.value, 1);
  };

  const handleResetFilter = () => {
    $('.checkboxes input:radio').filter("[value='any']").prop('checked', true);
    setSelectedStatus('any');
    setSearchQuery('');
    setSelectedSortBy({
      value: 'total_outstanding',
      label: 'Total Outstanding',
    });
    getPartners('', 'any', 'total_outstanding', 1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    getPartners(searchQuery, event.target.value, selectedSortBy.value, 1);
  };

  const handleSortByFilter = (event) => {
    setSelectedSortBy(event);
    getPartners(searchQuery, selectedStatus, event.value, 1);
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getPartners(searchQuery, selectedStatus, selectedSortBy.value, currentPage);
  };

  const renderSortByDropDown = () => {
    return DropDown(
      '',
      PartnersSortByOptions,
      PartnersSortByOptions &&
        PartnersSortByOptions[0] &&
        PartnersSortByOptions[0].label,
      getSelectComponents,
      PartnersSortByOptions && PartnersSortByOptions[0],
      handleSortByFilter,
      false,
      null,
      selectedSortBy,
    );
  };

  const renderTableData = (item) => {
    return (
      <tr
        className="cursor"
        onClick={() =>
          history.push(
            PATH_CUSTOMER_DETAILS.replace(
              ':id',
              item.customer && item.customer.id,
            ),
            selectedNavigation,
          )
        }
        key={item.id}>
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
          <div className="company-name">{item.customer.name}</div>
        </td>
        <td className="product-table-body">
          ${bindAmount(item.total_outstanding, 2, true)}
        </td>
        <td className="product-table-body">
          ${bindAmount(item.total_overdue, 2, true)}
        </td>
        <td className="product-table-body light-font">
          {`${
            item.avg_days_past_due !== 0
              ? item.avg_days_past_due
                  .toFixed(1)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : 0
          } days`}
        </td>
        <td className="product-table-body light-font">
          {`${bindAmount(item.paid_by_due_date, 0, true)} %`}
        </td>
      </tr>
    );
  };

  const renderPartnersTable = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th width="35%" className="product-header">
              Partner Name
            </th>
            <th width="18%" className="product-header">
              Total Outstanding
            </th>
            <th width="18%" className="product-header">
              Total OverDue
            </th>
            <th width="18%" className="product-header">
              {' '}
              Avg. Days Past Due
            </th>
            <th width="31%" className="product-header">
              {' '}
              Paid By Due Date
            </th>
          </tr>
        </thead>
        <tbody>
          {partnerData && partnerData.map((item) => renderTableData(item))}
        </tbody>
      </Table>
    );
  };

  const renderTabletInvoicesTable = () => {
    return (
      <>
        {partnerData && partnerData.length > 0 ? (
          partnerData &&
          partnerData.map((item) => (
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
              key={item.id}
              className="mb-3 cursor"
              CompanyName={item.customer.name}
              label="TOTAL OUTSTANDING"
              labelInfo={`$${bindAmount(item.total_outstanding, 2, true)}`}
              label1="TOTAL OVERDUE"
              labelInfo1={`$${bindAmount(item.total_overdue, 2, true)}`}
              label2="AVG. DAYS PAST DUE"
              labelInfo2={`${
                item.avg_days_past_due === 0
                  ? item.avg_days_past_due
                      .toFixed(1)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : 0
              } days`}
              label3="PAID BY DUE DATE"
              labelInfo3={`${bindAmount(item.paid_by_due_date, 0, true)} %`}
            />
          ))
        ) : (
          <NoData>No partners Found</NoData>
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
          statusOptions={PartnersStatusOptions}
          onHandleSearch={onHandleSearch}
          handleResetFilter={handleResetFilter}
          handleStatusChange={handleStatusChange}
        />
      </div>
      <div className="col-lg-9">
        {isDesktop || isTablet ? (
          <>
            {selectedNavigation === 'revShare' ? (
              <EnableInvoiceing view="desktop" />
            ) : null}

            <WhiteCard className="d-lg-block d-md-block d-none">
              <div className="row">
                <div className="col-9 ">
                  <div className="black-heading-title mt-3">Partners</div>{' '}
                </div>
                <div
                  id="BT-finace-dah-invoice-partners"
                  className="col-3  text-right">
                  {renderSortByDropDown()}
                </div>
              </div>
              <div className="straight-line horizontal-line  mt-3 mb-1" />

              {partnerLoader ? (
                <PageLoader
                  component="performance-graph"
                  color="#FF5933"
                  type="detail"
                  width={40}
                  height={40}
                />
              ) : partnerData && partnerData.length > 0 ? (
                <>
                  {renderPartnersTable()}
                  <CommonPagination
                    count={partnerCount}
                    pageNumber={pageNumber}
                    handlePageChange={handlePageChange}
                  />
                </>
              ) : (
                <NoData>No partners Found</NoData>
              )}
            </WhiteCard>
          </>
        ) : (
          // for mobile view
          <>
            {selectedNavigation === 'revShare' ? (
              <EnableInvoiceing view="mobile" />
            ) : null}
            <div className="d-lg-none d-md-none d-sm-block mt-3 mb-3">
              <div className="row mt-2">
                <div className="col-5 pl-4 mt-3 ">
                  <div className="black-heading-title ">Invoices</div>{' '}
                </div>
                <div className="col-7  pr-4 mb-3">{renderSortByDropDown()}</div>
              </div>

              {partnerLoader ? (
                <PageLoader
                  component="performance-graph"
                  color="#FF5933"
                  type="detail"
                  width={40}
                  height={40}
                />
              ) : (
                <>
                  {renderTabletInvoicesTable()}
                  <CommonPagination
                    count={partnerCount}
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

DSPPartnersList.defaultProps = {
  onTabClick: () => {},
  selectedNavigation: '',
};
DSPPartnersList.propTypes = {
  onTabClick: func,
  viewComponent: string.isRequired,
  isDesktop: bool.isRequired,
  isTablet: bool.isRequired,
  selectedNavigation: string,
};
