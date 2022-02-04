import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { bool, func, shape } from 'prop-types';

import { deleteContactInfo } from '../../../api';
import { getContactDetails } from '../../../store/actions/customerState';
import { Button, ErrorMsg, PageLoader, ModalRadioCheck } from '../../../common';
import {
  AddNewIcons,
  TrashIcons,
  EditFileIcons,
  EmailIcon,
  PhoneIcon,
} from '../../../theme/images';

function Contacts({
  isLoading,
  contactInfoLoading,
  contactInfo,
  setFormData,
  setContactApiError,
  setParams,
  setModalName,
  requestSignatureError,
  selectedContact,
  setSelectedContact,
  setIsLoading,
}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [contactDetails, setContactDetails] = useState(contactInfo);

  const onSelectContact = (info) => {
    setSelectedContact(info);
  };

  const removeContact = (index) => {
    if (index && index.includes('CT')) {
      setIsLoading({ loader: true, type: 'button' });
      deleteContactInfo(index).then(() => {
        setIsLoading({ loader: false, type: 'button' });
        dispatch(getContactDetails(id));
        if (index === selectedContact?.id) {
          setSelectedContact({});
        }
      });
    } else {
      const list = [...contactDetails];
      list.splice(index, 1);
      setContactDetails(list);
    }
  };
  const displayContact = () => {
    return contactInfo.map((info, i) => {
      return (
        <ModalRadioCheck className="gray-bg">
          <label className="radio-container" htmlFor={info.id}>
            {info.first_name} {info && info.last_name}
            <br />
            <input
              type="radio"
              checked={selectedContact.id === info.id}
              name="radio"
              id={info.id}
              onClick={() => onSelectContact(info)}
            />
            <span className="checkmark" />
          </label>
          <img
            className="delete-contact cursor"
            src={TrashIcons}
            alt="delete"
            role="presentation"
            onClick={() => removeContact(info.id || i)}
          />
          <img
            className="edit-contact cursor"
            src={EditFileIcons}
            alt="edit"
            role="presentation"
            onClick={() => {
              setFormData(info);
              setContactApiError({});
              setModalName('Edit Contact');
              setParams('add-new-contact');
            }}
          />
          <div className="row ">
            <div className="col-12 mb-2 mt-1">
              <span className="owner-details">{info?.role}</span>
              <div className="clear-fix" />
            </div>
            <div className="col-6 ">
              <span className="owner-details">
                <img src={EmailIcon} alt="email" />
                {info && info.email}
              </span>
              <div className="clear-fix" />
            </div>
            <div className="col-6">
              <span className="owner-details">
                <img src={PhoneIcon} alt="email" />
                {info && info.phone_number}
              </span>
              <div className="clear-fix" />
            </div>
          </div>
        </ModalRadioCheck>
      );
    });
  };

  return (
    <>
      <div className="modal-body ">
        <h4 className="on-boarding mb-4">Select contact</h4>
        {(isLoading.loader && isLoading.type === 'page') ||
        contactInfoLoading ? (
          <PageLoader
            className="modal-loader"
            color="#FF5933"
            type="page"
            width={40}
          />
        ) : (
          <>
            <div className="body-content">
              {displayContact()}
              <Button
                className="btn-add-contact"
                role="presentation"
                onClick={() => {
                  setFormData({});
                  setContactApiError({});
                  setParams('add-new-contact');
                  setModalName('Add Contact');
                }}>
                <img
                  className="mr-2 add-new-icon "
                  src={AddNewIcons}
                  alt="email"
                />
                Add New Contact
              </Button>
            </div>
            <ErrorMsg>{requestSignatureError?.error}</ErrorMsg>
            <div
              className="mt-4"
              role="presentation"
              onClick={() => setParams('verify-document')}>
              <Button
                type="button"
                disabled={!selectedContact?.id}
                className={
                  selectedContact?.id
                    ? ' btn-primary on-boarding w-100'
                    : ' btn-gray on-boarding w-100 btn-disabled '
                }>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Request Signature'
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Contacts;

Contacts.defaultProps = {
  isLoading: {},
  contactInfoLoading: false,
  contactInfo: {},
  setFormData: () => {},
  setContactApiError: () => {},
  setParams: () => {},
  setModalName: () => {},
  requestSignatureError: {},
  selectedContact: {},
  setSelectedContact: () => {},
  setIsLoading: () => {},
};

Contacts.propTypes = {
  isLoading: shape({}),
  contactInfoLoading: bool,
  contactInfo: shape({}),
  setFormData: func,
  setContactApiError: func,
  setParams: func,
  setModalName: func,
  requestSignatureError: shape({}),
  selectedContact: shape({}),
  setSelectedContact: func,
  setIsLoading: func,
};
