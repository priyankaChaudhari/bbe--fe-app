/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getBrandAssetsSummary } from '../../api';
import { OnBoardingBody, GreyCard, Button, PageLoader } from '../../common';
import {
  PATH_BRAND_ASSET,
  PATH_CUSTOMER_DETAILS,
  PATH_THANKS,
  PATH_UNAUTHORIZED_BRAND_ASSET,
} from '../../constants';
import { BrandSteps } from '../../constants/FieldConstants';
import { GrayClockIcon, OrangeCheckMark } from '../../theme/images';
import { showBrandAsset } from '../../store/actions/customerState';

export default function BrandAssetSummary() {
  const dispatch = useDispatch();
  const { id, brandId } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState({});
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    getBrandAssetsSummary(brandId).then((response) => {
      if (
        response &&
        response.data &&
        Object.keys(response.data) &&
        Object.keys(response.data).length > 0
      ) {
        setData(response && response.data);
        const checkSkipped = BrandSteps.filter(
          (item) =>
            response.data[item.key] === 'Skipped' ||
            response.data[item.key] === '0 files uploaded',
        );

        if (history.location.pathname.includes('/assigned-brand-summary/')) {
          if (checkSkipped && checkSkipped.length > 0) {
            setShowDashboard(true);
          } else setShowDashboard(false);
        }
        setIsLoading({ loader: false, type: 'page' });
      }
    });
  }, [brandId]);

  const redirectTo = () => {
    if (history.location.pathname.includes('/assigned-brand-summary/')) {
      history.push({
        pathname: PATH_THANKS,
        search: `name=${data && data.user}`,
      });
    } else if (data && data.is_completed) {
      dispatch(showBrandAsset(true));
      history.push(PATH_CUSTOMER_DETAILS.replace(':id', id));
    } else {
      history.push(PATH_CUSTOMER_DETAILS.replace(':id', id));
    }
  };

  return (
    <OnBoardingBody className="body-white">
      <div className="white-card-base panel pb-4">
        <h3 className="page-heading ">Brand Assets Summary</h3>

        <div className="sub-information mb-4">
          Thanks! Below is a summary of everything that’s been submitted
          regarding brand assets.
        </div>
        {isLoading.loader && isLoading.type === 'page' ? (
          <PageLoader color="#FF5933" type="page" />
        ) : (
          <>
            <GreyCard>
              {BrandSteps.map((item) => (
                <div className="information-text mt-2" key={item.key}>
                  {item.label}
                  {data &&
                  data.steps &&
                  data.steps[item.key] &&
                  data.steps[item.key] === 'Skipped' ? (
                    <div className="pending-status">
                      <img
                        className="pending-icon"
                        src={GrayClockIcon}
                        alt="clock"
                      />
                      Skipped
                    </div>
                  ) : data &&
                    data.steps &&
                    data.steps[item.key] &&
                    data.steps[item.key] === '0 files uploaded' ? (
                    <div className="pending-status">
                      <img
                        className="pending-icon"
                        src={GrayClockIcon}
                        alt="clock"
                      />
                      {data && data.steps[item.key]}
                    </div>
                  ) : (
                    <div className="completed-status">
                      <img
                        className="orange-check"
                        src={OrangeCheckMark}
                        alt="check"
                      />
                      {data && data.steps[item.key]}
                    </div>
                  )}
                  <div
                    className="view-details"
                    role="presentation"
                    onClick={() =>
                      history.push({
                        pathname: history.location.pathname.includes(
                          '/assigned-brand-summary/',
                        )
                          ? PATH_UNAUTHORIZED_BRAND_ASSET.replace(
                              ':id',
                              id,
                            ).replace(':brandId', brandId)
                          : PATH_BRAND_ASSET.replace(':id', id).replace(
                              ':brandId',
                              brandId,
                            ),
                        search: `step=${item.url}`,
                      })
                    }>
                    {' '}
                    View
                  </div>
                </div>
              ))}
            </GreyCard>
            {showDashboard ? (
              ''
            ) : (
              <Button
                className="btn-primary w-100 mt-4"
                onClick={() => redirectTo()}>
                {history.location.pathname.includes('/assigned-brand-summary/')
                  ? 'Submit'
                  : 'Back to Dashboard'}
              </Button>
            )}
          </>
        )}
      </div>
    </OnBoardingBody>
  );
}
