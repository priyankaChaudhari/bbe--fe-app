import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ArrowRightBlackIcon, ArrowRightIcon } from '../../theme/images';
import {
  InvoiceApprovalHeader,
  InvoiceCurrentMonthHeader,
  InvoiceInfo,
  invoiceApprovalFlag,
  TotalInvoiceHeader,
  InvoiceNewMonthHeader,
  PATH_THANKS,
} from '../../constants';
import {
  UnauthorizedHeader,
  OnBoardingBody,
  GreyCard,
  ModalRadioCheck,
  Button,
  InputText,
} from '../../common';

export default function DSPBudgetApprovalContainer() {
  const history = useHistory();
  const [invoiceType, setInvoiceType] = useState('additional');
  const [invoiceApprovalCondition, setInvoiceApprovalCondition] = useState(
    'yes',
  );
  const [invoiceRejectMessage, setInvoiceRejectMessage] = useState('');
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

  useEffect(() => {
    setInvoiceType('oneTime');
  }, []);

  const storeInvoiceProposal = () => {
    history.push({
      pathname: PATH_THANKS,
      type: 'dspSignOff',
    });
  };

  const renderHeaderMessage = () => {
    return (
      <GreyCard className="yellow-card ">
        <p className="normal-text mt-0">
          {' '}
          Below is a summary of the proposed changes to your DSP plan with Buy
          Box Experts.{' '}
        </p>
        <p className="normal-text">
          {' '}
          Please check through the details and approve the changes if you’re
          happy to proceed.
        </p>
        <p className="normal-text mb-0">
          {' '}
          If you’re not 100% happy, please let me know if you’d like anything
          changed and I will send over a new proposal.
        </p>{' '}
        <p className="normal-text mb-0">Many thanks,</p>
        Jacob
      </GreyCard>
    );
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

    return valueFor === 'change' ? '-' : 0;
  };

  const renderHeading = () => {
    return (
      <h5 className="sub-title-text mt-4">
        {InvoiceApprovalHeader[invoiceType]}
      </h5>
    );
  };

  const renderAdditionalDSPInvoice = () => {
    return (
      <GreyCard className="mb-3 mt-1">
        <p className="normal-text text-bold m-0">
          Additional DSP invoice (November only)
        </p>
        <p className="normal-text text-bold mb-0 mt-1">
          {' '}
          {generateAmount(5000, '', '$')}
        </p>
        <p className="normal-text mb-0 mt-1">
          The will be a one-off invoice, providing additional budget to spend in
          the current month. This invoice will be sent as soon as brand partner
          approves the proposal.
        </p>
      </GreyCard>
    );
  };

  const renderInvoiceApproveReject = () => {
    return (
      <>
        {invoiceApprovalFlag.map((item) => (
          <ModalRadioCheck className="mb-3" key={item.value}>
            {' '}
            <label
              className="checkboxes radio-container customer-list"
              htmlFor={item.value}>
              <input
                type="radio"
                name="radio"
                id={item.value}
                value={item.value}
                onChange={() => setInvoiceApprovalCondition(item.value)}
                defaultChecked={item.value === invoiceApprovalCondition}
              />
              <span className="checkmark checkmark-customer-list" />
              {item.label}
            </label>
          </ModalRadioCheck>
        ))}

        {invoiceApprovalCondition === 'no' ? (
          <InputText
            className="form-control "
            placeholder="Let us know if you would like any changes to be made (optional)"
            value={invoiceRejectMessage}
            onChange={(event) => {
              setInvoiceRejectMessage(event.target.value);
            }}
          />
        ) : null}

        <Button
          className="btn-primary w-100 mt-3"
          onClick={() => {
            storeInvoiceProposal();
          }}>
          Confirm
        </Button>
      </>
    );
  };

  const renderTableHeaders = () => {
    if (invoiceType === 'standard' || invoiceType === 'additional') {
      return (
        <>
          <div className="col-5 text-left">
            <div className="label">Marketplace</div>
          </div>
          <div className="col-4 text-left">
            <div className="label">From</div>
          </div>
          <div className="col-3 text-left">
            <div className="label">To</div>
          </div>
        </>
      );
    }
    if (invoiceType === 'oneTime') {
      return (
        <>
          <div className="col-3 text-left">
            <div className="label">Marketplace</div>
          </div>
          <div className="col-4 text-left">
            <div className="label">Existing budget</div>
          </div>
          <div className="col-5 text-left">
            <div className="label">Additional Amount</div>
          </div>
        </>
      );
    }
    // for pause invoice.
    return (
      <>
        <div className="col-4 text-left">
          <div className="label">Marketplace</div>
        </div>
        <div className="col-4 text-left">
          <div className="label">Pause Invoice</div>
        </div>
        <div className="col-4 text-left">
          <div className="label">Invoice Amount</div>
        </div>
      </>
    );
  };

  const renderTableData = () => {
    return (
      <>
        {marketplaceData.map((item, index) => (
          <div className={index ? 'row mt-1' : 'row'} key={item.name}>
            <div className="col-5 text-left">
              <div className={!index ? 'normal-text text-bold' : 'normal-text'}>
                {item.name}
              </div>
            </div>
            <div className="col-2 text-left">
              <div className={!index ? 'normal-text text-bold' : 'normal-text'}>
                {generateAmount(item?.from, 'from', '$')}
              </div>
            </div>
            <div className="col-2 text-center">
              {invoiceType === 'standard' || invoiceType === 'additional' ? (
                !index ? (
                  <div className="normal-text">
                    <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                  </div>
                ) : (
                  <div className="normal-text">
                    <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
                  </div>
                )
              ) : null}
            </div>
            <div className="col-3 text-left">
              <div className={!index ? 'normal-text text-bold' : 'normal-text'}>
                {generateAmount(item?.to, 'from', '$')}
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  const renderTotalInvoiceSection = () => {
    return (
      <>
        <div className=" straight-line horizontal-line pt-1 mb-2 " />
        <div className="row">
          <div className="col-5 text-left">
            <div className="normal-text text-bold">
              {TotalInvoiceHeader[invoiceType]}
            </div>
          </div>
          <div className="col-2 text-left">
            {invoiceType === 'standard' || invoiceType === 'additional' ? (
              <div className="normal-text text-bold">
                {generateAmount(5000, '', '$')}
              </div>
            ) : null}
          </div>

          <div className="col-2 text-center">
            {invoiceType === 'standard' || invoiceType === 'additional' ? (
              <div className="normal-text">
                <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
              </div>
            ) : null}
          </div>

          <div className="col-3 text-left">
            <div className="normal-text text-bold">
              {generateAmount(5000, '', '$')}
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <UnauthorizedHeader />
      <OnBoardingBody className="body-white pt-3">
        <div className="white-card-base panel pb-4">
          {renderHeaderMessage()}
          {renderHeading()}
          <p className="normal-text text-medium mb-2">
            {InvoiceCurrentMonthHeader[invoiceType]}
          </p>
          <h5 className="sub-title-text mt-2">
            {generateAmount(10000, '', '$')}
          </h5>
          {invoiceType !== 'oneTime' ? (
            <>
              <div className="straight-line horizontal-line mt-3" />
              <p className="normal-text text-medium mb-2">
                {InvoiceNewMonthHeader[invoiceType]}
                {invoiceType === 'pause' ? 'December' : null}
              </p>
              <h5 className="sub-title-text mt-2">
                {generateAmount(15000, '', '$')}
              </h5>{' '}
            </>
          ) : null}

          <fieldset className="shape-without-border mt-3 p-2">
            <div className="row">{renderTableHeaders()}</div>
            <div className=" straight-line horizontal-line pt-1 mb-2 " />
            {renderTableData()}
            {renderTotalInvoiceSection()}
          </fieldset>

          <p className="normal-text">
            {InvoiceInfo[invoiceType]?.mainHeading}
            <span className="text-bold">
              {InvoiceInfo[invoiceType]?.boldHeading}
            </span>
            {InvoiceInfo[invoiceType]?.mainHeading2}
          </p>
          {invoiceType === 'pause' ? (
            <div className=" straight-line horizontal-line pt-1 mb-2 " />
          ) : null}
          {invoiceType === 'additional' ? renderAdditionalDSPInvoice() : null}
          {renderInvoiceApproveReject()}
        </div>
      </OnBoardingBody>
    </>
  );
}
