import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { handleInputChange } from 'react-select/src/utils';
import { Button } from '../../common';
function Discount() {
  const [showAmountInput, setShowAmountInput] = useState(false);

  const handleInputChange = (event) => {
    console.log(event);
  };

  return (
    <div className="modal-body ">
      <h4 className="on-boarding mb-4" role="presentation">
        APPLY DISCOUNT
      </h4>
      <div className="row mb-2">
        <input
          type="radio"
          id="none"
          name="discount"
          value="none"
          onChange={(event) => {
            handleInputChange(event);
          }}
        />
        <label for="none">None</label>
        <br />
        <input
          type="radio"
          id="fixedAmount"
          name="discount"
          value="fixed-amount"
          onChange={(event) => {
            handleInputChange(event);
          }}
        />
        <label for="fixedAmount">Fixed Amount ($)</label>
        <br />
        <input
          type="radio"
          id="percentage"
          name="discount"
          value="percentage"
          onChange={(event) => {
            handleInputChange(event);
          }}
        />
        <label for="percentage">Percentage (%)</label>
      </div>
      {showAmountInput ? (
        <div>
          <label>Amount</label>
          <NumberFormat
            // format={item.key === 'zip_code' ? '##########' : null}
            name="amount"
            className="form-control"
            // defaultValue={agreementData[item.key]}
            placeholder="Enter Amount "
            // prefix={item.type === 'number-currency' ? '$' : ''}
            // suffix={item.type === 'number-percent' ? '%' : ''}
            // onChange={(event) => handleChange(event, item.key)}
            // thousandSeparator={item.key !== 'zip_code'}
          />
        </div>
      ) : (
        ''
      )}
      <div className=" mt-4">
        <Button className=" btn-primary on-boarding w-100">
          {/* {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : ( */}
          Confirm
          {/* )} */}
          {/* Verify Document */}
        </Button>
      </div>
    </div>
  );
}

export default Discount;
