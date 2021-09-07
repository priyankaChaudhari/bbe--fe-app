import styled from 'styled-components';
import Theme from './Theme';
import { BannerBg } from './images/index';

export const GroupUser = styled.div`
  display: flex;
  .activity-user {
    font-size: ${Theme.normal};
    color: ${Theme.black};
    font-weight: 500;
    line-height: 18px;
    overflow-wrap: break-word;
    text-align: left;
    float: left;
    width: 80%;
    span {
      color: ${Theme.gray35};
      font-weight: 500;

      &.font-bold {
        font-weight: 600;
        color: ${Theme.black};
      }
      &.note-text {
        color: ${Theme.black};

        p {
          span {
            color: unset;
          }
        }
      }
    }
    p {
      margin: 0;
      font-size: 15px;
      display: contents;
      word-break: break-all;
      &.note-text {
        color: ${Theme.black};

        p {
          span {
            color: unset;
          }
        }
      }
    }
  }
  .email-clicks {
    float: left;
    margin-top: 10px;
    margin-left: 5px;
    .email-opens {
      border-right: 1px solid ${Theme.gray35};
      padding: 0 8px;
      color: ${Theme.black};
      &:last-child {
        border-right: none;
      }
    }
  }
  .default-user-activity {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    float: left;
    margin-right: 15px;
    margin-top: -2px;

    &.contract-mail {
      width: 20px;
      height: 20px;
      margin-top: 0px;
      margin: 10px;
    }
  }

  .contract-email {
    background-color: #f4f6fc;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
  }

  .time-date {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    font-weight: 500;
    text-align: left;
    overflow-wrap: break-word;

    .pin {
      color: ${Theme.black};
      position: relative;

      .more-action {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: contents;
        li {
          display: inline-block;
          position: relative;
          margin-left: 18px;
          cursor: pointer;
          padding: 0;
          .dot {
            background-color: #8798ad;
            border-radius: 50%;
            width: 3px;
            height: 3px;
            position: absolute;
            top: 7px;
            margin-left: -10px;
          }

          &.delete {
            cursor: pointer;
            color: ${Theme.black};
            /* .delete-msg {
              display: none;
            } */
            .delete {
              color: ${Theme.black};
            }

            /* &:hover { */
            .delete-msg {
              display: block;
              border-radius: 6px;
              box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1);
              background-color: ${Theme.white};
              color: ${Theme.red};
              font-size: 16px;
              text-align: center;
              position: absolute;
              top: 25px;
              width: 170px;
              padding: 17px 0;
              z-index: 99999;
              font-weight: 600;
              .red-trash-icon {
                width: 18px;
                vertical-align: text-top;
                margin-right: 6px;
              }
              @media only screen and (max-width: 1900px) and (min-width: 1495px) {
                &.confirm-delete-anno {
                  left: -100px;
                }
              }
              @media only screen and (max-width: 1200px) and (min-width: 991px) {
                &.confirm-delete-anno {
                  left: -100px;
                }
              }
              @media only screen and (max-width: 477px) and (min-width: 366px) {
                &.confirm-delete-anno {
                  left: -100px;
                }
              }
            }
            /* } */
          }
        }
      }
    }
  }
  .pin-icon {
    position: absolute;
    width: 23px;
    background: white;
    top: 20px;
    left: 42px;
  }

  .user-email-address {
    color: ${Theme.gray85};
    text-align: left;
    font-size: ${Theme.normal};
    float: left;
    word-break: break-all;
    width: 86%;
  }
`;
export const BrandPartnerDashboard = styled.div`
  //padding-left: 62px;

  .partner-select {
    list-style-type: none;
    padding: 0;
    margin: 10px 0;
    li {
      display: inline-block;
      width: 250px;
      margin-right: 10px;
      vertical-align: top;

      &.my-partner {
        width: 220px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .text-md-right {
    text-align: right;
  }
  .text-sm-left {
    dispaly: none;
  }
  .dashboard-header-sticky {
    position: fixed;
    left: 64px;
    right: 0;
    z-index: 1;
    background-color: ${Theme.white};
    border-bottom: 1px solid ${Theme.gray7};
  }
  .footer-sticky {
    padding-left: 64px;
  }

  @media only screen and (max-width: 991px) {
    padding-left: 0;

    .dashboard-header-sticky {
      left: 0;
    }
    .partner-select {
      list-style-type: none;
      text-align: left;

      li {
        width: 240px;

        &.my-partner {
          width: 208px;
        }
      }
    }
    .footer-sticky {
      padding-left: 0;
    }
  }
  @media only screen and (max-width: 767px) {
    .text-sm-left {
      text-align: left;
    }
    .partner-select {
      list-style-type: none;
      text-align: left;

      li {
        width: 100%;
        margin-bottom: 10px;

        &.my-partner {
          width: 100%;
        }
      }
    }
  }
`;

