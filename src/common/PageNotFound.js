import React from 'react';

import styled from 'styled-components';
import { string } from 'prop-types';

import Theme from '../theme/Theme';
import PageNotFoundImg from '../theme/images/page-not-found.svg';

export default function PageNotFound({ title = 'Page not found' }) {
  return (
    <PageNotFounds>
      <img src={PageNotFoundImg} alt="not-found" />
      <h5 className="mt-3">{title}</h5>
      {title === 'Page not found' ? (
        <p className="not-found">
          The page you’re looking for can’t be found. Double check the URL and
          try again.
        </p>
      ) : null}
    </PageNotFounds>
  );
}

PageNotFound.defaultProps = {
  title: 'Page not found',
};

PageNotFound.propTypes = {
  title: string,
};

const PageNotFounds = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .not-found {
    color: ${Theme.gray90};
    font-size: 16px;
    text-align: center;
  }
`;
