import React from 'react';

import styled from 'styled-components';
import { arrayOf, bool, func } from 'prop-types';

import { ModalRadioCheck } from '../../../../../../common';

const InvoicePause = ({
  invoiceChoices,
  setInvoiceChoices,
  returnTotalAmount,
  loading,
}) => {
  const { totalNewBudget } = returnTotalAmount();

  const onClick = (item, value) => {
    const resultArray = [...invoiceChoices];
    invoiceChoices.forEach((element, index) => {
      if (element.marketplace === item.marketplace) {
        resultArray[index] = {
          ...invoiceChoices[index],
          marketplace: item.marketplace,
          is_sent_for_pause: value,
          newAmount: value ? 0 : element.new_budget,
        };
        setInvoiceChoices(resultArray);
      }
    });
  };

  return (
    <GrayTable>
      <div className="modal-body pb-3">
        <div className="row">
          <div className="col-4 pr-2 text-left">
            <div className="label">Marketplace</div>
          </div>
          <div className="col-4 px-1 text-left">
            <div className="label">Invoice Amount</div>
          </div>
          <div className="col-4 pl-1 text-left">
            <div className="label">Pause</div>
          </div>

          <div className=" straight-line horizontal-line pt-1 mb-2 " />
          {invoiceChoices &&
            invoiceChoices.length > 0 &&
            invoiceChoices.map((item, index) => {
              return (
                <>
                  <div className="col-4 pr-2 text-left mt-2">
                    <div className="normal-text ">{item.marketplace}</div>
                  </div>
                  <div className="col-4 px-1 text-left mt-3">
                    <div
                      style={{
                        textDecoration: item.is_sent_for_pause
                          ? 'line-through'
                          : 'none',
                      }}
                      className="normal-text ">
                      ${item.new_budget}
                    </div>
                  </div>
                  <div className="col-4 pl-1 text-left">
                    <ul className="invoice-adj-radio mt-2">
                      <li>
                        <ModalRadioCheck className="mb-3">
                          <label
                            className=" checkboxes radio-container customer-list"
                            htmlFor={`${index + item?.marketplace}yes`}>
                            <input
                              type="radio"
                              name={index + item?.marketplace}
                              id={`${index + item?.marketplace}yes`}
                              defaultChecked={item.is_sent_for_pause === true}
                              onChange={() => {}}
                              onClick={() => onClick(item, true)}
                              disabled={item?.pause_approved}
                            />
                            <span className="checkmark checkmark-customer-list" />
                            Yes
                          </label>
                        </ModalRadioCheck>
                      </li>
                      <li>
                        <ModalRadioCheck className="mb-3">
                          <label
                            className=" checkboxes radio-container customer-list"
                            htmlFor={`${index + item?.marketplace}no`}>
                            <input
                              type="radio"
                              name={index + item?.marketplace}
                              id={`${index + item?.marketplace}no`}
                              defaultChecked={
                                item.is_sent_for_pause === false ||
                                item.is_sent_for_pause === null
                              }
                              onChange={() => {}}
                              onClick={() => onClick(item, false)}
                              disabled={item?.pause_approved}
                            />
                            <span className="checkmark checkmark-customer-list" />
                            No
                          </label>
                        </ModalRadioCheck>
                      </li>
                    </ul>
                  </div>
                </>
              );
            })}
          {invoiceChoices && invoiceChoices.length === 0 && !loading ? (
            <NoData className="col-12">No Invoice Adjust Data Found</NoData>
          ) : null}
          <div className=" straight-line horizontal-line pt-2 " />
          <div className="col-4 text-left mt-3">
            <div className="normal-text text-bold ">Total</div>
          </div>
          <div className="col-4 text-left mt-3">
            <div className="normal-text text-bold">${totalNewBudget}</div>
          </div>
          {/* <div className="col-4 text-left mt-3">
            <div className="normal-text text-bold">${returnTotalAmount()}</div>
          </div> */}
        </div>
      </div>
    </GrayTable>
  );
};

export default InvoicePause;

InvoicePause.defaultProps = {
  invoiceChoices: [],
  setInvoiceChoices: () => {},
  returnTotalAmount: () => {},
  loading: false,
};

InvoicePause.propTypes = {
  invoiceChoices: arrayOf(Array),
  setInvoiceChoices: func,
  returnTotalAmount: func,
  loading: bool,
};

const GrayTable = styled.div`
  background-color: #f4f6fc;
`;

const NoData = styled.div`
  margin: 3em 0em;
  text-align: center;
`;
