import React, { useState, useEffect, useCallback } from 'react';

import { toast } from 'react-toastify';
import { string, func, shape, bool } from 'prop-types';

import AddTeamMember from './AddTeamMember';
import { TrashIcons, AddIcons, CloseIcon } from '../../theme/images';
import {
  deleteCustomerMember,
  getCustomerMembers,
  updateCustomerMember,
} from '../../api';
import {
  Button,
  CommonPagination,
  ModalBox,
  PageLoader,
  SuccessMsg,
  GetInitialName,
} from '../../common';

export default function EditTeamMember({
  id,
  getCustomerMemberList,
  setShowMemberList,
  showMemberList,
  setTeamDeleteModal,
  userInfo,
  getActivityLogInfo,
}) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [removeMember, setRemoveMember] = useState({
    show: false,
    id: '',
    name: '',
  });
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [showBtn, setShowBtn] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const getMembers = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });
      getCustomerMembers(id, currentPage).then((response) => {
        setData(response && response.data && response.data.results);
        setCount(response && response.data && response.data.count);
        setPageNumber(currentPage);
        setIsLoading({ loader: false, type: 'page' });
        setIsLoading({ loader: false, type: 'button' });
      });
    },
    [id],
  );

  useEffect(() => {
    if (showMemberList.show && showMemberList.modal) getMembers(1);
  }, [getMembers, showMemberList.show, showMemberList.modal]);

  const deleteMember = () => {
    setRemoveMember({ ...removeMember, show: true });
    setIsLoading({ loader: true, type: 'button' });
    deleteCustomerMember(removeMember.id).then(() => {
      toast.success('Team Member Removed.');
      setIsLoading({ loader: false, type: 'button' });
      getCustomerMemberList();
      getActivityLogInfo();
      getMembers(1);
      setRemoveMember({ id: '', name: '', show: false });
      setShowSuccessMsg(true);
      setTeamDeleteModal(false);
    });
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getMembers(currentPage);
  };

  const updateMember = () => {
    setIsLoading({ loader: true, type: 'button' });
    updateCustomerMember(formData).then((response) => {
      if (response && response.status === 200) {
        toast.success('Team Member Updated.');
        setFormData({});
        getMembers(pageNumber);
        setShowBtn(false);
        getCustomerMemberList();
        getActivityLogInfo();
      } else {
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <>
      {showMemberList.add ? (
        <AddTeamMember id={id} />
      ) : (
        <>
          {!removeMember.show ? (
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
              {isLoading.loader && isLoading.type === 'page' ? (
                <PageLoader
                  className="modal-loader"
                  component="modal"
                  color="#FF5933"
                  type="page"
                  width={40}
                />
              ) : (
                <>
                  <div className="modal-body pb-0">
                    <div className="row">
                      <div
                        className={
                          showSuccessMsg ? 'col-12 pb-2' : 'col-12 pb-2'
                        }>
                        <h4>Team Members</h4>
                        <div className="success-msg">
                          {showSuccessMsg ? (
                            <SuccessMsg
                              property=""
                              message="Team Member Removed."
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="body-content mt-3">
                      {data &&
                        data.map((item) => (
                          <div className="row">
                            <div
                              className="col-12 team-member-list pt-4"
                              key={item.id}>
                              <div className="edit-profile-text float-left">
                                <GetInitialName
                                  userInfo={item.user_profile}
                                  property="mr-3"
                                />

                                <div className="name-email">
                                  <div className="team-member-name">
                                    {(item.user_profile &&
                                      item.user_profile.first_name) ||
                                      ' '}{' '}
                                    {(item.user_profile &&
                                      item.user_profile.last_name) ||
                                      ' '}
                                  </div>
                                  {(item.user_profile &&
                                    item.user_profile.email) ||
                                    ' '}
                                </div>
                              </div>
                              <div className="float-right role-selected mr-5 mt-3">
                                {(item.user_profile &&
                                  item.user_profile.role) ||
                                  ''}
                              </div>
                              <div className="clear-fix" />
                              {userInfo && userInfo.role !== 'Customer' ? (
                                <img
                                  src={TrashIcons}
                                  alt="delete"
                                  className="trash-icons cursor "
                                  onClick={() => {
                                    setRemoveMember({
                                      show: true,
                                      id: item.id,
                                      name: `${item.user_profile.first_name} ${item.user_profile.last_name}`,
                                    });
                                    setTeamDeleteModal(true);
                                  }}
                                  role="presentation"
                                />
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        ))}
                      {data && data.length === 0 ? (
                        <div className="text-center mt-3">No Member found.</div>
                      ) : (
                        ''
                      )}

                      {userInfo && userInfo.role !== 'Customer' ? (
                        <Button
                          className=" btn-add w-100 mt-4 mb-3"
                          onClick={() =>
                            setShowMemberList({
                              show: false,
                              add: true,
                              modal: true,
                            })
                          }>
                          {' '}
                          <img
                            src={AddIcons}
                            alt="add"
                            className="add-user mr-2"
                          />
                          Add New Team Member
                        </Button>
                      ) : (
                        <div className="mt-4 mb-3" />
                      )}
                    </div>
                  </div>
                  {showBtn ? (
                    <>
                      <div className="footer-line " />
                      <div className="modal-footer">
                        <Button
                          className=" btn-primary mr-4"
                          onClick={() => updateMember()}>
                          {isLoading.loader && isLoading.type === 'button' ? (
                            <PageLoader color="#fff" type="button" />
                          ) : (
                            'Save Changes'
                          )}
                        </Button>

                        <Button
                          className=" btn-borderless"
                          onClick={() =>
                            setShowMemberList({
                              show: false,
                              add: false,
                              modal: false,
                            })
                          }>
                          Discard Changes
                        </Button>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                  <div className="modal-body pt-0 pb-0">
                    <CommonPagination
                      count={count}
                      pageNumber={pageNumber}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </ModalBox>
          ) : (
            <ModalBox>
              <div className="modal-body">
                <div className="alert-msg   ">
                  <span>
                    You&apos;re about to remove {removeMember.name}, are you
                    sure you want to do this?
                  </span>
                </div>
                <div className="text-center mb-1 pb-2">
                  <Button
                    type="button"
                    className="btn-primary mr-3"
                    onClick={() => deleteMember()}>
                    {isLoading.loader && isLoading.type === 'button' ? (
                      <PageLoader color="#fff" type="button" />
                    ) : (
                      'Remove Team Member'
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="btn-transparent w-25"
                    onClick={() => {
                      setRemoveMember({ ...removeMember, show: false });
                      setTeamDeleteModal(false);
                      setShowSuccessMsg(false);
                    }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </ModalBox>
          )}
        </>
      )}
    </>
  );
}

EditTeamMember.defaultProps = {
  id: '',
  getCustomerMemberList: () => {},
  setShowMemberList: () => {},
  showMemberList: {},
  setTeamDeleteModal: () => {},
};

EditTeamMember.propTypes = {
  id: string,
  getCustomerMemberList: func,
  setShowMemberList: func,
  showMemberList: shape({
    show: bool,
    add: bool,
  }),
  setTeamDeleteModal: func,
  userInfo: shape({
    role: string,
  }).isRequired,
  getActivityLogInfo: func.isRequired,
};
