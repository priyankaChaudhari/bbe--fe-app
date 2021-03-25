/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styled from 'styled-components';
import Theme from '../theme/Theme';
import {
  Logo,
  // EditIcons,
  // LogOutIcons,
  // DefaultUser,
  UserGroupIcon,
  ReadBookIcon,
  ReadBookIconActive,
  UserGroupIconActive,
  LightBulb,
  MenuIcon,
  LogoMobileView,
} from '../theme/images/index';

export default function KnowledgeBaseHeader() {
  return (
    <div>
      <Header>
        <div className="container-fluid">
          <div className="row">
            <div className="col-10">
              <div className="logo">
                <img className="logo-web" src={Logo} alt="logo " />{' '}
                <span> CENTRAL</span>
              </div>
              <img className="logo-mobile-view" src={LogoMobileView} alt="" />
            </div>
            <div className="col-2 text-right ">
              <ul className="knowledage-base-nav">
                <li>
                  <div className="right-nav">
                    <div className="suggest-box">
                      {' '}
                      <img className="light-bulb-icon" src={LightBulb} alt="" />
                    </div>
                  </div>
                </li>
                <li>
                  {/* <div className="header-user-profile">
                    <div className="dropdown" role="presentation">
                      <div id="clickbox" className="header-profile">
                        <img
                          src={profilePic}
                          className="profile-pic"
                          alt="user"
                        />
                      </div>
                      <ul className="dropdown-content">
                        <li role="presentation">
                          <img src={EditIcons} alt="edit" /> Edit profile
                        </li>
                        <li role="presentation" style={{ cursor: 'pointer' }}>
                          <img src={LogOutIcons} alt="logout" /> Log out
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Header>
      <MobileSidebar>
        <label htmlFor="mobilemenu-check" id="responsive-button">
          <img src={MenuIcon} alt="Menu Lines" className="menu-icon cursor" />
        </label>
        <input type="checkbox" id="mobilemenu-check" />
        <div id="ifp-sidebar-responsive">
          <label
            htmlFor="mobilemenu-check"
            className="close-icon d-xl-none d-block">
            {/* <img src={CloseIcon} alt="cross" /> */}
          </label>
          <SideContents>
            {' '}
            <ul className="side-bar-icon ">
              <li>
                <img className="user-group" src={UserGroupIconActive} alt="" />
                <img
                  className="user-group-active "
                  src={UserGroupIcon}
                  alt=""
                />
              </li>
              <li className="active">
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

const Header = styled.div`
  background-color: ${Theme.white};
  height: 70px;
  border-bottom: 1px solid ${Theme.gray7};
  padding-top: 14px;

  .logo {
    width: 160px;
    margin-top: 5px;
    // display: inline-table;

    span {
      position: absolute;
      top: 14px;
      left: 183px;
      font-size: ${Theme.normal};
      font-weight: bold;
      color: ${Theme.black};
      font-family: ${Theme.titleFontFamily};
    }
  }
  .logo-mobile-view {
    display: none;
  }

  .knowledage-base-nav {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      display: inline-block;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
      .right-nav {
        .suggest-box {
          position: relative;

          .light-bulb-icon {
            width: 40px;
            border-radius: 50%;
            display: block;
            padding: 12px;
            background: #f2f4f7;
            cursor: pointer;
          }
        }
      }
    }

    .dropdown-content {
      display: none;
      position: absolute;
      min-width: 200px;
      box-shadow: ${Theme.commonShadow};
      padding: 0px;
      z-index: 999999;
      text-align: left;
      background: ${Theme.white};
      border: 1px solid ${Theme.gray9};
      margin-top: 8px;
      margin-left: -110px;

      li {
        list-style-type: none;
        padding-bottom: 10px;
        font-size: ${Theme.normal};
        color: ${Theme.gray90};
        padding: 10px;
        cursor: pointer;

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
  }
  @media only screen and (max-width: 991px) {
    height: 82px;
    padding-top: 13px;

    .logo {
      margin-left: 66px;
      margin-top: 15px;
      width: 185px;

      span {
        left: 275px;
        top: 24px;
      }
    }
    .suggest-box {
      margin-top: 5px;
    }
  }
  @media only screen and (max-width: 767px) {
    .logo {
      display: none;
    }

    .logo-mobile-view {
      display: block;
      width: 90px;
      margin-left: 60px;
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
        margin-top: -52px;
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
`;

const SideContents = styled.div`
  @media (max-width: 991px) {
    // height: 100%;
    // width: 240px;
    // left: 0;
    // z-index: 98;
    // background-color: ${Theme['$base-color']};
    // font-family: ${Theme['$base-font-family']};
    // overflow-x: hidden;
    max-width: 64px;
    position: absolute;
    top: 80px;
    left: 0;
    min-height: 100%;
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
