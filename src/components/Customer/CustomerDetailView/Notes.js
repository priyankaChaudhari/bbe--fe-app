/* eslint-disable react/no-danger */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useCallback, useRef } from 'react';

import debounce from 'lodash.debounce';
import ReactTooltip from 'react-tooltip';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { shape, string, bool, func, oneOfType } from 'prop-types';

import EditorComponent from '../../../common/EditorComponent';
import { NotesSideBar } from './CustomerDetailStyles';
import { filtersOption } from '../../../constants';
import { GroupUser } from '../../../theme/Global';
import { getNotes, saveNotes, deleteNote, updateNotes } from '../../../api';
import {
  InputSearchWithRadius,
  DropDownSelect,
  HeaderDownloadFuntionality,
  Button,
  CommonPagination,
  ModalRadioCheck,
  CheckBox,
  PageLoader,
} from '../../../common';
import {
  SearchIcon,
  CloseIcon,
  OrangeChat,
  RedTrashIcon,
  DefaultUser,
  PinIcons,
  CaretUp,
  InfoIcon,
} from '../../../theme/images';

function Notes({
  setShowNotesModal,
  customerId,
  setNewNoteEditor,
  showNewNoteEditor,
  showNotesModal,
}) {
  const [noteContent, setNoteContent] = useState('');
  const [showDelete, setShowDelete] = useState({ show: false });
  const [showDropdown, setShowDropdown] = useState({ show: false });
  const [searchQuery, setSearchQuery] = useState({
    q: JSON.parse(localStorage.getItem('noteFilters'))
      ? JSON.parse(localStorage.getItem('noteFilters')).q
      : '',
  });

  const [isLoading, setIsLoading] = useState({ loader: false, type: 'page' });

  const [filters, setFilter] = useState(
    JSON.parse(localStorage.getItem('noteFilters')) || {
      archived: 'hide',
      team: [],
      notes: 'All Notes',
      q: JSON.parse(localStorage.getItem('noteFilters'))
        ? JSON.parse(localStorage.getItem('noteFilters')).q
        : '',
    },
  );

  const [data, setData] = useState({
    showNotesEditor: false,
    notes: [],
    count: 0,
    currentPage: 1,
    selectedNote: '',
    deleteNote: {},
    showEditor: false,
    showFilterDropdown: false,
  });
  const userInfo = useSelector((state) => state.userState.userInfo);
  const ref = useRef(null);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowDelete({
        show: false,
        id: '',
      });
    }

    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown({ show: false });
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const getData = useCallback(
    (
      pageNumber,
      searchString = JSON.parse(localStorage.getItem('noteFilters'))
        ? JSON.parse(localStorage.getItem('noteFilters')).q
        : searchQuery.q,
    ) => {
      setIsLoading({ loader: true, type: 'page' });

      const selectedFilters = JSON.parse(localStorage.getItem('noteFilters'))
        ? JSON.parse(localStorage.getItem('noteFilters'))
        : { ...filters };

      if (!selectedFilters.archived) {
        delete selectedFilters.archived;
      }

      getNotes(customerId, searchString, pageNumber, selectedFilters).then(
        (res) => {
          setData({
            ...data,
            notes: res?.results,
            count: res?.count,
            currentPage: pageNumber,
          });
          setIsLoading({ loader: false, type: 'page' });
        },
      );
    },
    [customerId, filters],
  );

  useEffect(() => {
    getData(data.currentPage);
  }, [data.currentPage, getData]);

  const debouncedSave = useCallback(
    debounce((page, nextValue) => getData(page, nextValue), 500),
    [], // will be created only once initially
  );

  const handleChange = (event) => {
    setSearchQuery({ q: event.target.value });
    localStorage.setItem(
      'noteFilters',
      JSON.stringify({
        ...filters,
        q: event.target.value,
      }),
    );
    debouncedSave(1, event.target.value);
  };

  const saveNote = () => {
    const postData = {
      note: noteContent,
      customer: customerId,
    };

    setIsLoading({ loader: true, type: 'page' });
    if (data?.selectedNote?.id) {
      updateNotes(data.selectedNote?.id, postData).then(() => {
        setIsLoading({ loader: false, type: 'page' });

        setData({ ...data, showNotesEditor: false, showEditor: false });
        getData(data.currentPage);
      });
    } else {
      saveNotes(postData).then(() => {
        setData({ ...data, showNotesEditor: false, showEditor: false });
        setIsLoading({ loader: false, type: 'page' });
        setNewNoteEditor(false);
        getData(1);
      });
    }
  };

  const renderEditor = () => {
    return (
      <>
        <div className="alert-msg mt-3">
          <EditorComponent
            setData={setNoteContent}
            data={data.selectedNote?.note}
          />
        </div>
        <div className="text-right mt-2 mb-3 ">
          <Button
            onClick={() => {
              setData({
                ...data,
                showEditor: false,
                showNotesEditor: false,
                selectedNote: '',
              });
              setNewNoteEditor(false);
            }}
            type="button"
            className="btn-borderless on-boarding  mr-2 pb-2 ">
            Cancel
          </Button>
          <Button
            onClick={() => saveNote()}
            type="button"
            className={
              noteContent.length > 8 && !isLoading.loader
                ? ' btn-primary  w-10 on-boarding  '
                : ' btn-primary  w-10 on-boarding disabled'
            }>
            {data.selectedNote ? 'Save' : 'Add Note'}
          </Button>
        </div>
      </>
    );
  };

  const getInitials = (userData) => {
    const firstName =
      (userData && userData.first_name && userData.first_name.charAt(0)) || '';
    const lastName =
      (userData && userData.last_name && userData.last_name.charAt(0)) || '';
    return firstName + lastName;
  };

  const onDeleteNote = (noteId) => {
    deleteNote(noteId).then(() => {
      setShowNotesModal({ ...showNotesModal, deleteNote: true });
      getData(data.currentPage);
      setData({
        ...data,
        selectedNote: '',
        deleteNote: {
          showDeleteConfirmation: false,
        },
      });
    });
  };

  const onEditClick = (item) => {
    setData({
      ...data,
      selectedNote: item,
      showNotesEditor: true,
      showEditor: false,
    });
    setNewNoteEditor(false);
  };

  const onUpdateNote = (item, dataToPost) => {
    setIsLoading({ loader: true, type: 'button' });
    setData({
      ...data,
      selectedNote: item,
    });

    updateNotes(item?.id, dataToPost).then(() => {
      if (dataToPost.is_archieved) {
        toast.success(
          <div>
            Note Archived
            <span
              style={{
                borderRadius: '50%',
                width: '3px',
                height: '3px',
                position: 'absolute',
                top: '16px',
                marginLeft: '5px',
                backgroundColor: '#8798ad',
              }}
            />
            <div
              role="presentation"
              style={{
                color: 'black',
                fontSize: ' 13px',
                display: 'inline-block',
                marginLeft: '13px',
              }}
              onClick={() => {
                onUpdateNote(item, {
                  is_archieved: false,
                });
              }}>
              Undo
            </div>
          </div>,
        );
      }
      getData(data.currentPage);
    });
  };

  const displayUserInfo = (item) => {
    return (
      <div className=" float-left mt-1 ">
        {item?.documents?.length ? (
          <img
            className="default-user-activity"
            src={
              isLoading.loader && isLoading.type === 'page'
                ? DefaultUser
                : Object.values(item.documents[0])[0]
            }
            alt="pic"
          />
        ) : (
          <div className="avatarName mr-3">{getInitials(item)}</div>
        )}
      </div>
    );
  };

  const insertShowMoreProp = (note) => {
    const list = data.notes;
    list.forEach((item) => {
      if (item.id === note.id) {
        item.showMore = !item.showMore;
      } else if (!item.showMore) {
        item.showMore = false;
      }
    });
    setData({ ...data, notes: list });
  };

  const renderArchiveHtml = (item, isArchieved, label) => {
    return (
      <li
        role="presentation"
        className={
          isLoading.loader && item.id === data.selectedNote.id ? 'disabled' : ''
        }
        onClick={() =>
          onUpdateNote(item, {
            is_archieved: isArchieved,
          })
        }>
        <span className="dot" /> {label}
      </li>
    );
  };
  const renderPinnHtml = (item, isPinned, label) => {
    return (
      <li
        role="presentation"
        onClick={() => onUpdateNote(item, { is_pinned: isPinned })}>
        <span className="dot" />
        {label}
      </li>
    );
  };

  const displayNotes = () => {
    return data?.notes?.length ? (
      data.notes.map((item) => {
        const noteType = item.note_type;
        return (
          <div className="notes-pin-unpin" key={item.id}>
            <GroupUser className="mb-3" key={item.id}>
              {displayUserInfo(item.user)}
              <div className="activity-user">
                <span className="font-bold">
                  {item.user?.first_name}
                  {item.user?.last_name}:
                </span>
                {data.showNotesEditor && data.selectedNote?.id === item.id ? (
                  renderEditor()
                ) : (
                  <>
                    <span
                      // style={{ display: 'inline-grid' }}
                      className="cursor">
                      <span
                        className="note-text"
                        dangerouslySetInnerHTML={{
                          __html: item.showMore
                            ? item?.note
                            : item?.note.slice(0, 155),
                        }}
                      />

                      {item?.note.length > 155 ? (
                        <span style={{ color: 'black' }}>
                          {!item.showMore ? '...' : ''}
                        </span>
                      ) : (
                        ''
                      )}
                      {item?.note.length > 155 ? (
                        <span
                          style={{ color: '#FF5933' }}
                          role="presentation"
                          onClick={() => {
                            insertShowMoreProp(item);
                          }}>
                          {!item.showMore ? ' show more' : ' show less'}
                        </span>
                      ) : (
                        ''
                      )}
                    </span>

                    <div className="time-date  mt-1">
                      {item?.created_at}
                      <span className="pin">
                        <ul className="more-action">
                          {userInfo?.id === item?.user?.id &&
                          noteType !== 'bp_profile' ? (
                            <>
                              <li
                                role="presentation"
                                onClick={() => onEditClick(item)}>
                                <span className="dot" /> Edit
                              </li>
                              {item.is_archieved
                                ? renderArchiveHtml(item, false, 'Unarchive')
                                : renderArchiveHtml(item, true, 'Archive')}
                              {item.hs_note_id ? (
                                ''
                              ) : (
                                <li className="delete">
                                  <span
                                    className="delete"
                                    role="presentation"
                                    onClick={() => {
                                      setShowDelete({
                                        show: true,
                                        id: item.id,
                                      });
                                    }}>
                                    <span className="dot" /> Delete
                                    {item.id === showDelete?.id ? (
                                      <div
                                        ref={ref}
                                        className="delete-msg"
                                        role="presentation"
                                        onClick={() => onDeleteNote(item.id)}>
                                        <img
                                          className="red-trash-icon"
                                          src={RedTrashIcon}
                                          alt="check"
                                        />
                                        Confirm Delete
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </span>
                                </li>
                              )}
                            </>
                          ) : (
                            ''
                          )}
                          {item.is_pinned
                            ? renderPinnHtml(item, false, 'Unpin')
                            : renderPinnHtml(item, true, 'Pin')}
                        </ul>
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="clear-fix" />
            </GroupUser>
            {item.is_pinned ? (
              <img className="pin-icon" src={PinIcons} alt="pin" />
            ) : (
              ''
            )}
          </div>
        );
      })
    ) : (
      <p className="no-result-found  text-center mt-4 mb-4">No Notes Found</p>
    );
  };

  const handlePageChange = (pageNumber) => {
    setData({ ...data, currentPage: pageNumber });
    getData(pageNumber);
  };

  const handleFilters = (event, item, section) => {
    setData({ ...data, currentPage: 1 });
    if (section === 'notes') {
      if (item.label === 'My Notes') {
        setFilter({
          ...filters,
          [item.value]: event.target.checked,
          notes: item.label,
          team: [],
          q: searchQuery.q,
        });
        localStorage.setItem(
          'noteFilters',
          JSON.stringify({
            ...filters,
            [item.value]: event.target.checked,
            notes: item.label,
            team: [],
            q: searchQuery.q,
          }),
        );
      } else {
        delete filters.my_notes;
        if (item.label === 'All Notes') {
          setFilter({
            ...filters,
            notes: item.label,
            team: [],
            q: searchQuery.q,
          });
          localStorage.setItem(
            'noteFilters',
            JSON.stringify({
              ...filters,
              notes: item.label,
              team: [],
              q: searchQuery.q,
            }),
          );
        } else {
          setFilter({
            ...filters,
            notes: item.label,
            q: searchQuery.q,
          });
          localStorage.setItem(
            'noteFilters',
            JSON.stringify({
              ...filters,
              notes: item.label,
              q: searchQuery.q,
            }),
          );
        }
      }
    }

    if (section === 'archived') {
      setFilter({ ...filters, archived: item.value, q: searchQuery.q });
      localStorage.setItem(
        'noteFilters',
        JSON.stringify({
          ...filters,
          archived: item.value,
          q: searchQuery.q,
        }),
      );
    }

    if (section === 'team') {
      const list = filters.team;
      if (event.target.checked) {
        list.push(item.team);
        setFilter({ ...filters, team: list, q: searchQuery.q });
        localStorage.setItem(
          'noteFilters',
          JSON.stringify({
            ...filters,
            team: list,
            q: searchQuery.q,
          }),
        );
      } else {
        const newList = [];
        list.map((ele) => {
          if (ele !== item.team) {
            newList.push(ele);
          }
          return '';
        });
        setFilter({ ...filters, team: newList, q: searchQuery.q });
        localStorage.setItem(
          'noteFilters',
          JSON.stringify({
            ...filters,
            team: newList,
            q: searchQuery.q,
          }),
        );
      }
    }
  };

  const teamsHandleCheckbox = (item) => {
    if (filters.my_notes) {
      return false;
    }
    if (filters.notes === 'All Notes') {
      return true;
    }
    if (filters.team && filters.team.includes(item)) {
      return true;
    }
    return false;
  };

  const displayFilter = () => {
    return (
      <div
        className={
          showDropdown.show
            ? 'dropdown-notes-filter show'
            : 'dropdown-notes-filter hide'
        }>
        <ul className="notes-option">
          {filtersOption.notes.map((item) => {
            return (
              <li key={item.label}>
                <ModalRadioCheck>
                  <label
                    className=" checkboxes radio-container customer-list"
                    htmlFor={item.label}>
                    {item.label}
                    <input
                      type="radio"
                      name="notes-radio"
                      id={item.label}
                      value={item.label}
                      onChange={(event) => handleFilters(event, item, 'notes')}
                      defaultChecked={filters.notes === item.label}
                    />
                    <span className="checkmark checkmark-customer-list" />
                  </label>
                </ModalRadioCheck>
              </li>
            );
          })}
          <li className="teams-title">Teams</li>
          {filtersOption.teams.map((teamFilter) => {
            return (
              <li className="checkbox-option" key={teamFilter.team}>
                <CheckBox>
                  <label
                    className={
                      filters.notes === 'Team Notes'
                        ? 'check-container customer-pannel'
                        : 'check-container customer-pannel disabled'
                    }
                    htmlFor={teamFilter.team}>
                    {teamFilter.team}
                    <input
                      type="checkbox"
                      id={teamFilter.team}
                      name={teamFilter.team}
                      onChange={(event) =>
                        handleFilters(event, teamFilter, 'team')
                      }
                      checked={teamsHandleCheckbox(teamFilter.team)}
                    />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
              </li>
            );
          })}
          <div className="straight-line horizontal-line mt-2 mb-3" />
          {filtersOption.archived.map((item) => {
            return (
              <li key={item.label}>
                <ModalRadioCheck>
                  <label
                    className=" checkboxes radio-container customer-list"
                    htmlFor={item.label}
                    key={item.label}>
                    {item.label}
                    <input
                      type="radio"
                      name="achived-radio"
                      id={item.label}
                      value={item.label}
                      onChange={(event) =>
                        handleFilters(event, item, 'archived')
                      }
                      defaultChecked={filters.archived === item.value}
                    />
                    <span className="checkmark checkmark-customer-list" />
                  </label>
                </ModalRadioCheck>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const displayTooltip = () => {
    let message = '';
    message += filters.notes;
    if (filters.notes === 'Team Notes' && filters.team.length) {
      message = `${message}:(${filters.team.join(', ')})`;
    }
    if (filters.archived === 'hide') {
      message += ', Hide Archived';
    }
    if (filters.archived === 'only_archived') {
      message += ', Only Show Archived';
    }
    if (filters.archived === '') {
      message += ', Show Archived';
    }
    return message;
  };

  return (
    <NotesSideBar>
      <HeaderDownloadFuntionality>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="header-title "> Notes</div>
            </div>
            <div className="col-md-6 col-sm-12">
              <ul className="contract-download-nav">
                <li
                  className={
                    data.showEditor || showNewNoteEditor ? 'disabled' : ''
                  }
                  role="presentation"
                  onClick={() => {
                    setData({
                      ...data,
                      showEditor: true,
                      selectedNote: '',
                    });
                    setNoteContent('');
                    $('#editor').scrollTop(0);
                  }}>
                  <img className="header-icon" src={OrangeChat} alt="check" />
                  <span className="cursor"> Add note </span>
                </li>
                <li>
                  <span className="divide-arrow hide-mobile" />
                </li>
                <li>
                  <img
                    width="18px"
                    src={CloseIcon}
                    alt="close"
                    className="float-right cursor remove-cross-icon"
                    onClick={() => {
                      setShowNotesModal(false);
                      setNewNoteEditor(false);
                    }}
                    role="presentation"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </HeaderDownloadFuntionality>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-7  col-sm-12 mt-2 pr-2 pl-2">
            <InputSearchWithRadius className="customer-list-header w-80">
              <input
                className=" form-control search-filter"
                placeholder="Search"
                name="search"
                defaultValue={filters.q}
                onChange={(e) => handleChange(e)}
              />
              <img
                src={SearchIcon}
                alt="search"
                className="search-input-icon"
              />
            </InputSearchWithRadius>
          </div>
          <div className="col-md-5 col-sm-12 mt-2 pr-2 pl-2">
            <DropDownSelect ref={dropdownRef}>
              <div
                className="dropdown-select-all-notes"
                role="presentation"
                id="clickbox"
                onClick={() => {
                  setShowDropdown({ show: !showDropdown.show });
                }}>
                {filters?.notes}

                <img
                  src={InfoIcon}
                  alt="search cursor"
                  data-tip={displayTooltip()}
                  data-for="info"
                  className=" chat-info-icon"
                />
                <ReactTooltip id="info" aria-haspopup="true" place="bottom" />

                <img
                  src={CaretUp}
                  alt="caret"
                  style={{
                    transform: showDropdown.show ? 'rotate(180deg)' : '',
                    width: '25px',
                    height: '25px',
                    position: 'absolute',
                    top: '8px',
                    right: '21px',
                  }}
                />
              </div>
              <div>{displayFilter()}</div>
            </DropDownSelect>
          </div>

          <div className="straight-line horizontal-line mt-2 mb-3" />
          {isLoading.loader && isLoading.type === 'page' ? (
            <PageLoader
              component="Notes-modal-loader"
              color="#FF5933"
              type="page"
            />
          ) : (
            <div className=" col-12 commemt-inbox-body " id="editor">
              {data.showEditor || showNewNoteEditor ? (
                <GroupUser className="mb-3">
                  {displayUserInfo(userInfo)}
                  <div className="activity-user">
                    <span className="font-bold">
                      {userInfo?.first_name}
                      {userInfo?.last_name}:
                    </span>
                    {renderEditor()}
                  </div>
                </GroupUser>
              ) : (
                ''
              )}
              {displayNotes()}
              <div className="footer-sticky">
                <div className="straight-line horizontal-line" />
                <div className="container-fluid">
                  <CommonPagination
                    count={data.count}
                    pageNumber={data.currentPage}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </NotesSideBar>
  );
}

Notes.defaultProps = {
  setShowNotesModal: () => {},
  customerId: '',
  setNewNoteEditor: () => {},
  showNewNoteEditor: false,
  showNotesModal: {},
};

Notes.propTypes = {
  setShowNotesModal: func,
  customerId: string,
  setNewNoteEditor: func,
  showNewNoteEditor: bool,
  showNotesModal: oneOfType([
    bool,
    shape({
      modal: bool,
      apiCall: bool,
      deleteNote: bool,
    }),
  ]),
};

export default Notes;
