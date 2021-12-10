import React, { useCallback, useEffect, useState } from 'react';

import Modal from 'react-modal';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { bool, func, shape, string } from 'prop-types';

import { CloseIcon } from '../../../../../../theme/images';
import Theme from '../../../../../../theme/Theme';
import { getInvoiceData } from '../../../../../../api';
import InvoiceViewAndReminderModal from './InvoiceViewAndReminderModal';
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
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [invoicesAdjustmentData, setInvoicesAdjustmentData] = useState([]);
  const [invoiceAdjustmentLoader, setInvoiceAdjustmentLoader] = useState(false);
  const [showViewAndReminderModal, setShowViewAndReminderModal] = useState(
    false,
  );
  const [invoiceCount, setInvoiceCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [isApicall, setIsApiCall] = useState(false);

  const getDSPInvoicesData = useCallback(
    (type, currentPageNumber) => {
      setInvoiceAdjustmentLoader(true);
      getInvoiceData(type, customerId, currentPageNumber).then((res) => {
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
            setInvoiceCount(res.data.count);
          }
          setInvoiceAdjustmentLoader(false);
        }
      });
    },
    [customerId],
  );

  useEffect(() => {
    if (!isApicall) {
      getDSPInvoicesData('dsp service', 1);
      setIsApiCall(true);
    }
  }, [getDSPInvoicesData, isApicall, setIsApiCall]);

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getDSPInvoicesData('dsp service', currentPage);
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
              invoicesAdjustmentData.map((item) => (
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
                      className="orange-text-label"
                      role="presentation"
                      onClick={() => setShowViewAndReminderModal(true)}>
                      View
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <NoData>No Invoices Found</NoData>
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
                return (
                  <>
                    <div className="row mt-3" key={item.id}>
                      <div className="col-7">
                        <div className="label"> Type/Marketplace</div>
                        <div className="type">Permanent Additional</div>
                        <div className="marketplace">All Marketplaces</div>
                      </div>
                      <div className="col-5 text-right">
                        <div className="label">BP SIGN-OFF</div>
                        <Status className="float-right" label="Approved" />
                        <div className="clear-fix" />
                      </div>
                      <div className="col-4 mt-2">
                        <div className="label"> From</div>
                        <div className="type">$5,000</div>
                        <div className="marketplace">06/02/21</div>
                      </div>
                      <div className="col-4 mt-2">
                        <div className="label"> To</div>
                        <div className="type">$5,000</div>
                        <div className="marketplace">Ongoing</div>
                      </div>
                      <div className="col-4 mt-2 cursor">
                        <p
                          className="orange-text-label mt-4"
                          role="presentation"
                          onClick={() => setShowViewAndReminderModal(true)}>
                          View
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
          {invoicesAdjustmentData.length >= 1 ? (
            <CommonPagination
              count={invoiceCount}
              pageNumber={pageNumber}
              handlePageChange={handlePageChange}
            />
          ) : null}
        </div>
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
      </ModalBox>
      <PastInvoices />
    </Modal>
  );
};

export default InvoicePastAdjustmntModal;

InvoicePastAdjustmntModal.defaultProps = {
  isOpen: false,
  id: '',
  customerId: '',
  style: {},
  onClick: () => {},
};

InvoicePastAdjustmntModal.propTypes = {
  isOpen: bool,
  id: string,
  customerId: string,
  style: shape({}),
  onClick: func,
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
