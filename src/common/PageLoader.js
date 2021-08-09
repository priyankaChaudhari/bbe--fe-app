import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const PageLoaderWrapper = styled.div`
  position: fixed;
  z-index: 999;
  height: 55px;
  width: 55px;
  overflow: visible;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  &.sidebar-loader {
    left: unset;
    right: 0;
    top: 40px;
    margin-right: 150px;
    svg {
      width: 40px;
      height: 40px;
    }
  }
  &.upload-brand-asset {
    left: 340px;
  }
  &.Notes-modal-loader {
    margin-right: 250px;
  }
  @media only screen and (min-width: 1500px) {
    &.sidebar-loader {
      right: 0;
      top: 40px;
      margin-right: 160px;
    }
  }
  @media only screen and (max-width: 991px) {
    &.sidebar-loader {
      top: 0;
      left: 0;
      margin: auto;
      right: 0;
    }
    &.modal-loader {
      right: 0%;
    }
    &.upload-brand-asset {
      left: 0 !important;
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
  top: 570px;
  left: 40%;
  bottom: 0;
  right: 0;

  &.customer-details {
    top: -140px;
    position: relative;
    left: 0;
  }
  &.agrement-details {
    top: 140px;
    position: relative;
    left: 0;
  }
  &.performance-graph {
    top: 30px;
    position: relative;
    left: 0;
    width: 60px;
    margin: 0 auto;
  }

  @media only screen and (max-width: 991px) {
    left: 0;
  }
`;
const SideBarLoader = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding: 0;
  position: relative;
  vertical-align: baseline;
  top: 50%;
`;

const ButtonLoaderCss = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding: 0;
  vertical-align: baseline;

  svg {
    width: 20px;
    height: 20px;
  }
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
            : component === 'agreement'
            ? 'modal-loader'
            : component === 'upload-brand-asset'
            ? 'upload-brand-asset'
            : component === 'Notes-modal-loader'
            ? 'Notes-modal-loader'
            : ''
        }
        style={{
          top: component === 'member' ? '120px' : '',
          width: component === 'activityLog' ? '50px' : '',
          // right: component === 'agreement' ? '14%' : '',
          position: component === 'activity' ? 'absolute' : '',
          // left: component === 'customer-list-loader' ? '290px' : '',
          left:
            component === 'social'
              ? '110px'
              : component === 'customer-list-loader'
              ? '290px'
              : '',
        }}>
        <Loader type="Bars" color={color} height={height} width={pageWidth} />
      </PageLoaderWrapper>
    );
  }
  if (type === 'detail') {
    return (
      <DetailLoaderWrapper
        className={
          component === 'customer-details'
            ? 'customer-details'
            : component === 'agrement-details'
            ? 'agrement-details'
            : component === 'performance-graph'
            ? 'performance-graph'
            : ''
        }>
        <Loader type="Bars" color={color} height={height} width={width} />
      </DetailLoaderWrapper>
    );
  }
  if (type === 'sidebar') {
    return (
      <SideBarLoader
        className={component === 'comment-side-bar' ? 'comment-side-bar' : ''}>
        <Loader type="Bars" color={color} height={height} width={width} />
      </SideBarLoader>
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
