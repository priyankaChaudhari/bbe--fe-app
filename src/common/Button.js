import styled from 'styled-components';
import Theme from '../theme/Theme';

const Button = styled.button`
  cursor: pointer;
  padding: 11px 10px;
  font-family: ${Theme.baseFontFamily};
  font-size: ${Theme.normal};

  &.btn-primary {
    background-color: ${Theme.baseColor};
    color: ${Theme.white};
    border: 1px solid ${Theme.baseColor};
    width: 200px;

    &.on-boarding {
      padding: 10px 15px;
    }

    &.btn-next-section {
      padding: 5px 15px;
    }

    &:hover {
      color: ${Theme.white};
      background-color: ${Theme.secondaryColor};
    }

    &:focus {
      outline: none;
      border: none;
      background-color: ${Theme.secondaryColor};
    }
    &.disabled {
      background-color: ${Theme.gray25};
      color: ${Theme.white};
      border: ${Theme.gray25};
    }
  }

  &.btn-secondary {
    background-color: ${Theme.blue};
    color: ${Theme.white};
    position: relative;
    border: 1px solid ${Theme.blue};
    width: 150px;

    &:hover {
      background-color: ${Theme.blue};
      color: ${Theme.white};
    }
    &:focus {
      outline: none;
      border: none;
    }
  }

  &.btn-transparent {
    background-color: ${Theme.white};
    padding: 11px 25px;
    border: 1px solid ${Theme.gray35};
    color: ${Theme.black};
    font-weight: 700;

    &.view-contract {
      font-size: ${Theme.extraNormal};
    }

    .file-contract-icon {
      vertical-align: text-top;
      width: 15px;
      margin-right: 5px;
    }

    &.on-boarding {
      padding: 10px 30px;
    }
    &:focus {
      outline: none;
    }
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
    text-decoration: underline;
    font-weight: bold;
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
    }
    img {
      vertical-align: bottom;
      width: 18px;
      margin-right: 10px;
    }

    &.w-90 {
      width: 260px;
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
    font-size: ${Theme.Small};
    cursor: pointer;

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

    &:focus {
      outline: none;
    }
  }
  &.w-50 {
    width: 160px;
  }
  &.w-25 {
    width: 130px;
  }

  @media only screen and (min-width: 1700px) and (max-width: 1920px) {
    font-size: ${Theme.normalRes};
    &.btn-add-contact {
      font-size: ${Theme.smallRes};
    }
  }
`;

export default Button;
