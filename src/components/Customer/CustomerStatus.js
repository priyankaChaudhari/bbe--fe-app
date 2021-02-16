/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import DatePicker from 'react-date-picker';

import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Button, ModalBox, FormField, PageLoader } from '../../common';
import { RightArrowIcon } from '../../theme/images/index';
import { updateAccountDetails, updateCustomerDetails } from '../../api/index';
import { getCustomerDetails } from '../../store/actions/customerState';

export default function CustomerStatus({
  type,
  setStatusModal,
  id,
  status,
  setShowSuccessMsg,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [startDate, setStartDate] = useState(new Date());
  const [formData, setFormData] = useState({});
  const contract = useSelector((state) => state.accountState.data);

  useEffect(() => {
    // dispatch(getAccountDetails(id));
    setShowSuccessMsg({
      show: false,
    });
  }, [setShowSuccessMsg]);

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
    updateCustomerDetails(id, {
      status: type === 'inactive' ? checkStatus() : type,
    }).then((response) => {
      if (response && response.status === 200) {
        dispatch(getCustomerDetails(id));
        setStatusModal({ show: false, type });
        setShowSuccessMsg({
          show: true,
          message: 'Account status Changed.',
        });
        setIsLoading({ loader: false, type: 'button' });
      }
      if (formData && Object.keys(formData).length !== 0) {
        updateAccountDetails(contract.id, formData).then((res) => {
          if (res && res.status === 200) {
            setStatusModal({ show: false, type });
            setIsLoading({ loader: false, type: 'button' });
          }
        });
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
                className="form-control"
                id="date"
                value={
                  startDate ||
                  (contract && contract.end_date && new Date(contract.end_date))
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
              defaultValue={status === type ? contract && contract.note : null}
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
  id: '',
  status: '',
  setShowSuccessMsg: () => {},
};

CustomerStatus.propTypes = {
  type: PropTypes.string,
  setStatusModal: PropTypes.func.isRequired,
  id: PropTypes.string,
  status: PropTypes.string,
  setShowSuccessMsg: PropTypes.func,
};
