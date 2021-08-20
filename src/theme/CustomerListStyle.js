import styled from 'styled-components';
import Theme from './Theme';

export const CustomerListPage = styled.div`
  padding-left: 62px;
  padding-left: 62px;
  background-color: ${Theme.gray6};
  padding-top: 60px;
  height: 100%;

  .main-body-container {
    width: 93%;
    margin: 0 auto;
    height: 100%;
    .table-container {
      height: calc(100% - 120px);
      min-height: 600px;
      padding-bottom: 100px;
      overflow-y: auto;
      overflow-x: hidden;
      overflow: auto;
      border-radius: 15px;
      top: 130px;
      width: 66%;
      position: fixed;

      padding: 15px;
      background: #ffff;
      .fixed-customer-header {
        position: fixed;
        max-width: 64%;
        width: 100%;
        background-color: ${Theme.white};
        z-index: 2;
        top: 130px;
        padding-top: 5px;
      }
    }
  }

  .table-header {
    box-shadow: none;
    position: fixed !important;
    z-index: 1;
    max-width: 64%;
    width: 100%;
    margin: 0;
    height: 40px;
    margin-top: 51px;
    color: ${Theme.gray40};
    font-size: 11px;
    background: ${Theme.white};
    font-family: ${Theme.baseFontFamily};
    text-transform: uppercase;
    border-bottom: 1px solid ${Theme.gray7};
    padding: 13px;
    font-weight: 600;
    vertical-align: top;
  }
  .dropdown-select-all-notes {
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2};
    border-radius: 20px;
    width: 100%;
    height: 40px;
    color: ${Theme.black};
    padding: 11px 2px 0 14px;
    margin-top: 10px;
    margin-bottom: 14px;
    cursor: pointer;
    span.selected-list {
      position: fixed;
      color: ${Theme.black};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 9%;
      margin-left: 4px;
    }
  }
  .dropdown-notes-filter {
    background-color: ${Theme.white};
    border-radius: 8px;
    box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.4);
    padding: 5px 0 5px 0;
    position: absolute;
    z-index: 99999;
    top: 57px;
    width: 94%;
    color: ${Theme.black};
    text-align: left;
    &.hide {
      display: none;
    }
    &.show {
      display: block;
    }
    .notes-option {
      list-style-type: none;
      padding: 0;
      margin: 0;
      li {
        padding: 9px 15px 9px 15px;
        cursor: pointer;
        &.on-hover1 {
          &.hide {
            display: none;
          }
        }
        &.on-hover1 {
          &.show {
            .sub-menu-dropdown {
              display: block;
              background-color: ${Theme.white};
              border-radius: 8px;
              box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.4);
              max-width: 230px;
              padding: 5px 0 5px 0;
              position: absolute;
              z-index: 99999;
              top: 122px;
              width: 100%;
              left: -101%;
              color: ${Theme.black};
              text-align: left;
              .notes-option {
                list-style-type: none;
                padding: 0;
                margin: 0;
                li {
                  padding: 9px 15px 9px 15px;
                  display: block;
                }
              }
            }
          }
          &.submenu-4 {
            &.show {
              .sub-menu-dropdown {
                top: 155px;
              }
            }
          }
          &.submenu-5 {
            &.show {
              .sub-menu-dropdown {
                top: 186px;
              }
            }
          }
          &.submenu-6 {
            &.show {
              .sub-menu-dropdown {
                top: 225px;
              }
            }
          }
        }
        &:hover {
          background: #deebff;
        }
        &.active {
          background: #2684ff;
          color: ${Theme.white};
        }
        &:selected {
          background: #2684ff;
        }
      }
    }
  }
  .revenue {
    padding-left: 5%;
  }
  .units_sold {
    padding-left: 4%;
  }
  .traffic {
    padding-left: 3%;
  }
  .conversion {
    padding-left: 2%;
  }
  .Brand_Strategist {
    padding-left: 2%;
  }

  .sticky-header {
    top: 130px;
    left: 353px;
    right: 0;
    background: white;
    height: 40px;
    z-index: 1;
    display: inline;
  }

  .customer-list-header-sticky {
    left: 64px;
    right: 0;
    z-index: 2;
    background-color: ${Theme.white};
    width: 100%;
  }
  .table-part {
    overflow: auto;
    min-height: 892px;
    height: 100%;
    position: relative;
  }
  .customer-list-header {
    margin: 10px 0;
    &.w-80 {
      float: right;
      width: 94%;
    }
  }
  .footer-sticky {
    position: fixed;
    bottom: 0px;
    width: 64%;
    background: white;
  }
  @media only screen and (min-width: 1920px) {
    .customer-list-header {
      &.w-80 {
        width: 106% !important;
      }
    }
  }
  @media only screen and (min-width: 1600px) {
    .customer-list-header {
      &.w-80 {
        width: 97%;
      }
    }
    .dropdown-notes-filter {
      .notes-option {
        li {
          &.on-hover1 {
            &.show {
              .sub-menu-dropdown {
                left: -232px;
              }
            }
          }
        }
      }
    }
  }
  @media only screen and (max-width: 1240px) {
    .dropdown-select-all-notes {
      span.selected-list {
        position: fixed;
        color: ${Theme.black};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 6%;
      }
    }
  }
  @media only screen and (max-width: 992px) {
    padding-left: 0px;
    .main-body-container {
      width: 100%;
      .table-container {
        width: 100%;
      }
      .table-container {
        background-color: transparent;
        padding: 0;
        .fixed-customer-header {
          max-width: 100%;
          background: ${Theme.gray6};
          top: 80px;
        }
      }
    }

    .customer-list-header-sticky {
      background-color: transparent;
    }
    .customer-list-header {
      &.w-80 {
        width: 100%;
      }
    }
    .dropdown-select-all-notes {
      span.selected-list {
        width: 80%;
      }
    }
    .dropdown-notes-filter {
      .notes-option {
        li {
          &.on-hover1 {
            &.show {
              .sub-menu-dropdown {
                left: -232px;
              }
            }
          }
        }
      }
    }

    .customer-list-header {
      margin: 5px 0;
    }
  }
  @media only screen and (max-width: 767px) {
    .dropdown-notes-filter {
      width: 40%;
      right: 16px;
    }
  }
  @media only screen and (max-width: 577px) {
    .dropdown-notes-filter {
      .notes-option {
        li {
          &.on-hover1 {
            &.show {
              .sub-menu-dropdown {
                left: -101%;
              }
            }
          }
        }
      }
    }
  }
  .selectAll {
    border-right: 1px solid black;
  }
  .sort-arrow-up {
    position: absolute;
    bottom: -4px;
    margin-left: 2px;
    transform: rotate(180deg);
  }
  .sort-arrow-up.rotate {
    transform: rotate(360deg);
    bottom: -6px;
  }
`;

