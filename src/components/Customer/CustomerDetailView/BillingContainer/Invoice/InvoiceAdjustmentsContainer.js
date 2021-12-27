import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { arrayOf, func, shape, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import InvoiceAdjustmentList from './InvoiceAdjustmentList';
import { WhiteCard, Button } from '../../../../../common';
import {
  InvoiceAdjustPauseModal,
  InvoicePastAdjustmentModal,
} from './InvoiceAdjustmentModals';

const InvoiceAdjustmentsContainer = ({
  id,
  addThousandComma,
  memberData,
  bpName,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [showInvoiceAdjustmentModal, setShowInvoiceAdjustmentModal] = useState(
    false,
  );
  const [showAllPastInvoicesModal, setShowAllPastInvoicesModal] = useState(
    false,
  );
  const [isAllowToCreateAdjustment, setIsAllowToCreateAdjustment] = useState(
    false,
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (
      userInfo.role === 'Ad Manager Admin' ||
      userInfo.role === 'BGS Manager' ||
      userInfo.role === 'DSP Ad Manager' ||
      userInfo.role === 'BGS'
    ) {
      for (const user of memberData) {
        if (user.user === userInfo.id) {
          setIsAllowToCreateAdjustment(true);
          break;
        }
      }
    }
  }, [setIsAllowToCreateAdjustment, memberData, userInfo]);

  return (
    <Wrapper>
      {!isMobile ? (
        <WhiteCard className="mb-3">
          <div className="row mb-3">
            <div className="col-5">
              <p
                style={{ marginTop: '0px' }}
                className="black-heading-title mb-0 mt-3">
                Invoice Adjustments
              </p>
            </div>
            {isAllowToCreateAdjustment ? (
              <div className="col-7  text-right">
                <Button
                  onClick={() => setShowInvoiceAdjustmentModal(true)}
                  type="button"
                  className="btn-primary invoice-adjustment">
                  Create Adjustment
                </Button>
              </div>
            ) : null}
          </div>

          <InvoiceAdjustmentList
            id={id}
            addThousandComma={addThousandComma}
            isAllowToCreateAdjustment={isAllowToCreateAdjustment}
            onCount={(value) => {
              setCount(value);
            }}
          />
          <div className="straight-line horizontal-line spacing " />
          {count > 10 ? (
            <p
              className="orange-text-label cursor mb-1"
              onClick={() => setShowAllPastInvoicesModal(true)}
              role="presentation">
              {' '}
              View all past adjustments
            </p>
          ) : null}
        </WhiteCard>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-5">
              <p
                style={{ marginTop: '0px' }}
                className="black-heading-title mb-0 mt-3">
                Invoice Adjustments
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
            addThousandComma={addThousandComma}
            onCount={(value) => {
              setCount(value);
            }}
          />

          {count > 10 ? (
            <p
              className="orange-text-label text-center cursor mb-3"
              onClick={() => setShowAllPastInvoicesModal(true)}
              role="presentation">
              {' '}
              View all past adjustments
            </p>
          ) : null}
        </>
      )}

      {showInvoiceAdjustmentModal && (
        <InvoiceAdjustPauseModal
          id="BT-invoiceAdjustmentModal"
          customerId={id}
          isOpen={showInvoiceAdjustmentModal}
          onModalClose={() => {
            setShowInvoiceAdjustmentModal(false);
          }}
          onApply={() => {
            setShowInvoiceAdjustmentModal(false);
          }}
          bpName={bpName}
        />
      )}
      {showAllPastInvoicesModal ? (
        <InvoicePastAdjustmentModal
          id="BT-allPastInvoiceModal"
          customerId={id}
          isOpen={showAllPastInvoicesModal}
          onClick={() => {
            setShowAllPastInvoicesModal(false);
          }}
          onApply={() => {
            setShowAllPastInvoicesModal(false);
          }}
          addThousandComma={addThousandComma}
        />
      ) : null}
    </Wrapper>
  );
};

export default InvoiceAdjustmentsContainer;

InvoiceAdjustmentsContainer.defaultProps = {
  id: '',
  memberData: [],
  addThousandComma: () => {},
  bpName: '',
};

InvoiceAdjustmentsContainer.propTypes = {
  id: string,
  memberData: arrayOf(shape({})),
  addThousandComma: func,
  bpName: string,
};

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
  }
`;
