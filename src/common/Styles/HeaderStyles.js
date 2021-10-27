import styled from 'styled-components';

import Theme from '../../theme/Theme';

export const MainHeader = styled.div`
  background-color: ${Theme.white};
  height: 70px;
  border-bottom: 1px solid ${Theme.gray7};
  padding-top: 13px;
  position: fixed;
  width: 100%;
  z-index: 9;
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
        font-size: ${Theme.normal};
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

    .show {
      display: block;
    }
  }

  .dropdown-content {
    display: none;
    position: absolute;
    width: 230px;
    box-shadow: ${Theme.commonShadow};
    padding: 0px;
    z-index: 999999;
    text-align: left;
    background: ${Theme.white};
    border: 1px solid ${Theme.gray9};
    margin-top: 8px;
    margin-left: -185px;

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

  @media only screen and (max-width: 991.98px) {
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
  @media only screen and (max-width: 767px) {
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

export const MobileSidebar = styled.div`
  display: none;
  #mobilemenu-check {
    display: none;
  }

  @media only screen and (max-width: 991.98px) {
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
        color: ${Theme.white};
        font-size: ${Theme.normalRes};
        font-family: ${Theme.titleFontFamily};
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
  @media only screen and (max-width: 767px) {
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

export const SideContents = styled.div`
  @media (max-width: 991.98px) {
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

export const FormContainer = styled.div`
  height: 100%;
  .banner-bg {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
  }

  .inner-form {
    max-width: 327px;
    margin: 0 auto;
    width: 100%;
    vertical-align: middle;

    .logo {
      width: 190px;
      padding: 35px 0 45px 0;

      span {
        position: absolute;
        top: 46px;
        margin-left: 6px;
        font-size: 16px;
        font-weight: bold;
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
    .google-icon {
      width: 20px;
      margin-right: 10px;
      vertical-align: bottom;
    }
    .or-else {
      text-align: center;
      margin-top: 8px;
    }
  }

  .profile-pic {
    font-family: ${Theme.titleFontFamily};
    color: ${Theme.gray35};
  }

  @media only screen and (max-width: 991px) {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 100%;

    .inner-form {
      background: rgb(91 91 91 / 0.9);
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;
    }
  }
`;

export const PasswordFormContainer = styled.div`
  height: 100%;
  .banner-bg {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
  }

  .inner-form {
    max-width: 327px;
    margin: 0 auto;
    width: 100%;
    vertical-align: middle;

    .logo {
      width: 190px;
      padding: 35px 0 45px 0;

      span {
        position: absolute;
        top: 46px;
        margin-left: 6px;
        font-size: 16px;
        font-weight: bold;
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
    .google-icon {
      width: 20px;
      margin-right: 10px;
      vertical-align: bottom;
    }
    .or-else {
      text-align: center;
      margin-top: 8px;
    }
  }

  @media only screen and (max-width: 991px) {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 100%;

    .inner-form {
      background: rgb(91 91 91 / 0.9);
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;
    }
  }
`;
