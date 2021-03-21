import styled from 'styled-components';
import Theme from '../theme/Theme';

const TeamDropDown = styled.div`
  width: 100%;

  label {
    color: ${Theme.gray90};
    font-size: 15px;
    font-family: ${Theme.titleFontFamily};
  }
  .css-yk16xz-control {
    color: ${Theme.gray90};
    border: none;
    background-color: ${Theme.white};
    max-width: 211px;
    width: 100%;
    margin: 0 auto;

    .css-g1d714-ValueContainer {
      color: ${Theme.gray90};
      font-size: 15px;

      font-family: ${Theme.titleFontFamily};
      max-width: 211px;

      .css-1wa3eu0-placeholder {
        color: ${Theme.gray90};
        font-size: 15px;
        font-family: ${Theme.titleFontFamily};
        text-transform: none;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }

    .css-tlfecz-indicatorContainer {
      color: ${Theme.gray90};
    }

    .css-1hb7xyz-indicatorContainer {
      color: ${Theme.gray90};
    }

    .css-1uccc91-singleValue {
      color: ${Theme.gray90};
      font-size: 15px;
      font-family: ${Theme.titleFontFamily};
    }

    &:hover {
      border: none;
      background-color: ${Theme.white};
    }
  }

  .css-1pahdxg-control {
    box-shadow: none;
    margin-top: 5px;
    width: 100%;
    margin: 0 auto;
    max-width: 211px;
    color: ${Theme.gray90};
    border: none;
    background-color: ${Theme.white};
    outline: none;

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
  }

  .css-26l3qy-menu {
    z-index: 99999 !important;
    right: 20%;
    width: 100%;
    border: 1px solid rgba(46, 91, 255, 0.08);
    box-shadow: ${Theme.commonShadow};

    .option {
      &:hover {
        color: ${Theme.orange};
        background: none !important;
        z-index: 9999;
      }
      &:active {
        color: ${Theme.orange};
        background: transparent !important;
        z-index: 9999;
      }
    }
  }

  .css-1uccc91-singleValue {
    color: ${Theme.gray90};
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  .css-1okebmr-indicatorSeparator {
    display: none;
  }

  .css-tlfecz-indicatorContainer {
    color: ${Theme.gray90};
  }

  .css-1qzoi4y-control {
    cursor: pointer;
    max-width: 100%;
  }
  .css-jddzik-control {
    max-width: 100%;

    .filter-cross {
      position: absolute;
      top: 14px;
      right: 42px;
      width: 12px;
    }
  }
  .css-26l3qy-menu {
    z-index: 99999 !important;
    right: 20%;
    width: 320px;
    border: 1px solid rgba(46, 91, 255, 0.08);
    box-shadow: ${Theme.commonShadow};
  }
`;

export default TeamDropDown;
