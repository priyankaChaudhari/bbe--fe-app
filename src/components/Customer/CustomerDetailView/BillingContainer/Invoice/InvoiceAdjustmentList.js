import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { func, string } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import { StatusColorSet } from '../../../../../constants';
import { getInvoiceData } from '../../../../../api';
import {
  InvoiceViewAndReminderModal,
  // InvoicePastAdjustmentModal,
} from './InvoiceAdjustmentModals';

import {
  PageLoader,
  Status,
  Table,
  NoData,
  TableMobileView,
} from '../../../../../common';

const InvoiceAdjustmentList = ({ id, invoiceType, addThousandComma }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [invoicesAdjustmentData, setInvoicesAdjustmentData] = useState();
  const [invoiceAdjustmentLoader, setInvoiceAdjustmentLoader] = useState(false);
  const [isApicall, setIsApiCall] = useState(false);
  // const [showAllPastInvoicesModal, setShowAllPastInvoicesModal] = useState(
  //   false,
  // );
  const [showViewAndReminderModal, setShowViewAndReminderModal] = useState(
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
      <tr className="product-body" key={item.id}>
        <td width="30%" className="small-label-text">
          {' '}
          <div className="type">Permanent Additional</div>
          <div className="marketplace">All Marketplaces</div>
        </td>
        <td width="20%" className="small-label-text">
          $5,000
          <div className="marketplace">06/02/21</div>
        </td>
        <td width="20%" className="small-label-text">
          $10,000
          <div className="marketplace">Ongoing</div>
        </td>
        <td width="20%" className="small-label-text">
          <Status label="Approved" />
        </td>
        <td width="10%" className="orange-text-label">
          <p
            className="orange-text-label cursor"
            role="presentation"
            onClick={() => setShowViewAndReminderModal(true)}>
            View
          </p>
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

            {!invoicesAdjustmentData ||
            (invoicesAdjustmentData && invoicesAdjustmentData.length === 0) ? (
              <NoData>No Invoice Adjustments Found</NoData>
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
              <>
                {/* <WhiteCard className="mb-3"> */}
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
                  label="From"
                  labelInfo={addThousandComma(item.monthly_budget, 0)}
                  label1="To"
                  labelInfo1={dayjs(item.generated_at).format('MM/DD/YYYY')}
                  label2="Status"
                  labelInfo2="Send Reminder"
                  isColumnOnClick
                  onColumnClick={() => setShowViewAndReminderModal(true)}
                />
                {/* </WhiteCard> */}
              </>
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
        {!isMobile ? renderDesktopView() : renderMobileView()}
      </WhiteCard>
      {/* {showAllPastInvoicesModal ? (
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
      ) : null} */}
      <InvoiceViewAndReminderModal
        id="BT-viewAndReminderInvoiceModal"
        isOpen={showViewAndReminderModal}
        onClick={() => {
          setShowViewAndReminderModal(false);
        }}
        onApply={() => {
          setShowViewAndReminderModal(false);
        }}
      />
    </Wrapper>
  );
};

export default InvoiceAdjustmentList;

InvoiceAdjustmentList.defaultProps = {
  invoiceType: 'dsp service',
  id: '',
  addThousandComma: () => {},
};

InvoiceAdjustmentList.propTypes = {
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
