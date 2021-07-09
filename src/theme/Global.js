import styled from 'styled-components';
import Theme from './Theme';
import { BannerBg } from './images/index';

// export const BodyWhite = styled.div`
//   height: 100%;

//   .arrow-icon {
//     width: 13px;
//     margin-right: 5px;
//     vertical-align: baseline;
//     cursor: pointer;
//   }

//   .edit-icon {
//     width: 15px;
//   }

//   .brand-title {
//     display: flex;
//     .blue-logo {
//       width: 120px;
//       height: 120px;
//       border-radius: 50%;
//       float: left;
//       margin-right: 40px;
//     }

//     .add-more-people {
//       .add-mores {
//         background-size: 100%;
//         border-radius: 50%;
//         width: 40px;
//         height: 40px;
//         display: inline-block;
//         vertical-align: top;
//         margin-left: -10px;

//         &:hover {
//           background: rgba(5, 20, 34, 0.2);
//         }
//       }
//       .add-more-icon {
//         width: 16px;
//         margin: 13px 0 10px 20px;
//       }
//     }
//   }
//   .horizontal-line {
//     margin-top: -17px;
//     border-bottom: 1px solid #dee2ed;
//   }

//   .button-modal {
//     margin-left: 30px;
//   }

//   .edit-costomer-profile {
//     width: 40px;
//     height: 40px;
//     position: absolute;
//     bottom: 13px;
//     left: 98px;
//     padding: 8px;
//     border-radius: 50%;
//     background: white;
//     border: 1px solid rgba(46, 91, 255, 0.08);
//     cursor: pointer;
//     box-shadow: 0 2px 12px 0 rgba(46, 56, 77, 0.5);
//   }

//   @media only screen and (max-width: 767px) {
//     .button-modal {
//       margin-left: 0;
//     }
//   }

//   @media only screen and (max-width: 991px) {
//     padding: 20px 100px 20px 10px;
//   }
//   @media only screen and (max-width: 767px) {
//     padding: 20px 100px 20px 10px;
//     .brand-title {
//       .blue-logo {
//         width: 80px;
//         height: 80px;
//         margin-right: 10px;
//       }

//       h1 {
//         font-size: 28px;
//       }
//       .add-more-people {
//         .add-mores {
//           width: 40px;
//           height: 40px;
//         }
//       }
//     }
//   }
//   @media only screen and (max-width: 540px) {
//     padding: 20px 100px 20px 10px;
//     .brand-title {
//       .blue-logo {
//         width: 50px;
//         height: 50px;
//         margin-right: 10px;
//       }

//       h1 {
//         font-size: 20px;
//       }
//       .add-more-people {
//         .add-mores {
//           width: 30px;
//           height: 30px;
//         }
//       }
//     }
//   }
// `;

export const GroupUser = styled.div`
  display: flex;
  .activity-user {
    font-size: ${Theme.normal};
    color: ${Theme.black};
    font-weight: 500;
    line-height: 18px;
    overflow-wrap: break-word;
    text-align: left;
    float: left;
    width: 80%;
    span {
      color: ${Theme.gray35};
      font-weight: 500;

      &.font-bold {
        font-weight: 600;
        color: ${Theme.black};
      }
      &.note-text {
        color: ${Theme.black};
      }
    }
    p {
      margin: 0;
      font-size: 15px;
      display: contents;
    }
  }
  .default-user-activity {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    float: left;
    margin-right: 15px;
    margin-top: -2px;
  }

  .time-date {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    font-weight: 500;
    text-align: left;
    overflow-wrap: break-word;

    .pin {
      color: ${Theme.black};
      position: relative;

      .more-action {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: contents;
        li {
          display: inline-block;
          position: relative;
          margin-left: 18px;
          cursor: pointer;
          .dot {
            background-color: #8798ad;
            border-radius: 50%;
            width: 3px;
            height: 3px;
            position: absolute;
            top: 7px;
            margin-left: -10px;
          }

          &.delete {
            cursor: pointer;
            color: ${Theme.black};
            /* .delete-msg {
              display: none;
            } */
            .delete {
              color: ${Theme.black};
            }

            /* &:hover { */
            .delete-msg {
              display: block;
              border-radius: 6px;
              box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1);
              background-color: ${Theme.white};
              color: ${Theme.red};
              font-size: 16px;
              text-align: center;
              position: absolute;
              top: 25px;
              width: 170px;
              padding: 17px 0;
              z-index: 99999;

              font-weight: 600;
              .red-trash-icon {
                width: 18px;
                vertical-align: text-top;
                margin-right: 6px;
              }
            }
            /* } */
          }
        }
      }
    }
  }
  .pin-icon {
    position: absolute;
    width: 23px;
    background: white;
    top: 20px;
    left: 42px;
  }

  .user-email-address {
    color: ${Theme.gray85};
    text-align: left;
    font-size: ${Theme.normal};
    float: left;
    word-break: break-all;
    width: 86%;
  }
`;
export const BrandPartnerDashboard = styled.div`
  //padding-left: 62px;

  .partner-select {
    list-style-type: none;
    padding: 0;
    margin: 10px 0;
    li {
      display: inline-block;
      width: 210px;
      margin-right: 10px;
      vertical-align: top;

      &.my-partner {
        width: 180px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .text-md-right {
    text-align: right;
  }
  .text-sm-left {
    dispaly: none;
  }
  .dashboard-header-sticky {
    position: fixed;
    left: 64px;
    right: 0;
    z-index: 1;
    background-color: ${Theme.white};
  }
  .footer-sticky {
    padding-left: 64px;
  }
  // @media only screen and (max-width: 700px) {
  //   .partner-select {
  //     li {
  //       width: 335px;

  //       &.partner {
  //         width: 335px;
  //         margin-bottom: 15px;
  //       }
  //     }
  //   }
  // }

  @media only screen and (max-width: 991px) {
    padding-left: 0;

    .dashboard-header-sticky {
      left: 0;
    }
    .partner-select {
      list-style-type: none;
      text-align: left;

      li {
        width: 240px;

        &.my-partner {
          width: 208px;
        }
      }
    }
    .footer-sticky {
      padding-left: 0;
    }
  }
  @media only screen and (max-width: 767px) {
    // .text-md-right {
    //   dispaly: none;
    // }
    .text-sm-left {
      text-align: left;
    }
    .partner-select {
      list-style-type: none;
      text-align: left;

      li {
        width: 100%;
        margin-bottom: 10px;

        &.my-partner {
          width: 100%;
        }
      }
    }
  }
`;

