import React, { useState, useCallback, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import Theme from '../../theme/Theme';
import {
  HeaderDownloadFuntionality,
  PageLoader,
  FormField,
  Button,
  CommonPagination,
  ErrorMsg,
  PdfAnnotator,
} from '../../common';
import { GroupUser } from '../../theme/Global';
import {
  CloseIcon,
  TrashIcons,
  ChatBoxIcon,
  ArrowRightBlackIcon,
  AnnotationGoal,
  RedTrashIcon,
} from '../../theme/images';
import {
  storeNewCommentData,
  getCommentsData,
  deleteComment,
  updateComment,
} from '../../api';

function BrandAssetsPreview({
  showAssetPreview,
  setShowAssetPreview,
  documentData,
  setShowConfirmationModal,
  isLoading,
  isDeleted,
  setIsImgDeleted,
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
  const [commentsData, setCommentData] = useState();
  const [storeCommentError, setStoreCommentError] = useState();
  const [maxAnnotationNumber, setMaxAnnotationNumber] = useState(null);
  const [clickOnAddNewAnnotation, setClickOnAddNewAnnotation] = useState(false);
  const [pageNumber, setPageNumber] = useState();
  const [showClickModal, setShowClickModal] = useState(false);
  const [isClickedOnImage, setIsClickedOnImage] = useState(false);
  const [newAnnotationPosition, setNewAnnotationPosition] = useState({
    top: 0,
    left: 0,
  });
  const fileType = ['font/ttf', 'font/otf', 'font/woff'];
  const [showDelete, setShowDelete] = useState(false);
  const [showTextArea, setShowTextArea] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowDelete(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const getComments = useCallback((currentPage, documnetId) => {
    setCommentsLoader(true);
    getCommentsData(currentPage, documnetId).then((res) => {
      if (res && res.status === 400) {
        setCommentsLoader(false);
      }
      if (res && res.status === 200) {
        setCommentData(res.data.results);
        setCommentsCount(res.data.count);
        setCommentsLoader(false);
        setImageLoading(false);
        if (res.data.max_annotation === null) {
          setMaxAnnotationNumber(1);
        } else {
          setMaxAnnotationNumber(res.data.max_annotation + 1);
        }
      }
    });
  }, []);

  const storeCommentData = useCallback(
    (message, documnetId, newPosition, annotationNumber) => {
      setAddCommentsLoader(true);

      storeNewCommentData(
        message,
        documnetId,
        userInfo.email,
        newPosition,
        annotationNumber,
        showClickModal,
      ).then((res) => {
        if (res && res.status === 400) {
          setStoreCommentError(res.data);
        }
        if (res && res.status === 201) {
          getComments(1, showAssetPreview.selectedFile.id);
          setPageNumber(1);
          setNewCommentData('');
          setClickOnAddNewAnnotation(false);
          setNewAnnotationPosition({ left: 0, top: 0 });
          setIsClickedOnImage(false);
          setShowClickModal(false);
        }
        setAddCommentsLoader(false);
      });
    },
    [getComments, showAssetPreview, userInfo.email, showClickModal],
  );

  useEffect(() => {
    if (isDeleted) {
      setResponseId(null);
      setCommentData();
      setIsClickedOnImage(false);
      setNewCommentData('');
      setClickOnAddNewAnnotation(false);
      setNewAnnotationPosition({
        left: 0,
        top: 0,
      });
      setStoreCommentError();
      setIsImgDeleted(false);

      setShowClickModal(false);
      setResponseId(null);
      setShowAssetPreview({
        ...showAssetPreview,
        selectedFile: null,
      });
    }
    if (
      showAssetPreview &&
      showAssetPreview.selectedFile &&
      showAssetPreview.selectedFile.id &&
      responseId === null
    ) {
      getComments(1, showAssetPreview.selectedFile.id);
      setResponseId('123');
    }
  }, [
    getComments,
    showAssetPreview,
    responseId,
    isDeleted,
    setIsImgDeleted,
    setShowAssetPreview,
  ]);

  const showImg = (type) => {
    setImageLoading(true);
    if (type === 'prev' && showAssetPreview.index > 0) {
      setShowAssetPreview({
        selectedFile: documentData[showAssetPreview.index - 1],
        show: true,
        documents: documentData,
        index: showAssetPreview.index > 0 ? showAssetPreview.index - 1 : 0,
      });

      getComments(1, documentData[showAssetPreview.index - 1].id);
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

      getComments(1, documentData[showAssetPreview.index + 1].id);
    }
    setNewCommentData('');
    setClickOnAddNewAnnotation(false);
    setNewAnnotationPosition({
      left: 0,
      top: 0,
    });
    setStoreCommentError();

    setShowClickModal(false);
    setIsClickedOnImage(false);
  };

  const closeModal = () => {
    setShowAssetPreview({
      selectedFile: null,
      show: false,
      documents: documentData,
      index: 0,
    });
    setNewCommentData('');
    setClickOnAddNewAnnotation(false);
    setNewAnnotationPosition({
      left: 0,
      top: 0,
    });

    setMaxAnnotationNumber(null);
    setStoreCommentError();

    setShowClickModal(false);
    setIsClickedOnImage(false);
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
    setStoreCommentError();
  };

  const onSubmit = () => {
    storeCommentData(
      newCommentData,
      showAssetPreview.selectedFile.id,
      newAnnotationPosition,
      maxAnnotationNumber,
    );
  };

  const onCommnetsLabelClick = () => {
    if (showCommentSection) {
      setNewCommentData('');
      setClickOnAddNewAnnotation(false);
      setNewAnnotationPosition({
        left: 0,
        top: 0,
      });
      setStoreCommentError();

      setShowClickModal(false);
      setIsClickedOnImage(false);
    }
    setShowCommentSection(!showCommentSection);
  };

  const onMouseDown = (e) => {
    e.preventDefault(true);

    if (!isClickedOnImage) {
      setIsClickedOnImage(true);
    }

    const theThing = document.querySelector('#thing');
    const container = document.querySelector('#imgContainer');

    if (theThing) {
      const offset = container.getBoundingClientRect();
      const clickX = e.clientX - offset.left - theThing.clientWidth / 2;
      const clickY = e.clientY - offset.top - theThing.clientHeight / 2;
      const percentXImg = (clickX * 100) / offset.width;
      const percentYImg = (clickY * 100) / offset.height;

      setNewAnnotationPosition({
        left: percentXImg,
        top: percentYImg,
      });
    }
  };

  const onPdfMouseDown = (e, selector) => {
    if (clickOnAddNewAnnotation) {
      e.preventDefault(true);

      if (!isClickedOnImage) {
        setIsClickedOnImage(true);
      }
      const container = document.querySelector(`.page_${selector}`);
      const theThing = document.querySelector('#thing');

      if (theThing) {
        const offset = container.getBoundingClientRect();
        const clickX = e.clientX - offset.left - theThing.clientWidth / 2;
        const clickY = e.clientY - offset.top - theThing.clientHeight / 2;
        const percentXImg = (clickX * 100) / offset.width;
        const percentYImg = (clickY * 100) / offset.height;

        setNewAnnotationPosition({
          page: `${selector}`,
          left: percentXImg,
          top: percentYImg,
        });
      }
    }
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getComments(currentPage, showAssetPreview.selectedFile.id);
  };

  const cancelAnnotation = () => {
    setShowClickModal(false);
    setClickOnAddNewAnnotation(false);
    setIsClickedOnImage(false);
    setNewAnnotationPosition({ left: 0, top: 0 });
  };

  const setAddButtonClass = () => {
    if (
      newCommentData === '' ||
      (clickOnAddNewAnnotation && !isClickedOnImage)
    ) {
      return 'btn-primary w-100 mt-3 disabled';
    }
    return 'btn-primary w-100 mt-3';
  };

  const onDeleteComment = (id) => {
    deleteComment(id).then(() => {
      let pageNo = pageNumber;
      if (commentsCount % 10 === 1) {
        if (pageNumber === 1) {
          pageNo = 1;
        } else {
          pageNo = pageNumber - 1;
        }
      }

      getComments(pageNo, showAssetPreview.selectedFile.id);
      setPageNumber(pageNo);
      setShowDelete({ [id]: false });
    });
  };

  const editComment = (id) => {
    setAddCommentsLoader(true);
    updateComment(id, { message: newCommentData }).then((res) => {
      if (res && res.status === 200) {
        getComments(pageNumber, showAssetPreview.selectedFile.id);
        setShowTextArea(false);
        setNewCommentData('');
        setAddCommentsLoader(false);
      }
      if (res && res.status === 400) {
        setStoreCommentError(res.data);
        setAddCommentsLoader(false);
      }
    });
  };

  const generateTextArea = (item) => {
    return (
      <FormField className="mt-2 mb-2">
        <textarea
          className="text-area-box displayNone"
          rows="4"
          placeholder="Enter comment"
          defaultValue={item.message}
          onChange={(event) => handleChange(event)}
        />
        <ErrorMsg>
          {storeCommentError &&
            storeCommentError.message &&
            storeCommentError.message[0]}
        </ErrorMsg>{' '}
        <div className="row">
          <div className="col-6">
            <Button
              className="btn-primary w-100 mt-3"
              type="button"
              onClick={() => editComment(item.id)}
              disabled={addCommentsLoader || newCommentData === ''}>
              {addCommentsLoader ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                'Update'
              )}
            </Button>
          </div>
          <div className="col-6">
            <Button
              className="btn-transparent w-100 mt-3"
              type="button"
              onClick={() => {
                setShowTextArea(false);
                setNewCommentData('');
              }}>
              Cancel
            </Button>
          </div>
        </div>
      </FormField>
    );
  };

  const renderComments = () => {
    if (commentsLoader) {
      return (
        <PageLoader
          component="comment-side-bar"
          color="#FF5933"
          height="40"
          width="40"
          type="sidebar"
        />
      );
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
              {item.annotation
                ? item.annotation
                : getInitials(item.first_name, item.last_name)}
            </div>
            <div className="activity-user">
              <span className="font-bold">
                {' '}
                {item.first_name} {item.last_name}:
              </span>{' '}
              {showTextArea && showTextArea[item.id] ? (
                <>{generateTextArea(item)}</>
              ) : (
                <>{item.message}</>
              )}
              {item.user === userInfo.id ? (
                <div className="time-date  mt-1">
                  {item.created_at}
                  <span className="pin">
                    <ul className="more-action">
                      <>
                        <li
                          role="presentation"
                          onClick={() => setShowTextArea({ [item.id]: true })}>
                          {' '}
                          <span className="dot" /> Edit
                        </li>
                        <li className="delete">
                          <div
                            className="delete cursor"
                            onClick={() =>
                              setShowDelete({
                                [item.id]: true,
                              })
                            }
                            role="presentation">
                            <span className="dot" /> Delete{' '}
                            {showDelete && showDelete[item.id] ? (
                              <div
                                ref={ref}
                                className="delete-msg confirm-delete-anno"
                                role="presentation"
                                onClick={() => onDeleteComment(item.id)}>
                                {' '}
                                <img
                                  className="red-trash-icon"
                                  src={RedTrashIcon}
                                  alt="check"
                                />
                                Confirm Delete
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </li>
                      </>
                    </ul>
                  </span>
                </div>
              ) : (
                // <>
                //   <div
                //     className="time-date  mt-1 cursor"
                //     onClick={() => setShowTextArea({ [item.id]: true })}
                //     role="presentation">
                //     Edit
                //   </div>
                //   <div
                //     className="time-date  mt-1 cursor"
                //     onClick={() =>
                //       setShowDelete({
                //         [item.id]: true,
                //       })
                //     }
                //     role="presentation">
                //     Delete
                //     {showDelete && showDelete[item.id] ? (
                //       <div
                //         ref={ref}
                //         className="delete-msg"
                //         role="presentation"
                //         onClick={() => onDeleteComment(item.id)}>
                //         {' '}
                //         <img
                //           className="red-trash-icon"
                //           src={RedTrashIcon}
                //           alt="check"
                //         />
                //         Confirm Delete
                //       </div>
                //     ) : (
                //       ''
                //     )}
                //   </div>
                // </>
                ''
              )}
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
        <div className="chat-header">
          Comments
          <div
            className="close-panel"
            role="presentation"
            onClick={() => onCommnetsLabelClick()}>
            <img width="20px" src={ArrowRightBlackIcon} alt="arro" />
          </div>
        </div>
        <ul className={!showTextArea ? 'inbox-coment' : 'inbox-height'}>
          {renderComments()}
        </ul>
        {commentsCount > 10 ? (
          <Footer
            className={!showTextArea ? 'pdf-footer' : 'pdf-footer-height'}>
            <CommonPagination
              count={commentsCount}
              pageNumber={pageNumber}
              handlePageChange={handlePageChange}
              showLessItems
            />
          </Footer>
        ) : null}
        {!showTextArea ? (
          <div className="chat-footer">
            <div className="input-type-box">
              <FormField className="mt-2 mb-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <textarea
                    className="text-area-box displayNone"
                    rows="4"
                    placeholder="Enter comment"
                    value={newCommentData}
                    onChange={(event) => handleChange(event)}
                  />
                  <ErrorMsg>
                    {storeCommentError &&
                      storeCommentError.message &&
                      storeCommentError.message[0]}
                  </ErrorMsg>

                  {!fileType.includes(
                    showAssetPreview &&
                      showAssetPreview.selectedFile &&
                      showAssetPreview.selectedFile.mime_type,
                  ) ? (
                    <div
                      className="add-annotation mt-2"
                      onClick={() => {
                        setShowClickModal(true);
                        setClickOnAddNewAnnotation(true);
                      }}
                      role="presentation">
                      <img src={AnnotationGoal} alt="annotation" />
                      Click to add an annotation
                    </div>
                  ) : null}
                  <Button className={setAddButtonClass()}>
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
        ) : (
          ''
        )}
      </CommentAnnotationPanel>
    );
  };

  const renderImageAnnotations = (flag = false) => {
    if (showCommentSection && flag) {
      return (
        commentsData &&
        commentsData.map((item) => {
          if (item.annotation !== null) {
            return (
              <div
                id={item.id}
                className="annotation"
                style={{
                  position: 'absolute',
                  left: `${item.x_coordinate}%`,
                  top: `${item.y_coordinate}%`,
                }}>
                {item.annotation}
              </div>
            );
          }
          return null;
        })
      );
    }

    if (clickOnAddNewAnnotation) {
      return (
        <div
          id="thing"
          className={isClickedOnImage ? 'annotation' : 'annotationNone'}
          style={{
            position: 'absolute',
            left: `${newAnnotationPosition.left}%`,
            top: `${newAnnotationPosition.top}%`,
          }}>
          {isClickedOnImage ? maxAnnotationNumber : null}
        </div>
      );
    }
    return null;
  };

  const renderPDFAnnotations = (flag = false, index) => {
    if (showCommentSection && flag) {
      return (
        commentsData &&
        commentsData.map((item) => {
          if (item.annotation !== null) {
            return (
              <div
                id={item.id}
                className={
                  item.pdf_page_number === index
                    ? 'annotation'
                    : 'annotationNone'
                }
                style={{
                  position: 'absolute',
                  left: `${item.x_coordinate}%`,
                  top: `${item.y_coordinate}%`,
                }}>
                {item.pdf_page_number === index ? item.annotation : ''}
              </div>
            );
          }
          return null;
        })
      );
    }

    if (clickOnAddNewAnnotation) {
      return (
        <div
          id="thing"
          className={
            newAnnotationPosition.page === `${index}`
              ? 'annotation'
              : 'annotationNone'
          }
          style={{
            position: 'absolute',
            left: `${newAnnotationPosition.left}%`,
            top: `${newAnnotationPosition.top}%`,
          }}>
          {isClickedOnImage
            ? newAnnotationPosition.page === `${index}`
              ? maxAnnotationNumber
              : ''
            : null}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {(isLoading.loader && isLoading.type === 'page') || isImageLoading ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <>
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
                    <li
                      className={commentsLoader ? 'disabled' : null}
                      key="comment">
                      {' '}
                      <img
                        className="header-icon"
                        src={ChatBoxIcon}
                        alt="check"
                      />
                      <span
                        className="cursor"
                        role="presentation"
                        onClick={() => {
                          onCommnetsLabelClick();
                          setNewCommentData('');
                          setShowTextArea(false);
                        }}>
                        Comments ({commentsCount})
                      </span>
                    </li>
                    <li key="arrow">
                      <span className="divide-arrow" />
                    </li>
                    <li
                      key="delete"
                      onClick={() => setShowConfirmationModal(true)}
                      role="presentation">
                      <img
                        className="header-icon"
                        src={TrashIcons}
                        alt="check"
                      />
                      <span className="cursor">Delete</span>
                    </li>
                    <li key="d-arrow">
                      <span className="divide-arrow hide-mobile" />
                    </li>
                    <li key="close">
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

          <div className="row h-100">
            <div
              className={
                showCommentSection ? 'col-lg-9 col-12 pr-0' : 'col-12'
              }>
              <BrandAssetsPreviewBody
                className={showClickModal ? 'annotation-modal' : null}>
                {showClickModal ? (
                  <div className="click-for-annotation">
                    Click anywhere on the image to add your annotaton{' '}
                    <Button
                      className="btn-transparent verify-now-btn h-30 w-auto ml-2"
                      onClick={() => {
                        cancelAnnotation();
                      }}>
                      Cancel
                    </Button>
                  </div>
                ) : null}
                <div
                  className={
                    showAssetPreview.index === 0
                      ? 'pervious-img btn disabled-slider-btn'
                      : 'pervious-img btn'
                  }
                  role="presentation"
                  onClick={() =>
                    showAssetPreview.index !== 0 ? showImg('prev') : null
                  }>
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
                  {showAssetPreview &&
                  showAssetPreview.selectedFile &&
                  showAssetPreview.selectedFile.mime_type.includes('pdf') ? (
                    <BrandAssetPdf>
                      <PdfAnnotator
                        pdf={
                          showAssetPreview &&
                          showAssetPreview.selectedFile &&
                          showAssetPreview.selectedFile.presigned_url
                        }
                        loadingMsg="Loading Document..."
                        onPdfMouseDown={onPdfMouseDown}
                        renderPDFAnnotations={renderPDFAnnotations}
                        clickOnAddNewAnnotation={clickOnAddNewAnnotation}
                      />
                    </BrandAssetPdf>
                  ) : (
                    <>
                      <object
                        onMouseDown={(event) =>
                          clickOnAddNewAnnotation ? onMouseDown(event) : null
                        }
                        id="imgContainer"
                        className={
                          clickOnAddNewAnnotation
                            ? 'image-thumbnail cursorPointer'
                            : 'image-thumbnail'
                        }
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
                      {renderImageAnnotations(true)}
                      {renderImageAnnotations()}
                      {}
                    </>
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
                  onClick={() =>
                    showAssetPreview.index !==
                    (showAssetPreview.documents &&
                      showAssetPreview.documents.length - 1)
                      ? showImg('next')
                      : null
                  }>
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
              <div className="col-lg-3 col-12 pl-lg-0">
                {renderCommentPanel()}
              </div>
            ) : null}
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
  isDeleted: false,
  setIsImgDeleted: () => {},
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
  isDeleted: PropTypes.bool,
  setIsImgDeleted: PropTypes.func,
};

const BrandAssetsPreviewBody = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  &.annotation-modal {
    background: #abafb8;
    height: 100%;
  }

  .click-for-annotation {
    background-color: ${Theme.gray8};
    border-radius: 4px;
    padding: 5px 15px;
    font-size: ${Theme.small};
    color: ${Theme.gray90};
    top: 10px;
    position: absolute;
  }

  .assetPreviewImg {
    position: absolute;
    top: 30%;
    display: flex;
    justify-content: center;

    .image-thumbnail {
      max-width: 500px;
      max-height: 250px;
    }

    .cursorPointer {
      cursor: pointer;
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
    top: 40%;
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
    .assetPreviewImg {
      top: 35%;

      .image-thumbnail {
        max-width: 500px;
        max-height: 200px;
      }
    }
  }
  @media only screen and (max-width: 767px) {
    .assetPreviewImg {
      max-width: 200px;
      height: 100px;
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
    .assetPreviewImg {
      max-width: 170px;
      height: 100px;
      left: auto;
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
  margin-top: 0px;
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
    cursor: pointer;
  }

  .inbox-coment {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: auto;
    height: calc(100vh - 100px - 235px);
    padding-bottom: 70px;

    li {
      padding: 15px 15px 0 15px;
    }
  }
  .inbox-height {
    height: calc(100vh - 200px);
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: auto;
    li {
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
      background: ${Theme.white};
      width: 23%;
      .add-annotation {
        cursor: pointer;
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

    .chat-header {
      margin-top: 40px;
    }

    .inbox-comment {
      height: calc(100vh - 100px - 545px);
    }
    .chat-footer {
      .input-type-box {
        margin: 0 10px;
        width: 95%;
      }
    }
    .close-panel {
      transform: rotate(90deg);
    }
    .chat-header {
      border-top: 1px solid ${Theme.gray4};
    }
  }
  @media only screen and (max-width: 767px) {
    .inbox-comment {
      height: calc(100vh - 445px);
      padding-bottom: 180px;
    }
  }
`;

const BrandAssetPdf = styled.div`
  min-height: 500px;
  overflow: auto;
  margin-top: -150px;
  max-width: 790px;
  height: 73vh;
  #ResumeContainer {
    width: 98%;
    .react-pdf__Document {
      width: 100% !important;
      padding-right: 0;
      background: ${Theme.white} !important;

      .react-pdf__Page {
        box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.1) !important;
        background: ${Theme.white} !important;
        margin-bottom: 10px !important;

        .react-pdf__Page__textContent {
          box-shadow: none;
        }
        & .pdf-view {
          width: 100% !important;
        }

        .react-pdf__Page__canvas {
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: auto;
        }
        &:first-child {
          top: 0 !important;
        }
      }
      .feDBFU .not-found {
        font-weight: 500;
        color: black;
        margin-top: -70px;
      }

      @media only screen and (max-width: 991px) {
        padding-left: 0px !important;
        padding-right: 0;
        max-width: 550px;

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
  }
  @media only screen and (min-width: 1920px) {
    max-width: 950px;
  }
  @media only screen and (max-width: 991px) {
    margin-top: -16px;
    min-height: 100px;
    height: 40vh;
  }
  @media only screen and (max-width: 767px) {
    min-height: 100px;
    height: 26vh;
  }
`;

const Footer = styled.div`
  border: 1px solid ${Theme.gray7};
  bottom: 195px;
  background: ${Theme.white};
  box-shadow: ${Theme.boxShadow};
  position: fixed;
  min-height: 60px;
  z-index: 2;
  width: 24%;

  &.pdf-footer-height {
    bottom: 0px;
  }

  @media only screen and (max-width: 991px) {
    width: 100%;
  }
`;
