import styled from 'styled-components';
import Theme from '../theme/Theme';

const ContractFormField = styled.div`
  position:relative;

  label {
    color: ${Theme.gray40};
    font-size:${Theme.verySmall};
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: bold;   
  }

  .remove-field-icon {
    background: ${Theme.gray5};
    width: 18px;
    padding: 4px;
    border-radius:50%;
  }
   .input-container {
    display: flex;
    width: 100%;

   .input-icon {
      padding: 12px 15px;
      border-radius: 2px 0 0 2px;
      width: 40px;
      margin-top: 7px;
      height: 40px;
      z-index: 2;
      font-size: 14px;
      text-align: center;
      background: #EAEDF6;
      border-left: 1px solid #D5D8E1;
      border-top: 1px solid #D5D8E1 !important;
      border-bottom: 1px solid #D5D8E1;

      &.end {
        border-left: 0;
        border-right 1px solid #D5D8E1;
        border-top: 1px solid #D5D8E1 !important;
        border-bottom: 1px solid #D5D8E1;
        border-radius: 0px 2px 2px 0;
      }
   
    }
    // .modal-input-control {
    //   width: 100%;
    //   height: 40px!important;
    //   background-color: #F4F6FC;
    //   border: 1px solid #D5D8E1!important;
    //   border-radius: 2px !important;
    //   margin-top: 7px;
    //   outline: none;
    //   font-weight: 500;
    //   font-size: 14px;

    // &::placeholder {
    //     color: ${Theme.gray40};
    //     font-weight: 500;
    //     font-size: 14px;
    //   }
    // }
  }


  .form-control  {
    position:relative;
    color: ${Theme.gray85};
    border: 1px solid #D5D8E1;
    border-radius: 2px;
    padding: 5px  10px ;
    display: block;
    width: 100%;
    height: 40px;
    background-color: ${Theme.gray8};
    margin-top: 7px;
    font-family: ${Theme.baseFontFamily};
    font-size:  ${Theme.extraNormal};

   
    &.extra-space {
       padding: 4px 27px 4px 10px ;
    }

    &::placeholder {
      color: ${Theme.gray40};
      font-size: color: ${Theme.extraNormal};
    }

    &:focus {
      outline: none;
      border:1px solid ${Theme.gray25};
    }

    &.form-control-error {
     border: 1px solid ${Theme.red} ;
     background: #FBF2F2;
  
    }
  }
  

  .css-14jk2my-container {
    background-color: ${Theme.gray8};
    margin-top: 7px;  
  }
  
`;
export default ContractFormField;
