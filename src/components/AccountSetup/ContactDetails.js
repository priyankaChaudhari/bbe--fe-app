import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';

import {
  Button,
  ErrorMsg,
  FormField,
  GreyCard,
  InnerContainer,
  PageLoader,
} from '../../common';
import {
  AddNewIcons,
  EditFileIcons,
  EmailIcon,
  Logo,
  PhoneIcon,
  TrashIcons,
} from '../../theme/images';
import { PATH_AMAZON_ACCOUNT } from '../../constants';
import {
  createContactInfo,
  deleteContactInfo,
  updateContactInfo,
  updateUserMe,
} from '../../api';
import { getContactDetails } from '../../store/actions/customerState';
import { customerContactDetails } from '../../constants/FieldConstants';
import { userMe } from '../../store/actions';

export default function ContactDetails({ contactInfo, userInfo }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [addContact, setAddContact] = useState(false);
  const [formData, setFormData] = useState({});
  const [apiError, setApiError] = useState({});
  const [editDetails, setEditDetails] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });

  useEffect(() => {
    if (contactInfo && contactInfo.length) {
      setAddContact(true);
    }
  }, [contactInfo]);

  const saveContact = () => {
    setIsLoading({ loader: true, type: 'button' });

    if (formData && Object.keys(formData).length) {
      const data = {
        ...formData,
        customer: userInfo.id,
      };

      if (editDetails && editDetails.id) {
        updateContactInfo(editDetails.id, data).then((res) => {
          if (res && res.status === 400) {
            setApiError(res && res.data);
            setIsLoading({ loader: false, type: 'button' });
          }
          if (res && res.status === 200) {
            dispatch(getContactDetails(userInfo.id));
            setApiError({});
            setAddContact(true);
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      } else {
        createContactInfo(data).then((responseContact) => {
          if (responseContact && responseContact.status === 400) {
            setApiError(responseContact && responseContact.data);
            setIsLoading({ loader: false, type: 'button' });
          }
          if (responseContact && responseContact.status === 201) {
            dispatch(getContactDetails(userInfo.id));
            setApiError({});
            setAddContact(true);
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      }
    }
  };

  const editContact = (contactId) => {
    setAddContact(false);
    setEditDetails(contactInfo.filter((op) => op.id === contactId)[0]);
  };

  const deleteContact = (contactId) => {
    deleteContactInfo(contactId).then(() => {
      dispatch(getContactDetails(userInfo.id));
    });
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setApiError({
      ...apiError,
      [event.target.name]: '',
    });
  };

  const nextStep = () => {
    updateUserMe(userInfo.id, {
      step: 2,
    }).then((response) => {
      if (response && response.status === 200) {
        dispatch(userMe());
        history.push(PATH_AMAZON_ACCOUNT);
      }
    });
  };

  return (
    <div>
      {!addContact ? (
        <InnerContainer>
          <div className="logo text-center">
            <img className="header-logo" src={Logo} alt="logo " />{' '}
            <span> CENTRAL</span>
          </div>

          <p className="account-steps">Step 2 of 4</p>
          <h3 className="page-heading mb-3"> Company&apos;s contacts</h3>
          <div className="row">
            {customerContactDetails.map((item) => (
              <div className={item.property} key={item.key}>
                <FormField className="mt-3">
                  <input
                    className="form-control"
                    type={item.type}
                    name={item.key}
                    placeholder={item.label}
                    onChange={(event) => handleChange(event)}
                    defaultValue={
                      !addContact &&
                      formData &&
                      formData[item.key] === undefined
                        ? editDetails[item.key]
                        : formData && formData[item.key]
                    }
                  />
                </FormField>
                <ErrorMsg>
                  {apiError && apiError[item.key] && apiError[item.key][0]}
                </ErrorMsg>
              </div>
            ))}
          </div>
          <Button
            className={
              formData && Object.keys(formData).length
                ? 'mt-4 btn-primary w-100 on-boaring'
                : 'mt-4 btn-primary w-100 on-boaring disabled'
            }
            onClick={() => saveContact()}
            disabled={formData && Object.keys(formData).length === 0}>
            {isLoading.loader && isLoading.type === 'button' ? (
              <PageLoader color="#fff" type="button" />
            ) : (
              <>
                {editDetails && Object.keys(editDetails).length
                  ? 'Edit Contact'
                  : 'Add Contact'}
              </>
            )}
          </Button>
        </InnerContainer>
      ) : (
        <InnerContainer>
          <div className="logo text-center">
            <img className="header-logo" src={Logo} alt="logo " />{' '}
            <span> CENTRAL</span>
          </div>

          <p className="account-steps">Step 2 of 4</p>
          <h3 className="page-heading mb-4">Company’s contacts</h3>
          {contactInfo &&
            contactInfo.map((item) => (
              <GreyCard key={item.id} className="mt-4">
                <div className="contact-user-name capitalize">
                  {item.first_name} {item.last_name}
                </div>
                <span className="user-details capitalize"> {item.role}</span>
                <img
                  className="delete-contact cursor"
                  src={TrashIcons}
                  alt="delete"
                  role="presentation"
                  onClick={() => deleteContact(item.id)}
                />
                <img
                  className="edit-contact cursor"
                  src={EditFileIcons}
                  alt="edit"
                  role="presentation"
                  onClick={() => editContact(item.id)}
                />
                <div className="row mt-2">
                  <div className="col-6 ">
                    <span className="user-details">
                      <img src={EmailIcon} alt="email" />
                      {item.email}
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="user-details">
                      <img src={PhoneIcon} alt="email" />
                      {item.phone_number}
                    </span>
                  </div>
                </div>
              </GreyCard>
            ))}
          <Button
            className="btn-add-contact"
            onClick={() => {
              setAddContact(false);
              setEditDetails({});
            }}>
            <img className="mr-2 add-new-icon " src={AddNewIcons} alt="add" />
            Add New Contact
          </Button>
          <Button
            className="btn-primary w-100 on-boarding mt-4"
            onClick={() => nextStep()}>
            Continue
          </Button>
        </InnerContainer>
      )}
    </div>
  );
}

ContactDetails.defaultProps = {
  userInfo: {},
};

ContactDetails.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
  }),
  contactInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
};
