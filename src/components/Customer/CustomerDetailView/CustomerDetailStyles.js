import styled from 'styled-components';

import Theme from '../../../theme/Theme';

export const CustomerDetailsBody = styled.div`
  background: ${Theme.gray6};
  min-height: 100%;
  width: 100%;
  padding-left: ${(props) =>
    props.role.includes('Customer') ? '45px' : '109px'};
  padding-right: 45px;
  .back-btn-link {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
    text-transform: initial;
    cursor: pointer;
    display: contents;

    .left-arrow {
      width: 16px;
      margin-right: 5px;
      vertical-align: bottom;
    }
  }
  .add-more-people {
    background-size: 100%;
    display: inline-block;
    vertical-align: top;

    img {
      border-radius: 50%;
      width: 40px;
      margin-left: -7px;
      height: 40px;
    }

    &.btn-add-team {
      background-color: ${Theme.white};
      border: 1px solid ${Theme.gray2};
      border-radius: 100%;
      width: 36px;
      margin-left: 2px;
      height: 36px;
      img {
        width: 15px;
        margin: -2px 9px 3px 2px;
      }
    }
  }

  .customer-body-container {
    max-width: 1220px;
    margin: 0 auto;
    width: 100%;
  }

  .account-type {
    float: none !important;
    margin: 0 auto;
  }

  .customer-dropdown-select {
    color: ${Theme.black};
    padding: 0 0px 0px 25px;
    background-color: ${Theme.white};
    border-radius: 8px;
    width: 100%;
    padding: 10px 0;
    border-left: 3px solid ${Theme.orange};
    color: ${Theme.black};
    font-size: 16px;
    font-weight: bold;
    height: 55px;
    border-right: none;
    border-top: none;
    border-bottom: none;

    &:focus {
      outline: none;
    }

    .css-yk16xz-control {
      border: none;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }
    .css-1pahdxg-control {
      border: none !important;
      box-shadow: none !important;
      cursor: pointer;

      &:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
    .css-26l3qy-menu {
      margin-top: -1px;
      border-radius: 4px;
      border-top: none;
      padding: 18px 0;
      border: none;
      box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.1);
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-weight: 500;
    }
  }

  @media only screen and (max-width: 991px) {
    padding: 0 20px;

    .account-type {
      float: none !important;
      margin: unset;
    }
  }
  @media only screen and (max-width: 767px) {
    .account-type {
      float: none !important;
      margin: 0 auto;
    }
  }
`;

export const NotesSideBar = styled.div`
  top: 0;
  background: #ffff;
  height: 100%;
  .footer-sticky {
    position: fixed;
    bottom: 0;
    max-width: 600px;
    width: 100%;
    background: white;
  }
  .notes-pin-unpin {
    position: relative;

    .pin-icon {
      background: #0062ff;
      padding: 2px;
      border-radius: 50%;
      width: 19px;
      position: absolute;
      top: 27px;
      left: 25px;
      transform: rotate(-46deg);
    }
  }
  .chat-info-icon {
    position: absolute;
    right: 47px;
  }
  .dropdown-select-all-notes {
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2};
    border-radius: 20px;
    width: 230px;
    height: 40px;
    color: ${Theme.black};
    padding: 11px 2px 0 14px;
  }
  .dropdown-notes-filter {
    background-color: ${Theme.white};
    border-radius: 8px;
    box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.4);
    max-width: 230px;
    padding: 15px;
    position: absolute;
    z-index: 99999;
    top: 45px;
    width: 100%;

    &.hide {
      display: none;
    }
    &.show {
      display: block;
    }
    .notes-option {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        padding-bottom: 14px;

        &.checkbox-option {
          padding-bottom: 4px;
        }

        &.teams-title {
          color: ${Theme.gray40};
          text-transform: uppercase;
          font-size: 11px;
          padding: 5px 0 15px 0;
          font-family: ${Theme.titleFontFamily};
        }
      }
    }
  }
  .commemt-inbox-body {
    height: 80vh;
    overflow: scroll;
    padding-bottom: 50px;
  }
  @media only screen and (max-width: 767px) {
    .dropdown-select-all-notes {
      width: 100%;
      max-width: 100%;
    }
    .commemt-inbox-body {
      height: 60vh;
      overflow: scroll;
    }
  }
`;
