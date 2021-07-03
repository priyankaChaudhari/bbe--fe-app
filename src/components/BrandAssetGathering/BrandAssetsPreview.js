import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
// import FileViewer from 'react-file-viewer';
import { useForm } from 'react-hook-form';
import {
  HeaderDownloadFuntionality,
  PageLoader,
  FormField,
  Button,
} from '../../common';
import PdfViewer from '../../common/PdfViewer';

import { GroupUser } from '../../theme/Global';
import {
  CloseIcon,
  TrashIcons,
  ChatBoxIcon,
  ArrowRightBlackIcon,
  AnnotationGoal,
} from '../../theme/images';
import Theme from '../../theme/Theme';
import {
  storeNewCommentData,
  getCommentsData,
} from '../../api/BrandAssestsApi';

function BrandAssetsPreview({
  showAssetPreview,
  setShowAssetPreview,
  documentData,
  setShowConfirmationModal,
  isLoading,
}) {
  const { handleSubmit } = useForm();
  const [isImageLoading, setImageLoading] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [newCommentData, setNewCommentData] = useState('');
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentsLoader, setCommentsLoader] = useState(false);
  const [addCommentsLoader, setAddCommentsLoader] = useState(false);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [responseId, setResponseId] = useState(null);
  const list = [
    {
      id: '1',
      name: 'Natalie Parker',
      msg:
        'Comment content goes here. This one is an annotation on the image and so avatar shows number of annotation rather than initials.',
      timestamp: '01/14/2021, 5:13:42 PM MST',
    },
    {
      id: '2',
      name: 'Nana Parker',
      msg:
        'Comment content goes here. This one is an annotation on the image and so avatar shows number of annotation rather than initials.',
      timestamp: '01/4/2021, 5:13:42 PM MST',
    },
    {
      id: '3',
      name: 'Natalie Patekar',
      msg:
        'Comment content goes here. This one is an annotation on the image and so avatar shows number of annotation rather than initials.',
      timestamp: '01/20/2021, 5:13:42 PM MST',
    },
  ];
  const [commentsData, setCommentData] = useState(list);

  const getComments = useCallback((documnetId) => {
    setCommentsLoader(true);
    getCommentsData(documnetId).then((res) => {
      if (res && res.status === 400) {
        //
      }
      if (res && res.status === 200) {
        setCommentData(res.data.results);
        setCommentsCount(res.data.count);
      }
      setCommentsLoader(false);
    });
  }, []);

  const storeCommentData = useCallback(
    (message, documnetId) => {
      setAddCommentsLoader(true);
      storeNewCommentData(message, documnetId, userInfo.email).then((res) => {
        if (res && res.status === 400) {
          //
        }
        if (res && res.status === 201) {
          getComments(showAssetPreview.selectedFile.id);
          setNewCommentData('');
        }
        setAddCommentsLoader(false);
      });
    },
    [getComments, showAssetPreview.selectedFile.id, userInfo.email],
  );

  useEffect(() => {
    if (
      showAssetPreview &&
      showAssetPreview.selectedFile &&
      showAssetPreview.selectedFile.id &&
      responseId === null
    ) {
      getComments(showAssetPreview.selectedFile.id);
      setResponseId('123');
    }
  }, [getComments, showAssetPreview, responseId]);

  const showImg = (type) => {
    setImageLoading(true);
    if (type === 'prev' && showAssetPreview.index > 0) {
      setShowAssetPreview({
        selectedFile: documentData[showAssetPreview.index - 1],
        show: true,
        documents: documentData,
        index: showAssetPreview.index > 0 ? showAssetPreview.index - 1 : 0,
      });
      setTimeout(() => setImageLoading(false), 500);
      getComments(documentData[showAssetPreview.index - 1].id);
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
      setTimeout(() => setImageLoading(false), 500);
      getComments(documentData[showAssetPreview.index + 1].id);
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

  const getInitials = (firstName, lastName) => {
    let first = '';
    let last = '';
    if (firstName !== null && firstName !== undefined) {
      first = firstName.charAt(0) || '';
    }
    if (lastName !== null && lastName !== undefined) {
      last = lastName.charAt(0) || '';
    }
    return first + last;
  };

  const handleChange = (event) => {
    setNewCommentData(event.target.value);
  };

  const onSubmit = () => {
    storeCommentData(newCommentData, showAssetPreview.selectedFile.id);
  };

  const renderComments = () => {
    if (commentsLoader) {
      return <PageLoader component="activityLog" color="#FF5933" type="page" />;
    }
    if (commentsCount === 0) {
      return (
        <div className="mt-5 text-center">
          No comments added for this image yet.
        </div>
      );
    }
    return commentsData.map((item) => {
      return (
        <li key={item.id}>
          <GroupUser>
            <div className="avatarName float-left mr-3">
              {getInitials(item.first_name, item.last_name)}
            </div>
            <div className="activity-user">
              <span className="font-bold">
                {' '}
                {item.first_name} {item.last_name}:
              </span>{' '}
              {item.message}
              <div className="time-date  mt-1">{item.created_at}</div>
            </div>
            <div className="clear-fix" />
          </GroupUser>
        </li>
      );
    });
  };

  const renderCommentPanel = () => {
    return (
      <CommentAnnotationPanel>
        <div className="chat-header">Comments</div>
        <ul className="inbox-comment">{renderComments()}</ul>
        <div className="chat-footer">
          <div className="input-type-box">
            <FormField className="mt-2 mb-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  className="text-area-box"
                  rows="4"
                  placeholder="Enter comment"
                  value={newCommentData}
                  onChange={(event) => handleChange(event)} />

                <div className="add-annotation ">
                  <img src={AnnotationGoal} alt="annotation" />
                  Click to add an annotation
                </div>
                <Button className="btn-primary w-100 mt-3 ">
                  {addCommentsLoader ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Add'
                  )}
                </Button>
              </form>
            </FormField>
          </div>
        </div>
      </CommentAnnotationPanel>
    );
  };

  return (
    <>
      {(isLoading.loader && isLoading.type === 'page') || isImageLoading ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <>
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
                        <span
                          className="cursor"
                          role="presentation"
                          onClick={() =>
                            setShowCommentSection(!showCommentSection)
                          }>
                          Comments ({commentsCount})
                        </span>
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

            <div className="row">
              <div className={showCommentSection ? 'col-9' : 'col-12'}>
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
                    {/* <img
                className="image-thumbnail"
                src={
                  showAssetPreview &&
                  showAssetPreview.selectedFile &&
                  showAssetPreview.selectedFile.presigned_url
                }
                type={
                  showAssetPreview &&
                  showAssetPreview.selectedFile &&
                  showAssetPreview.selectedFile.mime_type
                }
                alt={
                  showAssetPreview &&
                  showAssetPreview.selectedFile &&
                  showAssetPreview.selectedFile.original_name
                }
              /> */}{' '}
                    {showAssetPreview &&
                    showAssetPreview.selectedFile &&
                    showAssetPreview.selectedFile.mime_type.includes('pdf') ? (
                      <BrandAssetPdf>
                        <PdfViewer
                          pdf={
                            showAssetPreview &&
                            showAssetPreview.selectedFile &&
                            showAssetPreview.selectedFile.presigned_url
                          }
                        />
                      </BrandAssetPdf>
                    ) : (
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
                        // width="550"
                        // height="250"
                        role="presentation">
                        <div className="unsupport-file-name">
                          <div className="file-path">
                            {showAssetPreview &&
                              showAssetPreview.selectedFile &&
                              showAssetPreview.selectedFile.original_name}
                          </div>
                        </div>
                      </object>
                    )}
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

              {showCommentSection ? (
                <div className="col-3">{renderCommentPanel()}</div>
              ) : null}
            </div>
          </div>
        </>
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
      id: PropTypes.string,
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
    loader: PropTypes.bool,
    type: PropTypes.string,
  }),
};

