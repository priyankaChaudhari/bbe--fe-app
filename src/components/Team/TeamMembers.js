/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import { DebounceInput } from 'react-debounce-input';

import { CloseIcon, SearchIcon, LeftArrowIcon } from '../../theme/images';
import {
  Button,
  ModalBox,
  GetInitialName,
  CommonPagination,
  InputSearchWithRadius,
} from '../../common';

import { currentTeamMembers, allUsers } from './dummyData';

const TeamMembers = () => {
  const [showCureentTeam, setShowCureentTeam] = useState(true);

  return (
    <ModalBox>
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon mr-3"
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
          <div className="body-content ">
            <div className="row">
              {currentTeamMembers.map((member) => {
                return (
                  <div className="col-12 mb-3 " key={Math.random()}>
                    <div
                      className="edit-profile-text float-left"
                      role="presentation">
                      <GetInitialName property="mr-3" />

                      <div className="name-email">
                        <div className="label m-0">
                          {member.role_group.name}
                        </div>
                        {member.id ? (
                          <div className="team-member-name text-bold">
                            {member.user.name}
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
                        onClick={() => setShowCureentTeam(false)}>
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
                  <Button className=" btn-borderless "> Discard Changes</Button>
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
                {allUsers.map((member) => {
                  return (
                    <div className="col-12 mb-3" key={member.id}>
                      <div
                        className="edit-profile-text float-left"
                        role="presentation">
                        <GetInitialName property="mr-3" />
                        <div className="name-email">
                          <div className="team-member-name">{member.name}</div>
                          {member.role}
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
    </ModalBox>
  );
};

export default TeamMembers;
