import styled from 'styled-components';
import Theme from '../theme/Theme';

const ActionDropDown = styled.div`
  &.w-150 {
    width: 150px;
  }
  &.w-170 {
    max-width: 170px;
  }
  .css-2b097c-container {
    width: 100%;
    color: ${Theme.gray85} !important;
    font-size: ${Theme.normal};
    font-weight: 500;
    font-family: ${Theme.baseFontFamily};
    text-align: initial;

    .css-yk16xz-control {
      border: 1px solid #d5d8e1;
      border-radius: 2px;
      color: ${Theme.gray85};
      font-size: ${Theme.normal};
      font-weight: 500;
      padding: 1px 5px 1px 5px;
      min-height: 40px;
      cursor: pointer;

      .css-g1d714-ValueContainer {
        padding: 2px 4px;
        font-weight: 500px;
        cursor: pointer;

        .cross-icon {
          display: none;
        }
        .css-1wa3eu0-placeholder {
          color: ${Theme.gray85} !important;
        }
        .react-select__placeholder {
          color: ${Theme.gray85} !important;
        }
      }
      .css-1wa3eu0-placeholder {
        color: ${Theme.gray85} !important;
      }
      .react-select__placeholder {
        color: ${Theme.gray85} !important;
      }

      .css-tlfecz-indicatorContainer {
        padding: 5px;
        .css-6q0nyr-Svg {
          color: ${Theme.gray85} !important;
        }
      }
    }

    .css-1pahdxg-control {
      border: 1px solid #d5d8e1;
      border-radius: 2px;
      font-size: ${Theme.normal};
      color: ${Theme.gray85};
      padding: 1px 5px 1px 5px;
      box-shadow: none;
      outline: none;
      min-height: 40px;
      cursor: pointer;
      caret-color: transparent;

      .css-b8ldur-Input {
        color: ${Theme.black};
        margin: 0;
      }
      .css-g1d714-ValueContainer {
        padding: 2px 4px;
      }
      .remove-icon {
        display: none;
      }
      .css-1gtu0rj-indicatorContainer {
        padding: 5px;
      }

      .css-1wa3eu0-placeholder {
        color: ${Theme.black};
      }

      .css-1uccc91-singleValue {
        font-size: ${Theme.normal};
        color: ${Theme.gray85} !important;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
    .css-26l3qy-menu {
      border: none !important;
      outline: none !important;
      box-shawdow: 0 5px 15px 0 rgba(68, 68, 79, 0.4);
      .react-select__option {
        padding: 15px 0 15px 10px;
        float: left;
        max-width: 99%;
        word-break: keep-all;
      }
    }
    @media only screen and (min-width: 767px) and (max-width: 1600px) {
      .css-26l3qy-menu {
        width: 180px;
      }
    }
  }
`;

export default ActionDropDown;
