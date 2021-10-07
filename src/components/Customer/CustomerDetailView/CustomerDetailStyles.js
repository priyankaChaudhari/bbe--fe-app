import styled from 'styled-components';

import Theme from '../../../theme/Theme';

const CustomerDetailsBody = styled.div`
  background: ${Theme.gray6};
  min-height: 100%;
  width: 100%;
  padding-left: ${(props) => (props.role === 'Customer' ? '45px' : '109px')};
  padding-right: 45px;
  .back-btn-link {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
    text-transform: initial;
    cursor: pointer;

    .left-arrow {
      width: 16px;
      margin-right: 5px;
      vertical-align: bottom;
    }
  }
  .add-more-people {
    background-size: 100%;
    display: inline-block;
    vertical-align: top;

    img {
      border-radius: 50%;
      width: 40px;
      margin-left: -7px;
      height: 40px;
    }

    &.btn-add-team {
      background-color: ${Theme.white};
      border: 1px solid ${Theme.gray2};
      border-radius: 100%;
      width: 36px;
      margin-left: 2px;
      height: 36px;
      img {
        width: 15px;
        margin: -2px 9px 3px 2px;
      }
    }
  }

  .customer-body-container {
    max-width: 1220px;
    margin: 0 auto;
    width: 100%;
  }

  .account-type {
    float: none !important;
    margin: 0 auto;
  }

  .customer-dropdown-select {
    color: ${Theme.black};
    padding: 0 0px 0px 25px;
    background-color: ${Theme.white};
    border-radius: 8px;
    width: 100%;
    padding: 10px 0;
    border-left: 3px solid ${Theme.orange};
    color: ${Theme.black};
    font-size: 16px;
    font-weight: bold;
    height: 55px;
    border-right: none;
    border-top: none;
    border-bottom: none;

    &:focus {
      outline: none;
    }

    .css-yk16xz-control {
      border: none;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }
    .css-1pahdxg-control {
      border: none !important;
      box-shadow: none !important;
      cursor: pointer;

      &:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
    .css-26l3qy-menu {
      margin-top: -1px;
      border-radius: 4px;
      border-top: none;
      padding: 18px 0;
      border: none;
      box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.1);
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-weight: 500;
    }
  }

  @media only screen and (max-width: 991px) {
    padding: 0 20px;

    .account-type {
      float: none !important;
      margin: unset;
    }
  }
  @media only screen and (max-width: 767px) {
    .account-type {
      float: none !important;
      margin: 0 auto;
    }
  }
`;

export default CustomerDetailsBody;
