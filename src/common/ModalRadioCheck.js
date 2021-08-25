import styled from 'styled-components';
import Theme from '../theme/Theme';

const ModalRadioCheck = styled.div`

&.gray-bg {
  background:${Theme.gray8};
  padding: 14px;
  position: relative;
  border-radius: 8px;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom:0;
  }

}
.contact-billing {
  font-size: 14px !important;
  font-weight: 500;
  color: ${Theme.gray85};

  .checkmark-top {
     top: 0px;  
   }
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

    &.customer-list {
     color:${Theme.gray85};
     font-size: 14px;
    }
   .checkmark-customer-list {
     top: 0px;  
   }
    
  }

  .delete-contact {
    width: 16px;
    right: 14px;
    position: absolute;
    top: 10px; 
  }
  .edit-contact {
    width: 12px;
    right: 55px;
    position: absolute;
    top: 12px
  }
  span.owner-details {
    font-size: 13px;
    color: ${Theme.gray35};
    margin-left: 25px;
    font-weight: 500;
    word-break: break-all;
    float: left;

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
    top: 3px;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray9};
    border-radius: 50%;
  }

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
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
  
 
`;

export default ModalRadioCheck;
