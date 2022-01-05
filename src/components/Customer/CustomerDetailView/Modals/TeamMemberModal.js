/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import Modal from 'react-modal';
import { string, func, shape, bool } from 'prop-types';

import { AddTeamMember, EditTeamMember, TeamMembers } from '../../../Team';

// !      Remove  the eslint disables-once work is done
export default function TeamMemberModal({
  id,
  currentMembers,
  showMemberList,
  setShowMemberList,
  setAgreementDetailModal,
  userInfo,
  customStyles,
  getActivityLogInfo,
}) {
  const [teamDeleteModal, setTeamDeleteModal] = useState(false);
  const alertCustomStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '474px ',
      width: '100% ',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <>
      {showMemberList.modal ? (
        <Modal
          isOpen={showMemberList.modal}
          style={teamDeleteModal ? alertCustomStyles : customStyles}
          ariaHideApp={false}
          contentLabel="Add team modal">
          <TeamMembers
            customerID={id}
            currentMembers={currentMembers}
            setShowMemberList={setShowMemberList}
          />
          {/* {showMemberList.add ? (
        <AddTeamMember
          id={id}
          getCustomerMemberList={getCustomerMemberList}
          setShowMemberList={setShowMemberList}
          showMemberList={showMemberList}
          setAgreementDetailModal={setAgreementDetailModal}
          getActivityLogInfo={getActivityLogInfo}
        />
      ) : (
        <EditTeamMember
          id={id}
          getCustomerMemberList={getCustomerMemberList}
          setShowMemberList={setShowMemberList}
          showMemberList={showMemberList}
          setTeamDeleteModal={setTeamDeleteModal}
          userInfo={userInfo}
          getActivityLogInfo={getActivityLogInfo}
        />
      )} */}
        </Modal>
      ) : null}
    </>
  );
}

TeamMemberModal.defaultProps = {
  userInfo: {},
  customStyles: {},
  setShowMemberList: () => {},
  setAgreementDetailModal: () => {},
};

TeamMemberModal.propTypes = {
  setShowMemberList: func,
  id: string.isRequired,
  currentMembers: shape({}).isRequired,
  showMemberList: shape({
    modal: bool,
    add: bool,
  }).isRequired,
  userInfo: shape({
    role: string,
    id: string,
  }),
  customStyles: shape({}),
  setAgreementDetailModal: func,
  getActivityLogInfo: func.isRequired,
};
