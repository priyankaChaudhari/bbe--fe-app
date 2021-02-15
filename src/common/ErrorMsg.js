import styled from 'styled-components';
import Theme from '../theme/Theme';

const ErrorMsg = styled.div`
  color: ${Theme.red};
  font-size: ${Theme.extraSmall};
  text-transform: lowercase;
  padding: 0;
  margin: 0 0 0 0;

  a {
    text-transform: lowercase;
    text-decoration: underline;
    color: ${Theme.red};
    font-size: ${Theme.extraSmall};
  }
`;
export default ErrorMsg;
