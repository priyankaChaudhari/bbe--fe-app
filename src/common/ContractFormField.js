import styled from 'styled-components';
import Theme from '../theme/Theme';

const ContractFormField = styled.div`
  position:relative;

  label {
    color: ${Theme.gray60};
    font-size: 12px;
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
    color: ${Theme.gray90};
    border: 1px solid ${Theme.gray10};
    border-radius: 5px;
    padding: 1px  10px ;
    display: block;
    width: 100%;
    height: 32px;
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 5px;
    font-family: ${Theme.baseFontFamily};
    font-size:  ${Theme.small};
    font-weight: 600;


    &.extra-space {
       padding: 4px 27px 4px 10px ;
    }

    &::placeholder {
      color: ${Theme.gray35};
      font-weight: 500;
      font-size: color: ${Theme.small};
    }

    &:focus {
      outline: none;
      border:1px solid ${Theme.gray25};
    }
  }



  .css-14jk2my-container {
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 5px;  
  }
  
  
  
  
`;
export default ContractFormField;
