import React, { useState, useEffect } from 'react';

import { shape, string, bool, func } from 'prop-types';

import Theme from '../../../theme/Theme';
import useActivityLog from '../../../hooks/useActivityLog';
import { GroupUser } from '../../../theme/Global';
import { getCustomerActivityLog, getDocumentList } from '../../../api';
import {
  ContractEmailIcon,
  DefaultUser,
  NextActivityLogo,
} from '../../../theme/images';
import {
  CommonPagination,
  GetInitialName,
  PageLoader,
  Status,
  WhiteCard,
} from '../../../common';

export default function Activity({
  isLoading,
  viewComponent,
  setIsLoading,
  id,
}) {
  const activityDetail = useActivityLog(viewComponent);

  const [activityData, setActivityData] = useState(null);
  const [activityCount, setActivityCount] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [images, setImages] = useState([]);

  useEffect(() => {
    setIsLoading({ loader: true, type: 'activityPage' });
    getCustomerActivityLog(pageNumber, id).then((response) => {
      setActivityData(response?.data?.results);
      setActivityCount(response?.data?.count);
      setPageNumber(pageNumber);
      getDocumentList().then((picResponse) => {
        setImages(picResponse);
      });
      setIsLoading({ loader: false, type: 'activityPage' });
    });
  }, [id, setIsLoading, pageNumber]);

  const getActivityInitials = (user) => {
    if (user) {
      const userDetail = {
        first_name: user.split(' ')[0],
        last_name: user.split(' ')[1],
      };
      return <GetInitialName userInfo={userDetail} type="activity" />;
    }
    return '';
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getCustomerActivityLog(currentPage);
  };

  return (
    <>
      <div className="col-lg-9  col-12 mb-3">
        <WhiteCard className="activity-card">
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
                    {(images.find(
                      (op) => op.entity_id === item.history_user_id,
                    ) &&
                      images.find((op) => op.entity_id === item.history_user_id)
                        .presigned_url) ||
                    (item.history_change_reason &&
                      item.history_change_reason.split(' ').slice(0, 2) &&
                      item.history_change_reason.split(' ').slice(0, 2)[0] ===
                        'System' &&
                      item.history_change_reason
                        .split(' ')
                        .slice(0, 2)[1]
                        .toLowerCase() === 'user') ||
                    item?.status !== undefined ? (
                      <div
                        className={
                          item?.status !== undefined ? 'contract-email' : ''
                        }>
                        <img
                          src={
                            isLoading.loader && isLoading.type === 'page'
                              ? DefaultUser
                              : item.history_change_reason
                                  .split(' ')
                                  .slice(0, 2) &&
                                item.history_change_reason
                                  .split(' ')
                                  .slice(0, 2)[0] === 'System'
                              ? NextActivityLogo
                              : item?.status !== undefined
                              ? ContractEmailIcon
                              : images.find(
                                  (op) => op.entity_id === item.history_user_id,
                                ).presigned_url
                          }
                          className={
                            item && item.status !== undefined
                              ? 'default-user-activity contract-mail'
                              : 'default-user-activity '
                          }
                          alt="pic"
                        />
                      </div>
                    ) : (
                      <div className=" float-left mr-3">
                        {getActivityInitials(item.history_change_reason)}
                      </div>
                    )}
                    <div className="activity-user mb-3">
                      {activityDetail(item, true)}

                      <div className="time-date mt-1">
                        {item?.history_date ? item.history_date : ''}
                      </div>
                      {item?.status ? (
                        <>
                          <Status
                            label={item.status}
                            backgroundColor={
                              item.status === 'delivered'
                                ? Theme.lightGreen
                                : item.status === 'processed'
                                ? Theme.lightYellow
                                : Theme.lightRed
                            }
                            pointColor={
                              item.status === 'delivered'
                                ? Theme.green
                                : item.status === 'processed'
                                ? Theme.yellow
                                : Theme.red
                            }
                          />
                          {item.status === 'delivered' ? (
                            <div className="email-clicks">
                              <span className="email-opens">
                                Opens: {item.opens || 0}
                              </span>
                              <span className="email-opens">
                                Clicks: {item.clicks || 0}
                              </span>
                            </div>
                          ) : (
                            ''
                          )}
                        </>
                      ) : (
                        ''
                      )}
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
                  count={activityCount}
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
  isLoading: shape({
    loader: bool,
    type: string,
  }).isRequired,
  id: string.isRequired,
  viewComponent: string.isRequired,
  setIsLoading: func.isRequired,
};
