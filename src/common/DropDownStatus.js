import styled from 'styled-components';
import Theme from '../theme/Theme';

const DropDownStatus = styled.div`
  width: 100%;
  min-width: 70px;
  max-width: 88px;
  display: inline-flex;
  vertical-align: top;
  margin-left: 20px;
  margin-top: 7px;

  .css-2b097c-container {
    width: 100%;
    color: ${Theme.gray6};
    font-size: ${Theme.extraNormal};

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

      &:hover {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
      }
    }

    // .css-yk16xz-control {
    //   // background-color: #74b035;
    //   border: 1px solid ${Theme.gray9};
    //   border-radius: 18px;
    //   color: ${Theme.gray6};
    //   font-size: ${Theme.extraNormal};
    //   min-height: 24px;
    //   padding-left: 3px;

    //   .css-g1d714-ValueContainer {
    //     color: ${Theme.gray6};
    //     padding: 2px !important;

    //     .css-1uccc91-singleValue {
    //       color: ${Theme.gray6};
    //     }
    //     .css-1wa3eu0-placeholder {
    //       color: ${Theme.gray6};
    //     }
    //     .react-select__placeholder {
    //       color: ${Theme.gray6};
    //     }
    //   }
    //   .css-1wa3eu0-placeholder {
    //     color: ${Theme.gray6};
    //     padding: 2px;
    //   }
    //   .react-select__placeholder {
    //     color: ${Theme.gray6};
    //   }

    //   .css-tlfecz-indicatorContainer {
    //     padding: 1px 3px 1px 1px;
    //     .css-6q0nyr-Svg {
    //       color: ${Theme.gray6};
    //     }
    //   }
    // }

    // .css-1pahdxg-control {
    //   border: 1px solid ${Theme.gray9};
    //   border-radius: 18px;
    //   font-size: ${Theme.extraNormal};
    //   color: ${Theme.gray6};
    //   background-color: #74b035;
    //   box-shadow: none;
    //   outline: none;
    //   min-height: 24px;
    //   padding-left: 3px;

    //   .css-b8ldur-Input {
    //     color: ${Theme.gray6};
    //   }

    //   .css-1gtu0rj-indicatorContainer {
    //     padding: 1px 3px 1px 1px;
    //     .css-6q0nyr-Svg {
    //       color: ${Theme.gray6};
    //     }
    //   }

    //   .css-1wa3eu0-placeholder {
    //     color: ${Theme.gray6};
    //     padding: 2px;
    //   }

    //   .css-1uccc91-singleValue {
    //     font-size: ${Theme.extraNormal};
    //     padding: 1px;
    //     color: ${Theme.gray6};
    //   }
    // }
    //status

    // .css-drqaxh-control {
    //   min-height: 24px;
    //   outline: none !important;
    //   box-shadow: none !important;
    //   .css-tlfecz-indicatorContainer {
    //     padding: 4px 9px;
    //   }
    //   .css-1gtu0rj-indicatorContainer {
    //     padding: 4px 9px;
    //   }

    //   .react-select__control {
    //     .css-tlfecz-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //     .css-1gtu0rj-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-ot49ho-control {
    //     min-height: 24px;
    //     outline: none !important;
    //     box-shadow: none !important;
    //     .css-1gtu0rj-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-1r86rx8-control {
    //     min-height: 24px;
    //     border-color: #74b035 !important;
    //     outline: none !important;
    //     box-shadow: none !important;
    //     &:focus {
    //       outline: none !important;
    //       box-shadow: none !important;
    //     }
    //     &:hover {
    //       border-color: #74b035 !important;
    //     }
    //     .css-tlfecz-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }
    //   .css-1bpwi30-control {
    //     min-height: 24px;
    //     border-color: #74b035 !important;
    //     outline: none !important;
    //     box-shadow: none !important;
    //     &:focus {
    //       outline: none !important;
    //       box-shadow: none !important;
    //     }

    //     &:hover {
    //       border-color: #74b035 !important;
    //     }
    //     .css-1gtu0rj-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }
    //   .css-1x9p5ib-control {
    //     .css-tlfecz-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-930bk5-contol {
    //     .css-1gtu0rj-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-i6eqaa-control {
    //     .css-tlfecz-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-map9ww-control {
    //     .css-1gtu0rj-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-xtxcfx-control {
    //     .css-tlfecz-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-fpdovf-control {
    //     .css-1gtu0rj-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }
    //   .css-1x9p5ib-control {
    //     .css-tlfecz-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-930bk5-contol {
    //     .css-1gtu0rj-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }

    //   .css-16b1flp-control {
    //     outline: none !important;
    //     box-shadow: none !important;
    //     .css-tlfecz-indicatorContainer {
    //       padding: 4px 9px;
    //     }
    //   }
    // }

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
