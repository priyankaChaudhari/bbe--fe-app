/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';

import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  string,
  bool,
  number,
  func,
  oneOfType,
  arrayOf,
  shape,
  objectOf,
} from 'prop-types';

import { Button, PageLoader } from '../../common';
import { getTransactionData, getBGSManagers } from '../../api';
import { getContactDetails } from '../../store/actions/customerState';
import {
  Contacts,
  AddNewContact,
  SendReminder,
  VerifyDocument,
  RequestApproval,
} from './RequestSignatureModule';

function RequestSignature({
  id,
  agreementData,
  setShowModal,
  pdfData,
  setOpenCollapse,
  getContractDetails,
  setContractLoading,
  setShowEditor,
  setIsEditContract,
  setShowCloseBtn,
}) {
  const history = useHistory();
  const params = queryString.parse(history.location.search);
  const dispatch = useDispatch();
  const contactInfo = useSelector((state) => state.customerState.contactData);
  const contactInfoLoading = useSelector(
    (state) => state.customerState.isLoading,
  );
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [contactApiError, setContactApiError] = useState({});
  const [reminderError, setReminderErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [selectedContact, setSelectedContact] = useState({});

  const [contactModalName, setModalName] = useState('Add Contact');
  const [transactionalData, setTransactionalData] = useState(null);
  const [requestSignatureError, setRequestSignatureError] = useState(null);
  const [BGSManager, setBGSManagerData] = useState(null);
  const draftFrom = agreementData?.draft_from;

  const getBGSManagersData = () => {
    getBGSManagers(id).then((managerData) => {
      if (managerData && managerData.status === 200) {
        setBGSManagerData(managerData && managerData.data);
      }
      setIsLoading({ loader: false, type: 'page' });
    });
  };

  useEffect(() => {
    dispatch(getContactDetails(id));
    if (params && params.step && params.step === 'send-remainder')
      getTransactionData({
        contract_id: agreementData?.id,
      }).then((res) => {
        setTransactionalData(
          res && res.data && res.data.results && res.data.results[0],
        );
      });
    setIsLoading({ loader: false, type: 'page' });
    if (draftFrom) {
      setIsLoading({ loader: true, type: 'page' });
      getBGSManagersData();
    }
  }, [id]);

  const setParams = (param) => {
    const stringified =
      queryString &&
      queryString.stringify({
        ...params,
        step: param,
      });
    history.push({
      pathname: `${history.location.pathname}`,
      search: `${stringified}`,
      state: `${history.location.state}`,
    });
  };

  const removeParams = (item) => {
    delete params[item];
    const stringified =
      queryString &&
      queryString.stringify({
        ...params,
      });

    history.push({
      pathname: `${history.location.pathname}`,
      search: `${stringified}`,
      state: `${history.location.state}`,
    });
    setIsEditContract(false);
  };

  const renderbuttonHtml = (disabledCon, onClickFunc, btnLabel) => {
    return (
      <>
        <Button
          className=" btn-primary on-boarding w-100"
          onClick={() => {
            onClickFunc();
          }}
          disabled={disabledCon || false}>
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            btnLabel
          )}
        </Button>
      </>
    );
  };
  return (
    <>
      {params && params.step === 'verify-document' ? (
        <VerifyDocument
          setParams={setParams}
          userInfo={userInfo}
          agreementData={agreementData}
          selectedContact={selectedContact}
          setIsLoading={setIsLoading}
          pdfData={pdfData}
          setRequestSignatureError={setRequestSignatureError}
          setContractLoading={setContractLoading}
          setShowModal={setShowModal}
          setOpenCollapse={setOpenCollapse}
          removeParams={removeParams}
          getContractDetails={getContractDetails}
          setShowEditor={setShowEditor}
          renderbuttonHtml={renderbuttonHtml}
        />
      ) : (
        ''
      )}
      {params && params.step === 'request-approve' ? (
        <RequestApproval
          BGSManager={BGSManager}
          selectedContact={selectedContact}
          agreementData={agreementData}
          getBGSManagersData={getBGSManagersData}
          setIsLoading={setIsLoading}
          setShowModal={setShowModal}
          removeParams={removeParams}
          getContractDetails={getContractDetails}
          userInfo={userInfo}
          pdfData={pdfData}
          id={id}
          isLoading={isLoading}
          renderbuttonHtml={renderbuttonHtml}
          setShowCloseBtn={setShowCloseBtn}
        />
      ) : (
        ''
      )}
      {params && params.step === 'send-remainder' ? (
        <SendReminder
          transactionalData={transactionalData}
          reminderError={reminderError}
          renderbuttonHtml={renderbuttonHtml}
          setIsLoading={setIsLoading}
          setShowModal={setShowModal}
          removeParams={removeParams}
          setReminderErrors={setReminderErrors}
          agreementData={agreementData}
        />
      ) : (
        ''
      )}
      {params && params.step === 'select-contact' ? (
        <Contacts
          isLoading={isLoading}
          contactInfoLoading={contactInfoLoading}
          contactInfo={contactInfo}
          setFormData={setFormData}
          setContactApiError={setContactApiError}
          setParams={setParams}
          setModalName={setModalName}
          requestSignatureError={requestSignatureError}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          setIsLoading={setIsLoading}
        />
      ) : (
        ''
      )}
      {params && params.step === 'add-new-contact' ? (
        <>
          <AddNewContact
            setParams={setParams}
            formData={formData}
            renderbuttonHtml={renderbuttonHtml}
            contactModalName={contactModalName}
            setFormData={setFormData}
            setContactApiError={setContactApiError}
            contactApiError={contactApiError}
            setIsLoading={setIsLoading}
            setSelectedContact={setSelectedContact}
            selectedContact={selectedContact}
          />
        </>
      ) : (
        ''
      )}
    </>
  );
}

export default RequestSignature;
RequestSignature.defaultProps = {
  id: '',
  agreementData: {},
  setShowModal: () => {},
  pdfData: '',
  setOpenCollapse: () => {},
  getContractDetails: () => {},
  setContractLoading: () => {},
  setShowEditor: () => {},
  setIsEditContract: () => {},
  setShowCloseBtn: () => {},
};

RequestSignature.propTypes = {
  id: string,
  agreementData: shape({
    id: string,
    contract_type: string,
    draft_from: string,
    primary_marketplace: oneOfType([
      string,
      shape({
        fee: number,
        name: string,
        id: string,
      }),
    ]),
    additional_monthly_services: arrayOf(shape({})),
    additional_marketplaces: arrayOf(shape({})),
    steps_completed: objectOf(bool),
    additional_one_time_services: arrayOf(shape({})),
  }),
  setShowModal: func,
  pdfData: string,
  setOpenCollapse: func,
  getContractDetails: func,
  setContractLoading: func,
  setShowEditor: func,
  setIsEditContract: func,
  setShowCloseBtn: func,
};
