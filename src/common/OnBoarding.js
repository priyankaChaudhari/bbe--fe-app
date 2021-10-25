import styled from 'styled-components';
import Theme from '../theme/Theme';

const OnBoardingBody = styled.div`
  padding: 60px 0px 0 0px;

  &.body-start {
    min-height: calc(100% - 70px);
    background: ${Theme.white};
  }

  .already-user-msg {
    background-color: ${Theme.lightOrange};
    border-radius: 5px;
    padding: 6px 10px;
  }

  &.body-white {
    background: ${Theme.white};
    padding-top: 0;
  }

  &.grey-bg {
    background: ${Theme.gray8};
    min-height: 100%;
  }

  &.grey-bg-asset {
    background: ${Theme.gray8};
    min-height: calc(100% - 70px);
  }

  .white-card-base {
    background-color: ${Theme.white};
    border-radius: 8px;
    max-width: 480px;
    width: 100%;
    margin: 0 auto;
    padding: 40px 40px 35px 40px;
    color: ${Theme.black};
    font-size: ${Theme.normal};
    box-shadow: 0px 5px 15px 0px #44444f33;
    margin-top: 60px;

    .lock-finish {
      padding-bottom: 22px;
      margin-top: -10px;
    }
    .account-steps {
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
      font-family: ${Theme.titleFontFamily};
      text-transform: uppercase;
      padding-bottom: 10px;
    }
    .page-heading {
      font-family: ${Theme.baseFontFamily};
      text-transform: initial;
      padding-bottom: 13px;
      line-height: 34px;
    }
    .copy-info {
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      .copy-icon {
        width: 13px;
        color: ${Theme.gray85};
        font-size: ${Theme.extraNormal};
        margin-right: 6px;
      }
    }
    .invitation-text {
      font-size: ${Theme.normal};
      max-width: 395px;
      margin: auto;
      line-height: 22px;
      width: 100%;
    }
    .information-text {
      font-weight: 300;
      padding-bottom: 13px;
      line-height: 22px;
      font-size: ${Theme.normal};
      position: relative;

      .hi-name {
        margin-bottom: 12px;
        text-transform: capitalize;
      }
      .sub-information {
        text-transform: initial;
        margin-bottom: 12px;
        color: ${Theme.black};
      }
      .note {
        font-style: italic;
        color: ${Theme.black};
      }
      .text-bold {
        font-weight: bold;
      }
      .completed-status {
        color: ${Theme.orange};
        .orange-check {
          width: 16px;
          margin-right: 5px;
          vertical-align: middle;
        }
      }
      .pending-status {
        color: ${Theme.gray35};
        .pending-icon {
          width: 14px;
          margin-right: 4px;
          vertical-align: middle;
        }
      }
      .view-details {
        color: ${Theme.gray85};
        font-size: ${Theme.extraNormal};
        position: absolute;
        right: 21px;
        top: 0;
        cursor: pointer;
      }
    }
    .complete-steps {
      font-family: ${Theme.titleFontFamily};

      span {
        font-family: ${Theme.baseFontFamily};
      }
    }
    .account-steps-check {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        padding-bottom: 10px;

        img {
          width: 14px;
          margin-right: 6px;
        }
      }
    }
    .reach-out {
      color: ${Theme.gray90};
      font-family: ${Theme.regularItalicFontFamily};
      font-weight: 600;
      // font-style: italic;
      font-size: ${Theme.normal};

      .reach-out-link {
        color: ${Theme.orange};
        font-family: ${Theme.regularItalicFontFamily};
        text-transform: lowercase;
        text-decoration: underline;
      }
    }
    .info-text-gray {
      color: ${Theme.gray40};
      font-size: 14px;
      line-height: 22px;

      .video-link {
        font-size: 14px;
        color: ${Theme.orange};
        text-transform: initial;
        position: relative;
      }
      &.security {
        font-size: 12px;
        float: right;
        max-width: 345px;
      }
      &.security-lock span {
        font-size: 12px;
        vertical-align: text-bottom;
        margin-left: 4px;
      }
    }
    .link-url {
      font-size: 14px;
      color: ${Theme.orange};
      text-transform: initial;
      text-decoration: underline;
    }

    .label-title {
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
      text-transform: uppercase;
      font-weight: bold;
      font-family: ${Theme.titleFontFamily};
      .arrow-up {
        float: right;
        width: 19px;
      }
    }

    span {
      color: ${Theme.gray90};
      .social-media {
        width: 15px;
        margin-top: 3px;
        vertical-align: inherit;

        &.insta {
          width: 19px;
          margin-top: 3px;
          vertical-align: bottom;
        }
        &.linedin {
          width: 18px;
          margin-top: 3px;
          vertical-align: bottom;
        }
        &.face-book {
          width: 14px;
        }
      }
    }
    .hereby-acknowledge {
      line-height: 20px;
      font-size: ${Theme.extraSmall};
    }
    .reach-out-link {
      color: ${Theme.orange};
      font-family: ${Theme.regularItalicFontFamily};
      text-transform: lowercase;
      text-decoration: underline;
    }

    .billing-address {
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-weight: 600;
    }
    .payment-type {
      list-style-type: none;
      margin: 0;
      padding: 0;
      li {
        display: inline-block;
        margin-right: 46px;
        &:last-child {
          margin-right: 0px;
        }
      }
    }
    .text-verify-account {
      font-size: ${Theme.extraNormal};
      color: ${Theme.gray85};
      line-height: 20px;
    }
    .upload-product-asset {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        display: -webkit-box;
        padding: 10px 0 10px 0;
        border-bottom: 1px solid ${Theme.gray7};
        .product-asset-image {
          border: 2px solid #bfc5d2;
          border-radius: 6px;
          width: 36px;
          height: 36px;
          vertical-align: middle;
          float: left;
          margin-right: 15px;
          img {
            width: 32px;
            height: 32px;
          }
        }
        .image-title {
          float: left;
          font-size: ${Theme.extraNormal};
          .product-asset-title {
            font-size: ${Theme.normal};
            color: ${Theme.black};
            font-weight: 600;
            max-width: 340px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
          }
          .product-asset-subtitle {
            font-size: ${Theme.extraSmall};
            color: ${Theme.gray40};
          }
        }
      }
    }
  }

  .w-430 {
    max-width: 430px;
    margin: 0 auto;
    width: 100%;
  }
  .panel {
    padding: 0;
    max-width: 400px;
    margin-top: 55px;
    box-shadow: none;
  }
  .panel-unauthorize-header {
    margin-top: 190px;
  }
  .account-reassign {
    margin-top: 140px;
  }
  .gap-none {
    margin-top: 0;
  }
  @media only screen and (max-width: 517px) {
    .white-card-base {
      width: 90%;
    }
  }
`;

export default OnBoardingBody;
