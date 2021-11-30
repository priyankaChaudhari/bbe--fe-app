import styled from 'styled-components';
import Theme from '../theme/Theme';

const Table = styled.table`
  position: relative;
  width: 100%;

  &.customer-list {
    margin-top: 85px;
  }

  tr {
    text-align: left;
    background: ${Theme.white};
    border: 1px solid rgba(46, 91, 255, 0.08);
    border-radius: 1px;
    font-family: ${Theme.baseFontFamily};
    width: 100%;
    th {
      padding: 13px 0px;
      text-transform: uppercase;
      color: ${Theme.gray40};
      font-size: 11px;
      background: ${Theme.white};
      font-family: ${Theme.baseFontFamily};
      &.product-catalog-header {
        border-top: 1px solid ${Theme.gray11};
      }
      &.product-header {
        border-bottom: 1px solid ${Theme.gray11};
      }
    }

    td {
      padding: 20px 10px 3px 10px;
      vertical-align: middle;
      position: relative;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-weight: 600;

      &.product-body {
        padding: 13px 20px 13px 0;

        &.light-font {
          font-weight: 300;
        }
      }
      &.agreement {
        font-size: ${Theme.normal};
        border-bottom: 1px solid ${Theme.gray11};
        font-weight: 300;

        .orange-icon {
          margin-left: 10px;
          vertical-align: middle;
        }
      }
      &.product-table-body {
        padding: 13px 4px 13px 0;
        font-size: ${Theme.extraNormal};

        &.light-font {
          font-weight: 300;
        }
      }
      &.product-catalog-body {
        border-top: 1px solid ${Theme.gray11};
        padding: 13px 4px 13px 0;
        cursor: pointer;
        font-size: ${Theme.extraNormal};
        .product-catalog-image {
          input.check-box-product-list {
            display: none;
          }

          .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 4px;
            width: 20px;
            height: 20px;
            top: 20px;
            left: 10px;
          }

          input:checked ~ .checkmark {
            background-color: ${Theme.orange};
            color: white;
            border: none;
            top: 20px;
            left: 10px;
          }

          .checkmark:after {
            content: '';
            position: absolute;
            display: none;
          }

          input:checked ~ .checkmark:after {
            display: block;
          }

          .checkmark:after {
            left: 6px;
            top: 3px;
            width: 6px;
            height: 11px;
            border: solid ${Theme.white};
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
          }

          .product-image {
            width: 37px;
            height: 37px;
            margin-right: 10px;
            float: left;
            display: flex;
            align-items: center;
            flex-direction: row;
          }
          .product-image-large {
            display: none;
          }
          &:hover {
            .product-image-large {
              display: block;
              background-color: ${Theme.gray8};
              border: 4px solid ${Theme.white};
              position: absolute;
              z-index: 2;
              border-radius: 8px;
              width: 180px;
              height: 180px;
              left: 20px;
            }
          }
        }
        .product-data {
          float: left;
          width: inherit;
          .product-name {
            color: ${Theme.black};
            font-size: ${Theme.normal};
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 270px;
          }
          .product-id {
            color: ${Theme.gray90};
            font-weight: 500;
          }
          @media only screen and (min-width: 991px) and (max-width: 1362px) {
            max-width: 150px;
          }
        }
        .status {
          background-color: #e3f2d2;
          border-radius: 5px;
          max-width: 99px;
          text-align: right;
          padding: 5px 12px;
          color: ${Theme.black};
          position: relative;

          &.unoptimized {
            background-color: ${Theme.gray8};
            max-width: 113px;
          }
          &.scheduled {
            background-color: ${Theme.extraLightYellow};
            max-width: 99px;
          }
          &.assets-received {
            background-color: #d6eef2;
            max-width: 132px;
          }
          &.assets-requested {
            background-color: ${Theme.lightOrange};
            max-width: 132px;
          }
          .bullet-point {
            background-color: ${Theme.lighterGreen};
            border-radius: 100%;
            width: 8px;
            height: 8px;
            position: absolute;
            top: 9px;
            left: 11px;

            &.unoptimized {
              background-color: ${Theme.gray25};
            }
            &.scheduled {
              background-color: ${Theme.yellow};
            }
            &.assets-received {
              background-color: #30a8bd;
            }
            &.assets-requested {
              background-color: ${Theme.orange};
            }
          }
          .status-text {
            color: ${Theme.black};
            margin-left: 3px;
          }
          @media only screen and (min-width: 991px) and (max-width: 1362px) {
            padding: 5px;

            .bullet-point {
              left: 5px;
            }
          }
          @media only screen and (max-width: 767px) {
            display: flow-root;
          }
        }
        .request {
          color: ${Theme.gray85};
          font-weight: 300;

          .request-plan {
            vertical-align: bottom;
            margin-right: 2px;
          }
        }
      }
      .company-info-details {
        float: left;
        max-width: 68%;
        word-break: keep-all;
      }
      .customer-details {
        max-width: 58%;
      }

      .company-logo {
        border-radius: 10px;
        width: 45px;
        height: 45px;
        margin-right: 14px;
        float: left;
      }

      .company-name {
        min-height: 20px;
        text-transform: capitalize;
        word-break: break-all;
      }

      .status {
        color: ${Theme.gray85};
        font-size: ${Theme.extraNormal};
        font-weight: 300;
        word-break: break-all;
        text-transform: capitalize;
      }

      .user-profile-circle {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-right: 14px;
        float: left;
      }

      .user-name {
        font-weight: 300;
        font-size: ${Theme.extraNormal};
        text-transform: capitalize;
        margin-top: 0;
      }

      .user-email {
        font-size: ${Theme.normal};
        font-weight: 300;
      }

      .increase-rate {
        color: ${Theme.lighterGreen};
        font-size: ${Theme.extraNormal};
        font-weight: 300;
        margin-left: -2px;

        &.large {
          font-size: ${Theme.extraMedium};
          font-weight: 600;
        }

        .green-arrow {
          width: 14px;
          vertical-align: bottom;
          /* transform: rotate(180deg); */
          vertical-align: middle;
          margin-left: -2px;
          margin-right: 3px;
          margin-top: -4px;
        }

        .red-arrow {
          width: 14px;
          transform: rotate(180deg);
          vertical-align: middle;
          margin-left: -2px;
          margin-right: 3px;
          margin-top: -4px;
        }
        &.grey {
          color: ${Theme.gray40};
        }
      }

      .decrease-rate {
        color: ${Theme.red};
        font-size: ${Theme.extraNormal};
        font-weight: 300;
        .red-arrow {
          width: 14px;
          transform: rotate(180deg);
          vertical-align: middle;
          margin-left: -2px;
          margin-right: 3px;
        }
        .green-arrow {
          width: 14px;
          vertical-align: bottom;
          /* transform: rotate(180deg); */
          vertical-align: middle;
          margin-left: -2px;
          margin-right: 3px;
        }
        &.grey {
          color: ${Theme.gray40};
        }
        &.large {
          font-size: ${Theme.extraMedium};
          font-weight: 600;
        }
      }

      .recurring-contact {
        padding: 0;
        margin: 0;
        list-style-type: none;
        width: max-content;

        li {
          display: inline-block;
          margin-right: 7px;
          font-weight: 300;
          margin-bottom: 6px;

          &.black-heading-title {
            min-height: 0 !important;
          }

          .recurring-service {
            border: 1px solid ${Theme.gray45};
            border-radius: 5px;
            border: none;
            padding: 10px 4px 10px 12px;
            color: #171725;
            font-size: 14px;
            width: max-content;

            &.agreement {
              border: 1px solid ${Theme.gray45};
              padding: 9px 12px;
              background-color: ${Theme.white};
            }

            &.edit {
              background: ${Theme.lightPink};
            }

            &.count-days {
              background: ${Theme.lighterOrange};
            }

            &.file-check {
              background: ${Theme.extraLightYellow};
            }

            &.file {
              background: ${Theme.gray8};
            }

            .active-contract-icon {
              padding: 8px 10px;
              border-radius: 3px;
              margin-left: 10px;
              float: right;
              margin-top: -9px;
              font-size: 14px;

              &.edit-file-icon {
                background: ${Theme.pink};

                img {
                  vertical-align: middle;
                  width: 16px;
                }
              }
              &.count-clock-icon {
                background: ${Theme.extraLighOrange};
                margin-left: 10px;

                img {
                  vertical-align: text-top;
                  width: 14px;
                  margin-right: 3px;
                }
              }
              &.file-check-icon {
                background: ${Theme.lightYellow};
                img {
                  vertical-align: text-top;
                  width: 13px;
                }
              }
              &.file-icon {
                background: ${Theme.gray12};

                img {
                  vertical-align: text-top;
                  width: 14px;
                }
              }
            }
          }
          &.no-active-contract {
            color: ${Theme.gray40};
            font-size: ${Theme.extraNormal};
            text-transform: initial;
          }
        }
      }

      .brand-partner {
        list-style-type: none;
        padding: 0;
        margin: 0;
        li {
          display: inline-block;
          margin-right: 3px;

          .brand-logo {
            width: 33px;
            height: 33px;
            border-radius: 50%;
          }
        }
      }
    }
  }
  @media only screen and (min-width: 1920px) {
    tr {
      td {
        .company-info-details {
          float: left;
          word-break: keep-all;
          max-width: 75%;
        }
      }
    }
  }
  @media only screen and (max-width: 1050px) {
    tr {
      td {
        .company-info-details {
          float: left;
          max-width: 65%;
          word-break: keep-all;
        }
        .customer-details {
          max-width: 55%;
        }
      }
    }
  }
  &.product-catalog-laptop {
    @media only screen and (max-width: 767px) {
      display: none;
    }
  }
  &.product-catalog-mobile {
    display: none;
    @media only screen and (min-width: 767px) {
      display: none;
    }
  }

  @media only screen and (min-width: 1700px) and (max-width: 1920px) {
    tbody {
      tr {
        &.table-header {
          th {
            font-size: 17px;
          }
        }

        td {
          font-size: ${Theme.normalRes};

          .sub-address {
            font-size: ${Theme.smallRes};
          }
          .company-name {
            font-size: ${Theme.medium};
          }
        }
      }
    }
  }

  @media only screen and (min-width: 991px) and (max-width: 1362px) {
    tbody {
      tr {
        td {
          &.product-catalog-body {
            .product-data {
              max-width: 150px;
            }
          }
        }
      }
    }
  }
`;
export default Table;
