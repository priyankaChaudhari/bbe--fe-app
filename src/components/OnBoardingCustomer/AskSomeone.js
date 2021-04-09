import React from 'react';

import PropTypes from 'prop-types';

import { Button, CheckBox, ContractFormField } from '../../common';
import { EditOrangeIcon } from '../../theme/images';

export default function AskSomeone({ setIsChecked, isChecked }) {
  const handleChanges = (event) => {
    if (event.target.checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  return (
    <>
      <CheckBox className="mt-3">
        <label
          className="check-container customer-pannel "
          htmlFor="contract-copy-check">
          Ask someone else to complete this section
          <input
            type="checkbox"
            id="contract-copy-check"
            onChange={(event) => handleChanges(event)}
          />
          <span className="checkmark" />
        </label>
      </CheckBox>
      {isChecked ? (
        <fieldset className="shape-without-border w-430 mt-4">
          <ContractFormField>
            <label htmlFor="email">
              Assign to (email)
              <input className="form-control" />
            </label>
            <span className="edit-field">
              <img className="edit-icon" src={EditOrangeIcon} alt="edit" /> Edit
              email address
            </span>
          </ContractFormField>
          <p className="info-text-gray m-0 pt-3 ">
            We’ll email them a link to submit the information in this section.
          </p>
          <Button className="btn-primary w-100  mt-3">Send Email</Button>
        </fieldset>
      ) : (
        ''
      )}
    </>
  );
}

AskSomeone.defaultProps = {
  setIsChecked: () => {},
};

AskSomeone.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  setIsChecked: PropTypes.func,
};
