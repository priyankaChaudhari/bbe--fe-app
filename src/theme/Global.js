import styled from 'styled-components';
import Theme from './Theme';

export const BodyWhite = styled.div`
  // padding: 20px 280px 20px 10px;
  //position: relative;
  height: 100%;

  .arrow-icon {
    width: 13px;
    margin-right: 5px;
    vertical-align: baseline;
    cursor: pointer;
  }

  .edit-icon {
    width: 15px;
  }

  .brand-title {
    display: flex;
    .blue-logo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      float: left;
      margin-right: 40px;
    }

    .add-more-people {
      .add-mores {
        background-size: 100%;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: inline-block;
        vertical-align: top;
        margin-left: -12px;

        &:hover {
          background: rgba(5, 20, 34, 0.2);
        }
      }
      .add-more-icon {
        width: 16px;
        margin: 13px 0 10px 20px;
      }
    }
  }
  .horizontal-line {
    margin-top: -17px;
    border-bottom: 1px solid #dee2ed;
  }

  .button-modal {
    margin-left: 30px;
  }

  .edit-costomer-profile {
    width: 40px;
    height: 40px;
    position: absolute;
    bottom: 13px;
    left: 98px;
    padding: 8px;
    border-radius: 50%;
    background: white;
    border: 1px solid rgba(46, 91, 255, 0.08);
    cursor: pointer;
    box-shadow: 0 2px 12px 0 rgba(46, 56, 77, 0.5);
  }

  @media only screen and (max-width: 768px) {
    .button-modal {
      margin-left: 0;
    }
  }

  @media only screen and (max-width: 991px) {
    padding: 20px 100px 20px 10px;
  }
  @media only screen and (max-width: 768px) {
    padding: 20px 100px 20px 10px;
    .brand-title {
      .blue-logo {
        width: 80px;
        height: 80px;
        margin-right: 10px;
      }

      h1 {
        font-size: 28px;
      }
      .add-more-people {
        .add-mores {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  @media only screen and (max-width: 540px) {
    padding: 20px 100px 20px 10px;
    .brand-title {
      .blue-logo {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }

      h1 {
        font-size: 20px;
      }
      .add-more-people {
        .add-mores {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
`;

export const Detail = styled.div`
 margin-top: 15px;
 
  .view-details {
    padding-bottom: 15px;
    .label {
      color: ${Theme.gray30};
      font-size: ${Theme.extraSmall};
      letter-spacing: 1.13px;
      padding-bottom: 0;
      font-family: ${Theme.titleFontFamily};
      text-transform: uppercase;
    }
    
    #copyMsg {
      position: absolute;
      background: ${Theme.black};
      padding: 2px 4px;
      font-size: ${Theme.extraSmall};
      top: 37px;
      left: 162px;
      border-radius: 3px;
      color: ${Theme.white};
    }

    .agreement-service {
      color: ${Theme.gray90};
      font-size: ${Theme.normal};
      text-transform: capitalize;
      font-weight:600;
      float:left;
      line-height: 22px;
      max-width: 335px;
      
    }
    .view-link {
      color: ${Theme.orange};
      font-family: ${Theme.titleFontFamily};
      font-size: 15px;
      float:right;
      padding: 9px 20px 0 0;
      text-decoration: underline;
      cursor:pointer;
    }

    .info {
      color: ${Theme.gray90};
      font-size: ${Theme.normal};
      line-height: 22px;
      min-height: 25px;
      padding-top:5px;
      font-weight:600;

      &.link {
        color: ${Theme.orange};
        font-family: ${Theme.titleFontFamily};
        font-size: 15px;
        text-decoration: underline;
      }

      ul {
        list-style-type:none;
        padding:0;
        margin:0;
      

        li{
         margin-right:10px;
          display:inline-block;
          &:last-child {
            margin-right:0;
          }


          .social-media {
            width:16px;
          }
        }
      }
    }
    .card-img {
      vertical-align:bottom;
      width:20px;
    }
  }

    
  .heading{
    color: ${Theme.gray30};
    letter-spacing: 1.13px;
    text-transform: uppercase;
    font-family: ${Theme.titleFontFamily};
    font-size: ${Theme.extraSmall};
  }
   

  .cont-info {
    font-size: 15px;
    color: ${Theme.gray90};


    img {
      vertical-align: bottom;
      width: 16px;
      margin-right: 4px;
    }
  }

  .no-contact {
    font-size: 16px;
    color:${Theme.gray90};

    img {
      vertical-align: middle;
      width: 35px;
      margin-right: 12px;
    }
  }
  .contact-user {
    float-left;

    img {
     border-radius: 100%;
     width: 48px;
     height: 48px;
      float: left;
      margin-right:10px;
    }

    .user-name {
      font-size: ${Theme.medium};
      line-height: 20px;
      color:${Theme.gray90};
    }
    span {
      font-size: ${Theme.small};
      color: ${Theme.gray35};
    }
  }

  .attachment {
    float:left;
     padding:10px;
     width: 235px;
     border: 1px solid ${Theme.white};

   .attach-file{
      width: 42px;
      float:left;
    }
   

    .document {
      float:left;
      margin-left: 10px;
      .doc-file{
        color: ${Theme.gray90};
        font-size: 17px;   
      }
       .download {
          width: 18px;
          display:none;
        }

        span {
          font-size:13px;
        }
    }

    &:hover {
      box-shadow: ${Theme.commonShadow};
      border: 1px solid ${Theme.gray9};

      .download {
        width: 0px;
        display: block;
        margin-top: -17px;
        padding-left: 45px;
        float: right;

          img {
            width:25px;
         }
      }
    }
    &:focus {
      box-shadow: ${Theme.commonShadow};
      border: 1px solid ${Theme.gray9};

      .download {
        width: 0px;
        display: block;
        margin-top: -17px;
        padding-left: 30px;
        float: right;

          img {
            width:25px;
            cursor:pointer;
          }
      }
    }
  }

  @media only screen and (min-width: 1700px) and (max-width: 1920px) { 
    margin-top: 25px;
  .view-details {
    padding-bottom: 15px;
    .label { 
        font-size: ${Theme.extraSmallRes};
    }
     .agreement-service {
     font-size: ${Theme.normalRes};
     max-width: 435px;
    }
    .view-link {
       font-size: ${Theme.normalRes};
    }

    .info {
       font-size: ${Theme.normalRes};

      &.link {  
       font-size: ${Theme.normalRes};
      }
    }
  }
  .heading{
    font-size: ${Theme.extraSmallRes};
  }
   
  .cont-info {
     font-size: ${Theme.normalRes};
  }
  .contact-user {

    .user-name {
      font-size: ${Theme.mediumRes};
    }
    span {
      font-size: ${Theme.smallRes};
    }
  }

  
  .attachment {
    float:left;
     padding:10px;
     width: 300px;
     border: 1px solid ${Theme.white};

   .attach-file{
      width: 42px;
      float:left;
    }
   

    .document {
      float:left;
      margin-left: 10px;
      .doc-file{
        color: ${Theme.gray90};
        font-size: ${Theme.mediumRes};
      }
       .download {
          width: 18px;
          display:none;
        }

        span {
           font-size: ${Theme.smallRes};
        }
    }

    &:hover {
      box-shadow: ${Theme.commonShadow};
      border: 1px solid ${Theme.gray9};

      .download {
        width: 0px;
        display: block;
        margin-top: -17px;
        padding-left: 75px;

          img {
            width:28px;
         }
      }
    }
  }
`;

export default global;
