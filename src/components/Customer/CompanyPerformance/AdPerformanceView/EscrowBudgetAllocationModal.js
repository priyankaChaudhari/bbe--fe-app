import React, { useState, useEffect, useCallback } from 'react';

import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { bool, func, string } from 'prop-types';
import styled from 'styled-components';
import Theme from '../../../../theme/Theme';

import { getAllocatedMonths, storeAllocatedBudget } from '../../../../api';
import {
  ModalBox,
  Button,
  InputFormField,
  PageLoader,
  AllocateBar,
  ErrorMsgBox,
} from '../../../../common';

import { CloseIcon, AddIcons, InfoRedIcon } from '../../../../theme/images';

const todaysDate = new Date();
todaysDate.setDate(todaysDate.getDate() - 2);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '518px ',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function EscrowBudgetAllocationModal({
  id,
  isOpen,
  onClick,
  // onApply,
}) {
  const [actualAllocatedMonths, setActualAllocatedMonths] = useState([
    { name: 'November', amount: '24000', label: 'current' },
  ]);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const [allocatedMonths, setAllocatedMonths] = useState(actualAllocatedMonths);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoader, setIsSubmitLoader] = useState(false);
  const [isEscrowbalanceExceed, setIsEscrowbalanceExceed] = useState(false);

  const getAllocatedMonth = useCallback(() => {
    setIsLoading(true);
    getAllocatedMonths().then((res) => {
      if (res && res.status === 400) {
        setIsLoading(false);
      }
      if (res && res.status === 200) {
        if (res.data && res.data) {
          setActualAllocatedMonths(res.data);
        } else {
          setActualAllocatedMonths([]);
        }
        setIsLoading(false);
      }
      setIsLoading(false);
    });
  }, []);

  const submitAllocatedBudget = useCallback(
    (data) => {
      setIsSubmitLoader(true);
      storeAllocatedBudget(data).then((res) => {
        if (res && res.status === 200) {
          onClick();
        }
        setIsSubmitLoader(false);
        onClick();
      });
    },
    [onClick],
  );

  useEffect(() => {
    getAllocatedMonth();
  }, [getAllocatedMonth]);

  const calculateSumOfFutureMonths = (newValues) => {
    const sumAll = newValues
      .map((item, index) => index !== 0 && item.amount)
      .reduce((prev, curr) => Number(prev) + Number(curr), 0);
    return sumAll;
  };

  const handleOnChange = (event, index) => {
    const tempData = [...allocatedMonths];
    const escrowBalance = 24000;
    tempData[index].amount = event.target.value.replace(/,/g, '');
    const sumOfFutureMonths = calculateSumOfFutureMonths(tempData);
    const currentMonthAmount = escrowBalance - sumOfFutureMonths;
    tempData[0].amount = String(currentMonthAmount);
    if (currentMonthAmount < 0) setIsEscrowbalanceExceed(true);
    else setIsEscrowbalanceExceed(false);
    setAllocatedMonths(tempData);
  };

  const renderMonths = () => {
    return allocatedMonths.map((item, index) => {
      return (
        <>
          <div className="col-md-6 col-12 " key={item.name}>
            <InputFormField className="mt-1 hide-spinner">
              <label htmlFor="emailAddress">
                Month
                <br />
                <input
                  className="form-control "
                  value={item.name}
                  type="text"
                  readOnly
                />
              </label>
            </InputFormField>
          </div>
          <div className="col-md-6 col-12 mt-1 mb-3">
            <label className="label-heading" htmlFor="emailAddress">
              Month
            </label>
            <br />
            <InputNumberFormat>
              <NumberFormat
                className={item.label === 'current' ? 'mt-1 disabled' : 'mt-1'}
                name={item.name}
                defaultValue={item.amount}
                value={item.amount}
                placeholder={0}
                onChange={(event) => handleOnChange(event, index)}
                thousandSeparator
                decimalScale={2}
                allowNegative={item.label === 'current'}
              />
            </InputNumberFormat>
            {/* <label
              className={
                item.label === 'current'
                  ? 'modal-field disabled'
                  : 'modal-field'
              }
              htmlFor="emailAddress">
              Amount
              <div className="input-container">
                <span className="input-icon">$</span>
                <input
                  type="number"
                  name={item.name}
                  placeholder="0"
                  className="form-control"
                  value={item.amount}
                  onChange={(event) => handleOnChange(event, index)}
                />
              </div>
            </label> */}
          </div>
        </>
      );
    });
  };

  const handleOnAddAnotherMonth = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + allocatedMonths.length);
    setAllocatedMonths([
      ...allocatedMonths,
      {
        name: monthNames[d.getMonth()],
        amount: '',
        label: '',
      },
    ]);
  };

  const onHandleConfirm = () => {
    submitAllocatedBudget();
  };

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      style={{ ...customStyles }}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={() => {
          onClick();
          setAllocatedMonths(actualAllocatedMonths);
        }}
        role="presentation"
      />
      {isLoading ? (
        <PageLoader
          component="performance-graph"
          color="#FF5933"
          type="detail"
          width={40}
          height={40}
        />
      ) : (
        <ModalBox>
          <div className="modal-body escrow pb-0">
            <h4>Allocate Balance</h4>
            <div className="body-content">
              <div className="row">
                <div className="col-12">
                  <AllocateBar className="mt-3 mb-3">
                    {' '}
                    <div className="remaing-label text-bold text-right">
                      Escrow Balance
                    </div>{' '}
                    <div className="remaing-label text-bold float-right">
                      $24000
                    </div>
                    <div className="clear-fix" />
                  </AllocateBar>
                </div>
                {renderMonths()}
                <div className="col-12">
                  <Button
                    style={{ textTransform: 'uppercase' }}
                    className={
                      allocatedMonths.length > 6
                        ? 'btn-add-contact  disabled'
                        : 'btn-add-contact '
                    }
                    onClick={() => handleOnAddAnotherMonth()}>
                    {' '}
                    <img
                      width="14px"
                      style={{ verticalAlign: 'middle' }}
                      src={AddIcons}
                      className="ml-1 add-icon"
                      alt="add"
                    />{' '}
                    Add another Month
                  </Button>
                </div>
                {isEscrowbalanceExceed ? (
                  <ErrorMsgBox className="mt-2">
                    <img className="info-icon" src={InfoRedIcon} alt="info" />{' '}
                    All budges across the selected months need to add up to the
                    available escrow balance
                  </ErrorMsgBox>
                ) : null}
              </div>
            </div>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="text-center ">
              <Button
                className={
                  isEscrowbalanceExceed
                    ? 'btn-primary on-boarding  w-100 disabled'
                    : 'btn-primary on-boarding  w-100'
                }
                onClick={() => onHandleConfirm()}
                type="button">
                {isSubmitLoader ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        </ModalBox>
      )}
    </Modal>
  );
}

EscrowBudgetAllocationModal.defaultProps = {
  id: '',
  isOpen: false,
  onClick: () => {},
  // onApply: () => {},
};

EscrowBudgetAllocationModal.propTypes = {
  id: string,
  onClick: func,
  // onApply: func,
  isOpen: bool,
};

const InputNumberFormat = styled.div`
  position: relative;
  color: ${Theme.gray85};
  border: 1px solid ${Theme.gray45};
  border-radius: 2px;
  padding: 5px 10px;
  display: block;
  width: 100%;
  height: 40px;
  background-color: ${Theme.gray8};
  margin-top: 7px;
  font-family: ${Theme.baseFontFamily};
  font-size: ${Theme.extraNormal};

  input {
    border: none;
    background-color: ${Theme.gray8};

    &:focus {
      outline: none;
    }
  }
`;
