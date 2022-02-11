import styled from 'styled-components';
import Theme from '../theme/Theme';

const Tabs = styled.div`
  overflow: auto;
  ::-webkit-scrollbar {
    width: 5px;
    height: 3px;
  }
  ::-webkit-scrollbar-track {
    background-color: ${Theme.white};
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${Theme.gray11};
  }
  .tabs {
    list-style-type: none;
    position: relative;
    text-align: left;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid ${Theme.gray11};

    &.scrollable-container {
      border-bottom: 1px solid ${Theme.gray11};
      display: -webkit-inline-box;
    }
    li {
      display: inline-block;
      padding-right: 10px;
      font-weight: normal;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-family: ${Theme.baseFontFamily};
      cursor: pointer;
      padding: 0 15px 15px 15px;

      &:last-child {
        margin-right: 0;
      }

      &.a {
        text-decoration: none;
      }

      &.active {
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }

      &.scrollable-tab {
        display: block;
        font-size: 14px;
      }

      &.modal-tab {
        font-size: ${Theme.extraNormal};
        padding: 0 15px 10px 15px;
      }
    }
  }
  .grey-box-tab {
    list-style-type: none;
    position: relative;
    text-align: left;
    margin: 0;
    padding: 0;
    border-bottom: none;

    .account-type {
      background-color: #f4f6fc;
      border: 1px solid #d5d8e1;
      border-radius: 2px;
      padding: 6px 14px;
      color: #2e384d;
      font-size: 14px;
      margin-right: 0;
      font-family: ${Theme.baseFontFamily};
      display: inline-block;
      cursor: pointer;

      &.active {
        background-color: #ffffff;
        border: 1px solid #2e384d;
      }
    }
  }
  @media only screen and (max-width: 768px) {
    .tabs {
      li {
        margin-right: 5px;
        padding: 10px 10px 10px 10px;
        font-size: ${Theme.normal};
      }
    }
    .grey-box-tab {
      .account-type {
        padding: 6px 10px;
      }
    }
  }
`;

export default Tabs;
