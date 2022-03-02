import React, { useState } from 'react';

import ReactTooltip from 'react-tooltip';
import $ from 'jquery';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import { shape, string, arrayOf } from 'prop-types';

import GetInitialName from './GetInitialName';
import ProfileModal from './Modals/ProfileModal';
import ShareIdeaModal from './Modals/ShareIdeaModal';
import { logout } from '../store/actions/userState';
import { MainHeader, MobileSidebar, SideContents } from './Styles/HeaderStyles';
import {
  PATH_ARTICLE_LIST,
  PATH_CUSTOMER_LIST,
  PATH_BBE_GOAL_DASHBOARD,
  helpDeskLink,
  managementLink,
  PATH_ACCOUNT_SETUP,
  PATH_SUMMARY,
  roleURLs,
  dashboardRolePaths,
  PATH_REPORTS_SECTION,
} from '../constants';
import {
  NextLogo,
  EditIcons,
  LogOutIcons,
  LightBulb,
  ReadBookIcon,
  MenuIcon,
  ReadBookIconActive,
  OrganizationIcon,
  OrganizationActiveIcon,
  SpeedometerActive,
  Speedometer,
  HelpDeskIcon,
  HandShake,
  HomePageActiveIcon,
  HomePageIcon,
  GraphIconInActive,
  GraphIconActive,
} from '../theme/images';

