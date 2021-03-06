import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import DatePicker from 'react-date-picker';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { func, string, shape } from 'prop-types';

import { updateCustomerDetails } from '../../../api';
import { RightArrowIcon } from '../../../theme/images';
import { getCustomerDetails } from '../../../store/actions/customerState';
import { Button, ModalBox, FormField, PageLoader } from '../../../common';

export default function CustomerStatus({ type, setStatusModal, customer }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [startDate, setStartDate] = useState(new Date());
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (
      customer &&
      customer.status &&
      customer.status.value === 'pending cancellation' &&
      type === 'inactive'
    ) {
      setStartDate(
        customer && customer.end_date && new Date(customer.end_date),
      );
    }
  }, [customer, type]);

  const generateText = () => {
    if (type === 'inactive') {
      return "You're about to set this account to Inactive. Please, select the last day of service and add a note on why the account is being inactivated.";
    }
    if (type === 'at risk') {
      return 'You’re about to set this account to At Risk. The account will remain active, but highlighted as being at risk. Please add a note on why the account is being placed in At Risk status.';
    }
    if (type === 'active') {
      return 'You’re about to set this account to Active. Please add a note on why the account is being placed in active status.';
    }
    return '';
  };

  const handleChange = (event, field) => {
    if (field === 'end_date') {
      setStartDate(event);
      setFormData({ ...formData, [field]: event });
    } else {
      setFormData({ ...formData, [field]: event.target.value });
    }
  };

  const saveStatus = () => {
    if (formData && formData.end_date) {
      formData.end_date = dayjs(formData.end_date).format('YYYY-MM-DD');
    }

    const checkStatus = () => {
      if (formData.end_date >= dayjs(new Date()).format('YYYY-MM-DD')) {
        return 'pending cancellation';
      }
      return 'inactive';
    };

    setIsLoading({ loader: true, type: 'button' });

    updateCustomerDetails(customer.id, {
      status: type === 'inactive' ? checkStatus() : type,
      note: formData && formData.note,
      end_date: formData && formData.end_date,
    }).then((response) => {
      if (response && response.status === 200) {
        toast.success('Status Updated!');
        dispatch(getCustomerDetails(customer.id));
        setStatusModal({ show: false, type });
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <ModalBox>
      <div className="modal-body">
        <h4>
          Account Status
          <img src={RightArrowIcon} alt="" className="arrow-right" />
          {type}
        </h4>
        <p>{generateText()}</p>

        {type === 'inactive' ? (
          <FormField className="mt-3">
            <label htmlFor="date">
              Select Date
              <br />
              <DatePicker
                minDate={new Date()}
                className="form-control"
                id="date"
                value={
                  startDate ||
                  (customer && customer.end_date && new Date(customer.end_date))
                }
                onChange={(date) => handleChange(date, 'end_date')}
                format="MM-dd-yyyy"
                clearIcon={null}
              />
            </label>
          </FormField>
        ) : (
          ''
        )}

        <FormField className="mt-3">
          <label htmlFor="note">
            Add Note
            <br />
            <textarea
              className="form-control text-area"
              rows="3"
              placeholder="Add a note"
              onChange={(date) => handleChange(date, 'note')}
              defaultValue={
                customer && customer.status && customer.status.value === type
                  ? customer && customer.note
                  : customer &&
                    customer.status &&
                    customer.status.value === 'pending cancellation' &&
                    type === 'inactive'
                  ? customer && customer.note
                  : null
              }
            />
          </label>
        </FormField>
      </div>
      <div className=" col-12 modal-footer">
        <Button className="btn-primary mr-3" onClick={() => saveStatus()}>
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            'Confirm'
          )}
        </Button>
        <Button
          type="button"
          className="btn-transparent w-25"
          onClick={() => setStatusModal(false)}>
          Cancel
        </Button>
      </div>
    </ModalBox>
  );
}

CustomerStatus.defaultProps = {
  type: '',
};

CustomerStatus.propTypes = {
  type: string,
  setStatusModal: func.isRequired,
  customer: shape({
    id: string,
    note: string,
    end_date: string,
    status: shape({
      value: string,
    }),
  }).isRequired,
};
