import React, { useState, useCallback } from 'react';

import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import $ from 'jquery';

import SideBar from './SideBar';
import {
  DefaultUser,
  ActivityLogIcon,
  ActivityOpenIcon,
} from '../theme/images/index';
import PageLoader from './PageLoader';
import { getActivityLog, getDocumentList } from '../api/index';
import CommonPagination from './Pagination';

export default function ActivityLog({ id }) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [images, setImages] = useState([]);

  const getActivityLogInfo = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });
      getActivityLog(currentPage, id).then((response) => {
        setData(response && response.data && response.data.results);
        setCount(response && response.data && response.data.count);
        setPageNumber(currentPage);
        getDocumentList().then((picResponse) => {
          setImages(picResponse);
        });
        setIsLoading({ loader: false, type: 'page' });
      });
    },
    [id],
  );

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getActivityLogInfo(currentPage);
  };

  const getActivityInfo = (item) => {
    const newRecord = item.message.includes(
      'created new record by company name',
    )
      ? item.message.split('created new record by company name')
      : '';
    const updatedField = item.message.includes('updated')
      ? item.message.split('updated')
      : '';

    const deleteRecord = item.message.includes('deleted record')
      ? item.message.split('deleted record')
      : '';

    if (newRecord || deleteRecord) {
      return (
        <>
          {newRecord[0] || deleteRecord[0]}
          <span>
            {newRecord
              ? 'created new record by company name'
              : 'deleted record'}
          </span>
          {newRecord[1] || deleteRecord[1]}
        </>
      );
    }
    return (
      <>
        {updatedField[0]}
        <span>updated {updatedField[1].split(' from ')[0]} from </span>{' '}
        {updatedField[1].split(' from ')[1].split(' to ')[0]}
        <span> to </span> {updatedField[1].split(' from ')[1].split(' to ')[1]}
      </>
    );
  };

  const getInitials = (userInfo) => {
    const firstName =
      (userInfo &&
        userInfo.split(' ').slice(0, 2) &&
        userInfo.split(' ').slice(0, 2)[0].charAt(0)) ||
      '';
    const lastName =
      (userInfo &&
        userInfo.split(' ').slice(0, 2) &&
        userInfo.split(' ').slice(0, 2)[1].charAt(0)) ||
      '';
    return firstName + lastName;
  };

  $(document).on('click', (e) => {
    if ($(e.target).closest('#clickbox').length === 0) {
      $('#swipe').prop('checked', true);
    }
  });

  return (
    <SideBar id="clickbox">
      <input data-function="swipe" id="swipe" type="checkbox" defaultChecked />
      <label
        data-function="swipe"
        htmlFor="swipe"
        onClick={() => getActivityLogInfo()}
        role="presentation">
        <ReactTooltip place="bottom" />
        <div className="activity-icon">
          <img
            data-tip="View Activity Log"
            src={ActivityLogIcon}
            alt="log-close"
            className=""
          />{' '}
        </div>
      </label>

      <label data-function="swipe" htmlFor="swipe">
        <div className="activity-icon">
          <img src={ActivityOpenIcon} alt="log-open" />{' '}
        </div>
        {isLoading.loader && isLoading.type === 'page' ? (
          ''
        ) : (
          <span className="activity-log">Activity Log </span>
        )}
      </label>

      <div className="sidebar">
        {isLoading.loader && isLoading.type === 'page' ? (
          <PageLoader component="activityLog" color="#FF5933" type="page" />
        ) : (
          <>
            <ul className="menu">
              {data &&
                data.map((item) => (
                  <li key={Math.random()}>
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
                        alt="pic"
                      />
                    ) : (
                      <div className="avatar">{getInitials(item.message)}</div>
                    )}
                    <div className="activity-user">
                      {getActivityInfo(item)}
                      <div className="time-date mt-1">
                        {item && item.time ? item.time : ''}
                      </div>
                    </div>
                    <div className="clear-fix" />
                  </li>
                ))}
            </ul>
            <div id="clickbox">
              {data && data.length === 0 ? (
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
      </div>
    </SideBar>
  );
}

ActivityLog.defaultProps = {
  id: '',
};

ActivityLog.propTypes = {
  id: PropTypes.string,
};
