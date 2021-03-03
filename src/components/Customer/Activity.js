import React from 'react';

import PropTypes from 'prop-types';

import { DefaultUser } from '../../theme/images/index';
import { WhiteCard, GroupUser } from '../../theme/Global';
import { CommonPagination, PageLoader } from '../../common';

export default function Activity({
  isLoading,
  activityData,
  activityDetail,
  getActivityInitials,
  images,
  handlePageChange,
  count,
  pageNumber,
}) {
  return (
    <>
      <div className="col-lg-8  col-12 ">
        <WhiteCard className="activity-card">
          {isLoading.loader && isLoading.type === 'activityPage' ? (
            <PageLoader
              component="activity"
              color="#FF5933"
              type="page"
              width={40}
              height={40}
            />
          ) : (
            <>
              <p className="black-heading-title mt-0 mb-4"> Recent Activity</p>
              {activityData.map((item) => (
                <GroupUser className="mb-2" key={Math.random()}>
                  {images.find((op) => op.entity_id === item.user_id) &&
                  images.find((op) => op.entity_id === item.user_id)
                    .presigned_url ? (
                    <img
                      src={
                        isLoading.loader && isLoading.type === 'page'
                          ? DefaultUser
                          : images.find((op) => op.entity_id === item.user_id)
                              .presigned_url
                      }
                      className="default-user-activity"
                      alt="pic"
                    />
                  ) : (
                    <div className="avatarName float-left mr-3">
                      {getActivityInitials(item.message)}
                    </div>
                  )}
                  <div className="activity-user mb-4">
                    {activityDetail(item)}

                    <div className="time-date mt-1">
                      {item && item.time ? item.time : ''}
                    </div>
                  </div>
                  <div className="clear-fix" />
                </GroupUser>
              ))}
              <div>
                {activityData && activityData.length === 0 ? (
                  <div>No Activity Log found.</div>
                ) : (
                  ''
                )}
                <CommonPagination
                  count={count}
                  pageNumber={pageNumber}
                  handlePageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </WhiteCard>
      </div>
    </>
  );
}

Activity.propTypes = {
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  activityData: PropTypes.arrayOf(PropTypes.object).isRequired,
  activityDetail: PropTypes.func.isRequired,
  getActivityInitials: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  handlePageChange: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};
