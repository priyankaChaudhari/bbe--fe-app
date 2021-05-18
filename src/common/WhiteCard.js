import styled from 'styled-components';
import Theme from '../theme/Theme';

export const WhiteCard = styled.div`
  background-color:${Theme.white};
  border-radius: 15px;
  padding:   20px ;
  position: relative;
  
 &.fix-height {
    flex-wrap: wrap;
    flex: initial;
    height: 100%;
  }
  .fix-height {
    flex-wrap: wrap;
    flex: initial;
    height: 100%;
  }
  &.customer-brand-details {
    top: -30px;
    width: 100%;
  }

  .company-contract-height {
   max-height: 145px;
    overflow:auto;
  }

  &.left-border {
    padding: 25px 25px 25px 0;
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
        top: 22px;
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
      cursor: pointer
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
  }

  .phone-number {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
    margin-top: 4px;
  }

  .brand-name {
    color: ${Theme.gray90};
    font-size: 32px;
    font-weight: 500;
   
    .company-name {
      margin-right: 15px;
    }
  }
   .company-status {
      background: ${Theme.darkGreen};
      border-radius: 19px;
      padding: 3px 10px;
      color: ${Theme.gray6};
      font-size: ${Theme.extraNormal};
      top: -5px;
      position:relative;
      

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

      img{
        vertical-align: middle;
        width: 17px;
        margin-left: 4px;
        width: 21px;
        margin-bottom:2px;
      }
    }

    .dropdown-content-status {
      display: none;
      position: absolute;
      width: 220px;
      box-shadow: ${Theme.commonShadow};
      padding: 0px;
      z-index:2;
      text-align: left;
      background: ${Theme.white};
      border: 1px solid ${Theme.gray9};
      border-radius:8px;
      margin-top: 8px;
      left: 20px;

      li {
        list-style-type: none;
        padding-bottom: 10px;
        font-size: ${Theme.extraMedium};
        color: ${Theme.black};
        padding: 15px ;
        cursor: pointer;
        width: 100%;
        text-align:left;

        &:hover {
          background: ${Theme.gray8};
        }
      }
  
    }
  .brand-logo {
     position:relative;
      
    img {
      border: 8px solid ${Theme.gray6};
      border-radius: 20px;
      margin-top: -65px;
      width: 170px;
      height: 170px;
      margin-left: 50px;
    }
  }

  .edit-details {
    position: absolute;
    right: 23px;
    font-size: ${Theme.extraNormal};
    color ${Theme.gray85};
    top: 22px;
    cursor:pointer;

    &.edit-brand-details {
      top:7px;
    }
    img {
      width: 16px;
      margin-right: 4px;
      vertical-align: text-top;
    }
  }
  .increase-rate {
    color: ${Theme.lighterGreen};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
    .green-arrow {
      width: 14px;
      vertical-align: middle;
      margin-left: -2px;
      margin-right: 3px;
      vertical-align: bottom;
     }
  }
  .decrease-rate {
    color: ${Theme.darkRed};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
    .red-arrow {
      width: 14px;
      transform: rotate(180deg);
      vertical-align: middle;
      margin-left: -2px;
      margin-right: 3px;
    }
  }

  .company-label-info {
     font-size: ${Theme.normal};
     margin-left: 40px;
     color: ${Theme.black};
     line-height: 22px;
     

     &:first-child {
        margin-left: 0;
     }

     .brand-label { 
       color: ${Theme.gray40};
       float:left;
      }
       span { 
          margin-left: 13px;
          color: ${Theme.black};
          float:left;
          word-break: break-word;
          max-width: 123px;
       
          width:100%;

          &.mid-width {
            max-width:170px;
            width:100%;

             &.website {
                margin-left: 20px;
              }
          }
            &.company-size{
             margin-left: 24px;
            }
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
        border-left: 3px solid  ${Theme.white};

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


  .add-new-tab {
    font-size: ${Theme.extraNormal};
    color: ${Theme.gray85};
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;

    img {
      width: 11px;
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
  }

  .recurring-contact {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      display: inline-block;
      margin-right: 17px;

      &:last-child {
        margin-right: 0;
      }
      .dot {
        background-color: #8798ad;
        border-radius: 50%;
        width: 3px;
        height: 3px;
        position: absolute;
        top: 30px;
        left: 129px;
      }

      .days-block {
        background: ${Theme.lighterOrange};
        padding: 5px 10px;
        border-radius: 5px;
        color: ${Theme.orange};
        font-size:${Theme.extraNormal};

        .clock-icon {
          width: 14px;
          margin-right: 5px;
          vertical-align: text-top;
        }
      }
    }
  }
  .monthly-retainer {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      display: inline-block;
      margin-right: 70px;
      color: ${Theme.black};
      font-size: ${Theme.normal};
      font-weight: 500;

      .label {
        color: ${Theme.gray40};
        text-transform: uppercase;
        line-height: 22px;
        font-family: ${Theme.titleFontFamily};
        font-size: ${Theme.verySmall};
        margin-bottom: 3px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .selected-list {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      background:${Theme.gray8};
      color: ${Theme.gray85};
      padding: 5px 10px;
      border-radius: 5px;
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 7px;
    }
  }

  &.activity-card {
    min-height:530px;
  }

    .order-chart-box {
      display: inline-block;
      background-color: ${Theme.white};
      border: 1px solid ${Theme.gray45};
      border-radius: 8px;
      max-width: 180px;
      width: 100%;
      padding: 18px 15px;
      cursor: pointer;

      .chart-name {
        color:${Theme.gray40};
        font-size:11px;
        text-transform: uppercase;
        font-family: ${Theme.titleFontFamily};
      }
     
      .perentage-value {
        color: ${Theme.lighterGreen};
        font-size: ${Theme.extraNormal};
        font-weight: 300;
        margin-left: -2px;

        &.down {
          color: ${Theme.darkRed};
        }
        .red-arrow{
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
          width:14px;
        }
      }

      &:last-child{
        margin-right:0;
      }

      &:hover {
        border: 1px solid ${Theme.orange};
      }

      &.active {
        border: 1px solid ${Theme.orange};
      }
      &.ad-sales-active {
        border: 1px solid #0045B4;
        .chart-name {
          color: #0045B4;
        }
      }

      &.ad-spend-active {
         border: 1px solid #8C54FF;
        .chart-name {
          color: #8C54FF;
        }
      }
      &.ad-conversion-active {
         border: 1px solid #30A8BD;
        .chart-name {
          color: #30A8BD;
        }
      }
       &.impression-active {
         border: 1px solid #D6A307;
        .chart-name {
          color: #D6A307;
        }
      }
      &.ad-cos-active {
          border: 1px solid #E05D37;
        .chart-name {
          color: #E05D37;
        }
      }
      &.ad-roas-active {
          border: 1px solid #89A43C;
        .chart-name {
          color: #89A43C;
        }
      }
       &.ad-roas-active {
          border: 1px solid #89A43C;
        .chart-name {
          color: #89A43C;
        }
      }

      &.ad-click-active {
          border: 1px solid #C84EC6;
        .chart-name {
          color: #C84EC6;
        }
      }
      &.ad-clickrate-active {
          border: 1px solid #A04848;
        .chart-name {
          color: #A04848;
        }
      }
      
    }
     .number-rate {
        color: ${Theme.gray80};
        font-size: 26px;
        padding-top: 15px;
        word-break: break-all;
        font-family:  ${Theme.baseFontFamily};
      }
       .perentage-value {
        color: ${Theme.lighterGreen};
        font-size: ${Theme.extraNormal};
        font-weight: 300;
        margin-left: -2px;

        &.down {
          color: ${Theme.darkRed};
        }
        .red-arrow{
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
          width:14px;
        }
      }
      
      .vs {
        color: ${Theme.gray40};
        font-size: ${Theme.extraMedium};
      }

  
  .days-container {
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray45};
    border-radius: 18px;
    max-width: 243px;
    float: right;

    .days-tab {
      list-style-type: none;
      padding: 0;
      margin: 0;
       #daysCheck:checked + label{
         background-color: ${Theme.white};
          border: 1px solid ${Theme.orange};
          border-radius: 18px;
          color: ${Theme.orange};
        }
        #weeklyCheck:checked + label{
          background-color:  ${Theme.white};
          border: 1px solid ${Theme.orange};
          border-radius: 18px;
          color:${Theme.orange};
        }
        #monthlyCheck:checked + label{
          background-color: ${Theme.white};
          border: 1px solid ${Theme.orange};
          border-radius: 18px;
          color: ${Theme.orange};
        }

      li{
        display: inline-block;
      
         label {
            color: ${Theme.black};
            padding: 7px 19px;
            font-size: 14px;
            display: inline-block;
            cursor: pointer;
         }

        
      }
    }
  }
 .rechart-item {
   
   list-style-type: none;
      padding: 0;
      margin: 0;

      li{
          display: inline-block;
          margin-right: 25px;

          &:last-child {
            margin-right: none;
          }

          .weeks{
              display: flex;
              align-items: center;
              flex-direction: row;
          }

          .block {
            border-radius: 2px;
            width: 14px;
            height: 14px;
            margin-right: 6px;
          }
          .orange {
            background: ${Theme.baseColor};
          }
          .gray {
            background: ${Theme.gray25};
          }
          .black {
            background: ${Theme.black};
          }
          span {
             color:${Theme.black};
             font-size: 15px;
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
    left: 85px;
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
    font-size:  ${Theme.primaryTitleFontSize}; 

    &.positive {
      color: ${Theme.lighterGreen};
    }
  }
  .seller-update {
    color:${Theme.gray40};
    font-size: 14px;
  }

  .solid-icon {
    margin-right: 10px;
    vertical-align: middle;
    float: left;
  }

  .service-icon {
    margin-right: 10px;
    vertical-align: middle;
  }

  .social-media-icons {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li{
      display:inline-block;
      vertical-align: middle;
      padding-right: 8px;

        .social-media {
          width:23px;
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
        margin-left: 40px;
        margin-top:10px;

        &:first-child {
          margin-left: 0;
        }

        span { 
            margin-left: 15px;
            max-width: 210px;
            
            &.mid-width {
              max-width: 250px;
              width:100%;

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
    }
  @media only screen and (max-width: 1150px) {
     .company-label-info {
        margin-left: 40px;
        margin-top:10px;

        &:first-child {
          margin-left: 0;
        }
          span { 
              margin-left: 15px;
              max-width: 70px;
            
              &.mid-width {
                max-width: 70px;
                width:100%;
              }
            }   
       }
   }
 @media only screen and (max-width: 991px) {
  .brand-logo {
    img{
    border-radius: 10px;
    margin-top: -93px;
    width: 100px;
    height: 100px;
    margin-bottom: 15px;
    margin-left: 5px;
    }
  } 
   .company-label-info {
     margin-left: 40px;
     margin-top:10px;

     &:first-child {
        margin-left: 0;
     }

     .brand-label { 
       margin-top:10px;
       width: 100px;
       
      }
      span { 
        margin-left: 15px;
        max-width: 210px;
        margin-top: 10px;
        

        &.mid-width {
          max-width:230px;
          width:100%;
          width: 100px;
        }

          &.company-size{
            margin-left: 18px;
          }
      }   
   }
     
   .edit-details {
      &.edit-brand-details {
        top: -25px;
      }
   }
 }
   @media only screen and (max-width: 767px) {      
     .order-chart-box { 
        max-width: 100% !important;
      }
       .days-container { 
         margin: 0 auto;
         float: none;
       }
       .rechart-item { 
          margin: 0 auto;
          text-align center;
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
     margin-left: 40px;
     margin-top:10px;

      span { 
        margin-left: 5px;
        max-width: 117px;
        margin-top: 10px;
        

        &.mid-width {
          width: 100px;
          // width:100%;

           &.website {
            margin-left: 5px;
            }
        }

          &.company-size{
             margin-left: 5px;
           }
      }   
    }
    
   }

`;
export default WhiteCard;