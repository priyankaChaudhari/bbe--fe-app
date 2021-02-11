import styled from 'styled-components';
import Theme from '../theme/Theme';

const ErrorMsg = styled.div`
  color: ${Theme.red};
  font-size: ${Theme.small};
  padding: 0;
  margin: 0 0 0 0;

  a {
    text-transform: lowercase;
    text-decoration: underline;
    color: ${Theme.red};
    font-size: ${Theme.small};
  }
`;
export default ErrorMsg;
