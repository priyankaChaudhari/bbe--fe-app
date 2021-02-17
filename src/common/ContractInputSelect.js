import styled from 'styled-components';
import Theme from '../theme/Theme';

const ContractInputSelect = styled.div`
  width: 100%;

  label {
    color: ${Theme.gray60};
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: bold;
  }
  .css-2b097c-container {
    .css-yk16xz-control {
      color: ${Theme.gray90};
      border: 1px solid ${Theme.gray10};
      background-color: rgba(224, 231, 255, 0.2);
      margin-top: 5px;
      min-height: 32px !important;
      font-size: color: ${Theme.small};

        .css-g1d714-ValueContainer {
          color: ${Theme.gray35};
          font-size: color: ${Theme.small};
        }
          .css-1wa3eu0-placeholder {
            color: ${Theme.gray35};
            font-weight: 500;
            font-size: color: ${Theme.small};
            text-transform: none;
          }
          .css-tlfecz-indicatorContainer {
            padding: 4px !important;
          }
      }

    .css-1pahdxg-control {
        box-shadow: none;
        min-height:32px;
        margin-top: 5px;
        background-color: rgba(224, 231, 255, 0.2);
        border: 1px solid ${Theme.gray10} !important;
        outline: none;
        font-size: ${Theme.small};

        .css-1gtu0rj-indicatorContainer {
          padding: 4px;
        }

    }
    .css-1uccc91-singleValue {
      font-size: ${Theme.small};
    }
    .css-1wa3eu0-placeholder {
      font-size: ${Theme.small};
    }
      
  }
`;

export default ContractInputSelect;
