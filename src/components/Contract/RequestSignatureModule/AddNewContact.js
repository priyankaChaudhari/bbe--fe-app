import React from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { string, func, shape } from 'prop-types';

import { LeftArrowIcon } from '../../../theme/images';
import { getContactDetails } from '../../../store/actions/customerState';
import { ErrorMsg, InputFormField } from '../../../common';
import { createContactInfo, updateContactInfo } from '../../../api';

function AddNewContact({
  setParams,
  formData,
  renderbuttonHtml,
  contactModalName,
  setFormData,
  setContactApiError,
  contactApiError,
  setIsLoading,
  setSelectedContact,
  selectedContact,
}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const contactFields = [
    {
      key: 'first_name',
      type: 'text',
      placeholder: 'First Name',
      classname: 'col-6 ',
    },
    {
      key: 'last_name',
      type: 'text',
      placeholder: 'Last Name',
      classname: 'col-6 ',
    },
    {
      key: 'role',
      type: 'text',
      placeholder: 'Role',
      classname: 'col-12',
    },
    {
      key: 'email',
      type: 'email',
      placeholder: 'Email',
      classname: 'col-6',
    },
    {
      key: 'phone_number',
      type: 'text',
      placeholder: 'Phone Number',
      classname: 'col-6',
    },
  ];

  const handleContactChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setContactApiError({
      ...contactApiError,
      [event.target.name]: '',
      non_field_errors: '',
    });
  };

  const displayAddNewContactForm = () => {
    return contactFields.map((field) => {
      return (
        <div className={field.classname}>
          <InputFormField className=" mb-3">
            <label htmlFor={field.key}>
              {field.placeholder}
              <input
                id={field.key}
                className="form-control"
                type={field.type}
                placeholder={field.placeholder}
                name={field.key}
                defaultValue={formData[field.key]}
                onChange={(event) => handleContactChange(event, field)}
              />
            </label>
            <ErrorMsg>
              {contactApiError &&
                contactApiError[field.key] &&
                contactApiError[field.key][0]}
              {contactApiError?.non_field_errors &&
                field.key === 'email' &&
                contactApiError.non_field_errors[0]}
            </ErrorMsg>
          </InputFormField>
        </div>
      );
    });
  };

  const saveContact = (info) => {
    if (info) {
      setFormData(info);
      setParams('add-new-contact');
      setIsLoading({ loader: true, type: 'button' });

      updateContactInfo(info && info.id, formData).then((res) => {
        setIsLoading({ loader: false, type: 'button' });
        if (res?.status === 400) {
          setContactApiError(res?.data);
        }
        if (res?.status === 200) {
          if (selectedContact?.id === res?.data?.id) {
            setSelectedContact(res?.data);
          }
          dispatch(getContactDetails(id));
          setParams('select-contact');
        }
      });
    } else {
      setFormData({ ...formData, customer: id });
      setIsLoading({ loader: true, type: 'button' });
      createContactInfo({ ...formData, customer: id }).then(
        (responseContact) => {
          setIsLoading({ loader: false, type: 'button' });
          if (responseContact?.status === 201) {
            dispatch(getContactDetails(id));
            setParams('select-contact');
          }
          if (responseContact?.status === 400) {
            setContactApiError(responseContact?.data);
          }
        },
      );
    }
  };

  return (
    <div className="modal-body on-boarding">
      <h4
        className="on-boarding mb-4"
        role="presentation"
        onClick={() => setParams('select-contact')}>
        <img className="modal-back-arrow" src={LeftArrowIcon} alt="" />
        {contactModalName}
      </h4>
      <div className="body-content">
        <div className="row">{displayAddNewContactForm()}</div>
      </div>
      {formData && formData.id ? (
        <div className="mt-4" role="presentation">
          {renderbuttonHtml(
            !(formData.first_name && formData.last_name && formData.email),
            () => saveContact(formData),
            'Save Contact',
          )}
        </div>
      ) : (
        <div className=" mt-4" role="presentation">
          {renderbuttonHtml(
            !(formData.first_name && formData.last_name && formData.email),
            () => saveContact(),
            'Add Contact',
          )}
        </div>
      )}
    </div>
  );
}

export default AddNewContact;

AddNewContact.defaultProps = {
  setParams: () => {},
  formData: {},
  renderbuttonHtml: () => {},
  contactModalName: '',
  setFormData: () => {},
  setContactApiError: () => {},
  contactApiError: {},
  setIsLoading: () => {},
  setSelectedContact: () => {},
  selectedContact: {},
};

AddNewContact.propTypes = {
  setParams: func,
  formData: shape({
    id: string,
    first_name: string,
    last_name: string,
    email: string,
  }),
  renderbuttonHtml: func,
  contactModalName: string,
  setFormData: func,
  setContactApiError: func,
  contactApiError: shape({}),
  setIsLoading: func,
  setSelectedContact: func,
  selectedContact: shape({}),
};
