import styled from 'styled-components';
import Theme from '../theme/Theme';

const ActionDropDown = styled.div`
  .css-2b097c-container {
    width: 100%;
    color: ${Theme.gray85} !important;
    font-size: ${Theme.normal};

    .css-yk16xz-control {
      background-color: #f4f6fc;
      border: 1px solid #d5d8e1;
      border-radius: 2px;
      color: ${Theme.gray85};
      font-size: ${Theme.normal};
      padding: 1px 5px 1px 5px;
      min-height: 40px;

      .css-g1d714-ValueContainer {
        padding: 1px 20px 1px 5px;
        color: ${Theme.gray85} !important;

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
      background-color: #f4f6fc;
      border: 1px solid #d5d8e1;
      border-radius: 2px;
      font-size: ${Theme.normal};
      color: ${Theme.gray85};
      padding: 1px 5px 1px 5px;
      box-shadow: none;
      outline: none;
      min-height: 40px;

      .css-b8ldur-Input {
        color: ${Theme.white};
      }

      .cross-icon {
        width: 14px;
        position: absolute;
        top: 10px;
        right: 10px;
      }

      .remove-icon {
        display: none;
      }
      .css-1gtu0rj-indicatorContainer {
        padding: 5px;
      }

      .css-1wa3eu0-placeholder {
        color: #000000;
      }

      .css-1uccc91-singleValue {
        font-size: ${Theme.normal};
        padding: 4px;
        color: ${Theme.gray85} !important;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
  }
`;

export default ActionDropDown;
