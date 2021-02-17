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
    

     &.info-tool-icon {
       position:relative;
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

    

    &.info-tool{
       margin-top: 20px;
    }

    &.extra-space {
       padding: 4px 27px 4px 10px ;
    }

    &.w-80 {
      width: 85%;
      
    }
    &::placeholder {
      color: ${Theme.gray35};
      font-weight: 500;
      font-size: color: ${Theme.small};
    }

    &:focus {
      outline: none;
    }
  }

   .text-area {
      position:relative;
      color: ${Theme.gray35};
      border: 1px solid ${Theme.gray10};
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
    top: 50px;
    right: 25px;
  }
  .show-icon {
    position: absolute;
    top: 50px;
    right: 25px;
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
    left: 180px;
  }
  .profilephone-input-info {
    position: absolute;
    top: 106px;
    right: 15px;
  }
  
`;
export default ContractFormField;