export const CustomerLeftPannel = styled.div`
  height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
  overflow: auto;
  border-radius: 15px;
  top: 130px;
  width: 100%;
  position: fixed;
  max-width: 21.5%;
  padding-bottom: 140px;
  background: ${Theme.white};
  .customer-list-pannel {
    height: 80%;
    overflow: auto;
    padding-top: 20px;

    top: 130px;
    width: 100%;
    position: fixed;
    max-width: 21.5%;
    padding-bottom: 20px;
  }
  .label {
    color: ${Theme.gray40};
    text-transform: uppercase;
    line-height: 22px;
    font-family: ${Theme.titleFontFamily};
    font-size: 11px;
    margin-bottom: 3px;
  }
  .check-box-list {
    list-style-type: none;
    padding: 0;
    margin: 10px 0 5px 0;
    li {
      color: ${Theme.gray85};
      font-size: 14px;
      margin-bottom: 15px;
    }
  }
  .customer-list-filter {
    color: ${Theme.black};
    font-size: 16px;
    font-weight: 600;
  }
  .clear-filter {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    font-family: ${Theme.baseFontFamily};
    cursor: pointer;
  }
  .btn-apply {
    color: ${Theme.white};
    bottom: 20px;
    position: fixed;
  }
  @media only screen and (max-width: 991px) {
    dispaly: none;
  }
`;

export const SideContent = styled.div`
  display: none;
  @media (max-width: 991px) {
    display: block;
    width: 100%;
    min-height: 100%;
    top: 10px;
    left: 0;
    right: 0;
    background: white;

    .label {
      color: ${Theme.gray40};
      text-transform: uppercase;
      line-height: 22px;
      font-family: ${Theme.titleFontFamily};
      font-size: 11px;
      margin-bottom: 3px;
    }
    .check-box-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
      li {
        color: ${Theme.gray85};
        font-size: 14px;
        margin-bottom: 15px;
      }
    }
    .unselected {
      color: ${Theme.gray40};
      font-size: 14px;
      float: right;
      cursor: pointer;
    }
    .selected {
      float: right;
      color: ${Theme.gray40};
      border-right: 2px solid ${Theme.gray4};
      padding-right: 8px;
      cursor: pointer;
    }
  }
`;
