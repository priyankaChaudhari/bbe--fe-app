import styled from 'styled-components';
import Theme from '../theme/Theme';

const ToggleButton = styled.div`
  .days-container {
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray45};
    border-radius: 18px;
    max-width: 243px;
    float: right;
    width: fit-content;
    &.spending {
      max-width: fit-content;
      .days-tab {
        li {
          label {
            padding: 7px 10px;
          }
        }
      }
    }

    .days-tab {
      list-style-type: none;
      padding: 0;
      margin: 0;
      #daysCheck:checked + label,
      #weeklyCheck:checked + label,
      #monthlyCheck:checked + label,
      #positive:checked + label,
      #negative:checked + label,
      #contribution:checked + label,
      #keyMetrics:checked + label,
      #overspending:checked + label,
      #underspending:checked + label {
        background-color: ${Theme.white};
        border: 1px solid ${Theme.orange};
        border-radius: 18px;
        color: ${Theme.orange};
      }

      li {
        display: inline-block;

        label {
          color: ${Theme.black};
          padding: 7px 19px;
          font-size: 14px;
          display: inline-block;
          cursor: pointer;
        }
      }
    }
  }
`;

export default ToggleButton;
