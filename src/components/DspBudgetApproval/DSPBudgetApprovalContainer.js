import React, { useEffect, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { getDSPBudgetAdjustDetail, updateDSPBudgetAdjustment } from '../../api';
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
  const { adjustmentId } = useParams();

  const [invoiceType, setInvoiceType] = useState('');
  const [invoiceApprovalCondition, setInvoiceApprovalCondition] = useState(
    'yes',
  );
  const [invoiceRejectMessage, setInvoiceRejectMessage] = useState('');
  const [marketplaceData, setMarketplaceData] = useState(null);
  const [total, setTotal] = useState({});

  const calculateTotal = (res) => {
    let oldResult = 0;
    let newResult = 0;
    if (res?.adjustments?.length) {
      for (const item of res?.adjustments) {
        oldResult += item?.old_budget;
        newResult += item?.new_budget;
      }
    }
    setTotal({ old_budget: oldResult, new_budget: newResult });
  };

  useEffect(() => {
    getDSPBudgetAdjustDetail(adjustmentId).then((res) => {
      setMarketplaceData(res);
      if (res?.is_sent_for_pause) {
        setInvoiceType('pause');
      } else {
        setInvoiceType(res?.dsp_invoice_subtype);
      }
      calculateTotal(res);
    });
  }, [adjustmentId]);

  const storeInvoiceProposal = () => {
    const data = {};
    if (invoiceApprovalCondition === 'yes') {
      data.budget_approved = true;
    }
    if (invoiceApprovalCondition === 'no') {
      data.budget_approved = false;
      data.rejection_note = invoiceRejectMessage;
    }

    updateDSPBudgetAdjustment(adjustmentId, data).then((res) => {
      if (res.status === 200) {
        history.push({
          pathname: PATH_THANKS,
          type: 'dspSignOff',
        });
      }
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
          Additional DSP invoice (
          {dayjs(new Date(marketplaceData?.applicable_from)).format('MMMM')}{' '}
          only)
        </p>
        <p className="normal-text text-bold mb-0 mt-1">
          {' '}
          {generateAmount(total?.new_budget - total?.old_budget, '', '$')}
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
    if (invoiceType === 'standard' || invoiceType === 'permanent additional') {
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
    if (invoiceType === 'one time') {
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
        {marketplaceData?.adjustments?.map((item, index) => (
          <div className={index ? 'row mt-1' : 'row'} key={item.name}>
            <div className="col-5 text-left">
              <div className={!index ? 'normal-text text-bold' : 'normal-text'}>
                {item.marketplace}
              </div>
            </div>
            <div className="col-2 text-left">
              <div className={!index ? 'normal-text text-bold' : 'normal-text'}>
                {invoiceType === 'pause'
                  ? item?.is_sent_for_pause
                    ? 'Yes'
                    : 'No'
                  : generateAmount(item?.old_budget, 'from', '$')}
              </div>
            </div>
            <div className="col-2 text-center">
              {invoiceType === 'standard' ||
              invoiceType === 'permanent additional' ? (
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
                {invoiceType === 'pause'
                  ? item?.is_sent_for_pause
                    ? '$0'
                    : generateAmount(item?.new_budget, 'from', '$')
                  : generateAmount(item?.new_budget, 'from', '$')}
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
            {invoiceType === 'standard' ||
            invoiceType === 'permanent additional' ? (
              <div className="normal-text text-bold">
                {generateAmount(total?.old_budget, '', '$')}
              </div>
            ) : null}
          </div>

          <div className="col-2 text-center">
            {invoiceType === 'standard' ||
            invoiceType === 'permanent additional' ? (
              <div className="normal-text">
                <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
              </div>
            ) : null}
          </div>

          <div className="col-3 text-left">
            <div className="normal-text text-bold">
              {generateAmount(total?.new_budget, '', '$')}
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
          {invoiceType !== 'one time' ? (
            <>
              <p className="normal-text text-medium mb-2">
                {InvoiceCurrentMonthHeader[invoiceType]}
              </p>
              <h5 className="sub-title-text mt-2">
                {generateAmount(total?.old_budget, '', '$')}
              </h5>
            </>
          ) : null}
          <div className="straight-line horizontal-line mt-3" />
          <p className="normal-text text-medium mb-2">
            {InvoiceNewMonthHeader[invoiceType]}
            {invoiceType === 'pause'
              ? dayjs(new Date(marketplaceData?.applicable_from)).format('MMMM')
              : null}
          </p>
          <h5 className="sub-title-text mt-2">
            {generateAmount(total?.new_budget, '', '$')}
          </h5>{' '}
          <fieldset className="shape-without-border mt-3 p-2">
            <div className="row">{renderTableHeaders()}</div>
            <div className=" straight-line horizontal-line pt-1 mb-2 " />
            {renderTableData()}
            {renderTotalInvoiceSection()}
          </fieldset>
          <p className="normal-text">
            {InvoiceInfo[invoiceType]?.mainHeading}
            <span className="text-bold">
              {InvoiceInfo[invoiceType]?.boldHeading
                .replace(
                  'APPLICABLE_MONTH',
                  dayjs(new Date(marketplaceData?.applicable_from)).format(
                    'MMMM',
                  ),
                )
                .replace(
                  'APPLICABLE_DATE',
                  new Date(marketplaceData?.applicable_from).getDate(),
                )}
            </span>
            {InvoiceInfo[invoiceType]?.mainHeading2}
          </p>
          {invoiceType === 'pause' ? (
            <div className=" straight-line horizontal-line pt-1 mb-2 " />
          ) : null}
          {invoiceType === 'permanent additional'
            ? renderAdditionalDSPInvoice()
            : null}
          {renderInvoiceApproveReject()}
        </div>
      </OnBoardingBody>
    </>
  );
}