export const DashboardCard = styled.div`
  background: ${Theme.gray6};
  min-height: 100vh;
  height: 100%;
  padding-top: 70px;
  .dashboard-container-body {
    max-width: 1220px;
    width: 100%;
    margin: 0 auto;
    padding-top: 40px;
    padding-left: 64px;
  }
  .dashboard-body {
    max-width: 1334px;
    width: 100%;
    margin: 0 auto;
    padding-top: 40px;
    padding-left: 62px;

    .company-logo {
      border-radius: 10px;
      width: 66px;
      height: 66px;
      margin-bottom: 8px;
    }

    .company-name {
      vertical-align: middle;
      position: relative;
      color: ${Theme.black};
      font-size: ${Theme.title};
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 270px;
      min-height: 20px;
    }

    .status {
      color: ${Theme.gray85};
      font-size: ${Theme.extraNormal};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 270px;
      min-height: 15px;
    }

    .solid-icon {
      border-radius: 6px;
      width: 36px;
      height: 36px;
    }

    p.black-heading-title {
      font-size: 14px;
    }
    .card-label {
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
      font-family: ${Theme.titleFontFamil};
      text-transform: uppercase;
      font-weight: 800;
      margin-bottom: 5px;
    }
    .sold-price {
      color: ${Theme.gray80};
      font-size: 20px;
      font-weight: 500;
    }
    .vs {
      color: ${Theme.gray40};
      font-size: ${Theme.normal};
    }
    .spacing {
      margin: 10px 0 10px 0;
    }
  }
  .white-card-container {
    padding: 0;
    margin: 0 0 15px 0;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
    li {
      width: 100%;
      display: inline-block;
      max-width: 20%;
      flex: 0 0 20%;
      position: relative;
      width: 100%;
      padding-right: 10px;
      padding-left: 10px;
      margin-bottom: 15px;
    }
  }

  @media only screen and (max-width: 767px) {
    &.finance-dashboard {
      padding-top: 70px;
    }

    .dashboard-body {
      padding-left: 0;
      padding-top: 40px;
    }
    &.ad-manager-dashboard {
      padding-top: 50px;
    }
    .dashboard-container-body {
      padding: 20px 15px 0 15px;
    }
    .white-card-container {
      li {
        max-width: 50% !important;
        flex: 0 0 50% !important;

        &:first-child {
          max-width: 100% !important;
          flex: 0 0 100% !important;
        }
      }
    }
  }
  @media only screen and (max-width: 991px) {
    .dashboard-container-body {
      padding: 30px 15px 0 15px;
    }
    .dashboard-body {
      padding-top: 70px;
      padding-left: 0;
      padding-right: 15px;
    }
    .white-card-container {
      li {
        max-width: 33.333%;
        flex: 0 0 33.333%;
      }
    }
  }

  @media only screen and (min-width: 1600px) {
    .dashboard-body {
      max-width: 1434px;
    }
    .dashboard-container-body {
      max-width: 1320px;
    }
  }

  @media only screen and (min-width: 1700px) and (min-width: 1920px) {
    .dashboard-body {
      max-width: 85%;
    }
    .dashboard-container-body {
      max-width: 80%;
    }
  }
`;

export const FormContainer = styled.div`
  height: 100%;
  .banner-bg {
    width: 100%;
    height: 100%;
    background-image: url(${BannerBg});
    background-position: center;
    background-size: cover;
  }

  .inner-form {
    max-width: 360px;
    margin: 0 auto;
    width: 100%;
    vertical-align: middle;

    .logo {
      img {
        width: 160px;
        display: inline-table;
        padding: 40px 0 100px 0;
      }
    }
    .sub-text {
      color: ${Theme.black};
      font-size: ${Theme.normal};
      margin: 0 0 22px 0;
      line-height: 22px;
    }

    .google-icon {
      width: 40px;
      position: absolute;
      top: 2px;
      margin-right: 10px;
      left: 2px;
      bottom: -2px;
      vertical-align: bottom;
    }

    h2 {
      font-size: ${Theme.MediumTitleFontSize};
    }
    .back-link {
      font-weight: 500;
      .arrow-back {
        vertical-align: middle;
        width: 15px;
        margin-right: 8px;
      }
    }
    .forgot-pswd-link {
      color: ${Theme.gray40};
      font-size: ${Theme.extraNormal};
    }
  }

  @media only screen and (max-width: 991px) {
    background-position: center;
    background-size: cover;
    background-image: url(${BannerBg});
    background-repeat: no-repeat;
    height: 100%;

    .inner-form {
      background: rgb(91 91 91 / 0.9);
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;

      .sub-text {
        color: ${Theme.white};
      }

      label {
        color: ${Theme.white};
      }
      h2 {
        font-size: ${Theme.MediumTitleFontSize};
        color: ${Theme.white};
      }
      .back-link {
        font-weight: 500;
        color: ${Theme.white};
        .arrow-back {
          vertical-align: middle;
          width: 15px;
          margin-right: 8px;
        }
      }
      .forgot-pswd-link {
        color: ${Theme.white};
      }
    }
  }
`;
export const TabletViewManager = styled.div`
  .company-logo {
    width: 47px;
    height: 47px;
    margin-right: 14px;
    float: left;
  }
  .company-name {
    vertical-align: middle;
    position: relative;
    color: ${Theme.black};
    font-size: ${Theme.title};
    font-weight: 600;
  }
  .increase-rate {
    font-weight: 600;
  }
  .label-info {
    font-weight: 600;
  }
  .status {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
  }
  @media only screen and (max-width: 768px) {
    padding-top: 20px;
  }
`;

export default global;
