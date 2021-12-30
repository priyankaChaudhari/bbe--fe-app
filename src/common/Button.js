import styled from 'styled-components';
import Theme from '../theme/Theme';

const Button = styled.button`
  cursor: pointer;
  padding: 9px 10px;
  font-family: ${Theme.titleFontFamily};
  font-size: ${Theme.normal};
  pointer-events: all;
  min-height: 40px;

  &.btn-primary {
    background-color: ${Theme.baseColor};
    color: ${Theme.white};
    border: 1px solid ${Theme.baseColor};
    width: 200px;

    &:hover {
      color: ${Theme.white};
      background-color: ${Theme.secondaryColor};
    }

    &:focus {
      outline: none;
      border: none;
      background-color: ${Theme.secondaryColor};
    }
    &.btn-disabled {
      background-color: ${Theme.gray25};
      color: ${Theme.white};
      border: ${Theme.gray25};
    }
    .btn-icon {
      vertical-align: middle;
    }
  }

  &.btn-transparent {
    background-color: ${Theme.white};
    padding: 9px 5px;
    border: 1px solid ${Theme.gray35};
    color: ${Theme.black};
    font-weight: 600;
    word-break: keep-all;

    &.view-contract {
      font-size: ${Theme.extraNormal};
      border: 1px solid ${Theme.gray35};
    }

    .file-contract-icon {
      vertical-align: text-top;
      width: 15px;
      margin-right: 5px;
    }

    &.create-addendum {
      padding: 9px 15px;
      min-height: 40px;
      border: 2px solid ${Theme.gray35};
      font-size: 14px;
    }
    &.verify-now-btn {
      font-size: 13px;
      padding: 5px 15px;
      color: ${Theme.gray90};
      border-radius: 2px;
      width: 120px;

      &.h-30 {
        min-height: 30px;
        font-family: ${Theme.baseFontFamily};
      }
    }

    &:focus {
      outline: none;
    }
  }
  &.font-style-regular {
    font-family: ${Theme.baseFontFamily};
    font-weight: 500;
  }

  &.btn-add {
    background-color: rgba(255, 89, 51, 0.05);
    border-style: dotted;
    border: 2px dotted ${Theme.baseColor};
    color: ${Theme.orange};

    text-align: center;
    &:focus {
      outline: none;
    }
  }

  &.btn-borderless {
    color: ${Theme.gray90};
    border: none;
    background: transparent;
    font-weight: bold;

    &.contract-btn {
      color: ${Theme.black};
    }

    &:focus {
      outline: none;
    }
  }

  &.btn-gray {
    background: ${Theme.gray25};
    color: ${Theme.white};
    width: 200px;
    border: none;
    &.on-boarding {
      padding: 10px 30px;
    }
    &:focus {
      outline: none;
      background-color: ${Theme.baseColor};
    }
    &:hover {
      outline: none;
      background-color: ${Theme.baseColor};
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: ${Theme.gray25};
    }
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.light-orange {
    background: ${Theme.lightOrange};
    border: none;
    color: ${Theme.orange};
    padding: 10px;

    &.on-boarding {
      padding: 10px 30px;
      width: 200px;
    }
    img {
      vertical-align: bottom;
      width: 18px;
      margin-right: 7px;
    }

    &:focus {
      outline: none;
    }
    &:hover {
      outline: none;
    }
  }

  &.btn-add-contact {
    border: none;
    background: transparent;
    color: ${Theme.orange};
    font-size: ${Theme.small};
    cursor: pointer;
    padding: 0;

    .add-new-icon {
      vertical-align: top;
      width: 16px;
    }

    &:focus {
      outline: none;
    }
  }
  &.btn-with-radius {
    border-radius: 17px;
    background-color: ${Theme.baseColor};
    color: ${Theme.white};
    border: 1px solid ${Theme.baseColor};
    width: 180px;
    padding: 9px;

    &.gray-btn {
      background-color: rgba(224, 231, 255, 0.2);
      border: 1px solid ${Theme.gray2};
      color: ${Theme.black};
      width: 155px;
      a {
        color: ${Theme.black};
      }
    }

    &:focus {
      outline: none;
    }
  }
  &.btn-orange-border {
    border: 1px solid ${Theme.baseColor};
    color: ${Theme.orange};
    background-color: ${Theme.white};
    padding: 9px 20px;
  }
  &.w-50 {
    width: 200px;
  }
  &.w-25 {
    width: 130px;
  }
  &.w-90 {
    width: 260px;
  }

  &.on-boarding {
    padding: 9px 15px;
    min-height: 40px;
  }
  &.w-25 {
    width: 130px;
  }

  &.w-10 {
    width: 110px;
  }

  @media only screen and (max-width: 1200px) {
    &.upload-asset {
      width: 152px;
    }
  }
  @media only screen and (max-width: 450px) {
    &.invoice-adjustment {
      width: 100%;
    }
  }
`;

export default Button;
