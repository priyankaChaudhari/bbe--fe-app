import styled from 'styled-components';

import Theme from '../../../../theme/Theme';

export const CommissionHeader = styled.div`
  .comission-header {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: end;

    li {
      display: inline-block;
      margin-right: 25px;

      &.w-10 {
        max-width: 200px;
        width: 100%;
        @media only screen and (max-width: 768px) {
          max-width: 100%;
        }
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;
export const CommissionNav = styled.div`
  .drop-down-nav {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: end;

    li {
      display: inline-block;
      margin-right: 25px;

      .down-arrow-icon {
        transform: rotate(90deg);
        width: 12px;
        vertical-align: middle;
        margin-right: 8px;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    @media only screen and (max-width: 768px) {
      li {
        width: 100%;
        .gray-btn {
          width: 100%;
          margin-bottom: 15px;
          text-align: left;
          margin-top: 20px;
          position: relative;
        }
        .down-arrow-icon {
          position: absolute;
          right: 20px;
          top: 15px;
        }
      }
    }
  }
`;
export const CommissionTabletView = styled.div`
  .company-name {
    font-size: ${Theme.title};
    font-weight: 600;
    color: ${Theme.black};
  }
  .status {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
  }
  .commission-card-details {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      margin: 0 25px 20px 0;
    }
  }
`;
export const DateRangeDropDown = styled.div`
  background-color: ${Theme.white};
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  position: absolute;
  right: 15px;
  z-index: 22;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  top: 45px;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: left;
    .date-range {
      display: inline-block;
      text-align: left;
      margin-right: 20px;
    }
  }
  .cross-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 16px;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const DropDownSelectMonthPicker = styled.div`
  .dropdown-select-all-notes {
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2};
    border-radius: 20px;
    width: 230px;
    height: 40px;
    color: ${Theme.black};
    padding: 11px 2px 0 14px;
    text-align: left;
    cursor: pointer;
    position: relative;

    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }
`;

export const CommissionResseque = styled.div`
  .commission-Resseque {
    padding: 0 0 0 10px;
    margin: 0 0 0 0;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;

    &.active {
      background: #f4f6fc;
    }
    li {
      width: 100%;
      display: inline-block;
      max-width: 20%;
      flex: 0 0 20%;
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-bottom: 15px;
    }
    @media only screen and (max-width: 768px) {
      li {
        width: 100%;
        display: inline-block;
        max-width: 30%;
        flex: 0 0 30%;
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        margin-bottom: 15px;
      }
    }
  }
  .comission-overlay-content {
    height: 95vh;
    overflow-y: auto;
    padding-bottom: 30px;
  }
`;
