/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import HelloSign from 'hellosign-embedded';
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
  ExpnadArrowBack,
} from '../../theme/images';

import {
  deleteContactInfo,
  createContactInfo,
  updateContactInfo,
  createContractDesign,
  createTransactionData,
  sendReminderOfContract,
  getTransactionData,
} from '../../api/index';
import { getAccountDetails } from '../../store/actions/accountState';

import { getContactDetails } from '../../store/actions/customerState';

// import { PATH_AGREEMENT } from '../../constants';

function RequestSignature({
  id,
  agreementData,
  setShowModal,
  pdfData,
  setShowSuccessContact,
  clearSuccessMessage,
  setOpenCollapse,
}) {
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
  const [contractDesignData, setContractDesignData] = useState(null);
  const [showHelloSignPage, setShowHelloSign] = useState(true);
  // const [reminderMailData, setReminderMailData] = useState({});
  const [contactModalName, setModalName] = useState('Add Contact');
  const [transactionalData, setTransactionalData] = useState(null);
  // const [requestSignatureError, setRequestSignatureError] = useState(null);

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
    if (params && params.step && params.step === 'send-remainder')
      getTransactionData({
        contract_id: agreementData && agreementData.id,
      }).then((res) => {
        setTransactionalData(
          res && res.data && res.data.results && res.data.results[0],
        );
      });
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
    if (index && index.includes('CT')) {
      setIsLoading({ loader: true, type: 'button' });

      deleteContactInfo(index).then(() => {
        setIsLoading({ loader: false, type: 'button' });

        dispatch(getContactDetails(id));
      });
    } else {
      const list = [...contactDetails];
      list.splice(index, 1);
      setContactDetails(list);
    }
  };

  const saveContact = (info) => {
    if (info) {
      setFormData(info);
      setParams('add-new-contact');
      setIsLoading({ loader: true, type: 'button' });

      updateContactInfo(info && info.id, formData).then((res) => {
        setIsLoading({ loader: false, type: 'button' });
        if (res && res.status === 400) {
          setContactApiError(res && res.data);
        }
        if (res && res.status === 200) {
          if (
            (selectedContact && selectedContact.id) ===
            (res && res.data && res.data.id)
          ) {
            setSelectedContact(res && res.data);
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
              setModalName('Edit Contact');
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

  const mapValue = (key) => {
    if (key === 'printed_name') {
      return `${
        selectedContact && selectedContact.first_name
          ? selectedContact.first_name
          : ''
      } ${
        selectedContact && selectedContact.last_name
          ? selectedContact.last_name
          : ''
      } `;
    }
    if (key === 'customer_role') {
      return `${
        selectedContact && selectedContact.role ? selectedContact.role : ''
      }`;
    }
    return '';
  };

  const sendRequestApproval = () => {
    const requestApprovalData = {
      ...approvalNote,
      user: userInfo.id,
      contract: agreementData.id,
      primary_email: 'thay@buyboxexperts.com',
      contract_status: 'pending contract approval',
      contract_data: pdfData
        .replaceAll('PRINTED_NAME', mapValue('printed_name'))
        .replace('CUSTOMER_ROLE', mapValue('customer_role')),
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

          setShowModal(false);
          setShowSuccessContact({ message: 'Approval Requested!', show: true });
          setTimeout(() => clearSuccessMessage(), 3000);

          // history.push({
          //   pathname: PATH_AGREEMENT.replace(':id', id),
          //   state: { message: 'Approval Requested!' },
          // });
          // setShowModal(false);
          setIsLoading({ loader: false, type: 'button' });
        }
      },
    );
  };

  const verifyDocument = () => {
    setIsLoading({ loader: true, type: 'button' });

    const contractData = {
      contract: agreementData.id,
      to: selectedContact && selectedContact.email,
      cc: ccEmails,
      contract_data: pdfData
        .replaceAll('PRINTED_NAME', mapValue('printed_name'))
        .replace('CUSTOMER_ROLE', mapValue('customer_role')),
    };
    createContractDesign(contractData).then((res) => {
      setIsLoading({ loader: false, type: 'button' });

      if (res && res.status === 200) {
        setContractDesignData(res && res.data);
      }
      // if (res && res.status === 400) {
      //   setRequestSignatureError(res && res.data);
      // }
    });
  };

  const displayHelloSign = () => {
    const client = new HelloSign({
      clientId: process.env.REACT_APP_HELLOSIGN_CLIENT_ID,
    });
    client.open(
      contractDesignData &&
        contractDesignData.design_url &&
        contractDesignData.design_url.claim_url,
      {
        skipDomainVerification: true,
      },
    );

    client.on('ready', () => {
      setShowHelloSign(false);
    });

    client.on('finish', () => {
      const requestSignaturedata = {
        user: userInfo.id,
        contract: agreementData.id,
        primary_email: selectedContact && selectedContact.email,
        cc_email_address: ccEmails.filter(
          (item) => Object.keys(item).length !== 0,
        ),
        send_contract_copy: sendContractCopy,
        contract_status: 'pending contract signature',
        hellosign_request_id:
          contractDesignData &&
          contractDesignData.design_url &&
          contractDesignData.design_url.signature_request_id,
      };

      createTransactionData(requestSignaturedata).then((response) => {
        if (response && response.status === 400) {
          setIsLoading({ loader: false, type: 'button' });
          // setApiError(response && response.data);
        } else if (response && response.status === 201) {
          // setOpenCollapse({ agreement: false, statement: true });

          setShowSuccessContact({
            message: 'Signature Requested Successfully!',
            show: true,
          });
          setTimeout(() => clearSuccessMessage(), 3500);
          setOpenCollapse({
            agreement: true,
            statement: false,
            addendum: false,
            dspAddendum: false,
            amendment: false,
          });
          dispatch(getAccountDetails(id));

          // history.push({
          //   pathname: PATH_AGREEMENT.replace(':id', id),
          //   state: { message: 'Signature Requested Successfully' },
          // });
          setIsLoading({ loader: false, type: 'button' });
        }
      });
      setShowModal(false);
    });

    client.on('close', () => {
      setShowModal(false);
    });
  };
  // const handleChangeForReminder = (event, key) => {
  //   if (key === 'send_contract_copy') {
  //     setReminderMailData({ ...reminderMailData, [key]: event.target.checked });
  //   } else {
  //     setReminderMailData({
  //       ...reminderMailData,
  //       [event.target.name]: event.target.value,
  //     });
  //   }
  // };

  const sendReminder = () => {
    setIsLoading({ loader: true, type: 'button' });
    sendReminderOfContract({
      contract_id: agreementData && agreementData.id,
    }).then((res) => {
      setIsLoading({ loader: false, type: 'button' });
      if (res && res.status === 200) {
        setShowModal(false);
        setShowSuccessContact({
          message: 'Reminder sent successfully!',
          show: true,
        });
        setTimeout(() => clearSuccessMessage(), 3000);
      }
    });
  };

  return (
    <>
      {params && params.step === 'verify-document' ? (
        <>
          {/* {contractDesignData && showHelloSignPage ? displayHelloSign() : ''} */}
          <div className="modal-body ">
            <h4
              className="on-boarding mb-4"
              role="presentation"
              onClick={() => setParams('select-contact')}>
              <img className="modal-back-arrow" src={ExpnadArrowBack} alt="" />{' '}
              Request Signature
            </h4>
            <div className="row mb-2">
              <div className="col-6">
                <div className="signature-request">
                  TO:
                  <span className="email-address">
                    {' '}
                    {selectedContact && selectedContact.email}
                  </span>{' '}
                </div>
              </div>
              <div className="col-6">
                <CheckBox>
                  <label
                    className="check-container contract-sign"
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
              className="btn-add-contact mt-3 "
              onClick={() => setCCEmails([...ccEmails, {}])}>
              <img
                className="mr-2 add-new-icon  "
                src={AddNewIcons}
                alt="add-icon"
              />
              Add CC Email Address
            </Button>
            {/* 
            <ErrorMsg>
              {requestSignatureError && requestSignatureError.error}
            </ErrorMsg> */}
            <div className=" mt-4">
              <Button
                className=" btn-primary on-boarding w-100"
                onClick={() => verifyDocument()}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Request Signature'
                )}
                {/* Verify Document */}
              </Button>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
      {params && params.step === 'request-approve' ? (
        <>
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
                className="form-control "
                type="text"
                rows="3"
                placeholder="Add personal note to recipient"
                name="note"
                onChange={(event) => onRequestApprovalChange(event)}
              />
            </FormField>

            <div className=" mt-4">
              <Button
                className=" btn-primary on-boarding w-100"
                onClick={() => sendRequestApproval()}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Request Approval'
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
      {params && params.step === 'send-remainder' ? (
        <>
          <div className="modal-body on-boarding">
            <h4 className="on-boarding mb-4">Send Reminder</h4>

            <div className="row">
              <div className="col-12">
                <div className="signature-request">
                  TO:
                  <span className="email-address">
                    {' '}
                    {transactionalData && transactionalData.primary_email}
                  </span>{' '}
                </div>
              </div>
              {/* <div className="col-12 mt-4">
                <CheckBox>
                  <label
                    className="check-container contract-sign"
                    htmlFor="contract-copy">
                    Send me a copy of this Reminder
                    <input
                      type="checkbox"
                      id="contract-copy"
                      name="send_contract_copy"
                      defaultChecked={
                        transactionalData &&
                        transactionalData.send_contract_copy
                      }
                      onChange={(event) =>
                        handleChangeForReminder(event, 'send_contract_copy')
                      }
                    />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
              </div> */}
            </div>
            {/* <FormField className="mt-3">
              <label htmlFor="emailAddress">Email Subject</label>
              <input
                className="form-control"
                type="text"
                name="subject"
                defaultValue="Reminder: You have contract signature pending"
                onChange={(event) => handleChangeForReminder(event, 'subject')}
              />
            </FormField>
            <FormField className="mt-3">
              <label htmlFor="emailAddress">Personal Note (Optional)</label>
              <textarea
                className="form-control"
                type="text"
                name="note"
                defaultValue={transactionalData && transactionalData.note}
                placeholder="Enter optional note"
                onChange={(event) => handleChangeForReminder(event, 'note')}
              />
            </FormField> */}
            {/* <div className="automatic-reminder mt-2">
              <div className="reminder-note">
                An automatic reminder was sent to the customer 4 hrs ago{' '}
              </div>
              <CheckBox>
                <label
                  className="check-container contract-sign"
                  htmlFor="contract-copy ">
                  I confirm I want to send another reminder email
                  <input
                    type="checkbox"
                    id="contract-copy"
                    name="send_contract_copy"
                  />
                  <span className="checkmark" />
                </label>
              </CheckBox>
            </div> */}

            <div className=" mt-4">
              <Button
                className=" btn-primary on-boarding w-100"
                onClick={() => sendReminder()}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Send Reminder'
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
      {params && params.step === 'select-contact' ? (
        <>
          {contractDesignData && showHelloSignPage ? displayHelloSign() : ''}
          <div className="modal-body ">
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

                <Button
                  className="btn-add-contact"
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
                </Button>
              </div>
            )}

            <div
              className="mt-4"
              role="presentation"
              onClick={() => verifyDocument()}>
              {/* onClick={() => 
               setParams('verify-document')}> */}
              <Button
                type="button"
                disabled={!(selectedContact && selectedContact.id)}
                className={
                  selectedContact && selectedContact.id
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
          </div>
        </>
      ) : (
        ''
      )}

      {params && params.step === 'add-new-contact' ? (
        <>
          <div className="modal-body on-boarding">
            <h4
              className="on-boarding mb-2"
              role="presentation"
              onClick={() => setParams('select-contact')}>
              {' '}
              <img className="modal-back-arrow" src={ExpnadArrowBack} alt="" />
              {contactModalName}
            </h4>

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

            {formData && formData.id ? (
              <div
                className="mt-4"
                role="presentation"
                onClick={() => {
                  saveContact(formData);
                }}>
                <Button className=" btn-primary on-boarding">
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    ' Save Contact'
                  )}
                </Button>
              </div>
            ) : (
              <div
                className=" mt-3"
                role="presentation"
                onClick={() => {
                  saveContact();
                }}>
                <Button className=" btn-primary on-boarding">
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Add Contact'
                  )}
                </Button>
              </div>
            )}
          </div>
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
  setShowSuccessContact: () => {},
  clearSuccessMessage: () => {},
  setOpenCollapse: () => {},
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
  setShowSuccessContact: PropTypes.func,
  clearSuccessMessage: PropTypes.func,
  setOpenCollapse: PropTypes.func,
};
