import styled from 'styled-components';
import Theme from '../theme/Theme';

const DropDownSelect = styled.div`
  width: 100%;

  &.w-30 {
    width: 160px;
    float: right;
  }

  &.w-40 {
    width: 170px;
    float: left;
  }

  &.days-performance {
    max-width: 259px;
    float: right;
  }

  &.w-250 {
    width: 259px;

    .css-1rhbuit-multiValue {
      background-color: ${Theme.white};
      border: 1px solid ${Theme.gray35};
      border-radius: 20px;
      max-width: 185px;
      color: black;
    }

    .css-2b097c-container {
      background-color: ${Theme.gray15};

      .css-yk16xz-control {
        padding: 0 !important;
        min-height: 40px;

        .css-1hwfws3 {
          padding: 0px !important;
        }

        .css-g1d714-ValueContainer {
          padding: 0;
        }

        .css-1wa3eu0-placeholder {
          padding: 0px 0px 1px 10px;
        }
        .css-tlfecz-indicatorContainer {
          padding: 2px 7px 2px 0px;
        }

        .react-select-4-input {
          color: black !important;
        }
      }

      .css-1pahdxg-control {
        min-height: 40px;
        background-color: ${Theme.gray15};
        .css-g1d714-ValueContainer {
          padding: 0;
        }
        .css-1wa3eu0-placeholder {
          padding: 0px 0px 1px 10px;
        }
        .css-1gtu0rj-indicatorContainer {
          padding: 2px 10px 2px 2px;
        }

        &.css-tlfecz-indicatorContainer {
          padding-left: 0;
        }
        .css-1hwfws3 {
          padding: 0px !important;
        }

        .css-b8ldur-Input,
        .css-1g6gooi {
          color: ${Theme.black};
          font-size: 15px;
          padding-left: 8px;
        }

        &:focus {
          padding: 0;
        }
        .react-select__control--is--focused {
          padding: 0 !important;
        }

        &.react-select__control--is--focused {
          padding: 0 !important;
        }
        &.react-select__control--menu-is-open {
          padding: 0 !important;

          .css-1hwfws3 {
            padding: 0 !important;
          }
          &.css-1hwfws3 {
            padding: 0 !important;
          }
        }
        &.react-select__control {
          padding: 0 !important;
        }
      }

      .react-select__menu {
        background-color: ${Theme.white};
        border-radius: 8px;
        box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.4);
      }
    }
    .css-12jo7m5 {
      color: ${Theme.black};
      font-size: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 5px 3px 3px 3px;
      white-space: nowrap;
      box-sizing: border-box;

      span {
        line-height: 0 !important;
        vertical-align: middle;
        color: ${Theme.black};
        font-size: 15px;
      }
    }
    .css-xb97g8 {
      padding-right: 8px;
      &:hover {
        background: none;
        cursor: pointer;
      }
    }
  }

  .css-2b097c-container {
    width: 100%;
    color: ${Theme.black} !important;
    font-size: ${Theme.normal};

    .css-yk16xz-control {
      background-color: ${Theme.gray15};
      border: 1px solid ${Theme.gray9};
      border-radius: 18px;
      color: ${Theme.black};
      font-size: ${Theme.normal};
      padding: 1px 5px 1px 5px;
      min-height: 40px;

      .css-g1d714-ValueContainer {
        padding: 1px 20px 1px 5px;
        color: ${Theme.black} !important;

        .cross-icon {
          display: none;
        }
        .css-1wa3eu0-placeholder {
          color: ${Theme.black} !important;
        }
        .react-select__placeholder {
          color: ${Theme.black} !important;
        }
      }
      .css-1wa3eu0-placeholder {
        color: ${Theme.black} !important;
      }
      .react-select__placeholder {
        color: ${Theme.black} !important;
      }

      .css-tlfecz-indicatorContainer {
        padding: 5px;
        .css-6q0nyr-Svg {
          color: ${Theme.black} !important;
        }
      }
    }

    .css-1pahdxg-control {
      border: 1px solid ${Theme.gray9};
      border-radius: 18px;
      font-size: ${Theme.normal};
      color: ${Theme.black};
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
        color: ${Theme.black} !important;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
  }
`;

export default DropDownSelect;
