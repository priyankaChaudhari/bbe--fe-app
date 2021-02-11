import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import NumberFormat from 'react-number-format';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

import {
  getCategories,
  getCountry,
  updateAccountDetails,
  updateCustomerDetails,
} from '../../api';

import { Button, FormField, PageLoader } from '../../common';
import InputSelect from '../../common/InputSelect';
import { editAccountFields } from '../../constants/FieldConstants';
import { SortDownIcon } from '../../theme/images';
import { getCustomerDetails } from '../../store/actions/customerState';
import { getAccountDetails } from '../../store/actions/accountState';
import CropUploadImage from '../../common/CropUploadImage';

export default function EditAccountDetails({
  customer,
  agreement,
  setShowModal,
  setDocumentImage,
}) {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({});
  const [apiError, setApiError] = useState({});
  const [showBtn, setShowBtn] = useState(false);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });

  const CustomDropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <img src={SortDownIcon} alt="sort" style={{ width: '78%' }} />
      </components.DropdownIndicator>
    );
  };

  useEffect(() => {
    getCountry().then((response) => {
      setCountries(response.data);
    });
    getCategories().then((category) => {
      setCategories(category.data);
    });
  }, []);

  const handleSelectChange = (event, key) => {
    setShowBtn(true);
    setFormData({ ...formData, [key]: event.value });

    setApiError({
      ...apiError,
      [key]: '',
    });
  };

  const generateDropdown = (item) => {
    return (
      <Select
        classNamePrefix="react-select"
        options={item.key === 'country' ? countries : categories}
        styles={{
          option: (provided, state) => {
            return {
              ...provided,
              color: state.isSelected ? '#FF5933' : '#2E384D',
              background: 'white',

              ':hover': {
                background: '#F9FAFF',
                cursor: 'pointer',
              },
            };
          },
        }}
        name={item.key}
        onChange={(event) => handleSelectChange(event, item.key)}
        defaultValue={
          item.level === 'agreement'
            ? agreement && agreement[item.key]
            : customer && customer[item.key]
        }
        components={{ DropdownIndicator: CustomDropdownIndicator }}
      />
    );
  };

  const handleChange = (event, key) => {
    setShowBtn(true);
    if (key === 'annual_revenue') {
      setFormData({
        ...formData,
        [key]: event.target.value.substring(1).replace(/,/g, ''),
      });
    } else if (key === 'number_of_employees') {
      setFormData({
        ...formData,
        [key]: event.target.value.substring(0).replace(/,/g, ''),
      });
    } else {
      setFormData({ ...formData, [key]: event.target.value });
    }
    setApiError({
      ...apiError,
      [event.target.name]: '',
    });
  };

  console.log(formData);

  const generateNumberFormat = (item) => {
    return (
      <NumberFormat
        format={item.key === 'zip_code' ? '##########' : null}
        name={item.key}
        className="form-control"
        defaultValue={
          item.level === 'agreement'
            ? agreement && agreement[item.key]
            : customer && customer[item.key]
        }
        placeholder={item.label}
        prefix={item.type === 'number-currency' ? '$' : ''}
        onChange={(event) => handleChange(event, item.key)}
        thousandSeparator={item.key !== 'zip_code'}
      />
    );
  };

  const saveData = () => {
    setIsLoading({ loader: true, type: 'button' });

    if (
      formData &&
      (formData.city ||
        formData.address ||
        formData.state ||
        formData.zip_code ||
        formData.contract_company_name)
    ) {
      updateAccountDetails(agreement.id, formData).then((res) => {
        if (res && res.status === 400) {
          setIsLoading({ loader: false, type: 'button' });

          setApiError(res && res.data);
          setShowModal(true);
        } else if (res && res.status === 200) {
          setIsLoading({ loader: false, type: 'button' });

          dispatch(getAccountDetails(customer.id));
          dispatch(getCustomerDetails(customer.id));
          // setShowSuccessMsg({ show: true, message: 'Changes Saved!' });
          setShowModal(false);
        }
      });
    }

    updateCustomerDetails(customer.id, formData).then((response) => {
      if (response && response.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
        setApiError(response && response.data);
        setShowModal(true);
      } else if (response && response.status === 200) {
        setIsLoading({ loader: false, type: 'button' });
        dispatch(getCustomerDetails(customer.id));
        // setShowSuccessMsg({ show: true, message: 'Changes Saved!' });
        setShowModal(false);
      }
    });
  };

  return (
    <div>
      {' '}
      <div className="modal-body">
        <h4>Edit Company Details</h4>
        <div className="body-content mt-2">
          <div className="row">
            {/* <img
                className="edit-profile-picture"
                src={EditIcons}
                alt="edit"
              /> */}
            <CropUploadImage
              type="customer"
              id={customer.id}
              setDocumentImage={setDocumentImage}
            />

            {editAccountFields.map((item) => (
              <div className={item.property} key={item.key}>
                <FormField className="mt-3">
                  <label htmlFor="emailAddress">
                    {item.label}
                    <br />
                    {item.type === 'choice' ? (
                      <InputSelect>{generateDropdown(item)}</InputSelect>
                    ) : item && item.type.includes('number') ? (
                      <>{generateNumberFormat(item)}</>
                    ) : (
                      <input
                        className="form-control"
                        type="text"
                        placeholder={item.label}
                        defaultValue={
                          item.level === 'agreement'
                            ? agreement && agreement[item.key]
                            : customer && customer[item.key]
                        }
                        onChange={(event) => handleChange(event, item.key)}
                      />
                    )}
                  </label>
                </FormField>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showBtn ? (
        <>
          <div className="footer-line " />
          <div className=" col-12  modal-footer">
            <Button className=" btn-primary mr-4" onClick={() => saveData()}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              className=" btn-borderless"
              onClick={() => setShowModal(false)}>
              Discard Changes
            </Button>
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

EditAccountDetails.defaultProps = {
  id: '',
  agreement: {},
  setDocumentImage: [],
};

EditAccountDetails.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  id: PropTypes.string,
  customer: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  agreement: PropTypes.shape({
    id: PropTypes.string,
  }),
  setDocumentImage: PropTypes.arrayOf(PropTypes.object),
};
