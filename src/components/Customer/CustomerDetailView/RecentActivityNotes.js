/* eslint-disable react/no-danger */
import React, { useState, useEffect, useCallback } from 'react';

import { func, shape, string, bool, arrayOf } from 'prop-types';

import Theme from '../../../theme/Theme';
import { GroupUser } from '../../../theme/Global';
import { GetInitialName, PageLoader, WhiteCard } from '../../../common';
import {
  ContractEmailIcon,
  DefaultUser,
  ForwardOrangeIcon,
  NextActivityLogo,
  OrangeChat,
} from '../../../theme/images';
import { getRecentNotes } from '../../../api';

export default function RecentActivityNotes({
  id,
  setViewComponent,
  activityData,
  images,
  isLoading,
  getActivityInitials,
  activityDetail,
  role,
  setShowNotesModal,
  setNewNoteEditor,
  showNotesModal,
  getActivityLogInfo,
  setIsLoading,
}) {
  const [noteData, setNoteData] = useState([]);
  console.log('noteData', noteData);
  const getNotes = useCallback(() => {
    setIsLoading({ loader: true, type: 'note' });
    getRecentNotes(id).then((res) => {
      setNoteData(res && res.data && res.data.results);
      setIsLoading({ loader: false, type: 'note' });
    });
  }, [id, setIsLoading]);

  useEffect(() => {
    if (role !== 'Customer') getNotes();
    if (showNotesModal.apiCall) {
      getNotes();
    }
    if (showNotesModal.deleteNote) {
      getActivityLogInfo();
    }
  }, [getNotes, showNotesModal, getActivityLogInfo, role]);

  return (
    <>
      <div className="col-lg-3 col-12">
        {role !== 'Customer' ? (
          <WhiteCard className="mb-3 note-height-card">
            <div className="row">
              <div className="col-6">
                <p className="black-heading-title mt-0 mb-4"> Recent Notes</p>
              </div>
              {noteData && noteData.length > 0 ? (
                <div className="col-6 text-right">
                  <div
                    className="view-all-list "
                    role="presentation"
                    onClick={() =>
                      setShowNotesModal({
                        modal: true,
                        apiCall: false,
                      })
                    }>
                    View All
                    <img src={ForwardOrangeIcon} alt="forward-arrow" />
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            {isLoading.loader && isLoading.type === 'note' ? (
              <PageLoader
                component="activity"
                color={Theme.orange}
                type="page"
                width={20}
                height={20}
              />
            ) : (
              <>
                {noteData && noteData.length === 0 ? (
                  <div className="text-center">No notes found.</div>
                ) : (
                  <>
                    {noteData &&
                      noteData.slice(0, 3).map((item) => (
                        <React.Fragment key={item.id}>
                          {item && item.user ? (
                            <GroupUser className="mb-3" key={item.id}>
                              {images.find(
                                (op) => op.entity_id === item.user.id,
                              ) &&
                              images.find((op) => op.entity_id === item.user.id)
                                .presigned_url ? (
                                <img
                                  src={
                                    isLoading.loader &&
                                    isLoading.type === 'page'
                                      ? DefaultUser
                                      : images.find(
                                          (op) => op.entity_id === item.user.id,
                                        ).presigned_url
                                  }
                                  className="default-user-activity"
                                  alt="pic"
                                />
                              ) : (
                                <div className="float-left mr-3">
                                  <GetInitialName userInfo={item.user} />
                                </div>
                              )}
                              <div className="activity-user">
                                <span className="font-bold">
                                  {item && item.user && item.user.first_name}{' '}
                                  {item && item.user && item.user.last_name}:
                                </span>{' '}
                                <p
                                  className="m-0 note-text"
                                  dangerouslySetInnerHTML={{
                                    __html: item && item.note.slice(0, 80),
                                  }}
                                />
                                <div className="time-date  mt-1">
                                  {item && item.created_at}{' '}
                                </div>
                              </div>
                              <div className="clear-fix" />
                            </GroupUser>
                          ) : null}
                        </React.Fragment>
                      ))}
                  </>
                )}
              </>
            )}
            <div className="straight-line horizontal-line  mt-3 mb-3" />
            <div
              className="add-note-section cursor"
              role="presentation"
              onClick={() => {
                setShowNotesModal({
                  modal: true,
                  apiCall: false,
                });
                setNewNoteEditor(true);
              }}>
              {' '}
              <img className="red-chat-icon" src={OrangeChat} alt="chat" /> Add
              note
            </div>
          </WhiteCard>
        ) : (
          ''
        )}
        <WhiteCard className="mb-3 ">
          <div className="row">
            <div className="col-6">
              <p className="black-heading-title mt-0 mb-4"> Recent Activity</p>
            </div>
            <div className="col-6 text-right">
              <div
                className="view-all-list"
                onClick={() => {
                  setViewComponent('activity');
                }}
                role="presentation">
                View All
                <img src={ForwardOrangeIcon} alt="forward-arrow" />
              </div>
            </div>
          </div>

          {activityData &&
            activityData.slice(0, 3).map((item) => (
              <GroupUser key={Math.random()}>
                {(images.find((op) => op.entity_id === item.history_user_id) &&
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
                (item && item.status !== undefined) ? (
                  <div
                    className={
                      item && item.status !== undefined ? 'contract-email' : ''
                    }>
                    <img
                      src={
                        isLoading.loader && isLoading.type === 'page'
                          ? DefaultUser
                          : item.history_change_reason.split(' ').slice(0, 2) &&
                            item.history_change_reason
                              .split(' ')
                              .slice(0, 2)[0] === 'System'
                          ? NextActivityLogo
                          : item && item.status !== undefined
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
                  <div className="avatarName float-left mr-3">
                    {getActivityInitials(item.history_change_reason)}
                  </div>
                )}
                <div className="activity-user mb-3">
                  {activityDetail(item)}

                  <div className="time-date mt-1">
                    {item && item.history_date ? item.history_date : ''}
                  </div>
                </div>
                <div className="clear-fix" />
              </GroupUser>
            ))}
        </WhiteCard>
      </div>
    </>
  );
}

RecentActivityNotes.defaultProps = {
  activityData: null,
};

RecentActivityNotes.propTypes = {
  id: string.isRequired,
  isLoading: shape({
    loader: bool,
    type: string,
  }).isRequired,
  activityData: arrayOf(shape({})),
  activityDetail: func.isRequired,
  getActivityInitials: func.isRequired,
  images: arrayOf(shape({})).isRequired,
  setViewComponent: func.isRequired,
  role: string.isRequired,
  showNotesModal: shape({
    apiCall: bool,
    deleteNote: bool,
  }).isRequired,
  setShowNotesModal: func.isRequired,
  setNewNoteEditor: func.isRequired,
  getActivityLogInfo: func.isRequired,
  setIsLoading: func.isRequired,
};
