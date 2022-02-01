import styled from 'styled-components';
import Theme from '../theme/Theme';

const AllocateBar = styled.div`
  background: rgb(244, 246, 252);
  border-radius: 6px;
  border: 1px solid rgb(213, 216, 225);
  width: 100%;
  min-height: 40px;
  padding: 11px 13px;
  .remaing-label {
    color: ${Theme.gray90};
    font-size: ${Theme.extraNormal};
    float: left;
    /* width: 70%; */

    &.text-bold {
      font-weight: bold;
      /* width: 30%;
      float: right; */
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
  .edit-marketplace {
    color: ${Theme.orange};
    font-size: 14px;
    text-transform: capitalize;
    font-weight: 400;
    float: right;
  }
`;
export default AllocateBar;
