import React, { useState, useCallback, useEffect } from 'react';

import dayjs from 'dayjs';
import Modal from 'react-modal';
import { string } from 'prop-types';

import Theme from '../../../../theme/Theme';
import { getEnableInvoices, setEnableInvoices } from '../../../../api';
import {
  WhiteCard,
  Table,
  Button,
  PageLoader,
  NoData,
  CommonPagination,
  ModalBox,
} from '../../../../common';

export default function EnableInvoiceing({ view }) {
  const [billingData, setBillingData] = useState([]);
  const [invoiceLoader, setInvoiceLoader] = useState(false);
  const [enableInvoiceLoader, setEnableInvoiceLoader] = useState(false);
  const [billsCount, setBillsCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enableInvoiceId, setEnableInvoiceId] = useState(null);
  const now = new Date();
  const invoiceGeneratedOn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const title =
    'Are you sure you want to enable revenue share invoicing for this partner';
  const subTitle = 'Their first invoice will be generated on ';

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '525px ',
      width: '100% ',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

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
          setPageNumber(page);
        }
        setInvoiceLoader(false);
      }
    });
  }, []);

  useEffect(() => {
    getInvoices(1);
  }, [getInvoices]);

  const onClickEnableInvoicing = () => {
    setEnableInvoiceLoader(true);
    setEnableInvoices(enableInvoiceId).then((res) => {
      if (res && res.status === 400) {
        setEnableInvoiceLoader(false);
      }
      if (res && res.status === 200) {
        getInvoices(1);
        setIsModalOpen(false);
        setEnableInvoiceLoader(false);
      }
    });
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getInvoices(currentPage);
  };

  const bindDateMessage = (daysPast) => {
    let msg = '';
    if (daysPast !== null) {
      if (daysPast >= 0) {
        msg = `(${daysPast} days ago)`;
      } else {
        msg = `(${Math.abs(daysPast)} days to go)`;
      }
    }
    return msg;
  };

  const renderTableData = (item) => {
    const contractDate = dayjs(item.start_date).format('MM/DD/YY');
    return (
      <tr className="cursor" key={item.id}>
        <td className="product-body">
          {' '}
          <div className="company-name">{item && item.company_name}</div>
        </td>
        <td className="product-table-body">{`${contractDate} ${bindDateMessage(
          item.days_past,
        )}`}</td>

        <td className="product-table-body ">
          <Button
            className="btn-orange-border"
            onClick={() => {
              setIsModalOpen(true);
              setEnableInvoiceId(item.id);
            }}>
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
        <WhiteCard>
          <div className="row mt-2">
            <div className="col-12 mb-3 ">
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
                  <>
                    <div key={item.id}>
                      <div className="row">
                        <div className="col-6">
                          <div className="label">Partner Name</div>
                          <div className="label-info label-info-dark">
                            {item.company_name}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="label">Contract Start Date</div>
                          <div className="label-info label-info-dark">
                            {`${dayjs(item.start_date).format(
                              'MM/DD/YY',
                            )} ${bindDateMessage(item.days_past)}`}
                          </div>
                        </div>
                        <div className="col-12 text-center mt-4">
                          <Button
                            className="btn-orange-border"
                            onClick={() => {
                              setIsModalOpen(true);
                              setEnableInvoiceId(item.id);
                            }}>
                            Enable Invoicing
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="straight-line horizontal-line spacing mt-3 mb-3" />
                  </>
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
        </WhiteCard>
      </>
    );
  };

  const renderEnableBillingModal = () => {
    return (
      <Modal
        isOpen={isModalOpen}
        style={{ ...customStyles }}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <ModalBox>
          <div className="modal-body">
            <div className="heading-title text-center mt-1">{title}</div>
            <div className=" normal-text text-center mt-2 pt-1">{`${subTitle} ${dayjs(
              invoiceGeneratedOn,
            ).format('MMM D')}`}</div>
            <div className="row mt-4 pt-3">
              <div className="col-6 text-center ">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  className="btn-orange-border  w-100">
                  Cancle
                </Button>
              </div>
              <div className="col-6">
                <Button
                  onClick={() => onClickEnableInvoicing()}
                  type="button"
                  className="btn-primary on-boarding   w-100">
                  {enableInvoiceLoader ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Enable Billing'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ModalBox>
      </Modal>
    );
  };

  return (
    <>
      {view === 'desktop'
        ? // for desktop/tablet view
          renderDesktopView()
        : // for mobile view
          renderMobileView()}
      {renderEnableBillingModal()}
    </>
  );
}

EnableInvoiceing.defaultProps = { view: '' };
EnableInvoiceing.propTypes = { view: string };
