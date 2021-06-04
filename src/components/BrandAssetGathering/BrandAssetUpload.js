import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';
import queryString from 'query-string';
import ReactTooltip from 'react-tooltip';
import Select from 'react-select';

import Theme from '../../theme/Theme';
import {
  GrayCheckIcon,
  ArrowRightBlackIcon,
  GrayInfoIcon,
  LeftArrowIcon,
  BannerBg,
} from '../../theme/images';
import { Button, CheckBox } from '../../common';
import { PATH_BRAND_ASSET, PATH_CUSTOMER_DETAILS } from '../../constants';
import { BrandSteps } from '../../constants/FieldConstants';

const viewOptions = [
  { value: 'Brand Logo', label: 'Brand Logo' },
  { value: 'Brand Guidelines', label: 'Brand Guidelines' },
  { value: 'Font Files', label: 'Font Files' },
  { value: 'Iconography', label: 'Iconography' },
  { value: 'Additional Brand Material', label: 'Additional Brand Material' },
];

export default function BrandAssetUpload() {
  const history = useHistory();
  const { id } = useParams();
  const params = queryString.parse(history.location.search);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    setSelectedStep(BrandSteps.find((op) => op.key === params.step));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.step]);

  return (
    <>
      <BackToStep>
        {' '}
        <div className="container-fluid">
          {' '}
          <div className="row">
            <div className="col-12">
              <div
                role="presentation"
                className="back-link"
                onClick={() =>
                  history.push(PATH_CUSTOMER_DETAILS.replace(':id', id))
                }>
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
      <div className="container-fluid">
        <BrandAssetSideBar className="d-none d-lg-block">
          <div className="label-heading mb-3">Your BrandSteps</div>
          <ul className="asset-check-list">
            {BrandSteps.map((item) => (
              <li
                className="cursor"
                key={item.key}
                role="presentation"
                onClick={() =>
                  history.push({
                    pathname: PATH_BRAND_ASSET.replace(':id', id),
                    search: `step=${item.key}`,
                  })
                }>
                {/* if step complete show this
              <img className="checked-gray" src={OrangeCheckMark} alt="check" /> and add active class to item.labe and file upload */}
                <img className="checked-gray" src={GrayCheckIcon} alt="check" />
                <div className="check-list-item">
                  <div className="check-list-label">{item.label}</div>
                  <div className="check-list-file-uploaded">
                    0 files uploaded
                  </div>
                </div>
                {item.key === params.step ? (
                  <img
                    className="active-arrow-icon"
                    src={ArrowRightBlackIcon}
                    alt="arrow"
                  />
                ) : (
                  ''
                )}
                <div className="clear-fix" />
              </li>
            ))}
          </ul>
        </BrandAssetSideBar>
        <DropDownBrandAsset>
          <Select
            options={viewOptions}
            className="customer-dropdown-select d-lg-none d-block mb-3 "
          />
        </DropDownBrandAsset>

        <BrandAssetBody>
          {' '}
          <div className="label-heading">
            Part {selectedStep && selectedStep.step}/5
          </div>
          <h3 className="page-heading ">
            {selectedStep && selectedStep.label}
          </h3>
          <p className="normal-text mt-1 mb-0">
            {selectedStep && selectedStep.subtitle}
          </p>
          <p className="gray-normal-text mt-1">
            Preferred format: {selectedStep && selectedStep.format}{' '}
            <img
              className="gray-info-icon"
              width="15px "
              src={GrayInfoIcon}
              alt=""
              data-tip
              data-for="format"
            />
            <ReactTooltip place="bottom" id="format">
              <p>All Accepted Formats</p>
              ai, .eps, .png, .jpg or .gif
            </ReactTooltip>
          </p>
          <input type="file" />
          <ul className="Image-container">
            <li>
              <CheckBox className="selected-img mt-4">
                <label
                  className="check-container customer-pannel"
                  htmlFor="add-addendum">
                  <input type="checkbox" id="add-addendum" />
                  <span className="checkmark" />
                  <CheckSelectImage>
                    {' '}
                    <img className="checked-gray" src={BannerBg} alt="check" />
                  </CheckSelectImage>
                </label>
              </CheckBox>
            </li>
            <li>
              <CheckBox className="selected-img mt-4">
                <label
                  className="check-container customer-pannel"
                  htmlFor="add-img">
                  <input type="checkbox" id="add-img" />
                  <span className="checkmark" />
                  <CheckSelectImage>
                    {' '}
                    <img className="checked-gray" src={BannerBg} alt="check" />
                  </CheckSelectImage>
                </label>
              </CheckBox>
            </li>
          </ul>
        </BrandAssetBody>
      </div>

      <BrandAssetFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-right">
              <span className="skip-step">Skip this step</span>
              <Button className="btn-primary ">Next Step</Button>
            </div>
          </div>
        </div>
      </BrandAssetFooter>
    </>
  );
}

const BrandAssetBody = styled.div`
  padding-left: 400px;
  margin-top: 100px;

  .gray-info-icon {
    vertical-align: bottom;
    margin-left: 3px;
  }
  .Image-container {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      margin-right: 20px;
    }
  }
  @media only screen and (max-width: 991px) {
    padding-left: 0px;
    margin-top: 50px;
  }
`;

const BrandAssetSideBar = styled.div`
  background-color: #f4f6fc;
  border-radius: 15px;
  max-width: 340px;
  position: fixed;
  top: 145px;
  left: 20px;
  padding: 20px;
  width: 100%;
  height: 70%;
  bottom: 90px;

  .asset-check-list {
    list-style-type: none;
    padding: 0;
    marging: 0;
    li {
      margin-bottom: 15px;

      .check-list-item {
        float: left;
        word-break: break-all;
        width: 76%;
        .check-list-label {
          color: ${Theme.black};
          font-size: ${Theme.normal};
          padding-bottom: 2px;
          &.active {
            font-weight: 600;
          }
        }
        .check-list-file-uploaded {
          font-size: ${Theme.extraNormal};
          color: ${Theme.gray40};
          &.active {
            color: ${Theme.orange};
          }
        }
      }
      .checked-gray {
        overflow-wrap: break-word;
        text-align: left;
        float: left;
        width: 16px;
        margin-right: 10px;
        margin-top: 12px;
      }
      .active-arrow-icon {
        width: 20px;
        float: right;
        margin-top: 11px;
      }
    }
  }
`;
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

const BrandAssetFooter = styled.div`
  border: 1px solid ${Theme.gray7};
  bottom: 0px;
  background: ${Theme.white};
  position: fixed;
  min-height: 60px;
  z-index: 2;
  width: 100%;
  padding: 8px 0;

  .skip-step {
    color: #556178;
    font-size: 14px;
    margin-right: 20px;
  }
`;

const CheckSelectImage = styled.div`
  background-color: #f4f6fc;
  border-radius: 8px;
  width: 170px;
  height: 170px;
  position: relative;
  img {
    width: 170px;
    height: 170px;
    border-radius: 8px;
  }
  .selected-img {
    position: absolute;
    top: 5px;
    left: 5px;
  }
`;

const DropDownBrandAsset = styled.div`
  margin-top: 100px;

  .css-yk16xz-control {
    background: #f4f6fc;
    border: none;
  }
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
`;
