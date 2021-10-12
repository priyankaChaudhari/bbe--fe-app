import React from 'react';

import Modal from 'react-modal';
import { string, shape, bool, func } from 'prop-types';

import { CloseIcon } from '../../../theme/images';
import { ModalBox, PageLoader } from '../../../common';
import {
  PATH_COMPANY_DETAILS,
  PATH_UNAUTHORIZED_COMPANY_DETAILS,
} from '../../../constants';

export default function VideoModal({
  showVideo,
  setShowVideo,
  isLoading,
  videoData,
  history,
}) {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '900px ',
      width: '100% ',
      minHeight: '200px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  return (
    <Modal
      isOpen={showVideo}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={() => setShowVideo(false)}
        role="presentation"
      />
      <ModalBox>
        {isLoading.loader && isLoading.type === 'video' ? (
          <PageLoader color="#FF5933" type="page" />
        ) : (
          <div className="modal-body">
            <iframe
              title="video "
              className="embed-responsive-item w-100 "
              allow="accelerometer; autoplay;"
              frameBorder="0"
              allowFullScreen
              src={
                videoData
                  ? history.location.pathname.includes(PATH_COMPANY_DETAILS) ||
                    history.location.pathname.includes(
                      PATH_UNAUTHORIZED_COMPANY_DETAILS,
                    )
                    ? videoData.step_4_video
                    : videoData.step_2_video
                  : ''
              }
            />
          </div>
        )}
      </ModalBox>
    </Modal>
  );
}

VideoModal.propTypes = {
  showVideo: bool.isRequired,
  setShowVideo: func.isRequired,
  isLoading: shape({
    loader: bool,
    type: string,
  }).isRequired,
  videoData: shape({
    step_2_video: string,
    step_4_video: string,
  }).isRequired,
  history: shape({}).isRequired,
};
