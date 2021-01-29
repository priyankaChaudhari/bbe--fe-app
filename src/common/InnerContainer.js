import styled from 'styled-components';
import Theme from '../theme/Theme';

const InnerContainer = styled.div`
  max-width: 409px;
  width: 100%;
  margin: 0 auto;
  // &.white-card-container {
  //   width: 100%;
  //   margin: 0 auto;
  //   max-width: 569px;
  // }
  .logo {
    position: relative;
    width: 100%;
    max-width: 330px;
    .header-logo {
      width: 170px;
      display: inline-table;
      text-algn: center;
      padding: 35px 0 45px 0;
    }

    span {
      position: absolute;
      margin-top: 43px;
      margin-left: 8px;
      font-size: 14px;
      font-weight: bold;
      color: ${Theme.black};
      font-family: ${Theme.titleFontFamily};
    }
  }
  .account-steps {
    text-transform: uppercase;
    font-size: 14px;
    font-family: ${Theme.baseFontFamily};
    color: #2e384d;
    font-weight: 600;
  }
  .page-heading {
    text-transform: none;
  }
  .help-info {
    font-size: 13px;

    .link-video {
      text-decoration: underline;
      cursor: pointer;
      font-size: 13px;
      color: ${Theme.orange};

      &.watch-video {
        font-size: 13px;
        text-decoration: none;
      }
    }
  }
  .video-call-icon {
    width: 16px;
    margin-top: 2px;
    margin-right: 5px;
    vertical-align: top;
  }

  .label-title {
    color: ${Theme.gray30};
    font-size: ${Theme.extraSmall};
    letter-spacing: 1.13px;
    text-transform: uppercase;
    font-weight: bold;

    .arrow-up {
      float: right;
    }
  }

  span {
    color: ${Theme.gray90};
    .social-media {
      width: 15px;
      margin-top: 3px;
      vertical-align: inherit;

      &.insta {
        width: 18px;
        margin-top: 3px;
        vertical-align: bottom;
      }
    }
  }
  // .gray-card {
  //   padding: 15px;
  //   background: #f4f6fc;
  //   position: relative;
  //   .contact-user-name {
  //     font-size: 17px;
  //     color: ${Theme.gray90};
  //   }

  //   .user-details {
  //     color: #8798ad;
  //     font-size: 13px;

  //     img {
  //       width: 15px;
  //       vertical-align: middle;
  //       margin-right: 10px;
  //     }
  //   }
  //   .delete-contact {
  //     position: absolute;
  //     width: 16px;
  //     top: 15px;
  //     right: 20px;
  //   }
  //   .edit-contact {
  //     position: absolute;
  //     top: 14px;
  //     right: 50px;
  //     width: 14px;
  //   }
  // }

  @media only screen and (max-width: 768px) {
    &.white-card-container {
      padding: 0 20px;
    }
  }
`;
export default InnerContainer;
