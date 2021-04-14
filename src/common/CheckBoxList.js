import styled from 'styled-components';
import { WhiteCheckMark } from '../theme/images/index';

const CheckBoxList = styled.div`
  &.reassign-brand {
    .checkbox label:before {
      display: inline-block;
      background-color: #556178;
      opacity: 0.6 !important;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      position: absolute;
      top: 13px;
      left: 15px;
    }
    .checkbox input:checked ~ label:before {
      background-image: url(${WhiteCheckMark});
      background-repeat: no-repeat;
      z-index: 2;
      background-position-y: 12px;
      background-position-x: 12px;
      content: '';
    }
  }

  .checkbox input:checked ~ label:before {
    background-image: url(${WhiteCheckMark});
    background-repeat: no-repeat;
    z-index: 2;
    background-position-y: 10px;
    background-position-x: 10px;
    content: '';
  }
  .checkbox input {
    display: none;
  }

  .checkbox label:before {
    display: inline-block;
    background-color: #ff5933;
    opacity: 0.800000011920929;
    border-radius: 100%;
    width: 48px;
    position: absolute;
    top: 21px;
    left: 15px;
    height: 48px;
  }

  .checkbox {
    width: 100%;
  }
  .checkbox label {
    cursor: pointer;
  }
  .checkbox label:hover::before {
    background-color: $orange-color;
    opacity: 0.800000011920929;
  }

  .disableCheck {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .react-select__option--is-focused:not(.react-select__option--is-selected) {
    background-color: #f9faff;
  }
`;
export default CheckBoxList;
