import styled from 'styled-components';
import Theme from '../theme/Theme';

const CheckBox = styled.div`
  .container {
    display: block;
    position: relative;
    padding-left: 30px;
    margin-bottom: 12px;
    cursor: pointer;
    color: ${Theme.gray90};
    font-size: ${Theme.normal};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &.customer-pannel {
      color: #171725;
      font-size: 14px;
    }

    &.term-condition {
      font-size: ${Theme.extraSmall};
    }

    &.contract-sign {
      color: ${Theme.gray35};
    }

    &.additional-place {
      color: ${Theme.black};
      font-size: ${Theme.textFontSize};
      font-family: ${Theme.regularTextFontFamily};
    }
  }

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    width: 20px;
    height: 20px;
    border: 1px solid ${Theme.gray35};
  }

  .container:hover input ~ .checkmark {
    background-color: rgba(224, 231, 255, 0.2);
    // border: 1px solid ${Theme.gray9};
  }

  .container input:checked ~ .checkmark {
    background-color: ${Theme.orange};
    color: white;
    border: none;
  }

  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  .container input:checked ~ .checkmark:after {
    display: block;
  }

  .container .checkmark:after {
    left: 6px;
    top: 3px;
    width: 6px;
    height: 11px;
    border: solid ${Theme.white};
    border-width: 0 2px 2px 0;

    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

export default CheckBox;
