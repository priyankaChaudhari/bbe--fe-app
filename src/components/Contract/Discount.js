import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { Button, ModalRadioCheck, ContractFormField } from '../../common';

function Discount() {
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState('none');

  const handleInputChange = (event) => {
    if (event.target.name !== 'amount') setSelectedDiscount(event.target.value);
    if (
      event.target.value === 'fixed-amount' ||
      event.target.value === 'percentage'
    ) {
      setShowAmountInput(true);
    }
  };

  return (
    <div className="modal-body ">
      <h4 className="on-boarding mb-4">Apply Discount</h4>
      <div className="body-content">
        <ul className="apply-discount mb-4">
          <li>
            <ModalRadioCheck>
              <label className="radio-container customer-list" htmlFor="none">
                <input
                  type="radio"
                  id="none"
                  name="discount"
                  value="none"
                  onChange={(event) => {
                    handleInputChange(event);
                  }}
                  defaultChecked={selectedDiscount === 'none'}
                />
                <span className="checkmark" />
                None
              </label>
            </ModalRadioCheck>
          </li>
          <li>
            <ModalRadioCheck>
              <label
                className="radio-container customer-list"
                htmlFor="fixedAmount">
                <input
                  type="radio"
                  id="fixedAmount"
                  name="discount"
                  value="fixed-amount"
                  onChange={(event) => {
                    handleInputChange(event);
                  }}
                  defaultChecked={selectedDiscount === 'fixed-amount'}
                />
                {/* <input type="radio" name="radio" id="1" /> */}
                <span className="checkmark" />
                Fixed Amount ($)
              </label>
            </ModalRadioCheck>
          </li>
          <li>
            <ModalRadioCheck>
              <label
                className="radio-container customer-list"
                htmlFor="percentage">
                <input
                  type="radio"
                  id="percentage"
                  name="discount"
                  value="percentage"
                  onChange={(event) => {
                    handleInputChange(event);
                  }}
                  defaultChecked={selectedDiscount === 'percentage'}
                />
                {/* <input type="radio" name="radio" id="1" /> */}
                <span className="checkmark" />
                Percentage (%)
              </label>
            </ModalRadioCheck>
          </li>
        </ul>
        {/* <ContractFormField>
                <label className="modal-field" htmlFor="emailAddress">
                  Amount
                  <div className="input-container">
                    <span className="input-icon">$ </span>
                    <input
                      className="form-control modal-input-control"
                      placeholder="Enter amount"
                      type="text"
                    />
                  </div>
                </label>
              </ContractFormField> */}
        <ContractFormField>
          {showAmountInput ? (
            <label className="modal-field" htmlFor="emailAddress">
              Amount
              <div className="input-container">
                {selectedDiscount === 'fixed-amount' ? (
                  <span className="input-icon">$ </span>
                ) : (
                  ''
                )}

                <NumberFormat
                  name="amount"
                  className="form-control modal-input-control"
                  // defaultValue={agreementData[item.key]}
                  placeholder={
                    selectedDiscount === 'percentage'
                      ? 'Enter Percentage'
                      : 'Enter Amount'
                  }
                  // prefix={selectedDiscount === 'fixed-amount' ? '$' : ''}
                  // suffix={selectedDiscount === 'percentage' ? '%' : ''}
                  onChange={(event) => handleInputChange(event)}
                  thousandSeparator
                />
                {selectedDiscount === 'percentage' ? (
                  <span className="input-icon">$ </span>
                ) : (
                  ''
                )}
              </div>
            </label>
          ) : (
            ''
          )}
        </ContractFormField>

        <Button className="btn btn-primary w-100 mt-4 "> Confirm</Button>
      </div>
    </div>
  );
}

export default Discount;
