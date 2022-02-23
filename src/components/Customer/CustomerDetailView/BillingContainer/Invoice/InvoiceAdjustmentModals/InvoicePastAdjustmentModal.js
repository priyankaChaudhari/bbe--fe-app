import React, { useCallback, useEffect, useState, useRef } from 'react';

import Modal from 'react-modal';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { bool, func, shape, string } from 'prop-types';

import Theme from '../../../../../../theme/Theme';
import InvoiceViewAndReminderModal from './InvoiceViewAndReminderModal';
import { CloseIcon } from '../../../../../../theme/images';
import { getInvoiceAdjustmentData } from '../../../../../../api';
import { StatusColorSet, InvoiceTypeNames } from '../../../../../../constants';
import {
  HeaderDownloadFuntionality,
  ModalBox,
  Status,
  Table,
  PageLoader,
  NoData,
  CommonPagination,
} from '../../../../../../common';

const customStyles = {
  content: {
    top: '50%',
    right: '0px',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    maxHeight: '100%',
    overlay: ' {zIndex: 1000}',
    inset: '0% 0% 0% auto',
    marginRight: '0',
    borderRadius: '0px !important',
  },
};

const InvoicePastAdjustmntModal = ({
  id,
  customerId,
  isOpen,
  style,
  onClick,
  addThousandComma,
  isAllowToCreateAdjustment,
}) => {
  const mounted = useRef(true);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [invoicesAdjustmentData, setInvoicesAdjustmentData] = useState([]);
  const [invoiceAdjustmentLoader, setInvoiceAdjustmentLoader] = useState(false);
  const [showViewAndReminderModal, setShowViewAndReminderModal] = useState(
    false,
  );
  const [invoiceCount, setInvoiceCount] = useState(null);
  const [pageNumber, setPageNumber] = useState(2);
  const [isApicall, setIsApiCall] = useState(false);
  const [adjustmentDetails, setAdjustmentDetails] = useState();

  const getAdjustmentData = useCallback(
    (currentPage) => {
      setInvoiceAdjustmentLoader(true);

      getInvoiceAdjustmentData(customerId, currentPage).then((res) => {
        if (mounted.current) {
          if (res && res.status === 500) {
            setInvoiceAdjustmentLoader(false);
            setInvoicesAdjustmentData([]);
          }
          if (res && res.status === 400) {
            setInvoiceAdjustmentLoader(false);
          }
          if (res && res.status === 200) {
            if (res.data && res.data.results) {
              setInvoicesAdjustmentData(res.data.results);
              setInvoiceCount(
                res.data.count > 10 ? res.data.count - 10 : res.data.count,
              );
            } else {
              setInvoicesAdjustmentData([]);
            }
            setInvoiceAdjustmentLoader(false);
          }
        }
      });
    },
    [customerId],
  );

  useEffect(() => {
    if (!isApicall) {
      getAdjustmentData(2);
      setIsApiCall(true);
    }
  }, [getAdjustmentData, isApicall, setIsApiCall]);

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage + 1);
    getAdjustmentData(currentPage + 1);
  };

  const renderHeader = () => {
    return (
      <HeaderDownloadFuntionality>
        <div className="container-fluid">
          <div className="row">
            <div className="col-8">
              <div className="header-title "> Past Adjustments</div>
            </div>
            <div className="col-4">
              <img
                width="18px"
                src={CloseIcon}
                onClick={() => onClick()}
                alt="close"
                className="float-right cursor remove-cross-icon"
                role="presentation"
              />
            </div>
          </div>
        </div>
      </HeaderDownloadFuntionality>
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
          $
          {item.to_amount === null
            ? 0
            : addThousandComma(
                item.to_amount +
                  (item?.dsp_invoice_subtype.toLowerCase() === 'one time'
                    ? item.from_amount
                    : 0),
                0,
              )}
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
        <td width="10%" className="orange-text-label cursor">
          <p
            className="orange-text-label"
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
      <Table className="d-md-block d-none">
        <table style={{ borderCollapse: 'collapse' }} width="100%">
          <thead>
            <tr>
              <th className="product-header" width="30%">
                Type/Marketplace
              </th>
              <th className="product-header" width="20%">
                From
              </th>
              <th className="product-header" width="20%">
                To
              </th>
              <th className="product-header" width="20%">
                BP Sign-off
              </th>
              <th className="product-header" width="10%">
                &nbsp;{' '}
              </th>
            </tr>
          </thead>
          <tbody>
            {invoicesAdjustmentData && invoicesAdjustmentData.length >= 1 ? (
              invoicesAdjustmentData.map((item) => renderTableData(item))
            ) : (
              <div>No Invoices Found</div>
            )}
          </tbody>
        </table>
      </Table>
    );
  };

  const renderMobileView = () => {
    return (
      <>
        {invoicesAdjustmentData && invoicesAdjustmentData.length >= 1 ? (
          <PastAjustmentMobileView className="d-md-none d-block">
            <div className="container-fluid">
              {invoicesAdjustmentData.map((item) => {
                const status =
                  item?.budget_approved === null
                    ? 'pending'
                    : item?.budget_approved
                    ? 'approved'
                    : 'rejected';
                return (
                  <>
                    <div className="row mt-3" key={item.id}>
                      <div className="col-7">
                        <div className="label"> Type/Marketplace</div>
                        <div className="type">
                          {
                            InvoiceTypeNames[
                              item?.dsp_invoice_subtype.toLowerCase()
                            ]
                          }
                        </div>
                        <div className="marketplace">{item?.marketplaces}</div>
                      </div>
                      <div className="col-5 text-right">
                        <div className="label">BP SIGN-OFF</div>
                        <Status
                          className="float-right"
                          label={status}
                          labelColor={
                            status === 'rejected' ? '#d60000' : '#000000'
                          }
                          backgroundColor={
                            StatusColorSet[status].toLowerCase()
                              ? StatusColorSet[status].toLowerCase()
                              : '#E3F2D2'
                          }
                        />
                        <div className="clear-fix" />
                      </div>
                      <div className="col-4 mt-2">
                        <div className="label"> From</div>
                        <div className="type">{`$${
                          item.from_amount === null
                            ? 0
                            : addThousandComma(item.from_amount, 0)
                        }`}</div>
                        <div className="marketplace">
                          {dayjs(item.applicable_from).format('MM/DD/YY')}
                        </div>
                      </div>
                      <div className="col-4 mt-2">
                        <div className="label"> To</div>
                        <div className="type">{`$${
                          item.to_amount === null
                            ? 0
                            : addThousandComma(
                                item.to_amount +
                                  (item?.dsp_invoice_subtype.toLowerCase() ===
                                  'one time'
                                    ? item.from_amount
                                    : 0),
                                0,
                              )
                        }`}</div>
                        <div className="marketplace">
                          {item.to_date === 'Ongoing'
                            ? item.to_date
                            : dayjs(item.to_date).format('MM/DD/YY')}
                        </div>
                      </div>
                      <div className="col-4 mt-2 cursor">
                        <p
                          className="orange-text-label mt-4"
                          role="presentation"
                          onClick={() => {
                            setAdjustmentDetails(item);
                            setShowViewAndReminderModal(true);
                          }}>
                          {status === 'pending' && isAllowToCreateAdjustment
                            ? 'Send Reminder'
                            : 'View'}
                        </p>
                      </div>
                    </div>
                    <div className="straight-line horizontal-line mt-3" />
                  </>
                );
              })}
            </div>
          </PastAjustmentMobileView>
        ) : (
          <NoData>No Invoices Found</NoData>
        )}
      </>
    );
  };

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      style={{ ...customStyles, ...style }}
      ariaHideApp={false}
      contentLabel="Add team modal">
      <ModalBox>
        {renderHeader()}
        <div className="container-fluid">
          <div className="past-adjustment-table-container">
            {invoiceAdjustmentLoader ? (
              <PageLoader
                component="performance-graph"
                type="detail"
                color={Theme.orange}
                width={40}
                height={40}
              />
            ) : !isMobile ? (
              renderDesktopView()
            ) : (
              renderMobileView()
            )}
          </div>

          <div className="modal-footer p-0">
            {invoicesAdjustmentData?.length >= 1 ? (
              <>
                <div className="straight-line horizontal-line mt-3" />
                <CommonPagination
                  count={invoiceCount}
                  pageNumber={pageNumber - 1}
                  handlePageChange={handlePageChange}
                />
              </>
            ) : null}
          </div>
        </div>
        <InvoiceViewAndReminderModal
          id="BT-viewAndReminderInvoiceModal"
          isAllowToCreateAdjustment={isAllowToCreateAdjustment}
          isOpen={showViewAndReminderModal}
          onClick={() => {
            setShowViewAndReminderModal(false);
          }}
          onApply={() => {
            setShowViewAndReminderModal(false);
          }}
          adjustmentDetails={adjustmentDetails}
          customerId={customerId}
        />
      </ModalBox>
      <PastInvoices />
    </Modal>
  );
};

