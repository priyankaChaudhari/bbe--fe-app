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

  &.w-250 {
    width: 250px;
  }

  .css-2b097c-container {
    width: 100%;
    color: ${Theme.gray90} !important;
    font-size: ${Theme.textFontSize};

    .css-yk16xz-control {
      background-color: ${Theme.gray15};
      border: 1px solid ${Theme.gray9};
      border-radius: 18px;
      color: ${Theme.black};
      font-size: ${Theme.textFontSize};
      padding: 1px 5px 1px 5px;

      .css-g1d714-ValueContainer {
        padding: 1px 20px 1px 5px;
        color: ${Theme.black} !important;

        .cross-icon {
          display: none;
        }
        .css-1wa3eu0-placeholder {
          color: ${Theme.black} !important;
        }

        .remove-icon {
          display: block;
          cursor: pointer;
        }
      }
      .css-tlfecz-indicatorContainer {
        .css-6q0nyr-Svg {
          color: ${Theme.black} !important;
        }
      }
    }

    .css-1pahdxg-control {
      border: 1px solid ${Theme.gray9};
      border-radius: 18px;
      font-size: ${Theme.textFontSize};
      color: ${Theme.black};
      padding: 1px 5px 1px 5px;
      box-shadow: none;
      outline: none;

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

      .css-1wa3eu0-placeholder {
        color: #000000;
      }

      // .css-g1d714-ValueContainer {
      //   padding: 1px 20px 1px 5px;

      //   .css-1wa3eu0-placeholder {
      //     font-size: ${Theme.textFontSize};
      //     color: ${Theme.black} !important;
      //     width: 100%;
      //     text-align: left;
      //   }
      // }

      // .css-1hb7zxy-IndicatorsContainer {
      //   // background: ${Theme.gray90};
      //   color: ${Theme.black};

      //   .css-1gtu0rj-indicatorContainer {
      //     padding: 4px;
      //     color: ${Theme.black} !important;
      //     // background: ${Theme.gray90}!important;

      //     .css-6q0nyr-Svg {
      //       color: ${Theme.black} !important;
      //     }

      //     &:hover {
      //       color: ${Theme.black};
      //     }
      //   }
      //   .css-tlfecz-indicatorContainer {
      //     color: ${Theme.black} !important;
      //   }
      // }

      .css-1uccc91-singleValue {
        font-size: ${Theme.textFontSize};
        padding: 4px;
        color: ${Theme.black};
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
  }
  .css-1081v0-control {
    border: none;
    outline: none;
    box-shadow: none;
    &:hover {
      border: none;
    }
  }

  // .css-gcokqo-indicatorContainer:hover {
  //   color: #ffff;
  // }
  // .css-b9nxok-control {
  //   .css-1wa3eu0-placeholder {
  //     color: white;
  //   }
  // }

  // .css-1g9qasx-control {
  //   border: 1px solid ${Theme.gray9};
  //   outline: none;
  //   box-shadow: none;
  //   &:hover {
  //     border: 1px solid ${Theme.gray9};
  //   }
  // }

  // .css-26l3qy-menu {
  //   box-shadow: ${Theme.commonShadow};

  //   //width: 226px;
  //   color: ${Theme.gray90};
  //   z-index: 9999999;
  //   text-align: left;

  //   .drop-down-user {
  //     vertical-align: middle;
  //   }
  // }

  // &.mobile-view {
  //   margin-left: 75px;
  // }

  // .css-44ry67-control {
  //   border: 1px solid ${Theme.gray9};
  //   outline: none;
  //   box-shadow: none;
  //   &:hover {
  //     border: 1px solid ${Theme.gray9};
  //   }
  // }

  // .css-1m4laux-control {
  //   border: 1px solid ${Theme.gray9};
  //   outline: none;
  //   box-shadow: none;
  //   &:hover {
  //     border: 1px solid ${Theme.gray9};
  //   }
  // }

  // @media only screen and (max-width: 768px) {
  //   &.mobile-view {
  //     width: 200px;
  //     margin-bottom: 20px;
  //     margin-left: 0px;
  //   }
  // }
`;

export default DropDownSelect;
