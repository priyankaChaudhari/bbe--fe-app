import styled from 'styled-components';

import Theme from '../theme/Theme';

const HeaderDownloadFuntionality = styled.div`
  position: sticky;
  background-color: ${Theme.white};
  padding: 26px 0 20px 0;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};
  min-height: 70px;
  color: ${Theme.black};
  font-size: ${Theme.normal};
  z-index: 9;
  top: 0px;

  &.border-none {
    border-bottom: 0;
  }
  .header-title {
    font-family: ${Theme.titleFontFamily};
    font-size: 13px;
    letter-spacing: 1.21px;
    text-transform: uppercase;
    &.large-header-title {
      font-size: 20px;
      font-weight: 600;
      margin-left: 25px;
    }
  }

  .contract-download-nav {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: end;

    li {
      display: inline-block;
      vertical-align: bottom;

      &.download-pdf {
        cursor: pointer;
        font-size: ${Theme.extraNormal};
        .download-pdf-link {
          color: ${Theme.black};
        }

        .download-pdf-icon {
          width: 20px;
          margin-right: 7px;
          vertical-align: text-top;

          &.upload-icon {
            transform: rotate(180deg);
          }
        }
      }

      .header-icon {
        vertical-align: text-top;
        margin-right: 3px;
        width: 18px;
        cursor: pointer;
      }
      .divide-arrow {
        background-color: ${Theme.gray4};
        width: 1px;
        height: 32px;
        border: 1px solid ${Theme.gray4};
        margin: 0 18px;
      }
      .assets-trash-icon {
        vertical-align: bottom;
        right: 21px;
        width: 20px;
      }
    }
  }
  @media only screen and (max-width: 767px) {
    .contract-download-nav {
      text-align: center;
      border-top: 1px solid ${Theme.gray5};
      margin-top: 20px;
      padding-top: 15px;
      li {
        .remove-cross-icon {
          position: absolute;
          top: -20px;
          right: 14px;
        }
        .hide-mobile {
          display: none;
        }
      }
    }
  }
  @media only screen and (max-width: 610px) {
    .header-title {
      &.large-header-title {
        margin-left: 10px;
      }
    }
  }
`;

export default HeaderDownloadFuntionality;
