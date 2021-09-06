/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
// import { components } from 'react-select';
import $ from 'jquery';
import { useMediaQuery } from 'react-responsive';
import {
  WhiteCard,
  Table,
  // DropDownIndicator,
  PageLoader,
  CommonPagination,
} from '../../../common';
import { CompanyDefaultUser } from '../../../theme/images/index';
import FinanceDashboardFilters from './FinanceDashboardFilters';
import TableMobileView from '../../../common/TableMobileView';
import {
  PartnersStatusOptions,
  // PartnersSortByOptions,
} from '../../../constants/DashboardConstants';
import { getFinanceInvoices } from '../../../api';
// import { DropDown } from '../../Customer/CompanyPerformance/DropDown';

export default function FinancePartners({
  timeFrame,
  timeFrameType,
  isTimeFrameChange,
  setIsTimeFrameChange,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('any');
  const [partnerLoader, setPartnerLoader] = useState(false);
  const [partnerData, setPartnerData] = useState([]);
  const [partnerCount, setPartnerCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  // const { Option, SingleValue } = components;
  const [responseId, setResponseId] = useState(null);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [selectedSortBy, setSelectedSortBy] = useState({
    value: 'total_outstanding',
    label: 'Total Outstanding',
  });

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
    [timeFrameType, timeFrame],
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

  // const filterOption = (props) => (
  //   <Option {...props}>
  //     <div className="pb-2">
  //       <span style={{ fontSize: '15px', color: '#000000' }}>
  //         {props.data.label}
  //       </span>

  //       <div style={{ fontSize: '12px', color: '#556178' }}>
  //         {props.data.sub}
  //       </div>
  //     </div>
  //   </Option>
  // );

  // const singleFilterOption = (props) => (
  //   <SingleValue {...props}>
  //     <span style={{ fontSize: '15px', color: '#000000' }}>
  //       {`Sort by: ${props.data.label}`}
  //     </span>

  //     <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
  //   </SingleValue>
  // );

  const bindAmount = (orignalNumber, decimalDigits = 2) => {
    const number = Number(orignalNumber);
    if (number !== undefined && number !== null) {
      return number
        .toFixed(decimalDigits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return number;
  };

  // const getSelectComponents = () => {
  //   return {
  //     Option: filterOption,
  //     SingleValue: singleFilterOption,
  //     DropDownIndicator,
  //   };
  // };

  const onHandleSearch = (event) => {
    setSearchQuery(event.target.value);
    getPartners(event.target.value, selectedStatus, selectedSortBy.value, 1);
  };

  const handleResetFilter = () => {
    $('.checkboxes input:radio').filter("[value='any']").prop('checked', true);
    setSelectedStatus('any');
    setSearchQuery('');
    setSelectedSortBy({
      value: 'totalOutstanding',
      label: 'Total Outstanding',
    });
    getPartners('', 'any', selectedSortBy.value, 1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    getPartners(searchQuery, event.target.value, selectedSortBy.value, 1);
  };

  // const handleSortByFilter = (event) => {
  //   setSelectedSortBy(event);
  //   getPartners(searchQuery, selectedStatus, event.value, 1);
  // };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getPartners(searchQuery, selectedStatus, selectedSortBy.value, currentPage);
  };

  // const renderSortByDropDown = () => {
  //   return DropDown(
  //     '',
  //     PartnersSortByOptions,
  //     PartnersSortByOptions &&
  //       PartnersSortByOptions[0] &&
  //       PartnersSortByOptions[0].label,
  //     getSelectComponents,
  //     PartnersSortByOptions && PartnersSortByOptions[0],
  //     handleSortByFilter,
  //     false,
  //     null,
  //     selectedSortBy,
  //   );
  // };

  const renderTableData = (item) => {
    return (
      <tr key={item.id}>
        <td className="product-body">
          {' '}
          <img className="company-logo" src={CompanyDefaultUser} alt="logo" />
          <div className="company-name">{item.customer}</div>
        </td>
        <td className="product-table-body">
          ${bindAmount(item.total_outstanding)}
        </td>
        <td className="product-table-body">
          ${bindAmount(item.total_overdue)}
        </td>
        <td className="product-table-body light-font">
          {item.avg_days_past_due} days
        </td>
        <td className="product-table-body light-font">
          {item.paid_by_due_date}%
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
              key={item.id}
              className="mb-3"
              CompanyName={item.customer}
              label="TOTAL OUTSTANDING"
              labelInfo={`$${bindAmount(item.total_outstanding)}`}
              label1="TOTAL OVERDUE"
              labelInfo1={`$${bindAmount(item.total_overdue)}`}
              label2="AVG. DAYS PAST DUE"
              labelInfo2={`${item.avg_days_past_due} days`}
              label3="PAID BY DUE DATE"
              labelInfo3={`${item.paid_by_due_date} %`}
            />
          ))
        ) : (
          <NoData>Partner Data Not Available</NoData>
        )}
      </>
    );
  };

  return (
    <>
      <FinanceDashboardFilters
        searchQuery={searchQuery}
        selectedStatus={selectedStatus}
        statusOptions={PartnersStatusOptions}
        onHandleSearch={onHandleSearch}
        handleResetFilter={handleResetFilter}
        handleStatusChange={handleStatusChange}
      />
      <div className="col-lg-9">
        {isDesktop ? (
          <WhiteCard className="d-lg-block d-md-block d-none">
            <div className="row">
              <div className="col-9 ">
                <div className="black-heading-title mt-3">Partners</div>{' '}
              </div>
              <div
                id="BT-finace-dah-invoice-partners"
                className="col-3  text-right">
                {/* {renderSortByDropDown()} */}
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
              <NoData>Partner Data Not Available</NoData>
            )}
          </WhiteCard>
        ) : (
          // for mobile view
          <div className="d-lg-none d-md-none d-sm-block mt-3 mb-3">
            <div className="row mt-2">
              <div className="col-5 pl-4 mt-3 ">
                <div className="black-heading-title ">Invoices</div>{' '}
              </div>
              <div className="col-7  pr-4 mb-3">
                {/* {renderSortByDropDown()} */}
              </div>
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
        )}
      </div>
    </>
  );
}

FinancePartners.defaultProps = {};
FinancePartners.propTypes = {};

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
