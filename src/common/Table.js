import styled from 'styled-components';
import Theme from '../theme/Theme';

const Table = styled.table`
  width: 100%;
  overflow-x: auto;
  border-collapse: separate;
  border-spacing: 0px 8px;

  tbody {
    width: 100%;
    overflow-x: auto;
    tr {
      margin-bottom: 7px;
      text-align: left;
      background: ${Theme.white};
      border: 1px solid rgba(46, 91, 255, 0.08);
      border-radius: 1px;
      width: 100%;

      &.table-header {
        box-shadow: none;
        background: #fafafb;
        border: none;
        width: 100%;

        th {
          font-family: ${Theme.titleFontFamily};
          color: ${Theme.gray90};
          padding: 15px 10px;
          text-transform: uppercase;
          font-size: 14px;

          &.firstChildCss:first-child {
            padding-left: 45px;
          }
        }
      }

      td {
        padding: 15px 10px;
        font-size: ${Theme.normal};
        vertical-align: middle;
        position: relative;
        color: ${Theme.gray90};

        &.firstChildCss:first-child {
          padding-left: 45px;
        }

        .sub-address {
          font-size: ${Theme.small};
          color: ${Theme.gray35};
        }
        .company-name {
          font-size: ${Theme.medium};
          margin-top: 7px;
        }

        .user-picture {
          width: 40px;
          border-radius: 50%;
          float: left;
          height: 40px;
        }

        .user-pic {
          vertical-align: middle;
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
