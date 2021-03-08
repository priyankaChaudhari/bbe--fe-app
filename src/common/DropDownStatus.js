import styled from 'styled-components';
import Theme from '../theme/Theme';

const DropDownStatus = styled.div`
  width: 100%;
  max-width: 88px;
  min-width: 70px;
  display: inline-flex;
  vertical-align: top;
  margin-left: 20px;
  margin-top: 4px;

  .css-2b097c-container {
    width: 100%;
    color: ${Theme.gray6};
    font-size: ${Theme.extraNormal};

    .css-yk16xz-control {
      // background-color: #74b035;
      border: 1px solid ${Theme.gray9};
      border-radius: 18px;
      color: ${Theme.gray6};
      font-size: ${Theme.extraNormal};
      min-height: 24px;
      padding-left: 3px;

      .css-g1d714-ValueContainer {
        color: ${Theme.gray6};
        padding: 2px !important;

        .css-1uccc91-singleValue {
          color: ${Theme.gray6};
        }
        .css-1wa3eu0-placeholder {
          color: ${Theme.gray6};
        }
        .react-select__placeholder {
          color: ${Theme.gray6};
        }
      }
      .css-1wa3eu0-placeholder {
        color: ${Theme.gray6};
        padding: 2px;
      }
      .react-select__placeholder {
        color: ${Theme.gray6};
      }

      .css-tlfecz-indicatorContainer {
        padding: 1px 3px 1px 1px;
        .css-6q0nyr-Svg {
          color: ${Theme.gray6};
        }
      }
    }

    .css-1pahdxg-control {
      border: 1px solid ${Theme.gray9};
      border-radius: 18px;
      font-size: ${Theme.extraNormal};
      color: ${Theme.gray6};
      background-color: #74b035;
      box-shadow: none;
      outline: none;
      min-height: 24px;
      padding-left: 3px;

      .css-b8ldur-Input {
        color: ${Theme.gray6};
      }

      .css-1gtu0rj-indicatorContainer {
        padding: 1px 3px 1px 1px;
        .css-6q0nyr-Svg {
          color: ${Theme.gray6};
        }
      }

      .css-1wa3eu0-placeholder {
        color: ${Theme.gray6};
        padding: 2px;
      }

      .css-1uccc91-singleValue {
        font-size: ${Theme.extraNormal};
        padding: 1px;
        color: ${Theme.gray6};
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
