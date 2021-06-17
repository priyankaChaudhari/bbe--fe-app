import React from 'react';
import PropTypes from 'prop-types';
import { HeaderDownloadFuntionality } from '../../common';
import { CloseIcon, TrashIcons } from '../../theme/images';

function BrandAssetsPreview({
  showAssetPreview,
  setShowAssetPreview,
  documentData,
}) {
  const showImg = (type) => {
    if (type === 'prev' && showAssetPreview.index > 0) {
      setShowAssetPreview({
        selectedFile: documentData[showAssetPreview.index - 1],
        show: true,
        documents: documentData,
        index: showAssetPreview.index > 0 ? showAssetPreview.index - 1 : 0,
      });
    }
    if (type === 'next' && showAssetPreview.index < documentData.length - 1) {
      setShowAssetPreview({
        selectedFile: documentData[showAssetPreview.index + 1],
        show: true,
        documents: documentData,
        index:
          showAssetPreview.index < documentData.length - 1
            ? showAssetPreview.index + 1
            : documentData.length - 1,
      });
    }
  };

  const closeModal = () => {
    setShowAssetPreview({
      selectedFile: null,
      show: false,
      documents: documentData,
      index: 0,
    });
  };

  return (
    <div className="on-boarding-container">
      <HeaderDownloadFuntionality>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              {' '}
              {showAssetPreview &&
                showAssetPreview.selectedFile &&
                showAssetPreview.selectedFile.original_name}
            </div>
            <div className="col-md-6 col-sm-12">
              <ul className="contract-download-nav">
                <li className="m-2">Comments (0)</li>
                <li className="m-2">
                  <img
                    className="assets-trash-icon"
                    src={TrashIcons}
                    alt="check"
                  />
                  <span>Delete</span>
                </li>
                <li className="m-2">
                  <img
                    width="18px"
                    src={CloseIcon}
                    alt="close"
                    className="float-right cursor remove-cross-icon"
                    role="presentation"
                    onClick={() => closeModal()}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </HeaderDownloadFuntionality>
      <div className="  assetPreviewImg">
        <div className="col-2 prev-btn ">
          <div
            className="rectangle"
            onClick={() => showImg('prev')}
            disabled={showAssetPreview.index > 0}
            role="presentation">
            <div className="arrow-left "> -</div>
          </div>
        </div>
        {/* <img
          // width="400px"
          // height="400px"
          className="col-10"
          src={
            showAssetPreview &&
            showAssetPreview.selectedFile &&
            showAssetPreview.selectedFile.presigned_url
          }
          alt="asset-preview"
        /> */}

        <embed
          type={
            showAssetPreview &&
            showAssetPreview.selectedFile &&
            showAssetPreview.selectedFile.mime_type
          }
          src={
            showAssetPreview &&
            showAssetPreview.selectedFile &&
            showAssetPreview.selectedFile.presigned_url
          }
          className="image-thumbnail col-10 preview-img"
          width="250"
          height="200"
        />
        <div className="col-2 next-btn ">
          <div
            className="rectangle"
            onClick={() => showImg('next')}
            role="presentation">
            <div className="arrow-right"> - </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandAssetsPreview;

BrandAssetsPreview.defaultProps = {
  showAssetPreview: {},
  setShowAssetPreview: () => {},
  documentData: [],
};

BrandAssetsPreview.propTypes = {
  setShowAssetPreview: PropTypes.func,
  documentData: PropTypes.arrayOf(PropTypes.object),
  showAssetPreview: PropTypes.shape({
    selectedFile: PropTypes.shape({
      presigned_url: PropTypes.string,
      mime_type: PropTypes.string,
      original_name: PropTypes.string,
    }),
    index: PropTypes.number,
    show: PropTypes.bool,
    documents: PropTypes.arrayOf(PropTypes.object),
  }),
};
