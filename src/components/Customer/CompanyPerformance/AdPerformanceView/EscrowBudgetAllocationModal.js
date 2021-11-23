import React, { useState, useEffect, useCallback } from 'react';

import Modal from 'react-modal';
import { bool, func, string } from 'prop-types';

import { getAllocatedMonths } from '../../../../api';
import {
  ModalBox,
  Button,
  InputFormField,
  PageLoader,
} from '../../../../common';
import { CloseIcon, AddIcons } from '../../../../theme/images';

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
  onApply,
}) {
  const [actualAllocatedMonths, setActualAllocatedMonths] = useState([
    { name: 'November', amount: '18000', label: 'current' },
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

  useEffect(() => {
    getAllocatedMonth();
  }, [getAllocatedMonth]);

  const handleOnChange = (event, index) => {
    const tempData = [...allocatedMonths];
    tempData[index].amount = event.target.value;
    setAllocatedMonths(tempData);
  };

  const renderMonths = () => {
    return allocatedMonths.map((item, index) => {
      return (
        <>
          <div className="col-6">
            <InputFormField className="mt-3">
              <label htmlFor="emailAddress">
                Month
                <br />
                <input className="form-control" value={item.name} type="text" />
              </label>
            </InputFormField>
          </div>
          <div className="col-6">
            {' '}
            <InputFormField className="mt-3">
              <label
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
              </label>
            </InputFormField>
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
          <div className="modal-body pb-0">
            <h4>Allocate Balance</h4>
            <div className="row">
              {renderMonths()}

              <Button
                style={{ textTransform: 'uppercase' }}
                className={
                  allocatedMonths.length > 6
                    ? 'btn-add-contact mt-3 disabled'
                    : 'btn-add-contact mt-3'
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
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="text-center ">
              <Button
                className="btn-primary on-boarding  w-100"
                onClick={onApply}
                type="button">
                Confirm
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
  onApply: () => {},
};

EscrowBudgetAllocationModal.propTypes = {
  id: string,
  onClick: func,
  onApply: func,
  isOpen: bool,
};
