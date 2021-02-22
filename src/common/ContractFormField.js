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
  }

  .css-14jk2my-container {
    background-color: ${Theme.gray8};
    margin-top: 7px;  
  }
  
`;
export default ContractFormField;
