import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const PageLoaderWrapper = styled.div`
  position: fixed;
  z-index: 999;
  height: 80px;
  width: 55px;
  overflow: visible;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  &.sidebar-loader {
    left: unset;
    right: 65px;

    svg {
      width: 40px;
      height: 40px;
    }
  }
  @media only screen and (max-width: 991px) {
    &.sidebar-loader {
      left: unset;
      right: 50%;
      left: 50%;
    }
  }
`;

const DetailLoaderWrapper = styled.div`
  position: fixed;
  z-index: 999;
  height: 80px;
  width: 100px;
  overflow: visible;
  margin: auto;
  top: 150px;
  left: 0;
  bottom: 0;
  right: 850px;
`;

const ButtonLoaderCss = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding: 0;
  vertical-align: baseline;
`;

export default function PageLoader({
  color,
  type,
  component,
  height,
  width,
  pageWidth,
}) {
  if (type === 'page') {
    return (
      <PageLoaderWrapper
        className={
          component === 'activityLog'
            ? 'sidebar-loader'
            : component === 'modal'
            ? 'modal-loader text-center '
            : ''
        }
        style={{
          top: component === 'member' ? '120px' : '',
          left: component === 'social' ? '110px' : '',
          width: component === 'activityLog' ? '120px' : '',
          right: component === 'agreement' ? '14%' : '',
          position: component === 'activity' ? 'absolute' : '',
        }}>
        <Loader type="Bars" color={color} height={height} width={pageWidth} />
      </PageLoaderWrapper>
    );
  }
  if (type === 'detail') {
    return (
      <DetailLoaderWrapper>
        <Loader type="Bars" color={color} height={height} width={width} />
      </DetailLoaderWrapper>
    );
  }
  return (
    <ButtonLoaderCss>
      <Loader type="Bars" color={color} height={18} width={100} />
    </ButtonLoaderCss>
  );
}

PageLoader.defaultProps = {
  component: '',
  height: 80,
  width: 100,
  pageWidth: 50,
};

PageLoader.propTypes = {
  type: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  component: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  pageWidth: PropTypes.number,
};
