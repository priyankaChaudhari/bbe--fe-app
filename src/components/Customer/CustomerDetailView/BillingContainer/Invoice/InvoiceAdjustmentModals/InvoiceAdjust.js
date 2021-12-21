import React from 'react';

import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import { arrayOf, func, string } from 'prop-types';

import { InputFormField } from '../../../../../../common';
import numberWithCommas from '../../../../../../hooks/numberWithComas';

const InvoiceAdjust = ({
  invoiceInputs,
  setInvoiceInputs,
  returnTotalAmount,
  parseNumber,
  invoiceType,
}) => {
  const { totalCurrentBudget, totalNewBudget } = returnTotalAmount();
  const onChangeInput = (input, { target }) => {
    if (invoiceInputs && invoiceInputs.length > 0) {
      let flag = 0;
      const resultArray = [...invoiceInputs];
      invoiceInputs.forEach((item, index) => {
        if (item.marketplace === input.marketplace) {
          flag = 1;
          resultArray[index] = {
            ...invoiceInputs[index],
            new_budget: target.value,
            marketplace: input.marketplace,
            change:
              parseNumber(target.value) === input.old_budget ||
              parseNumber(target.value) <= 0
                ? 0
                : parseNumber(target.value) - input.old_budget > 0
                ? `+${Math.abs(input.old_budget - parseNumber(target.value))}`
                : `-${Math.abs(input.old_budget - parseNumber(target.value))}`,
          };
          setInvoiceInputs(resultArray);
        }
      });
      if (flag === 0) {
        setInvoiceInputs((state) => [
          ...state,
          {
            new_budget: target.value,
            marketplace: input.marketplace,
          },
        ]);
      }
    } else {
      setInvoiceInputs((state) => [
        ...state,
        {
          new_budget: target.value,
          marketplace: input.marketplace,
        },
      ]);
    }
  };
  return (
    <GrayTable>
      <div className="modal-body pb-3">
        <div className="row">
          <div className="col-4 text-left">
            <div className="label">Marketplace</div>
          </div>
          <div className="col-4 text-left">
            <div className="label">Current</div>
          </div>
          <div className="col-4 text-left">
            <div className="label">
              {invoiceType === 'onetime' ? 'Additional amount' : 'New amount'}
            </div>
          </div>

          <div className=" straight-line horizontal-line pt-1 mb-2" />
          {invoiceInputs &&
            invoiceInputs.length > 0 &&
            invoiceInputs.map((input) => {
              return (
                <>
                  <div className="col-4 text-left mt-3">
                    <div className="normal-text ">{input.marketplace}</div>
                  </div>
                  <div className="col-4 text-left mt-3">
                    <div className="normal-text ">
                      ${numberWithCommas(input.old_budget)}
                    </div>
                  </div>
                  <div className="col-4 text-left">
                    <InputFormField id={input.marketplace}>
                      <div className="input-container  ">
                        <span className="input-icon ">$</span>
                        <NumberFormat
                          className="mt-2 form-control"
                          name={input.marketplace}
                          placeholder={
                            invoiceType === 'onetime' ? 0 : input.old_budget
                          }
                          onChange={(e) => {
                            onChangeInput(input, e);
                          }}
                          thousandSeparator
                          decimalScale={2}
                          allowNegative={false}
                          value={input?.new_budget}
                        />
                      </div>
                    </InputFormField>
                  </div>
                </>
              );
            })}
          <div className=" straight-line horizontal-line pt-2 " />
          <div className="col-4 text-left mt-3">
            <div className="normal-text text-bold ">Total</div>
          </div>
          <div className="col-4 text-left mt-3">
            {invoiceType !== 'onetime' ? (
              <div className="normal-text text-bold">
                ${totalCurrentBudget ? numberWithCommas(totalCurrentBudget) : 0}
              </div>
            ) : null}
          </div>
          <div className="col-4 text-left mt-3">
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
  setInvoiceInputs: () => {},
  returnTotalAmount: () => {},
  parseNumber: () => {},
};

InvoiceAdjust.propTypes = {
  invoiceInputs: arrayOf(Array),
  setInvoiceInputs: func,
  returnTotalAmount: func,
  parseNumber: func,
  invoiceType: string.isRequired,
};

const GrayTable = styled.div`
  background-color: #f4f6fc;
`;
