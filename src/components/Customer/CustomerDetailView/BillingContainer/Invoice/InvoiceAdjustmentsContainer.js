import React, { useState } from 'react';

import styled from 'styled-components';
import { func, string } from 'prop-types';

import InvoiceAdjustmentList from './InvoiceAdjustmentList';
import { WhiteCard, Button } from '../../../../../common';
import {
  InvoiceAdjustPauseModal,
  InvoicePastAdjustmentModal,
} from './InvoiceAdjustmentModals';

const InvoiceAdjustmentsContainer = ({ id, invoiceType, addThousandComma }) => {
  const [showInvoiceAdjustmentModal, setShowInvoiceAdjustmentModal] = useState(
    false,
  );
  const [showAllPastInvoicesModal, setShowAllPastInvoicesModal] = useState(
    false,
  );

  return (
    <Wrapper>
      <WhiteCard className="mb-3">
        <div className="row mb-3">
          <div className="col-5">
            <p
              style={{ marginTop: '0px' }}
              className="black-heading-title mb-0 mt-3">
              Invoices Adjustments
            </p>
          </div>
          <div className="col-7  text-right">
            <Button
              onClick={() => setShowInvoiceAdjustmentModal(true)}
              type="button"
              className="btn-primary invoice-adjustment">
              Create Adjustment
            </Button>
          </div>
        </div>

        <InvoiceAdjustmentList
          id={id}
          invoiceType={invoiceType}
          addThousandComma={addThousandComma}
        />
        <div className="straight-line horizontal-line spacing " />
        <p
          className="orange-text-label cursor mb-1"
          onClick={() => setShowAllPastInvoicesModal(true)}
          role="presentation">
          {' '}
          View all past adjustments
        </p>

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
      </WhiteCard>
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
