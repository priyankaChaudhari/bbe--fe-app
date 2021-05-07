/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react';

import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import {
  CommonPagination,
  ModalBox,
  PageLoader,
  SearchInput,
  TeamDropDown,
  Button,
  GetInitialName,
  CheckBoxList,
} from '../../common';
import { SearchIcons, SortDownIcon, CloseIcon } from '../../theme/images/index';
import {
  addCustomerMember,
  getRoles,
  userCustomerRoleList,
} from '../../api/index';

export default function AddTeamMember({
  id,
  getCustomerMemberList,
  setShowMemberList,
}) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [roles, setRoles] = useState([]);
  const [filterDetails, setFilterDetails] = useState({
    name: '',
    clear: false,
  });

  const [userRoleId, setUserRoleId] = useState([]);
  const [disabledRoles, setdisabledRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBtn, setShowBtn] = useState(false);

  const customStyleCSS = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      color: '#2E384D',
    }),
    menu: (provided) => ({
      ...provided,

      border: '  1px solid rgba(46, 91, 255, 0.08);',
      boxShadow: '0 10px 20px 0 rgba(46, 91, 255, 0.07)',
      borderRadius: '2px',
    }),
    option: (provided, state) => {
      return {
        ...provided,
        color: state.isSelected ? '#FF5933' : '#2E384D',
        background: 'white',

        ':hover': {
          background: '#F9FAFF',
          cursor: 'pointer',
        },
      };
    },

    control: (base) => ({
      ...base,
      border: 'none',
      maxWidth: '60%',
      margin: '0 auto',
      textAlign: 'right',
      '&:focus': {
        border: 'none',
        background: 'white !important',
      },
    }),
  };

  const CustomDropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <img src={SortDownIcon} alt="sort" style={{ width: '78%' }} />
      </components.DropdownIndicator>
    );
  };

  const getMembers = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });
      getRoles().then((role) => {
        role.data.unshift({ value: 'All', label: 'All' });
        setRoles(role && role.data);
      });
      userCustomerRoleList(
        id,
        currentPage,
        searchQuery,
        filterDetails.name.value,
      ).then((response) => {
        setData(response && response.data && response.data.results);
        setCount(response && response.data && response.data.count);
        setPageNumber(currentPage);
        setIsLoading({ loader: false, type: 'page' });
      });
    },
    [id, searchQuery, filterDetails.name.value],
  );

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const saveNewMember = () => {
    setIsLoading({ loader: true, type: 'button' });
    addCustomerMember(userRoleId, id).then((response) => {
      if (response && response.status === 200) {
        getCustomerMemberList();
        setIsLoading({ loader: false, type: 'button' });
        toast.success(`${userRoleId.length} Team Member(s) Added.`);
        setShowMemberList({ add: false, show: false, modal: false });
      } else {
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getMembers(currentPage, searchQuery, filterDetails.name.value);
  };

  const searchList = (event) => {
    setSearchQuery(event.target.value);
    setIsLoading({ loader: true, type: 'page' });

    userCustomerRoleList(
      id,
      1,
      event.target.value,
      filterDetails.name.value,
    ).then((response) => {
      setData(response && response.data && response.data.results);
      setCount(response && response.data && response.data.count);
      setPageNumber(pageNumber);
      setIsLoading({ loader: false, type: 'page' });
    });
  };

  const cancelFilter = () => {
    getMembers(1);
    setFilterDetails({ name: '', clear: false });
  };

  const getFilteredRole = (event) => {
    if (event && event.value === 'All') {
      cancelFilter();
    } else {
      setFilterDetails({ clear: true, name: event });
      setIsLoading({ loader: true, type: 'page' });
      userCustomerRoleList(id, 1, searchQuery, event.value).then((response) => {
        setData(response && response.data && response.data.results);
        setCount(response && response.data && response.data.count);
        setPageNumber(pageNumber);
        setIsLoading({ loader: false, type: 'page' });
      });
    }
  };

  const checkDisable = (item) => {
    if (
      disabledRoles.find(
        (op) =>
          Object.keys(op)[0] === item.role && Object.values(op)[0] !== item.id,
      )
    ) {
      return true;
    }
    return false;
  };

  const handleRoles = (event, user) => {
    setShowBtn(true);

    const list = [...userRoleId];
    const roleName = [...disabledRoles];
    if (event.target.checked && event.target.name === user.id) {
      if (list.indexOf(user.id) === -1) {
        list.push(user.id);
      }
      if (roleName.indexOf(user.role) === -1) {
        roleName.push({ [user.role]: user.id });
      }
    } else if (!event.target.checked && event.target.name === user.id) {
      const remove = list.findIndex((item) => item === user.id);
      const removeRole = roleName.findIndex((item) => item === user.role);

      if (remove > -1) {
        list.splice(remove, 1);
        roleName.splice(removeRole, 1);
      }
    }
    setUserRoleId(list);
    setdisabledRoles(roleName);
    checkDisable(user);
    if (list && list.length === 0) setShowBtn(false);
  };

  return (
    <ModalBox>
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={() =>
          setShowMemberList({
            show: false,
            add: false,
            modal: false,
          })
        }
        role="presentation"
      />
      <div className="modal-body pb-0">
        <h4>Add Team Member</h4>
        <div className="body-content mt-3 ">
          <>
            <div className="row">
              <div className="col-7 pr-0">
                <SearchInput className="mt-2">
                  <input
                    className="form-control search-filter "
                    placeholder="Search by name or email"
                    onChange={(event) => searchList(event)}
                  />
                  <img
                    src={SearchIcons}
                    alt="search"
                    className="search-input-icon"
                  />
                </SearchInput>
              </div>
              <div className="col-1 mt-2 roleName">
                <label htmlFor="role">Role:</label>
              </div>
              <div className="col-4 mt-2">
                <TeamDropDown>
                  <Select
                    classNamePrefix="react-select"
                    options={roles}
                    placeholder="All"
                    onChange={(event) => getFilteredRole(event)}
                    value={filterDetails.name}
                    menuPortalTarget={document.body}
                    styles={customStyleCSS}
                    components={{ DropdownIndicator: CustomDropdownIndicator }}
                    theme={(theme) => ({
                      ...theme,
                      border: 'none',

                      colors: {
                        ...theme.colors,
                        primary25: 'white',
                        text: '#FF5933',
                        color: '#FF5933',
                        primary: 'transparent !important',
                      },
                    })}
                  />
                </TeamDropDown>
              </div>
            </div>
            {isLoading.loader && isLoading.type === 'page' ? (
              <PageLoader
                component="member"
                color="#FF5933"
                type="page"
                height={40}
              />
            ) : (
              <>
                {data && data.length === 0 ? (
                  <div className="text-center no-result-found mt-5">
                    No User Found.
                  </div>
                ) : (
                  <>
                    {data &&
                      data.map((item) => (
                        <CheckBoxList>
                          <div className="row">
                            <div
                              className={
                                checkDisable(item)
                                  ? 'col-12 pt-4 disableCheck'
                                  : 'col-12 pt-4'
                              }
                              key={item.id}>
                              <div className="checkbox" role="presentation">
                                <input
                                  type="checkbox"
                                  id={item.id}
                                  name={item.id}
                                  onClick={(event) => handleRoles(event, item)}
                                  disabled={checkDisable(item)}
                                  defaultChecked={userRoleId.find(
                                    (op) => op === item.id,
                                  )}
                                />
                                <label
                                  htmlFor={item.id}
                                  style={{
                                    cursor: checkDisable(item)
                                      ? 'not-allowed'
                                      : '',
                                  }}>
                                  <div
                                    className="edit-profile-text float-left"
                                    role="presentation">
                                    <GetInitialName
                                      userInfo={item}
                                      property="mr-3"
                                    />

                                    <div className="name-email">
                                      <div className="team-member-name">
                                        {' '}
                                        {item.first_name || ' '}{' '}
                                        {item.last_name || ' '}
                                      </div>
                                      {item.email || ' '}
                                    </div>
                                  </div>
                                </label>
                              </div>
                              <div className="float-right role-selected mt-3">
                                {item.role || ''}
                              </div>
                              <div className="clear-fix" />
                            </div>
                          </div>
                        </CheckBoxList>
                      ))}
                  </>
                )}
              </>
            )}
          </>
        </div>
        {!isLoading.loader && isLoading.type === 'page' ? (
          <CommonPagination
            count={count}
            pageNumber={pageNumber}
            handlePageChange={handlePageChange}
          />
        ) : (
          ''
        )}
      </div>

      {(showBtn && !isLoading.loader && isLoading.type === 'page') ||
      (isLoading.loader && isLoading.type === 'button') ? (
        <>
          <div className="footer-line  " />
          <div className="modal-footer">
            <Button
              className=" btn-primary mr-4"
              onClick={() => saveNewMember()}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                `Add ${userRoleId.length} Team Member(s)`
              )}
            </Button>

            <Button
              className=" btn-borderless"
              onClick={() =>
                setShowMemberList({ show: false, add: false, modal: false })
              }>
              Discard Changes
            </Button>
          </div>
        </>
      ) : (
        ''
      )}
    </ModalBox>
  );
}

AddTeamMember.defaultProps = {
  id: '',
  getCustomerMemberList: () => {},
  setShowMemberList: () => {},
};

AddTeamMember.propTypes = {
  id: PropTypes.string,
  getCustomerMemberList: PropTypes.func,
  setShowMemberList: PropTypes.func,
};
