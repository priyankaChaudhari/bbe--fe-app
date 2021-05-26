import styled from 'styled-components';
import Theme from '../theme/Theme';

const InnerContainer = styled.div`
  max-width: 409px;
  width: 100%;
  margin: 0 auto;

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
      font-weight: 300;
      font-family: ${Theme.baseFontFamily};

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
  .company-contact-height {
    height: 420px;
    overflow: auto;

    &.form-field {
      height: 235px;
      overflow: auto;
    }
  }

  @media only screen and (max-width: 767px) {
    &.white-card-container {
      padding: 0 20px;
    }
  }
`;
export default InnerContainer;
