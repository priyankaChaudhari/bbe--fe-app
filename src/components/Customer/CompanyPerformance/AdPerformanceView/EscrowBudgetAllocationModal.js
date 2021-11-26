import React, { useState, useCallback, useEffect } from 'react';

import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { bool, func, shape, string } from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import Theme from '../../../../theme/Theme';
import { storeAllocatedBudget } from '../../../../api';
import { CloseIcon, AddIcons, InfoRedIcon } from '../../../../theme/images';
import {
  ModalBox,
  Button,
  InputFormField,
  PageLoader,
  AllocateBar,
  ErrorMsgBox,
} from '../../../../common';

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
  dspData,
  addThousandSeperator,
  isOpen,
  onClick,
  customerId,
  marketplace,
}) {
  const dspPacing = dspData?.dsp_pacing;
  const escrowBalance = dspPacing?.escrow_converted_usd;
  const actualAllocatedMonths = dspPacing?.allocated_balance.length
    ? dspPacing?.allocated_balance
    : [
        {
          month_year: dayjs(new Date()).format('YYYY-MM'),
          escrow_allocated_converted_usd: addThousandSeperator(escrowBalance),
        },
      ];
  const [allocatedMonths, setAllocatedMonths] = useState(actualAllocatedMonths);
  const [isSubmitLoader, setIsSubmitLoader] = useState(false);
  const [isEscrowbalanceExceed, setIsEscrowbalanceExceed] = useState(
    escrowBalance < 0,
  );

  useEffect(() => {}, []);

  const submitAllocatedBudget = useCallback(() => {
    setIsSubmitLoader(true);
    storeAllocatedBudget(allocatedMonths, customerId, marketplace).then(
      (res) => {
        if (res && res.status === 200) {
          onClick();
        }
        setIsSubmitLoader(false);
        onClick();
      },
    );
  }, [onClick, customerId, marketplace, allocatedMonths]);

  const calculateSumOfFutureMonths = (newValues) => {
    const sumAll = newValues
      .map((item, index) => index !== 0 && item.escrow_allocated_converted_usd)
      .reduce((prev, curr) => Number(prev) + Number(curr), 0);
    return sumAll;
  };

  const handleOnChange = (event, index) => {
    const tempData = [...allocatedMonths];
    tempData[index].escrow_allocated_converted_usd = event.target.value.replace(
      /,/g,
      '',
    );
    const sumOfFutureMonths = calculateSumOfFutureMonths(tempData);
    const currentMonthAmount = escrowBalance - sumOfFutureMonths;
    tempData[0].escrow_allocated_converted_usd = String(currentMonthAmount);
    if (currentMonthAmount < 0) setIsEscrowbalanceExceed(true);
    else setIsEscrowbalanceExceed(false);
    setAllocatedMonths(tempData);
  };

  const renderMonths = () => {
    return allocatedMonths.map((item, index) => {
      return (
        <>
          <div className="col-md-6 col-12 " key={item.month_year}>
            <InputFormField className="mt-1 hide-spinner">
              <label htmlFor="emailAddress">
                Month
                <br />
                <input
                  className="form-control "
                  value={dayjs(item.month_year).format('MMMM')}
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
                className={!index ? 'mt-1 disabled' : 'mt-1'}
                name={item.month_year}
                defaultValue={item.escrow_allocated_converted_usd}
                value={item.escrow_allocated_converted_usd}
                placeholder={0}
                onChange={(event) => handleOnChange(event, index)}
                thousandSeparator
                decimalScale={2}
                allowNegative={!index}
              />
            </InputNumberFormat>
          </div>
        </>
      );
    });
  };

  const handleOnAddAnotherMonth = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + allocatedMonths.length);
    setAllocatedMonths([
      ...allocatedMonths,
      {
        month_year: dayjs(nextMonth).format('YYYY-MM'),
        escrow_allocated_converted_usd: '',
      },
    ]);
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
                    {addThousandSeperator(escrowBalance)}
                  </div>
                  <div className="clear-fix" />
                </AllocateBar>
              </div>
              {renderMonths()}
              <div className="col-12">
                <Button
                  style={{ textTransform: 'uppercase' }}
                  className={
                    allocatedMonths.length > 6 || escrowBalance < 0
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
                  <img className="info-icon" src={InfoRedIcon} alt="info" /> All
                  budges across the selected months need to add up to the
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
                  ? 'btn-primary on-boarding  w-100'
                  : 'btn-primary on-boarding  w-100'
              }
              onClick={() => submitAllocatedBudget()}
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
    </Modal>
  );
}

EscrowBudgetAllocationModal.defaultProps = {
  id: '',
  customerId: '',
  marketplace: '',
  isOpen: false,
  dspData: {},
  onClick: () => {},
  addThousandSeperator: () => {},
};

EscrowBudgetAllocationModal.propTypes = {
  id: string,
  customerId: string,
  marketplace: string,
  isOpen: bool,
  dspData: shape({}),
  onClick: func,
  addThousandSeperator: func,
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
