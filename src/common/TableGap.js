import styled from 'styled-components';
import Theme from '../theme/Theme';

const TableGap = styled.div`
  position: relative;
  width: 100%;
  border-spacing: 0 10px;
  border-collapse: collapse;

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
    th {
      padding: 15px 5px 15px 5px;
      text-transform: uppercase;
      color: ${Theme.gray40};
      font-size: 11px;
      background: ${Theme.white};
      font-family: ${Theme.baseFontFamily};
      border-top: 1px solid #e0e6e8;
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
        font-weight: 600;
      }
    }
  }
`;

export default TableGap;
