import React from 'react';

// import { DebounceInput } from 'react-debounce-input';

import { CloseIcon } from '../../theme/images';
import { ModalBox, GetInitialName, Button } from '../../common';

const TeamMembers = () => {
  return (
    <ModalBox>
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon mr-3"
        role="presentation"
      />
      <div className="modal-body pb-0">
        <h4 className="mb-4">Team Members</h4>
        {/* <h4>
          {' '}
          <img
            width="16px"
            style={{ verticalAlign: 'bottom' }}
            className="left-arrow mr-1"
            src={LeftArrowIcon}
            alt="arrow"
          />
          Back To Team Members
        </h4> */}

        <div className="body-content ">
          <div className="row">
            <div className="col-12 mb-3">
              <div className="edit-profile-text float-left" role="presentation">
                <GetInitialName property="mr-3" />

                <div className="name-email">
                  <div className="label m-0"> BGS Manager</div>
                  <div className="team-member-name text-bold">Troy Dyches</div>
                </div>
              </div>

              <div className="float-right roleName mt-3">Remove</div>
              <div className="clear-fix" />
            </div>
            <div className="col-12 mb-3">
              <div className="edit-profile-text float-left" role="presentation">
                <GetInitialName property="mr-3" />

                <div className="name-email">
                  <div className="label m-0"> BGS</div>
                  <div className="team-member-name text-bold">
                    {' '}
                    Marcus Tedesco
                  </div>
                </div>
              </div>

              <div className="float-right roleName mt-3">Remove</div>
              <div className="clear-fix" />
            </div>
            <div className="col-12 mb-3">
              <div className="edit-profile-text float-left" role="presentation">
                <GetInitialName property="mr-3" />

                <div className="name-email">
                  <div className="label m-0"> Sponsored Ad Manager</div>
                  <div className="team-member-name text-bold">
                    {' '}
                    Neli Nonkonyana
                  </div>
                </div>
              </div>

              <div className="float-right roleName mt-3">Remove</div>
              <div className="clear-fix" />
            </div>
            <div className="col-12 mb-3">
              <div className="edit-profile-text float-left" role="presentation">
                <GetInitialName property="mr-3" />

                <div className="name-email">
                  <div className="label m-0"> DSP Ad Manager</div>
                  <div className="team-member-name text-bold">Ben Bradley</div>
                </div>
              </div>

              <div className="float-right roleName mt-3">Remove</div>
              <div className="clear-fix" />
            </div>
            <div className="col-12 mb-3">
              <div
                className="edit-profile-text float-left disabled"
                role="presentation">
                <GetInitialName property="mr-3" />

                <div className="name-email">
                  <div className="label m-0">Creative</div>
                  <div className="team-member-name">Unassigned</div>
                </div>
              </div>

              <div className="float-right roleName add-team-member mt-3">
                Add team member
              </div>
              <div className="clear-fix" />
            </div>
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

        {/* <div className="body-content ">
          <div className="horizontal-line straight-line mt-3 mb-3" />
          <InputSearchWithRadius
            id="BT-order-customerlist-search-input"
            className="customer-list-header w-80">
            <DebounceInput
              className=" form-control search-filter"
              placeholder="Search"
            />
            <img src={SearchIcon} alt="search" className="search-input-icon" />
          </InputSearchWithRadius>
          <div className="horizontal-line straight-line mt-3 mb-3" />
          <div className="row">
            <div className="col-12 mb-3">
              <div className="edit-profile-text float-left" role="presentation">
                <GetInitialName property="mr-3" />
                <div className="name-email">
                  <div className="team-member-name">DSP Ad Manager</div>
                  Creative
                </div>
              </div>
              <div className="float-right roleName add-team-member mt-3">
                Add
              </div>
              <div className="clear-fix" />
            </div>
            <div className="col-12 mb-3">
              <div className="edit-profile-text float-left" role="presentation">
                <GetInitialName property="mr-3" />
                <div className="name-email">
                  <div className="team-member-name">DSP Ad Manager</div>
                  Creative
                </div>
              </div>
              <div className="float-right roleName add-team-member mt-3">
                Add
              </div>
              <div className="clear-fix" />
            </div>
            <div className="col-12 mb-3">
              <div className="edit-profile-text float-left" role="presentation">
                <GetInitialName property="mr-3" />
                <div className="name-email">
                  <div className="team-member-name">DSP Ad Manager</div>
                  Creative
                </div>
              </div>
              <div className="float-right roleName add-team-member mt-3">
                Add
              </div>
              <div className="clear-fix" />
            </div>
          </div>
        </div> */}
      </div>
    </ModalBox>
  );
};

export default TeamMembers;
