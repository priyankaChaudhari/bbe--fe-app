import styled from 'styled-components';
import Theme from '../theme/Theme';

const SidePanel = styled.div`
    min-width: 60px;
    z-index: 1;
    width: 336px;
    position: fixed;
    top: 70px;
    right: 0;
    height: 85%;
    background: ${Theme.white};
    border-left: 1px solid ${Theme.gray7};
    overflow-y: auto;
   
    
    &.pdf-sidebar {
      padding-bottom: 70px;
      height: 90%;
    }

    &.contract-sidebar {
     padding-bottom: 270px;

    }

    .sidebar {
      /* width: 335px; */
    }
    
    .error-found {
      color: ${Theme.red};
      font-size: ${Theme.small};
      word-spacing: normal;
      font-weight: 300;
    }
    
  .sendar-details {
    color: ${Theme.black};
    font-size: ${Theme.extraMedium};
    font-family: ${Theme.baseFontFamily};
    text-transform: inherit;
    margin-top: 6px;
    margin-left: 16px;
    float: left;
    word-spacing: 3px;
    max-width: 237px;
   
    &.error-container {
     margin-top: -3px;
    }
   
  
   .green-check-select {
     width: 16px;
     position: absolute;
     right: 21px;
     top: 22px;
    }

    .red-cross {
      width: 16px;
      position: absolute;
      right: 21px;
      top: 25px;
    }
    
   .error-bg {
      height: 63px;
      background: ${Theme.lightRed};
      right: 0px;
      border-right: 2px solid #D63649;
      z-index: -2;
      top: 0px;
      position: absolute;
      width: 46px;

      .red-cross {
        width: 16px;
        position: absolute;
        right: 13px;
        top: 25px;
      }
    }
    .one-time-service {
      height: 85px;
      .red-cross {
       top: 35px;
      }
    }
 }

  .sender-profile {
    border: 1px solid ${Theme.gray9};
    border-radius: 100%;
    width: 48px;
    height: 48px;
  }
  .sender-name {
    text-transform: capitalize;
    color: ${Theme.gray90};
    font-size: ${Theme.medium};
  }

  .sticky-btn {
    bottom: 100px;
    position: absolute;
  }
  .service-detail {
    padding:20px 20px 0 20px;
  }
  .service-agre {
    float: left;
    width: 32px;
  }
  h4 .sendar-details {
    float: left;
    margin: 9px 0px 0px 20px;
  }
}
  
.add-market-place {
  font-size: 12px;
  color:${Theme.orange};
}

.collapse-btn {
  width:100%;
  padding: 15px;
  cursor:pointer;
  position: relative;

}
.collapse-container {
  padding: 15px;
}

.collapse-inner {
    margin:0;
    padding:0;
    list-style-type:none;
   
    li {
        padding: 8px 20px;

        &:focus {
          background: ${Theme.lightOrange};
        }
         .small-para {
          font-size: ${Theme.extraNormal};
          color: ${Theme.gray40};
          line-height: 22px;
         }
        .edit-folder-icon {
          vertical-align: text-top;
          width: 17px;
        }

        .label-heading {
          color: ${Theme.gray40};
          font-size:${Theme.verySmall};
          text-transform: uppercase;
          font-weight: bold;
        }
        .listing-optimazation {
          color:  ${Theme.gray85};
          font-size: ${Theme.extraNormal};
        }

        .text-end {
          text-align: end;
        }

        .increment {
           border: 1px solid ${Theme.gray45};
            border-radius: 0 2px 2px 0;
            width: 26px;
            height: 26px;
            padding 4px;
            background: ${Theme.gray8};
            vertical-align: bottom;
            cursor: pointer;

           .plus-icon{
             width: 10px;
           }

           &:focus{
             outline: none;
           }
        }
        .decrement {
           border: 1px solid ${Theme.gray45};
            border-radius: 2px 0 0 2px;
            width: 26px;
            height: 26px;
            vertical-align: bottom;
            padding: 4px;
            background: ${Theme.gray8};
            font-family: ${Theme.titleFontFamily};
            cursor:pointer;

           .minus-icon {
              width: 10px;
           }
             &:focus{
             outline:none;
           }
        }
        .max-min-number {
          width: 26px;
          border: 1px solid ${Theme.gray45};
          vertical-align: bottom;
          color: ${Theme.black};
          height: 26px;
          font-size: 14px;
          font-family: ${Theme.titleFontFamily};
          text-align: center;
        }

        .contract-info-date {
          line-height: 22px;
          font-size: 14px;
          color: ${Theme.gray40};
        }
        .add-discount {
          color: #FF4817;
          font-size: 11px;
          position: absolute;
          right: 0;
          top: 4px;
          cursor: pointer;
        }
        .thershold {
          background-color: ${Theme.gray8};
           border-radius: 2px;
          
          .days-tab {
            list-style-type: none;
            padding: 0;
            margin: 0;
           
            .thresholdChecked {
              background-color: ${Theme.white};
              border: 1px solid ${Theme.gray90};
              color: ${Theme.gray90};
              /* width: 100%; */
              font-family: ${Theme.titleFontFamily};
                 
            }
           
            li{
              display: inline-block;
              text-align: center;
              width: 25%;
              border: 1px solid ${Theme.gray45};
            
              label {
                color: ${Theme.black};
                padding: 9px 8px;
                height: 36px;
                font-size: ${Theme.extraNormal};
                display: inline-block;
                cursor: pointer;

                  &.thresholdLable {
                    text-transform: uppercase;
                  }
              }
            }
          }
        }
     }
   } 
   .contract-status {
      color: ${Theme.gray85};
      font-size: 14px;
      border-radius: 2px;
      text-align: center;
      background: ${Theme.extraLightYellow};
      padding: 12px 0;
      min-height: 40px;
      margin: 10px 0px 10px 10px;

      &.pending-contract {
        background: ${Theme.gray8};
      }
      &.pending-signature {
        background: #FFDED6;
      }
      &.signature {
        background: ${Theme.white};
        border: 1px solid ${Theme.gray45};
      }
   }

   .contract-file-icon {
      vertical-align: bottom;
      margin-right: 7px;
   }

  .activity-log {
    font-size: ${Theme.extraMedium};
    padding: 20px 20px 0 15px;
    color: ${Theme.black};
    font-weight: 600;
  }
  .current-agreement-title {
      padding: 20px;
      text-transform: uppercase;
      border-bottom: 1px solid ${Theme.gray9};
  }
  .menu {
     padding:0;
      li {
        color:${Theme.white};
        text-align: center;
        font-size: 18px;
        font-weight: 900;
        list-style: none;
        display: flex;
        text-decoration: none;
        padding: 10px 0px 15px 15px;
      
        &:last-child {
          border-bottom:none;
        }

        .default-user-activity {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          float: left;
          margin-right: 15px;
          margin-top: -2px;

        &.contract-mail {
          width: 20px;
          height: 20px;
          margin-top: 0px;
          margin: 10px;
        }
      }

      .contract-email {
        background-color: #f4f6fc;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        float: left;
        margin-right: 10px;
    }

        .activity-user {
          font-size: ${Theme.normal};
          color:${Theme.gray90};
          float: left;
          word-break: break-word;
          width: 85%;
          text-align: left;
          span {
            color:${Theme.gray35};
            font-weight: 500;
          }
          .email-clicks {
          float: left;
          margin-top: 10px;
          margin-left: 5px;
          .email-opens {
            border-right: 1px solid ${Theme.gray35};
            padding: 0 8px;
            color: ${Theme.black};
            &:last-child {
              border-right: none;
            }
          }
        }
      }

      

        .default-user {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          float: left;
          margin-right: 10px;
        }

        .time-date {
          color:${Theme.gray40};
          font-size: ${Theme.small};
          font-weight: 500;
          text-align: left;
        }
         .pdf-download {
          width:33px;
          height:33px;
          margin-left: 10px;
          padding:6px;
          cursor:pointer;
          float:right;

          &:hover{
            background:${Theme.gray8};
            border-radius: 50%;
            width:33px;
            height:33px;
            padding:6px;
          }
          
        }
        
      }

    }
  }
  .amendments-section {
    .label {
      border-bottom: 1px solid #EEF3F5;
      width: 100%;
      text-align: left;
    }
    .text-delete {
      text-decoration: line-through;
    }
    .added-remove-text {
      font-size: ${Theme.extraSmall};
      color: ${Theme.gray40};
    }
    .next-arrow {
      width: 20px;
      vertical-align: bottom;
      margin: 0 5px;
    }
    .new-basic-text {
      color: ${Theme.gray85};
      // text-decoration: none;
      font-size: ${Theme.extraNormal};
    }
  }
  @media only screen and (max-width: 350px) {  
  
    .sendar-details {
      max-width: 237px !important;
      .one-time-service {
        height: 85px !important; 
        .red-cross {
          top: 35px !important;
        }
      }
    }
  }


  @media only screen and (max-width: 991px) {  
    z-index: 1;
    padding-bottom: 390px;
    width: 100%;
    position: fixed;
    top: 163px;
    right: 0;
    left:0;
  .sendar-details {
    max-width: 100%;
      .one-time-service {
        height: 63px;
        .red-cross {
          top: 25px;
        }
      }
    }
  }

   @media only screen and (min-width: 1500px)  {
     width: 406px;
     height: 90%;
     .sidebar {
      width: 400px;
    }
    .sendar-details {
      max-width: 100%;
      .one-time-service {
        height: 63px;
        .red-cross {
          top: 25px;
        }
      }
    }
   }
`;

export default SidePanel;
