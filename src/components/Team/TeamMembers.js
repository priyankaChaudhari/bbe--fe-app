/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import { shape, string, func } from 'prop-types';
import { DebounceInput } from 'react-debounce-input';

import { getAllMembers } from '../../api';
import { CloseIcon, SearchIcon, LeftArrowIcon } from '../../theme/images';
import {
  Button,
  ModalBox,
  GetInitialName,
  CommonPagination,
  InputSearchWithRadius,
} from '../../common';

// !      Remove  the eslint disables-once work is done

const TeamMembers = ({ customerID, currentMembers, setShowMemberList }) => {
  const [loading, setLoading] = useState(false);
  const [showCureentTeam, setShowCureentTeam] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [unassignedMembers, setUnassignedMembers] = useState([]);

  useEffect(() => {
    if (!showCureentTeam) {
      setLoading(true);
      getAllMembers(selectedRole, true).then((res) => {
        setUnassignedMembers(res.data.results);
        setLoading(false);
      });
    }
  }, [showCureentTeam, selectedRole]);

  const addMembersForRole = (member) => {
    setSelectedRole(member.role_group.id);
    setShowCureentTeam(false);
  };

  return (
    <ModalBox>
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon mr-3"
        onClick={() =>
          setShowMemberList({ add: false, show: false, modal: false })
        }
        role="presentation"
      />
      {loading ? (
        <h1>Loding...</h1>
      ) : (
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
            <div className="body-content ">
              <div className="row">
                {currentMembers.map((member) => {
                  return (
                    <div className="col-12 mb-3 " key={Math.random()}>
                      <div
                        className="edit-profile-text float-left"
                        role="presentation">
                        <GetInitialName
                          userInfo={member?.user}
                          property="mr-3"
                        />

                        <div className="name-email">
                          <div className="label m-0">
                            {member.role_group.name}
                          </div>
                          {member.id ? (
                            <div className="team-member-name text-bold">
                              {`${member.user?.first_name} ${member.user?.last_name}`}
                            </div>
                          ) : (
                            <div className="team-member-name">Unassigned</div>
                          )}
                        </div>
                      </div>
                      {member.id ? (
                        <Button className="btn-add-items gray-text  float-right roleName mt-3">
                          Remove
                        </Button>
                      ) : (
                        <Button
                          className="btn-add-items float-right  mt-3"
                          role="presentation"
                          onClick={() => addMembersForRole(member)}>
                          Add team member
                        </Button>
                      )}

                      <div className="clear-fix" />
                    </div>
                  );
                })}
              </div>
              <div className="footer-line " />
              <div className="modal-footer">
                <div className="row">
                  <div className="col-6">
                    <Button className=" btn-primary ">Confirm</Button>
                  </div>
                  <div className="col-6 text-center">
                    <Button className=" btn-borderless ">
                      {' '}
                      Discard Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Add or Search New Team members for selected Role */}
              <div className="body-content ">
                <InputSearchWithRadius
                  id="BT-addTeamMembers-search-input"
                  className="customer-list-header w-80 mt-3">
                  <DebounceInput
                    className=" form-control search-filter"
                    placeholder="Search"
                  />
                  <img
                    src={SearchIcon}
                    alt="search"
                    className="search-input-icon"
                  />
                </InputSearchWithRadius>
                <div className="horizontal-line straight-line mt-3 mb-3" />
                <div className="row">
                  {unassignedMembers.map((member) => {
                    return (
                      <div className="col-12 mb-3" key={member.id}>
                        <div
                          className="edit-profile-text float-left"
                          role="presentation">
                          <GetInitialName property="mr-3" />
                          <div className="name-email">
                            <div className="team-member-name">
                              {`${member?.first_name} ${member?.last_name}`}
                            </div>
                            {member.role[0]}
                          </div>
                        </div>
                        <Button
                          className="btn-add-items float-right  mt-3"
                          role="presentation">
                          Add
                        </Button>
                        <div className="clear-fix" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="footer-sticky">
                <div className="straight-line horizontal-line" />
                <CommonPagination
                  count={40}
                  pageNumber={1}
                  // handlePageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      )}
    </ModalBox>
  );
};

TeamMembers.propTypes = {
  customerID: string.isRequired,
  currentMembers: shape({}).isRequired,
  setShowMemberList: func.isRequired,
};

export default TeamMembers;
