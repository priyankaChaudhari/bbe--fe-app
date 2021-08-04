/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import {
  UnauthorizedHeader,
  OnBoardingBody,
  CheckBox,
  Button,
} from '../../common';

import Theme from '../../theme/Theme';
import {
  DefaultUser,
  LeftArrowIcon,
  OrangeCheckMark,
  SecurityLock,
} from '../../theme/images';
import { getRequestedProducts } from '../../api';

export default function UploadProductAsset() {
  const [productAsset, setProductAsset] = useState({});
  const location = useLocation();
  const splittedPath =
    location && location.pathname && location.pathname.split('/');

  useEffect(() => {
    getRequestedProducts(splittedPath && splittedPath[4]).then((res) => {
      setProductAsset(res && res.data);
    });
  }, []);

  return (
    <div>
      {' '}
      <UnauthorizedHeader />) : (
      <BackToStep>
        {' '}
        <div className="container-fluid">
          {' '}
          <div className="row">
            <div className="col-12">
              <div role="presentation" className="back-link">
                <img
                  src={LeftArrowIcon}
                  alt="aarow-back"
                  className="arrow-back-icon "
                />
                Back to Dashboard
              </div>
            </div>
          </div>
        </div>{' '}
      </BackToStep>
      )
      <OnBoardingBody className="grey-bg-asset pb-3">
        <div className="white-card-base  pb-4 ">
          <h3 className="page-heading ">Upload Your Product Assets</h3>

          <CheckBox className="mt-1 mb-4">
            <label className="check-container customer-pannel " htmlFor="step">
              Ask someone else to complete this section
              <input
                className="checkboxes"
                type="checkbox"
                id="step"
                readOnly
              />
              <span className="checkmark" />
            </label>
          </CheckBox>
          <div className="complete-steps mt-3">
            You’ll need the following to complete this step:
          </div>
          <ul className="account-steps-check">
            <li>
              <img src={OrangeCheckMark} alt="check" />
              Imagery for the{' '}
              {productAsset &&
                productAsset.products &&
                productAsset.products.length}{' '}
              products listed below
            </li>
            <li>
              <img src={OrangeCheckMark} alt="check" /> Any Instructions/specs
              for those products
            </li>
          </ul>
          <ul className="upload-product-asset">
            {productAsset &&
              productAsset.products &&
              productAsset.products.length &&
              productAsset.products.map((item) => (
                <li>
                  <div className="product-asset-image">
                    <img src={DefaultUser} alt="product" />
                  </div>
                  <div className="image-title">
                    <p className="product-asset-title recurring-service mt-0  mb-0">
                      {item.title}
                    </p>
                    <p className="product-asset-subtitle m-0">{item.asin}</p>
                  </div>
                </li>
              ))}

            {/* <li>
              <div className="product-asset-image">
                <img src={DefaultUser} alt="product" />
              </div>
              <div className="image-title">
                <p className="product-asset-title recurring-service mt-0  mb-0">
                  Threadmill Home Linen Twin Blanket - 1 Piece Herring…
                </p>
                <p className="product-asset-subtitle m-0">B000000001</p>
              </div>
            </li>
            <li>
              <div className="product-asset-image">
                <img src={DefaultUser} alt="product" />
              </div>
              <div className="image-title">
                <p className="product-asset-title recurring-service mt-0  mb-0">
                  Threadmill Home Linen Twin Blanket - 1 Piece Herring…
                </p>
                <p className="product-asset-subtitle m-0">B000000001</p>
              </div>
            </li> */}
          </ul>
          <Button className="btn-primary w-100 mb-2 mt-3">Continue</Button>
          <p className="info-text-gray security-lock text-center  mb-0">
            <img width="16px" src={SecurityLock} alt="lock" />
            <span>
              {' '}
              All files will be stored securely and never shared with a 3rd
              party.
            </span>
          </p>
        </div>
      </OnBoardingBody>
    </div>
  );
}

const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 2;
  top: 70px;
  padding: 22px 0px 18px 0px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};

  .skip-steps {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    cursor: pointer;
  }
`;
