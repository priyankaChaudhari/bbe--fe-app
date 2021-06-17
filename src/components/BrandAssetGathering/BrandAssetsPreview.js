import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HeaderDownloadFuntionality } from '../../common';
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
                <li>
                  {' '}
                  <img className="header-icon" src={ChatBoxIcon} alt="check" />
                  Comments (0)
                </li>
                <li>
                  <span className="divide-arrow" />
                </li>
                <li>
                  <img className="header-icon" src={TrashIcons} alt="check" />
                  <span>Delete</span>
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
        <div className="pervious-img btn">
          <div
            className="rectangle"
            onClick={() => showImg('prev')}
            disabled={showAssetPreview.index > 0}
            role="presentation">
            <div className="arrow-icon pervious">
              {' '}
              <img width="22px" src={ArrowRightBlackIcon} alt="" />{' '}
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
        </div>
        <div className="assetPreviewImg">
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
            className="image-thumbnail preview-img"
            width="400"
            height="200"
          />
        </div>
        <div className="next-img btn">
          <div
            className="rectangle"
            onClick={() => showImg('next')}
            role="presentation">
            <div className="arrow-icon">
              {' '}
              <img width="22px" src={ArrowRightBlackIcon} alt="" />{' '}
            </div>
          </div>
        </div>
      </BrandAssetsPreviewBody>
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

const BrandAssetsPreviewBody = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .assetPreviewImg {
    position: absolute;
    top: 40%;
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
`;
