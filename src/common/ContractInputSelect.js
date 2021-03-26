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
    .css-yk16xz-control {
      color: ${Theme.gray85};
      border: 1px solid ${Theme.gray45};
      border-radius: 2px;
      background-color: ${Theme.gray8};
      margin-top: 7px;
      min-height: 40px !important;
      font-size: color: ${Theme.extraNormal};
      font-weight:500;
       cursor: pointer;

        .css-g1d714-ValueContainer {
          color: ${Theme.gray85};
          font-size: color: ${Theme.extraNormal};
         
        }
          .css-1wa3eu0-placeholder {
            color: ${Theme.gray85};
            font-weight: 500;
            font-size: color: ${Theme.extraNormal};
            text-transform: none;
          }
          
          .css-tlfecz-indicatorContainer {
            padding: 4px !important;
          }
          
          &.form-control-error {
          border: 1px solid ${Theme.red} ;
          background: #FBF2F2;
      
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
        //  border: 1px solid ${Theme.red} ;
        //  background: #FBF2F2;
         cursor: pointer;
        &.form-control-error {
          border: 1px solid ${Theme.red} ;
          background: #FBF2F2;
      
        }
        .css-1gtu0rj-indicatorContainer {
          padding: 4px;
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
      
  }
`;

export default ContractInputSelect;
