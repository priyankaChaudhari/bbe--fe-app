/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import NumberFormat from 'react-number-format';
import { string, number, func, oneOfType, shape } from 'prop-types';

import { updateAccountDetails } from '../../api';
import {
  Button,
  ModalRadioCheck,
  InputFormField,
  ErrorMsg,
  PageLoader,
} from '../../common';

function Discount({
  discountFlag,
  agreementData,
  setShowDiscountModal,
  formData,
  setFormData,
  setDetails,
}) {
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState('none');
  const [data, setData] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const oneTimeDiscountType = formData?.one_time_discount_type;
  const monthlyDiscountType = formData?.monthly_discount_type;

  const setDefaultAmount = (selectedRadioBtn) => {
    if (discountFlag === 'one-time') {
      if (agreementData?.one_time_discount_type === selectedRadioBtn) {
        return agreementData?.one_time_discount_amount;
      }
      return null;
    }
    if (discountFlag === 'monthly') {
      if (agreementData?.monthly_discount_type === selectedRadioBtn) {
        return agreementData?.monthly_discount_amount;
      }
      return null;
    }
    return null;
  };

  useEffect(() => {
    if (discountFlag === 'one-time' && oneTimeDiscountType !== null) {
      setShowAmountInput(true);
    }
    if (discountFlag === 'monthly' && monthlyDiscountType !== null) {
      setShowAmountInput(true);
    }
    if (discountFlag === 'one-time') {
      setSelectedDiscountType(oneTimeDiscountType);
    }
    if (discountFlag === 'monthly') {
      setSelectedDiscountType(monthlyDiscountType);
    }
  }, [formData]);

  const oneTimeDiscountFlag = (discountTypeValue, discountAmountValue) => {
    setFormData({
      ...formData,
      one_time_discount_type: discountTypeValue,
      one_time_discount_amount: discountAmountValue,
    });
    setData({
      ...data,
      one_time_discount_type: discountTypeValue,
      one_time_discount_amount: discountAmountValue,
    });
  };
  const monthlyDiscountFlag = (discountTypeValue, discountAmountValue) => {
    setFormData({
      ...formData,
      monthly_discount_type: discountTypeValue,
      monthly_discount_amount: discountAmountValue,
    });
    setData({
      ...data,
      monthly_discount_type: discountTypeValue,
      monthly_discount_amount: discountAmountValue,
    });
  };
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
        oneTimeDiscountFlag(
          event.target.value,
          setDefaultAmount(event.target.value),
        );
      }
      if (discountFlag === 'monthly') {
        monthlyDiscountFlag(
          event.target.value,
          setDefaultAmount(event.target.value),
        );
      }
    } else if (event.target.value === 'none') {
      setShowAmountInput(false);
      if (discountFlag === 'one-time') {
        oneTimeDiscountFlag(null, null);
      }
      if (discountFlag === 'monthly') {
        monthlyDiscountFlag(null, null);
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
        setDetails(res.data);
      }
      if (res && res.status === 400) {
        setShowDiscountModal(true);
        setApiError(res && res.data);
      }
    });
  };

  const onSubmit = () => {
    if (discountFlag === 'one-time') {
      if (!oneTimeDiscountType) {
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
      if (!monthlyDiscountType) {
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
      if (oneTimeDiscountType === type) {
        return true;
      }
      if (
        (oneTimeDiscountType === '' || oneTimeDiscountType === null) &&
        type === 'none'
      ) {
        return true;
      }
    }
    if (discountFlag === 'monthly') {
      if (monthlyDiscountType === type) {
        return true;
      }
      if (
        (monthlyDiscountType === '' || monthlyDiscountType === null) &&
        type === 'none'
      ) {
        return true;
      }
    }
    return false;
  };
  const handleNumerFormat = (placeholder, type) => {
    return (
      <NumberFormat
        name="amount"
        className="form-control modal-input-control"
        placeholder={placeholder}
        onChange={(event) => handleInputChange(event)}
        defaultValue={setDefaultAmount(selectedDiscountType)}
        thousandSeparator
        allowNegative={false}
        isAllowed={(values) => {
          if (type === 'percentage') {
            const { formattedValue, floatValue } = values;
            if (floatValue == null) {
              return formattedValue === '';
            }
            return floatValue <= 100;
          }
          return values;
        }}
      />
    );
  };
  const handleModalRadioCheck = (id, inputValue, Title, unit) => {
    return (
      <li>
        <ModalRadioCheck>
          <label className="radio-container customer-list" htmlFor={id}>
            <input
              type="radio"
              id={id}
              name="discount"
              value={inputValue}
              onChange={(event) => {
                handleInputChange(event);
              }}
              defaultChecked={setDefaultValue(inputValue)}
            />
            <span className="checkmark checkmark-customer-list" />
            {Title} {unit !== '' ? `(${unit})` : ''}
          </label>
        </ModalRadioCheck>
      </li>
    );
  };
  const handleSelectedDiscountType = (discountType) => {
    return selectedDiscountType === discountType ||
      (discountFlag === 'monthly' && monthlyDiscountType === discountType) ||
      (discountFlag === 'one-time' && oneTimeDiscountType === discountType) ? (
      discountType === 'percentage' ? (
        <span className="input-icon end">%</span>
      ) : (
        <span className="input-icon">$</span>
      )
    ) : (
      ''
    );
  };
  const displayErrorMsg = (apiErrorDiscountType) => {
    return apiErrorDiscountType
      ? `${apiErrorDiscountType} (if additional services are newly added, Please save the changes)`
      : '';
  };
  const handleErrorMsg = () => {
    return (
      <ErrorMsg>
        {displayErrorMsg(apiError?.monthly_discount_amount)}
        {displayErrorMsg(apiError?.one_time_discount_amount)}
      </ErrorMsg>
    );
  };
  return (
    <div className="modal-body ">
      <h4 className="on-boarding mb-4">Apply Discount</h4>
      <div className="body-content">
        <ul className="apply-discount mb-2">
          {handleModalRadioCheck('none', 'none', 'None', '')}
          {handleModalRadioCheck(
            'fixedAmount',
            'fixed amount',
            'Fixed Amount',
            '$',
          )}
          {handleModalRadioCheck('percentage', 'percentage', 'Percentage', '%')}
        </ul>
        {selectedDiscountType === 'fixed amount' ? (
          <>
            {showAmountInput ? (
              <InputFormField className="mt-4">
                <label className="modal-field " htmlFor="emailAddress">
                  Amount
                  <div className="input-container">
                    {handleSelectedDiscountType('fixed amount')}
                    {handleNumerFormat('Enter Amount')}
                  </div>
                </label>
                {handleErrorMsg()}
              </InputFormField>
            ) : (
              ''
            )}
          </>
        ) : (
          <>
            {showAmountInput ? (
              <InputFormField className="mt-4">
                <label className="modal-field " htmlFor="emailAddress">
                  Amount
                  <div className="input-container">
                    {handleNumerFormat('Enter Percentage', 'percentage')}
                    {handleSelectedDiscountType('percentage')}
                  </div>
                </label>
                {handleErrorMsg()}
              </InputFormField>
            ) : (
              ''
            )}
          </>
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
  setDetails: () => {},
};
Discount.propTypes = {
  discountFlag: string,
  agreementData: shape({
    id: string,
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
    one_time_discount_type: oneOfType([string, number]),
    one_time_discount_amount: oneOfType([string, number]),
  }),
  setShowDiscountModal: func,
  formData: shape({
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
    one_time_discount_type: oneOfType([string, number]),
    one_time_discount_amount: oneOfType([string, number]),
  }),
  setFormData: func,
  setDetails: func,
};
export default Discount;
