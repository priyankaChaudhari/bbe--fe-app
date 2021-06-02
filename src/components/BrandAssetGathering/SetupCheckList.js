/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Theme from '../../theme/Theme';
import { Button, PageLoader, WhiteCard } from '../../common';
import {
  DspOnlyIcon,
  RecurringIcon,
  ServiceIcon,
  SignatureIcon,
} from '../../theme/images';
import { getAgreementList, getAssigneeCount } from '../../api';
import { PATH_CHOOSE_BRAND_DELEGATE } from '../../constants';

export default function SetupCheckList({ id }) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [agreementData, setAgreementData] = useState({
    data: [],
    count: null,
    assigneeCount: null,
  });

  useEffect(() => {
    getAgreementList(id).then((response) => {
      setAgreementData({
        data: response.data && response.data.results,
        count: response.data && response.data.count,
      });
      getAssigneeCount(id).then((res) => {
        setAgreementData({
          data: response.data && response.data.results,
          count: response.data && response.data.count,
          assigneeCount: res && res.data,
        });
      });
      setIsLoading({ loader: false, type: 'page' });
    });
  }, [id]);

  const checkList = [
    {
      label: 'Sign Contract',
      active: true,
      subtitle: '1/1 Step completed by you',
      property: '',
    },
    {
      label: 'Complete Account Setup',
      active: true,
      subtitle:
        agreementData.assigneeCount && agreementData.assigneeCount.re_assigned
          ? `${
              agreementData.assigneeCount &&
              agreementData.assigneeCount.total_steps
            }/3 Steps completed by you and ${
              agreementData.assigneeCount.re_assigned
            } other`
          : `${
              agreementData.assigneeCount &&
              agreementData.assigneeCount.total_steps
            }/3 Steps completed by you`,
      property: 'mt-3',
    },
  ];

  const countDays = (value) => {
    const date1 = new Date();
    const date2 = new Date(value);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="col-lg-8  col-12 mb-3">
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="detail" width={40} height={40} />
      ) : (
        <>
          <fieldset className="shape-without-border extra-radius">
            <div className="row">
              <div className="col-6">
                <p className="black-heading-title mt-2 mb-4">Setup Checklist</p>
              </div>
              <div className="col-6 text-right">
                <progress value="67" max="100" /> 67% Complete
              </div>
            </div>
            <div className="checklist-setup">
              {checkList.map((item) => (
                <GreenCheckBox className={item.property} key={item.label}>
                  <label className="cursor">
                    {item.label}
                    <div className="steps-completed">{item.subtitle}</div>
                    <input type="checkbox" checked={item.active} readOnly />
                    <span className="checkmark" />
                  </label>
                </GreenCheckBox>
              ))}

              <div className="row">
                <div className="col-8">
                  {' '}
                  <GreenCheckBox className="mt-3">
                    <label className="cursor">
                      Upload Brand Assets
                      <div className="steps-completed">
                        0/1 Steps completed by you{' '}
                      </div>
                      <input type="" defaultChecked={false} readOnly />
                      <span className="checkmark" />
                    </label>
                  </GreenCheckBox>
                </div>
                <Link to={PATH_CHOOSE_BRAND_DELEGATE.replace(':id', id)}>
                  <div className="col-4 mt-3">
                    <Button className="btn-primary ">Upload Assets</Button>
                  </div>
                </Link>
              </div>
            </div>
          </fieldset>
          <WhiteCard className="mt-3">
            <p className="black-heading-title mt-2 ">
              Active Agreement(s) ({agreementData.count})
            </p>
            <ActiveAgreementTable>
              <table>
                <tbody>
                  <tr>
                    <th width="40%">Agreement Type</th>
                    <th width="24%">Contract Status</th>
                    <th width="18%">Start Date</th>
                    <th width="18%">Expires in</th>
                  </tr>

                  {agreementData.data.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          className="solid-icon"
                          src={
                            item &&
                            item.contract_type &&
                            item.contract_type.toLowerCase().includes('one')
                              ? ServiceIcon
                              : item &&
                                item.contract_type &&
                                item.contract_type.toLowerCase().includes('dsp')
                              ? DspOnlyIcon
                              : RecurringIcon
                          }
                          alt="recurring"
                        />
                        <p className="black-heading-title recurring-service mt-2 mb-0">
                          {item &&
                          item.contract_type &&
                          item.contract_type.toLowerCase().includes('one')
                            ? 'One Time Service Agreement'
                            : item &&
                              item.contract_type &&
                              item.contract_type.toLowerCase().includes('dsp')
                            ? 'DSP Service Agreement'
                            : 'Recurring Service Agreement'}
                        </p>
                      </td>
                      <td>
                        <div className="sign-box">
                          {item.contract_status &&
                          item.contract_status.value === 'active' ? (
                            <>
                              <img
                                width="14px"
                                src={SignatureIcon}
                                alt="signature"
                              />{' '}
                              Signed
                            </>
                          ) : (
                            item.contract_status && item.contract_status.label
                          )}
                        </div>
                      </td>
                      <td>{dayjs(item.start_date).format('MMM DD, YYYY')}</td>
                      <td>
                        {item.contract_type &&
                        item.contract_type.includes('one')
                          ? 'N/A'
                          : `${countDays(item && item.end_date)} days`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ActiveAgreementTable>
          </WhiteCard>
          {/* <WhiteCard className="mt-3">
        <p className="black-heading-title mt-2 ">Creative Schedule</p>

        <p className="no-result-found  text-center mt-4 mb-4">
          Your creative schedule is being generated
        </p>
      </WhiteCard> */}
        </>
      )}
    </div>
  );
}

