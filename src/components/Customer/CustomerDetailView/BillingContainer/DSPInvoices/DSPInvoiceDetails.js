import React, { useCallback } from 'react';

import styled from 'styled-components';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { arrayOf, bool } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import { PageLoader, Status, Table, WhiteCard } from '../../../../../common';
import TableMobileView from '../../../../../common/TableMobileView';
import { noGraphDataMessage } from '../../../../../constants/CompanyPerformanceConstants';

const DSPInvoiceDetails = ({ loader, data }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const invoceStatus = {
    paid: {
      backgroundColor: '#E3F2D2',
    },
    overdue: {
      backgroundColor: '#F7D7DB',
    },
    open: { backgroundColor: '#FDF3D7' },
  };

  const addThousandComma = useCallback((number, decimalDigits = 2) => {
    if (number !== undefined && number !== null) {
      return Number(number)
        .toFixed(decimalDigits)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return number;
  }, []);

  const renderMobileDSPInvoices = () => {
    return (
      <>
        <WhiteCard className="mb-3">
          <div className="row">
            <div className="col-12">
              <div className="black-heading-title"> DSP Invoices</div>
            </div>
          </div>
        </WhiteCard>
        {data && data.length >= 1 ? (
          data.map((item) => {
            return (
              <TableMobileView
                className="mb-3"
                invoiceType={item.invoice_type}
                invoiceId={item.invoiced_id}
                status={item.invoice_status}
                statusColor={
                  invoceStatus[item.invoice_status.split(' ')[0].toLowerCase()]
                    .backgroundColor
                }
                label="Amount"
                labelInfo={addThousandComma(item.monthly_budget)}
                label1="Created on"
                labelInfo1={dayjs(item.generated_at).format('MM/DD/YYYY')}
                label2="Due"
                labelInfo2={dayjs(item.due_date).format('MM/DD/YYYY')}
              />
            );
          })
        ) : (
          <NoData>{noGraphDataMessage}</NoData>
        )}
      </>
    );
  };

  const renderTableHeader = () => {
    return (
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
          Due
        </th>
        <th width="20%" className="product-header text-right pr-3">
          Status
        </th>
      </tr>
    );
  };

  const renderTableData = (item) => {
    return (
      <tr>
        <td className="product-body">
          <div className="company-name">{item.invoice_type}</div>
          <div className="status">#{item.invoiced_id}</div>
        </td>
        <td className="product-body">
          ${addThousandComma(item.monthly_budget)}
        </td>
        <td className="product-body light-font">
          {dayjs(item.generated_at).format('MM/DD/YYYY')}
        </td>
        <td className="product-table-body light-font ">
          {dayjs(item.due_date).format('MM/DD/YYYY')}
        </td>
        <td className="product-table-body text-right">
          <Status
            className="float-right"
            label={item.invoice_status}
            backgroundColor={
              invoceStatus[item.invoice_status.split(' ')[0].toLowerCase()]
                .backgroundColor
            }
          />
        </td>
      </tr>
    );
  };

  const renderDesktopDSPInvoices = () => {
    return (
      <>
        <WhiteCard className="mb-3">
          <p style={{ marginTop: '0px' }} className="black-heading-title mb-4">
            DSP Invoices
          </p>
          <div className="straight-line horizontal-line spacing " />
          <Table className="mt-0">
            {renderTableHeader()}
            {data && data.length >= 1 ? (
              <tbody>{data.map((item) => renderTableData(item))}</tbody>
            ) : null}
          </Table>
          {!data || (data && data.length === 0) ? (
            <NoData>{noGraphDataMessage}</NoData>
          ) : null}
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
        renderDesktopDSPInvoices()
      ) : (
        renderMobileDSPInvoices()
      )}
    </Wrapper>
  );
};

export default DSPInvoiceDetails;

DSPInvoiceDetails.defaultProps = {
  data: null,
};

DSPInvoiceDetails.propTypes = {
  data: arrayOf(Array),
  loader: bool.isRequired,
};

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
  }
`;

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;