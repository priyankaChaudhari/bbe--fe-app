import styled from 'styled-components';
import Theme from '../theme/Theme';

const CardMetrics = styled.div`
  .order-chart-box {
    display: inline-block;
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray45};
    border-radius: 8px;
    max-width: 197px;
    width: 100%;
    padding: 18px 15px;
    cursor: pointer;

    .chart-name {
      color: ${Theme.gray40};
      font-size: 11px;
      text-transform: uppercase;
      font-family: ${Theme.titleFontFamily};
      padding-bottom: 15px;
    }

    .perentage-value {
      color: ${Theme.lighterGreen};
      font-size: ${Theme.extraNormal};
      font-weight: 300;
      margin-left: -2px;

      &.down {
        color: ${Theme.red};
      }
      .red-arrow {
        width: 14px;
        transform: rotate(180deg);
        vertical-align: middle;
        margin-left: -2px;
        margin-right: 3px;
      }
      .green-arrow {
        width: 14px;
        vertical-align: bottom;
        // transform: rotate(180deg);
        vertical-align: middle;
        margin-left: -2px;
        margin-right: 3px;
      }

      img {
        width: 14px;
      }
    }

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      border: 1px solid ${Theme.orange};
    }

    &.active {
      border: 1px solid ${Theme.orange};
    }
    &.ad-sales-active {
      border: 1px solid #0045b4;
      .chart-name {
        color: #0045b4;
      }
    }

    &.ad-spend-active {
      border: 1px solid #8c54ff;
      .chart-name {
        color: #8c54ff;
      }
    }
    &.ad-conversion-active {
      border: 1px solid #30a8bd;
      .chart-name {
        color: #30a8bd;
      }
    }
    &.impression-active {
      border: 1px solid #d6a307;
      .chart-name {
        color: #d6a307;
      }
    }
    &.ad-cos-active {
      border: 1px solid #e05d37;
      .chart-name {
        color: #e05d37;
      }
    }
    &.ad-roas-active {
      border: 1px solid #89a43c;
      .chart-name {
        color: #89a43c;
      }
    }
    &.ad-roas-active {
      border: 1px solid #89a43c;
      .chart-name {
        color: #89a43c;
      }
    }

    &.ad-click-active {
      border: 1px solid #c84ec6;
      .chart-name {
        color: #c84ec6;
      }
    }
    &.ad-clickrate-active {
      border: 1px solid #a04848;
      .chart-name {
        color: #a04848;
      }
    }
  }
  //   @media only screen and (min-width: 1920px) {
  //     .order-chart-box {
  //       max-width: 100%;
  //     }
  //   }
  @media only screen and (min-width: 1600px) {
    .order-chart-box {
      max-width: 100%;
    }
  }
  @media only screen and (max-width: 767px) {
    .order-chart-box {
      max-width: 100% !important;
    }
  }
`;

export default CardMetrics;
