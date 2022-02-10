import React, { useEffect, useState, useCallback } from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { arrayOf, func, shape, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import InvoiceAdjustmentList from './InvoiceAdjustmentList';
import { getDSPContact } from '../../../../../api';
import { WhiteCard, Button } from '../../../../../common';
import {
  InvoiceAdjustPauseModal,
  InvoicePastAdjustmentModal,
} from './InvoiceAdjustmentModals';
import { dspSignOffRoles } from '../../../../../constants';

const InvoiceAdjustmentsContainer = ({
  id,
  addThousandComma,
  bpName,
  memberData,
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

  const getDSPContactInfo = useCallback(() => {
    getDSPContact(id).then((res) => {
      if (res?.status === 200) {
        if (dspSignOffRoles.userRole[userInfo?.role]) {
          setIsAllowToCreateAdjustment(true);
        } else if (res?.data?.is_dsp_contract) {
          for (const user of memberData) {
            if (user.user) {
              if (
                dspSignOffRoles.grpRole[user?.role_group?.name] &&
                user?.user?.id === userInfo?.id
              ) {
                setIsAllowToCreateAdjustment(true);
                break;
              }
            }
          }
        }
      } else setIsAllowToCreateAdjustment(false);
    });
  }, [id, userInfo, memberData]);

  useEffect(() => {
    getDSPContactInfo();
  }, [getDSPContactInfo]);

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
            isAllowToCreateAdjustment={isAllowToCreateAdjustment}
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
          isAllowToCreateAdjustment={isAllowToCreateAdjustment}
        />
      ) : null}
    </Wrapper>
  );
};

export default InvoiceAdjustmentsContainer;

InvoiceAdjustmentsContainer.defaultProps = {
  id: '',
  addThousandComma: () => {},
  bpName: '',
};

InvoiceAdjustmentsContainer.propTypes = {
  id: string,

  addThousandComma: func,
  bpName: string,
  memberData: arrayOf(shape({})).isRequired,
};

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
  }
`;
