/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';

import Modal from 'react-modal';
import dayjs from 'dayjs';
import queryString from 'query-string';
import $ from 'jquery';
import { useMediaQuery } from 'react-responsive';
import { pickBy } from 'lodash';
import { Link, useParams, useHistory } from 'react-router-dom';

import ArticleSearch from './ArticleSearch';
import { getArticleBoards, updateArticle } from '../../api';
import { CloseIcon, LeftArrowIcon } from '../../theme/images';
import { PATH_ARTICLE_DETAILS, PATH_ARTICLE_LIST } from '../../constants';
import {
  Button,
  ModalBox,
  FormField,
  PageLoader,
  BackToTop,
} from '../../common';
import { GrayBody } from './ArticleKBaseStyle';
import { ArticleDetail } from './ArticleDetailsStyle';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    minHeight: '200px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
  },
};
export default function ArticleDetails() {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [showModal, setShowModal] = useState(false);
  const [boardData, setBoardData] = useState({});
  const [activeField, setActiveField] = useState({
    board: null,
    article: null,
  });
  const [articleData, setArticleData] = useState({});
  const [selectedArticle, setSelectedArticle] = useState({});
  const [showContinueMsg, setShowContinueMsg] = useState(false);
  const [formData, setFormData] = useState({});
  const [mobileView, setMobileView] = useState({
    board: true,
    section: false,
    article: false,
  });

  const [tabView, setTabView] = useState(false);
  const [scrollToTop, setScrollToTop] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991.98 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const params = queryString.parse(history.location.search);

  useEffect(() => {
    setIsLoading({ loader: true, type: 'page' });
    getArticleBoards(id, 'boards').then((response) => {
      setBoardData(response && response.data);
      if (history && history.location && history.location.state) {
        setActiveField({
          board: params.board || history.location.state.boards[0].id,
          article: params.article || history.location.state.id,
        });

        setSelectedArticle(history.location.state);
      } else {
        setActiveField({
          board:
            params.board ||
            (response &&
              response.data &&
              response.data.items &&
              response.data.items[0] &&
              response.data.items[0].id),
          article: params.article || '',
        });
      }
      const boardId = params.board
        ? params.board
        : history && history.location && history.location.state
        ? history.location.state.boards[0].id
        : (response &&
            response.data &&
            response.data.items &&
            response.data.items[0] &&
            response.data.items[0].id) ||
          params.board;
      getArticleBoards(boardId, 'sections').then((res) => {
        setArticleData(res && res.data);
        if (history && history.location && history.location.state) {
          setActiveField({
            board: params.board || history.location.state.boards[0].id,
            article: params.article || history.location.state.id,
          });
          setSelectedArticle(history.location.state);
        } else {
          setActiveField({
            board: params.board
              ? params.board
              : response &&
                response.data &&
                response.data.items &&
                response.data.items[0] &&
                response.data.items[0].id,

            article: params.article
              ? params.article
              : res &&
                res.data &&
                res.data.items &&
                res.data.items[0] &&
                res.data.items[0].type === 'section'
              ? res.data.items[0].items &&
                res.data.items[0].items[0] &&
                res.data.items[0].items[0].id
              : res.data.items[0].id,
          });
          if (params && params.article) {
            let articleContent = '';
            const getArticle = (op) => {
              return op && op.items.find((el) => el.id === params.article);
            };

            articleContent =
              res.data &&
              res.data.items &&
              res.data.items.find((op) =>
                op.type === 'fact' ? op.id === params.article : getArticle(op),
              );

            setSelectedArticle(
              articleContent && articleContent.items
                ? articleContent.items.find((op) => op.id === params.article)
                : articleContent,
            );
          } else {
            setSelectedArticle(
              res &&
                res.data &&
                res.data.items &&
                res.data.items[0] &&
                res.data.items[0].items
                ? res.data.items[0].items[0]
                : res.data.items[0] || {},
            );
          }
          const stringified = queryString.stringify({
            ...params,
            article:
              params.article ||
              (res.data &&
                res.data.items &&
                res.data.items[0] &&
                res.data.items[0].id),
            board:
              params.board ||
              (res.data &&
                res.data.items &&
                res.data.items[0] &&
                res.data.items[0].boards &&
                res.data.items[0].boards[0] &&
                res.data.items[0].boards[0].id),
          });
          history.push({
            pathname: `${PATH_ARTICLE_DETAILS.replace(
              ':id',
              res &&
                res.data &&
                res.data.items &&
                res.data.items[0] &&
                res.data.items[0] &&
                res.data.items[0].items
                ? res.data.items[0].items[0].collection.id
                : res.data.items[0].collection &&
                    res.data.items[0].collection.id,
            )}`,
            search: `${stringified}`,
          });
        }
        setIsLoading({ loader: false, type: 'page' });
      });
    });
    // eslint-disable-next-line
  }, [id]);

  if (scrollToTop) {
    $('#blogBox').scrollTop(0);
    $('#articleBox').scrollTop(0);
    $('#boardBox').scrollTop(0);
  }

  const handleBoard = (field) => {
    setIsLoading({ loader: true, type: 'page' });

    setActiveField({
      board: field.id,
    });
    getArticleBoards(field.id, 'sections').then((response) => {
      setArticleData(response && response.data);
      setActiveField({
        board: field.id,
        article:
          response &&
          response.data &&
          response.data.items &&
          response.data.items[0] &&
          response.data.items[0].type === 'section'
            ? response.data.items[0].items &&
              response.data.items[0].items[0] &&
              response.data.items[0].items[0].id
            : response.data.items[0].id,
      });
      setSelectedArticle(
        response &&
          response.data &&
          response.data.items &&
          response.data.items[0] &&
          response.data.items[0].type === 'section'
          ? response.data.items[0] &&
              response.data.items[0].items &&
              response.data.items[0].items[0]
          : response.data.items[0],
      );
      const stringified = queryString.stringify({
        board: field.id,
        article:
          response &&
          response.data &&
          response.data.items &&
          response.data.items[0] &&
          response.data.items[0].type === 'section'
            ? response.data.items[0].items &&
              response.data.items[0].items[0] &&
              response.data.items[0].items[0].id
            : response.data.items[0].id,
      });
      history.push({
        pathname: `${PATH_ARTICLE_DETAILS.replace(
          ':id',
          selectedArticle.collection.id,
        )}`,
        search: `${stringified}`,
      });

      setIsLoading({ loader: false, type: 'page' });
    });
    if (isMobile)
      setMobileView({ board: false, section: true, article: false });
  };

  const handleArticle = (field) => {
    const stringified = queryString.stringify({
      board: field.boards && field.boards[0] && field.boards[0].id,
      article: field.id,
    });
    history.push({
      pathname: `${PATH_ARTICLE_DETAILS.replace(':id', field.collection.id)}`,
      search: `${stringified}`,
    });
    setActiveField({ ...activeField, article: field.id });

    for (const card of articleData.items) {
      if (card.type === 'section') {
        for (const subCard of card.items) {
          if (subCard.id === field.id) {
            setSelectedArticle(subCard);
          }
        }
      } else if (card.id === field.id) {
        setSelectedArticle(card);
      }
    }
    if (isMobile)
      setMobileView({ board: false, section: false, article: true });
    if (isTablet) setTabView(true);
  };

  const handleContent = () => {
    if (
      activeField &&
      (activeField.article === undefined || activeField.article === null)
    ) {
      return articleData &&
        articleData.items &&
        articleData.items[0] &&
        articleData.items[0].type === 'section'
        ? articleData &&
          articleData.items &&
          articleData.items[0] &&
          articleData.items[0].items &&
          articleData.items[0].items.length &&
          articleData.items[0].items[0].content
          ? articleData.items[0].items[0].content
          : 'No Article Found'
        : articleData &&
            articleData.items &&
            articleData.items[0] &&
            articleData.items[0].content;
    }
    //  @Hack (woody): Would be Ideal for the Back-end to give us the section name of an article rather than do this.
    const section = articleData.items.find((sectionOrArticle) => {
      if (sectionOrArticle.type === 'section') {
        const article =
          sectionOrArticle &&
          sectionOrArticle.items &&
          sectionOrArticle.items.find((a) => a.id === selectedArticle.id);
        return article;
      }
      return false;
    });
    const toSend = pickBy(
      {
        event: 'kb-article-content-load',
        'kb-collection':
          selectedArticle &&
          selectedArticle.collection &&
          selectedArticle.collection.name,
        'kb-board':
          selectedArticle &&
          selectedArticle.boards &&
          selectedArticle.boards[0] &&
          selectedArticle.boards[0].title,
        'kb-section': section && section.title,
        'kb-article': selectedArticle && selectedArticle.preferredPhrase,
      },
      (v) => v !== undefined,
    );

    window.dataLayer.push(toSend);

    return ` <h2 class="primary-heading">
                          ${
                            (selectedArticle &&
                              selectedArticle.preferredPhrase) ||
                            ''
                          }
                        </h2>
          
        ${(selectedArticle && selectedArticle.content) || ''}`;
  };

  const getInitials = () => {
    const firstName =
      (selectedArticle &&
        selectedArticle.owner &&
        selectedArticle.owner.firstName &&
        selectedArticle.owner.firstName.charAt(0)) ||
      '';
    const lastName =
      (selectedArticle &&
        selectedArticle.owner &&
        selectedArticle.owner.lastName &&
        selectedArticle.owner.lastName.charAt(0)) ||
      '';
    return firstName + lastName;
  };

  const saveArticle = () => {
    setIsLoading({ loader: true, type: 'button' });

    const data = {
      ...formData,
      article_title: selectedArticle.preferredPhrase,
      card_id: selectedArticle.slug,
    };

    updateArticle(data).then((response) => {
      if (response && response.status === 201) {
        setShowContinueMsg(true);
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <GrayBody className="container-fluid">
      <div className="graycontainer-fluid ">
        <div className="row">
          <div className="col-lg-2 col-md-3 col-12  pt-2 pl-lg-0 pl-md-0  ">
            <div className="small-title">
              {' '}
              <Link className="link" to={PATH_ARTICLE_LIST}>
                <div className="back-to-pervious mb-2 cursor">
                  <img className="left-arrow" src={LeftArrowIcon} alt="" /> Back
                  to All Collections
                </div>
              </Link>
              {boardData.collection && boardData.collection.name}
            </div>
          </div>
          <div className="col-lg-10 col-md-9 col-12 pt-3  ">
            <ArticleSearch
              setSelectedArticle={setSelectedArticle}
              setActiveField={setActiveField}
              setArticleData={setArticleData}
              setScrollToTop={setScrollToTop}
            />
          </div>
        </div>
      </div>
      <div className="straight-line horizontal-line" />
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" width={40} />
      ) : (
        <div className="graycontainer-fluid ">
          <div className="row">
            <div className="col-lg-5 col-12 pl-lg-0 pl-md-0 pr-0">
              <ArticleDetail>
                {isDesktop ||
                (isTablet && !tabView) ||
                (isMobile && mobileView.board) ? (
                  <div className="board" id="boardBox">
                    <ul className="acc-management-list">
                      <li>
                        <div className="small-title">Boards</div>
                      </li>
                      {boardData.items &&
                        boardData.items.map((field) => (
                          <li
                            className={
                              field.id === activeField.board ? 'active' : ''
                            }
                            key={field.id}
                            role="presentation"
                            onClick={() => handleBoard(field)}>
                            <div className="category">
                              {field && field.title}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  ''
                )}

                {isMobile && mobileView.section ? (
                  <>
                    <div className="row">
                      <div className=" d-sm-block   col-12  pt-2  mb-3 ">
                        <div className="small-title">
                          {' '}
                          <div
                            className="back-to-pervious mb-2 cursor"
                            role="presentation"
                            onClick={() =>
                              isMobile
                                ? setMobileView({
                                    board: true,
                                    section: false,
                                    article: false,
                                  })
                                : ''
                            }>
                            <img
                              className="left-arrow"
                              src={LeftArrowIcon}
                              alt=""
                            />{' '}
                            Back to All Boards
                          </div>
                          {selectedArticle &&
                            selectedArticle.boards &&
                            selectedArticle.boards[0] &&
                            selectedArticle.boards[0].title}
                        </div>
                      </div>
                    </div>
                    <div className="straight-line horizontal-line" />
                  </>
                ) : (
                  ''
                )}

                {isDesktop ||
                (isTablet && !tabView) ||
                (isMobile && mobileView.section) ? (
                  <>
                    {/* <div className="straight-line horizontal-line" /> */}
                    <div className="articles" id="articleBox">
                      <ul className="acc-management-list">
                        <li>
                          <div className="small-title">Articles</div>
                        </li>
                        {articleData &&
                          articleData.items &&
                          articleData.items.map((field) => (
                            <React.Fragment key={field.id}>
                              {field.type === 'section' ? (
                                <>
                                  <div className="label ml-2">
                                    {field.title}
                                  </div>
                                  {field.items &&
                                    field.items.map((sub) => (
                                      <li
                                        className={
                                          sub.id === activeField.article
                                            ? 'active'
                                            : ''
                                        }
                                        key={sub.id}
                                        role="presentation"
                                        onClick={() => handleArticle(sub)}>
                                        <div className="category">
                                          {sub.preferredPhrase}
                                        </div>
                                      </li>
                                    ))}
                                </>
                              ) : (
                                <li
                                  className={
                                    field.id === activeField.article
                                      ? 'active'
                                      : ''
                                  }
                                  role="presentation"
                                  onClick={() => handleArticle(field)}>
                                  <div className="category">
                                    {field.preferredPhrase}
                                  </div>
                                </li>
                              )}
                            </React.Fragment>
                          ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </ArticleDetail>
            </div>{' '}
            <div className="col-lg-7 col-12">
              {(isTablet && tabView) || (isMobile && mobileView.article) ? (
                <>
                  <div className="row">
                    <div className="col-12  pt-2  mb-3 ">
                      <div className="small-title">
                        {' '}
                        <div
                          className="back-to-pervious-page mb-2 cursor"
                          onClick={() =>
                            isTablet
                              ? setTabView(false)
                              : isMobile
                              ? setMobileView({
                                  board: false,
                                  section: true,
                                  article: false,
                                })
                              : ''
                          }
                          role="presentation">
                          <img
                            className="left-arrow"
                            src={LeftArrowIcon}
                            alt=""
                          />{' '}
                          Back to All Articles
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="straight-line horizontal-line" />
                </>
              ) : (
                ''
              )}

              <div className="article-details-text" id="blogBox">
                {isDesktop ||
                (isTablet && tabView) ||
                (isMobile && mobileView.article) ? (
                  <div className="row mt-lg-5 mt-4">
                    <div className="col-md-6 ">
                      <div
                        className="edit-profile-text float-left"
                        role="presentation">
                        {selectedArticle &&
                        selectedArticle.owner &&
                        selectedArticle.owner.profilePicUrl ? (
                          <img
                            src={selectedArticle.owner.profilePicUrl}
                            alt="logo"
                          />
                        ) : (
                          <div className="avatarName mr-2">{getInitials()}</div>
                        )}

                        <div className="name-email">
                          <div className="team-member-name">
                            {selectedArticle &&
                              selectedArticle.owner &&
                              selectedArticle.owner.firstName}{' '}
                            {selectedArticle &&
                              selectedArticle.owner &&
                              selectedArticle.owner.lastName}
                          </div>
                          Last Updated on{' '}
                          {selectedArticle &&
                            dayjs(selectedArticle.lastModified).format(
                              'MMM DD, YYYY',
                            )}
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-md-6 
                    text-right">
                      <Button
                        onClick={() => {
                          setShowModal(true);
                          setShowContinueMsg(false);
                        }}
                        className=" btn-with-radius  ">
                        {' '}
                        Suggest an update
                      </Button>
                      <Modal
                        isOpen={showModal}
                        style={customStyles}
                        ariaHideApp={false}
                        contentLabel="Edit modal">
                        <ModalBox>
                          <img
                            src={CloseIcon}
                            alt="close"
                            className="float-right cursor cross-icon"
                            onClick={() => setShowModal(false)}
                            role="presentation"
                          />
                          {!showContinueMsg ? (
                            <div className="modal-body">
                              <h4>Suggest an Update</h4>
                              <p className="text-detail-modal">
                                See something that&apos;s not correct in this
                                article? Simply send us a note and we will
                                update the content.
                              </p>

                              <FormField className="mt-3">
                                <textarea
                                  className="text-area"
                                  rows="6"
                                  placeholder="Please provide details of the suggested update."
                                  name="description"
                                  onChange={(event) =>
                                    setFormData({
                                      ...formData,
                                      description: event.target.value,
                                    })
                                  }
                                />
                              </FormField>
                              <Button
                                className={
                                  !formData.description
                                    ? 'btn-primary mt-4 w-100 disabled'
                                    : 'btn-primary mt-4 w-100'
                                }
                                onClick={() => saveArticle()}
                                disabled={!formData.description}>
                                {isLoading.loader &&
                                isLoading.type === 'button' ? (
                                  <PageLoader color="#fff" type="button" />
                                ) : (
                                  'Submit'
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="modal-body">
                              <h5 className="mt-4">Thanks for your help!</h5>
                              <p className="text-detail-modal pt-0 pb-0">
                                One of our knowledge experts will now review
                                your submission. Thanks again for helping us
                                make our knowledge base great.
                              </p>

                              <Button
                                className="btn-primary mt-3 w-100"
                                onClick={() => setShowModal(false)}>
                                Continue
                              </Button>
                            </div>
                          )}
                        </ModalBox>
                      </Modal>
                    </div>

                    <div
                      className="col-12 remove-author"
                      dangerouslySetInnerHTML={{
                        __html: handleContent(),
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="col-12 mt-5">
                <BackToTop />
              </div>
            </div>
          </div>
        </div>
      )}
    </GrayBody>
  );
}
