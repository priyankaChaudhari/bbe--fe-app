import styled from 'styled-components';
import Theme from '../../theme/Theme';

export const GrayBody = styled.div`
  .graycontainer-fluid {
    /* width: 98%; */
    margin: 0 auto;
    padding-left: 20px;
  }
  .drop-down-option {
    width: 100%;
    min-height: 1px;
    overflow-y: auto;
    top: 40px;
    max-height: 225px;
    font-size: ${Theme.normal};
    color: ${Theme.gray35};
    /* border-bottom: 1px solid ${Theme.gray9}; */
    border-left: 1px solid ${Theme.gray9};
    border-right: 1px solid ${Theme.gray9};
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 1px;
    z-index: 2;
    background-color: ${Theme.white};
    box-shadow: 0 15px 15px 0 rgba(68, 68, 79, 0.1);
    position: absolute;

    ul {
      padding: 0;
      margin: 0;
      list-style-type: none;

      li {
        padding: 8px;
        float: left;
        width: 100%;
        /* &:first-child {
             border-top: 1px solid ${Theme.gray7};
          } */

        .book-list-icon {
          vertical-align: top;
          margin-right: 10px;
          width: 25px;
          margin-top: 4px;
          float: left;
        }
        .header-list {
          color: ${Theme.gray90};
          font-size: ${Theme.normal};
          font-weight: 800;

          .sub-list {
            color: ${Theme.gray35};
            font-size: 14px;
            font-weight: 300;
          }
        }
      }
      .result-found {
        color: ${Theme.gray35};
        font-size: 11px;
        text-transform: uppercase;
        font-family: ${Theme.titleFontFamily};
        padding: 18px 0 8px 0;
        letter-spacing: 0.85px;
        border-top: 1px solid ${Theme.gray9};
      }
    }
  }

  .small-title {
    font-size: ${Theme.textFontSize};
    color: ${Theme.gray90};
    font-family: ${Theme.titleFontFamily};
    padding: 10px 0 0 10px;

    .back-to-pervious {
      font-size: ${Theme.small};
      font-weight: 300;
      color: ${Theme.gray90};
      font-family: ${Theme.baseFontFamily};
    }
  }
  .left-arrow {
    width: 16px;
    vertical-align: top;
    margin-right: 1px;
  }

  .edit-profile-text {
    position: relative;
    img {
      border-radius: 50%;
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }

    .name-email {
      color: ${Theme.gray35};
      font-size: ${Theme.normal};

      .team-member-name {
        color: ${Theme.black};
        font-size: 18px;
      }
    }
  }

  .sub-heading {
    color: ${Theme.gray90};
    font-size: 24px;
  }

  .steps-to-avoid {
    padding: 0;
    margin: 0;
    list-style-type: none;
    li {
      color: ${Theme.gray90};
      font-size: 16px;
      padding-bottom: 18px;

      img {
        width: 15px;
        margin-right: 10px;
      }
    }
  }
  .article-details-text {
    margin: 0 auto;
    padding: 0 45px 0 30px;
    overflow-x: auto;
    height: 80vh;
    width: 100%;

    h2.ghq-card-content__medium-heading {
      color: ${Theme.gray90};
      font-size: ${Theme.title};
      font-family: ${Theme.baseFontFamily};
    }
    .ghq-card-content__horizontal-rule {
      display: block;
      &:first-of-type {
        display: none;
      }
    }

    .ghq-card-content__video-responsive-wrapper {
      .ghq-card-content__video {
        width: 90%;
        height: 400px;
      }
      @media only screen and (min-width: 1600px) and (max-width: 1920px) {
        .ghq-card-content__video {
          width: 90%;
          height: 500px;
        }
      }
    }

    .remove-author > .ghq-card-content__paragraph {
      display: block;
      &:first-of-type {
      }
    }
    p.ghq-card-content__paragraph {
      color: ${Theme.gray90};
      font-size: ${Theme.extraMedium};
      line-height: 24px;
      font-weight: 300;
      white-space: break-spaces;
    }
    .ghq-card-content__image {
      /* width: -webkit-fill-available !important; */
      width: auto !important;
      max-width: -webkit-fill-available !important;
    }

    .ghq-card-content__table-responsive-wrapper {
      .ghq-card-content__table-scroller {
        .ghq-card-content__table {
          border-collapse: collapse;
          .ghq-card-content__table-body {
            .ghq-card-content__table-row {
              .ghq-card-content__table-cell {
                color: #2e384d;
                border: 1px solid ${Theme.gray20};
                padding: 5px;
              }
            }
          }
        }
      }
    }
    .ghq-card-content__numbered-list,
    .ghq-card-content__bulleted-list {
      color: ${Theme.gray90};
    }
  }

  @media only screen and (min-width: 1700px) {
    .graycontainer-fluid {
      width: 100%;
      margin: 0 auto;
    }
  }

  @media only screen and (max-width: 991px) {
    .graycontainer-fluid {
      padding: 0 7px;
    }
    .back-to-pervious-page {
      font-size: ${Theme.extraMedium} !important;
      font-weight: 300;
      color: ${Theme.gray90};
      font-family: ${Theme.baseFontFamily};
    }
    .article-details-text {
      height: 100% !important;
      overflow: none !important;
    }
  }
  @media only screen and (max-width: 767px) {
    .btn-with-radius {
      width: 100%;
      margin-top: 25px;
    }
    .small-title {
      .back-to-pervious-page {
        font-size: ${Theme.extraMedium};
      }
    }

    .article-details-text {
      height: 100% !important;
      overflow: none !important;
    }
  }
`;

export default GrayBody;