const BrandAssetsPreviewBody = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 50%;

  .assetPreviewImg {
    position: absolute;
    top: 50%;
    // background-color: ${Theme.gray8};
    width: 500px;
    height: 250px;
    display: flex;
    justify-content: center;

    .image-thumbnail {
      max-width: 500px;
      max-height: 250px;
    }

    .unsupport-file-name {
      padding: 60px 0;
      color: ${Theme.black};

      .file-path {
        color: ${Theme.black};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 145px;
        vertical-align: middle;
        position: relative;
        margin: 0 auto;
        text-align: center;
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
    margin-top: 40px;
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

  @media only screen and (max-width: 991px) {
    margin-top: 40%;
    .assetPreviewImg {
      top: 35%;
    }
  }
  @media only screen and (max-width: 767px) {
    margin-top: 50%;
    .assetPreviewImg {
      max-width: 200px;
      height: 100px;
      top: 50%;
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
  @media only screen and (max-width: 480px) {
    margin-top: 65%;
    .assetPreviewImg {
      max-width: 170px;
      height: 100px;
      top: 50%;
      left: 28%;
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

const CommentAnnotationPanel = styled.div`
  border-left: 1px solid ${Theme.gray4};
  margin-top: 70px;
  height: calc(100% - -170px);

  .chat-header {
    border-bottom: 1px solid ${Theme.gray4};
    padding: 18px 10px;
    color: ${Theme.gray40};
    font-size: ${Theme.verySmall};
    text-transform: uppercase;
    font-weight: bold;
    position: relative;
  }
  .close-panel {
    position: absolute;
    right: 15px;
    top: 14px;
    border-left: 2px solid ${Theme.black};
    height: 21px;
  }

  .inbox-comment {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: auto;
    height: calc(100vh - 100px - 240px);

    li {
      display: inline-block;
      padding: 15px 15px 0 15px;
    }
  }
  .chat-footer {
    position: fixed;

    bottom: 10px;
    border-top: 1px solid ${Theme.gray4};
    width: 100%;

    .input-type-box {
      margin: 0 10px;
      width: 22%;
      .add-annotation {
        color: ${Theme.gray85};
        font-size: ${Theme.extraNormal};
        img {
          width: 17px;
          vertical-align: text-top;
          margin: 0 8px;
        }
      }
    }
  }
  @media only screen and (max-width: 991px) {
    border-left: none;
    height: 100%;
    margin-top: 20px;

    .inbox-comment {
      height: calc(100vh - 100px - 545px);
    }
  }
  @media only screen and (max-width: 767px) {
    .inbox-comment {
      height: calc(100vh - 445px);
    }
  }
`;

const BrandAssetPdf = styled.div`
  min-height: 500px;
  overflow: auto;
  margin-top: -130px;
  height: 75vh;

  .react-pdf__Document {
    width: 100% !important;
    background-color: ${Theme.gray3} !important;
    padding-right: 0;

    .react-pdf__Page {
      background-color: ${Theme.gray3} !important;

      & .pdf-view {
        width: 100% !important;
        background-color: ${Theme.gray3} !important;
      }

      .react-pdf__Page__canvas {
        top: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: auto;
      }
      &:first-child {
        top: 0 !important;
        margin-bottom: 0 !important;
      }
    }
    .feDBFU .not-found {
      font-weight: 500;
      color: black;
      margin-top: -70px;
    }
    @media only screen and (min-width: 1500px) {
      // padding-right: 400px;
    }
    @media only screen and (max-width: 991px) {
      padding-left: 0px !important;
      padding-right: 0;

      .react-pdf__Page {
        &:first-child {
          top: 0 !important;
          margin-bottom: 0 !important;
        }
      }
    }
    @media only screen and (max-width: 767px) {
      .react-pdf__Page {
        &:first-child {
          top: 0 !important;
          margin-bottom: 0 !important;
        }
      }
    }
  }
  @media only screen and (max-width: 991px) {
    margin-top: -16px;
    min-height: 100px;
    height: 40vh;
  }
  @media only screen and (max-width: 767px) {
    min-height: 100px;
    height: 32vh;
  }
`;
