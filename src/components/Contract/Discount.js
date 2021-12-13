/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import NumberFormat from 'react-number-format';
import { string, number, func, oneOfType, shape, arrayOf } from 'prop-types';

import { saveDiscount } from '../../api';
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
  selectedDiscount,
  getDiscountData,
  updatedFormData,
  setIsEditContract,
}) {
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState('none');
  const [enteredAmount, setAmount] = useState(null);

  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });

  useEffect(() => {
    if (selectedDiscount?.length && selectedDiscount[0]?.id) {
      if (selectedDiscount?.[0]?.type) {
        setShowAmountInput(true);
      }
      setSelectedDiscountType(selectedDiscount[0]?.type);
      // setAmount(selectedDiscount[0]?.amount);
    }
  }, []);

  const onSubmit = () => {
    setIsLoading({ loader: true, type: 'button' });

    if (discountFlag.serviceType === 'one time service') {
      const postData = {
        contract: agreementData?.id,
        account_type: '',
        service_type: 'one time service',
        type: selectedDiscountType === 'none' ? null : selectedDiscountType,
        amount: enteredAmount,
      };
      if (selectedDiscount?.length && selectedDiscount[0]?.id) {
        saveDiscount(selectedDiscount[0]?.id, postData).then((res) => {
          setIsLoading({ loader: false, type: 'button' });
          if (res?.status === 200 || res?.status === 201) {
            getDiscountData(agreementData.id);
            setShowDiscountModal(false);
            if (!Object.keys(updatedFormData).length) {
              setIsEditContract(false);
            }
          }
          if (res?.status === 400) {
            setApiError(res?.data);
          }
        });
      } else {
        saveDiscount(null, postData).then((res) => {
          setIsLoading({ loader: false, type: 'button' });

          if (res?.status === 200 || res?.status === 201) {
            getDiscountData(agreementData.id);
            setShowDiscountModal(false);
            if (!Object.keys(updatedFormData).length) {
              setIsEditContract(false);
            }
          }
          if (res?.status === 400) {
            setApiError(res?.data);
          }
        });
      }
    }
    if (discountFlag.serviceType === 'monthly service') {
      const postData = {
        contract: agreementData?.id,
        account_type: discountFlag.accountType,
        service_type: 'monthly service',
        type: selectedDiscountType === 'none' ? null : selectedDiscountType,
        amount: enteredAmount,
      };

      if (selectedDiscount?.length && selectedDiscount[0]?.id) {
        saveDiscount(selectedDiscount[0]?.id, postData).then((res) => {
          setIsLoading({ loader: false, type: 'button' });
          if (res?.status === 200 || res?.status === 201) {
            getDiscountData(agreementData.id);
            setShowDiscountModal(false);
            if (!Object.keys(updatedFormData).length) {
              setIsEditContract(false);
            }
          }
          if (res?.status === 400) {
            setApiError(res?.data);
          }
        });
      } else {
        saveDiscount(null, postData).then((res) => {
          setIsLoading({ loader: false, type: 'button' });
          if (res?.status === 200 || res?.status === 201) {
            getDiscountData(agreementData.id);
            setShowDiscountModal(false);
            if (!Object.keys(updatedFormData).length) {
              setIsEditContract(false);
            }
          }
          if (res?.status === 400) {
            setApiError(res?.data);
          }
        });
      }
    }
  };

  const handleInputChange = (event) => {
    setApiError('');
    setAmount(event.target.value.replace(/,/g, ''));
  };

  const handleSelectedDiscountType = (discountType) => {
    return discountType === 'percentage' ? (
      <span className="input-icon end">%</span>
    ) : (
      <span className="input-icon">$</span>
    );
  };

  const setDefaultValue = () => {
    return selectedDiscount?.length &&
      selectedDiscount[0]?.type === selectedDiscountType
      ? selectedDiscount?.length && selectedDiscount[0]?.amount
      : null;
  };

  const handleNumberFormat = (placeholder, type) => {
    return (
      <NumberFormat
        name="amount"
        className="form-control modal-input-control"
        placeholder={placeholder}
        onChange={(event) => handleInputChange(event)}
        defaultValue={setDefaultValue()}
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
  const handleRadioChange = (event) => {
    setApiError('');
    setSelectedDiscountType(event.target.value);

    if (event.target.value !== 'none') {
      setShowAmountInput(true);
    } else {
      setShowAmountInput(false);
    }
  };

  const displayErrorMsg = (apiErrorDiscountType) => {
    return apiErrorDiscountType
      ? `${apiErrorDiscountType} (if additional services are newly added, Please save the changes)`
      : '';
  };
  const handleErrorMsg = () => {
    return (
      <ErrorMsg>
        {displayErrorMsg(apiError?.amount)}
        {/* {displayErrorMsg(apiError?.one_time_discount_amount)} */}
      </ErrorMsg>
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
              name="discountType"
              value={inputValue}
              onClick={(event) => {
                handleRadioChange(event);
              }}
              defaultChecked={
                selectedDiscountType === inputValue ||
                (selectedDiscount?.length &&
                  selectedDiscount[0]?.type === inputValue)
              }
            />
            <span className="checkmark checkmark-customer-list" />
            {Title} {unit !== '' ? `(${unit})` : ''}
          </label>
        </ModalRadioCheck>
      </li>
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
                    {handleNumberFormat('Enter Amount')}
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
                    {handleNumberFormat('Enter Percentage', 'percentage')}
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
  selectedDiscount: [],
  getDiscountData: () => {},
  updatedFormData: {},
  setIsEditContract: () => {},
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
  selectedDiscount: arrayOf(shape({})),
  getDiscountData: func,
  updatedFormData: shape({}),
  setIsEditContract: func,
};
export default Discount;
