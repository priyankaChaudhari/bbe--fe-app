import React from 'react';

import { ArrowRightBlackIcon, ArrowRightIcon } from '../../theme/images';
import {
  UnauthorizedHeader,
  OnBoardingBody,
  GreyCard,
  ModalRadioCheck,
  Button,
  InputText,
} from '../../common';

export default function DSPBudgetApprovalContainer() {
  return (
    <>
      <UnauthorizedHeader />
      <OnBoardingBody className="body-white pt-3">
        <div className="white-card-base panel pb-4">
          <GreyCard className="yellow-card ">
            <p className="normal-text mt-0">
              {' '}
              Below is a summary of the proposed changes to your DSP plan with
              Buy Box Experts.{' '}
            </p>
            <p className="normal-text">
              {' '}
              Please check through the details and approve the changes if you’re
              happy to proceed.
            </p>
            <p className="normal-text mb-0">
              {' '}
              If you’re not 100% happy, please let me know if you’d like
              anything changed and I will send over a new proposal.
            </p>{' '}
            Many thanks, Jacob
          </GreyCard>
          <h5 className="sub-title-text mt-4">
            Proposed DSP Invoice Adjustment
          </h5>
          <p className="normal-text text-medium mb-2">
            Current monthly DSP invoice amount
          </p>
          <h5 className="sub-title-text mt-2">$10,000</h5>
          <div className="straight-line horizontal-line mt-3" />
          <p className="normal-text text-medium mb-2">
            New monthly DSP invoice
          </p>
          <h5 className="sub-title-text mt-2">$15,000</h5>
          <fieldset className="shape-without-border mt-3 p-2">
            <div className="row">
              <div className="col-5 text-left">
                <div className="label">Marketplace</div>
              </div>
              <div className="col-4 text-left">
                <div className="label">From</div>
              </div>
              <div className="col-3 text-left">
                <div className="label">To</div>
              </div>
              <div className="col-4 text-left">
                <div className="label">Marketplace</div>
              </div>
              <div className="col-4 text-left">
                <div className="label">Pause Invoice</div>
              </div>
              <div className="col-4 text-left">
                <div className="label">Invoice Amount</div>
              </div>
            </div>
            <div className=" straight-line horizontal-line pt-1 mb-2 " />
            <div className="row">
              <div className="col-5 text-left">
                <div className="normal-text text-bold">US</div>
              </div>
              <div className="col-2 text-left">
                <div className="normal-text text-bold">$5,000</div>
              </div>
              <div className="col-2 text-center">
                <div className="normal-text">
                  <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                </div>
              </div>
              <div className="col-3 text-left">
                <div className="normal-text text-bold">$10,000</div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-5 text-left">
                <div className="normal-text ">UK</div>
              </div>
              <div className="col-2 text-left">
                <div className="gray-normal-text">$5,000</div>
              </div>
              <div className="col-2 text-center">
                <div className="normal-text">
                  <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
                </div>
              </div>
              <div className="col-3 text-left">
                <div className="gray-normal-text">$10,000</div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-5 text-left">
                <div className="normal-text ">Canada</div>
              </div>
              <div className="col-2 text-left">
                <div className="gray-normal-text">$5,000</div>
              </div>
              <div className="col-2 text-center">
                <div className="normal-text">
                  <img src={ArrowRightIcon} width="18px" alt="arrow" />{' '}
                </div>
              </div>
              <div className="col-3 text-left">
                <div className="gray-normal-text">$10,000</div>
              </div>
            </div>
            <div className=" straight-line horizontal-line pt-1 mb-2 " />
            <div className="row">
              <div className="col-5 text-left">
                <div className="normal-text text-bold">US</div>
              </div>
              <div className="col-2 text-left">
                <div className="normal-text text-bold">$5,000</div>
              </div>
              <div className="col-2 text-center">
                <div className="normal-text">
                  <img src={ArrowRightBlackIcon} width="18px" alt="arrow" />{' '}
                </div>
              </div>
              <div className="col-3 text-left">
                <div className="normal-text text-bold">$10,000</div>
              </div>
            </div>
            {/* <div className=" straight-line horizontal-line pt-1 mb-2 " />
            <div className="row">
              <div className="col-4 text-left">
                <div className="normal-text text-bold">US</div>
              </div>
              <div className="col-4 text-left">
                <div className="normal-text text-bold">$5,000</div>
              </div>
              <div className="col-2 text-center">
                <div className="col-4 text-left">
                  <div className="normal-text text-bold">$10,000</div>
                </div>
              </div>
            </div>
            <div className=" straight-line horizontal-line pt-1 mb-2 " />
            <div className="row">
              <div className="col-8 text-left">
                <div className="normal-text text-bold">Total invoice</div>
              </div>

              <div className="col-2 text-center">
                <div className="col-4 text-left">
                  <div className="normal-text text-bold">$10,000</div>
                </div>
              </div>
            </div> */}
          </fieldset>
          <p className="normal-text">
            {' '}
            This will be your new, ongoing invoice amount.{' '}
            <span className="text-bold">
              The first bill for this amount will be due November 22.
            </span>
          </p>

          <GreyCard className="mb-3 mt-1">
            <p className="normal-text text-bold m-0">
              Additional DSP invoice (November only)
            </p>
            <p className="normal-text text-bold mb-0 mt-1"> $5,000</p>
            <p className="normal-text mb-0 mt-1">
              The will be a one-off invoice, providing additional budget to
              spend in the current month. This invoice will be sent as soon as
              brand partner approves the proposal.
            </p>
          </GreyCard>
          <ModalRadioCheck className="mb-3">
            {' '}
            <label
              className=" checkboxes radio-container customer-list"
              htmlFor="yes">
              <input type="radio" name="radio" id="yes" />
              <span className="checkmark checkmark-customer-list" />I approve
              the new DSP invoice amount
            </label>
          </ModalRadioCheck>
          <ModalRadioCheck className="mb-3">
            {' '}
            <label
              className=" checkboxes radio-container customer-list"
              htmlFor="yes">
              <input type="radio" name="radio" id="yes" />
              <span className="checkmark checkmark-customer-list" />I want to
              reject the proposal
            </label>
          </ModalRadioCheck>

          <InputText
            className="form-control "
            placeholder="Let us know if you would like any changes to be made (optional)"
            // rows="4"
          />
          {/* <textarea
            className="form-control"
            rows="4"
            cols="50"
            placeholder="Let us know if you would like any changes to be made
            (optional)"
          /> */}
          {/* gg
          </InputText> */}
          <Button className="btn-primary w-100 mt-3">Confirm</Button>
        </div>
      </OnBoardingBody>
    </>
  );
}
