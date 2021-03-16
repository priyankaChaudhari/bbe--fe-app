import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import NumberFormat from 'react-number-format';
import {
  Button,
  ModalRadioCheck,
  ContractFormField,
  ErrorMsg,
} from '../../common';
import { updateAccountDetails } from '../../api';
import { getAccountDetails } from '../../store/actions/accountState';

function Discount({
  id,
  discountFlag,
  agreementData,
  setShowDiscountModal,
  formData,
  setFormData,
}) {
  const dispatch = useDispatch();

  const [showAmountInput, setShowAmountInput] = useState(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState('none');
  const [data, setData] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {});
  const handleInputChange = (event) => {
    setApiError('');
    if (event.target.name !== 'amount') {
      setSelectedDiscountType(event.target.value);
    }

    if (
      event.target.value === 'fixed amount' ||
      event.target.value === 'percentage'
    ) {
      setShowAmountInput(true);

      if (discountFlag === 'one-time') {
        setFormData({
          ...formData,
          one_time_discount_type: event.target.value,
        });
        setData({
          ...data,
          one_time_discount_type: event.target.value,
        });
      }

      if (discountFlag === 'monthly') {
        setFormData({ ...formData, monthly_discount_type: event.target.value });
        setData({
          ...data,
          monthly_discount_type: event.target.value,
        });
      }
    } else if (event.target.value === 'none') {
      setShowAmountInput(false);
      if (discountFlag === 'one-time') {
        setFormData({
          ...formData,
          one_time_discount_type: '',
          one_time_discount_amount: 0,
        });
        setData({
          ...data,
          one_time_discount_type: '',
          one_time_discount_amount: 0,
        });
      }

      if (discountFlag === 'monthly') {
        setFormData({
          ...formData,
          monthly_discount_type: '',
          monthly_discount_amount: 0,
        });
        setData({
          ...data,
          monthly_discount_type: '',
          monthly_discount_amount: 0,
        });
      }
    }

    if (event.target.name === 'amount') {
      if (discountFlag === 'one-time') {
        setFormData({
          ...formData,
          one_time_discount_amount: event.target.value.replace(/,/g, ''),
        });
        setData({
          ...data,
          one_time_discount_amount: event.target.value.replace(/,/g, ''),
        });
      }
      if (discountFlag === 'monthly') {
        setFormData({
          ...formData,
          monthly_discount_amount: event.target.value.replace(/,/g, ''),
        });
        setData({
          ...data,
          monthly_discount_amount: event.target.value.replace(/,/g, ''),
        });
      }
    }
  };

  const updateContract = (contractData) => {
    updateAccountDetails(agreementData.id, contractData).then((res) => {
      if (res && res.status === 200) {
        setShowDiscountModal(false);
        dispatch(getAccountDetails(id));
      }
      if (res && res.status === 400) {
        setShowDiscountModal(true);
        setApiError(res && res.data);
      }
    });
  };

  const onSubmit = () => {
    if (discountFlag === 'one-time') {
      if (!(formData && formData.one_time_discount_type)) {
        updateContract({
          one_time_discount_type: '',
          one_time_discount_amount: 0,
        });
      } else {
        updateContract(data);
      }
    }

    if (discountFlag === 'monthly') {
      if (!(formData && formData.monthly_discount_type)) {
        updateContract({
          monthly_discount_type: '',
          monthly_discount_amount: 0,
        });
      } else {
        updateContract(data);
      }
    }
    // updateContract(data);
  };

  const setDefaultValue = (type) => {
    if (discountFlag === 'one-time') {
      if (formData && formData.one_time_discount_type === type) {
        return true;
      }
      if (
        ((formData && formData.one_time_discount_type === '') ||
          (formData && formData.one_time_discount_type === null)) &&
        type === 'none'
      ) {
        return true;
      }
    }
    if (discountFlag === 'monthly') {
      if (formData && formData.monthly_discount_type === type) {
        return true;
      }
      if (
        ((formData && formData.monthly_discount_type === '') ||
          (formData && formData.monthly_discount_type === null)) &&
        type === 'none'
      ) {
        return true;
      }
    }
    return false;
  };

  const setDefaultAmount = () => {
    if (discountFlag === 'one-time') {
      return formData && formData.one_time_discount_amount;
    }
    if (discountFlag === 'monthly') {
      return formData && formData.monthly_discount_amount;
    }
    return null;
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
                  defaultChecked={setDefaultValue('none')}
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
                  value="fixed amount"
                  onChange={(event) => {
                    handleInputChange(event);
                  }}
                  defaultChecked={setDefaultValue('fixed amount')}
                  // defaultChecked={selectedDiscountType === 'fixed amount'}
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
                  defaultChecked={setDefaultValue('percentage')}
                  // defaultChecked={selectedDiscountType === 'percentage'}
                />
                {/* <input type="radio" name="radio" id="1" /> */}
                <span className="checkmark" />
                Percentage (%)
              </label>
            </ModalRadioCheck>
          </li>
        </ul>

        <ContractFormField>
          {showAmountInput ||
          (discountFlag === 'monthly' &&
            formData &&
            formData.monthly_discount_amount) ||
          (discountFlag === 'one-time' &&
            formData &&
            formData.one_time_discount_amount) ? (
            <label className="modal-field" htmlFor="emailAddress">
              Amount
              <div className="input-container">
                {selectedDiscountType === 'fixed amount' ||
                (discountFlag === 'monthly' &&
                  formData &&
                  formData.monthly_discount_type === 'fixed amount') ||
                (discountFlag === 'one-time' &&
                  formData &&
                  formData.one_time_discount_type === 'fixed amount') ? (
                  <span className="input-icon">$ </span>
                ) : (
                  ''
                )}

                <NumberFormat
                  name="amount"
                  className="form-control modal-input-control"
                  // defaultValue={agreementData[item.key]}
                  placeholder={
                    selectedDiscountType === 'percentage'
                      ? 'Enter Percentage'
                      : 'Enter Amount'
                  }
                  // prefix={selectedDiscount === 'fixed-amount' ? '$' : ''}
                  // suffix={selectedDiscount === 'percentage' ? '%' : ''}
                  onChange={(event) => handleInputChange(event)}
                  defaultValue={setDefaultAmount()}
                  thousandSeparator
                />
                {selectedDiscountType === 'percentage' ||
                (discountFlag === 'monthly' &&
                  formData &&
                  formData.monthly_discount_type === 'percentage') ||
                (discountFlag === 'one-time' &&
                  formData &&
                  formData.one_time_discount_type === 'percentage') ? (
                  <span className="input-icon">%</span>
                ) : (
                  ''
                )}
              </div>
              <ErrorMsg>
                {apiError && apiError.monthly_discount_amount}
                {apiError && apiError.one_time_discount_amount}
              </ErrorMsg>
            </label>
          ) : (
            ''
          )}
        </ContractFormField>

        <Button
          className="btn btn-primary w-100 mt-4 "
          onClick={() => onSubmit()}>
          {' '}
          Confirm
        </Button>
      </div>
    </div>
  );
}
Discount.defaultProps = {
  discountFlag: '',
  agreementData: {},
  setShowDiscountModal: () => {},
  formData: {},
  setFormData: () => {},
};
Discount.propTypes = {
  id: PropTypes.string.isRequired,
  discountFlag: PropTypes.string,
  agreementData: PropTypes.shape({
    id: PropTypes.string,
  }),
  setShowDiscountModal: PropTypes.func,
  formData: PropTypes.shape({
    monthly_discount_type: PropTypes.string,
    one_time_discount_type: PropTypes.string,
    monthly_discount_amount: PropTypes.string,
    one_time_discount_amount: PropTypes.string,
  }),
  setFormData: PropTypes.func,
};

export default Discount;
