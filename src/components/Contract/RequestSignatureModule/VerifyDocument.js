import React, { useState } from 'react';

import HelloSign from 'hellosign-embedded';
import { string, func, shape } from 'prop-types';

import { AddNewIcons, LeftArrowIcon } from '../../../theme/images';
import { Button, CheckBox, FormField, ErrorMsg } from '../../../common';
import {
  createContractDesign,
  createTransactionData,
} from '../../../api/index';

function VerifyDocument({
  setParams,
  userInfo,
  agreementData,
  selectedContact,
  setIsLoading,
  pdfData,
  setRequestSignatureError,
  setContractLoading,
  setShowModal,
  setOpenCollapse,
  removeParams,
  getContractDetails,
  setShowEditor,
  renderbuttonHtml,
}) {
  const [ccEmails, setCCEmails] = useState([{}]);
  const [ccEmailErrors, setccEmailErrors] = useState([]);
  const [sendContractCopy, setSendContractCopy] = useState(false);
  const [contractDesignData, setContractDesignData] = useState(null);
  const [showHelloSignPage, setShowHelloSign] = useState(true);

  const DesignURL = contractDesignData?.design_url;

  const setDisabledReqSignBtn = () => {
    if (ccEmailErrors?.length) {
      const list =
        ccEmailErrors?.length &&
        ccEmailErrors.filter((item) => item?.email !== '');
      if (list) {
        return !list.every((item) => item?.isValid === true);
      }
    }
    return false;
  };

  const handleCCEmailAddress = (event, i) => {
    const list = [...ccEmails];
    list[i] = event.target.value;

    setCCEmails(list);

    const emailList = [...ccEmailErrors];
    emailList[i] = { email: event.target.value, isValid: true };
    setccEmailErrors(emailList);
  };

  function ValidateEmail(event, index) {
    if (event.target.value) {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          event.target.value,
        )
      ) {
        const list = [...ccEmailErrors];
        list[index] = { email: event.target.value, isValid: true };
        setccEmailErrors(list);
        return true;
      }
      const list = [...ccEmailErrors];
      list[index] = { email: event.target.value, isValid: false };
      setccEmailErrors(list);

      return false;
    }
    return false;
  }

  const displayCCEmails = () => {
    return ccEmails.map((data, i) => {
      return (
        <div className="col-12 mt-3">
          <FormField>
            <input
              id={i}
              name={`ccEmails${i}`}
              className="form-control"
              type="email"
              placeholder=" Enter Email Address"
              onChange={(event) => handleCCEmailAddress(event, i)}
              onBlur={(event) => ValidateEmail(event, i)}
            />
            <ErrorMsg>
              {ccEmailErrors &&
              ccEmailErrors[i] &&
              ccEmailErrors[i].isValid === false
                ? 'Enter a valid email address.'
                : ''}
            </ErrorMsg>
          </FormField>
        </div>
      );
    });
  };

  const mapValue = (key) => {
    if (key === 'printed_name') {
      return `${
        selectedContact?.first_name ? selectedContact.first_name : ''
      } ${selectedContact?.last_name ? selectedContact.last_name : ''} `;
    }
    if (key === 'customer_role') {
      return `${selectedContact?.role ? selectedContact.role : ''}`;
    }
    return '';
  };

  const verifyDocument = () => {
    setIsLoading({ loader: true, type: 'button' });
    const contractData = {
      contract: agreementData.id,
      to: selectedContact?.email,
      cc: ccEmails,
      send_contract_copy: sendContractCopy,
      contract_data: pdfData
        .replaceAll('PRINTED_NAME', mapValue('printed_name'))
        .replace('CUSTOMER_ROLE', mapValue('customer_role')),
    };
    createContractDesign(contractData).then((res) => {
      setIsLoading({ loader: false, type: 'button' });
      if (res && res.status === 200) {
        setContractDesignData(res && res.data);
      }
      if (res && res.status === 400) {
        setRequestSignatureError(res && res.data);
        setTimeout(() => setRequestSignatureError(''), 3500);
      }
    });
  };

  const displayHelloSign = () => {
    const client = new HelloSign({
      clientId: process.env.REACT_APP_HELLOSIGN_CLIENT_ID,
    });
    client.open(DesignURL.claim_url, {
      skipDomainVerification: true,
    });
    client.on('ready', () => {
      setShowHelloSign(false);
    });
    client.on('finish', () => {
      const requestSignaturedata = {
        user: userInfo.id,
        contract: agreementData.id,
        primary_email: selectedContact?.email,
        cc_email_address: ccEmails.filter(
          (item) => Object.keys(item).length !== 0,
        ),
        send_contract_copy: sendContractCopy,
        contract_status: 'pending contract signature',
        hellosign_request_id: DesignURL.signature_request_id,
      };
      setContractLoading({ loader: true, type: 'page' });
      createTransactionData(requestSignaturedata).then((response) => {
        setShowModal(false);
        setContractLoading({ loader: false, type: 'page' });
        if (response && response.status === 400) {
          setIsLoading({ loader: false, type: 'button' });
        } else if (response && response.status === 201) {
          setOpenCollapse({
            agreement: true,
            statement: false,
            addendum: false,
            dspAddendum: false,
            amendment: false,
          });
          removeParams('step');
          getContractDetails(true);
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    });

    client.on('close', () => {
      setShowModal(false);
      setShowEditor(false);
    });
  };

  return (
    <>
      {contractDesignData && showHelloSignPage ? displayHelloSign() : ''}
      <div className="modal-body ">
        <h4
          className="on-boarding mb-3"
          role="presentation"
          onClick={() => setParams('select-contact')}>
          <img className="modal-back-arrow" src={LeftArrowIcon} alt="" />
          Request Signature
        </h4>
        <div className="row mb-2 mt-4">
          <div className="col-6">
            <div className="signature-request">
              TO:
              <span className="email-address">
                {selectedContact && selectedContact.email}
              </span>
            </div>
          </div>
          <div className="col-6 ">
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
          Send a copy of the contract to
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
          Add another email eddress
        </Button>

        <div className=" mt-4">
          {renderbuttonHtml(
            setDisabledReqSignBtn(),
            () => verifyDocument(),
            'Request Signature',
          )}
        </div>
      </div>
    </>
  );
}

export default VerifyDocument;

VerifyDocument.defaultProps = {
  setParams: () => {},
  userInfo: {},
  agreementData: {},
  selectedContact: {},
  setIsLoading: () => {},
  pdfData: '',
  setRequestSignatureError: () => {},
  setContractLoading: () => {},
  setShowModal: () => {},
  setOpenCollapse: () => {},
  removeParams: () => {},
  getContractDetails: () => {},
  setShowEditor: () => {},
  renderbuttonHtml: () => {},
};

VerifyDocument.propTypes = {
  setParams: func,
  userInfo: shape({}),
  agreementData: shape({}),
  selectedContact: shape({}),
  setIsLoading: func,
  pdfData: string,
  setRequestSignatureError: func,
  setContractLoading: func,
  setShowModal: func,
  setOpenCollapse: func,
  removeParams: func,
  getContractDetails: func,
  setShowEditor: func,
  renderbuttonHtml: func,
};
