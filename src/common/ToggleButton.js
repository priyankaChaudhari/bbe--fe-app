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
      #dspDaysCheck:checked + label,
      #dspWeeklyCheck:checked + label,
      #dspMonthlyCheck:checked + label,
      #positive:checked + label,
      #negative:checked + label,
      #peformanceCheck:checked + label,
      #pacingCheck:checked + label,
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
          padding: 7px 18px;
          font-size: 14px;
          display: inline-block;
          cursor: pointer;
        }
      }
    }
  }
  .toggle-container {
    width: 100%;
    max-width: 280px;

    li {
      width: 50%;
      text-align: center;
    }
    .days-tab {
      width: 100%;
      #negative:checked + label,
      #positive:checked + label {
        width: 100%;
        background-color: ${Theme.white};
        border: 1px solid ${Theme.orange};
        border-radius: 18px;
        color: ${Theme.orange};
      }
    }
    @media only screen and (max-width: 767px) {
      width: 100%;
      max-width: 100%;
    }
  }
  @media only screen and (max-width: 767px) {
    .days-container {
      margin: 0 auto;
      float: none !important;
    }
  }
`;

export default ToggleButton;
