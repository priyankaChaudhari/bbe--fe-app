import styled from 'styled-components';
import Theme from '../theme/Theme';

const TransparentSelect = styled.div`
  width: 100%;

  &.w-30 {
    width: 160px;
    float: right;
  }

  &.w-40 {
    width: 170px;
    float: left;
  }

  .css-2b097c-container {
    width: 100%;

    .css-yk16xz-control {
      border: 1px solid ${Theme.gray25};
      border-radius: 1px;
      font-family: ${Theme.titleFontFamily};
      color: ${Theme.gray90};
      font-size: ${Theme.textFontSize};
      padding: 0 5px 0 5px;
      cursor: pointer;

      .css-g1d714-ValueContainer {
        padding: 0 20px 0 5px;
      }

      .css-1wa3eu0-placeholder {
        font-size: ${Theme.textFontSize};
        color: ${Theme.gray90};
        width: 100%;
        text-align: left;
      }
    }

    .css-tlfecz-indicatorContainer {
      color: ${Theme.gray90}!important;
    }

    .css-1pahdxg-control {
      border: 1px solid ${Theme.gray25};
      border-radius: 1px;
      color: ${Theme.gray90};
      font-family: ${Theme.titleFontFamily};
      font-size: ${Theme.textFontSize};
      padding: 0 5px 0 5px;
      box-shadow: none;
      outline: none;
      cursor: pointer;

      .css-b8ldur-Input {
        color: ${Theme.gray90};
      }

      .css-1wa3eu0-placeholder {
        color: ${Theme.gray90};
      }

      .css-g1d714-ValueContainer {
        padding: 0 20px 0 5px;
      }

      .css-1hb7zxy-IndicatorsContainer {
        // background: ${Theme.gray90};
        color: ${Theme.gray90} !important;

        .css-1gtu0rj-indicatorContainer {
          color: ${Theme.gray90} !important;

          .css-6q0nyr-Svg {
            color: ${Theme.gray90} !important;
          }

          &:hover {
            color: ${Theme.gray90};
          }
        }
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

  .css-b9nxok-control {
    .css-1wa3eu0-placeholder {
      color: white;
    }
  }

  .css-1g9qasx-control {
    border: 1px solid ${Theme.gray9};
    outline: none;
    box-shadow: none;
    &:hover {
      border: 1px solid ${Theme.gray9};
    }
  }

  .css-26l3qy-menu {
    box-shadow: ${Theme.commonShadow};
    // width: 226px;
    color: ${Theme.gray90};
    z-index: 9999999;
    border: 1px solid ${Theme.gray5};
    text-align: left;

    .drop-down-user {
      vertical-align: middle;
    }
  }

  &.mobile-view {
    margin-left: 70px;
  }

  @media only screen and (max-width: 767px) {
    &.mobile-view {
      width: 200px;
      margin-bottom: 20px;
      margin-left: 0px;
    }
  }
`;

export default TransparentSelect;
