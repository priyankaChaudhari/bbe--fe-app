import styled from 'styled-components';
import Theme from '../theme/Theme';

const ContractInputSelect = styled.div`
  width: 100%;

  label {
    color: ${Theme.gray60};
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: bold;
  }

  .css-yk16xz-control {
    color: ${Theme.gray90};
    border: 1px solid ${Theme.gray10};
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 5px;
    min-height: 32px !important;

    .css-g1d714-ValueContainer {
      color: ${Theme.gray35};
      font-size: color: ${Theme.small};

      .css-1wa3eu0-placeholder {
        color: ${Theme.gray35};
        font-weight: 500;
        font-size: color: ${Theme.small};
        text-transform: none;
      }
    }
    .css-1hwfws3 {
      font-size: color: ${Theme.small};
    }

    &:hover {
      border: 1px solid ${Theme.gray10};
    }
    
    .react-select__option--is-focused:not(.react-select__option--is-selected){
     .css-g1d714-ValueContainer { 
       min-height:32px;
     }
    }
  }

  .css-1pahdxg-control {
    box-shadow: none;
    min-height:32px;
    margin-top: 5px;
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray10} !important;
    outline: none;
    font-size: ${Theme.small};
  }
`;

export default ContractInputSelect;
