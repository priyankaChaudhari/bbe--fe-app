import React from 'react';

import styled from 'styled-components';

import { ModalRadioCheck } from '../../../../../../common';
import { adjustInvoiceInputs } from '../../../../../../constants/CustomerConstants';

const InvoicePause = () => {
  // { invoiceChoices, setInvoiceChoices }
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
          {adjustInvoiceInputs.map((item) => {
            return (
              <>
                <div className="col-4 text-left mt-2">
                  <div className="normal-text ">{item.label}</div>
                </div>
                <div className="col-4 text-left mt-3">
                  <div
                    style={{ textDecoration: 'line-through' }}
                    className="normal-text ">
                    $5,000
                  </div>
                </div>
                <div className="col-4 text-left">
                  <ul className="invoice-adj-radio mt-2">
                    <li>
                      <ModalRadioCheck className="mb-3">
                        <label
                          className=" checkboxes radio-container customer-list"
                          htmlFor="yes">
                          <input type="radio" name="radio" id="yes" />
                          <span className="checkmark checkmark-customer-list" />
                          Yes
                        </label>
                      </ModalRadioCheck>
                    </li>
                    <li>
                      <ModalRadioCheck className="mb-3">
                        <label
                          className=" checkboxes radio-container customer-list"
                          htmlFor="no">
                          <input type="radio" name="radio" id="no" />
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
            <div className="normal-text text-bold">$10,000</div>
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

InvoicePause.defaultProps = {};

InvoicePause.propTypes = {};

const GrayTable = styled.div`
  background-color: #f4f6fc;
`;
