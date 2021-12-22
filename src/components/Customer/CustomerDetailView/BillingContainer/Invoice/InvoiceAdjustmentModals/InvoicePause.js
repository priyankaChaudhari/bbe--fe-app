import React from 'react';

import styled from 'styled-components';
import { arrayOf, func } from 'prop-types';

import { ModalRadioCheck } from '../../../../../../common';

const InvoicePause = ({
  invoiceChoices,
  setInvoiceChoices,
  returnTotalAmount,
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
          newAmount: value ? 0 : element.old_budget,
        };
        setInvoiceChoices(resultArray);
      }
    });
  };

  return (
    <GrayTable>
      <div className="modal-body pb-3">
        <div className="row">
          <div className="col-4 text-left">
            <div className="label">Marketplace</div>
          </div>
          <div className="col-4 text-left">
            <div className="label">Invoice Amount</div>
          </div>
          <div className="col-4 text-left">
            <div className="label">Pause</div>
          </div>

          <div className=" straight-line horizontal-line pt-1 mb-2 " />
          {invoiceChoices &&
            invoiceChoices.length > 0 &&
            invoiceChoices.map((item) => {
              return (
                <>
                  <div className="col-4 text-left mt-2">
                    <div className="normal-text ">{item.marketplace}</div>
                  </div>
                  <div className="col-4 text-left mt-3">
                    <div
                      style={{
                        textDecoration: item.is_sent_for_pause
                          ? 'line-through'
                          : 'none',
                      }}
                      className="normal-text ">
                      ${item.old_budget}
                    </div>
                  </div>
                  <div className="col-4 text-left">
                    <ul className="invoice-adj-radio mt-2">
                      <li>
                        <ModalRadioCheck className="mb-3">
                          <label
                            className=" checkboxes radio-container customer-list"
                            htmlFor={`${item.id}yes`}>
                            <input
                              type="radio"
                              name={item.id}
                              id={`${item.id}yes`}
                              defaultChecked={item.is_sent_for_pause === true}
                              onChange={() => {}}
                              onClick={() => onClick(item, true)}
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
                            htmlFor={`${item.id}no`}>
                            <input
                              type="radio"
                              name={item.id}
                              id={`${item.id}no`}
                              defaultChecked={
                                item.is_sent_for_pause === false ||
                                item.is_sent_for_pause === null
                              }
                              onChange={() => {}}
                              onClick={() => onClick(item, false)}
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
};

InvoicePause.propTypes = {
  invoiceChoices: arrayOf(Array),
  setInvoiceChoices: func,
  returnTotalAmount: func,
};

const GrayTable = styled.div`
  background-color: #f4f6fc;
`;
