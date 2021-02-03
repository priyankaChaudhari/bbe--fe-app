import styled from 'styled-components';
import Theme from '../theme/Theme';

const FormField = styled.div`

  label {
    color: ${Theme.gray30};
    font-size: 12px;
    letter-spacing: 1.13px;
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
    right: 724px;
    border-radius: 4px;
    font-size: ${Theme.small};
    padding: 7px 10px;
    top: 42px;
    font-weight:bold;
    cursor: pointer;

    &.without-info {
      top: 44px;
     right:30px;
    }
}
  

  .form-control  {
    position:relative;
    color: ${Theme.gray90};
    border: 1px solid ${Theme.gray10};
    border-radius: 5px;
    padding: 4px  10px ;
    display: block;
    width: 100%;
    height: 38px;
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 5px;
    font-family: ${Theme.baseFontFamily};
    font-size:  ${Theme.normal};
    font-weight: 600;

    

    &.info-tool{
       margin-top: 20px;
    }

    &.extra-space {
       padding: 4px 25px 4px 10px ;
    }

    &.w-80 {
      width: 85%;
      
    }
    &::placeholder {
      color: ${Theme.gray30};
      font-weight: 500;
      font-size: color: ${Theme.normal};
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
    top: 54px;
    right: 22px;
  }
  .contact-input-info {
    position: absolute;
    top: 27px;
    left: 190px;
  }
  .profilephone-input-info {
    position: absolute;
    top:130px;
    right: 22px;
  }
  
`;
export default FormField;
