/* eslint-disable react/no-danger */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';

// import htmlToText from 'html-to-text';
// const { convert } = require('html-to-text');
// const  htmlToText  = require('html-to-text');

import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import ReadMoreAndLess from 'react-read-more-less';
// import ReactHtmlParser from 'react-html-parser';
// import Select from 'react-select';
import styled from 'styled-components';
import { GroupUser } from '../../theme/Global';
import {
  getNotes,
  saveNotes,
  deleteNote,
  updateNotes,
} from '../../api/NotesApi';
import {
  InputSearchWithRadius,
  DropDownSelect,
  HeaderDownloadFuntionality,
  Button,
  CommonPagination,
  ModalRadioCheck,
  CheckBox,
} from '../../common';
import PageLoader from '../../common/PageLoader';

import {
  SearchIcon,
  CloseIcon,
  OrangeChat,
  RedTrashIcon,
  DefaultUser,
  PinIcons,
  CaretUp,
} from '../../theme/images/index';

import EditorComponent from '../../common/EditorComponent';
import Theme from '../../theme/Theme';

function Notes({
  setShowNotesModal,
  customerId,
  setNewNoteEditor,
  showNewNoteEditor,
}) {
  const [noteContent, setNoteContent] = useState('');
  const [showDelete, setShowDelete] = useState({ show: false });
  const [showDropdown, setShowDropdown] = useState({ show: false });

  // const [noteContent, setNoteContent] = useState('');

  const [isLoading, setIsLoading] = useState({ loader: false, type: 'page' });
  const filtersOption = {
    notes: [
      { label: 'All Notes' },
      { label: 'My Notes', value: 'my_notes' },
      { label: 'Team Notes' },
    ],
    teams: [
      { team: 'Sales Team' },
      { team: 'On-boarding Team' },
      { team: 'BGS Team' },
      { team: 'Creative Team' },
      { team: 'Advertising Team' },
      { team: 'Finance Team' },
    ],
    archived: [
      { label: 'Hide archived', value: 'hide' },
      { label: 'Show archived', value: '' },
      { label: 'Only show archived', value: 'only_archived' },
    ],
  };

  const [filters, setFilter] = useState(
    JSON.parse(localStorage.getItem('noteFilters')) || {
      archived: 'hide',
      team: [],
      notes: 'All Notes',
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
    queryString: '',
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
    (pageNumber, searchString = '') => {
      setIsLoading({ loader: true, type: 'page' });

      let selectedFilters = {};

      selectedFilters = { ...filters };

      if (selectedFilters.notes) {
        delete selectedFilters.notes;
      }
      if (!selectedFilters.archived) {
        delete selectedFilters.archived;
      }
      if (!selectedFilters.team.length) {
        delete selectedFilters.team;
      }

      getNotes(customerId, searchString, pageNumber, selectedFilters).then(
        (res) => {
          setData({
            ...data,
            notes: res && res.results,
            count: res && res.count,
            currentPage: pageNumber,
          });
          setIsLoading({ loader: false, type: 'page' });
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerId, filters],
  );

  useEffect(() => {
    getData(data.currentPage);
  }, [getData]);

  const debouncedSave = useCallback(
    debounce((page, nextValue) => getData(page, nextValue), 500),

    [], // will be created only once initially
  );

  const handleChange = (event) => {
    setData({
      ...data,
      queryString: event.target.value,
    });
    debouncedSave(1, event.target.value);
  };

  const saveNote = () => {
    const postData = {
      note: noteContent,
      customer: customerId,
    };

    if (data && data.selectedNote && data.selectedNote.id) {
      updateNotes(data.selectedNote && data.selectedNote.id, postData).then(
        () => {
          setData({ ...data, showNotesEditor: false, showEditor: false });
          getData(data.currentPage);
        },
      );
    } else {
      setIsLoading({ loader: true, type: 'button' });
      saveNotes(postData).then(() => {
        setIsLoading({ loader: false, type: 'button' });
        setNewNoteEditor(false);
        setData({ ...data, showNotesEditor: false, showEditor: false });
        getData(data.currentPage);
      });
    }
  };

  const renderEditor = () => {
    return (
      <>
        <div className="alert-msg mt-3">
          <EditorComponent
            setData={setNoteContent}
            data={data.selectedNote && data.selectedNote.note}
          />
        </div>
        <div className="text-right mt-3 mb-3 ">
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
            className="btn-borderless on-boarding  mr-2 pb-2 mb-1">
            Cancel
          </Button>
          <Button
            onClick={() => saveNote()}
            type="button"
            className={
              noteContent.length > 7
                ? ' btn-primary  w-10 on-boarding  '
                : ' btn-primary  w-10 on-boarding disabled'
            }>
            {isLoading.loader && isLoading.type === 'button' ? (
              <PageLoader width={20} height={20} color="#fff" type="button" />
            ) : data.selectedNote ? (
              'Save'
            ) : (
              'Add Note'
            )}
          </Button>

          {/* </Link> */}
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

  const onArchive = (item, dataToPost) => {
    setData({
      ...data,
      selectedNote: item,
    });

    updateNotes(item && item.id, dataToPost).then(() => {
      if (dataToPost.is_archieved) {
        toast.success(
          <div>
            Note Archived{' '}
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
            />{' '}
            <div
              role="presentation"
              style={{
                color: 'black',
                fontSize: ' 13px',
                display: 'inline-block',
                marginLeft: '13px',
              }}
              onClick={() => {
                onArchive(item, {
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
        {item && item.documents && item.documents.length ? (
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

  function getText(html) {
    const divContainer = document.createElement('div');
    divContainer.innerHTML = html;
    return divContainer.textContent || divContainer.innerText || '';
  }

  const displayMessage = (str) => {
    const messageText = str ? getText(str) : '';
    return messageText;
    // return messageText.length >= 100
    //   ? `${messageText.slice(0, 100)}...`
    //   : messageText;
  };

  const displayNotes = () => {
    return isLoading.loader && isLoading.type === 'page' ? (
      <PageLoader component="Notes-modal-loader" color="#FF5933" type="page" />
    ) : data && data.notes && data.notes.length ? (
      data.notes.map((item) => {
        return (
          <div className="notes-pin-unpin">
            <GroupUser className="mb-3" key={item.id}>
              {displayUserInfo(item.user)}
              <div className="activity-user">
                <span className="font-bold">
                  {' '}
                  {item.user && item.user.first_name}{' '}
                  {item.user && item.user.last_name}:
                </span>{' '}
                {data.showNotesEditor &&
                data.selectedNote &&
                data.selectedNote.id === item.id ? (
                  renderEditor()
                ) : (
                  <>
                    <ReadMoreAndLess
                      style={{ display: 'contents' }}
                      className="read-more-content"
                      charLimit={150}
                      readMoreText="show more"
                      readLessText="show less">
                      {displayMessage(item && item.note)}
                    </ReadMoreAndLess>

                    {/* {getText(item && item.note).length >= 100 ? (
                      <>
                        {getText(item && item.note)}
                        <span onClick={() => console.log('in showmore')}>
                          {' '}
                          ... show more
                        </span>{' '}
                      </>
                    ) : (
                      getText(item && item.note)
                    )} */}

                    <div className="time-date  mt-1">
                      {item && item.created_at}{' '}
                      <span className="pin">
                        <ul className="more-action">
                          {(userInfo && userInfo.id) ===
                          (item && item.user && item.user.id) ? (
                            <>
                              <li
                                role="presentation"
                                onClick={() => onEditClick(item)}>
                                {' '}
                                <span className="dot" /> Edit
                              </li>
                              <li
                                role="presentation"
                                onClick={() =>
                                  onArchive(item, {
                                    is_archieved: true,
                                  })
                                }>
                                {' '}
                                <span className="dot" /> Archive
                              </li>
                              {item.hs_note_id ? (
                                ''
                              ) : (
                                <li className="delete">
                                  {' '}
                                  <span
                                    className="delete"
                                    role="presentation"
                                    onClick={() => {
                                      setShowDelete({
                                        show: true,
                                        id: item.id,
                                      });
                                      // setData({
                                      //   ...data,
                                      //   selectedNote: item,
                                      //   deleteNote: {
                                      //     showDeleteConfirmation: true,
                                      //   },
                                      // });
                                    }}>
                                    <span className="dot" /> Delete{' '}
                                    {item.id ===
                                    (showDelete && showDelete.id) ? (
                                      <div
                                        ref={ref}
                                        className="delete-msg"
                                        role="presentation"
                                        onClick={() => onDeleteNote(item.id)}>
                                        {' '}
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
                          {item.is_pinned ? (
                            <li
                              role="presentation"
                              onClick={() =>
                                onArchive(item, { is_pinned: false })
                              }>
                              <span className="dot" /> Unpin
                            </li>
                          ) : (
                            <li
                              role="presentation"
                              onClick={() =>
                                onArchive(item, { is_pinned: true })
                              }>
                              <span className="dot" /> Pin
                            </li>
                          )}
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
        });
        // setShowDropdown({ show: false });
        localStorage.setItem(
          'noteFilters',
          JSON.stringify({
            ...filters,
            [item.value]: event.target.checked,
            notes: item.label,
            team: [],
          }),
        );
      } else {
        delete filters.my_notes;
        if (item.label === 'All Notes') {
          setFilter({
            ...filters,
            notes: item.label,
            team: [],
          });
          // setShowDropdown({ show: false });

          localStorage.setItem(
            'noteFilters',
            JSON.stringify({
              ...filters,
              notes: item.label,
              team: [],
            }),
          );
        } else {
          setFilter({
            ...filters,
            notes: item.label,
          });

          localStorage.setItem(
            'noteFilters',
            JSON.stringify({
              ...filters,
              notes: item.label,
            }),
          );
        }
      }
    }

    if (section === 'archived') {
      setFilter({ ...filters, archived: item.value });
      // setShowDropdown({ show: false });

      localStorage.setItem(
        'noteFilters',
        JSON.stringify({
          ...filters,
          archived: item.value,
        }),
      );
    }

    if (section === 'team') {
      const list = filters.team;
      if (event.target.checked) {
        list.push(item.team);
        setFilter({ ...filters, team: list });
        localStorage.setItem(
          'noteFilters',
          JSON.stringify({
            ...filters,
            team: list,
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
        setFilter({ ...filters, team: newList });
        localStorage.setItem(
          'noteFilters',
          JSON.stringify({
            ...filters,
            team: newList,
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
            ? // data.showFilterDropdown
              'dropdown-notes-filter show'
            : 'dropdown-notes-filter hide'
        }>
        {' '}
        <ul className="notes-option">
          {filtersOption.notes.map((item) => {
            return (
              <li>
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
              <li className="checkbox-option">
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
              <li>
                <ModalRadioCheck>
                  <label
                    className=" checkboxes radio-container customer-list"
                    htmlFor={item.label}>
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

  return (
    <NotesSideBar>
      <HeaderDownloadFuntionality>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              {' '}
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
                  }}>
                  {' '}
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
                defaultValue={data.queryString}
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
            <DropDownSelect>
              <div
                className="dropdown-select-all-notes"
                role="presentation"
                id="clickbox"
                onClick={() =>
                  // setData({
                  //   ...data,
                  //   showFilterDropdown: !data.showFilterDropdown,
                  // })
                  {
                    setShowDropdown({ show: !showDropdown.show });
                  }
                }>
                {filters && filters.notes}
                <img
                  src={CaretUp}
                  alt="caret"
                  style={{
                    transform: showDropdown.show ? 'rotate(180deg)' : '',
                    width: '25px',
                    height: '25px',
                    position: 'absolute',
                    top: '7px',
                    right: '18px',
                  }}
                />
              </div>

              <div ref={dropdownRef}>{displayFilter()}</div>
            </DropDownSelect>
          </div>

          <div className="straight-line horizontal-line mt-2 mb-2" />
          <div className=" col-12 commemt-inbox-body mt-3">
            {data.showEditor || showNewNoteEditor ? (
              <GroupUser>
                {displayUserInfo(userInfo)}
                <div className="activity-user">
                  <span className="font-bold">
                    {' '}
                    {userInfo && userInfo.first_name}{' '}
                    {userInfo && userInfo.last_name}:
                  </span>{' '}
                  {renderEditor()}
                </div>
              </GroupUser>
            ) : (
              ''
            )}
            {displayNotes()}
          </div>
        </div>
      </div>
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
    </NotesSideBar>
  );
}

Notes.defaultProps = {
  setShowNotesModal: () => {},
  customerId: '',
  setNewNoteEditor: () => {},
  showNewNoteEditor: false,
};

Notes.propTypes = {
  setShowNotesModal: PropTypes.func,
  customerId: PropTypes.string,
  setNewNoteEditor: PropTypes.func,
  showNewNoteEditor: PropTypes.bool,
};

export default Notes;

const NotesSideBar = styled.div`
  .footer-sticky {
    position: fixed;
    bottom: 0;
    max-width: 600px;
    width: 100%;
    background: white;
  }
  .notes-pin-unpin {
    position: relative;

    .pin-icon {
      background: #0062ff;
      padding: 2px;
      border-radius: 50%;
      width: 19px;
      position: absolute;
      top: 27px;
      left: 25px;
      transform: rotate(-46deg);
    }
  }
  .dropdown-select-all-notes {
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2};
    border-radius: 20px;
    width: 230px;
    height: 40px;
    color: ${Theme.black};
    padding: 11px 2px 0 14px;
  }
  .dropdown-notes-filter {
    background-color: ${Theme.white};
    border-radius: 8px;
    box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.4);
    max-width: 230px;
    padding: 15px;
    position: absolute;
    z-index: 99999;
    top: 45px;
    width: 100%;

    &.hide {
      display: none;
    }
    &.show {
      display: block;
    }
    .notes-option {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        padding-bottom: 14px;

        &.checkbox-option {
          padding-bottom: 4px;
        }

        &.teams-title {
          color: ${Theme.gray40};
          text-transform: uppercase;
          font-size: 11px;
          padding: 5px 0 15px 0;
          font-family: ${Theme.titleFontFamily};
        }
      }
    }
  }
  .commemt-inbox-body {
    height: 70vh;
    overflow: scroll;
  }
  @media only screen and (max-width: 767px) {
    .dropdown-select-all-notes {
      width: 100%;
      max-width: 100%;
    }
    .commemt-inbox-body {
      height: 55vh;
      overflow: scroll;
    }
  }
`;
