import React from 'react';

import PropTypes from 'prop-types';

import { DefaultUser } from '../../theme/images/index';
import { GroupUser } from '../../theme/Global';
import { CommonPagination, PageLoader, WhiteCard } from '../../common';

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
      <div className="col-lg-6  col-12 mb-3">
        <WhiteCard className="activity-card with-less-radius">
          {(isLoading.loader && isLoading.type === 'activityPage') ||
          activityData === null ? (
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
              {activityData &&
                activityData.map((item) => (
                  <GroupUser className="mb-2" key={Math.random()}>
                    {images.find(
                      (op) => op.entity_id === item.history_user_id,
                    ) &&
                    images.find((op) => op.entity_id === item.history_user_id)
                      .presigned_url ? (
                      <img
                        src={
                          isLoading.loader && isLoading.type === 'page'
                            ? DefaultUser
                            : images.find(
                                (op) => op.entity_id === item.history_user_id,
                              ).presigned_url
                        }
                        className="default-user-activity"
                        alt="pic"
                      />
                    ) : (
                      <div className="avatarName float-left mr-3">
                        {getActivityInitials(item.history_change_reason)}
                      </div>
                    )}
                    <div className="activity-user mb-3">
                      {activityDetail(item, true)}

                      <div className="time-date mt-1">
                        {item && item.history_date ? item.history_date : ''}
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
