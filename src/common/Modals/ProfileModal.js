import React from 'react';

import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { bool, func, shape } from 'prop-types';

import SuccessMsg from '../SuccessMsg';
import { EditProfile } from '../../components/Profile';
import { CloseIcon } from '../../theme/images';
import { showProfileLoader } from '../../store/actions/userState';

export default function ProfileModal({
  showModal,
  setShowModal,
  userInfo,
  setShowSuccessMsg,
  showSuccessMsg,
}) {
  const dispatch = useDispatch();
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <Modal
      isOpen={showModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Profile modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cross-icon cursor"
        onClick={() => {
          setShowModal(false);
          dispatch(showProfileLoader(false));
        }}
        role="presentation"
      />
      <div className="modal-body">
        <div className="row">
          <div
            className={
              showSuccessMsg.show
                ? 'col-12 pb-1 pt-2 pl-0 pr-0'
                : 'col-12 pb-1 pt-2 pl-0 pr-0'
            }>
            <span className="edit-profiles">EDIT PROFILE</span>
          </div>
          <div className="success-msg-pop-up">
            {showSuccessMsg.show ? (
              <SuccessMsg property="" message={showSuccessMsg.message} />
            ) : (
              ''
            )}
          </div>
        </div>

        <EditProfile
          userInfo={userInfo}
          setShowSuccessMsg={setShowSuccessMsg}
        />
      </div>
    </Modal>
  );
}

ProfileModal.defaultProps = {
  showModal: false,
  setShowModal: () => {},
  setShowSuccessMsg: () => {},
};

ProfileModal.propTypes = {
  showModal: bool,
  setShowModal: func,
  setShowSuccessMsg: func,
  userInfo: shape({}).isRequired,
  showSuccessMsg: shape({
    show: bool,
  }).isRequired,
};
