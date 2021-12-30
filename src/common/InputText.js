import styled from 'styled-components';
import Theme from '../theme/Theme';

const InputText = styled.textarea`
  &.form-control {
    border: 1px solid ${Theme.gray45};
    background-color: ${Theme.gray6};
    resize: none;
    font-family: ${Theme.baseFontFamily};
    min-height: 140px;
    border-radius: 2px;
    padding: 15px;
    display: block;
    width: 100%;

    &::placeholder {
      color: ${Theme.gray40};
      font-size: ${Theme.extraNormal};
    }

    &:focus {
      outline: none;
    }
  }
`;

export default InputText;
