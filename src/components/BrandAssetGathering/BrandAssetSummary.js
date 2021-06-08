import React from 'react';
import { OnBoardingBody, GreyCard, Button } from '../../common';
import { OrangeCheckMark } from '../../theme/images';

export default function BrandAssetSummary() {
  return (
    <OnBoardingBody className="body-white">
      <div className="white-card-base panel pb-4">
        <h3 className="page-heading ">Brand Assets Summary</h3>

        <div className="sub-information mb-4">
          Thanks! Below is a summary of everything that’s been submitted
          regarding brand assets.
        </div>

        <GreyCard>
          <div className="information-text mt-2">
            Brand Logo
            <div className="completed-status">
              <img className="orange-check" src={OrangeCheckMark} alt="check" />
              3 files uploaded
            </div>
            <div className="view-details" role="presentation">
              {' '}
              View
            </div>
          </div>
          <div className="information-text mt-2">
            Brand Guidelines
            <div className="completed-status">
              <img className="orange-check" src={OrangeCheckMark} alt="check" />
              2 files uploaded
            </div>
            <div className="view-details" role="presentation">
              {' '}
              View
            </div>
          </div>
          <div className="information-text mt-2">
            Font Files
            <div className="completed-status">
              <img className="orange-check" src={OrangeCheckMark} alt="check" />
              3 files uploaded
            </div>
            <div className="view-details" role="presentation">
              {' '}
              View
            </div>
          </div>
          <div className="information-text mt-2">
            Iconography
            <div className="completed-status">
              <img className="orange-check" src={OrangeCheckMark} alt="check" />
              None available
            </div>
            <div className="view-details" role="presentation">
              {' '}
              View
            </div>
          </div>
          <div className="information-text mt-2">
            Additional Brand material
            <div className="completed-status">
              <img className="orange-check" src={OrangeCheckMark} alt="check" />
              Skipped
            </div>
            <div className="view-details" role="presentation">
              {' '}
              View
            </div>
          </div>
        </GreyCard>
        <Button className="btn-primary w-100 mt-4 ">Back to Dashboard</Button>
      </div>
    </OnBoardingBody>
  );
}
