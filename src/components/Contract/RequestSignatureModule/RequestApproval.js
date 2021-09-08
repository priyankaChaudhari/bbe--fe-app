import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { string, func, shape } from 'prop-types';

import AddTeamMember from '../../Team/AddTeamMember';
import { createTransactionData } from '../../../api';
import { ThadProfileImg } from '../../../theme/images';
import { FormField, PageLoader } from '../../../common';

function RequestApproval({
  BGSManager,
  selectedContact,
  agreementData,
  getBGSManagersData,
  setIsLoading,
  setShowModal,
  removeParams,
  getContractDetails,
  userInfo,
  pdfData,
  id,
  isLoading,
  renderbuttonHtml,
  setShowCloseBtn,
}) {
  const [approvalNote, setApprovalNote] = useState({});
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [showMemberList, setShowMemberList] = useState({
    show: false,
    add: false,
    modal: false,
  });
  const BGSManagerEmail = BGSManager?.email;
  const draftFrom = agreementData?.draft_from;

  const getActivityInitials = () => {
    const firstName =
      (BGSManager?.first_name && BGSManager.first_name.charAt(0)) || '';
    const lastName =
      (BGSManager?.last_name && BGSManager.last_name.charAt(0)) || '';

    return firstName + lastName;
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
        selectedContact?.first_name ? selectedContact.first_name : ''
      } ${selectedContact?.last_name ? selectedContact.last_name : ''} `;
    }
    if (key === 'customer_role') {
      return `${selectedContact?.role ? selectedContact.role : ''}`;
    }
    return '';
  };

  const displayApprovalInfo = () => {
    return (
      <>
        {draftFrom ? (
          BGSManagerEmail ? (
            ''
          ) : (
            <p className="long-text mb-2 pb-1">
              For approval please add the{' '}
              <span
                className="cursor"
                style={{ color: 'red' }}
                onClick={() => {
                  setShowAddTeamMember(true);
                  setShowMemberList({ add: false, show: true, modal: true });
                  setShowCloseBtn(false);
                }}
                role="presentation">
                BGS Manager
              </span>{' '}
              first.
            </p>
          )
        ) : (
          ''
        )}
        <div className="edit-profile-text float-left mb-4">
          {draftFrom ? (
            BGSManager?.profile ? (
              <img
                src={BGSManager?.profile}
                className="default-user-activity"
                alt="pic"
              />
            ) : BGSManager?.first_name && BGSManager?.last_name ? (
              <div className="avatarName float-left mr-3">
                {getActivityInitials()}
              </div>
            ) : (
              ''
            )
          ) : (
            <img
              src={ThadProfileImg}
              className="default-user-activity"
              alt="pic"
            />
          )}
          <div className="name-email">
            <div className="team-member-name">
              {draftFrom
                ? BGSManagerEmail
                  ? `${BGSManager?.first_name} ${BGSManager?.last_name}`
                  : ''
                : 'Thaddeus Hay'}
            </div>
            <span>
              {draftFrom ? BGSManagerEmail || '' : 'thay@buyboxexperts.com'}
            </span>
          </div>
        </div>
        {draftFrom && BGSManagerEmail ? (
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
        ) : (
          ''
        )}
        {draftFrom ? (
          ''
        ) : (
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
        )}
      </>
    );
  };

  const setAgreementDetailModal = () => {
    setIsLoading({ loader: true, type: 'page' });
    getBGSManagersData();
  };

  const sendRequestApproval = () => {
    const requestApprovalData = {
      ...approvalNote,
      user: userInfo.id,
      contract: agreementData.id,
      contract_status: 'pending contract approval',
      contract_data: pdfData
        .replaceAll('PRINTED_NAME', mapValue('printed_name'))
        .replace('CUSTOMER_ROLE', mapValue('customer_role')),
    };

    if (draftFrom) {
      requestApprovalData.primary_email = BGSManagerEmail || '';
    } else {
      requestApprovalData.primary_email = 'thay@buyboxexperts.com';
    }
    setIsLoading({ loader: true, type: 'button' });
    createTransactionData(requestApprovalData).then((response) => {
      if (response && response.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
      } else if (response && response.status === 201) {
        setShowModal(false);
        removeParams('step');
        toast.success('Approval Requested!');
        getContractDetails();
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <>
      {showAddTeamMember && (showMemberList.show || showMemberList.modal) ? (
        <AddTeamMember
          id={id}
          getCustomerMemberList={null}
          setShowMemberList={setShowMemberList}
          showMemberList={{ ...showMemberList, requestApproval: true }}
          setAgreementDetailModal={setAgreementDetailModal}
          setShowCloseBtn={setShowCloseBtn}
        />
      ) : (
        <>
          <div className="modal-body on-boarding">
            <h4 className="on-boarding mb-4">Request Approval</h4>
            {isLoading.loader && isLoading.type === 'page' ? (
              <PageLoader
                className="modal-loader"
                color="#FF5933"
                type="page"
                width={40}
              />
            ) : (
              <>
                {displayApprovalInfo()}
                <div className=" mt-4">
                  {renderbuttonHtml(
                    draftFrom && !BGSManagerEmail,
                    () => sendRequestApproval(),
                    'Request Approval',
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default RequestApproval;

RequestApproval.defaultProps = {
  BGSManager: {},
  selectedContact: {},
  agreementData: {},
  getBGSManagersData: () => {},
  setIsLoading: () => {},
  setShowModal: () => {},
  removeParams: () => {},
  getContractDetails: () => {},
  userInfo: {},
  pdfData: '',
  id: '',
  isLoading: {},
  renderbuttonHtml: () => {},
  setShowCloseBtn: () => {},
};

RequestApproval.propTypes = {
  BGSManager: shape({}),
  selectedContact: shape({}),
  agreementData: shape({}),
  getBGSManagersData: func,
  setIsLoading: func,
  setShowModal: func,
  removeParams: func,
  getContractDetails: func,
  userInfo: shape({}),
  pdfData: string,
  id: string,
  isLoading: shape({}),
  renderbuttonHtml: func,
  setShowCloseBtn: func,
};
