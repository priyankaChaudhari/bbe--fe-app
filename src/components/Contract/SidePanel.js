import React from 'react';
import { ArrowRightIcon } from '../../theme/images/index';

function SidePanel() {
  const displayAmendments = () => {
    return (
      <div className="amendments-section">
        <ul className="menu">
          <li>
            <div className="row w-100">
              <div className="col-12 mb-2">
                <div className="label">Monthly Retainer</div>
              </div>

              <div className="col-8 text-left mb-3">
                <span className=" new-basic-text text-delete ">$3,000 </span>
                <span>
                  <img
                    className="next-arrow"
                    src={ArrowRightIcon}
                    alt="arrow"
                  />{' '}
                </span>
                <span className=" new-basic-text">$2,400</span>
              </div>
              <div className="col-4 mb-3">
                <div className="added-remove-text">Updated</div>
              </div>
            </div>
          </li>
          <li>
            <div className="row w-100">
              <div className="col-12 mb-2">
                <div className="label">Monthly Services</div>
              </div>

              <div className="col-8 text-left mb-3">
                <p className=" basic-text  ">Logistics Management</p>
              </div>
              <div className="col-4 mb-3">
                <div className="added-remove-text">Added</div>
              </div>
              <div className="col-8 mb-3 text-left">
                <p className=" basic-text text-delete ">Logistics Management</p>
              </div>
              <div className="col-4 mb-3">
                <div className="added-remove-text">Removed</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  };
  return <div>{displayAmendments()}</div>;
}

export default SidePanel;
