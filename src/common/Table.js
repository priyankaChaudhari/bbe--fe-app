import styled from 'styled-components';
import Theme from '../theme/Theme';

const Table = styled.table`
  position: relative;
  width: 100%;

  tr {
    text-align: left;
    background: ${Theme.white};
    border: 1px solid rgba(46, 91, 255, 0.08);
    border-radius: 1px;
    font-family: ${Theme.baseFontFamily};
    width: 100%;

    &.table-header {
      box-shadow: none;
      // display: table;
      // position: fixed;
      // width: 75%;

      th {
        font-family: ${Theme.baseFontFamily};
        color: ${Theme.gray40};
        text-transform: uppercase;
        font-size: 11px;
        border-bottom: 1px solid ${Theme.gray7};
        padding: 13px;

        &.customer-header {
          padding-left: 66px;
        }
      }
    }

    td {
      padding: 20px 10px 3px 10px;
      font-size: ${Theme.normal};
      vertical-align: middle;
      position: relative;
      color: ${Theme.black};
      font-size: ${Theme.normal};
      font-weight: 600;
      vertical-align: top;

      .company-logo {
        border-radius: 10px;
        width: 45px;
        height: 45px;
        margin-right: 14px;
        float: left;
      }
      .company-name {
        min-height: 20px;
      }

      .status {
        color: ${Theme.gray85};
        font-size: ${Theme.extraNormal};
        font-weight: 300;
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
        margin-top: 7px;
      }
      .increase-rate {
        color: ${Theme.lighterGreen};
        font-size: ${Theme.extraNormal};
        font-weight: 300;
        img {
          vertical-align: bottom;
        }
      }
      .decrease-rate {
        color: ${Theme.darkRed};
        font-size: ${Theme.extraNormal};
        font-weight: 300;
        .red-arrow {
          width: 14px;
          transform: rotate(180deg);
          vertical-align: middle;
        }
      }

      .recurring-contact {
        padding: 0;
        margin: 0;
        list-style-type: none;

        li {
          display: inline-block;
          margin-right: 7px;
          font-weight: 300;
          margin-bottom: 6px;

          &.black-heading-title {
            min-height: 0 !important;
          }

          // .days-block {
          //   background: ${Theme.lighterOrange};
          //   padding: 5px 10px;
          //   border-radius: 5px;
          //   color: ${Theme.orange};
          //   font-size: ${Theme.extraNormal};

          //   .clock-icon {
          //     width: 14px;
          //     margin-right: 5px;
          //     vertical-align: text-top;
          //   }
          // }
          .recurring-service {
            border: 1px solid #d5d8e1;
            border-radius: 5px;
            border: none;
            padding: 10px 4px 10px 12px;
            color: #171725;
            font-size: 14px;

            &.agreement {
              border: 1px solid #d5d8e1;
              padding: 9px 12px;
              background-color: ${Theme.white};
            }

            &.edit {
              background: #ffded6;
            }

            &.count-days {
              background: #fff4ec;
            }

            &.file-check {
              background: #fdf3d7;
            }

            &.file {
              background: #f4f6fc;
            }

            .active-contract-icon {
              padding: 8px 10px;
              border-radius: 3px;
              margin-left: 10px;
              font-size: 14px;

              &.edit-file-icon {
                background: #f6d2c9;

                img {
                  vertical-align: middle;
                  width: 16px;
                }
              }
              &.count-clock-icon {
                background: #ffe6d4;
                margin-left: 10px;

                img {
                  vertical-align: text-top;
                  width: 14px;
                }
              }
              &.file-check-icon {
                background: #f5e8c3;
                img {
                  vertical-align: text-top;
                  width: 13px;
                }
              }
              &.file-icon {
                background: #e2e5ef;

                img {
                  vertical-align: text-top;
                  width: 14px;
                }
              }
            }
          }
        }
      }
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
`;
export default Table;
