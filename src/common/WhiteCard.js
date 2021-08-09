import styled from 'styled-components';
import Theme from '../theme/Theme';

export const WhiteCard = styled.div`
  background-color:${Theme.white};
  border-radius: 15px;
  padding: 20px ;
  position: relative;

  .green {
        color: ${Theme.lighterGreen};
      }
  
  
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
  // &.customer-brand-details {
  //   top: -30px;
  //   width: 100%;
  // }

  .company-contract-height {
   max-height: 145px;
    overflow:auto;
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
      background-color:  ${Theme.gray35};
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
     .ACH-status {
        background-color: #F1F1F5;
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
  .brand-logo-details {
    position:relative;
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

      img{
        vertical-align: middle;
        width: 17px;
        margin-left: 4px;
        width: 21px;
        margin-bottom:2px;
      }
    }
    .company-label-info {
     font-size: ${Theme.normal};
     color: ${Theme.black};
     line-height: 22px;
     

     &:first-child {
        margin-left: 0;
     }

    //  .brand-label { 
    //    color: ${Theme.gray40};
    //    float:left;
    //   }
      // span { 
      //   margin-left: 13px;
      //   color: ${Theme.black};
      //   float:left;
      //   word-break: break-word;
      //   max-width: 115px;
      //   width:100%;

      //   &.mid-width {
      //     max-width: 158px;
      //     width: 100%;

      //       &.website {
      //         margin-left: 20px;
      //       }
      //   }
      //   &.company-size{
      //     margin-left: 24px;
      //   }
      // }

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
      top: 20px;
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


  .view-all-list {
    font-size: ${Theme.extraNormal};
    color: ${Theme.gray85};
    position: absolute;
    right: 20px;
    top: 22px;
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
    display: flow-root;

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
        font-size:${Theme.extraNormal};

        .clock-icon {
          width: 14px;
          margin-right: 5px;
          vertical-align: text-top;
        }
      }
    }
  }
  // .monthly-retainer {
  //   padding: 0;
  //   margin: 0;
  //   list-style-type: none;

  //   li {
  //     display: inline-block;
  //     margin-right: 70px;
  //     color: ${Theme.black};
  //     font-size: ${Theme.normal};
  //     font-weight: 500;

  //     .label {
  //       color: ${Theme.gray40};
  //       text-transform: uppercase;
  //       line-height: 22px;
  //       font-family: ${Theme.titleFontFamily};
  //       font-size: ${Theme.verySmall};
  //       margin-bottom: 3px;
  //     }

  //     &:last-child {
  //       margin-right: 0;
  //     }
  //   }
  // }


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
      max-width: 197px;
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

        &.grey {
          color: ${Theme.gray40};
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
    width: fit-content;
    &.spending {
      max-width: fit-content;
      .days-tab { 
         li{
          label {
            padding: 7px 10px;
          }
        }
      }
    }

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

        #positive:checked + label{
          background-color: ${Theme.white};
           border: 1px solid ${Theme.orange};
           border-radius: 18px;
           color: ${Theme.orange};
         }
         #negative:checked + label{
           background-color:  ${Theme.white};
           border: 1px solid ${Theme.orange};
           border-radius: 18px;
           color:${Theme.orange};
         }
         #contribution:checked + label{
           background-color: ${Theme.white};
           border: 1px solid ${Theme.orange};
           border-radius: 18px;
           color: ${Theme.orange};
         }
         #keyMetrics:checked + label{
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
  .dsp-spent-date {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li{
      display: inline-block;
      margin-right: 20px;
    }
  }
 .rechart-item {
   list-style-type: none;
   padding: 0;
   margin: 0;

      li{
          display: inline-block;
          margin-right: 25px;
          vertical-align: middle;

          &:last-child {
            margin-right: none;
          }

          .weeks{
              display: flex;
              align-items: center;
              flex-direction: row;
          }

         
           .dashed-line {
              list-style-type: none;
              padding: 0;
              margin: 0;

              li{
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
            background:#0045B4
          };
          .adSpend { 
            background: #8C54FF
          };
          .adConversion { 
            background: #30A8BD
          };
          .impressions { 
            background: #D6A307
          };
          .adCos { 
            background: #E05D37
          };
          .adRoas { 
            background: #89A43C
          };
          .adClicks { 
            background: #C84EC6
          };
          .adClickRate { 
            background: #A04848
          };

          .revenue { 
            background:#0045B4
          };
          .unitsSold { 
            background: #8C54FF
          };
          .traffic { 
            background: #30A8BD
          };
          .conversion { 
            background: #D6A307
          };

          .dspImpressions { 
            background:#0045B4
          };
          .dspSpend { 
            background: #8C54FF
          };
          .dspTotalProductSales { 
            background: #30A8BD
          };
          .dspTotalRoas { 
            background: #D6A307
          };
          .dspTotalDpvr { 
            background: #E05D37
          };
          .dspTtlNewBrandPurchases { 
            background: #89A43C
          };
          .dspProductSales { 
            background: #C84EC6
          };
          .dspRoas { 
            background: #A04848
          };

          .darkGray{
            background: ${Theme.gray35};
            
          }
          .gray {
            background: ${Theme.gray25};
          }

          .black {
            background: ${Theme.black};
          }
          span {
             color:${Theme.black};
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
  .brand-logo-details{
    text-align: left;
  //  max-width: 350px;
  } 
   .company-label-info {

     margin-top: 10px;

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
    .dsp-spent-date {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li{
      display: inline-block;
      margin-right: 20px;

      .label-range {
        font-size: 16px;
      }
    }
  }
  .increase-rate {
    .green-arrow {
      margin-left:0;
    }
  }
     
 }
   @media only screen and (max-width: 767px) {      

    .brand-logo-details{
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
