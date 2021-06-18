import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HeaderDownloadFuntionality, PageLoader } from '../../common';
import {
  CloseIcon,
  TrashIcons,
  ChatBoxIcon,
  ArrowRightBlackIcon,
} from '../../theme/images';
import Theme from '../../theme/Theme';

function BrandAssetsPreview({
  showAssetPreview,
  setShowAssetPreview,
  documentData,
  setShowConfirmationModal,
  isLoading,
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
    <>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
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
                    <li>
                      {' '}
                      <img
                        className="header-icon"
                        src={ChatBoxIcon}
                        alt="check"
                      />
                      <span className="cursor">Comments (0)</span>
                    </li>
                    <li>
                      <span className="divide-arrow" />
                    </li>
                    <li
                      onClick={() => setShowConfirmationModal(true)}
                      role="presentation">
                      <img
                        className="header-icon"
                        src={TrashIcons}
                        alt="check"
                      />
                      <span className="cursor">Delete</span>
                    </li>
                    <li>
                      <span className="divide-arrow hide-mobile" />
                    </li>
                    <li>
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
          <BrandAssetsPreviewBody>
            <div
              className={
                showAssetPreview.index === 0
                  ? 'pervious-img btn disabled-slider-btn'
                  : 'pervious-img btn'
              }
              role="presentation"
              onClick={() => showImg('prev')}>
              <div
                className={
                  showAssetPreview.index === 0
                    ? 'arrow-icon pervious disabled-slider-btn'
                    : 'arrow-icon pervious'
                }>
                {' '}
                <img width="22px" src={ArrowRightBlackIcon} alt="" />{' '}
              </div>
            </div>
            <div className="assetPreviewImg">
              <object
                className="image-thumbnail"
                data={
                  showAssetPreview &&
                  showAssetPreview.selectedFile &&
                  showAssetPreview.selectedFile.presigned_url
                }
                type={
                  showAssetPreview &&
                  showAssetPreview.selectedFile &&
                  showAssetPreview.selectedFile.mime_type
                }
                // width="400"
                // height="200"
                role="presentation">
                <div className="unsupport-file-name">
                  <div
                    className="file-path"
                    // href={
                    //   showAssetPreview &&
                    //   showAssetPreview.selectedFile &&
                    //   showAssetPreview.selectedFile.presigned_url
                    // }
                  >
                    {showAssetPreview &&
                      showAssetPreview.selectedFile &&
                      showAssetPreview.selectedFile.original_name}
                  </div>
                </div>
              </object>
            </div>
            <div
              className={
                showAssetPreview.index ===
                (showAssetPreview.documents &&
                  showAssetPreview.documents.length - 1)
                  ? 'next-img btn disabled-slider-btn'
                  : 'next-img btn'
              }
              role="presentation"
              onClick={() => showImg('next')}>
              <div
                className={
                  showAssetPreview.index ===
                  (showAssetPreview.documents &&
                    showAssetPreview.documents.length - 1)
                    ? 'arrow-icon disabled-slider-btn'
                    : 'arrow-icon'
                }>
                {' '}
                <img width="22px" src={ArrowRightBlackIcon} alt="" />{' '}
              </div>
            </div>
          </BrandAssetsPreviewBody>
        </div>
      )}
    </>
  );
}

export default BrandAssetsPreview;

BrandAssetsPreview.defaultProps = {
  showAssetPreview: {},
  setShowAssetPreview: () => {},
  documentData: [],
  setShowConfirmationModal: () => {},
  isLoading: {},
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
  setShowConfirmationModal: PropTypes.func,
  isLoading: PropTypes.shape({
    loader: PropTypes.string,
    type: PropTypes.string,
  }),
};

const BrandAssetsPreviewBody = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .assetPreviewImg {
    position: absolute;
    top: 40%;
    background-color: ${Theme.gray8};
    width: 400px;
    height: 200px;

    .image-thumbnail {
      width: 400px;
      height: 200px;
    }

    .unsupport-file-name {
      padding: 80px 0;
      color: ${Theme.black};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 145px;
      margin: 0 auto;
      text-align: center;

      .file-path {
        color: ${Theme.black};
      }
    }
  }

  .btn {
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray4};
    border-radius: 8px;
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    cursor: pointer;
    &.pervious-img {
      left: 29px;
    }
    &.next-img {
      right: 29px;
    }
    .arrow-icon {
      width: 15px;
      margin: 13px 0px 0px 13px;
      vertical-align: bottom;
      top: 5px;
      &.pervious {
        transform: rotate(180deg);
        margin: 8px 0px 0px 18px;
      }
    }
  }

  @media only screen and (max-width: 767px) {
    .assetPreviewImg {
      max-width: 200px;
      height: 100px;
      top: 45%;
      .image-thumbnail {
        max-width: 200px;
        height: 100px;
      }
    }
    .btn {
      &.pervious-img {
        left: 15px;
      }
      &.next-img {
        right: 15px;
      }
      .arrow-icon {
        width: 15px;
        margin: 13px 0px 0px 13px;
        vertical-align: bottom;
        top: 5px;
        &.pervious {
          transform: rotate(180deg);
          margin: 8px 0px 0px 18px;
        }
      }
    }
  }
  @media only screen and (max-width: 450px) {
    .assetPreviewImg {
      max-width: 170px;
      height: 100px;
      top: 45%;
      left: 24%;
      .image-thumbnail {
        max-width: 170px;
        height: 100px;
      }
    }
    .btn {
      .arrow-icon {
        width: 15px;
        margin: 13px 0px 0px 13px;
        vertical-align: bottom;
        top: 5px;
        &.pervious {
          transform: rotate(180deg);
          margin: 8px 0px 0px 18px;
        }
      }
    }
  }
`;
