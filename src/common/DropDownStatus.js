import styled from 'styled-components';
import Theme from '../theme/Theme';

const DropDownStatus = styled.div`
  display: inline-flex;
  vertical-align: top;
  margin-top: 7px;

  .css-2b097c-container {
    width: 100%;
    color: ${Theme.gray6};
    font-size: ${Theme.extraNormal};
    cursor: pointer;

    .react-select__control {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
      .css-tlfecz-indicatorContainer {
        padding: 2px 8px;
      }
      .css-1gtu0rj-indicatorContainer {
        padding: 4px 8px;
      }
      .css-1wa3eu0-placeholder  {
        color: ${Theme.gray6};
      }
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
    .react-select__menu {
      width: 300px !important;
      width: 100%;
      .css-26l3qy-menu {
        max-width: 300px !important;
        width: 100%;
      }
    }
  }
`;

export default DropDownStatus;
