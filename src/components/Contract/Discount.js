import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import NumberFormat from 'react-number-format';
import {
  Button,
  ModalRadioCheck,
  ContractFormField,
  ErrorMsg,
  PageLoader,
} from '../../common';
import { updateAccountDetails } from '../../api';

function Discount({
  discountFlag,
  agreementData,
  setShowDiscountModal,
  formData,
  setFormData,
  getContractDetails,
}) {
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState('none');
  const [data, setData] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });

  const setDefaultAmount = (selectedRadioBtn) => {
    if (discountFlag === 'one-time') {
      if (
        (agreementData && agreementData.one_time_discount_type) ===
        selectedRadioBtn
      ) {
        return agreementData && agreementData.one_time_discount_amount;
      }
      return null;
    }
    if (discountFlag === 'monthly') {
      if (
        (agreementData && agreementData.monthly_discount_type) ===
        selectedRadioBtn
      ) {
        return agreementData && agreementData.monthly_discount_amount;
      }
      return null;
    }
    return null;
  };

  useEffect(() => {
    if (
      discountFlag === 'one-time' &&
      formData &&
      formData.one_time_discount_type !== null
    ) {
      setShowAmountInput(true);
    }

    if (
      discountFlag === 'monthly' &&
      formData &&
      formData.monthly_discount_type !== null
    ) {
      setShowAmountInput(true);
    }
    if (discountFlag === 'one-time') {
      setSelectedDiscountType(formData && formData.one_time_discount_type);
    }
    if (discountFlag === 'monthly') {
      setSelectedDiscountType(formData && formData.monthly_discount_type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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
          one_time_discount_amount: setDefaultAmount(event.target.value),
        });
        setData({
          ...data,
          one_time_discount_type: event.target.value,
          one_time_discount_amount: setDefaultAmount(event.target.value),
        });
      }

      if (discountFlag === 'monthly') {
        setFormData({
          ...formData,
          monthly_discount_type: event.target.value,
          monthly_discount_amount: setDefaultAmount(event.target.value),
        });
        setData({
          ...data,
          monthly_discount_type: event.target.value,
          monthly_discount_amount: setDefaultAmount(event.target.value),
        });
      }
    } else if (event.target.value === 'none') {
      setShowAmountInput(false);
      if (discountFlag === 'one-time') {
        setFormData({
          ...formData,
          one_time_discount_type: null,
          one_time_discount_amount: null,
        });
        setData({
          ...data,
          one_time_discount_type: null,
          one_time_discount_amount: null,
        });
      }

      if (discountFlag === 'monthly') {
        setFormData({
          ...formData,
          monthly_discount_type: null,
          monthly_discount_amount: null,
        });
        setData({
          ...data,
          monthly_discount_type: null,
          monthly_discount_amount: null,
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
    setIsLoading({ loader: true, type: 'button' });

    updateAccountDetails(agreementData.id, contractData).then((res) => {
      setIsLoading({ loader: false, type: 'button' });

      if (res && res.status === 200) {
        setShowDiscountModal(false);
        // dispatch(getAccountDetails(id));
        getContractDetails();
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
          one_time_discount_type: null,
          one_time_discount_amount: null,
        });
      } else {
        updateContract({
          ...data,
          one_time_discount_type: formData.one_time_discount_type,
        });
      }
    }

    if (discountFlag === 'monthly') {
      if (!(formData && formData.monthly_discount_type)) {
        updateContract({
          monthly_discount_type: null,
          monthly_discount_amount: null,
        });
      } else {
        updateContract({
          ...data,
          monthly_discount_type: formData.monthly_discount_type,
        });
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
        {/* || (discountFlag === 'monthly' && formData &&
        formData.monthly_discount_amount) || (discountFlag === 'one-time' &&
        formData && formData.one_time_discount_amount) */}
        {selectedDiscountType === 'fixed amount' ? (
          <ContractFormField>
            {showAmountInput ? (
              <>
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
                      placeholder="Enter Amount"
                      onChange={(event) => handleInputChange(event)}
                      defaultValue={setDefaultAmount(selectedDiscountType)}
                      thousandSeparator
                      allowNegative={false}
                    />
                  </div>
                </label>
                <ErrorMsg>
                  {apiError && apiError.monthly_discount_amount}
                  {apiError && apiError.one_time_discount_amount}
                </ErrorMsg>
              </>
            ) : (
              ''
            )}
          </ContractFormField>
        ) : (
          <ContractFormField>
            {showAmountInput ? (
              <>
                <label className="modal-field" htmlFor="emailAddress">
                  Amount
                  <div className="input-container">
                    <NumberFormat
                      name="amount"
                      className="form-control modal-input-control"
                      placeholder="Enter Percentage"
                      onChange={(event) => handleInputChange(event)}
                      defaultValue={setDefaultAmount(selectedDiscountType)}
                      thousandSeparator
                      allowNegative={false}
                      isAllowed={(values) => {
                        const { formattedValue, floatValue } = values;
                        if (floatValue == null) {
                          return formattedValue === '';
                        }
                        return floatValue <= 100;
                      }}
                    />
                    {selectedDiscountType === 'percentage' ||
                    (discountFlag === 'monthly' &&
                      formData &&
                      formData.monthly_discount_type === 'percentage') ||
                    (discountFlag === 'one-time' &&
                      formData &&
                      formData.one_time_discount_type === 'percentage') ? (
                      <span className="input-icon end">%</span>
                    ) : (
                      ''
                    )}
                  </div>
                </label>
                <ErrorMsg>
                  {apiError && apiError.monthly_discount_amount}
                  {apiError && apiError.one_time_discount_amount}
                </ErrorMsg>
              </>
            ) : (
              ''
            )}
          </ContractFormField>
        )}
        <Button
          className="btn btn-primary w-100 mt-4 "
          onClick={() => onSubmit()}>
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            'Confirm'
          )}
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
  getContractDetails: () => {},
};
Discount.propTypes = {
  discountFlag: PropTypes.string,
  agreementData: PropTypes.shape({
    id: PropTypes.string,
    monthly_discount_type: PropTypes.string,
    one_time_discount_type: PropTypes.string,
    monthly_discount_amount: PropTypes.string,
    one_time_discount_amount: PropTypes.string,
  }),
  setShowDiscountModal: PropTypes.func,
  formData: PropTypes.shape({
    monthly_discount_type: PropTypes.string,
    one_time_discount_type: PropTypes.string,
    monthly_discount_amount: PropTypes.string,
    one_time_discount_amount: PropTypes.string,
  }),
  setFormData: PropTypes.func,
  getContractDetails: PropTypes.func,
};

export default Discount;
