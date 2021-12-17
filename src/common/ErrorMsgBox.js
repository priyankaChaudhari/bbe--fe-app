import styled from 'styled-components';
import Theme from '../theme/Theme';

const ErrorMsgBox = styled.div`
  color: ${Theme.red};
  background-color: #fbf2f2;
  padding: 12px 13px 11px 13px;
  border-radius: 4px;
  font-weight: 500;
  text-align: left;
  font-size: ${Theme.extraSmall};
  font-family: ${Theme.baseFontFamily};

  .info-icon {
    width: 13px;
    margin-right: 2px;
    vertical-align: text-top;
  }
`;

export default ErrorMsgBox;
