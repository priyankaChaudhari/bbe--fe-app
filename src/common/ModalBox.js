import styled from 'styled-components';
import Theme from '../theme/Theme';

const ModalBox = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  border-radius:10px;

  .modal-body {
    &.on-boarding {
      padding-bottom: 10px;

      .role-selected {
        color: ${Theme.gray90};
        font-size: ${Theme.normal};
        font-family: ${Theme.titleFontFamily};
      }
      .signature-request {
        font-size: ${Theme.medium};
        .email-address {
          color: ${Theme.gray90};
        }
      }

      .send-copy-contract {
        color: ${Theme.gray30};
        font-size: ${Theme.extraSmall};
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 1.13px;
        font-family: ${Theme.titleFontFamily};
      }
      .copy-review {
        font-size: ${Theme.small};
        color: ${Theme.gray35};
      }

      .add-new-contact {
        color: ${Theme.orange};
        font-size: ${Theme.small};

        .add-new-icon {
          vertical-align: top;
          width: 16px;
        }
      }
    }
            @media not all and (min-resolution:.001dpcm)
      { @supports (-webkit-appearance:none) {

          .modal-heading{ 

            padding: 7px 15px 7px 0 !important;
              padding-left:15px !important;

          }
      }}

          .modal-heading {
            padding: 7px 0;
            padding-left: 0;

            ::i-block-chrome, .modal-heading {
              padding: 7px 15px 7px 0 !important;
              padding-left:15px !important;
          }

          @media not all and (min-resolution:.001dpcm)
      { @supports (-webkit-appearance:none) {

          .modal-heading{ 

            padding: 7px 15px 7px 0 !important;
              padding-left:15px !important;

          }
      }}
    }
  }
  

    .edit-profile-text {
      position: relative;

      .name-email {
        color: ${Theme.gray36};
        font-size: ${Theme.small};

        .team-member-name{
          color: ${Theme.gray90};
          font-size: ${Theme.medium};
        }
      }
    }
    .trash-icon {
      position: absolute;
      top: 40px;
      right: 5px;
      width: 18px;
    }

    .arrow-back-icon {
      width: 14px;
      vertical-align: middle;
      margin-right: 3px;
    }

    .alert-msg {
      color: ${Theme.gray90};
      font-size: ${Theme.medium};
      max-width: 295px;
      text-align: center;
      font-weight: 600;
      margin: 0 auto;
    }

    .arrow-right {
      width: 15px;
      margin: 0px 7px 0 7px;
      vertical-align: bottom;
      top: 5px;
    }
    .success-msg {
      margin-top: -17px;
    }

    .body-content {
      max-height: 520px;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .roleName {
        left: 30px;
        top: 10px;
        padding-left: 0px;
        color: ${Theme.gray90};
        font-weight: bold;
      }

      .no-result-found {
        margin: 0 auto;
      }

      .heading {
        color: ${Theme.gray30};
        font-size: ${Theme.extraSmall};
        letter-spacing: 1.13px;
        text-transform: uppercase;
        font-weight: bold;
      }

      .remove-contact {
        position: absolute;
        top: 5px;
        right: 26px;
        width: 16px;
      }

      .trash {
        position: absolute;
        top: 28px;
        right: 23px;
        width: 16px;
      }

      .contact-user {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-top: 10px;
      }

      .add-user {
        width: 16px;
        vertical-align: middle;
      }

      .profile-photo {
        border: 8px solid #fafafb;
          border-radius: 10px;
          width: 120px;
          height: 120px;
          margin-left: 10px;
          position: relative;
      }

      span {
        color: ${Theme.gray90};
        font-weight: 600;

        .social-media {
          width: 15px;
          margin-top: 4px;
          vertical-align: bottom;
        }
       
      }
      .customer-company-profile {
        border: 8px solid ${Theme.gray6};
        border-radius: 10px;
        width: 120px;
        height: 120px;
        margin-left: 10px;
        position:relative;

         .edit-profile-picture {
            background: #f0f2fc;
            border-radius: 18px;
            border: 3px solid white;
            position: absolute;
            right: -25px;
            top: 79px;
            width:50px;
            height:50px;
            padding: 9px;
            cursor:pointer;
          }
       }

      .drop-down {
        color: ${Theme.gray90};
        font-family: ${Theme.titleFontFamily};
        text-align: right;
        font-size: ${Theme.normal};
      }

      .team-member-list:first-child {
        padding-top: 5px !important;

        .trash-icon {
          top: 22px !important;
        }
      }
    }

    .embed-responsive-item {
      height: 400px;
    }
    .payment-option {
        list-style-type: none;
        margin: 0;
        padding: 0;
        li {
          display: inline-block;
          margin-right: 20px;
          text-transform:capitalize;

          &:last-child {
            margin-right: 0px;
          }

          .card {
            width: 17px; 
            vertical-align: top;
          }
        }
      }

    @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .modal-heading {
          padding: 7px 15px 7px 0;
          padding-left:15px;
        }
    }

    }

    .footer-line {
      border-bottom: 1px solid ${Theme.gray5};
      margin: 10px 0;
      width: 100%;
    }

    .modal-footer {
      padding: 10px 20px 20px 20px;
    }

    .cropper-container {
      max-width: 600px !important;
      max-height: 480px !important;
    }
    .croped-img {
      max-width: 600px !important;
      padding-top: 20%;
      background: ${Theme.gray20};
      max-height: 480px !important;

      img {
        outline: 1px solid #39f;
      }
    }

    @media only screen and (min-width: 1700px) and (max-width: 1920px) { 
      &.on-boarding {
        .role-selected {
          font-size: ${Theme.normalRes};
        }
        .signature-request {
          font-size: ${Theme.mediumRes};
        }

        .send-copy-contract {
          font-size: ${Theme.extraSmallRes};
        }
        .copy-review {
          font-size: ${Theme.smallRes};
        }

        .add-new-contact {
          font-size: ${Theme.smallRes};
        }
          
      }
      .edit-profile-text {
        position: relative;

         .name-email {
           font-size: ${Theme.smallRes};

          .team-member-name{
            font-size: ${Theme.mediumRes};
          }
        }
      }

      .alert-msg {
        font-size: ${Theme.mediumRes};
      }

      .body-content {
        
        .heading {
          font-size: ${Theme.extraSmallRes};
        }
        .drop-down {
          font-size: ${Theme.normalRes};
        }
      
      }
          
    }
     
  }
  
`;

export default ModalBox;
