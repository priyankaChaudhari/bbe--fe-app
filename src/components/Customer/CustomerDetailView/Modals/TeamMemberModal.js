import React from 'react';

import Modal from 'react-modal';
import { string, func, shape, bool, arrayOf } from 'prop-types';

import { AddTeamMember, TeamMembers } from '../../../Team';

export default function TeamMemberModal({
  id,
  currentMembers,
  showMemberList,
  setShowMemberList,
  setAgreementDetailModal,
  customStyles,
  getActivityLogInfo,
  getCustomerMemberList,
}) {
  return (
    <>
      {showMemberList.modal && !showMemberList.agreement ? (
        <Modal
          isOpen={showMemberList.modal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Add team modal">
          <TeamMembers
            customerID={id}
            currentMembers={currentMembers}
            setShowMemberList={setShowMemberList}
            getCustomerMemberList={getCustomerMemberList}
          />
        </Modal>
      ) : showMemberList.modal && showMemberList.agreement ? (
        <Modal
          isOpen={showMemberList.modal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Add team modal">
          <AddTeamMember
            id={id}
            getCustomerMemberList={getCustomerMemberList}
            setShowMemberList={setShowMemberList}
            showMemberList={showMemberList}
            setAgreementDetailModal={setAgreementDetailModal}
            getActivityLogInfo={getActivityLogInfo}
          />
        </Modal>
      ) : null}
    </>
  );
}

TeamMemberModal.defaultProps = {
  customStyles: {},
  setShowMemberList: () => {},
  setAgreementDetailModal: () => {},
};

TeamMemberModal.propTypes = {
  setShowMemberList: func,
  id: string.isRequired,
  currentMembers: arrayOf(shape({})).isRequired,
  showMemberList: shape({
    modal: bool,
    add: bool,
  }).isRequired,
  customStyles: shape({}),
  setAgreementDetailModal: func,
  getActivityLogInfo: func.isRequired,
  getCustomerMemberList: func.isRequired,
};
