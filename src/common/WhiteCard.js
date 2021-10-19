import styled from 'styled-components';
import Theme from '../theme/Theme';

export const WhiteCard = styled.div`
  background-color: ${Theme.white};
  border-radius: 15px;
  padding: 20px;
  position: relative;

  &.selected-card {
    border: 0.1rem dotted #bfc5d2;
  }

  .green {
    color: ${Theme.lighterGreen};
  }

  &.fix-height {
    flex-wrap: wrap;
    flex: initial;
    height: 100%;
  }

  .contract-status {
    float: left;
    max-width: 80%;
    width: 100%;
    word-break: keep-all;
    &.one-time-service {
      max-width: 75%;
    }
  }

  .company-contract-height {
    max-height: 145px;
    overflow: auto;
  }

  &.left-border {
    padding: 25px 25px 25px 0;
  }

  .orange-text {
    color: ${Theme.red};
    cursor: pointer;

    .right-arrow-icon {
      vertical-align: middle;
      margin-left: 4px;
      width: 15px;

      &.green {
        color: ${Theme.lighterGreen};
      }
    }
  }
  .monthly-dsp-budget {
    color: ${Theme.red};
    font-size: ${Theme.normal};
    font-weight: 600;

    .on-track {
      color: ${Theme.lighterGreen};
    }

    .currency-amount {
      color: ${Theme.black};
    }
    .right-arrow-icon {
      vertical-align: middle;

      &.green {
        color: ${Theme.lighterGreen};
      }
    }

    .dot {
      background-color: ${Theme.gray35};
      border-radius: 50%;
      width: 3px;
      height: 3px;
      position: absolute;
      top: 26px;
      margin-left: 2px;
    }
  }

  .copy-info {
    position: relative;
    .copy-text {
      display: none;
    }

    .label {
      color: ${Theme.gray40};
      text-transform: uppercase;
      line-height: 22px;
      font-family: ${Theme.titleFontFamily};
      font-size: 11px;
      margin-bottom: 3px;
    }
    .label-info {
      color: ${Theme.black};
      font-size: ${Theme.normal};
    }

    &:hover {
      cursor: pointer;
      .copy-text {
        display: block;
        position: absolute;
        right: 0px;
        font-size: ${Theme.extraNormal};
        color: ${Theme.gray85};
        cursor: pointer;
        top: 28px;
        img {
          width: 12px;
          margin-right: 4px;
          top: 10px;
        }
      }
    }
  }
  .label {
    color: ${Theme.gray40};
    text-transform: uppercase;
    line-height: 22px;
    font-family: ${Theme.titleFontFamily};
    font-size: ${Theme.verySmall};
    margin-bottom: 3px;
    .info-icon {
      vertical-align: middle;
      width: 14px;
      margin-left: 8px;
      cursor: pointer;
    }
  }
  .label-info {
    color: ${Theme.black};
    font-size: ${Theme.normal};

    .master-card-icon {
      width: 20px;
      margin-right: 2px;
      vertical-align: top;
    }
    .ACH-status {
      background-color: #f1f1f5;
      border-radius: 5px;
      padding: 4px 10px 3px 4px;
      font-size: ${Theme.extraNormal};
      color: ${Theme.gray85};
      margin-left: 5px;
      .checked-mark-icon {
        width: 13px;
        margin-right: 2px;
        vertical-align: text-top;
      }
      .bell-icon {
        width: 16px;
        margin-right: 2px;
        vertical-align: text-top;
      }
    }
    .unverified {
      background-color: ${Theme.lightPink};
    }
    .pending {
      background-color: ${Theme.extraLightYellow};
    }
  }

  .phone-number {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
    margin-top: 4px;
  }

  .dropdown-content-status {
    display: none;
    position: absolute;
    width: 220px;
    box-shadow: ${Theme.commonShadow};
    padding: 0px;
    z-index: 2;
    text-align: left;
    background: ${Theme.white};
    border: 1px solid ${Theme.gray9};
    border-radius: 8px;
    margin-top: 8px;
    left: 20px;

    li {
      list-style-type: none;
      padding-bottom: 10px;
      font-size: ${Theme.extraMedium};
      color: ${Theme.black};
      padding: 15px;
      cursor: pointer;
      width: 100%;
      text-align: left;

      &:hover {
        background: ${Theme.gray8};
      }
    }
  }
  .brand-logo-details {
    position: relative;
    text-align: center;
    margin-left: 25px;

    .brand-logo-image {
      border: 5px solid ${Theme.white};
      border-radius: 12px;
      margin-top: -50px;
      width: 98px;
      height: 98px;
    }
    .brand-name {
      color: ${Theme.black};
      font-size: 28px;
      // font-family: ${Theme.baseMediumFontFamily};
      font-weight: 500;
    }
    .company-status {
      background: ${Theme.darkGreen};
      border-radius: 19px;
      padding: 3px 10px;
      color: ${Theme.gray6};
      font-size: ${Theme.extraNormal};
      margin: 0 auto;
      top: 0;
      max-width: 137px;
      position: relative;

      &.inactive {
        background-color: ${Theme.gray60};
      }
      &.pending {
        background-color: ${Theme.yellow};
        color: ${Theme.black};
      }
      &.risk {
        background-color: #d63649;
      }

      img {
        vertical-align: middle;
        width: 17px;
        margin-left: 4px;
        width: 21px;
        margin-bottom: 2px;
      }
    }
    .company-label-info {
      font-size: ${Theme.normal};
      color: ${Theme.black};
      line-height: 22px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .edit-details {
    position: absolute;
    right: 23px;
    font-size: ${Theme.extraNormal};
    color: ${Theme.gray85};
    top: 22px;
    cursor: pointer;

    &.edit-brand-details {
      top: 20px;
    }
    img {
      width: 16px;
      margin-right: 4px;
      vertical-align: text-top;
    }
    @media only screen and (max-width: 1170px) {
      right: 8px;
      img {
        width: 14px;
        margin-right: 2px;
      }
    }
  }
  .increase-rate {
    color: ${Theme.lighterGreen};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
    .green-arrow {
      width: 14px;
      vertical-align: middle;
      margin-left: 3px;
      margin-right: 3px;
      vertical-align: bottom;
    }

    .red-arrow {
      width: 14px;
      transform: rotate(180deg);
      vertical-align: middle;
      margin-left: -2px;
      margin-right: 3px;
    }
    &.grey {
      color: ${Theme.gray40};
    }
  }
  .decrease-rate {
    color: ${Theme.red};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
    .red-arrow {
      width: 14px;
      transform: rotate(180deg);
      vertical-align: middle;
      margin-left: -2px;
      margin-right: 3px;
    }

    .green-arrow {
      width: 14px;
      vertical-align: middle;
      margin-left: -2px;
      margin-right: 3px;
      vertical-align: bottom;
    }
    &.grey {
      color: ${Theme.gray40};
    }
  }

  .left-details-card {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      margin-bottom: 23px;

      .left-details {
        color: ${Theme.black};
        padding: 0 0px 0px 25px;
        border-left: 3px solid ${Theme.white};
        img {
          width: 24px;
          margin-right: 15px;
          vertical-align: middle;

          &.file-contract {
            width: 28px;
          }
        }
        &:hover {
          border-left: 3px solid ${Theme.orange};
          cursor: pointer;
          font-family: ${Theme.titleFontFamily};
        }
        &.active {
          border-left: 3px solid ${Theme.orange};
          cursor: pointer;
          font-family: ${Theme.titleFontFamily};
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .view-all-list {
    font-size: ${Theme.extraNormal};
    color: ${Theme.gray85};
    cursor: pointer;

    img {
      width: 16px;
      margin-left: 2px;
      vertical-align: bottom;
    }
  }
  .add-note-section {
    font-size: ${Theme.extraNormal};
    color: ${Theme.gray85};
    text-align: center;

    .red-chat-icon {
      width: 16px;
      vertical-align: middle;
      margin-right: 2px;
    }
  }

  .recurring-contact {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: inline-block;

    li {
      display: inline-block;
      margin-right: 18px;
      position: relative;

      &:last-child {
        margin-right: 0;
      }
      .dot {
        background-color: #8798ad;
        border-radius: 50%;
        width: 3px;
        height: 3px;
        position: absolute;
        top: 7px;
        margin-left: -10px;
      }

      .days-block {
        background: ${Theme.lighterOrange};
        padding: 5px 10px;
        border-radius: 5px;
        color: ${Theme.orange};
        font-size: ${Theme.extraNormal};

        .clock-icon {
          width: 14px;
          margin-right: 5px;
          vertical-align: text-top;
        }
      }
    }
  }

  .DSP-contract-retainer {
    .label {
      color: ${Theme.gray40};
      text-transform: uppercase;
      line-height: 22px;
      font-family: ${Theme.titleFontFamily};
      font-size: ${Theme.verySmall};
      margin-bottom: 1px;
    }
    span {
      color: ${Theme.black};
      font-size: ${Theme.normal};
      font-weight: 600;
    }
  }

  .selected-list {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      background: ${Theme.gray8};
      color: ${Theme.gray85};
      padding: 5px 10px;
      border-radius: 5px;
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 7px;
    }
  }

  &.activity-card {
    min-height: 530px;
  }

  .number-rate {
    color: ${Theme.gray80};
    font-size: 26px;
    word-break: break-all;
    font-family: ${Theme.baseFontFamily};
  }
  .perentage-value {
    color: ${Theme.lighterGreen};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
    margin-left: -2px;

    &.down {
      color: ${Theme.red};
    }

    &.grey {
      color: ${Theme.gray40};
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
      vertical-align: middle;
      margin-left: -2px;
      margin-right: 3px;
    }

    img {
      width: 14px;
    }
  }

  .vs {
    color: ${Theme.gray40};
    font-size: ${Theme.extraMedium};
  }

  .dsp-spent-date {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      display: inline-block;
      margin-right: 20px;
    }
  }
  .rechart-item {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      margin-right: 25px;
      vertical-align: middle;

      &:last-child {
        margin-right: none;
      }

      .weeks {
        display: flex;
        align-items: center;
        flex-direction: row;
      }

      .dashed-line {
        list-style-type: none;
        padding: 0;
        margin: 0;

        li {
          display: inline-block;
          margin-right: 3px;
          width: 6px;
          height: 2px;
          margin-bottom: 3px;

          &:last-child {
            margin-right: 6px;
          }
        }
      }

      .circle {
        width: 14px;
        height: 2px;
        margin-right: 6px;
      }
      .orange {
        background: ${Theme.baseColor};
      }
      .adSales {
        background: #0045b4;
      }
      .adSpend {
        background: #8c54ff;
      }
      .adConversion {
        background: #30a8bd;
      }
      .impressions {
        background: #d6a307;
      }
      .adCos {
        background: #e05d37;
      }
      .adRoas {
        background: #89a43c;
      }
      .adClicks {
        background: #c84ec6;
      }
      .adClickRate {
        background: #a04848;
      }

      .revenue {
        background: #0045b4;
      }
      .unitsSold {
        background: #8c54ff;
      }
      .traffic {
        background: #30a8bd;
      }
      .conversion {
        background: #d6a307;
      }

      .dspImpressions {
        background: #0045b4;
      }
      .dspSpend {
        background: #8c54ff;
      }
      .dspTotalProductSales {
        background: #30a8bd;
      }
      .dspTotalRoas {
        background: #d6a307;
      }
      .dspTotalDpvr {
        background: #e05d37;
      }
      .dspTtlNewBrandPurchases {
        background: #89a43c;
      }
      .dspProductSales {
        background: #c84ec6;
      }
      .dspRoas {
        background: #a04848;
      }

      .darkGray {
        background: ${Theme.gray35};
      }
      .gray {
        background: ${Theme.gray25};
      }
      .black {
        background: ${Theme.black};
      }
      span {
        color: ${Theme.black};
        font-size: ${Theme.normal};
      }
    }
  }
  .speed-rate {
    font-size: ${Theme.primaryTitleFontSize};
    color: ${Theme.black};
    margin-top: 75px;
    margin-bottom: 70px;
  }

  .average {
    color: ${Theme.black};
    font-size: ${Theme.primaryTitleFontSize};
    position: absolute;
    left: 68px;
    top: 142px;
    text-align: center;

    .out-off {
      color: ${Theme.gray40};
      font-size: ${Theme.extraNormal};
      margin-top: -6px;
    }
  }

  .last-update {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    bottom: 15px;
    right: 21px;
    position: absolute;
  }
  .seller-health {
    color: ${Theme.gray40};
    font-size: ${Theme.primaryTitleFontSize};

    &.positive {
      color: ${Theme.lighterGreen};
    }
  }
  .seller-update {
    color: ${Theme.gray40};
    font-size: 14px;
  }

  .solid-icon {
    margin-right: 15px;
    vertical-align: middle;
    float: left;
  }
  .image-title {
    float: left;
    font-size: ${Theme.extraNormal};
  }

  .service-icon {
    margin-right: 10px;
    vertical-align: middle;
  }

  .social-media-icons {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      display: inline-block;
      vertical-align: middle;
      padding-right: 8px;

      .social-media {
        width: 23px;
      }

      .social-icon-width {
        width: 27px;
      }

      &:last-child {
        padding-right: 0;
      }
    }
  }

  @media only screen and (min-width: 1920px) {
    .company-label-info {
      margin-top: 10px;

      &:first-child {
        margin-left: 0;
      }

      span {
        margin-left: 15px;
        max-width: 210px;

        &.mid-width {
          max-width: 250px;
          width: 100%;

          &.website {
            margin-left: 20px;
          }
        }
      }
    }
    .order-chart-box {
      max-width: 100%;
    }
  }
  @media only screen and (min-width: 1600px) {
    .order-chart-box {
      max-width: 100%;
    }
    .contract-status {
      max-width: 85%;

      &.one-time-service {
        max-width: 80%;
      }
    }
  }
  @media only screen and (max-width: 1150px) {
    .company-label-info {
      margin-top: 10px;

      &:first-child {
        margin-left: 0;
      }
      span {
        margin-left: 15px;
        max-width: 70px;

        &.mid-width {
          max-width: 70px;
          width: 100%;
        }
      }
    }
    .contract-status {
      max-width: 70%;
      &.one-time-service {
        max-width: 65%;
      }
    }
  }
  @media only screen and (max-width: 991px) {
    .brand-logo-details {
      text-align: left;
    }
    .company-label-info {
      max-width: 500px;
      margin-top: 10px;

      &:first-child {
        margin-left: 0;
      }

      .brand-label {
        margin-top: 10px;
        width: 100px;
      }
      span {
        margin-left: 15px;
        max-width: 210px;
        margin-top: 10px;

        &.mid-width {
          max-width: 230px;
          width: 100%;
          width: 100px;
        }

        &.company-size {
          margin-left: 18px;
        }
      }
    }
    .dsp-spent-date {
      list-style-type: none;
      padding: 0;
      margin: 0;
      li {
        display: inline-block;
        margin-right: 20px;

        .label-range {
          font-size: 16px;
        }
      }
    }
    .increase-rate {
      .green-arrow {
        margin-left: 0;
      }
    }
  }
  @media only screen and (max-width: 767px) {
    .brand-logo-details {
      text-align: center;
      max-width: 100%;
    }
    .order-chart-box {
      max-width: 100% !important;
    }
    .days-container {
      margin: 0 auto;
      float: none;
    }
    .rechart-item {
      margin: 0 auto;
      text-align: center;
      padding-top: 10px;
    }
  }
  @media only screen and (max-width: 460px) {
    .brand-name {
      word-break: break-all;

      .company-status {
        white-space: nowrap;
      }
    }
  }

  @media only screen and (max-width: 407px) {
    .company-label-info {
      margin-top: 10px;

      span {
        margin-left: 5px;
        max-width: 117px;
        margin-top: 10px;

        &.mid-width {
          width: 100px;

          &.website {
            margin-left: 5px;
          }
        }

        &.company-size {
          margin-left: 5px;
        }
      }
    }
  }
`;
export default WhiteCard;
