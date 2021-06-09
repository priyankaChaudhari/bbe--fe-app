import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getBrandAssetsSummary } from '../../api';

import { OnBoardingBody, GreyCard, Button } from '../../common';
import { PATH_BRAND_ASSET, PATH_CUSTOMER_DETAILS } from '../../constants';
import { BrandSteps } from '../../constants/FieldConstants';
import { OrangeCheckMark } from '../../theme/images';

export default function BrandAssetSummary() {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getBrandAssetsSummary('BAFNKpr').then((response) => {
      console.log(response, 'rest');
    });
  }, []);

  return (
    <OnBoardingBody className="body-white">
      <div className="white-card-base panel pb-4">
        <h3 className="page-heading ">Brand Assets Summary</h3>

        <div className="sub-information mb-4">
          Thanks! Below is a summary of everything that’s been submitted
          regarding brand assets.
        </div>

        <GreyCard>
          {BrandSteps.map((item) => (
            <div className="information-text mt-2">
              {item.label}
              <div className="completed-status">
                <img
                  className="orange-check"
                  src={OrangeCheckMark}
                  alt="check"
                />
                3 files uploaded
              </div>
              <div
                className="view-details"
                role="presentation"
                onClick={() =>
                  history.push({
                    pathname: PATH_BRAND_ASSET.replace(':id', id),
                    search: `step=${item.url}`,
                  })
                }>
                {' '}
                View
              </div>
            </div>
          ))}
        </GreyCard>

        <Button
          className="btn-primary w-100 mt-4"
          onClick={() =>
            history.push(PATH_CUSTOMER_DETAILS.replace(':id', id))
          }>
          Back to Dashboard
        </Button>
      </div>
    </OnBoardingBody>
  );
}
