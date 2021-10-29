import styled from 'styled-components';
import Theme from '../../theme/Theme';

export const ArticleDetail = styled.div`
  height: 100%;

  .board {
    width: 50%;
    float: left;
    overflow-x: auto;
    height: 100%;
    height: 80vh;
    border-right: 1px solid ${Theme.gray7};
  }

  .articles {
    width: 50%;
    float: left;
    height: 100%;
    height: 80vh;
    overflow-x: auto;
    border-right: 1px solid ${Theme.gray7};
  }

  .acc-management-list {
    padding: 0;
    margin: 0;
    list-style-type: none;
    overflow: auto;

    li {
      color: ${Theme.gray90};
      font-size: ${Theme.normal};
      line-height: 22px;
      font-family: ${Theme.baseFontFamily};
      padding: 0px 9px 15px 0;
      text-align: left;

      .category {
        border-left: 3px solid ${Theme.white};
        padding-left: 10px;
      }

      &:hover {
        .category {
          border-left: 3px solid ${Theme.orange};
          font-family: ${Theme.titleFontFamily};
          cursor: pointer;
        }

        .label {
          border-left: 3px solid ${Theme.white};
        }
      }
      &.active {
        .category {
          border-left: 3px solid ${Theme.orange};
          font-family: ${Theme.titleFontFamily};
          cursor: pointer;
        }

        .label {
          border-left: 3px solid ${Theme.white};
        }
      }
    }
    .label {
      font-size: 11px;
      color: #8798ad;
      text-transform: uppercase;
      font-family: ${Theme.titleFontFamily};
      border-left: 3px solid ${Theme.white};
      letter-spacing: 0.85px;
      margin-bottom: 10px;
      margin-top: 8px;
    }
  }
  @media only screen and (min-width: 1500px) {
    .board {
      height: 85vh;
    }

    .articles {
      height: 85vh;
    }
  }
  @media only screen and (max-width: 991px) {
    .articles {
      border-right: none;
    }
  }
  @media only screen and (max-width: 767px) {
    .board {
      width: 100%;
      border-right: none;
    }
    .articles {
      width: 100%;
      border-right: none;
    }
    .acc-management-list {
      li {
        .category {
          border-left: none !important;
          padding-left: 10px;
          font-family: ${Theme.baseFontFamily} !important;

          .label {
            border-left: none !important;
          }
          &:hover {
            .category {
              border-left: none !important;
              font-family: ${Theme.baseFontFamily} !important;
            }

            .label {
              border-left: none !important;
              font-family: ${Theme.baseFontFamily} !important;
            }
          }
          &.active {
            .category {
              border-left: none !important;
              font-family: ${Theme.baseFontFamily} !important;
              cursor: pointer;
            }

            .label {
              border-left: none !important;
              font-family: ${Theme.baseFontFamily} !important;
            }
          }
        }
      }
    }
  }
`;
export default ArticleDetail;
