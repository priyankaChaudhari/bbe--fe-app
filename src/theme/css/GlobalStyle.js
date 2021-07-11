// globalStyles.js
import { createGlobalStyle } from 'styled-components';
import Theme from '../Theme';
import NoahBold from '../fonts/Noah/Noah/WEB/Noah-Bold.woff';
import NoahRegular from '../fonts/Noah/Noah/WEB/Noah-Regular.woff';
import NoahRegularItalic from '../fonts/Noah/Noah/WEB/Noah-RegularItalic.woff';
import NoahBoldItalic from '../fonts/Noah/Noah/WEB/Noah-BoldItalic.woff';
import ArialBold from '../fonts/arial-mt-cufonfonts-webfont/ARIALMTEXTRABOLD.woff';
import ArialRegular from '../fonts/arial-mt-cufonfonts-webfont/ARIALMTMEDIUM.woff';
import HelveticaRegular from '../fonts/Helvetica-Font/Helvetica.ttf';
import HelveticaBold from '../fonts/Helvetica-Font/Helvetica-Bold.ttf';
import { CalendarFontBackArrow } from '../images/index';
// import theme from '@amcharts/amcharts4/themes/dataviz';

const bodyStyles = createGlobalStyle`

  @font-face {
    font-family: 'Noah-Bold';
    src: url(${NoahBold});
  }  
   @font-face {
    font-family: 'Noah-Regular';
    src: url(${NoahRegular});
  } 
  @font-face {
    font-family: 'Noah-RegularItalic';
    src: url(${NoahRegularItalic});
  } 
  
  @font-face {
    font-family: 'Noah-BoldItalic';
    src: url(${NoahBoldItalic});
  } 
  @font-face {
    font-family: 'Arial-Bold';
    src: url(${ArialBold});
  } 
  @font-face {
    font-family: 'Arial-Regular';
    src: url(${ArialRegular});
  } 

   @font-face {
    font-family: 'Helvetica-Regular';
    src: url(${HelveticaRegular});
  } 

   @font-face {
    font-family: 'Helvetica-Bold';
    src: url(${HelveticaBold});
  } 

html,
#root {
  height: 100%;
}

body {
  color: ${Theme.gray35};
  font-family: ${Theme.baseFontFamily};
  font-size: ${Theme.normal};
  background-color: ${Theme.white};
  height: 100%;
  margin: 0;
  
}

.common-header-sticky {
  padding-top: 70px;
}

.header-hide {
  padding-top:0;
}

.x-hellosign-embedded__modal-content {
  max-width: 1500px !important;
}
.m-signer-mobile {
  max-width: 2000px !important;
}
.is-desktop.is-embedded .m-signer-mobile {
  width: 100% !important;
  max-width: 100% !important;
}
.is-desktop .m-signer-mobile {
  max-width: 100% !important;
}

// .page-is-loading {
//   width: 100%;
//   height: 100%;
//   position: fixed;
//   top: 0;
//   left: 0;
//   text-align: center;
//   z-index: 9999;
//   background: rgba(255, 255, 255, 0.6);
// }

// .loader-outer {
//   position: relative;
//   z-index: 999;
//   padding-top: calc(20%);
//   text-align: center;
// }

.container-fluid {
  height: 100%;
}

.container {
  max-width: 1248px !important;
  width: 100% !important;
  margin: 0 auto !important;
  @media only screen and (min-width: 1600px) and (max-width: 1920px) {
    max-width: 1450px !important;
    width: 100% !important;
    margin: 0 auto !important;
  }
  @media only screen and (min-width: 1920px) {
    max-width: 100% !important;
    margin: 0 auto !important;
    padding-left: 75px !important;
  }
  @media only screen and (min-width: 991px) and (max-width: 1400px) {
    padding-left: 75px !important;
  }
}
.main-container {
   width: 100% !important;
   margin-right: -15px;
  margin-left: -15px;
}

.on-boarding-container {
  width: 100% !important;
  margin: 0 auto !important;

  .sticky {
    position: fixed;
    background-color: ${Theme.white};
    z-index: 2;
    width: 100%;
    border-bottom: 1px solid ${Theme.gray5};
  }
  .customer-pdf {
    margin-left: 0px !important;
  }
 
  
  }
  @media only screen and (max-width: 991px) {
    .sticky {
      padding-left: 28px;
      margin-left: 0 !important;
    }
  }
}


h1 {
  font-size: ${Theme.largeTitleFontSize};
  font-family: ${Theme.titleFontFamily};
  color: ${Theme.darkGreen};
  margin: 0;

  span {
    background-color: ${Theme.darkGreen};
    padding: 0px 4px;
    font-size: ${Theme.extraSmall}; !important;
    vertical-align: middle;
    font-family: ${Theme.titleFontFamily};
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    color: ${Theme.white};
    border-radius: 4px;
    letter-spacing: 1.21px;
    margin-left: 10px;

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
  }
  @media only screen and (min-width: 1700px) {
    font-size: ${Theme.largeTitleFontSizeRes};
  }
}

//  k-b start

h2 {
  font-size: ${Theme.pageTitleFontSize};
  color: ${Theme.gray90}; 

  &.primary-heading {
    font-size: ${Theme.primaryTitleFontSize};
    font-family: ${Theme.baseFontFamily};
    font-weight: 500;
  }

  &.primary-sub-heading {
    font-size: ${Theme.secondaryTitleFontSize};
    font-family: ${Theme.baseFontFamily};
    font-weight: 300;
    line-height: 32px;
  }
  &.ghq-card-content__medium-heading {
    color: ${Theme.gray90};
    font-size: ${Theme.title};
    font-family: ${Theme.baseFontFamily};
  }
}

h3 {
  font-size: ${Theme.MediumTitleFontSize};
  font-family: ${Theme.titleFontFamily};
  margin: 0;
  color: ${Theme.black};
  text-transform: capitalize;

  &.gray-text {
    color: ${Theme.gray90};
    font-family: ${Theme.baseFontFamily};
  }
}

h4 {
  font-size: ${Theme.small};
  font-family: ${Theme.titleFontFamily};
  margin: 0;
  color: ${Theme.gray90};
  text-transform: uppercase;
  letter-spacing: 1.21px;

  &.on-boarding {
    color: ${Theme.black};
    letter-spacing: 1.21px;
  }
}

h5 {
  font-size: ${Theme.smallTitleFontSize};
  font-family: ${Theme.baseFontFamily};
  font-weight: 600;
  margin: 0;
  color: ${Theme.gray90};

  @media only screen and (min-width: 1700px) and (max-width: 1920px) {
    font-size:  ${Theme.smallTitleFontSizeRes};
  }
}
h6 {
  color: ${Theme.gray90};
  font-size: ${Theme.title};
  font-family: ${Theme.baseFontFamily};
  margin: 0;
}

.ghq-card-content__horizontal-rule {
  display: block;
  &:first-of-type {
    display: none;
  }
}

.ghq-card-content__video-responsive-wrapper {
  .ghq-card-content__video {
    width: 90%;
    height: 400px;
  }
  @media only screen and (min-width: 1600px) and (max-width: 1920px) {
    .ghq-card-content__video {
      width: 90%;
      height: 500px;
    }
  }
}

.remove-author > .ghq-card-content__paragraph {
  display: block;
  &:first-of-type {
    display: none;
  }
}

.black-heading-title {
  font-size: ${Theme.extraMedium}; 
  color: ${Theme.black};
  font-family: ${Theme.baseFontFamily};
  font-weight: 600;
}
.normal-text {
  color: ${Theme.black};
  font-size: ${Theme.normal};
}

p {
  font-size: ${Theme.small};

  &.black-heading-title {
    font-size: ${Theme.extraMedium}; 
    color: ${Theme.black};
    font-family:${Theme.baseFontFamily};
    font-weight: 600;
  }

  &.basic-text {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
    margin: 0;
  }

  &.normal-text {
    color: ${Theme.black};
    font-size: ${Theme.normal};
  }

  &.no-result-found {
    color: ${Theme.gray40};
    font-size: ${Theme.normal};
  }

  &.gray-normal-text {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
  }

  &.long-text {
    color: ${Theme.black};
    font-size: ${Theme.extraMedium}; 
    line-height: 24px;
    margin: 1rem 0 !important;
    p {
      font-size: ${Theme.extraMedium}; 
      margin: 0;
    }
  }

  &.text-detail {
    color: ${Theme.gray90};
    font-size: ${Theme.extraMedium}; 
    line-height: 24px;
    font-weight: 500;
  }

  &.ghq-card-content__paragraph {
    color: ${Theme.gray90};
    font-size: ${Theme.extraMedium}; 
    line-height: 24px;
    font-weight: 300;

    .ghq-card-content__bold {
      font-weight: lighter;
    }
  }

  &.text-detail-modal {
    font-size: ${Theme.title};
    color: ${Theme.gray90};
  }

  &.gray-text {
    color: ${Theme.gray90};
    font-size: ${Theme.extraMedium}; 
  }
  &.extra-bold {
    color: ${Theme.gray90};
    font-size: ${Theme.normal};
    .link-url {
      font-size: ${Theme.extraNormal};
      color: ${Theme.orange};
      text-transform: initial;
      text-decoration: underline;
    }
  }

  span {
    // font-weight: 800;
    // font-family: ${Theme.boldArialTextFontFamily};
    &.input-field {  
      font-weight: 400;
      font-family: ${Theme.regularArialTextFontFamily};
    }
  }

  &.small-para {
    color: ${Theme.gray35};
    line-height: 16px;
  }

  .input-contact-value {
    .form-control {
      text-align: center;
      color: ${Theme.black};
      padding: 8px 30px;
      &::placeholder {
        text-align: center;
        color: ${Theme.black};
        text-transform: uppercase;
      }
    }
  }

  .radio-container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: ${Theme.extraMedium};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .radio-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmark-radio {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2};
    border-radius: 50%;
  }

  .radio-container:hover input ~ .checkmark-radio {
    background-color: #ccc;
  }

  .radio-container input:checked ~ .checkmark-radio {
    background-color: ${Theme.white};
  }

  .checkmark-radio:after {
    content: '';
    position: absolute;
    display: none;
  }

  .radio-container input:checked ~ .checkmark-radio:after {
    display: block;
  }

  .radio-container .checkmark-radio:after {
    top: 4px;
    left: 4px;
    width: 15px;
    border: 1px solid ${Theme.gray2};
    height: 15px;
    border-radius: 50%;
    background: ${Theme.black};
  }

  .container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    color: ${Theme.gray90};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &.contract-sign {
      color: ${Theme.gray35};
    }

    &.additional-place {
      color: ${Theme.black};
      font-size: ${Theme.extraMedium}; 
      font-family: ${Theme.regularArialTextFontFamily};  
    }
  }

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray9};
  }

  .container:hover input ~ .checkmark {
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray9};
  }

  .container input:checked ~ .checkmark {
    background-color: rgba(224, 231, 255, 0.2);
  }

  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  .container input:checked ~ .checkmark:after {
    display: block;
  }

  .container .checkmark:after {
    left: 9px;
    top: 3px;
    width: 6px;
    height: 12px;
    border: solid ${Theme.gray35};
    border-width: 0 2px 2px 0;

    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  @media only screen and (min-width: 1700px) and (max-width: 1920px) {
    font-size: ${Theme.smallRes};

    &.long-text {
      font-size: ${Theme.extraMediumRes}; 
    }

    &.gray-text {
      font-size: ${Theme.extraMediumRes}; 
    }
  }
}
.public-DraftStyleDefault-block {
  margin: 0 !important;
  min-height: 22px !important;
  color: ${Theme.black};
}

.public-DraftStyleDefault-block {
  margin: 0 !important;
  min-height: 24px !important;
  color: ${Theme.black};
}

a {
  color: ${Theme.orange};
  text-decoration: none;
  text-transform: capitalize;
  font-size: ${Theme.normal};
  font-family: ${Theme.baseFontFamily};
  word-break: break-all;
  &:hover {
    text-decoration: none;
  }
  &.enter-details {
    color: ${Theme.gray60};
    text-decoration: underline;
    font-family: ${Theme.boldArialTextFontFamily};
    font-size: ${Theme.extraMedium}; 
  }

  .external-link-icon {
    width: 18px;
    vertical-align: middle;
    margin-left: 7px;
  }
  &.back-customer-list {
    color: ${Theme.black} !important;
    font-size: ${Theme.normal};
  }
}

.link {
  font-size: ${Theme.normal};
  font-weight: 500;
  color: ${Theme.gray30};
  text-decoration: none;
  cursor: pointer;
  text-transform: none;
}

.back-link {
  color: ${Theme.black}; 
  font-size: ${Theme.extraNormal};
  font-weight: 600;
  cursor: pointer;
  display: contents;

  .arrow-back-icon {
    width: 15px;
    margin-right: 8px;
    vertical-align: text-bottom;
  }
}

.table-responsive {
  width: 100%;
  margin-bottom: 15px;
  overflow-x: auto;
  min-height: 0.01%;
  outline: none;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
  text-align: -webkit-right;
}

.text-left {
  text-align: left;
}
.text-lg-right {
   @media only screen and (min-width: 992px)  {
     text-align: right;
     text-align: -webkit-right;
   }
}
.text-md-left {
   @media only screen and (max-width: 991px)  {
     text-align: left;
     text-align: -webkit-left;
   }
}
.text-md-right {
   @media only screen and (max-width: 991px)  {
     text-align: right;
     text-align: -webkit-right;
   }
}
.text-sm-left {
   @media only screen and (max-width: 767px)  {
     text-align: left;
     text-align: -webkit-left;
   }
}
.text-sm-right {
   @media only screen and (max-width: 767px)  {
     text-align: right;
     text-align: -webkit-right;
   }
}

.w-100 {
  width: 100% !important;
}
.w-auto {
  width: auto !important;
}

.w-sm-100 {
   @media only screen and (max-width: 767px)  {
     width: 100% !important;
   }
}

.h-100 {
  height: 100% !important;
}

.float-left {
  float: left !important;
}

.float-right {
  float: right !important;
}

.clear-fix {
  clear: both;
}

.cursor {
  cursor: pointer !important;
}

button.disabled,
button:disabled {
  opacity: 0.45;
  cursor: not-allowed !important;
  color: ${Theme.white};
  background-color: ${Theme.gray25};
  border-color: ${Theme.gray25};
}

.edit-profile {
  background-color: rgba(224, 231, 255, 0.2);
  border: 1px solid ${Theme.gray10};
  border-radius: 100%;
  width: 48px;
  height: 48px;
}

.edit-profile-text {
  display: flex;
  align-items: center;
  flex-direction: row;
}
.straight-line {
  width: 100%;
  border-bottom: 4px solid ${Theme.gray4};

  &.sidepanel {
    border-bottom: 1px solid ${Theme.gray4};
    // padding: 18px 0;
  }
  &.horizontal-line {
    border-bottom: 1px solid ${Theme.gray4};
  }
}

.ReactModal__Overlay {
  background: rgba(5, 20, 34, 0.8) !important;
  z-index: 999;
}

.ReactModal__Content.ReactModal__Content--after-open {
  // max-width: 600px !important;
  // width: 100% !important;
  border: 0 !important;
  border-radius: 8px !important;
  overflow: unset !important;
  padding: 0 !important;

  .cross-icon {
    width: 32px;
    padding: 12px 14px 0 0;
  }

  .modal-body {
    padding: 25px 32px 30px 32px;
  }

  .edit-profiles {
    font-size: ${Theme.smallRes}
    color: ${Theme.black};
    font-family: ${Theme.titleFontFamily};
    text-transform: uppercase;
    letter-spacing: 1.21px;
  }

  @media only screen and (max-width: 610px) {
    // width: 90% !important;
    overflow: hidden;

    .modal-body {
      padding: 20px 15px;
    }
  }

  @media only screen and (max-width: 540px) {
    // min-height: 550px;
    overflow-x: hidden;
  }
}

fieldset {
  border-radius: 5px;
  padding: 18px 8px 18px 8px;
  border: 1px solid ${Theme.gray10};
  border-left: 2px solid ${Theme.orange};

  &.shape-without-border {
    background-color: ${Theme.white};
    padding: 13px 15px;
    border: 1px solid ${Theme.gray25};
    border-radius: 8px;
  }
  &.extra-radius {
      border-radius: 15px;
  }
}

.css-26l3qy-menu {
  z-index: 9999999 !important;
  position: absolute;
  color: ${Theme.gray90};
  font-size: ${Theme.normal};

  .react-select__option {
    cursor: pointer;
    text-align: left;
  }
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background-color: ${Theme.white};
  border-radius: 3px;
  position: absolute;
  user-select: none;
  opacity: 0;
  transition: opacity 300ms ease-in-out 0s;
}
::-webkit-scrollbar-thumb {
  position: absolute;
  user-select: none;
  opacity: 0;
  transition: opacity 300ms ease-in-out 0s;
  background-color: ${Theme.white};
}

.readMoreText {
  color: ${Theme.orange} !important;
  font-size: ${Theme.normal};
  font-family: ${Theme.titleFontFamily};
  cursor: pointer;
}

.__react_component_tooltip {
  top: 222px;
  border-radius: 4px;
  padding: 8px !important;

  strong {
    color: ${Theme.white};
    text-transform: uppercase;
    font-size: ${Theme.small};
    letter-spacing: 1.21px;
    line-height: 16px;
    text-align: center;
    font-family: ${Theme.titleFontFamily};
  }

  p {
    margin: 0;
    text-align: center;
    color: ${Theme.white};
    font-size:  ${Theme.verySmall};
  }
}

.react-datepicker-wrapper {
  width: 100%;
}
.react-date-picker__wrapper {
  border: none !important;

  .react-date-picker__button {
    padding: 6px;
    svg {
      width: 16px !important;
      height: 16px !important;
      stroke: ${Theme.gray90} !important;
      stroke-width: 1 !important;
    }
    &:focus {
      background-color: #eceff7 !important;
      padding: 6px;
      border-radius: 50%;
      outline: none;
    }
  }
}

.react-date-picker__calendar {
  z-index: 99999 !important;
  right: 0 !important;
  left: unset !important;
  bottom: unset !important;

  .react-calendar {
    border: 1px solid ${Theme.gray10};

    .react-date-picker__inputGroup__input {
      color: ${Theme.gray90} !important;
      font-family: ${Theme.baseFontFamily};
      font-weight: 600;
      font-size: ${Theme.normal};

      &:focus {
        outline: none;
      }
    }

    .react-calendar__tile--active {
      background: ${Theme.orange};
      border-radius: 50%;
      width: 30px;
      height: 45px;
    }
    .react-calendar__tile--now {
      background-color: #e6e6e6;
      border-radius: 50%;
      width: 30px;
      height: 45px;
    }

    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background-color: #e6e6e6;
      border-radius: 50%;

      height: 45px;
    }
    .react-calendar__tile {
      max-width: 100%;
      text-align: center;
      padding: 1.2em 0.85em;
    }
  }
}

.react-calendar__tile:disabled {
  color: ${Theme.black};
}

.react-calendar__navigation button[disabled] {
  color: ${Theme.black};
}

.croped-img {
  height: 480px;
  width: 560px;
  img {
    margin: 0 auto;
    height: 70%;
    top: 20%;
  }
}

.crop-cantainer-img {
  height: 480px;
  width: 560px;

  img {
    width: 70%;
    margin: 0 auto;
    height: 100%;
  }
}

// .checkbox input:checked ~ label:before {
//   background-image: url(../images/icons/checkmark.svg);
//   background-repeat: no-repeat;
//   z-index: 2;
//   background-position-y: 10px;
//   background-position-x: 10px;
//   content: '';
// }
// .checkbox input {
//   display: none;
// }

// .checkbox label:before {
//   display: inline-block;
//   background-color: ${Theme.orange};
//   opacity: 0.800000011920929;
//   border-radius: 100%;
//   width: 48px;
//   position: absolute;
//   top: 21px;
//   left: 15px;
//   height: 48px;
// }

// .checkbox {
//   width: 100%;
// }
// .checkbox label {
//   cursor: pointer;
// }
// .checkbox label:hover::before {
//   background-color: $orange-color;
//   opacity: 0.800000011920929;
// }

// .disableCheck {
//   opacity: 0.4;
//   cursor: not-allowed;
// }

// .react-select__option--is-focused:not(.react-select__option--is-selected) {
//   background-color: #f9faff;
// }
.avatarName {
  border-radius: 50%;
  text-align: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${Theme.lightOrange};
  background: ${Theme.lightOrange};
  color: ${Theme.black};
  text-transform: Uppercase;
  display: inline-block;
  font-size: ${Theme.extraMedium};
  font-weight: 600;
  padding-top: 10px;
  margin-top: -2px;

  &.dropdown-avartName {
    width: 28px;
    height: 28px;
    padding-top: 5px;
    font-size: ${Theme.extraSmall};

    span {
      line-height: 0;
      padding-left: 10px;
      min-height: 0;
    }
  }

  &.team-avatarName {
    margin-left: -10px !important;
    width: 36px;
    height: 36px;
    padding: 7px;
    &:first-child {
      margin-left: 0;
    }
  }
}

.annotation {
  border-radius: 50%;
  text-align: center;
  width: 36px;
  height: 36px;
  border: 4px solid ${Theme.white};
  background: ${Theme.lightOrange};
  color: ${Theme.black};
  text-transform: Uppercase;
  display: inline-block;
  font-size: ${Theme.extraMedium};
  font-weight: 600;
  padding-top: 5px;
  margin-top: -2px;

   @media only screen and (max-width: 768px) {
      width: 28px;
      height: 28px;
      border: 2px solid ${Theme.white};
      font-size: ${Theme.verySmall};
      padding-top: 4px;
      margin-top: -2px;
    }
  }
}
.annotationNone {
  width: 40px;
  height: 40px;
  
}
.react-calendar__month-view__days__day--weekend {
  color: ${Theme.black};
}

.react-date-picker__calendar .react-calendar .react-calendar__tile--now {
  color: ${Theme.black};
}

.react-date-picker__calendar .react-calendar .react-calendar__tile--active {
  color:${Theme.white};
}

.arrow-icon {
  width: 13px;
  margin-right: 5px;
  vertical-align: baseline;
  cursor: pointer;
}

.ck.ck-editor__main > .ck-editor__editable {
  height: 200px !important;
}
// .ReactCollapse--content {
//   max-width: 335px;

//   @media only screen and (max-width: 991px) {
//     max-width: 100%;
//   }
//   @media only screen and (min-width: 1500px) {
//     max-width: 380px;
//   }
// }

.text-container {
  padding-right: 368px;
  padding-left: 30px;
  font-family: ${Theme.contactregularFontFamily};
  padding-top: 60px;
  background-color: ${Theme.gray3};
  margin-top: 0 !important;

  #agreement,
  #statement,
  #addendum,
  #dspAddendum {
    background: ${Theme.white};
    padding: 30px 40px 40px 40px;
    box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.1);
    margin-top: 35px;
  }

  @media only screen and (min-width: 1500px) {
    padding-right: 430px;
  }
  @media only screen and (max-width: 991px) {
    padding-right: 20px;
    padding-left: 20px;
    margin-top: 40px;

    .long-text h3 {
      font-size: 22px !important;
    }

    p.long-text {
      font-size: ${Theme.extraNormal}; !important;
    }
  }
  @media only screen and (max-width: 768px) {
    padding-right: 10px;
    padding-left: 10px;
  }

  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    @media only screen and (max-width: 991px) {
      padding-top: 150px;
    }
  }
}

// .address {
//   font-size: small;
//   color: #b0bac9;
//   font-weight: bold;
// }

.ReactModal__Body--open {
  overflow-y: hidden;
}

.__react_component_tooltip {
  text-transform: capitalize;
  font-size: 12px;
  font-weight: 400;
}

.contract_td {
  border: 1px solid ${Theme.black};
  padding: 10px;
}

.one-time {
  width: 14px;
  position: absolute;
  right: 30px;
  top: 16px;

  &.save {
    right: 14px;
  }
}

.capitalize {
  text-transform: capitalize;
}

.success-msg-pop-up {
  top: 0px;
  position: fixed;
  left: 40%;
  z-index: 3;

  &.contract {
    left: 45%;
  }
}

.blinkSelectedField {
  animation: blinker 1s linear infinite;
  color: ${Theme.orange};
}
@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

// .slider {
//   position: absolute;
//   cursor: pointer;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: #ccc;
//   -webkit-transition: 0.4s;
//   transition: 0.4s;
// }

// .slider:before {
//   position: absolute;
//   content: '';
//   height: 15px;
//   width: 15px;
//   left: 2px;
//   bottom: 4px;
//   background-color: white;
//   -webkit-transition: 0.4s;
//   transition: 0.4s;
// }

// input:checked + .slider {
//   background-color: #2196f3;
//   right: 1px;
//   width: 40px;
//   height: 22px;
// }

// input:focus + .slider {
//   box-shadow: 0 0 1px #2196f3;
// }

// input:checked + .slider:before {
//   -webkit-transform: translateX(22px);
//   -ms-transform: translateX(22px);
//   transform: translateX(22px);
// }

// /* Rounded sliders */
// .slider.round {
//   border-radius: 34px;
// }

// .slider.round:before {
//   border-radius: 50%;
// }

.disabled {
  opacity: 0.6;
  cursor: not-allowed !important;
  pointer-events: none !important;
}
.disabled-tab {
  opacity: 0.2;
  cursor: not-allowed !important;
  pointer-events: none !important;
}

.disabled-slider-btn {
   opacity: 0.4;
  cursor: not-allowed !important;
}

.DraftEditor-editorContainer {
  padding: 0 10px;
  font-family: ${Theme.contactregularFontFamily} !important;
  font-weight: 300 !important;
  line-height: 24px;

  p span {
    font-weight: 300 !important;
  }
}

.react-pdf__Page__canvas {
  display: block;
  user-select: none;
  margin: 0 auto !important;
}

.react-pdf__Page__textContent {
  box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.1);
  margin-bottom: 20px;
  // top: 52% !important;
}
.react-pdf__message .react-pdf__message--error {
  text-align: center !important;
}

.react-pdf__Document {
  width: 100% !important;
  background-color: ${Theme.gray3} !important;
  padding-right: 345px;
  // padding-top: 60px !important;
  // padding-bottom: 30px !important;

  .react-pdf__Page {
    background-color: ${Theme.gray3}  !important;

    & .pdf-view {
      margin-top: 35px !important;
      width: 100% !important;
      background-color: ${Theme.gray3} !important;
    }

    .react-pdf__Page__canvas {
      top: 52% !important;
    }
    &:first-child {
      top: 95px !important;
      margin-bottom: 120px !important;
    }
  }
  @media only screen and (min-width: 1500px) {
    padding-right: 400px;
  }
  @media only screen and (max-width: 991px) {
    padding-left: 0px !important;
    padding-right: 0;
    margin-top: 50px;
     .react-pdf__Page {
        &:first-child {
          top: 110px !important;
          margin-bottom: 135px !important;
        }
     }
  }
  @media only screen and (max-width: 767px) {
     .react-pdf__Page {
        &:first-child {
          top: 145px !important;
          margin-bottom: 165px !important;
        }
     }
  }
}

#ResumeContainer {
  margin: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.PDFDocument {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.PDFPageOne {
  margin-bottom: 25px;
}

.Toastify__toast-container--top-center {
  top: -4px;
  .Toastify__toast {
    color: ${Theme.green};
    background: ${Theme.lightGreen};
    padding: 9px 25px 11px 25px;
    border-radius: 0 0 4px 4px;
    font-weight: 500;
    text-align: center;
    font-size: ${Theme.small};
    font-family: ${Theme.baseFontFamily};
    min-height: 0;
    // display: inline-block;

    &.Toastify__toast--error {
      color: ${Theme.red};
      background-color: #fbf2f2;
    }
  }

  .Toastify__toast-body {
    padding: 0;
    margin: 0 auto;
  }
  .Toastify__close-button {
    right: 0;
    display: none;
  }
}
.Toastify__toast-container {
  min-width: 100px;
  width: auto !important;
  padding: 0;
}

// g .recharts-cartesian-grid-horizontal {
//   display: none;
// }

// g .recharts-cartesian-grid-vertical {
//   border: 1px solid #f1f1f5;
//   stroke-dasharray: 0;

//   line {
//     stroke: #f1f1f5;
//     outline: 1px solid #f1f1f5;
//   }
// }
// g .recharts-cartesian-axis-ticks {
//   color: #556178;
//   font-size: ${Theme.normal};
// }

// g .recharts-layer .recharts-line-dots {
//   color: red;
// }

.recharts-legend-wrapper {
  bottom: 20px !important;
  top: 0 !important;
  width: auto !important;
  display: none;

  .recharts-default-legend {
    text-align: left !important;
    li.recharts-legend-item {
      border-radius: 2px;
      width: -1px;
      height: 14px;
      margin-right: 25px !important;

      &.legend-item-0 {
        .recharts-surface {
          background:  ${Theme.baseColor};

          border-radius: 2px;
          path {
            fill: none !important;
            stroke: none !important;
          }
        }
      }
      &.legend-item-1 {
        .recharts-surface {
          background-color: ${Theme.gray25};
          border-radius: 2px;
          path {
            fill: none;
          }
        }
      }
    }
  }
}

.recharts-tooltip-wrapper {
  .recharts-default-tooltip {
    background-color: ${Theme.gray90} !important;
    color: ${Theme.white} !important;
    width: 146px !important;
    min-height: 70px !important;
    border-radius: 4px;
  }
  .recharts-tooltip-label {
    color: ${Theme.gray8} !important;
    padding-bottom: 5px;
    font-size: ${Theme.verySmall};
    text-transform: uppercase;
    font-family: ${Theme.titleFontFamily};
  }

  .recharts-tooltip-item-list {
    .recharts-tooltip-item {
      color: ${Theme.white} !important;
      padding-top: 0;
      font-size: ${Theme.extraMedium}
    }
    .recharts-tooltip-item {
      color: ${Theme.gray25} !important;
      padding: 0 !important;
    }
  }
}

.total-service-bordless {
  font-weight: 500;
  border-bottom: hidden !important;
  padding: 7px 13px;
}

.react-daterange-picker__wrapper {
  display: flex;
  flex-grow: 1;
  min-height: 39px;
  padding: 7px 11px 7px 0;
  flex-shrink: 0;
  border-radius: 18px;
  align-items: center;
  border: 1px solid #dee2ed;

  .react-daterange-picker__button {
    padding: 6px;
    svg {
      width: 16px !important;
      height: 16px !important;
      stroke: ${Theme.gray90} !important;
      stroke-width: 1 !important;
    }
    &:focus {
      background-color: #eceff7 !important;
      padding: 6px;
      border-radius: 50%;
      outline: none;
    }
  }
}
.rdrCalendarWrapper {
  font-family: ${Theme.baseFontFamily};
  width: 100%;
  .rdrMonthAndYearPickers {
    color: ${Theme.black};
    font-size: ${Theme.extraNormal};
    text-transform: uppercase;
    text-align: center;
    font-family: ${Theme.baseFontFamily};
  }
  .rdrDay {
    font-size: ${Theme.normal};
    color: ${Theme.black} !important;

    .rdrDayNumber span {
      color: ${Theme.black};
    }
  }
  .rdrDayToday .rdrDayNumber span:after {
    content: '';
    position: absolute;
    top: 10px;
    left: 73%;
    border-radius: 50% !important;
    width: 6px;
    border-radius: 25px;
    height: 6px;
    background: ${Theme.orange};
  }

  .rdrMonth {
    width: 100%;
    padding: 0;
  }
  .rdrSelected,
  .rdrInRange,
  .rdrStartEdge,
  .rdrEndEdge {
    background: currentColor;
    position: absolute;
    top: 5px;
    left: -1px !important;
    right: 0;
    bottom: 5px;
  }
  .rdrWeekDays {
    .rdrWeekDay {
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
    }
  }
}
.rdrDayHovered {
  color: rgb(255, 89, 51) !important;
  .rdrDayStartPreview {
    color: rgb(255, 89, 51) !important;
  }
  span {
    color: rgb(255, 89, 51) !important;
  }
}

.rdrDayHovered.rdrDayStartPreview ~ .rdrDayNumberHovered span,
.rdrDay .rdrDayInPreview ~ .rdrDayNumber span,
.rdrDayHovered .rdrSelectedHovered ~ .rdrDayNumberHovered span {
  color: ${Theme.orange} !important;
  background-color: ${Theme.white};
}
.rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
.rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
.rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span,
.rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span {
  color: rgba(255, 255, 255, 0.85) !important;
}

.recharts-tooltip-wrapper {
  width: 146px;
  // min-height: 70px;
  background: ${Theme.gray90};
  border-radius: 5px;
}
.custom-tooltip {
  padding: 10px;
  .main-label {
    color: ${Theme.gray8};
    text-transform: uppercase;
    font-size: ${Theme.verySmall};
    margin: 0;
    padding-bottom: 8px;
  }
  .label-1 {
    color: ${Theme.white};
    font-size: ${Theme.extraMedium};
    margin: 0;
    padding-bottom: 3x;
    font-weight: 500;
  }
  .label-2 {
    color: ${Theme.gray25};
    font-size: ${Theme.extraNormal};
    margin: 0;
    font-weight: 300;
  }
}

.rdrPprevButton i {
  background-image: url(${CalendarFontBackArrow}) !important;
  border-width: 0;
  border-color:${Theme.white};
  background-repeat: no-repeat;
  z-index: 9999999999;
  background-position-y: 0;
  background-position-x: 7px;
  padding: 7px 10px;
}
.rdrNextButton i {
  background-image: url(${CalendarFontBackArrow}) !important;
  border-width: 0;
  border-color: ${Theme.white};
  background-repeat: no-repeat;
  z-index: 9999999999;
  background-position-y: 0;
  background-position-x: 7px;
  padding: 7px 10px;
  transform: rotate(180deg);
}

.rdrNextPrevButton {
  background: ${Theme.white};

  &:hover {
    background: ${Theme.white};
  }
}

text.cust-label-avg {
  background-color: ${Theme.gray25}!important;
  border-radius: 1px !important;
  width: 38px !important;
  height: 24px;
  color: ${Theme.black};
}

.loader-bar {
  top: 70px !important;
  height: 4px !important;
  // position: sticky !important;
  z-index: 3 !important;
  background: ${Theme.gray4} !important;
  div {
    div {
      box-shadow: none !important;
    }
  }
}
.common-unauthorized-header-sticky {
  padding-top: 10px;
}
.scroll-x-axis {
  margin-left: 15px;
  margin-right: 15px;
}
.isDisabled {
  opacity: 0.6;
  cursor: not-allowed !important;
  pointer-events: none !important;
}
.progress-bar-value  {
  color: ${Theme.black};
  font-size: ${Theme.normal};
  progress[value] {
    height: 4px;
    position: relative;
    border-radius: 1px;
    right: 120px;
    text-align: right;
    -webkit-appearance: none;
    appearance: none;
  }
  progress[value]::-webkit-progress-bar {
    background: #D8D8D8;
    border-radius: 1px;
  }
  progress[value]::-webkit-progress-value { 
    background-color: #FF4817;
  }
  .progress-range-text {
    position: absolute;
    right: 20px;
    top: 6px;
  }
   @media only screen and (max-width: 767px)  {
      progress[value] { 
        right: 0;
        width: 75%;
      }
   }
   @media only screen and (max-width: 550px)  {
      progress[value] { 
        right: 0;
        width: 60%;
      }
   }
}
 .uploading-progress-bar {
    text-align: center;
    margin-top: 5px;

    progress[value] {
      height: 4px;
      position: relative;
      border-radius: 10px;
      width: 120px;
      -webkit-appearance: none;
      appearance: none;
    }
    progress[value]::-webkit-progress-bar {
      background: #d8d8d8;
      border-radius: 10px;
    }
    progress[value]::-webkit-progress-value {
      background-color: #ff4817;
      border-radius: 10px;
    }
  }

.label-heading {
   color: ${Theme.gray40};
   font-size:${Theme.verySmall};
   text-transform: uppercase;
   font-weight: bold;
}

.react-sweet-progress {
    /* display: flex; */
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px 15px;
}
.react-sweet-progress-line-inner {
    position: relative;
    min-height: 4px;
    border-radius: 100px;
    transition: width 0.3s ease;
}

// .right-side-nav {
//   list-style-type: none;
//   padding: 0;
//   margin: 0;

//   li{
//     display: inline-block;
//     width: 32.3%;
//     margin-right: 1%;

//     &:last-child {
//       margin-right: 0;
//     }
//   }
//    @media only screen and (max-width: 991px)  {
//     li{
//       display: inline-block;
//       width: 48%;
//       margin-right: 1%;

//       &:last-child {
//         margin-right: 0;
//       }
//    }
//   }
// }

 

`;
export default bodyStyles;
