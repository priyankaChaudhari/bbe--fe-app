import React, { useState, useCallback, useEffect } from 'react';
import { string } from 'prop-types';
import dayjs from 'dayjs';

import {
  WhiteCard,
  Table,
  Button,
  PageLoader,
  NoData,
  CommonPagination,
} from '../../../../common';
import { getEnableInvoices, setEnableInvoices } from '../../../../api';

import Theme from '../../../../theme/Theme';

export default function EnableInvoiceing({ view }) {
  const [billingData, setBillingData] = useState([]);
  const [invoiceLoader, setInvoiceLoader] = useState(false);
  const [billsCount, setBillsCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();

  const getInvoices = useCallback((page) => {
    setInvoiceLoader(true);
    getEnableInvoices(page).then((res) => {
      if (res && res.status === 400) {
        setInvoiceLoader(false);
      }
      if (res && res.status === 200) {
        if (res.data && res.data.results) {
          setBillingData(res.data.results);
          setBillsCount(res.data.count);
        }
        setInvoiceLoader(false);
      }
    });
  }, []);

  useEffect(() => {
    getInvoices(1);
  }, [getInvoices]);

  const onEnableClick = (id) => {
    setEnableInvoices(id).then((res) => {
      if (res && res.status === 400) {
        setInvoiceLoader(false);
      }
      if (res && res.status === 200) {
        getInvoices(1);
      }
    });
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getInvoices(currentPage);
  };

  const renderTableData = (item) => {
    const contractDate = dayjs(item.start_date).format('MM/DD/YY');
    return (
      <tr className="cursor">
        <td className="product-body">
          {' '}
          <div className="company-name">{item && item.customer_id}</div>
        </td>
        <td className="product-table-body">{contractDate}</td>

        <td className="product-table-body ">
          <Button
            className="btn-orange-border"
            onClick={() => onEnableClick(item.id)}>
            Enable Invoicing
          </Button>
        </td>
      </tr>
    );
  };

  const renderDesktopView = () => {
    return (
      <WhiteCard className="d-lg-block d-md-block d-none mb-3">
        <div className="row">
          <div className="col-12 ">
            <div className="black-heading-title mt-3">Enable Billing</div>{' '}
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
        ) : billingData && billingData.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th width="40%" className="product-header">
                    Partner Name
                  </th>
                  <th width="37%" className="product-header">
                    Contract Start Date
                  </th>

                  <th width="23%" className="product-header  pr-2">
                    {' '}
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingData &&
                  billingData.map((item) => renderTableData(item))}
              </tbody>
            </Table>
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
    );
  };

  const renderMobileView = () => {
    return (
      <>
        <div className="row mt-2">
          <div className="col-5 pl-4 mt-3 ">
            <div className="black-heading-title ">Enable Billing</div>{' '}
          </div>
        </div>
        {invoiceLoader ? (
          <PageLoader
            component="performance-graph"
            color={Theme.orange}
            type="detail"
            width={40}
            height={40}
          />
        ) : billingData && billingData.length > 0 ? (
          <>
            {billingData &&
              billingData.map((item) => (
                <WhiteCard className="mb-3">
                  <div className="row">
                    <div className="col-6">
                      <div className="label">Partner Name</div>
                      <div className="label-info label-info-dark">
                        {item.id}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="label">Contract Start Date</div>
                      <div className="label-info label-info-dark">
                        {dayjs(item.start_date).format('MM/DD/YY')}
                      </div>
                    </div>
                    <div className="col-12 text-center mt-3">
                      <Button
                        className="btn-orange-border"
                        onClick={() => onEnableClick(item.id)}>
                        Enable Invoicing
                      </Button>
                    </div>
                  </div>
                </WhiteCard>
              ))}
            <CommonPagination
              count={billsCount}
              pageNumber={pageNumber}
              handlePageChange={handlePageChange}
            />
          </>
        ) : (
          <NoData>No Invoices Found</NoData>
        )}
      </>
    );
  };

  return (
    <>
      {view === 'desktop'
        ? // for desktop/tablet view
          renderDesktopView()
        : // for mobile view
          renderMobileView()}
    </>
  );
}

EnableInvoiceing.defaultProps = { view: '' };
EnableInvoiceing.propTypes = { view: string };