export default InvoicePastAdjustmntModal;

InvoicePastAdjustmntModal.defaultProps = {
  isOpen: false,
  isAllowToCreateAdjustment: false,
  id: '',
  customerId: '',
  style: {},
  onClick: () => {},
  addThousandComma: () => {},
};

InvoicePastAdjustmntModal.propTypes = {
  isOpen: bool,
  isAllowToCreateAdjustment: bool,
  id: string,
  customerId: string,
  style: shape({}),
  onClick: func,
  addThousandComma: func,
};

const PastInvoices = styled.div`
  top: 0;
  background: ${Theme.white};
  height: 100%;
  .modal-header {
    padding: 15px 15px 0 15px;

    .dot {
      background-color: ${Theme.gray35};
      border-radius: 50%;
      width: 3px;
      height: 3px;
      position: absolute;
      top: 38px;
      margin-left: 3px;
    }
  }
  .modal-body-section {
    padding: 0 15px;

    .status-heading-red {
      color: ${Theme.red};
      font-size: 26px;

      &.green {
        color: ${Theme.lighterGreen};
      }
    }
    .dotted-horizontal-line {
      border-bottom: 2px dotted ${Theme.gray4};
    }

    .text-red {
      color: ${Theme.red};
    }
    .text-bold {
      font-weight: bold;
    }
    .budget-text {
      color: ${Theme.gray85};
      font-size: ${Theme.extraSmall};
    }
  }
`;

const PastAjustmentMobileView = styled.div`
  font-size: ${Theme.extraNormal};
  color: ${Theme.black};

  .type {
    font-family: ${Theme.baseMediumFontFamily};
  }
  .marketplace {
    font-family: ${Theme.baseFontFamily};
    font-weight: 300;
  }
`;
