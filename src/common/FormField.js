import styled from 'styled-components';
import Theme from '../theme/Theme';

const FormField = styled.div`
  position: relative;

  label {
    color: ${Theme.gray30};
    font-size: 12px;
    letter-spacing: 1.13px;
    text-transform: uppercase;
    font-family: ${Theme.titleFontFamily};

     &.info-tool-icon {
       position:relative;
     }

     &.modal-field{
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
      margin-bottom: 5px;
      font-family: ${Theme.titleFontFamily};
    }
  }
  .copy-link {
    position: absolute;
    background: ${Theme.lightOrange};
    color: ${Theme.orange};
    border-radius: 4px;
    font-size: ${Theme.small};
    padding: 7px 10px;
    right: 4px;
    border-radius: 4px;
    font-size: 13px;
    padding: 7px 10px;
    top: 44px;
    font-weight:bold;
    cursor: pointer;
    

    &.without-info {
      top: 44px;
     right:30px;
    }
  }

  .remove-field-icon {
    background: ${Theme.gray5};
    width: 18px;
    padding: 4px;
    border-radius:50%;
  }
  
  // .input-container {
  //   display: flex;
  //   width: 100%;

  //  .input-icon {
  //     padding: 12px 15px;
  //     border-radius: 2px 0 0 2px;
  //     width: 40px;
  //     margin-top: 7px;
  //     height: 40px;
  //     z-index: 2;
  //     text-align: center;
  //     background: #EAEDF6;
  //     border-left: 1px solid #D5D8E1;
  //     border-top: 1px solid #D5D8E1 !important;
  //     border-bottom: 1px solid #D5D8E1;

  //     &.end {
  //       border-left: 0;
  //       border-right 1px solid #D5D8E1;
  //       border-top: 1px solid #D5D8E1 !important;
  //       border-bottom: 1px solid #D5D8E1;
  //       border-radius: 0px 2px 2px 0;
  //     }
   
  //   }
  //   .modal-input-control {
  //     width: 100%;
  //     height: 40px!important;
  //     background-color: #F4F6FC;
  //     border: 1px solid #D5D8E1!important;
  //     border-radius: 2px !important;
  //     margin-top: 7px;
  //     outline: none;
  //     font-weight: 500;
  //     font-size: 14px;

  //   &::placeholder {
  //       color: ${Theme.gray40};
  //       font-weight: 500;
  //       font-size: 14px;
  //     }
  //   }
  // }

   textarea {
      min-height: 74px;
    }

  .form-control  {
    position:relative;
    color: ${Theme.gray90};
    border: 1px solid ${Theme.gray2};
    border-radius: 5px !important;
    padding: 4px  10px ;
    display: block;
    width: 100%;
    height: 38px !important;
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 5px;
    font-family: ${Theme.baseFontFamily} !important;
    font-size:  ${Theme.normal};
    font-weight: 600;
    resize: vertical;

     &::placeholder {
      color: ${Theme.gray30};
      font-weight: 500;
      font-size: color: ${Theme.normal};
    }

    &.info-tool{
       margin-top: 20px;
    }

    &.extra-space {
       padding: 4px 27px 4px 10px ;
    }

    &.w-80 {
      width: 85%;
      
    }

    &:focus {
      outline: none;
    }
     &.modal-input-control {
      position:relative;
      color: #556178;
      border: 1px solid #D5D8E1};
      border-radius: 2px;
      height: 40px;
      background-color: #F4F6FC;
      font-family: ${Theme.baseFontFamily};
      font-size:  ${Theme.normal};
     
    }
  }

   .text-area {
      position:relative;
      color: ${Theme.gray35};
      border: 1px solid ${Theme.gray2};
      border-radius: 5px;
      padding: 4px  10px ;
     
      display: block;
      width: 100%;
      background-color: rgba(224, 231, 255, 0.2);
      margin-top: 5px;
      font-family: ${Theme.baseFontFamily};
      font-size:  ${Theme.title};
      font-weight: 500;
      resize: vertical;
        &::placeholder {
          color: ${Theme.gray35};
          font-weight: 500;
          font-size: color: ${Theme.normal};
       }
        &:focus {
          outline: none;
        }
    } 
   

  .css-14jk2my-container {
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 5px;
    
  }
  .hide-icon {
    position: absolute;
    top: 34px;
    right: 14px;
  }
  .show-icon {
    position: absolute;
    top: 34px;
    right: 14px;
  }
  .hide-icons {
    position: absolute;
    top: 50px;
    right: 114px;
    cursor: pointer;
  }
  }
  .show-icons {
    position: absolute;
    top: 34px;
    right: 95px;
    cursor: pointer;
  }
  .copy-icon {
    width: 30px;
    position: absolute;
    right: 6%;
    top: 27px;
    cursor: pointer;
  }
  .info-icon {
    width: 15px;
    position: absolute;
    right: auto;
    cursor: pointer;
    top: 0px;
    margin-left: 10px;

    &.amazon {
      position: initial
    }
  }
  .phone-input-info {
    position: absolute;
    top: 37px;
    right: 10px;
  }
  .contact-input-info {
    position: absolute;
    top: 12px;
    right: 9px;
  }
  .profilephone-input-info {
    position: absolute;
    top: 36px;
    right: 15px;
  }

  
`;
export default FormField;
