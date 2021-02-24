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

      th {
        font-family: ${Theme.baseFontFamily};
        color: ${Theme.gray40};
        text-transform: uppercase;
        font-size: 11px;
        border-bottom: 1px solid ${Theme.gray7};
        padding: 10px;

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
          margin-right: 10px;
          font-weight: 300;

          &.black-heading-title {
            min-height: 0 !important;
          }

          .days-block {
            background: ${Theme.lighterOrange};
            padding: 5px 10px;
            border-radius: 5px;
            color: ${Theme.orange};
            font-size: ${Theme.extraNormal};

            .clock-icon {
              width: 14px;
              margin-right: 5px;
              vertical-align: text-top;
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
