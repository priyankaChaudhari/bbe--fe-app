/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Modal from 'react-modal';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import $ from 'jquery';

import Theme from '../theme/Theme';
import {
  NextLogo,
  EditIcons,
  LogOutIcons,
  CloseIcon,
  // NotificationBell,
  // ActiveNotificationBell,
  // CompanyDefaultUser,
  LightBulb,
  UserGroupIcon,
  ReadBookIcon,
  MenuIcon,
  ReadBookIconActive,
  UserGroupIconActive,
} from '../theme/images/index';
import { logout } from '../store/actions/userState';
import { EditProfile } from '../components/Profile';
import { createArticle } from '../api';
import { PageLoader, ModalBox, Button, FormField, SuccessMsg } from './index';
import { PATH_ARTICLE_LIST, PATH_CUSTOMER_LIST } from '../constants';

export default function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [showModal, setShowModal] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  // const [showNotification, setShowNotification] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState({
    show: false,
    message: '',
  });
  const [showArticle, setShowArticle] = useState(false);
  const [showArticleSuccess, setShowArticleSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  const profilePic =
    userInfo.documents &&
    userInfo.documents[0] &&
    Object.values(userInfo.documents[0]) &&
    Object.values(userInfo.documents[0])[0];

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

  const getInitials = () => {
    const firstName =
      (userInfo && userInfo.first_name && userInfo.first_name.charAt(0)) || '';
    const lastName =
      (userInfo && userInfo.last_name && userInfo.last_name.charAt(0)) || '';
    return firstName + lastName;
  };

  window.addEventListener('click', (e) => {
    if (
      document.getElementById('clickbox') &&
      document.getElementById('clickbox').contains(e.target)
    ) {
      setShowDropDown(true);
    } else {
      setShowDropDown(false);
    }
  });

  $(document).on('click', (e) => {
    if ($(e.target).closest('#kBase').length === 0) {
      $('#mobilemenu-check').prop('checked', false);
    }
  });

  // window.addEventListener('click', (e) => {
  //   if (document.getElementById('clickNotification').contains(e.target)) {
  //     setShowNotification(true);
  //   } else {
  //     setShowNotification(false);
  //   }
  // });

  const saveArticle = () => {
    setIsLoading({ loader: true, type: 'button' });
    createArticle(formData).then((response) => {
      if (response && response.status === 201) {
        setShowArticleSuccess(true);
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <div>
      <MainHeader>
        <div className="container-fluid">
          <div className="row">
            <div className="col-4 ">
              <div
                className="logo cursor"
                onClick={() => history.push(PATH_CUSTOMER_LIST)}
                role="presentation">
                <img src={NextLogo} alt="logo" />
              </div>
              <img
                className="logo-mobile-view cursor"
                src={NextLogo}
                alt=""
                onClick={() => history.push(PATH_CUSTOMER_LIST)}
                role="presentation"
              />
            </div>
            <div className="col-8 text-right">
              <ul className="right-nav">
                {/* <li>
                    <div
                      className="dropdown"
                      onClick={() => {
                        setShowNotification(!showNotification);
                        setShowSuccessMsg({ show: false });
                      }}
                      role="presentation">
                      <div
                        id="clickNotification"
                        className="notification"
                        style={{
                          paddingTop: NotificationBell ? '' : '9px',
                        }}>
                        {!showNotification ? (
                          <img
                            className="notify-bell-icon"
                            src={NotificationBell}
                            alt=""
                          />
                        ) : (
                          <>
                            <img
                              className="active-notify-bell"
                              src={ActiveNotificationBell}
                              alt="bell"
                            />
                            <span>
                              <div className="notify" />
                            </span>
                          </>
                        )}
                      </div>
                      <ul
                        className="notification-content cursor"
                        style={{
                          display: showNotification ? 'block' : 'none',
                        }}>
                        <li role="presentation">
                          <img src={CompanyDefaultUser} alt="" />
                          <div className="activity-user">
                            Kathey <span>updated website from </span>{' '}
                            pharmacare.com
                            <span> to </span> pharmacare.us
                            <div className="time-date mt-1">
                              10/22/2020 at 11:20AM MST
                            </div>
                          </div>
                          <div className="clear-fix" />
                        </li>
                        <li role="presentation" style={{ cursor: 'pointer' }}>
                          <img src={CompanyDefaultUser} alt="" />
                          <div className="activity-user">
                            Kathey <span> updated website from </span>{' '}
                            Pharmacare.com <span> to</span> Pharmacare.us
                            <div className="time-date mt-1">
                              10/22/2020 at 11:20AM MST
                            </div>
                          </div>
                          <div className="clear-fix" />
                        </li>
                      </ul>
                    </div>
                  </li> */}

                <li
                  className=" "
                  onClick={() => {
                    setShowArticle(true);
                    setShowArticleSuccess(false);
                  }}
                  role="presentation">
                  <div id="clickNotification ">
                    <div
                      className="suggest-box d-none d-md-block"
                      data-tip="Got an idea? Share it here."
                      data-for="idea">
                      <img className="light-bulb-icon" src={LightBulb} alt="" />
                      Share an idea
                    </div>
                    <div id="clickNotification ">
                      <div
                        className="suggest-box mobile-view d-block d-md-none"
                        data-tip="Got an idea? Share it here."
                        data-for="idea">
                        <img
                          className="light-bulb-icon"
                          src={LightBulb}
                          alt=""
                        />
                      </div>
                    </div>
                    {/* <span>
                        <div className="notify" />
                      </span> */}
                  </div>
                  <ReactTooltip
                    id="idea"
                    aria-haspopup="true"
                    place="bottom"
                    effect="solid"
                  />
                </li>

                <li>
                  <div className="header-user-profile">
                    <div
                      className="dropdown"
                      onClick={() => {
                        setShowDropDown(!showDropDown);
                        setShowSuccessMsg({ show: false });
                      }}
                      role="presentation">
                      <div
                        id="clickbox"
                        className="header-profile"
                        style={{
                          paddingTop: profilePic ? '' : '',
                        }}>
                        {profilePic ? (
                          <img
                            src={profilePic}
                            className="profile-pic"
                            alt="user"
                          />
                        ) : (
                          <div className="avatarName ">{getInitials()}</div>
                        )}
                      </div>
                      <ul
                        className="dropdown-content"
                        style={{ display: showDropDown ? 'block' : 'none' }}>
                        <li
                          role="presentation"
                          onClick={() => setShowModal(true)}>
                          <img src={EditIcons} alt="edit" /> Edit profile
                        </li>
                        <li
                          role="presentation"
                          style={{ cursor: 'pointer' }}
                          onClick={() => dispatch(logout())}>
                          <img src={LogOutIcons} alt="logout" /> Log out
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Modal
          isOpen={showModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Profile modal">
          <img
            src={CloseIcon}
            alt="close"
            className="float-right cross-icon cursor"
            onClick={() => setShowModal(false)}
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
              initials={getInitials()}
              userInfo={userInfo}
              setShowSuccessMsg={setShowSuccessMsg}
            />
          </div>
        </Modal>
        <Modal
          isOpen={showArticle}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Profile modal">
          <ModalBox>
            <img
              src={CloseIcon}
              alt="close"
              className="float-right cursor cross-icon"
              onClick={() => setShowArticle(false)}
              role="presentation"
            />

            {!showArticleSuccess ? (
              <div className="modal-body">
                <h4>Share your Idea</h4>
                <p className="text-detail-modal">
                  Please fill out the form below to submit an idea, whether it
                  be a new feature, change to an existing feature or a new
                  knowledge base article.
                </p>

                <FormField className="mt-3">
                  <textarea
                    className=" text-area"
                    rows="6"
                    placeholder="Please provide details of the idea you have."
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
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            ) : (
              <div className="modal-body">
                <h5 className="mt-4">Thanks for sharing your ideas!</h5>
                <p className="text-detail-modal pt-0 pb-0">
                  Your request to add knowledge has been submitted. One of our
                  knowledge experts will review, and if approved, they will
                  create and publish the knowledge.
                </p>

                <Button
                  className="btn-primary mt-3 w-100"
                  onClick={() => setShowArticle(false)}>
                  Continue
                </Button>
              </div>
            )}
          </ModalBox>
        </Modal>
      </MainHeader>
      <MobileSidebar id="kBase">
        <label htmlFor="mobilemenu-check" id="responsive-button">
          <img src={MenuIcon} alt="Menu Lines" className="menu-icon" />
        </label>
        <input type="checkbox" id="mobilemenu-check" />
        <div id="ifp-sidebar-responsive">
          <label
            htmlFor="mobilemenu-check"
            className="close-icon d-xl-none d-block"
          />

          <SideContents>
            {' '}
            <ul className="side-bar-icon ">
              <li
                className={
                  !(
                    history.location.pathname &&
                    history.location.pathname.includes('collections')
                  )
                    ? ' cursor active'
                    : ' cursor'
                }
                role="presentation"
                onClick={() => history.push(PATH_CUSTOMER_LIST)}>
                <img className="user-group" src={UserGroupIconActive} alt="" />
                <img
                  className="user-group-active "
                  src={UserGroupIcon}
                  alt=""
                />
              </li>
              <li
                className={
                  history.location.pathname &&
                  history.location.pathname.includes('collections')
                    ? 'cursor active'
                    : ' cursor'
                }
                role="presentation"
                onClick={() => history.push(PATH_ARTICLE_LIST)}>
                <img
                  className="read-book-active"
                  src={ReadBookIconActive}
                  alt=""
                />
                <img className="read-book" src={ReadBookIcon} alt="" />
              </li>
            </ul>
          </SideContents>
        </div>
      </MobileSidebar>
    </div>
  );
}

const MainHeader = styled.div`
  background-color: ${Theme.white};
  height: 70px;
  border-bottom: 1px solid ${Theme.gray7};
  padding-top: 13px;
  position: fixed;
  width: 100%;
  z-index: 3;
  top: 0;
  .logo {
    img {
      width: 90px;
    }
  }
  .logo-mobile-view {
    display: none;
  }

  .right-nav {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      vertical-align: middle;
      display: inline-block !important;
      margin-right: 15px;

      &:last-child {
        margin-right: 0px;
      }

      .suggest-box {
        position: relative;
        border-radius: 20px;
        max-width: 137px;
        background: ${Theme.gray3};
        padding: 11px 13px;
        font-size: 15px;
        color: #2e384d;
        .light-bulb-icon {
          width: 21px;
          margin-right: 3px;
          vertical-align: middle;
          margin-top: -3px;
        }
        &.mobile-view {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          padding: 10px;
        }
      }
    }

    .notification {
      position: relative;

      .notify-bell-icon {
        width: 40px;
        border-radius: 50%;
        padding: 10px;
        background: ${Theme.white};
        cursor: pointer;
      }

      span {
        position: absolute;
        display: none;
        left: 22px;
        top: 5px;
        .notify {
          width: 3px;

          height: 3px;
          background: ${Theme.orange};
          border-radius: 50%;
        }
      }

      .active-notify-bell {
        width: 40px;
        border-radius: 50%;
        display: block;
        padding: 10px;
        background: #f2f4f7;
        cursor: pointer;
      }
      span {
        position: absolute;
        display: block;
        left: 22px;
        top: 5px;
        .notify {
          width: 3px;
          height: 3px;
          background: ${Theme.orange};
          border-radius: 50%;
        }
      }
    }
    .notification-list {
      margin-top: 10px;
      border: 1px solid red;
    }

    .notification-content {
      border-radius: 1px;
      width: 288px;
      background: ${Theme.white};
      border: 1px solid ${Theme.gray9};
      text-align: left;
      float: right;
      padding: 0;
      z-index: 999999;
      box-shadow: ${Theme.commonShadow};
      position: absolute;
      left: -248px;

      li {
        display: flex;
        padding: 20px;
        border-bottom: 1px solid ${Theme.gray9};

        &:hover {
          background: #fff6f5;
        }

        .activity-user {
          font-size: ${Theme.small};
          color: ${Theme.gray90};
          font-weight: 600;
          line-height: 16px;
          float: left;

          span {
            color: ${Theme.gray35};
            font-weight: 500;
          }
        }
        img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          float: left;
          margin-right: 10px;
        }

        .time-date {
          color: ${Theme.gray35};
          font-size: ${Theme.verySmall};
          font-weight: 500;
          text-align: left;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
    @media only screen and (max-width: 360px) {
      .notification-content {
        max-width: 233px;
        left: -160px;
      }
    }
  }

  .dropdown {
    position: relative;
    display: inline-block;

    .header-profile {
      border-radius: 50%;
      text-align: center;
      width: 40px;
      height: 40px;
      border: 1px solid ${Theme.lightOrange};
      background: ${Theme.lightOrange};
      color: ${Theme.orange};
      cursor: pointer;
      text-transform: Uppercase;

      .profile-pic {
        text-align: center;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
    }
  }

  .dropdown-content {
    display: none;
    position: absolute;
    max-width: 200px;
    box-shadow: ${Theme.commonShadow};
    padding: 0px;
    z-index: 999999;
    text-align: left;
    background: ${Theme.white};
    border: 1px solid ${Theme.gray9};
    margin-top: 8px;
    margin-left: -140px;

    li {
      list-style-type: none;
      padding-bottom: 10px;
      font-size: ${Theme.normal};
      color: ${Theme.gray90};
      padding: 10px;
      cursor: pointer;
      width: 100%;

      img {
        width: 15px;
        margin-right: 3px;
        vertical-align: middle;
      }

      &:hover {
        background: ${Theme.gray8};
      }
    }
  }

  @media only screen and (max-width: 991px) {
    height: 70px;
    padding-top: 13px;

    .logo {
      margin-left: 66px;
      margin-top: 2px;
      width: 185px;

      span {
        left: 275px;
        top: 16px;
      }
    }
    .suggest-box {
      padding-top: 4px;
    }
  }
  @media only screen and (max-width: 768px) {
    .logo {
      display: none;
    }

    .logo-mobile-view {
      display: block;
      width: 80px;
      margin-top: 4px;
      margin-left: 60px;
    }
  }

  .dropdown:active .dropdown-content {
    display: block;
  }

  @media only screen and (min-width: 1700px) and (max-width: 1920px) {
    .logo {
      width: 220px;

      span {
        top: 16px;
        left: 246px;
        font-size: ${Theme.textFontSizeRes};
      }
    }

    .right-nav {
      .notification {
        position: relative;

        .notify-bell-icon {
          width: 50px;
        }

        .active-notify-bell {
          width: 50px;
        }
        span {
          position: absolute;
          display: block;
          left: 28px;
          top: 5px;
        }
      }
    }
    .notification-content {
      width: 320px;
      left: -248px;

      li {
        .activity-user {
          font-size: ${Theme.smallRes};
        }

        .time-date {
          color: ${Theme.gray35};
        }
      }
    }

    .dropdown-content {
      li {
        font-size: ${Theme.normalRes};

        img {
          width: 18px;
          margin-right: 5px;
        }
      }
    }
  }
`;

const MobileSidebar = styled.div`
  display: none;
  #mobilemenu-check {
    display: none;
  }

  @media only screen and (max-width: 991px) {
    background-color: ${Theme['$base-color']};
    display: block;
    #responsive-button {
      display: block;
      position: absolute;
      left: 46px;
      top: 43px;
      z-index: 999;
      .menu-icon {
        width: 24px;
        margin-top: -16px;
        position: fixed;
        margin-left: -20px;
      }
    }
    #ifp-sidebar-responsive {
      display: none;
      height: 100%;
      position: absolute;
      z-index: 999;
      top: 0px;
      left: 0;
      .close-icon {
        color: ${Theme['$a-white']};
        font-size: ${Theme['$base-f-size-res']};
        font-family: ${Theme['$title-font-family']};
        position: absolute;
        right: 20px;
        top: 10px;
        z-index: 999;

        img {
          width: 15px;
        }
      }
    }
    #mobilemenu-check:checked ~ #ifp-sidebar-responsive {
      display: block;
    }
    #mobilemenu-close:checked ~ #ifp-sidebar-responsive {
      display: none;
    }
    .content-header {
      padding: 30px 30px 10px !important;
    }
  }
  @media only screen and (max-width: 768px) {
    #responsive-button {
      .menu-icon {
        width: 24px;
        margin-top: -16px;
        position: fixed;
        margin-left: -20px;
      }
    }
  }
`;

const SideContents = styled.div`
  @media (max-width: 991px) {
    max-width: 64px;
    position: fixed;
    top: 70px;
    left: 0;
    height: 100%;
    background: ${Theme.gray6};
    border-right: 1px solid ${Theme.gray7};

    .sidebar-logo {
      margin: 0;
      padding: 22px 25px 22px;

      img {
        width: 45%;
      }
    }

    .side-bar-icon {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        margin: 18px 0;
        padding: 0 18px;
        border-left: 3px solid ${Theme.white};

        .read-book-active {
          display: block;
        }

        .read-book {
          display: none;
        }

        .user-group-active {
          display: block;
        }

        .user-group {
          display: none;
        }

        img {
          width: 22px;
          cursor: pointer;
        }

        &:hover {
          border-left: 3px solid ${Theme.orange};

          .read-book {
            display: block;
          }
          .read-book-active {
            display: none;
          }

          .user-group {
            display: block;
          }
          .user-group-active {
            display: none;
          }
        }

        &.active {
          border-left: 3px solid ${Theme.orange};

          .read-book {
            display: block;
          }
          .read-book-active {
            display: none;
          }

          .user-group {
            display: block;
          }
          .user-group-active {
            display: none;
          }
        }
      }
    }
  }
`;
