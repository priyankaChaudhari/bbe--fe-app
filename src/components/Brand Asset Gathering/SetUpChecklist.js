/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import styled from 'styled-components';
import Theme from '../../theme/Theme';
import { Button, WhiteCard } from '../../common';
import { RecurringIcon, SignatureIcon } from '../../theme/images';

export default function SetUpChecklist() {
  return (
    <div className="col-lg-8  col-12 mb-3">
      <fieldset className="shape-without-border extra-radius">
        <div className="row">
          <div className="col-6">
            <p className="black-heading-title mt-2 mb-4">Setup Checklist</p>
          </div>
          <div className="col-6 text-right">80% Complete</div>
        </div>
        <div className="checklist-setup">
          <GreenCheckBox>
            <label className="cursor">
              Sign Contract
              <div className="steps-completed">1/1 Steps completed by you </div>
              <input type="checkbox" checked="checked" />
              <span className="checkmark" />
            </label>
          </GreenCheckBox>
          <GreenCheckBox className="mt-3">
            <label className="cursor">
              Sign Contract
              <div className="steps-completed">1/1 Steps completed by you </div>
              <input type="checkbox" defaultChecked />
              <span className="checkmark" />
            </label>
          </GreenCheckBox>
          <div className="row">
            <div className="col-8">
              {' '}
              <GreenCheckBox className="mt-3">
                <label className="cursor">
                  Sign Contract
                  <div className="steps-completed">
                    1/1 Steps completed by you{' '}
                  </div>
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark" />
                </label>
              </GreenCheckBox>
            </div>
            <div className="col-4 mt-3">
              <Button className="btn-primary ">Upload Assets</Button>
            </div>
          </div>
        </div>
      </fieldset>
      <WhiteCard className="mt-3">
        <p className="black-heading-title mt-2 ">Active Agreements (1)</p>

        <ActiveAgreementTable>
          <table>
            <tr>
              <th width="40%">Agreement Type</th>
              <th width="24%">Contract Status</th>
              <th width="18%">Start Date</th>
              <th width="18%">Expires in</th>
            </tr>

            <tr>
              <td>
                <img
                  className="solid-icon"
                  src={RecurringIcon}
                  alt="recurring"
                />
                <p className="black-heading-title recurring-service mt-2 mb-0">
                  Recurring Service Agreement
                </p>
              </td>
              <td>
                <div className="sign-box">
                  <img
                    className=""
                    width="14px"
                    src={SignatureIcon}
                    alt="signature"
                  />{' '}
                  Signed
                </div>
              </td>
              <td>Mar 21, 2021</td>
              <td>364 days</td>
            </tr>
          </table>
        </ActiveAgreementTable>
      </WhiteCard>
      <WhiteCard className="mt-3">
        <p className="black-heading-title mt-2 ">Creative Schedule</p>

        <p className="no-result-found  text-center mt-4 mb-4">
          Your creative schedule is being generated
        </p>
      </WhiteCard>
    </div>
  );
}

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
    border: 1px solid #407b00;
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
