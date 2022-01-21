import React, { useCallback, useRef, useState } from 'react';

import Modal from 'react-modal';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { bool, func, shape, string } from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';

import { StatusColorSet } from '../../../../../../constants';
import { sendReminderOfAdjustment } from '../../../../../../api';
import { ModalBox, Button, Status, PageLoader } from '../../../../../../common';
import {
  ArrowRightBlackIcon,
  ArrowRightIcon,
  CloseIcon,
  LeftArrowIcon,
  ReminderBell,
} from '../../../../../../theme/images';
import Theme from '../../../../../../theme/Theme';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const InvoiceViewAndReminderModal = ({
  id,
  isOpen,
  style,
  onClick,
  onApply,
  adjustmentDetails,
  customerId,
  isAllowToCreateAdjustment,
}) => {
  const isOneTime = adjustmentDetails?.dsp_invoice_subtype === 'one time';
  const mounted = useRef(true);
  const [showMoreRejectionNote, setShowMoreRejectionNote] = useState(false);
  const previousMonth = new Date(adjustmentDetails?.applicable_from);
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const [reminderLoader, setReminderLoader] = useState(false);
  const status =
    adjustmentDetails?.budget_approved === null
      ? 'pending'
      : adjustmentDetails?.budget_approved
      ? 'approved'
      : 'rejected';
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const sendReminder = useCallback(() => {
    setReminderLoader(true);
    sendReminderOfAdjustment(customerId, adjustmentDetails.id).then((res) => {
      if (mounted.current) {
        if (res && res.status === 500) {
          setReminderLoader(false);
          toast.error('Something went wrong');
        }
        if (res && res.status === 400) {
          setReminderLoader(false);
          toast.error('Something went wrong');
        }
        if (res && res.status === 200) {
          setReminderLoader(false);
          onApply();
          toast.success('Send reminder successfully');
        }
      }
    });
  }, [customerId, onApply, adjustmentDetails.id]);

  const insertShowMoreProp = () => {
    setShowMoreRejectionNote(!showMoreRejectionNote);
  };
  const generateAmount = (value, valueFor, currencySymbol) => {
    if (value && value !== null && value !== 0) {
      value = Number(value.toFixed(2));
      return `${
        value < 0 ? '-' : valueFor === 'change' ? '+' : ''
      }${currencySymbol}${value
        .toString()
        .replace('-', '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }

    return valueFor === 'change' ? '-' : `${currencySymbol}0`;
  };

  const renderDesktopView = () => {
    return (
      <div className="d-md-block d-none">
        <div className="row">
          {isOneTime ? (
            <>
              <div className="col-4 text-left">
                <div className="label">Marketplace</div>
              </div>
              <div className="col-4 text-left">
                <div className="label">Existing Budget</div>
              </div>
              <div className="col-4 text-left">
                <div className="label">Additional Amount</div>
              </div>
            </>
          ) : (
            <>
              <div className="col-4 text-left">
                <div className="label">Marketplace</div>
              </div>
              <div className="col-3 text-left">
                <div className="label">From</div>
              </div>
              <div className="col-2 text-left">
                <div className="label">To</div>
              </div>
              <div className="col-3 text-left">
                <div className="label">Change</div>
              </div>
            </>
          )}
        </div>
        <div className=" straight-line horizontal-line pt-1 mb-2 " />
        {adjustmentDetails?.adjustments &&
        adjustmentDetails?.adjustments.length >= 1
          ? adjustmentDetails?.adjustments.map((item, index) => (
              <div key={item.id} className={index ? 'row mt-1' : 'row'}>
                <div className="col-4 text-left">
                  <div
                    className={`normal-text ${
                      item?.new_budget - item?.old_budget ? 'text-bold' : null
                    } `}>
                    {item?.marketplace}
                  </div>
                </div>
                <div
                  className={isOneTime ? 'col-4 text-left' : 'col-2 text-left'}>
                  <div
                    className={`normal-text ${
                      item?.new_budget - item?.old_budget ? 'text-bold' : null
                    } `}>
                    {generateAmount(item?.old_budget, 'from', '$')}
                  </div>
                </div>
                {!isOneTime ? (
                  <div className="col-1 text-left">
                    <div className="normal-text">
                      <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                    </div>
                  </div>
                ) : null}
                <div
                  className={isOneTime ? 'col-4 text-left' : 'col-2 text-left'}>
                  <div
                    className={`normal-text ${
                      item?.new_budget - item?.old_budget ? 'text-bold' : null
                    } `}>
                    {generateAmount(item?.new_budget, 'to', '$')}
                  </div>
                </div>
                {!isOneTime ? (
                  <div className="col-3 text-left">
                    <div
                      className={`normal-text ${
                        item?.new_budget - item?.old_budget ? 'text-bold' : null
                      } `}>
                      {generateAmount(
                        item?.new_budget - item?.old_budget,
                        'change',
                        '$',
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          : null}

        <div className=" straight-line horizontal-line pt-1 mb-2 " />
        <div className="row">
          <div className="col-4 text-left">
            <div className="normal-text text-bold">Total invoice</div>
          </div>
          {!isOneTime ? (
            <>
              <div
                className={isOneTime ? 'col-4 text-left' : 'col-2 text-left'}>
                <div className="normal-text text-bold">
                  {generateAmount(adjustmentDetails?.from_amount, '', '$')}
                </div>
              </div>

              <div className="col-1 text-left">
                <div className="normal-text">
                  <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                </div>
              </div>
            </>
          ) : null}
          {isOneTime ? <div className="col-4 text-left" /> : null}

          <div className={isOneTime ? 'col-4 text-left' : 'col-2 text-left'}>
            <div className="normal-text text-bold">
              {generateAmount(adjustmentDetails?.to_amount, '', '$')}
            </div>
          </div>
          {!isOneTime ? (
            <div className="col-3 text-left">
              <div className="normal-text text-bold">
                {generateAmount(
                  adjustmentDetails?.to_amount - adjustmentDetails?.from_amount,
                  'change',
                  '$',
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    return (
      <div className="d-md-none d-block">
        {adjustmentDetails?.adjustments &&
        adjustmentDetails?.adjustments.length >= 1
          ? adjustmentDetails?.adjustments.map((item) => (
              <>
                <div key={item.id} className="row">
                  <div className="col-12 text-left">
                    <div className="label">Marketplace</div>
                    <div
                      className={`normal-text ${
                        item?.new_budget - item?.old_budget ? 'text-bold' : null
                      } `}>
                      {item?.marketplace}
                    </div>
                  </div>

                  <div
                    className={
                      isOneTime ? 'col-6 text-left' : 'col-4 text-left'
                    }>
                    <div className="label">
                      {isOneTime ? 'Existing Budget' : 'From'}{' '}
                    </div>
                    <div
                      className={`normal-text ${
                        item?.new_budget - item?.old_budget ? 'text-bold' : null
                      } `}>
                      {generateAmount(item?.old_budget, 'from', '$')}
                    </div>
                  </div>
                  {!isOneTime ? (
                    <div className="col-2 text-left">
                      <div className="mt-3">
                        <img
                          src={ArrowRightBlackIcon}
                          width="18px"
                          alt="arrow"
                        />{' '}
                      </div>
                    </div>
                  ) : null}
                  <div
                    className={
                      isOneTime ? 'col-6 text-left' : 'col-3 text-left'
                    }>
                    <div className="label">
                      {isOneTime ? 'Additional Amount' : 'To'}
                    </div>
                    <div
                      className={`normal-text ${
                        item?.new_budget - item?.old_budget ? 'text-bold' : null
                      } `}>
                      {generateAmount(item?.new_budget, 'to', '$')}
                    </div>
                  </div>
                  {!isOneTime ? (
                    <div className="col-3 text-left">
                      <div className="label">Change</div>
                      <div
                        className={`normal-text ${
                          item?.new_budget - item?.old_budget
                            ? 'text-bold'
                            : null
                        } `}>
                        {generateAmount(
                          item?.new_budget - item?.old_budget,
                          'change',
                          '$',
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className=" straight-line horizontal-line mt-2 mb-2 " />
              </>
            ))
          : null}

        <div className="row">
          <div className="col-12 mb-2 text-left">
            <div className="normal-text text-bold">Total Invoice</div>
          </div>

          <div className={isOneTime ? 'col-6 text-left' : 'col-4 text-left'}>
            <div className="label">
              {isOneTime ? 'Existing Budget' : 'From'}{' '}
            </div>
            <div className="normal-text text-bold">
              {' '}
              {generateAmount(adjustmentDetails?.from_amount, '', '$')}
            </div>
          </div>
          {!isOneTime ? (
            <div className="col-2 text-left">
              <div className="mt-3">
                <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
              </div>
            </div>
          ) : null}

          <div className={isOneTime ? 'col-6 text-left' : 'col-3 text-left'}>
            <div className="label">
              {isOneTime ? 'Additional Amount' : 'To'}
            </div>
            <div className="normal-text text-bold">
              {' '}
              {generateAmount(adjustmentDetails?.to_amount, '', '$')}
            </div>
          </div>
          {!isOneTime ? (
            <div className="col-3 text-left">
              <div className="label">Change</div>
              <div className="normal-text text-bold">
                {generateAmount(
                  adjustmentDetails?.to_amount - adjustmentDetails?.from_amount,
                  'change',
                  '$',
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        pauseOnFocusLoss={false}
      />
      <Modal
        id={id}
        isOpen={isOpen}
        style={{ ...customStyles, ...style }}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={onClick}
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body pb-0 ">
            <div
              className="pb-3"
              style={{ display: 'flex', wordBreak: 'break-all' }}>
              <h4>
                {' '}
                <img
                  className="modal-back-arrow"
                  src={LeftArrowIcon}
                  role="presentation"
                  alt="back arrow"
                  onClick={() => onApply()}
                />
                Invoice Adjustment
              </h4>
              <div style={{ marginTop: '-7px ', marginLeft: '10px' }}>
                <Status
                  label={status}
                  labelColor={status === 'rejected' ? '#d60000' : '#000000'}
                  backgroundColor={
                    StatusColorSet[status].toLowerCase()
                      ? StatusColorSet[status].toLowerCase()
                      : '#E3F2D2'
                  }
                />
              </div>
            </div>
            <div className="body-content">
              <div className=" straight-line horizontal-line  mb-2 " />
              {isMobile ? renderMobileView() : renderDesktopView()}

              <div className=" straight-line horizontal-line mt-2 mb-2 " />

              {status === 'rejected' ? (
                adjustmentDetails?.rejection_note !== null ? (
                  <>
                    <p className="normal-text">
                      <span className="normal-text text-bold">
                        Note from BP:{' '}
                      </span>
                      {showMoreRejectionNote
                        ? adjustmentDetails?.rejection_note
                        : adjustmentDetails?.rejection_note?.slice(0, 155)}
                      {adjustmentDetails?.rejection_note?.length > 155 ? (
                        <span
                          style={{ color: '#FF5933', cursor: 'pointer' }}
                          role="presentation"
                          onClick={() => {
                            insertShowMoreProp();
                          }}>
                          {!showMoreRejectionNote ? ' show more' : ' show less'}
                        </span>
                      ) : adjustmentDetails?.rejection_note?.length === 0 ? (
                        <span
                          style={{ fontWeight: '300', color: Theme.gray35 }}>
                          none provided
                        </span>
                      ) : null}
                    </p>
                  </>
                ) : null
              ) : (
                <p className="normal-text">
                  The new invoice amount will be available to spend from{' '}
                  {dayjs(adjustmentDetails.applicable_from).format('MMMM')}{' '}
                  onwards.
                  <br /> The first bill for this amount will be sent{' '}
                  {dayjs(previousMonth).format('MMMM')} 13.
                </p>
              )}
            </div>
          </div>
          {status === 'pending' && isAllowToCreateAdjustment ? (
            <>
              <div className="footer-line" />
              <div className="modal-footer">
                <Button
                  onClick={() => {
                    sendReminder();
                  }}
                  type="button"
                  className={
                    reminderLoader
                      ? 'light-orange on-boarding w-100 disabled'
                      : 'light-orange on-boarding w-100'
                  }>
                  {reminderLoader ? (
                    <PageLoader color="#FF5933" type="button" />
                  ) : (
                    <>
                      <img src={ReminderBell} alt="bell" /> Send Reminder
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : null}
        </ModalBox>
      </Modal>
    </>
  );
};

export default InvoiceViewAndReminderModal;

InvoiceViewAndReminderModal.defaultProps = {
  isOpen: false,
  isAllowToCreateAdjustment: false,
  id: '',
  customerId: '',
  style: {},
  adjustmentDetails: [],
  onClick: () => {},
  onApply: () => {},
};

InvoiceViewAndReminderModal.propTypes = {
  isOpen: bool,
  isAllowToCreateAdjustment: bool,
  id: string,
  customerId: string,
  adjustmentDetails: shape([]),
  style: shape({}),
  onClick: func,
  onApply: func,
};
