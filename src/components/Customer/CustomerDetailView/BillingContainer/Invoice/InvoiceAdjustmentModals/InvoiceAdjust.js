import React from 'react';

import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import { arrayOf, func } from 'prop-types';

import { InputFormField } from '../../../../../../common';
import { adjustInvoiceInputs } from '../../../../../../constants/CustomerConstants';

const InvoiceAdjust = ({
  invoiceInputs,
  setInvoiceInputs,
  returnTotalAmount,
}) => {
  const onChangeInput = (input, { target }) => {
    if (invoiceInputs && invoiceInputs.length > 0) {
      let flag = 0;
      const resultArray = [...invoiceInputs];
      invoiceInputs.forEach((item, index) => {
        if (item.marketplace === input.label) {
          flag = 1;
          resultArray[index] = {
            newAmount: target.value,
            marketplace: input.label,
          };
          setInvoiceInputs(resultArray);
        }
      });
      if (flag === 0) {
        setInvoiceInputs((state) => [
          ...state,
          {
            newAmount: target.value,
            marketplace: input.label,
          },
        ]);
      }
    } else {
      setInvoiceInputs((state) => [
        ...state,
        {
          newAmount: target.value,
          marketplace: input.label,
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
            <div className="label">New amount</div>
          </div>

          <div className=" straight-line horizontal-line pt-1 mb-2" />
          {adjustInvoiceInputs.map((input) => {
            return (
              <>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text ">{input.label}</div>
                </div>
                <div className="col-4 text-left mt-3">
                  <div className="normal-text ">$5,000</div>
                </div>
                <div className="col-4 text-left">
                  <InputFormField id={input.id}>
                    <div className="input-container  ">
                      <span className="input-icon ">$</span>
                      <NumberFormat
                        className="mt-2 form-control"
                        name={input.name}
                        placeholder={0}
                        onChange={(e) => {
                          onChangeInput(input, e);
                        }}
                        thousandSeparator
                        decimalScale={2}
                        allowNegative={false}
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
            <div className="normal-text text-bold">$10,000</div>
          </div>
          <div className="col-4 text-left mt-3">
            <div className="normal-text text-bold">${returnTotalAmount()}</div>
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
};

InvoiceAdjust.propTypes = {
  invoiceInputs: arrayOf(Array),
  setInvoiceInputs: func,
  returnTotalAmount: func,
};

const GrayTable = styled.div`
  background-color: #f4f6fc;
`;
