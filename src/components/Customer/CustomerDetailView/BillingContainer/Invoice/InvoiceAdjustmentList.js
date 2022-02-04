import React, { useCallback, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { bool, func, string } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import { getInvoiceAdjustmentData } from '../../../../../api';
import { InvoiceViewAndReminderModal } from './InvoiceAdjustmentModals';
import { StatusColorSet, InvoiceTypeNames } from '../../../../../constants';

import {
  PageLoader,
  Status,
  Table,
  NoData,
  TableMobileView,
} from '../../../../../common';

const InvoiceAdjustmentList = ({
  id,
  addThousandComma,
  isAllowToCreateAdjustment,
  onCount,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const mounted = useRef(true);

  const [invoicesAdjustmentData, setInvoicesAdjustmentData] = useState();
  const [invoiceAdjustmentLoader, setInvoiceAdjustmentLoader] = useState(false);
  const [isApicall, setIsApiCall] = useState(false);
  const [showViewAndReminderModal, setShowViewAndReminderModal] = useState(
    false,
  );
  const [adjustmentDetails, setAdjustmentDetails] = useState();

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
            onCount(res.data?.count);
            setInvoicesAdjustmentData(res.data.results);
          } else {
            setInvoicesAdjustmentData(null);
          }
          setInvoiceAdjustmentLoader(false);
        }
      }
    });
  }, [id, onCount]);

  useEffect(() => {
    mounted.current = true;
    if (!isApicall) {
      getAdjustmentData();
      setIsApiCall(true);
    }
    return () => {
      mounted.current = false;
    };
  }, [getAdjustmentData, isApicall]);

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
          <div className="type">
            {InvoiceTypeNames[item?.dsp_invoice_subtype.toLowerCase()]}
          </div>
          <div className="marketplace">{item?.marketplaces}</div>
        </td>
        <td width="20%" className="small-label-text">
          $
          {item.from_amount === null
            ? 0
            : addThousandComma(item.from_amount, 0)}
          <div className="marketplace">
            {dayjs(item.applicable_from).format('MM/DD/YY')}
          </div>
        </td>
        <td width="20%" className="small-label-text">
          ${item.to_amount === null ? 0 : addThousandComma(item.to_amount, 0)}
          <div className="marketplace">
            {item.to_date === 'Ongoing'
              ? item.to_date
              : dayjs(item.to_date).format('MM/DD/YY')}
          </div>
        </td>
        <td width="20%" className="small-label-text">
          <Status
            label={status}
            labelColor={status === 'rejected' ? '#d60000' : '#000000'}
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
            onClick={() => {
              setAdjustmentDetails(item);
              setShowViewAndReminderModal(true);
            }}>
            {status === 'pending' && isAllowToCreateAdjustment
              ? 'Send Reminder'
              : 'View'}
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
                  invoiceType={
                    InvoiceTypeNames[item?.dsp_invoice_subtype.toLowerCase()]
                  }
                  invoiceId={null}
                  marketplaces={item?.marketplaces}
                  status={status}
                  statusLabelColor={
                    status === 'rejected' ? '#d60000' : '#000000'
                  }
                  statusColor={
                    StatusColorSet[status].toLowerCase()
                      ? StatusColorSet[status].toLowerCase()
                      : '#E3F2D2'
                  }
                  label="From"
                  labelInfo={`$${
                    item.from_amount === null
                      ? 0
                      : addThousandComma(item.from_amount, 0)
                  }`}
                  sublabel={dayjs(item.applicable_from).format('MM/DD/YY')}
                  label1="To"
                  labelInfo1={`$${
                    item.to_amount === null
                      ? 0
                      : addThousandComma(item.to_amount, 0)
                  }`}
                  sublabel1={
                    item.to_date === 'Ongoing'
                      ? item.to_date
                      : dayjs(item.to_date).format('MM/DD/YY')
                  }
                  label2="Status"
                  labelInfo2={
                    status === 'pending' && isAllowToCreateAdjustment
                      ? 'Send Reminder'
                      : 'View'
                  }
                  isColumnOnClick
                  onColumnClick={() => {
                    setAdjustmentDetails(item);
                    setShowViewAndReminderModal(true);
                  }}
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

      {showViewAndReminderModal ? (
        <InvoiceViewAndReminderModal
          id="BT-viewAndReminderInvoiceModal"
          isOpen={showViewAndReminderModal}
          adjustmentDetails={adjustmentDetails}
          customerId={id}
          isAllowToCreateAdjustment={isAllowToCreateAdjustment}
          onClick={() => {
            setShowViewAndReminderModal(false);
          }}
          onApply={() => {
            setShowViewAndReminderModal(false);
          }}
        />
      ) : null}
    </Wrapper>
  );
};

export default InvoiceAdjustmentList;

InvoiceAdjustmentList.defaultProps = {
  id: '',
  isAllowToCreateAdjustment: false,
  addThousandComma: () => {},
  onCount: () => {},
};

InvoiceAdjustmentList.propTypes = {
  id: string,
  isAllowToCreateAdjustment: bool,
  addThousandComma: func,
  onCount: func,
};

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
  }
`;
