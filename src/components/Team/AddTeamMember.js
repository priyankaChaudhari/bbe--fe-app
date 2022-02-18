import React, { useState, useEffect, useCallback } from 'react';

import { toast } from 'react-toastify';
import { string, func, shape, bool } from 'prop-types';

import { SearchIcon, CloseIcon } from '../../theme/images';
import { addCustomerMembers, getAllMembers } from '../../api';
import {
  CommonPagination,
  ModalBox,
  PageLoader,
  SearchInput,
  Button,
  GetInitialName,
  CheckBoxList,
} from '../../common';

export default function AddTeamMember({
  id,
  getCustomerMemberList,
  setShowMemberList,
  showMemberList,
  setAgreementDetailModal,
  setShowCloseBtn,
}) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [filterDetails] = useState({
    name: '',
    clear: false,
  });
  const [userRoleId, setUserRoleId] = useState([]);
  const [disabledRoles, setdisabledRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBtn, setShowBtn] = useState(false);

  const getMembers = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });

      getAllMembers(
        showMemberList.agreement || showMemberList.requestApproval
          ? 'BGS Manager'
          : filterDetails.name.value,
        true,
        currentPage,
        searchQuery,
      ).then((response) => {
        setData(response && response.data && response.data.results);
        setCount(response && response.data && response.data.count);
        setPageNumber(currentPage);
        setIsLoading({ loader: false, type: 'page' });
      });
    },
    [
      searchQuery,
      filterDetails.name.value,
      showMemberList.agreement,
      showMemberList.requestApproval,
    ],
  );

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const saveNewMember = () => {
    setIsLoading({ loader: true, type: 'button' });
    const newMembersData = {
      customer: id,
      members: [
        { user: disabledRoles[0]?.['BGS Manager'], role_group: 'BGS Manager' },
      ],
    };

    addCustomerMembers(newMembersData).then(() => {
      if (!showMemberList.requestApproval) {
        getCustomerMemberList();
      }
      setShowCloseBtn(true);
      setIsLoading({ loader: false, type: 'button' });
      toast.success(`${userRoleId.length} Team Member(s) Added.`);
      const showAgreementModal = showMemberList.agreement;
      setShowMemberList({ add: false, show: false, modal: false });
      if (!showAgreementModal) setAgreementDetailModal({ pause: false });
      else setAgreementDetailModal(showAgreementModal);
    });
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getMembers(currentPage, searchQuery, filterDetails.name.value);
  };

  const searchList = (event) => {
    setSearchQuery(event.target.value);
    setIsLoading({ loader: true, type: 'page' });
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
        onClick={() => {
          setShowMemberList({
            show: false,
            add: false,
            modal: false,
          });
          setShowCloseBtn(true);
        }}
        role="presentation"
      />
      <div className={count > 9 ? 'modal-body pb-0' : 'modal-body'}>
        <h4>Add Team Member</h4>
        <div className="body-content mt-3 ">
          <>
            <div className="row">
              <div className="col-11 pr-0">
                <SearchInput className="mt-2">
                  <input
                    className="form-control search-filter "
                    placeholder="Search by name or email"
                    onChange={(event) => searchList(event)}
                  />
                  <img
                    src={SearchIcon}
                    alt="search"
                    className="search-input-icon"
                  />
                </SearchInput>
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
          <div className="modal-footer ml-5 mb-4">
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
  setAgreementDetailModal: () => {},
  setShowCloseBtn: () => {},
};

AddTeamMember.propTypes = {
  id: string,
  getCustomerMemberList: func,
  setShowMemberList: func,
  showMemberList: shape({
    agreement: shape({ id: string }),
    requestApproval: bool,
  }).isRequired,
  setAgreementDetailModal: func,
  setShowCloseBtn: func,
};
