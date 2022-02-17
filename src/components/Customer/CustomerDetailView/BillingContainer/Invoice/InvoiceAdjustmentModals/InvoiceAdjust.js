import React from 'react';

import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import { arrayOf, bool, func, string } from 'prop-types';

import { InputFormField } from '../../../../../../common';
import numberWithCommas from '../../../../../../hooks/numberWithCommas';

const InvoiceAdjust = ({
  invoiceInputs,
  setInvoiceInputs,
  returnTotalAmount,
  parseNumber,
  invoiceType,
  loading,
}) => {
  const { totalCurrentBudget, totalNewBudget } = returnTotalAmount();
  const onChangeInput = (input, index, { target }) => {
    const resultArray = [...invoiceInputs];
    resultArray[index] = {
      ...invoiceInputs[index],
      newAmount: target.value,
      marketplace: input.marketplace,
      change:
        parseNumber(target.value) === input.new_budget
          ? 0
          : parseNumber(target.value) - input.new_budget > 0
          ? `+${Math.abs(input.new_budget - parseNumber(target.value))}`
          : `-${Math.abs(input.new_budget - parseNumber(target.value))}`,
    };
    setInvoiceInputs(resultArray);
  };
  return (
    <GrayTable>
      <div className="modal-body pb-3">
        <div className="row">
          <div className="col-4 pr-2 text-left">
            <div className="label">Marketplace</div>
          </div>
          <div className="col-4 px-1 text-left">
            <div className="label">From</div>
          </div>
          <div className="col-4 pl-1 text-left">
            <div className="label">
              {invoiceType === 'one time' ? 'Additional amount' : 'To'}
            </div>
          </div>

          <div className=" straight-line horizontal-line pt-1 mb-2" />
          {invoiceInputs &&
            invoiceInputs.length > 0 &&
            invoiceInputs.map((input, index) => {
              return (
                <>
                  <div
                    key={input.id ? input.id : Math.random()}
                    className="col-4 pr-2 text-left mt-3">
                    <div className="normal-text ">{input?.marketplace}</div>
                  </div>
                  <div className="col-4 px-1 text-left mt-3">
                    <div className="normal-text ">
                      ${numberWithCommas(input.new_budget)}
                    </div>
                  </div>
                  <div className="col-4 pl-1 text-left">
                    <InputFormField id={index + input?.marketplace}>
                      <div className="input-container  ">
                        <span className="input-icon ">$</span>
                        <NumberFormat
                          className="form-control"
                          name={index + input?.marketplace}
                          placeholder={
                            invoiceType === 'one time' ? 0 : input.new_budget
                          }
                          onChange={(e) => {
                            onChangeInput(input, index, e);
                          }}
                          thousandSeparator
                          decimalScale={2}
                          allowNegative={false}
                          value={input?.newAmount}
                        />
                      </div>
                    </InputFormField>
                  </div>
                </>
              );
            })}

          {invoiceInputs && invoiceInputs.length === 0 && !loading ? (
            <NoData className="col-12">No Invoice Adjust Data Found</NoData>
          ) : null}
          <div className=" straight-line horizontal-line pt-2 " />
          <div className="col-4 pr-2 text-left mt-3">
            <div className="normal-text text-bold ">Total</div>
          </div>
          <div className="col-4 px-1 text-left mt-3">
            {invoiceType !== 'one time' ? (
              <div className="normal-text text-bold">
                ${totalCurrentBudget ? numberWithCommas(totalCurrentBudget) : 0}
              </div>
            ) : null}
          </div>
          <div className="col-4 pl-1 text-left mt-3">
            <div className="normal-text text-bold">
              ${totalNewBudget ? numberWithCommas(totalNewBudget) : 0}
            </div>
          </div>
        </div>
      </div>
    </GrayTable>
  );
};

export default InvoiceAdjust;

InvoiceAdjust.defaultProps = {
  invoiceInputs: [],
  loading: false,
  setInvoiceInputs: () => {},
  returnTotalAmount: () => {},
  parseNumber: () => {},
};

InvoiceAdjust.propTypes = {
  invoiceInputs: arrayOf(Array),
  invoiceType: string.isRequired,
  loading: bool,
  setInvoiceInputs: func,
  returnTotalAmount: func,
  parseNumber: func,
};

const GrayTable = styled.div`
  background-color: #f4f6fc;
`;

const NoData = styled.div`
  margin: 3em 0em;
  text-align: center;
`;
