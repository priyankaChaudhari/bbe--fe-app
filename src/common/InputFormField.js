import styled from 'styled-components';
import Theme from '../theme/Theme';

const InputFormField = styled.div`
  position: relative;
  .edit-field {
    position: absolute;
    right: 0;
    top: 0px;
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};

    .edit-icon {
      vertical-align: text-top;
    }
  }

  label {
    color: ${Theme.gray40};
    font-size: ${Theme.verySmall};
    text-transform: uppercase;
    font-family: ${Theme.titleFontFamily};

    &.quartely-threshold {
      font-size: ${Theme.extraNormal};
      color: ${Theme.gray85};
      text-transform: capitalize;
      font-weight: 300;
      font-family: ${Theme.baseFontFamily};
    }
  }

  .deleteSocial {
    position: absolute;
    width: 16px;
    top: 11px;
    right: 6px;
  }

  .remove-field-icon {
    background: ${Theme.gray5};
    width: 18px;
    padding: 4px;
    border-radius: 50%;
  }
  .input-container {
    display: flex;
    width: 100%;

    .input-icon {
      padding: 12px 15px;
      border-radius: 2px 0 0 2px;
      width: 40px;
      margin-top: 7px;
      height: 40px;
      z-index: 2;
      font-size: 14px;
      text-align: center;
      color: ${Theme.gray85};
      background: #eaedf6;
      border-left: 1px solid ${Theme.gray45};
      border-top: 1px solid ${Theme.gray45} !important;
      border-bottom: 1px solid ${Theme.gray45};

      &.end {
        border-left: 0;
        border-right: 1px solid ${Theme.gray45};
        border-top: 1px solid ${Theme.gray45} !important;
        border-bottom: 1px solid ${Theme.gray45};
        border-radius: 0px 2px 2px 0;
      }

      &.error-msg {
        border-left: 1px solid ${Theme.red};
        border-top: 1px solid ${Theme.red} !important;
        border-bottom: 1px solid ${Theme.red};
        background: ${Theme.lightRed};
      }
    }

    &.form-control-error {
      border: 1px solid ${Theme.red};
      background: ${Theme.lightRed};
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .form-control {
    position: relative;
    color: ${Theme.gray85};
    border: 1px solid ${Theme.gray45};
    border-radius: 2px;
    padding: 5px 10px;
    display: block;
    width: 100%;
    height: 40px;
    background-color: ${Theme.gray8};
    margin-top: 7px;
    font-family: ${Theme.baseFontFamily};
    font-size: ${Theme.extraNormal};

    &.extra-space {
      padding: 4px 27px 4px 10px;
    }

    &::placeholder {
      color: ${Theme.gray40} !important;
      font-size: ${Theme.extraNormal};
    }

    &:focus {
      outline: none;
      border: 1px solid ${Theme.gray25};
    }

    &.form-control-error {
      border: 1px solid ${Theme.red};
      background: ${Theme.lightRed};
    }
  }

  .css-14jk2my-container {
    background-color: ${Theme.gray8};
    margin-top: 7px;
  }
`;
export default InputFormField;
