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
    border: 1px solid ${Theme.gray2};
    background-color: rgba(224, 231, 255, 0.2);
    margin-top: 5px;

    .css-g1d714-ValueContainer {
      color: ${Theme.gray30};
      font-size: 15px;

      .css-1wa3eu0-placeholder {
        color: ${Theme.gray30};
        font-size: 15px;
        text-transform: none;
      }
    }
    .css-1hwfws3 {
      font-size: 15px;
    }

    &:hover {
      border: 1px solid ${Theme.gray2};
    }
  }

  .css-1pahdxg-control {
    box-shadow: none;
    margin-top: 5px;
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2} !important;
    outline: none;
    font-size: 15px;
  }
`;

export default InputSelect;
