import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { func, string } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import { StatusColorSet } from '../../../../../constants';
import { getInvoiceData } from '../../../../../api';
import InvoiceAdjustPauseModal from './InvoiceAdjustmentModals/InvoiceAdjustPauseModal';
import InvoicePastAdjustmentModal from './InvoiceAdjustmentModals/InvoicePastAdjustmentModal';

import {
  PageLoader,
  Status,
  Table,
  WhiteCard,
  NoData,
  Button,
  TableMobileView,
} from '../../../../../common';

const InvoiceAdjustmentsContainer = ({ id, invoiceType, addThousandComma }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [invoicesAdjustmentData, setInvoicesAdjustmentData] = useState();
  const [invoiceAdjustmentLoader, setInvoiceAdjustmentLoader] = useState(false);
  const [isApicall, setIsApiCall] = useState(false);
  const [showInvoiceAdjustmentModal, setShowInvoiceAdjustmentModal] = useState(
    false,
  );
  const [showAllPastInvoicesModal, setShowAllPastInvoicesModal] = useState(
    false,
  );

  const getDSPInvoicesData = useCallback(
    (type) => {
      setInvoiceAdjustmentLoader(true);
      getInvoiceData(type, id).then((res) => {
        if (res && res.status === 500) {
          setInvoiceAdjustmentLoader(false);
          setInvoicesAdjustmentData(null);
        }

        if (res && res.status === 400) {
          setInvoiceAdjustmentLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.results) {
            setInvoicesAdjustmentData(res.data.results);
          } else {
            setInvoicesAdjustmentData(null);
          }
          setInvoiceAdjustmentLoader(false);
        }
      });
    },
    [id],
  );

  useEffect(() => {
    if (!isApicall) {
      getDSPInvoicesData(invoiceType);
      setIsApiCall(true);
    }
  }, [getDSPInvoicesData, invoiceType, isApicall, setIsApiCall]);

  const renderTableHeader = () => {
    return (
      <tr>
        <th width="31%" className="product-header">
          Type / Marketplace
        </th>
        <th width="17%" className="product-header">
          From
        </th>
        <th width="17%" className="product-header">
          To
        </th>
        <th width="15%" className="product-header">
          BP SIGN-OFF
        </th>
        <th width="20%" className="product-header text-right pr-3">
          Status
        </th>
      </tr>
    );
  };

  const renderTableData = (item) => {
    return (
      <tr key={item.id}>
        <td className="product-body">
          <div className="company-name">{item.invoice_type}</div>
          <div className="status">#{item.next_invoiced_id}</div>
        </td>
        <td className="product-body">
          ${addThousandComma(item.monthly_budget, 0)}
        </td>
        <td className="product-table-body light-font">
          {dayjs(item.generated_at).format('MM/DD/YYYY')}
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
        <td className="product-table-body light-font text-right">
          {dayjs(item.due_date).format('MM/DD/YYYY')}
        </td>
      </tr>
    );
  };

  const renderDesktopView = () => {
    return (
      <>
        {invoiceAdjustmentLoader ? (
          <PageLoader
            component="performance-graph"
            type="detail"
            color={Theme.orange}
            width={40}
            height={40}
          />
        ) : (
          <>
            <div className="straight-line horizontal-line spacing " />
            <Table className="mt-0">
              <thead>{renderTableHeader()}</thead>
              {invoicesAdjustmentData && invoicesAdjustmentData.length >= 1 ? (
                <tbody>
                  {invoicesAdjustmentData.map((item) => renderTableData(item))}
                </tbody>
              ) : null}
            </Table>
            {invoicesAdjustmentData && invoicesAdjustmentData.length >= 1 ? (
              <>
                <div className="straight-line horizontal-line spacing " />
                <p
                  onClick={() => setShowAllPastInvoicesModal(true)}
                  role="presentation">
                  {' '}
                  View all past adjustments
                </p>
              </>
            ) : null}

            {!invoicesAdjustmentData ||
            (invoicesAdjustmentData && invoicesAdjustmentData.length === 0) ? (
              <NoData>No Invoices Adjustments Found</NoData>
            ) : null}
          </>
        )}
      </>
    );
  };

  const renderMobileView = () => {
    return (
      <>
        {invoiceAdjustmentLoader ? (
          <PageLoader
            component="performance-graph"
            type="detail"
            color={Theme.orange}
            width={40}
            height={40}
          />
        ) : invoicesAdjustmentData && invoicesAdjustmentData.length >= 1 ? (
          invoicesAdjustmentData.map((item) => {
            return (
              <TableMobileView
                key={item.id}
                className="mb-3"
                invoiceType={item.invoice_type}
                invoiceId={item.next_next_invoiced_id}
                status={item.invoice_status}
                statusColor={
                  StatusColorSet[
                    item.invoice_status.split(' ')[0].toLowerCase()
                  ]
                    ? StatusColorSet[
                        item.invoice_status.split(' ')[0].toLowerCase()
                      ]
                    : '#E3F2D2'
                }
                label="Amount"
                labelInfo={addThousandComma(item.monthly_budget, 0)}
                label1="Created on"
                labelInfo1={dayjs(item.generated_at).format('MM/DD/YYYY')}
                label2="Due"
                labelInfo2={dayjs(item.due_date).format('MM/DD/YYYY')}
              />
            );
          })
        ) : (
          <NoData>No Invoices Found</NoData>
        )}
      </>
    );
  };

  return (
    <Wrapper>
      <WhiteCard className="mb-3">
        <div className="row">
          <div className="col-md-9  col-sm1-12 pr-0">
            <p
              style={{ marginTop: '0px' }}
              className="black-heading-title mb-4">
              Invoices Adjustments
            </p>
          </div>
          <div className="col-md-3 col-sm1-12  mb-3 pl-0">
            <Button
              onClick={() => setShowInvoiceAdjustmentModal(true)}
              type="button"
              className="btn-primary on-boarding   w-100">
              Create Adjustment
            </Button>
          </div>
        </div>
        {!isMobile ? renderDesktopView() : renderMobileView()}
      </WhiteCard>
      <InvoiceAdjustPauseModal
        id="BT-invoiceAdjustmentModal"
        isOpen={showInvoiceAdjustmentModal}
        onModalClose={() => {
          setShowInvoiceAdjustmentModal(false);
        }}
        onApply={() => {
          setShowInvoiceAdjustmentModal(false);
        }}
      />
      <InvoicePastAdjustmentModal
        id="BT-allPastInvoiceModal"
        isOpen={showAllPastInvoicesModal}
        onClick={() => {
          setShowAllPastInvoicesModal(false);
        }}
        onApply={() => {
          setShowAllPastInvoicesModal(false);
        }}
      />
    </Wrapper>
  );
};

export default InvoiceAdjustmentsContainer;

InvoiceAdjustmentsContainer.defaultProps = {
  invoiceType: 'dsp service',
  id: '',
  addThousandComma: () => {},
};

InvoiceAdjustmentsContainer.propTypes = {
  invoiceType: string,
  id: string,
  addThousandComma: func,
};

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
  }
`;
