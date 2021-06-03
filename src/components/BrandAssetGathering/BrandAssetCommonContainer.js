import React from 'react';
import styled from 'styled-components';
import Theme from '../../theme/Theme';
import {
  GrayCheckIcon,
  ArrowRightBlackIcon,
  GrayInfoIcon,
  LeftArrowIcon,
} from '../../theme/images';
import { Button } from '../../common';

export default function BrandAssetCommonContainer() {
  return (
    <>
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
      <BrandAssetSideBar>
        <div className="label-heading mb-3">Your Checklist</div>
        <ul className="asset-check-list">
          <li>
            <img className="checked-gray" src={GrayCheckIcon} alt="check" />
            <div className="check-list-item">
              <div className="check-list-label">Brand Logo</div>
              <div className="check-list-file-uploaded">0 files uploaded</div>
            </div>
            <img
              className="active-arrow-icon"
              src={ArrowRightBlackIcon}
              alt="arrow"
            />
            <div className="clear-fix" />
          </li>
          <li>
            <img className="checked-gray" src={GrayCheckIcon} alt="check" />
            <div className="check-list-item">
              <div className="check-list-label">Brand Guidelines</div>
              <div className="check-list-file-uploaded">0 files uploaded</div>
            </div>
            <img
              className="active-arrow-icon"
              src={ArrowRightBlackIcon}
              alt="arrow"
            />
            <div className="clear-fix" />
          </li>
          <li>
            <img className="checked-gray" src={GrayCheckIcon} alt="check" />
            <div className="check-list-item">
              <div className="check-list-label">Font Files</div>
              <div className="check-list-file-uploaded">0 files uploaded</div>
            </div>
            <img
              className="active-arrow-icon"
              src={ArrowRightBlackIcon}
              alt="arrow"
            />
            <div className="clear-fix" />
          </li>
          <li>
            <img className="checked-gray" src={GrayCheckIcon} alt="check" />
            <div className="check-list-item">
              <div className="check-list-label">Iconography</div>
              <div className="check-list-file-uploaded">0 files uploaded</div>
            </div>
            <img
              className="active-arrow-icon"
              src={ArrowRightBlackIcon}
              alt="arrow"
            />
            <div className="clear-fix" />
          </li>
          <li>
            <img className="checked-gray" src={GrayCheckIcon} alt="check" />
            <div className="check-list-item">
              <div className="check-list-label">Additional Brand Material</div>
              <div className="check-list-file-uploaded">0 files uploaded</div>
            </div>
            <img
              className="active-arrow-icon"
              src={ArrowRightBlackIcon}
              alt="arrow"
            />
            <div className="clear-fix" />
          </li>
        </ul>
      </BrandAssetSideBar>
      <BrandAssetBody>
        <div className="label-heading">Part 1/5</div>
        <h3 className="page-heading ">Brand Logo</h3>
        <p className="normal-text mt-1 mb-0">
          Please upload one or more versions of your brand logo.
        </p>
        <p className="gray-normal-text mt-1">
          Preferred format: AI or EPS file{' '}
          <img
            className="gray-info-icon"
            width="15px "
            src={GrayInfoIcon}
            alt=""
          />
        </p>
      </BrandAssetBody>
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
  height: 68%;

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
        }
        .check-list-file-uploaded {
          font-size: ${Theme.extraNormal};
          color: ${Theme.gray40};
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
