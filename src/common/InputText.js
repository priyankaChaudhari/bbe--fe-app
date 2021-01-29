import styled from 'styled-components';
import Theme from '../theme/Theme';

const InputText = styled.input`
  &.form-control {
    color: ${Theme.gray35};
    border: 1px solid ${Theme.gray10};
    border-radius: 5px;
    padding: 4px 10px;
    display: block;
    width: 100%;
    height: 38px;
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 8px;
    &::placeholder {
      color: ${Theme.gray30};

      font-size: 13px;
    }

    &:focus {
      outline: none;
    }
  }
`;

export default InputText;