export default function Header({ type, userInfo }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const userRole = userInfo?.role;
  const [showModal, setShowModal] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState({
    show: false,
    message: '',
  });
  const [showArticle, setShowArticle] = useState(false);
  const [showArticleSuccess, setShowArticleSuccess] = useState(false);

  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991.98 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const profilePic =
    userInfo?.documents?.[0] && Object.values(userInfo?.documents?.[0])?.[0];

  const toggleDropdown = () => {
    document.getElementById('myDropdown').classList.toggle('show');
  };

  window.addEventListener('click', (e) => {
    if (document.getElementById('clickbox')?.contains(e.target)) {
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

  if (isTablet || isMobile) {
    $('#idea').hide();
  } else {
    $('#idea').show();
  }
  return (
    <div
      className={
        (userInfo?.role?.includes('Customer') &&
          !history.location.pathname.includes('/brand-asset/')) ||
        history.location.pathname.includes(PATH_ACCOUNT_SETUP)
          ? 'common-header-sticky'
          : history.location.pathname.includes('/brand-asset/')
          ? 'header-hide'
          : ''
      }>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        pauseOnFocusLoss={false}
      />

      <MainHeader>
        <div className="container-fluid">
          <div className="row">
            <div className="col-4 ">
              <div
                className="logo cursor"
                onClick={() =>
                  !userInfo?.role.includes('Customer')
                    ? history.push(PATH_CUSTOMER_LIST)
                    : ''
                }
                role="presentation">
                <img src={NextLogo} alt="logo" />
              </div>
              <img
                className="logo-mobile-view cursor"
                src={NextLogo}
                alt=""
                onClick={() =>
                  !userInfo?.role.includes('Customer')
                    ? history.push(PATH_CUSTOMER_LIST)
                    : ''
                }
                role="presentation"
              />
            </div>
            <div className="col-8 text-right">
              <ul className="right-nav">
                {!userInfo?.role?.includes('Customer') &&
                type !== 'onboarding' &&
                !history.location.pathname.includes(PATH_SUMMARY) ? (
                  <li
                    className=" cursor"
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
                        <img
                          className="light-bulb-icon"
                          src={LightBulb}
                          alt=""
                        />
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
                    </div>
                    <ReactTooltip
                      id="idea"
                      aria-haspopup="true"
                      place="bottom"
                      effect="solid"
                    />
                  </li>
                ) : (
                  ''
                )}

                <li>
                  <div className="header-user-profile">
                    <div
                      className="dropdown dropbtn"
                      onClick={() => {
                        toggleDropdown();
                        setShowSuccessMsg({ show: false });
                      }}
                      role="presentation">
                      <div
                        id="clickbox"
                        className="header-profile "
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
                          <GetInitialName userInfo={userInfo} />
                        )}
                      </div>
                      <ul
                        className={
                          showDropDown
                            ? 'dropdown-content show'
                            : 'dropdown-content'
                        }
                        id="myDropdown">
                        <li
                          role="presentation"
                          onClick={() => setShowModal(true)}>
                          <img src={EditIcons} alt="edit" /> Edit profile
                        </li>
                        {!userInfo?.role?.includes('Customer') ? (
                          <>
                            <li
                              role="presentation"
                              onClick={() =>
                                window.open(managementLink, '_blank')
                              }>
                              <img
                                className="mr-2"
                                src={HandShake}
                                alt="edit"
                              />
                              Employee Engagement
                            </li>
                            <li
                              role="presentation"
                              onClick={() =>
                                window.open(helpDeskLink, '_blank')
                              }>
                              <img src={HelpDeskIcon} alt="edit" /> Helpdesk
                            </li>
                          </>
                        ) : (
                          ''
                        )}
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
        <ProfileModal
          showModal={showModal}
          setShowModal={setShowModal}
          userInfo={userInfo}
          setShowSuccessMsg={setShowSuccessMsg}
          showSuccessMsg={showSuccessMsg}
        />
        <ShareIdeaModal
          showArticle={showArticle}
          setShowArticle={setShowArticle}
          showArticleSuccess={showArticleSuccess}
          setShowArticleSuccess={setShowArticleSuccess}
        />
      </MainHeader>
      {type !== 'onboarding' ? (
        <MobileSidebar id="kBase">
          <label htmlFor="mobilemenu-check" id="responsive-button">
            <img src={MenuIcon} alt="Menu Lines" className="menu-icon cursor" />
          </label>
          <input type="checkbox" id="mobilemenu-check" />
          <div id="ifp-sidebar-responsive">
            <SideContents>
              {' '}
              <ul className="side-bar-icon ">
                {!userInfo?.role?.includes('Customer') ? (
                  <li
                    className={
                      history.location.pathname?.includes('bbe-Goal')
                        ? ' cursor active'
                        : ' cursor'
                    }
                    role="presentation"
                    onClick={() => history.push(PATH_BBE_GOAL_DASHBOARD)}>
                    {history.location.pathname?.includes('bbe-Goal') ? (
                      <img
                        width="32px"
                        className=" home-page-icon active"
                        src={HomePageActiveIcon}
                        alt=""
                      />
                    ) : (
                      <img
                        width="32px"
                        className="home-page-icon  disactive"
                        src={HomePageIcon}
                        alt=""
                      />
                    )}
                  </li>
                ) : null}
                <li
                  className={
                    roleURLs.some((element) =>
                      history.location.pathname?.includes(element),
                    )
                      ? ' cursor active'
                      : ' cursor'
                  }
                  role="presentation"
                  onClick={() => history.push(dashboardRolePaths[userRole])}>
                  {' '}
                  {roleURLs.some((element) =>
                    history.location.pathname?.includes(element),
                  ) ? (
                    <img
                      width="32px"
                      className=" speed0meter-icon active"
                      src={SpeedometerActive}
                      alt=""
                    />
                  ) : (
                    <img
                      width="32px"
                      className=" speed0meter-icon  disactive"
                      src={Speedometer}
                      alt=""
                    />
                  )}
                </li>
                <li
                  className={
                    history.location.pathname?.includes('customer')
                      ? ' cursor active'
                      : ' cursor'
                  }
                  role="presentation"
                  onClick={() => history.push(PATH_CUSTOMER_LIST)}>
                  <img
                    className="user-group"
                    src={OrganizationActiveIcon}
                    alt=""
                  />
                  <img
                    className="user-group-active "
                    src={OrganizationIcon}
                    alt=""
                  />
                </li>
                <li
                  className={
                    history.location.pathname?.includes('collections')
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

                {!userInfo?.role?.includes('Customer') ? (
                  <li
                    className={
                      history.location.pathname?.includes('reports')
                        ? ' cursor active'
                        : ' cursor'
                    }
                    role="presentation"
                    onClick={() => history.push(PATH_REPORTS_SECTION)}>
                    {history.location.pathname?.includes('reports') ? (
                      <img
                        width="32px"
                        className=" home-page-icon active"
                        src={GraphIconActive}
                        alt=""
                      />
                    ) : (
                      <img
                        width="32px"
                        className="home-page-icon  disactive"
                        src={GraphIconInActive}
                        alt=""
                      />
                    )}
                  </li>
                ) : null}
              </ul>
            </SideContents>
          </div>
        </MobileSidebar>
      ) : (
        ''
      )}
    </div>
  );
}

Header.defaultProps = {
  type: '',
};

Header.propTypes = {
  type: string,
  userInfo: shape({
    role: string.isRequired,
    first_name: string,
    last_name: string,
    documents: arrayOf(shape({})),
  }).isRequired,
};
