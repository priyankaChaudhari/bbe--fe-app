import React from 'react';

import Modal from 'react-modal';
import { useMediaQuery } from 'react-responsive';
import { bool, func, shape, string } from 'prop-types';

import { ModalBox, Button, Status } from '../../../../../../common';
import {
  ArrowRightBlackIcon,
  ArrowRightIcon,
  CloseIcon,
  LeftArrowIcon,
  ReminderBell,
} from '../../../../../../theme/images';

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
}) => {
  const marketplaceData = [
    {
      name: 'UK',
      from: 1000,
      to: 5000,
      change: 4000,
    },
    {
      name: 'Canada',
      from: 10000,
      to: 6000,
      change: 4000,
    },
    {
      name: 'US',
      from: 10000,
      to: 15000,
      change: 5000,
    },
  ];
  const isMobile = useMediaQuery({ maxWidth: 767 });

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

    return valueFor === 'change' ? '-' : 0;
  };

  const renderDesktopView = () => {
    return (
      <div className="d-md-block d-none">
        <div className="row">
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
        </div>
        <div className=" straight-line horizontal-line pt-1 mb-2 " />
        {marketplaceData.map((item, index) => (
          <div className={index ? 'row mt-1' : 'row'}>
            <div className="col-4 text-left">
              <div className={`normal-text ${!index ? 'text-bold' : null} `}>
                {item.name}
              </div>
            </div>
            <div className="col-2 text-left">
              <div className={`normal-text ${!index ? 'text-bold' : null} `}>
                {generateAmount(item?.from, 'from', '$')}
              </div>
            </div>
            <div className="col-1 text-left">
              <div className="normal-text">
                <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
              </div>
            </div>
            <div className="col-2 text-left">
              <div className={`normal-text ${!index ? 'text-bold' : null} `}>
                {generateAmount(item?.to, 'to', '$')}
              </div>
            </div>
            <div className="col-3 text-left">
              <div className={`normal-text ${!index ? 'text-bold' : null} `}>
                {generateAmount(item?.change, 'change', '$')}
              </div>
            </div>
          </div>
        ))}

        <div className=" straight-line horizontal-line pt-1 mb-2 " />
        <div className="row">
          <div className="col-4 text-left">
            <div className="normal-text text-bold">Total invoice</div>
          </div>
          <div className="col-2 text-left">
            <div className="normal-text text-bold">$5,000</div>
          </div>
          <div className="col-1 text-left">
            <div className="normal-text">
              <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
            </div>
          </div>
          <div className="col-2 text-left">
            <div className="normal-text text-bold">$10,000</div>
          </div>
          <div className="col-3 text-left">
            <div className="normal-text text-bold">+$5,000</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    return (
      <div className="d-md-none d-block">
        {marketplaceData.map((item, index) => (
          <>
            <div className="row">
              <div className="col-12 text-left">
                <div className="label">Marketplace</div>
                <div className={`normal-text ${!index ? 'text-bold' : null} `}>
                  {item.name}
                </div>
              </div>

              <div className="col-4 text-left">
                <div className="label">From</div>
                <div className={`normal-text ${!index ? 'text-bold' : null} `}>
                  {generateAmount(item?.from, 'from', '$')}
                </div>
              </div>
              <div className="col-2 text-left">
                <div className="mt-3">
                  <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                </div>
              </div>
              <div className="col-3 text-left">
                <div className="label">To</div>
                <div className={`normal-text ${!index ? 'text-bold' : null} `}>
                  {generateAmount(item?.to, 'to', '$')}
                </div>
              </div>
              <div className="col-3 text-left">
                <div className="label">Change</div>
                <div className={`normal-text ${!index ? 'text-bold' : null} `}>
                  {generateAmount(item?.change, 'change', '$')}
                </div>
              </div>
            </div>
            <div className=" straight-line horizontal-line mt-2 mb-2 " />
          </>
        ))}

        <div className="row">
          <div className="col-12 mb-2 text-left">
            <div className="normal-text text-bold">Total Invoice</div>
          </div>

          <div className="col-4 text-left">
            <div className="label">From</div>
            <div className="normal-text text-bold">$5,000</div>
          </div>
          <div className="col-2 text-left">
            <div className="mt-3">
              <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
            </div>
          </div>
          <div className="col-3 text-left">
            <div className="label">To</div>
            <div className="normal-text text-bold">$10,000</div>
          </div>
          <div className="col-3 text-left">
            <div className="label">Change</div>
            <div className="normal-text text-bold">+$5,000</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
            <div style={{ display: 'flex' }}>
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
                <Status label="Pending" />
              </div>
            </div>
            <div className=" straight-line horizontal-line pt-3 mb-2 " />
            {isMobile ? renderMobileView() : renderDesktopView()}

            <div className=" straight-line horizontal-line mt-2 mb-2 " />
            <p className="normal-text">
              The new invoice amount will be available to spend from December
              onwards.
              <br /> The first bill for this amount will be sent November 13.
            </p>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <Button
              onClick={() => {
                onApply();
              }}
              type="button"
              className="light-orange on-boarding   w-100">
              <img src={ReminderBell} alt="bell" />
              Send Reminder
            </Button>
          </div>
        </ModalBox>
      </Modal>
    </>
  );
};

export default InvoiceViewAndReminderModal;

InvoiceViewAndReminderModal.defaultProps = {
  isOpen: false,
  id: '',
  style: {},
  onClick: () => {},
  onApply: () => {},
};

InvoiceViewAndReminderModal.propTypes = {
  isOpen: bool,
  id: string,
  style: shape({}),
  onClick: func,
  onApply: func,
};
