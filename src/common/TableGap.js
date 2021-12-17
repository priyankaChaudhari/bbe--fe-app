import styled from 'styled-components';

import Theme from '../theme/Theme';

const TableGap = styled.div`
  position: relative;
  width: 100%;
  border-spacing: 0 10px;
  border-collapse: collapse;
  table {
    height: 100%;
    width: 100%;
    tr {
      text-align: left;
      background: ${Theme.white};
      border-radius: 1px;
      font-family: ${Theme.baseFontFamily};
      width: 100%;
      border-bottom: 1px solid #e0e6e8;
      display: table;
      width: 100%;
      &:last-child {
        border-bottom: none;
      }

      &.ungroup {
        &:last-child {
          border-bottom: 1px solid #e0e6e8;
        }
      }

      &.overlay-modal-header {
        border-bottom: 1px solid #e0e6e8;
        border-top: 1px solid #e0e6e8;

        th {
          border-top: none;
        }
      }

      &.BGSCommission-header {
        border-top: 1px solid #e0e6e8;
      }

      &.partners {
        td {
          font-size: 14px;
        }
        &:nth-last-child(2) {
          border-bottom: none;
        }
      }

      &.all-partners {
        font-weight: 600;
        background-color: #f4f6fc;

        td {
          font-size: 14px;
        }
      }

      th {
        padding: 15px 5px 15px 5px;
        text-transform: uppercase;
        color: ${Theme.gray40};
        font-size: 11px;
        background: ${Theme.white};
        font-family: ${Theme.baseFontFamily};
        /* border-top: 1px solid #e0e6e8; */
        &:first-child {
          border-bottom-left-radius: 8px;
        }
        &:last-child {
          border-bottom-right-radius: 8px;
        }
      }
      td {
        padding: 15px 5px 15px 5px;
        vertical-align: middle;
        position: relative;
        color: ${Theme.black};
        font-size: ${Theme.extraMedium};

        &.text-bold {
          font-family: ${Theme.titleFontFamily};
        }
        &.text-medium {
          font-family: ${Theme.baseMediumFontFamily};
        }
      }
    }
  }

  .commission-section {
    overflow: auto;
    height: calc(100vh - 80vh);
    margin-top: 20px;
    padding-bottom: 50px;
    @media only screen and (min-width: 1920px) {
      height: calc(100vh - 40vh);
    }
  }
`;

export default TableGap;
