import React from 'react';
import Button from '../../common/Button';
import { FileContract } from '../../theme/images/index';
import { WhiteCard } from '../../theme/Global';

export default function PastAgreement() {
  return (
    <div>
      <WhiteCard className="mt-3">
        <div className="row">
          <div className="col-8">
            <p className="black-heading-title mt-0 mb-0"> Recurring Contract</p>
            <ul className="recurring-contact">
              <li>
                <p className="basic-text ">12 month contract</p>
              </li>
              <li>
                <p className="basic-text ">Expires: Mar 20, 2021</p>
              </li>
            </ul>
          </div>
          <div className="col-4 text-right">
            <Button className="btn-transparent ">
              {' '}
              <img className="file-contract-icon" src={FileContract} alt="" />
              View Contract
            </Button>
          </div>
        </div>
      </WhiteCard>
      <WhiteCard className="mt-3">
        <div className="row">
          <div className="col-8">
            <p className="black-heading-title mt-0 mb-0">
              {' '}
              One Time Services Contract
            </p>
          </div>
          <div className="col-4 text-right">
            <Button className="btn-transparent ">
              {' '}
              <img className="file-contract-icon" src={FileContract} alt="" />
              View Contract
            </Button>
          </div>
        </div>
      </WhiteCard>
    </div>
  );
}
