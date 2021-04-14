import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import {
  DropDownSelect,
  InputSearchWithRadius,
  Table,
  ActionDropDown,
  CommonPagination,
  ModalBox,
  Button,
  GetInitialName,
  GreyCard,
} from '../../common';
import Theme from '../../theme/Theme';

import {
  InfoIcon,
  SearchIcon,
  CompanyDefaultUser,
  BrandLogo,
  CloseIcon,
  ArrowRightIcon,
  ArrowRightBlackIcon,
} from '../../theme/images';
import TabletTeamMember from './TabletTeamMember';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    // minHeight: '200px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function TeamMember() {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <BrandPartnerTeamMember>
        <div className="dashboard-header-sticky">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2 col-sm-12">
                <p className="black-heading-title ml-1 pt-1"> Team Members</p>
              </div>
              <div className="col-md-10 col-sm-12 text-right   mb-2 ">
                <ul className="team-header">
                  <li className="search-input">
                    <InputSearchWithRadius className="customer-list-header w-80">
                      <input
                        className=" form-control search-filter"
                        placeholder="Search"
                      />

                      <img
                        src={InfoIcon}
                        alt="search cursor"
                        data-tip="Search by Company Name, Contact First, Last Name or Email"
                        data-for="info"
                        className="info-icon"
                      />

                      <img
                        src={SearchIcon}
                        alt="search"
                        className="search-input-icon"
                      />
                    </InputSearchWithRadius>
                  </li>
                  <li className="sort-select">
                    <DropDownSelect>
                      <Select
                        classNamePrefix="react-select"
                        className="active"
                      />
                    </DropDownSelect>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="straight-line horizontal-line mt-n2" />
        </div>
        {isDesktop ? (
          <div className="table-container">
            <div className="table-part">
              <Table>
                {' '}
                <thead>
                  <tr className="table-header">
                    <th width="20%" className="customer-header">
                      Team Member
                    </th>
                    <th width="20%">Email</th>
                    <th width="40%">Brand Partners</th>
                    <th width="20%"> &nbsp; </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {' '}
                      <img
                        className="company-logo"
                        src={CompanyDefaultUser}
                        alt="logo"
                      />
                      <div className="company-name">Wilhelm Dowall </div>
                      <div
                        className="status"
                        style={{ textTransform: 'capitalize' }}>
                        Brand Growth Strategist
                      </div>
                    </td>
                    <td>
                      {' '}
                      <div className="user-email">
                        wdowall@buyboxexperts.com
                      </div>{' '}
                    </td>
                    <td>
                      <ul className="brand-partner">
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <ActionDropDown className="w-150">
                        {' '}
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Actions"
                          className="active"
                        />
                      </ActionDropDown>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {' '}
                      <img
                        className="company-logo"
                        src={CompanyDefaultUser}
                        alt="logo"
                      />
                      <div className="company-name">Wilhelm Dowall </div>
                      <div
                        className="status"
                        style={{ textTransform: 'capitalize' }}>
                        Brand Growth Strategist
                      </div>
                    </td>
                    <td>
                      {' '}
                      <div className="user-email">
                        wdowall@buyboxexperts.com
                      </div>{' '}
                    </td>
                    <td>
                      <ul className="brand-partner">
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <ActionDropDown className="w-150">
                        {' '}
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Actions"
                          className="active"
                        />
                      </ActionDropDown>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {' '}
                      <img
                        className="company-logo"
                        src={CompanyDefaultUser}
                        alt="logo"
                      />
                      <div className="company-name">Wilhelm Dowall </div>
                      <div
                        className="status"
                        style={{ textTransform: 'capitalize' }}>
                        Brand Growth Strategist
                      </div>
                    </td>
                    <td>
                      {' '}
                      <div className="user-email">
                        wdowall@buyboxexperts.com
                      </div>{' '}
                    </td>
                    <td>
                      <ul className="brand-partner">
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <ActionDropDown className="w-150">
                        {' '}
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Actions"
                          className="active"
                        />
                      </ActionDropDown>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {' '}
                      <img
                        className="company-logo"
                        src={CompanyDefaultUser}
                        alt="logo"
                      />
                      <div className="company-name">Wilhelm Dowall </div>
                      <div
                        className="status"
                        style={{ textTransform: 'capitalize' }}>
                        Brand Growth Strategist
                      </div>
                    </td>
                    <td>
                      {' '}
                      <div className="user-email">
                        wdowall@buyboxexperts.com
                      </div>{' '}
                    </td>
                    <td>
                      <ul className="brand-partner">
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <ActionDropDown className="w-150">
                        {' '}
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Actions"
                          className="active"
                        />
                      </ActionDropDown>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {' '}
                      <img
                        className="company-logo"
                        src={CompanyDefaultUser}
                        alt="logo"
                      />
                      <div className="company-name">Wilhelm Dowall </div>
                      <div
                        className="status"
                        style={{ textTransform: 'capitalize' }}>
                        Brand Growth Strategist
                      </div>
                    </td>
                    <td>
                      {' '}
                      <div className="user-email">
                        wdowall@buyboxexperts.com
                      </div>{' '}
                    </td>
                    <td>
                      <ul className="brand-partner">
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <ActionDropDown className="w-150">
                        {' '}
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Actions"
                          className="active"
                        />
                      </ActionDropDown>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {' '}
                      <img
                        className="company-logo"
                        src={CompanyDefaultUser}
                        alt="logo"
                      />
                      <div className="company-name">Wilhelm Dowall </div>
                      <div
                        className="status"
                        style={{ textTransform: 'capitalize' }}>
                        Brand Growth Strategist
                      </div>
                    </td>
                    <td>
                      {' '}
                      <div className="user-email">
                        wdowall@buyboxexperts.com
                      </div>{' '}
                    </td>
                    <td>
                      <ul className="brand-partner">
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <ActionDropDown className="w-150">
                        {' '}
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Actions"
                          className="active"
                        />
                      </ActionDropDown>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {' '}
                      <img
                        className="company-logo"
                        src={CompanyDefaultUser}
                        alt="logo"
                      />
                      <div className="company-name">Wilhelm Dowall </div>
                      <div
                        className="status"
                        style={{ textTransform: 'capitalize' }}>
                        Brand Growth Strategist
                      </div>
                    </td>
                    <td>
                      {' '}
                      <div className="user-email">
                        wdowall@buyboxexperts.com
                      </div>{' '}
                    </td>
                    <td>
                      <ul className="brand-partner">
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={CompanyDefaultUser}
                            alt="brand"
                          />
                        </li>
                        <li>
                          <img
                            className="brand-logo"
                            src={BrandLogo}
                            alt="brand"
                          />
                        </li>
                      </ul>
                    </td>
                    <td className="text-right">
                      <ActionDropDown className="w-150">
                        {' '}
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Actions"
                          className="active"
                        />
                      </ActionDropDown>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <Button
              className="light-orange sticky-btn   mt-3 mr-0 ml-5  on-boarding w-sm-50 "
              onClick={() => {
                setShowModal(true);
              }}>
              Send Reminder
            </Button>
            <div className="footer-sticky">
              <div className="straight-line horizontal-line" />
              <div className="container-fluid">
                <CommonPagination />
              </div>
            </div>
          </div>
        ) : (
          <TabletTeamMember />
        )}
      </BrandPartnerTeamMember>
      <Modal
        isOpen={showModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => setShowModal(false)}
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body pb-0">
            <h4 className="on-boarding mb-4">Reassign Brand Partners</h4>

            <div className="body-content">
              <div className="straight-line horizontal-line mb-2" />
              <ul className="select-new-owner">
                <li className="active">1. Select New Owner</li>
                <li>
                  <img
                    className="arrow-right-gray"
                    src={ArrowRightBlackIcon}
                    alt="arrow"
                  />
                  2. Select Brand Partners
                </li>
                <li>
                  <img
                    className="arrow-right-gray"
                    src={ArrowRightIcon}
                    alt="arrow"
                  />
                  3. Confirm
                </li>
              </ul>
              <div className="straight-line horizontal-line mt-2 mb-2" />
              <div className="row ">
                <div className="col-6 mt-3">
                  <div className="label-title mb-3">Existing owner</div>
                  <div
                    className="edit-profile-text float-left"
                    role="presentation">
                    <GetInitialName />

                    <div className="name-email brand-pratner ml-2">
                      <div className="team-member-name"> Wilhelm Dowall</div>
                      Brand Growth Strategist
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <GreyCard>
                    <div className="label-title mb-3">Existing owner</div>
                    <div
                      className="edit-profile-text float-left"
                      role="presentation">
                      <GetInitialName />

                      <div className="name-email brand-pratner ml-2">
                        <div className="team-member-name"> Wilhelm Dowall</div>
                        Brand Growth Strategist
                      </div>
                    </div>
                    <div className="clear-fix" />
                  </GreyCard>
                </div>
              </div>
              <div className="straight-line horizontal-line mt-2 mb-3" />
              <div className="row">
                <div className="col-12">
                  <GreyCard>
                    <div className="label-title mb-3">Team Member</div>
                    <div
                      className="edit-profile-text float-left"
                      role="presentation">
                      <GetInitialName />

                      <div className="name-email brand-pratner ml-2">
                        <div className="team-member-name"> Wilhelm Dowall</div>
                        Brand Growth Strategist
                      </div>
                    </div>
                    <div className="clear-fix" />
                  </GreyCard>
                </div>
              </div>
              <div className="straight-line horizontal-line mt-3 mb-2" />
              <div className="label-title mb-2 mt-4">
                Brand Partners being reassigned (3)
              </div>
              <div className="row">
                <div className="col-12 mt-3">
                  <div
                    className="edit-profile-text float-left"
                    role="presentation">
                    <GetInitialName />

                    <div className="name-email brand-pratner ml-2">
                      <div className="team-member-name"> Wilhelm Dowall</div>
                      Brand Growth Strategist
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-3">
                  <div
                    className="edit-profile-text float-left"
                    role="presentation">
                    <GetInitialName />

                    <div className="name-email brand-pratner ml-2">
                      <div className="team-member-name"> Wilhelm Dowall</div>
                      Brand Growth Strategist
                    </div>
                  </div>
                </div>
              </div>

              {/* <InputSearchWithRadius className="customer-list-header w-80">
                <input
                  className=" form-control search-filter"
                  placeholder="Search"
                />

                <img
                  src={SearchIcon}
                  alt="search"
                  className="search-input-icon"
                />
              </InputSearchWithRadius>

              <div className="straight-line horizontal-line mt-2 mb-3" />
              <CheckBox>
                <label className="check-container selected-list">
                  Select all (7)
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </CheckBox>
              <div className="row">
                <div className="col-12">
                  <CheckBoxList className="reassign-brand mt-3">
                    <div className="checkbox" role="presentation">
                      <input type="checkbox" defaultChecked />
                      <label>
                        <div
                          className="edit-profile-text float-left"
                          role="presentation">
                          <GetInitialName />

                          <div className="name-email brand-pratner ml-4">
                            <div className="team-member-name">
                              {' '}
                              TRX Training
                            </div>
                            Active
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="float-right role-selected light-bg gray mt-2">
                      Existing Owner
                    </div>
                    <div className="clear-fix" />
                  </CheckBoxList>
                </div>
                <div className="col-12">
                  <CheckBoxList className="reassign-brand mt-3">
                    <div className="checkbox" role="presentation">
                      <input type="checkbox" defaultChecked />
                      <label>
                        <div
                          className="edit-profile-text float-left"
                          role="presentation">
                          <GetInitialName />

                          <div className="name-email brand-pratner ml-4">
                            <div className="team-member-name">
                              {' '}
                              TRX Training
                            </div>
                            Active
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="float-right role-selected light-bg mt-2">
                      Selected
                    </div>
                    <div className="clear-fix" />
                  </CheckBoxList>
                </div>
                <div className="col-12">
                  <CheckBoxList className="reassign-brand mt-3">
                    <div className="checkbox" role="presentation">
                      <input type="checkbox" defaultChecked />
                      <label>
                        <div
                          className="edit-profile-text float-left"
                          role="presentation">
                          <GetInitialName />

                          <div className="name-email brand-pratner ml-4">
                            <div className="team-member-name">
                              {' '}
                              TRX Training
                            </div>
                            Active
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="float-right role-selected light-bg mt-2">
                      Selected
                    </div>
                    <div className="clear-fix" />
                  </CheckBoxList>
                </div>

                <div className="col-12">
                  <CheckBoxList className="reassign-brand mt-3">
                    <div className="checkbox" role="presentation">
                      <input type="checkbox" defaultChecked />
                      <label>
                        <div
                          className="edit-profile-text float-left"
                          role="presentation">
                          <GetInitialName />

                          <div className="name-email brand-pratner ml-4">
                            <div className="team-member-name">
                              {' '}
                              TRX Training
                            </div>
                            Active
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="float-right role-selected light-bg mt-2">
                      Selected
                    </div>
                    <div className="clear-fix" />
                  </CheckBoxList>
                </div>
              </div> */}
            </div>
          </div>
          <div className="footer-line  " />
          <div className="modal-footer pt-0">
            <p className="mt-0 text-center">3 Brand Partners Selected</p>
            <Button className=" btn-primary w-100 mr-4">Continue</Button>
          </div>
        </ModalBox>
      </Modal>
    </>
  );
}

const BrandPartnerTeamMember = styled.div`
  padding-left: 62px;

  .team-header {
    list-style-type: none;
    padding: 0;
    margin: 10px 0;
    li {
      display: inline-block;
      margin-right: 10px;

      &.sort-select {
        width: 259px;
      }
      &.search-input {
        width: 745px;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .dashboard-header-sticky {
    position: fixed;
    left: 64px;
    right: 0;
    z-index: 1;
    background-color: ${Theme.white};
  }
  .table-part {
    padding-top: 65px;
    overflow: auto;
    min-height: 892px;
    height: 100%;
    padding-bottom: 69px;
    position: relative;
  }
  .footer-sticky {
    position: fixed;
    bottom: 0;
    left: 353px;
    right: 0;
    background: white;
  }
`;
