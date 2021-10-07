import React, { useEffect, useState } from 'react';

import NumberFormat from 'react-number-format';
import ReactTooltip from 'react-tooltip';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { func, bool, string, shape, number, arrayOf } from 'prop-types';

import CheckPhoneNumber from '../../../common/CheckPhoneNumber';
import { editCompanyFields } from '../../../constants';
import {
  FormField,
  Button,
  ModalBox,
  PageLoader,
  ErrorMsg,
  GetInitialName,
} from '../../../common';
import {
  DefaultUser,
  SaveIcon,
  AddNewIcons,
  TrashIcons,
  NoContactIcon,
  InfoIcon,
} from '../../../theme/images';
import {
  updateCustomerDetails,
  updateContactInfo,
  createContactInfo,
  deleteContactInfo,
} from '../../../api';

export default function EditCompanyDetails({
  setShowModal,
  id,
  getActivityLogInfo,
  scrollDown,
  setScrollDown,
  customerDetails,
  detail,
  getContactData,
  contactInfo,
}) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [apiError, setApiError] = useState({});
  const [formData, setFormData] = useState({});
  const [contactFormData, setContactFormData] = useState({});
  const [contactApiError, setContactApiError] = useState({});
  const [checkChange, setCheckChange] = useState({});
  const [contactDetails, setContactDetails] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [clearSocialInput, setClearSocialInput] = useState({
    facebook: '',
    instagram: '',
    linkedin: '',
    pinterest: '',
    twitter: '',
  });

  const loader = useSelector((state) => state.customerState.isLoading);

  const modalScrollDown = () => {
    const div = document.getElementById('scroll-contact');
    if (div) {
      $('#scroll-contact').animate(
        {
          scrollTop: div.scrollHeight,
        },
        500,
      );
      setScrollDown(false);
    }
  };

  useEffect(() => {
    if (scrollDown === true) {
      modalScrollDown();
    }
  });
  const clearSocialURL = (key) => {
    setIsLoading({ loader: true, type: 'page' });

    setClearSocialInput({ ...clearSocialInput, [key]: null });
    updateCustomerDetails(detail.id, { [key]: null }).then((response) => {
      if (response && response.status === 200) {
        customerDetails();
        toast.success('Social Media URL removed.');
        getActivityLogInfo();
        setIsLoading({ loader: false, type: 'page' });
      }
      if (response && response.status === 400) {
        setApiError(response && response.data);
      }
    });
  };

  const handleChange = (event, key) => {
    setShowBtn(true);
    setFormData({ ...formData, [key]: event.target.value });
    setApiError({
      ...apiError,
      [event.target.name]: '',
    });
  };

  const generateTextArea = (item) => {
    return (
      <textarea
        className="form-control"
        rows="4"
        cols="50"
        name={item.key}
        style={{ height: '80px' }}
        defaultValue={(detail && detail[item.key]) || ''}
        onChange={(event) => handleChange(event, item.key)}
      />
    );
  };

  const mapIconValues = (key) => {
    if (detail && detail[key]) {
      return detail[key];
    }
    if (formData && formData[key]) {
      return formData[key];
    }
    return '';
  };

  const generateSocialIcon = (item) => {
    const fields = [];
    for (const icon of item[0].choices) {
      fields.push(
        <React.Fragment key={icon.key}>
          <div className="col-3 mt-3">
            <span>
              {' '}
              <img
                src={icon.item}
                alt={icon.value}
                className="social-media mr-1"
              />{' '}
              {icon.label}
            </span>
          </div>
          <div className="col-9">
            <FormField className="mt-3">
              <input
                name={icon.key}
                className="form-control extra-space"
                type="text"
                value={mapIconValues(icon.key)}
                onChange={(event) => handleChange(event, icon.key)}
              />

              {detail && detail[icon.key] ? (
                <img
                  src={TrashIcons}
                  alt="delete"
                  className="trash cursor"
                  onClick={() => clearSocialURL(icon.key)}
                  role="presentation"
                />
              ) : (
                ''
              )}
              <ErrorMsg>
                {apiError && apiError[icon.key] && apiError[icon.key][0]}
              </ErrorMsg>
            </FormField>
          </div>
        </React.Fragment>,
      );
    }
    return fields;
  };

  const generateNumberFormat = (item) => {
    return (
      <NumberFormat
        format={item.key === 'zip_code' ? '##########' : null}
        decimalScale={2}
        name={item.key}
        className="form-control"
        defaultValue={
          item.key === 'phone_number'
            ? detail && detail[item.key]
            : Math.round(detail && detail[item.key]) || ''
        }
        placeholder={item.label}
        prefix={item.type === 'number-currency' ? '$' : ''}
        onChange={(event) => handleChange(event, item.key)}
        thousandSeparator={item.key !== 'zip_code'}
      />
    );
  };

  const mapInputValues = (item) => {
    return detail && detail[item.key];
  };

  const generateInput = (item) => {
    return (
      <>
        <input
          className="form-control extra-space"
          type="text"
          name={item.key}
          placeholder={item.label}
          defaultValue={mapInputValues(item)}
          onChange={(event) => handleChange(event, item.key)}
          maxLength={item.key === 'phone_number' ? 15 : ''}
          id={item.key === 'phone_number' ? 'Phone' : item.key}
        />

        {item.key === 'phone_number' ? (
          <>
            <img
              src={InfoIcon}
              alt="info"
              data-tip="If you enter a number without country code,<br /> it will be set as United States(+1) by default."
              data-for="phone"
              className="phone-input-info"
            />
            <ReactTooltip id="phone" aria-haspopup="true" html place="left" />
          </>
        ) : (
          ''
        )}
      </>
    );
  };

  const generateHTML = (item) => {
    if (item.type === 'textarea') {
      return generateTextArea(item);
    }
    if (item && item.type && item.type.includes('number')) {
      return generateNumberFormat(item);
    }
    return generateInput(item);
  };

  const saveData = () => {
    setIsLoading({ loader: true, type: 'button' });
    updateCustomerDetails(detail.id, formData).then((response) => {
      if (response && response.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
        setApiError(response && response.data);
        setShowModal(true);
      } else if (response && response.status === 200) {
        toast.success('Changes Saved!');
        setIsLoading({ loader: false, type: 'button' });
        customerDetails();
        getActivityLogInfo();
        setShowModal(false);
      }
    });
  };

  const addNewContact = () => {
    const div = document.getElementById('scroll-contact');
    $('#scroll-contact').animate(
      {
        scrollTop: div.scrollHeight,
      },
      500,
    );

    setContactDetails([
      ...contactDetails,
      {
        first_name: '',
        last_name: '',
        role: '',
        email: '',
        phone_number: '',
        customer: id,
      },
    ]);
  };

  const removeContact = (index) => {
    if (index && index.includes('CT')) {
      deleteContactInfo(index).then(() => {
        toast.success('Contact Removed!');
        getContactData(id);
      });
    } else {
      toast.success('Contact Removed!');
      const list = [...contactDetails];
      list.splice(index, 1);
      setContactDetails(list);
    }
  };

  const handleContactChange = (event, index, type) => {
    setCheckChange({ ...checkChange, [index]: true });

    if (index && index.includes('CT')) {
      if (type === 'choice') {
        setContactFormData({ ...contactFormData, role: event.value });
        setContactApiError({ ...contactApiError, role: '' });
      } else {
        setContactFormData({
          ...contactFormData,
          [event.target.name]: event.target.value,
        });
        setContactApiError({ ...contactApiError, [event.target.name]: '' });
      }
    } else {
      if (type === 'choice') {
        const list = [...contactDetails];
        list[index].role = event.value;
        setContactDetails(list);
      } else {
        const { name, value } = event.target;
        const list = [...contactDetails];
        list[index][name] = value;
        setContactDetails(list);
      }
      setContactApiError({ ...contactApiError, [event.target.name]: '' });
    }
  };

  const saveContact = (contactId) => {
    if (contactDetails && contactDetails.length === 1) {
      createContactInfo(contactDetails[0]).then((responseContact) => {
        if (responseContact && responseContact.status === 400) {
          setContactApiError(responseContact && responseContact.data);
        }
        if (responseContact && responseContact.status === 201) {
          toast.success('Contact Saved!');
          getContactData(id);
          setCheckChange({ ...checkChange, [contactId]: false });
          setContactApiError({});
          setContactDetails([]);
        }
      });
    }
    if (contactFormData && contactId) {
      updateContactInfo(contactId, contactFormData).then((res) => {
        if (res && res.status === 400) {
          setContactApiError(res && res.data);
        }
        if (res && res.status === 200) {
          toast.success('Contact Saved!');
          getContactData(id);
          setCheckChange({ ...checkChange, [contactId]: false });
          setContactApiError({});
          setContactDetails([]);
        }
      });
    }
  };

  const mapContactValues = (item, key) => {
    if (
      item.id &&
      contactApiError &&
      contactApiError.email &&
      contactApiError.email[0] &&
      checkChange[item.id]
    ) {
      return contactFormData[key] || item[key];
    }
    return item[key];
  };

  const generateContactHTML = (array) => {
    const fields = [];
    array.map((item, i) =>
      fields.push(
        <div className="col-12" key={item.id || i} id="add-contact">
          <fieldset className="mb-3">
            <>
              <img
                className="remove-contact cursor"
                src={TrashIcons}
                alt="delete"
                role="presentation"
                onClick={() => removeContact(item.id || i)}
              />
              {checkChange[item.id || i] ? (
                <img
                  className={
                    contactInfo.length !== 1 ||
                    contactDetails.length === 1 ||
                    contactFormData
                      ? 'remove-contact cursor mr-4'
                      : 'remove-contact cursor'
                  }
                  src={SaveIcon}
                  alt="save"
                  role="presentation"
                  onClick={() => saveContact(item.id || i)}
                />
              ) : (
                ''
              )}
              <div className="row">
                <div className="col-2 text-center">
                  {' '}
                  {item.first_name === '' && item.last_name === '' ? (
                    <img
                      src={DefaultUser}
                      alt="user"
                      className="contact-user  mt-4"
                    />
                  ) : (
                    <GetInitialName userInfo={item} property=" mt-4 " />
                  )}
                </div>
                <div className="col-10">
                  <div className="row">
                    <div className="col-3 pr-1">
                      <FormField className="mt-3">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="First name"
                          name="first_name"
                          defaultValue={mapContactValues(item, 'first_name')}
                          onChange={(event) =>
                            handleContactChange(event, item.id || i)
                          }
                        />
                        {checkChange[item.id] ? (
                          <ErrorMsg>
                            {item.id &&
                              contactApiError &&
                              contactApiError.first_name &&
                              contactApiError.first_name[0]}
                          </ErrorMsg>
                        ) : (
                          ''
                        )}
                        {checkChange[i] && !item.id ? (
                          <ErrorMsg>
                            {id &&
                              contactApiError &&
                              contactApiError.first_name &&
                              contactApiError.first_name[0]}
                          </ErrorMsg>
                        ) : (
                          ''
                        )}
                      </FormField>
                    </div>
                    <div className="col-3 pl-1">
                      <FormField className="mt-3">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Last name"
                          name="last_name"
                          defaultValue={mapContactValues(item, 'last_name')}
                          onChange={(event) =>
                            handleContactChange(event, item.id || i)
                          }
                        />
                        {checkChange[item.id] ? (
                          <ErrorMsg>
                            {item.id &&
                              contactApiError &&
                              contactApiError.last_name &&
                              contactApiError.last_name[0]}
                          </ErrorMsg>
                        ) : (
                          ''
                        )}
                        {checkChange[i] && !item.id ? (
                          <ErrorMsg>
                            {id &&
                              contactApiError &&
                              contactApiError.last_name &&
                              contactApiError.last_name[0]}
                          </ErrorMsg>
                        ) : (
                          ''
                        )}
                      </FormField>
                    </div>
                    <div className="col-6">
                      <FormField className="mt-3">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Role"
                          name="role"
                          defaultValue={mapContactValues(item, 'role')}
                          onChange={(event) =>
                            handleContactChange(event, item.id || i)
                          }
                        />
                        {/* <InputSelect>
                          <Select
                            name="role"
                            options={roles}
                            defaultValue={item.role}
                            onChange={(event) =>
                              handleContactChange(event, item.id || i, 'choice')
                            }
                          />
                        </InputSelect> */}
                        <ErrorMsg>
                          {contactApiError &&
                            contactApiError.role &&
                            contactApiError.role[0]}
                        </ErrorMsg>
                      </FormField>
                    </div>
                    <div className="col-6">
                      <FormField className="mt-3">
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          placeholder="Email"
                          defaultValue={mapContactValues(item, 'email')}
                          onChange={(event) =>
                            handleContactChange(event, item.id || i)
                          }
                        />
                      </FormField>
                      {checkChange[item.id] ? (
                        <>
                          <ErrorMsg>
                            {item.id &&
                              contactApiError &&
                              contactApiError.email &&
                              contactApiError.email[0]}
                          </ErrorMsg>
                          <ErrorMsg>
                            {item.id &&
                              contactApiError &&
                              contactApiError.non_field_errors &&
                              contactApiError.non_field_errors[0]}
                          </ErrorMsg>
                        </>
                      ) : (
                        ''
                      )}
                      {checkChange[i] && !item.id ? (
                        <>
                          <ErrorMsg>
                            {id &&
                              contactApiError &&
                              contactApiError.email &&
                              contactApiError.email[0]}
                          </ErrorMsg>
                          <ErrorMsg>
                            {id &&
                              contactApiError &&
                              contactApiError.non_field_errors &&
                              contactApiError.non_field_errors[0]}
                          </ErrorMsg>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="col-6">
                      <FormField className="mt-3">
                        <input
                          className="form-control"
                          name="phone_number"
                          placeholder="Phone number"
                          onChange={(event) =>
                            handleContactChange(event, item.id || i)
                          }
                          maxLength={15}
                          defaultValue={mapContactValues(item, 'phone_number')}
                          id={`${item.id || i}ContactPhone`}
                        />
                        <CheckPhoneNumber
                          name={`${item.id || i}ContactPhone`}
                        />
                        <>
                          <img
                            src={InfoIcon}
                            alt="info"
                            data-tip="If you enter a number without country code,<br /> it will be set as United States(+1) by default."
                            data-for="contact"
                            className="contact-input-info"
                          />
                          <ReactTooltip
                            id="contact"
                            aria-haspopup="true"
                            html
                            place="left"
                          />
                        </>

                        <ErrorMsg>
                          {checkChange[item.id] ? (
                            <ErrorMsg>
                              {item.id &&
                                contactApiError &&
                                contactApiError.phone_number &&
                                contactApiError.phone_number[0]}
                            </ErrorMsg>
                          ) : (
                            ''
                          )}
                          {checkChange[i] && !item.id ? (
                            <ErrorMsg>
                              {id &&
                                contactApiError &&
                                contactApiError.phone_number &&
                                contactApiError.phone_number[0]}
                            </ErrorMsg>
                          ) : (
                            ''
                          )}
                        </ErrorMsg>
                      </FormField>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </fieldset>
        </div>,
      ),
    );
    return fields;
  };

  return (
    <ModalBox>
      <div className="modal-body ">
        <div className="row">
          <div className="col-12 modal-heading">
            <h4>Edit Company Details</h4>
          </div>
        </div>
        <div className="body-content mt-1" id="scroll-contact">
          <div className="row">
            {editCompanyFields.map((item) => (
              <React.Fragment key={item.key}>
                {item.type !== 'social' ? (
                  <div className={item.property} id={item.key}>
                    <FormField className="mt-3">
                      <label htmlFor={item.id}>
                        {item.label}
                        <br />
                        {generateHTML(item)}
                        <CheckPhoneNumber name="Phone" />
                      </label>
                      <ErrorMsg>
                        {apiError &&
                          apiError[item.key] &&
                          apiError[item.key][0]}
                      </ErrorMsg>
                    </FormField>
                  </div>
                ) : (
                  <>
                    <div className="col-12">
                      <div className="heading  mt-3"> Social</div>
                    </div>
                    {generateSocialIcon(
                      editCompanyFields.filter(
                        (field) => field.key === 'social',
                      ),
                    )}
                  </>
                )}
              </React.Fragment>
            ))}

            <>
              <div className="col-12">
                <div className="heading  mt-3 mb-3">Contact Details</div>
                {contactInfo.length === 0 &&
                contactDetails.length === 0 &&
                !loader ? (
                  <div className="mb-2 pb-3" style={{ color: '#2E384D' }}>
                    <img
                      className="mr-3"
                      src={NoContactIcon}
                      alt="noContact"
                      style={{ verticalAlign: 'middle' }}
                    />
                    No Contact Details Found.
                  </div>
                ) : (
                  ''
                )}
              </div>

              {loader ? (
                <PageLoader color="#FF5933" type="buttonContact" />
              ) : (
                <>
                  {generateContactHTML(contactInfo)}
                  {generateContactHTML(contactDetails)}
                </>
              )}
              <div className="col-12">
                <Button
                  className={
                    (contactDetails && contactDetails.length === 1) ||
                    (contactApiError && Object.values(contactApiError).length)
                      ? 'btn-add-contact  disabled'
                      : 'btn-add-contact '
                  }
                  onClick={() => addNewContact()}
                  disabled={
                    (contactDetails && contactDetails.length === 1) ||
                    (contactApiError && Object.values(contactApiError).length)
                  }>
                  {' '}
                  <img
                    className="mr-2 add-new-icon "
                    src={AddNewIcons}
                    alt="add-icon"
                  />
                  Add New Contact
                </Button>
              </div>
            </>
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
    </ModalBox>
  );
}

EditCompanyDetails.defaultProps = {
  id: '',
  scrollDown: false,
};

EditCompanyDetails.propTypes = {
  setShowModal: func.isRequired,
  id: string,
  detail: shape({
    id: string,
  }).isRequired,
  getActivityLogInfo: func.isRequired,
  setScrollDown: func.isRequired,
  scrollDown: bool,
  customerDetails: func.isRequired,
  getContactData: func.isRequired,
  contactInfo: arrayOf(shape({ length: number })).isRequired,
};
