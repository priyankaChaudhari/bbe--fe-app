import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { shape, string, func, arrayOf } from 'prop-types';
import { DebounceInput } from 'react-debounce-input';

import { getAllMembers, addCustomerMembers } from '../../api';
import { CloseIcon, SearchIcon, LeftArrowIcon } from '../../theme/images';
import {
  Button,
  ModalBox,
  PageLoader,
  GetInitialName,
  CommonPagination,
  InputSearchWithRadius,
} from '../../common';

// Both the Showing Current Assigned Team Members & New Members to add are in this component
// There are two lists to handle here 1.assignedMemebers (current team members) &  2. newly Added member list which we will submit on confirm (bulk-create)

const TeamMembers = ({
  customerID,
  currentMembers,
  setShowMemberList,
  getCustomerMemberList,
}) => {
  const [loading, setLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [assignedMembers, setAssignedMembers] = useState(currentMembers);
  const [showCureentTeam, setShowCureentTeam] = useState(true);
  const [selectedRole, setSelectedRole] = useState({});
  const [unassignedMembers, setUnassignedMembers] = useState([]);
  const [newMembers, setNewMembers] = useState([]);
  const [pageNumber, setPageNumber] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get un-assigned members for current BP
    if (!showCureentTeam) {
      setLoading(true);
      getAllMembers(selectedRole.id, true, pageNumber, searchQuery).then(
        (res) => {
          setTotalCount(res.data.count);
          setUnassignedMembers(res.data.results);
          setLoading(false);
        },
      );
    }
  }, [showCureentTeam, selectedRole, pageNumber, searchQuery]);

  // Show un-assigned members for current BP
  const showUnassignedMembers = (member) => {
    setSelectedRole({ ...member.role_group });
    setShowCureentTeam(false);
  };

  // Add New members to Team
  const addNewMembers = (member) => {
    // Add New members in temporary
    const tempMembers = [...newMembers];
    tempMembers.push({ user: member.id, role_group: selectedRole.id });

    // Also add newly added member in Current Assigned List (Main List)
    const newlyAssigned = assignedMembers.map((oldMember) => {
      if (oldMember.role_group.id === selectedRole.id) {
        return {
          id: Math.random(),
          user: {
            id: member.id,
            first_name: member.first_name,
            last_name: member.last_name,
            email: member.email,
            documents: member.documents,
          },
          role_group: {
            id: selectedRole.id,
            name: selectedRole.name,
          },
        };
      }
      return oldMember;
    });

    // Set New Members to old Team List & updated list (data submit)
    setAssignedMembers([...newlyAssigned]);
    setNewMembers([...tempMembers]);
    setPageNumber();
    setShowCureentTeam(true);
  };

  // Remove Team members
  const removeTeamMember = (member) => {
    const membersAfterRemove = assignedMembers.map((oldMember) => {
      if (oldMember.id === member.id) {
        return {
          role_group: oldMember.role_group,
        };
      }
      return oldMember;
    });

    // Set it in temporary list when we submit data
    const tempMembers = [...newMembers];
    tempMembers.push({ role_group: member.role_group.id });

    setAssignedMembers([...membersAfterRemove]);
    setNewMembers([...tempMembers]);
  };

  const saveTeamChanges = () => {
    const newMembersData = {
      customer: customerID,
      members: newMembers,
    };
    setButtonLoader(true);

    addCustomerMembers(newMembersData).then(() => {
      setButtonLoader(false);
      setShowMemberList({ add: false, show: false, modal: false });
      toast.success('Team Member(s) updated.');
      getCustomerMemberList();
    });
  };

  const discardChanges = () => {
    setAssignedMembers(currentMembers);
    setNewMembers([]);
  };

  const handlePageChange = (currentPage) => {
    setLoading(true);
    setPageNumber(currentPage);
    getAllMembers(selectedRole.id, true, currentPage, searchQuery).then(
      (res) => {
        setTotalCount(res.data.count);
        setUnassignedMembers(res.data.results);
        setLoading(false);
      },
    );
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    event.persist();
    setLoading(true);
    setTimeout(() => {
      getAllMembers(selectedRole.id, true, '', event.target.value).then(
        (res) => {
          setTotalCount(res.data.count);
          setUnassignedMembers(res.data.results);
          setLoading(false);
        },
      );
    }, 1000);
  };

  return (
    <ModalBox>
      <img
        src={CloseIcon}
        alt="close"
        className=" cursor cross-icon mr-3 float-right"
        onClick={() =>
          setShowMemberList({ add: false, show: false, modal: false })
        }
        role="presentation"
      />
      <div className="modal-body pb-0">
        {showCureentTeam ? (
          <h4 className="mb-4">Team Members</h4>
        ) : (
          <Button
            className="btn-add-items back-btn"
            onClick={() => setShowCureentTeam(true)}>
            {' '}
            <img
              width="16px"
              style={{ verticalAlign: 'bottom' }}
              className="left-arrow back-to-members mr-1"
              src={LeftArrowIcon}
              alt="arrow"
            />
            <span className="back-to-members">Back To Team Members</span>
          </Button>
        )}

        {/* List of current Team members with specific Role */}
        {showCureentTeam ? (
          <>
            <div className="body-content ">
              <div className="row">
                {assignedMembers.map((member) => {
                  return (
                    <React.Fragment key={Math.random()}>
                      <div className="col-8 mb-3 ">
                        <div className="edit-profile-text" role="presentation">
                          <GetInitialName
                            userInfo={member?.user}
                            property={`mr-3 ${member?.id ? '' : 'unassigned'}`}
                          />

                          <div className="name-email">
                            <div className="label m-0">
                              {member?.role_group?.name}
                            </div>
                            {member.id ? (
                              <div className="team-member-name text-medium">
                                {`${member?.user?.first_name} ${member?.user?.last_name}`}
                              </div>
                            ) : (
                              <div className="team-member-name text-medium disabled-tab">
                                Unassigned
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-4 text-right">
                        {member.id ? (
                          <Button
                            className="btn-add-items gray-text   roleName mt-3"
                            onClick={() => removeTeamMember(member)}>
                            Remove
                          </Button>
                        ) : (
                          <Button
                            className="btn-add-items   mt-3"
                            role="presentation"
                            onClick={() => showUnassignedMembers(member)}>
                            Add team member
                          </Button>
                        )}

                        <div className="clear-fix" />
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="footer-line " />
            <div className="modal-footer">
              <div className="row">
                <div className="col-12 col-md-6 px-0">
                  <Button
                    className={`btn-primary w-sm-100 ${
                      newMembers.length === 0 ? 'disabled' : ''
                    }`}
                    onClick={() => saveTeamChanges()}>
                    {buttonLoader ? (
                      <PageLoader color="#fff" type="button" />
                    ) : (
                      <>Confirm</>
                    )}
                  </Button>
                </div>
                <div className="col-12 col-md-6 text-center">
                  <Button
                    className=" btn-borderless w-sm-100"
                    onClick={() => discardChanges()}>
                    {' '}
                    Discard Changes
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* $$$$$$$$$$$$$$$$ Add or Search New Team members for selected Role $$$$$$$$$$$$$$$$$$$ */}
            <div className="body-content ">
              <InputSearchWithRadius
                id="BT-addTeamMembers-search-input"
                className="customer-list-header w-80 mt-3">
                <DebounceInput
                  className=" form-control search-filter"
                  placeholder="Search"
                  onChange={(event) => handleSearch(event)}
                  value={searchQuery || ''}
                />
                <img
                  src={SearchIcon}
                  alt="search"
                  className="search-input-icon"
                />
              </InputSearchWithRadius>{' '}
              {loading ? (
                <PageLoader
                  component="member"
                  color="#FF5933"
                  type="page"
                  height={40}
                />
              ) : unassignedMembers?.length === 0 ? (
                <div className="text-center no-result-found mt-5">
                  No User Found.
                </div>
              ) : (
                <>
                  <div className="horizontal-line straight-line mt-3 mb-3" />
                  <div className="row">
                    {unassignedMembers.map((member) => {
                      return (
                        <React.Fragment key={member.id}>
                          <div className="col-8 mb-3">
                            <div
                              className="edit-profile-text "
                              role="presentation">
                              <GetInitialName
                                userInfo={member}
                                property="mr-3"
                              />
                              <div className="name-email">
                                <div className="team-member-name text-medium">
                                  {`${member?.first_name} ${member?.last_name}`}
                                </div>
                                {member.role}
                              </div>
                            </div>
                          </div>
                          <div className="col-4 text-right">
                            <Button
                              className="btn-add-items   mt-3"
                              role="presentation"
                              onClick={() => addNewMembers(member)}>
                              Add
                            </Button>
                            <div className="clear-fix" />
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            {!loading && unassignedMembers?.length !== 0 && totalCount > 10 ? (
              <div className="footer-sticky">
                <div className="straight-line horizontal-line" />
                <CommonPagination
                  count={totalCount}
                  pageNumber={pageNumber}
                  handlePageChange={handlePageChange}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </ModalBox>
  );
};

TeamMembers.propTypes = {
  customerID: string.isRequired,
  currentMembers: arrayOf(shape({})).isRequired,
  setShowMemberList: func.isRequired,
  getCustomerMemberList: func.isRequired,
};

export default TeamMembers;