SetupCheckList.propTypes = {
  id: PropTypes.string.isRequired,
};

const GreenCheckBox = styled.div`
  
    display: block;
    position: relative;
    padding-left: 35px;
    padding-bottom: 15px;
    cursor: pointer;
    font-size: 14px;
    color : ${Theme.black};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-weight: 600;
    border-bottom: 1px dotted #BFC5D2;

    &:last-child {
        border-bottom: none;
    }
  }
  .steps-completed {
      color: #407b00;
      font-weight: 500;
  }

   input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 4px;
    left: 0;
    border: 1px solid #8798AD;
    border-radius: 100%;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    
  }

   input:checked ~ .checkmark {
    background-color: #e5f1e5;
  }
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }


  input:checked ~ .checkmark:after {
    display: block;
  }
   .checkmark:after {
    left: 9px;
    top: 4px;
    width: 5px;
    height: 12px;
    border: solid #407b00;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

const ActiveAgreementTable = styled.div`
  position: relative;
  width: 100%;
  margin-top: 20px;

  table {
    width: 100%;
    font-size: 14px;
    color: ${Theme.black};
    tr {
      text-align: left;
      background: ${Theme.white};
      border: 1px solid rgba(46, 91, 255, 0.08);
      border-radius: 1px;
      font-family: ${Theme.baseFontFamily};
      width: 100%;

      th {
        padding: 5px 0px 12px 0px;
        vertical-align: middle;
        position: relative;
        color: ${Theme.gray35};
        font-size: ${Theme.extraNormal};
        font-weight: 500;
        vertical-align: top;
        border-bottom: 1px solid #e2e2ea;
      }

      td {
        padding: 12px 0;

        .sign-box {
          background-color: #ffffff;
          border: 1px solid #d5d8e1;
          border-radius: 2px;
          max-width: 100px;
          height: 32px;
          text-align: center;
          padding: 6px;
        }
        .solid-icon {
          width: 36px;
          height: 36px;
          margin-right: 10px;
        }
        .recurring-service {
          font-size: 14px;
        }
      }
    }
  }
`;
