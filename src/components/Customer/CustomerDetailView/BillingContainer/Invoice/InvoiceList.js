import React, { useCallback, useEffect, useState, useRef } from 'react';

import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { arrayOf, bool, shape, string } from 'prop-types';

import InvoiceAdjustmentsContainer from './InvoiceAdjustmentsContainer';
import Theme from '../../../../../theme/Theme';
import { BellNotification } from '../../../../../theme/images';
import { getInvoiceData, getUpcomingInvoiceData } from '../../../../../api';
import { StatusColorSet, InvoiceTypeNames } from '../../../../../constants';
import {
  CommonPagination,
  PageLoader,
  Status,
  Table,
  WhiteCard,
  Tabs,
  NoData,
  TableMobileView,
} from '../../../../../common';

const InvoiceList = ({ loader, invoiceType, id, bpName, memberData }) => {
  const isDSPService = invoiceType === 'dsp service';
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [selectedComponent, setSelectedComponent] = useState('past');
  const [invoicesData, setInvoicesData] = useState();
  const [pastInvoiceLoader, setPastInvoiceLoader] = useState(false);
  const [isApicall, setIsApiCall] = useState(false);
  const [count, setCount] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const mounted = useRef(false);
  const invoiceDataLength = invoicesData?.length;

  const getDSPInvoicesData = useCallback(
    (type, currentPage) => {
      setPastInvoiceLoader(true);
      getInvoiceData(type, id, currentPage).then((res) => {
        if (mounted.current) {
          if (res?.status === 500) {
            setPastInvoiceLoader(false);
            setInvoicesData(null);
          }
          if (res?.status === 400) {
            setPastInvoiceLoader(false);
          }
          if (res?.status === 200) {
            if (res.data?.results) {
              setInvoicesData(res.data.results);
              setCount(res.data.count);
              setPageNumber(currentPage);
            } else {
              setInvoicesData(null);
              setCount(null);
              setPageNumber(1);
            }
            setPastInvoiceLoader(false);
          }
        }
      });
    },
    [id],
  );

  const getDSPUpcomingInvoicesData = useCallback(
    (currentPage) => {
      setPastInvoiceLoader(true);
      getUpcomingInvoiceData(id, currentPage).then((res) => {
        if (mounted.current) {
          if (res?.status === 500) {
            setPastInvoiceLoader(false);
            setInvoicesData(null);
          }
          if (res?.status === 400) {
            setPastInvoiceLoader(false);
          }
          if (res?.status === 200) {
            if (res.data?.results) {
              setInvoicesData(res.data.results);
              setCount(res.data.count);
              setPageNumber(currentPage);
            } else {
              setInvoicesData(null);
              setCount(null);
              setPageNumber(1);
            }
            setPastInvoiceLoader(false);
          }
        }
      });
    },
    [id],
  );

  const handlePageChange = (currentPage) => {
    if (selectedComponent === 'past') {
      setPageNumber(currentPage);
      getDSPInvoicesData(invoiceType, currentPage);
    }
    if (selectedComponent === 'upcoming') {
      setPageNumber(currentPage);
      getDSPUpcomingInvoicesData(currentPage);
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    mounted.current = true;
    if (!isApicall) {
      getDSPInvoicesData(invoiceType);
      setIsApiCall(true);
    }
    return () => {
      mounted.current = false;
    };
  }, [getDSPInvoicesData, invoiceType, isApicall, setIsApiCall]);

  const addThousandComma = useCallback((number, decimalDigits = 2) => {
    if (number !== undefined && number !== null) {
      return Number(number)
        .toFixed(decimalDigits)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return number;
  }, []);

  const renderPastUpcomingTab = () => {
    return (
      <>
        {isDSPService ? (
          <Tabs className={pastInvoiceLoader ? 'disabled mb-3' : 'mb-3'}>
            <ul className="tabs">
              <li
                key="pastInvoices"
                className={selectedComponent === 'past' ? 'active' : ''}
                onClick={() => {
                  getDSPInvoicesData(invoiceType);
                  setSelectedComponent('past');
                }}
                role="presentation">
                Past Invoices
              </li>
              <li
                key="upcomingInvoices"
                className={selectedComponent === 'upcoming' ? 'active' : ''}
                onClick={() => {
                  getDSPUpcomingInvoicesData();
                  setSelectedComponent('upcoming');
                }}
                role="presentation">
                Upcoming Invoices
              </li>
            </ul>
          </Tabs>
        ) : (
          <div className="straight-line horizontal-line spacing d-md-block d-none " />
        )}
      </>
    );
  };

  const renderMobilePastInvoice = () => {
    return invoicesData.map((item) => {
      return (
        <TableMobileView
          key={item?.id}
          className="mb-3"
          invoiceType={
            isDSPService
              ? `${item?.description?.budget_type} (${item?.month})`
              : item?.invoice_type
          }
          invoiceId={`#${item?.next_invoiced_id}`}
          marketplaces={
            isDSPService && item?.description?.marketplaces
              ? ` | ${item?.description?.marketplaces}`
              : null
          }
          status={item.invoice_status}
          statusColor={
            StatusColorSet[item?.invoice_status.split(' ')[0].toLowerCase()]
              ? StatusColorSet[item?.invoice_status.split(' ')[0].toLowerCase()]
              : '#E3F2D2'
          }
          label="Amount"
          labelInfo={`$${addThousandComma(item?.monthly_budget, 0)}`}
          label1="Created on"
          labelInfo1={dayjs(item.generated_at).format('MM/DD/YY')}
          label2="Due"
          labelInfo2={dayjs(item.due_date).format('MM/DD/YY')}
        />
      );
    });
  };

  const renderMobileUpcomingInvoice = () => {
    return invoicesData.map((item) => {
      return (
        <TableMobileView
          key={item?.id}
          className="mb-3"
          invoiceType={
            isDSPService
              ? `${InvoiceTypeNames[item?.dsp_invoice_subtype]} (${
                  item?.applicable_from
                })`
              : null
          }
          invoiceId={null}
          marketplaces={
            isDSPService && item?.marketplaces ? item?.marketplaces : null
          }
          status={item?.status}
          statusColor={
            StatusColorSet[item?.status.split(' ')[0].toLowerCase()]
              ? StatusColorSet[item?.status.split(' ')[0].toLowerCase()]
              : '#E3F2D2'
          }
          label="Amount"
          labelInfo={`$${
            item?.amount === null ? 0 : addThousandComma(item?.amount, 0)
          }`}
          label1="Created on"
          labelInfo1={
            item?.created !== null
              ? dayjs(item?.created).format('MM/DD/YY')
              : 'N/A'
          }
          label2="Due"
          labelInfo2={
            item?.due !== null ? dayjs(item?.due).format('MM/DD/YY') : 'N/A'
          }
          isShowBellIcon={item?.budget_approved === null}
        />
      );
    });
  };

  const renderMobileView = () => {
    return (
      <>
        <WhiteCard className="mb-3">
          <div className="row">
            <div className="col-12">
              <div className="black-heading-title">
                {invoiceType === 'rev share'
                  ? 'Revenue Share Invoices'
                  : invoiceType === 'upsell'
                  ? 'Upsell Invoices'
                  : invoiceType === 'retainer'
                  ? 'Monthly Retainer Invoices'
                  : 'DSP Invoices'}
              </div>
            </div>
          </div>
        </WhiteCard>
        {renderPastUpcomingTab()}
        {pastInvoiceLoader && isDSPService ? (
          <PageLoader
            component="performance-graph"
            type="detail"
            color={Theme.orange}
            width={40}
            height={40}
          />
        ) : invoiceDataLength >= 1 ? (
          <>
            {selectedComponent === 'past'
              ? renderMobilePastInvoice()
              : renderMobileUpcomingInvoice()}{' '}
            <>
              <div
                className={
                  invoiceDataLength < 9 && count < 10
                    ? ''
                    : 'straight-line horizontal-line mt-3'
                }
              />
              <CommonPagination
                count={count}
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}
              />
            </>
          </>
        ) : (
          <NoData>
            No{' '}
            {invoiceType === 'rev share'
              ? 'Revenue Share Invoices'
              : invoiceType === 'upsell'
              ? 'Upsell Invoices'
              : invoiceType === 'retainer'
              ? 'Monthly Retainer Invoices'
              : 'DSP Invoices'}{' '}
            Found
          </NoData>
        )}
      </>
    );
  };

  const renderTableHeader = () => {
    return (
      <tr>
        <th width="31%" className="product-header">
          {isDSPService ? 'Invoice Type/ #' : 'Invoice Type / Number'}
        </th>
        <th width="17%" className="product-header pl-2">
          Amount
        </th>
        <th width="17%" className="product-header">
          {isDSPService ? 'Created' : 'Created On'}
        </th>
        <th width="15%" className="product-header">
          Due
        </th>
        <th width="20%" className="product-header text-right pr-3">
          Status
        </th>
      </tr>
    );
  };

  const renderPastInvoiceTableData = (item) => {
    const pastInvoicetype = item?.description?.budget_type;
    return (
      <>
        <tr key={item.id}>
          <td className="product-body">
            <div className="company-name">
              {isDSPService
                ? `${
                    pastInvoicetype !== null
                      ? InvoiceTypeNames[pastInvoicetype]
                      : ''
                  } ${item?.month !== null ? `(${item?.month})` : ''}`
                : item.invoice_type}
            </div>
            <div className="status">
              #{item.next_invoiced_id}{' '}
              {isDSPService && item?.description?.marketplaces
                ? `| ${item?.description?.marketplaces}`
                : null}
            </div>
          </td>
          <td className="product-table-body text-medium pl-2">
            <div className="notification-bell pl-2">
              ${addThousandComma(item.monthly_budget, 0)}
            </div>
          </td>
          <td className="product-table-body light-font">
            {dayjs(item.generated_at).format('MM/DD/YY')}
          </td>
          <td className="product-table-body light-font ">
            {dayjs(item.due_date).format('MM/DD/YY')}
          </td>
          <td className="product-table-body text-right">
            <Status
              className="float-right"
              label={item.invoice_status}
              backgroundColor={
                StatusColorSet[item.invoice_status.split(' ')[0].toLowerCase()]
                  ? StatusColorSet[
                      item.invoice_status.split(' ')[0].toLowerCase()
                    ]
                  : '#E3F2D2'
              }
            />
          </td>
        </tr>
      </>
    );
  };

  const renderUpcomingInvoiceTableData = (item) => {
    return (
      <>
        <tr key={item.id}>
          <td className="product-body">
            <div className="company-name">
              {InvoiceTypeNames[item?.dsp_invoice_subtype]} (
              {item?.applicable_from})
            </div>
            <div className="status">{item?.marketplaces}</div>
          </td>
          <td className="product-table-body text-medium pl-2">
            <div className="notification-bell pl-2">
              ${item?.amount === null ? 0 : addThousandComma(item.amount, 0)}
              {item?.budget_approved === null ? (
                <img
                  className="notification-bell-icon"
                  src={BellNotification}
                  alt="bell"
                  data-tip="Pending BP Sign-off"
                  data-for="Pending-BP-Sign-off"
                />
              ) : null}
            </div>
          </td>
          <td className="product-table-body light-font">
            {item?.created !== null
              ? dayjs(item?.created).format('MM/DD/YY')
              : 'N/A'}
          </td>
          <td className="product-table-body light-font ">
            {item?.due !== null ? dayjs(item?.due).format('MM/DD/YY') : 'N/A'}
          </td>
          <td className="product-table-body text-right">
            <Status
              className="float-right"
              label={item?.status}
              backgroundColor={
                StatusColorSet[item?.status?.split(' ')[0].toLowerCase()]
                  ? StatusColorSet[item?.status?.split(' ')[0].toLowerCase()]
                  : '#E3F2D2'
              }
            />
          </td>
        </tr>
        <ReactTooltip
          id="Pending-BP-Sign-off"
          aria-haspopup="true"
          place="bottom"
          effect="solid"
        />
      </>
    );
  };

  const renderDesktopView = () => {
    return (
      <>
        <WhiteCard className="mb-3">
          <p style={{ marginTop: '0px' }} className="black-heading-title mb-4">
            {invoiceType === 'rev share'
              ? 'Revenue Share Invoices'
              : invoiceType === 'upsell'
              ? 'Upsell Invoices'
              : invoiceType === 'retainer'
              ? 'Monthly Retainer Invoices'
              : 'Invoices'}
          </p>
          {renderPastUpcomingTab()}

          {pastInvoiceLoader && isDSPService ? (
            <PageLoader
              component="performance-graph"
              type="detail"
              color={Theme.orange}
              width={40}
              height={40}
            />
          ) : (
            <>
              {selectedComponent === 'past' ? (
                <Table className="mt-0">
                  <thead>{renderTableHeader()}</thead>
                  {invoiceDataLength >= 1 ? (
                    <tbody>
                      {invoicesData.map((item) =>
                        renderPastInvoiceTableData(item),
                      )}
                    </tbody>
                  ) : null}
                </Table>
              ) : (
                <Table className="mt-0">
                  <thead>{renderTableHeader()}</thead>
                  {invoiceDataLength >= 1 ? (
                    <tbody>
                      {invoicesData.map((item) =>
                        renderUpcomingInvoiceTableData(item),
                      )}
                    </tbody>
                  ) : null}
                </Table>
              )}
              {invoiceDataLength > 0 ? (
                <>
                  <div
                    className={
                      invoiceDataLength < 9 && count < 10
                        ? ''
                        : 'straight-line horizontal-line mt-3'
                    }
                  />
                  <CommonPagination
                    count={count}
                    pageNumber={pageNumber}
                    handlePageChange={handlePageChange}
                  />
                </>
              ) : null}
              {!invoicesData || invoiceDataLength === 0 ? (
                <NoData>
                  No{' '}
                  {invoiceType === 'rev share'
                    ? 'Revenue Share Invoices'
                    : invoiceType === 'upsell'
                    ? 'Upsell Invoices'
                    : invoiceType === 'retainer'
                    ? 'Monthly Retainer Invoices'
                    : 'DSP Invoices'}{' '}
                  Found
                </NoData>
              ) : null}
            </>
          )}
        </WhiteCard>
      </>
    );
  };

  return (
    <Wrapper>
      {loader ? (
        <PageLoader
          component="performance-graph"
          color={Theme.orange}
          type="detail"
          width={40}
          height={40}
        />
      ) : !isMobile ? (
        renderDesktopView()
      ) : (
        renderMobileView()
      )}
      {isDSPService ? (
        <InvoiceAdjustmentsContainer
          id={id}
          addThousandComma={addThousandComma}
          bpName={bpName}
          memberData={memberData}
        />
      ) : null}
    </Wrapper>
  );
};

export default InvoiceList;

InvoiceList.defaultProps = {
  invoiceType: 'rev share',
  id: '',
  bpName: '',
};

InvoiceList.propTypes = {
  loader: bool.isRequired,
  invoiceType: string,
  id: string,
  bpName: string,
  memberData: arrayOf(shape({})).isRequired,
};

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
  }
`;
