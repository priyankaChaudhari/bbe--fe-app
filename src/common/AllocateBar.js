import styled from 'styled-components';
import Theme from '../theme/Theme';

const AllocateBar = styled.div`
  background: rgb(244, 246, 252);
  border-radius: 6px;
  border: 1px solid rgb(213, 216, 225);
  width: 100%;
  height: 40px;
  padding: 11px 20px;
  .remaing-label {
    color: ${Theme.gray90};
    font-size: ${Theme.extraNormal};
    float: left;

    &.text-bold {
      font-weight: bold;
    }
  }
  .allocate-balance {
    color: ${Theme.orange};
    font-size: 11px;
    text-transform: uppercase;
    font-weight: bold;
    float: right;
  }
  .orange-left-arrow {
    width: 14px;
    margin-left: 4px;
    transform: rotate(180deg);
    vertical-align: middle;
  }
`;
export default AllocateBar;
