import React, { useCallback, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { func, string } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import { StatusColorSet } from '../../../../../constants';
import { getInvoiceAdjustmentData } from '../../../../../api';
import { InvoiceViewAndReminderModal } from './InvoiceAdjustmentModals';

import {
  PageLoader,
  Status,
  Table,
  NoData,
  TableMobileView,
} from '../../../../../common';

const InvoiceAdjustmentList = ({ id, addThousandComma }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const mounted = useRef(true);

  const [invoicesAdjustmentData, setInvoicesAdjustmentData] = useState();
  const [invoiceAdjustmentLoader, setInvoiceAdjustmentLoader] = useState(false);
  const [isApicall, setIsApiCall] = useState(false);
  const [showViewAndReminderModal, setShowViewAndReminderModal] = useState(
    false,
  );

  const getAdjustmentData = useCallback(() => {
    setInvoiceAdjustmentLoader(true);
    getInvoiceAdjustmentData(id).then((res) => {
      if (mounted.current) {
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
      }
    });
  }, [id]);

  useEffect(() => {
    mounted.current = true;
    if (!isApicall) {
      getAdjustmentData();
      setIsApiCall(true);
    }
    return () => {
      mounted.current = false;
    };
  }, [getAdjustmentData, id, isApicall, setIsApiCall]);

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
    const status =
      item?.budget_approved === null
        ? 'pending'
        : item?.budget_approved
        ? 'approved'
        : 'rejected';
    return (
      <tr className="product-body" key={item.id}>
        <td width="30%" className="small-label-text">
          {' '}
          <div className="type">{item?.dsp_invoice_subtype}</div>
          <div className="marketplace">{item?.marketplaces}</div>
        </td>
        <td width="20%" className="small-label-text">
          ${addThousandComma(item.from_amount, 0)}
          <div className="marketplace">
            {dayjs(item.applicable_from).format('MM/DD/YY')}
          </div>
        </td>
        <td width="20%" className="small-label-text">
          ${addThousandComma(item.to_amount, 0)}
          <div className="marketplace">
            {item?.dsp_invoice_subtype !== 'One-time Additional'
              ? 'Ongoing'
              : dayjs(item.to_date).format('MM/DD/YY')}
          </div>
        </td>
        <td width="20%" className="small-label-text">
          <Status
            label={status}
            backgroundColor={
              StatusColorSet[status].toLowerCase()
                ? StatusColorSet[status].toLowerCase()
                : '#E3F2D2'
            }
          />
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
            const status =
              item?.budget_approved === null
                ? 'pending'
                : item?.budget_approved
                ? 'approved'
                : 'rejected';
            return (
              <>
                <TableMobileView
                  key={item.id}
                  className="mb-3"
                  invoiceType={item?.dsp_invoice_subtype}
                  invoiceId={null}
                  marketplaces={item?.marketplaces}
                  status={status}
                  statusColor={
                    StatusColorSet[status].toLowerCase()
                      ? StatusColorSet[status].toLowerCase()
                      : '#E3F2D2'
                  }
                  label="From"
                  labelInfo={`$${addThousandComma(item.from_amount, 0)}`}
                  sublabel="01/02/21"
                  label1="To"
                  labelInfo1={`$${addThousandComma(item.to_amount, 0)}`}
                  sublabel1="Ongoing"
                  label2="Status"
                  labelInfo2="View"
                  isColumnOnClick
                  onColumnClick={() => setShowViewAndReminderModal(true)}
                />
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
      {!isMobile ? renderDesktopView() : renderMobileView()}
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
  id: '',
  addThousandComma: () => {},
};

InvoiceAdjustmentList.propTypes = {
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
