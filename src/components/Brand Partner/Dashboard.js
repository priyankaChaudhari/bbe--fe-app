import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { DropDownSelect } from '../../common';
import Theme from '../../theme/Theme';
import { WhiteCard } from '../../theme/Global';
import {
  BrandLogo,
  RecurringIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '../../theme/images';

export default function Dashboard() {
  return (
    <BrandPartnerDashboard>
      <div className="dashboard-header-sticky">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <p className="black-heading-title ml-1 pt-1">
                {' '}
                Brand Partner Dashboard
              </p>
            </div>
            <div className="col-md-9 col-sm-12 text-md-right text-sm-left  mb-2 ">
              <ul className="partner-select">
                <li className="partner">
                  <DropDownSelect>
                    <Select classNamePrefix="react-select" className="active" />
                  </DropDownSelect>
                </li>
                <li>
                  <DropDownSelect>
                    <Select classNamePrefix="react-select" className="active" />
                  </DropDownSelect>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="straight-line horizontal-line mt-n2" />
      </div>
      <DashboardCard>
        <div className="dashboard-body">
          <div className="row">
            <div className="col-lg-3 mb-4 col-md-6 col-sm-12">
              <WhiteCard>
                <img className="company-logo" src={BrandLogo} alt="logo" />

                <div className="company-name">TRX Training</div>
                <div className="status">Health_Wellness_And_Fitness</div>
                <div className="straight-line horizontal-line spacing " />
                <div className="row">
                  <div className="col-12 pt-1 pb-1">
                    <img className="solid-icon " src={RecurringIcon} alt="" />
                    <p className="black-heading-title mt-0 mb-0">Recurring</p>

                    <ul className="recurring-contact ">
                      <li>
                        <p className="basic-text ">12 months</p>
                      </li>

                      <li>
                        <p className="basic-text ">Started Mar 21, 2020</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="straight-line horizontal-line spacing " />
                <div className="row">
                  <div className="col-6">
                    <div className="card-label">Revenue</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">$22,147.52</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Units Sold</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">268</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />

                  <div className="col-6">
                    <div className="card-label">Traffic</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>

                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Conversion</div>
                    <div className="decrease-rate">
                      <img
                        className="red-arrow"
                        src={ArrowDownIcon}
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>
                </div>
              </WhiteCard>
            </div>
            <div className="col-lg-3 mb-4 col-md-6 col-sm-12">
              <WhiteCard>
                <img className="company-logo" src={BrandLogo} alt="logo" />

                <div className="company-name">TRX Training</div>
                <div className="status">Health_Wellness_And_Fitness</div>
                <div className="straight-line horizontal-line spacing " />
                <div className="row">
                  <div className="col-12 pt-1 pb-1">
                    <img className="solid-icon " src={RecurringIcon} alt="" />
                    <p className="black-heading-title mt-0 mb-0">Recurring</p>

                    <ul className="recurring-contact ">
                      <li>
                        <p className="basic-text ">12 months</p>
                      </li>

                      <li>
                        <p className="basic-text ">Started Mar 21, 2020</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="straight-line horizontal-line spacing" />
                <div className="row">
                  <div className="col-6">
                    <div className="card-label">Revenue</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">$22,147.52</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Units Sold</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">268</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />

                  <div className="col-6">
                    <div className="card-label">Traffic</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>

                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Conversion</div>
                    <div className="decrease-rate">
                      <img
                        className="red-arrow"
                        src={ArrowDownIcon}
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>
                </div>
              </WhiteCard>
            </div>
            <div className="col-lg-3 mb-4 col-md-6 col-sm-12">
              <WhiteCard>
                <img className="company-logo" src={BrandLogo} alt="logo" />

                <div className="company-name">TRX Training</div>
                <div className="status">Health_Wellness_And_Fitness</div>
                <div className="straight-line horizontal-line spacing " />
                <div className="row">
                  <div className="col-12 pt-1 pb-1">
                    <img className="solid-icon " src={RecurringIcon} alt="" />
                    <p className="black-heading-title mt-0 mb-0">Recurring</p>

                    <ul className="recurring-contact ">
                      <li>
                        <p className="basic-text ">12 months</p>
                      </li>

                      <li>
                        <p className="basic-text ">Started Mar 21, 2020</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="straight-line horizontal-line spacing" />
                <div className="row">
                  <div className="col-6">
                    <div className="card-label">Revenue</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">$22,147.52</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Units Sold</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">268</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />

                  <div className="col-6">
                    <div className="card-label">Traffic</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>

                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Conversion</div>
                    <div className="decrease-rate">
                      <img
                        className="red-arrow"
                        src={ArrowDownIcon}
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>
                </div>
              </WhiteCard>
            </div>
            <div className="col-lg-3 mb-4 col-md-6 col-sm-12">
              <WhiteCard>
                <img className="company-logo" src={BrandLogo} alt="logo" />

                <div className="company-name">TRX Training</div>
                <div className="status">Health_Wellness_And_Fitness</div>
                <div className="straight-line horizontal-line spacing " />
                <div className="row">
                  <div className="col-12 pt-1 pb-1">
                    <img className="solid-icon " src={RecurringIcon} alt="" />
                    <p className="black-heading-title mt-0 mb-0">Recurring</p>

                    <ul className="recurring-contact ">
                      <li>
                        <p className="basic-text ">12 months</p>
                      </li>

                      <li>
                        <p className="basic-text ">Started Mar 21, 2020</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="straight-line horizontal-line spacing" />
                <div className="row">
                  <div className="col-6">
                    <div className="card-label">Revenue</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">$22,147.52</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Units Sold</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">268</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />

                  <div className="col-6">
                    <div className="card-label">Traffic</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>

                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Conversion</div>
                    <div className="decrease-rate">
                      <img
                        className="red-arrow"
                        src={ArrowDownIcon}
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>
                </div>
              </WhiteCard>
            </div>
            <div className="col-lg-3 mb-4 col-md-6 col-sm-12">
              <WhiteCard>
                <img className="company-logo" src={BrandLogo} alt="logo" />

                <div className="company-name">TRX Training</div>
                <div className="status">Health_Wellness_And_Fitness</div>
                <div className="straight-line horizontal-line spacing " />
                <div className="row">
                  <div className="col-12 pt-1 pb-1">
                    <img className="solid-icon " src={RecurringIcon} alt="" />
                    <p className="black-heading-title mt-0 mb-0">Recurring</p>

                    <ul className="recurring-contact ">
                      <li>
                        <p className="basic-text ">12 months</p>
                      </li>

                      <li>
                        <p className="basic-text ">Started Mar 21, 2020</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="straight-line horizontal-line spacing" />
                <div className="row">
                  <div className="col-6">
                    <div className="card-label">Revenue</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">$22,147.52</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Units Sold</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">268</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />

                  <div className="col-6">
                    <div className="card-label">Traffic</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>

                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Conversion</div>
                    <div className="decrease-rate">
                      <img
                        className="red-arrow"
                        src={ArrowDownIcon}
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>
                </div>
              </WhiteCard>
            </div>
            <div className="col-lg-3 mb-4 col-md-6 col-sm-12">
              <WhiteCard>
                <img className="company-logo" src={BrandLogo} alt="logo" />

                <div className="company-name">TRX Training</div>
                <div className="status">Health_Wellness_And_Fitness</div>
                <div className="straight-line horizontal-line spacing " />
                <div className="row">
                  <div className="col-12 pt-1 pb-1">
                    <img className="solid-icon " src={RecurringIcon} alt="" />
                    <p className="black-heading-title mt-0 mb-0">Recurring</p>

                    <ul className="recurring-contact ">
                      <li>
                        <p className="basic-text ">12 months</p>
                      </li>

                      <li>
                        <p className="basic-text ">Started Mar 21, 2020</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="straight-line horizontal-line spacing" />
                <div className="row">
                  <div className="col-6">
                    <div className="card-label">Revenue</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">$22,147.52</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Units Sold</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">268</div>
                    <div className="vs">vs 247</div>
                  </div>
                  <div className="straight-line horizontal-line spacing" />

                  <div className="col-6">
                    <div className="card-label">Traffic</div>
                    <div className="increase-rate">
                      <img
                        className="red-arrow"
                        src={ArrowUpIcon}
                        width="14px"
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price ">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>

                  <div className="straight-line horizontal-line spacing" />
                  <div className="col-6">
                    <div className="card-label">Conversion</div>
                    <div className="decrease-rate">
                      <img
                        className="red-arrow"
                        src={ArrowDownIcon}
                        alt="arrow-up"
                      />
                      4.75%
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="sold-price">22,496</div>
                    <div className="vs">vs 22,368</div>
                  </div>
                </div>
              </WhiteCard>
            </div>
          </div>
        </div>
      </DashboardCard>
    </BrandPartnerDashboard>
  );
}

const BrandPartnerDashboard = styled.div`
  padding-left: 62px;

  .partner-select {
    list-style-type: none;
    padding: 0;
    margin: 10px 0;
    li {
      display: inline-block;
      width: 220px;
      margin-right: 15px;

      &.partner {
        width: 230px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .text-md-right {
    text-align: right;
  }
  .text-sm-left {
    dispaly: none;
  }

  @media only screen and (max-width: 576px) {
    .text-md-right {
      dispaly: none;
    }
    .text-sm-left {
      text-align: left;
    }
  }
  @media only screen and (max-width: 991px) {
    padding-left: 0;
  }
`;

const DashboardCard = styled.div`
  background: #fafafb;

  .dashboard-body {
    max-width: 1334px;
    width: 100%;
    margin: 0 auto;
    padding-top: 40px;

    .company-logo {
      border-radius: 10px;
      width: 66px;
      height: 66px;
      // margin-right: 14px;
      margin-bottom: 8px;
    }

    .company-name {
      vertical-align: middle;
      position: relative;
      color: ${Theme.black};
      font-size: ${Theme.title};
      font-weight: 600;
    }

    .status {
      color: ${Theme.gray85};
      font-size: ${Theme.extraNormal};
    }

    .solid-icon {
      border-radius: 6px;
      width: 36px;
      height: 36px;
    }

    p.black-heading-title {
      font-size: 14px;
    }
    .card-label {
      color: #556178;
      font-size: 11px;
      font-family: ${Theme.titleFontFamil};
      text-transform: uppercase;
      font-weight: 800;
      margin-bottom: 5px;
    }
    .sold-price {
      color: #333333;
      font-size: 20px;
      font-weight: 500;
    }
    .vs {
      color: #556178;
      font-size: 15px;
    }
    .spacing {
      margin: 9px 0 9px 0;
    }
  }
  @media only screen and (max-width: 991px) {
    .dashboard-body {
      padding-top: 20px;
    }
  }

  @media only screen and (min-width: 1600px) {
    .dashboard-body {
      max-width: 1434px;
    }
  }

  @media only screen and (min-width: 1700px) and (min-width: 1920px) {
    .dashboard-body {
      max-width: 85%;
    }
  }
`;
