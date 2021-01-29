import styled from 'styled-components';
import Theme from '../theme/Theme';

const ModalRadioCheck = styled.div`

&.gray-bg {
  background: #f4f6fc;
  padding: 14px;
  position: relative;
  border-radius: 8px;

}
.contact-billing {
  font-size:15px !important;
  font-weight:600;
}
  
  .radio-container {
    display: block;
    position: relative;
    padding-left: 25px;

    cursor: pointer;
    color: ${Theme.gray90};
    font-family: ${Theme.baseFontFamily};
    font-size ${Theme.medium};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .delete-contact {
    width: 16px;
    right: 15px;
    position: absolute;
    top: 10px;
  }
  .edit-contact {
    width: 13px;
    right: 45px;
    position: absolute;
    top: 10px;
  }
  .owner-details {
    font-size: 13px;
    color: ${Theme.gray35}; !important;
    margin-left: 25px;
    font-weight: 300 !important;

    img {
      width: 13px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  .radio-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 16px;
    width: 16px;
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray9};
    border-radius: 50%;
  }


  // .radio-container:hover input ~ .checkmark {
  //   background-color: ${Theme.white};
  // }

  .radio-container input:checked ~ .checkmark {
    background-color: ${Theme.baseColor};
  }

  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  .radio-container input:checked ~ .checkmark:after {
    display: block;
  }

  .radio-container .checkmark:after {
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
  
 
`;

export default ModalRadioCheck;
