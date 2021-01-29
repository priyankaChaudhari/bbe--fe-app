import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import queryString from 'query-string';
import {
  Button,
  FormField,
  ErrorMsg,
  CheckBox,
  GetInitialName,
  ModalRadioCheck,
  PageLoader,
} from '../../common';
import {
  AddNewIcons,
  TrashIcons,
  EditFileIcons,
  EmailIcon,
  PhoneIcon,
  DefaultUser,
} from '../../theme/images';

import {
  deleteContactInfo,
  createContactInfo,
  updateContactInfo,
  // updateAccountDetails,
  createTransactionData,
} from '../../api/index';

import { getContactDetails } from '../../store/actions/customerState';
import { PATH_AGREEMENT } from '../../constants';

function RequestSignature({ id, agreementData, setShowModal, pdfData }) {
  const history = useHistory();
  const params = queryString.parse(history.location.search);
  const dispatch = useDispatch();
  const contactInfo = useSelector((state) => state.customerState.contactData);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [contactDetails, setContactDetails] = useState(contactInfo);
  const [contactApiError, setContactApiError] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [selectedContact, setSelectedContact] = useState({});
  const [ccEmails, setCCEmails] = useState([{}, {}]);
  const [approvalNote, setApprovalNote] = useState({});
  const [sendContractCopy, setSendContractCopy] = useState(false);
  const contactFields = [
    {
      key: 'first_name',
      type: 'text',
      placeholder: 'First Name',
      classname: 'col-3 pr-1',
    },
    {
      key: 'last_name',
      type: 'text',
      placeholder: 'Last Name',
      classname: 'col-3 pl-1',
    },
    {
      key: 'role',
      type: 'text',
      placeholder: 'Role',
      classname: 'col-6',
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
  useEffect(() => {
    dispatch(getContactDetails(id));
    setIsLoading({ loader: false, type: 'page' });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setParams = (param) => {
    const stringified =
      queryString &&
      queryString.stringify({
        step: param,
      });
    history.push({
      pathname: `${history.location.pathname}`,
      search: `${stringified}`,
    });
  };

  const removeContact = (index) => {
    // setShowSuccessContact({ show: false, message: '' });
    if (index && index.includes('CT')) {
      setIsLoading({ loader: true, type: 'page' });

      deleteContactInfo(index).then(() => {
        setIsLoading({ loader: false, type: 'page' });

        dispatch(getContactDetails(id));
        // setShowSuccessContact({ show: true, message: 'Contact Removed.' });
      });
    } else {
      const list = [...contactDetails];
      list.splice(index, 1);
      setContactDetails(list);
      // setShowSuccessContact({ show: true, message: 'Contact Removed.' });
    }
  };

  const saveContact = (info) => {
    if (info) {
      setFormData(info);
      setParams('add-new-contact');
      setIsLoading({ loader: true, type: 'page' });

      updateContactInfo(info && info.id, formData).then((res) => {
        setIsLoading({ loader: false, type: 'page' });

        if (res && res.status === 400) {
          setContactApiError(res && res.data);
        }
        if (res && res.status === 200) {
          dispatch(getContactDetails(id));
          setParams('select-contact');
        }
      });
    } else {
      setFormData({ ...formData, customer: id });
      setIsLoading({ loader: true, type: 'page' });

      createContactInfo({ ...formData, customer: id }).then(
        (responseContact) => {
          setIsLoading({ loader: false, type: 'page' });
          if (responseContact && responseContact.status === 201) {
            dispatch(getContactDetails(id));
            setParams('select-contact');
          }
          if (responseContact && responseContact.status === 400) {
            setContactApiError(responseContact && responseContact.data);
          }
        },
      );
    }
  };

  const onSelectContact = (info) => {
    setSelectedContact(info);
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
              setParams('add-new-contact');
            }}
          />
          <div className="row ">
            <div className="col-12 mb-2 mt-1">
              <span className="owner-details">{info && info.role}</span>
            </div>
            <div className="col-6 ">
              {' '}
              <span className="owner-details">
                {' '}
                <img src={EmailIcon} alt="email" />
                {info && info.email}
              </span>
            </div>
            <div className="col-6">
              {' '}
              <span className="owner-details">
                {' '}
                <img src={PhoneIcon} alt="email" />
                {info && info.phone_number}
              </span>
            </div>
          </div>
        </ModalRadioCheck>
      );
    });
  };

  const handleContactChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setContactApiError({ ...contactApiError, [event.target.name]: '' });
  };

  const displayAddNewContactForm = () => {
    return contactFields.map((field) => {
      return (
        <div className={field.classname}>
          {' '}
          <FormField className="mt-3">
            <input
              className="form-control"
              type={field.type}
              placeholder={field.placeholder}
              name={field.key}
              defaultValue={formData[field.key]}
              onChange={(event) => handleContactChange(event, field)}
            />
            <ErrorMsg>
              {contactApiError &&
                contactApiError[field.key] &&
                contactApiError[field.key][0]}
            </ErrorMsg>
          </FormField>
        </div>
      );
    });
  };

  const handleCCEmailAddress = (event, i) => {
    const list = [...ccEmails];
    list[i] = event.target.value;

    setCCEmails(list);
  };

  const displayCCEmails = () => {
    return ccEmails.map((data, i) => {
      return (
        <div className="col-6 mt-3">
          {' '}
          <FormField>
            <input
              id={i}
              name={`ccEmails${i}`}
              className="form-control"
              type="email"
              placeholder=" Enter Email Address"
              onChange={(event) => handleCCEmailAddress(event, i)}
            />
          </FormField>
        </div>
      );
    });
  };

  const onRequestApprovalChange = (event) => {
    setApprovalNote({
      ...approvalNote,
      [event.target.name]: event.target.value,
    });
  };

  const sendRequestApproval = () => {
    const requestApprovalData = {
      ...approvalNote,
      user: userInfo.id,
      contract: agreementData.id,
      primary_email: 'thay@buyboxexperts.com',
      contract_status: 'pending contract approval',
      contract_data: pdfData,
    };
    setIsLoading({ loader: true, type: 'button' });
    createTransactionData(requestApprovalData).then(
      // updateAccountDetails(agreementData.id, requestApprovalData).then(
      (response) => {
        if (response && response.status === 400) {
          setIsLoading({ loader: false, type: 'button' });
          // setApiError(response && response.data);
        } else if (response && response.status === 201) {
          // setOpenCollapse({ agreement: false, statement: true });

          history.push({
            pathname: PATH_AGREEMENT.replace(':id', id),
            state: { message: 'Approval Requested!' },
          });
          setShowModal(false);
          setIsLoading({ loader: false, type: 'button' });
        }
      },
    );
  };

  const sendRequestSignature = () => {
    const requestSignaturedata = {
      user: userInfo.id,
      contract: agreementData.id,
      primary_email: selectedContact && selectedContact.email,
      cc_email_address: ccEmails,
      send_contract_copy: sendContractCopy,
      contract_status: 'pending contract signature',
    };
    createTransactionData(requestSignaturedata).then(
      // );
      // updateAccountDetails(agreementData.id, requestSignaturedata).then(
      (response) => {
        if (response && response.status === 400) {
          setIsLoading({ loader: false, type: 'button' });
          // setApiError(response && response.data);
        } else if (response && response.status === 201) {
          // setOpenCollapse({ agreement: false, statement: true });

          history.push({
            pathname: PATH_AGREEMENT.replace(':id', id),
            state: { message: 'Signature Requested Successfully' },
          });
          setShowModal(false);
          setIsLoading({ loader: false, type: 'button' });
        }
      },
    );
  };

  return (
    <>
      {params && params.step === 'request-signature' ? (
        <>
          <div className="modal-body on-boarding">
            <h4 className="on-boarding mb-4">Request Signature</h4>

            <div className="row mb-2">
              <div className="col-6">
                <div className="signature-request">
                  To:
                  <span className="email-address">
                    {' '}
                    {selectedContact && selectedContact.email}
                  </span>{' '}
                </div>
              </div>
              <div className="col-6">
                <CheckBox>
                  <label
                    className="container contract-sign"
                    htmlFor="contract-copy-check">
                    Send me a copy of the contract
                    <input
                      type="checkbox"
                      id="contract-copy-check"
                      onChange={(event) =>
                        setSendContractCopy(event.target.checked)
                      }
                    />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
              </div>
            </div>
            <div className="send-copy-contract mt-4">
              Send me a copy of the contract
            </div>
            <div className="copy-review mt-2">
              Those in CC will get a copy of the contract for review.
            </div>
            <div className="row">{displayCCEmails()}</div>
            <Button
              className="btn-add-contact mt-2 "
              onClick={() => setCCEmails([...ccEmails, {}])}>
              <img
                className="mr-2 add-new-icon "
                src={AddNewIcons}
                alt="add-icon"
              />
              Add CC Email Address
            </Button>
          </div>
          <div className="footer-line " />
          <div className=" col-12  modal-footer">
            <Button
              className=" btn-primary on-boarding w-100"
              onClick={() => sendRequestSignature()}>
              Request Signature
            </Button>
          </div>
        </>
      ) : (
        ''
      )}
      {params && params.step === 'request-approve' ? (
        <div className="modal-body on-boarding">
          <h4 className="on-boarding mb-4">Request Approval</h4>
          <div className="edit-profile-text float-left mb-4">
            <GetInitialName property="mr-3" />
            <div className="name-email">
              <div className="team-member-name">Thaddeus Hay</div>
              <span> thay@buyboxexperts.com</span>
            </div>
          </div>

          <FormField>
            <textarea
              className="form-control"
              type="text"
              placeholder="Add personal note to recipient"
              name="note"
              onChange={(event) => onRequestApprovalChange(event)}
            />
          </FormField>
          <div className="footer-line " />
          <div className=" col-12  modal-footer">
            <Button
              className=" btn-primary on-boarding w-100"
              onClick={() => sendRequestApproval()}>
              Request Approval
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
      {params && params.step === 'send-remainder' ? (
        <>
          <div className="modal-body on-boarding">
            <h4 className="on-boarding mb-4">Send Reminder</h4>

            <div className="row">
              <div className="col-6">
                <div className="signature-request">
                  To:
                  <span className="email-address">
                    {' '}
                    jenny@ashersapparel.com
                  </span>{' '}
                </div>
              </div>
              <div className="col-6">
                <CheckBox>
                  <label
                    className="container contract-sign"
                    htmlFor="contract-copy">
                    Send me a copy of the contract
                    <input type="checkbox" id="contract-copy" />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
              </div>
            </div>
            <FormField className="mt-3">
              <input className="form-control" type="text" />
            </FormField>
            <FormField className="mt-3">
              <textarea
                className="form-control"
                type="text"
                placeholder="Add personal note to recipient"
              />
            </FormField>
          </div>
          <div className="footer-line " />
          <div className=" col-12  modal-footer">
            <Button className=" btn-primary on-boarding w-100">
              Send Reminder
            </Button>
          </div>
        </>
      ) : (
        ''
      )}
      {params && params.step === 'select-contact' ? (
        <div className="modal-body on-boarding">
          <h4 className="on-boarding mb-4">Select contact</h4>
          {isLoading.loader && isLoading.type === 'page' ? (
            <PageLoader
              className="modal-loader"
              color="#FF5933"
              type="page"
              width={40}
            />
          ) : (
            <div className="body-content">
              {displayContact()}

              <div
                className="add-new-contact mt-3"
                role="presentation"
                onClick={() => {
                  setFormData({});
                  setParams('add-new-contact');
                }}>
                {' '}
                <img
                  className="mr-2 add-new-icon "
                  src={AddNewIcons}
                  alt="email"
                />
                Add New Contact
              </div>
            </div>
          )}
          <div className="footer-line " />

          <div
            className=" col-12  modal-footer"
            role="presentation"
            onClick={() => setParams('request-signature')}>
            <Button
              className={
                selectedContact && selectedContact.id
                  ? ' btn-primary on-boarding w-100'
                  : ' btn-primary on-boarding w-100 disabled'
              }>
              Request Signature
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}

      {params && params.step === 'add-new-contact' ? (
        <>
          <div className="modal-body on-boarding">
            <h4 className="on-boarding mb-2">Add Contact</h4>

            <div className="body-content">
              <div className="row">
                <div className="col-2 text-right">
                  <img
                    src={DefaultUser}
                    alt="user"
                    className="contact-user  mt-4"
                  />
                </div>
                <div className="col-10">
                  <div className="row">{displayAddNewContactForm()}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-line " />
          {formData && formData.id ? (
            <div
              className=" col-12  modal-footer"
              role="presentation"
              onClick={() => {
                saveContact(formData);
              }}>
              <Button className=" btn-primary on-boarding">
                Update Contact
              </Button>
            </div>
          ) : (
            <div
              className=" col-12  modal-footer"
              role="presentation"
              onClick={() => {
                saveContact();
              }}>
              <Button className=" btn-primary on-boarding">Add Contact</Button>
            </div>
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
}

export default RequestSignature;
RequestSignature.defaultProps = {
  agreementData: {},
  setShowModal: () => {},
  pdfData: '',
};

RequestSignature.propTypes = {
  id: PropTypes.string.isRequired,
  agreementData: PropTypes.shape({
    id: PropTypes.string,
    contract_type: PropTypes.string,
    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
    additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
    additional_marketplaces: PropTypes.arrayOf(PropTypes.object),
    steps_completed: PropTypes.objectOf(PropTypes.bool),
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
  }),
  setShowModal: PropTypes.func,
  pdfData: PropTypes.string,
};
