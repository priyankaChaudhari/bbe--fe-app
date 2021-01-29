import styled from 'styled-components';
import Theme from '../theme/Theme';

const InputSelect = styled.div`
  width: 100%;

  label {
    color: ${Theme.gray30};
    font-size: 12px;
    letter-spacing: 1.13px;
    text-transform: uppercase;
    font-weight: bold;
  }

  .css-yk16xz-control {
    color: ${Theme.gray90};
    border: 1px solid ${Theme.gray10};
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 5px;

    .css-g1d714-ValueContainer {
      color: ${Theme.gray30};
      font-size: 13px;

      .css-1wa3eu0-placeholder {
        color: ${Theme.gray30};
        font-size: 13px;
        text-transform: none;
      }
    }

    &:hover {
      border: 1px solid ${Theme.gray10};
    }
  }

  .css-1pahdxg-control {
    box-shadow: none;
    margin-top: 5px;
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray10} !important;
    outline: none;
  }
`;

export default InputSelect;
