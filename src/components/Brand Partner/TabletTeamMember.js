import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { ActionDropDown, WhiteCard } from '../../common';
import Theme from '../../theme/Theme';
import { CompanyDefaultUser, BrandLogo } from '../../theme/images';

export default function TabletTeamMember() {
  return (
    <TabletTeamMemberView>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <WhiteCard className="mt-2">
            {' '}
            <img className="company-logo" src={CompanyDefaultUser} alt="logo" />
            <div className="company-name">Wilhelm Dowall</div>
            <div className="status" style={{ textTransform: 'capitalize' }}>
              Brand Growth Strategist
            </div>
            <div className="user-email">wdowall@buyboxexperts.com</div>{' '}
            <div className="clear-fix" />
            <div className=" straight-line horizontal-line pt-3 mb-3 " />
            <div className="row">
              <div className="col-6">
                <ul className="brand-partner">
                  <li>
                    <img
                      className="brand-logo"
                      src={CompanyDefaultUser}
                      alt="brand"
                    />
                  </li>
                  <li>
                    <img className="brand-logo" src={BrandLogo} alt="brand" />
                  </li>
                  <li>
                    <img
                      className="brand-logo"
                      src={CompanyDefaultUser}
                      alt="brand"
                    />
                  </li>
                </ul>
              </div>
              <div className="col-6 text-right">
                {' '}
                <ActionDropDown className="w-150">
                  {' '}
                  <Select
                    classNamePrefix="react-select"
                    placeholder="Actions"
                    className="active"
                  />
                </ActionDropDown>
              </div>
            </div>
          </WhiteCard>
        </div>
      </div>
    </TabletTeamMemberView>
  );
}

const TabletTeamMemberView = styled.div`
  background: #fafafb;
  height: 100%;
  .company-logo {
    border-radius: 10px;
    width: 45px;
    height: 45px;
    margin-right: 14px;
    float: left;
  }
  .company-name {
    min-height: 20px;
    color: ${Theme.black};
    font-size: ${Theme.extraMedium};
    font-weight: 600;
  }

  .status {
    color: ${Theme.gray85};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
  }
  .user-email {
    font-size: ${Theme.normal};
    font-weight: 300;
    color: ${Theme.gray85};
  }
  .brand-partner {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      display: inline-block;
      margin-right: 3px;

      .brand-logo {
        width: 33px;
        height: 33px;
        border-radius: 50%;
      }
    }
  }
`;
