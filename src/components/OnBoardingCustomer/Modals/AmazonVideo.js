import React from 'react';

import Modal from 'react-modal';
import { string, shape, bool, func } from 'prop-types';

import { CloseIcon } from '../../../theme/images';
import { ModalBox, PageLoader } from '../../../common';

export default function AmazonVideo({
  showVideo,
  setShowVideo,
  isLoading,
  videoData,
  marketplaceDetails,
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

  const mapVideoData = () => {
    if (marketplaceDetails.type === 'Hybrid') {
      if (showVideo[2]) return videoData.seller_central_info;
      if (showVideo[3]) return videoData.seller_ad_info;
      if (showVideo[5]) return videoData.vendor_central_info;
      if (showVideo[6]) return videoData.vendor_ad_info;
    }
    if (marketplaceDetails.type === 'Seller') {
      if (showVideo[2]) return videoData.seller_central_info;
      if (showVideo[3]) return videoData.seller_ad_info;
    }
    if (marketplaceDetails.type === 'Vendor') {
      if (showVideo[2]) return videoData.vendor_central_info;
      if (showVideo[3]) return videoData.vendor_ad_info;
    }
    return '';
  };

  return (
    <Modal
      isOpen={showVideo[Object.keys(showVideo)]}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={() => setShowVideo({ showVideo: false })}
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
              src={videoData ? mapVideoData() : ''}
            />
          </div>
        )}
      </ModalBox>
    </Modal>
  );
}

AmazonVideo.propTypes = {
  showVideo: string.isRequired,
  setShowVideo: func.isRequired,
  isLoading: shape({
    loader: bool,
    type: string,
  }).isRequired,
  videoData: shape({}).isRequired,
  marketplaceDetails: shape({
    type: string,
  }).isRequired,
};