export const DashboardCard = styled.div`
  background: ${Theme.gray6};
  min-height: 100vh;
  height: 100%;
  padding-top: 70px;

  .dashboard-body {
    max-width: 1334px;
    width: 100%;
    margin: 0 auto;
    padding-top: 40px;
    padding-left: 62px;

    .company-logo {
      border-radius: 10px;
      width: 66px;
      height: 66px;
      // margin-right: 14px;
      margin-bottom: 8px;
    }

    .company-name {
      vertical-align: middle;
      position: relative;
      color: ${Theme.black};
      font-size: ${Theme.title};
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 270px;
      min-height: 20px;
    }

    .status {
      color: ${Theme.gray85};
      font-size: ${Theme.extraNormal};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 270px;
      min-height: 15px;
    }

    .solid-icon {
      border-radius: 6px;
      width: 36px;
      height: 36px;
    }

    p.black-heading-title {
      font-size: 14px;
    }
    .card-label {
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
      font-family: ${Theme.titleFontFamil};
      text-transform: uppercase;
      font-weight: 800;
      margin-bottom: 5px;
    }
    .sold-price {
      color: ${Theme.gray80};
      font-size: 20px;
      font-weight: 500;
    }
    .vs {
      color: ${Theme.gray40};
      font-size: ${Theme.normal};
    }
    .spacing {
      margin: 10px 0 10px 0;
    }
  }
  @media only screen and (max-width: 768px) {
    padding-top: 155px;
    .dashboard-body {
      padding-left: 0;
      padding-top: 40px;
    }
  }
  @media only screen and (max-width: 991px) {
    .dashboard-body {
      padding-top: 70px;
      padding-left: 0;
      padding-right: 15px;
    }
  }

  @media only screen and (min-width: 1600px) {
    .dashboard-body {
      max-width: 1434px;
    }
  }

  @media only screen and (min-width: 1700px) and (min-width: 1920px) {
    .dashboard-body {
      max-width: 85%;
    }
  }
`;

export const FormContainer = styled.div`
  height: 100%;
  .banner-bg {
    width: 100%;
    height: 100%;
    background-image: url(${BannerBg});
    background-position: center;
    background-size: cover;
  }

  .inner-form {
    max-width: 360px;
    margin: 0 auto;
    width: 100%;
    vertical-align: middle;

    .logo {
      img {
        width: 160px;
        display: inline-table;
        padding: 40px 0 100px 0;
      }
    }
    .sub-text {
      color: ${Theme.black};
      font-size: ${Theme.normal};
      margin: 0 0 22px 0;
      line-height: 22px;
    }

    .google-icon {
      width: 40px;
      position: absolute;
      top: 2px;
      margin-right: 10px;
      left: 2px;
      bottom: -2px;
      vertical-align: bottom;
    }

    h2 {
      font-size: ${Theme.MediumTitleFontSize};
    }
    .back-link {
      font-weight: 500;
      .arrow-back {
        vertical-align: middle;
        width: 15px;
        margin-right: 8px;
      }
    }
    .forgot-pswd-link {
      color: ${Theme.gray40};
      font-size: ${Theme.extraNormal};
    }
  }

  @media only screen and (max-width: 991px) {
    background-position: center;
    background-size: cover;
    background-image: url(${BannerBg});
    background-repeat: no-repeat;
    height: 100%;

    .inner-form {
      background: rgb(91 91 91 / 0.9);
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;

      .sub-text {
        color: ${Theme.white};
      }

      h2 {
        font-size: ${Theme.MediumTitleFontSize};
        color: ${Theme.white};
      }
      .back-link {
        font-weight: 500;
        color: ${Theme.white};
        .arrow-back {
          vertical-align: middle;
          width: 15px;
          margin-right: 8px;
        }
      }
      .forgot-pswd-link {
        color: ${Theme.white};
      }
    }
  }
`;

export default global;
