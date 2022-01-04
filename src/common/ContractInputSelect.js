import styled from 'styled-components';
import Theme from '../theme/Theme';

const ContractInputSelect = styled.div`
  width: 100%;

  label {
    color: ${Theme.gray40};
    font-size:${Theme.verySmall};
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: bold;
   
  }
 
  .css-2b097c-container {
     margin-top: 7px;
    .css-l9nmop-control {
         height: 40px !important;
     }

     .css-6595ef-control  {
      border: 1px solid ${Theme.gray45};
      border-radius: 2px;
      background-color: ${Theme.gray8};
      margin-top: 7px;
      min-height: 40px !important;  
      height: 40px;
     }

   
    .css-yk16xz-control {
      color: ${Theme.gray85};
      border: 1px solid ${Theme.gray45};
      border-radius: 2px;
      background-color: ${Theme.gray8};
      margin-top: 7px;
      min-height: 40px !important;
      font-size:  ${Theme.extraNormal};
      font-weight:500;
       cursor: pointer;

        .css-g1d714-ValueContainer {
          color: ${Theme.gray85};
          font-size: ${Theme.extraNormal};
         
        }
          .css-1wa3eu0-placeholder {
            color: ${Theme.gray85};
            font-weight: 500;
            font-size: ${Theme.extraNormal};
            text-transform: none;
          }
          
          .css-tlfecz-indicatorContainer {
            padding: 4px !important;
          }
          
          &.form-control-error {
            border: 1px solid ${Theme.red};
            background: ${Theme.lightRed};
         }
        
      }

    .css-1pahdxg-control {
        box-shadow: none;
        min-height: 40px;
        margin-top: 7px;
        background-color: ${Theme.gray8};
        border: 1px solid ${Theme.gray45}; !important;
        border-radius: 2px;
        outline: none;
        font-size: ${Theme.extraNormal};
        font-weight:500;
        cursor: pointer;
          &.form-control-error {
            border: 1px solid ${Theme.red} ;
            background: ${Theme.lightRed};
           
            
          }
          &.form-control-error__control {
            height: 40px !important;
          }
          .css-1gtu0rj-indicatorContainer {
            padding: 4px !important;
          }
    }
    .css-1uccc91-singleValue {
       font-size: ${Theme.extraNormal};
       font-weight:500;
       color: ${Theme.gray85};
    }
    .css-1wa3eu0-placeholder {
      font-size: ${Theme.extraNormal};
      color: ${Theme.gray85};
    }
     .css-1okebmr-indicatorSeparator {
      display: none;
    }
      
  }
`;

export default ContractInputSelect;
