/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';

import {
  FormField,
  ModalBox,
  PageLoader,
  Button,
  DropDownSelect,
} from '../../common';
import { AmazonSellerAccountDetails } from '../../constants/FieldConstants';

export default function EditAmazonAccountDetails({ setShowAmazonModal }) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    setIsLoading({ loader: false, type: 'page' });
  }, []);

  const handleChange = () => {
    setShowBtn(true);
    //   setFormData({ ...formData, [key]: event.target.value });
    //   setApiError({
    //     ...apiError,
    //     [event.target.name]: '',
    //   });
  };

  const generateInput = (item) => {
    return (
      <input
        className="form-control extra-space"
        type="text"
        name={item.key}
        placeholder={item.label}
        // defaultValue={mapInputValues(item)}
        onChange={(event) => handleChange(event, item.key)}
        id={item.key}
      />
    );
  };

  return (
    <ModalBox>
      <div className="modal-body ">
        <div className="row">
          <div className="col-12 modal-heading">
            <h4>Edit Amazon Account Names & IDs</h4>
            <div className="straight-line horizontal-line mt-3 mb-3" />
            <FormField className="mt-3">
              <label htmlFor="marketplace" className="mb-2">
                Marketplace
              </label>
              <DropDownSelect>
                <Select
                  classNamePrefix="react-select"
                  className="active"
                  options={AmazonSellerAccountDetails}
                />
              </DropDownSelect>
              <div className="straight-line horizontal-line mt-4 mb-3" />
            </FormField>
            {AmazonSellerAccountDetails.map((item) => (
              <React.Fragment key={item.key}>
                <div className={item.property} id={item.key}>
                  <FormField className="mt-3">
                    <label htmlFor={item.id}>
                      {item.label}
                      <br />
                      {generateInput(item)}
                    </label>
                    {/* <ErrorMsg>
                        {apiError &&
                          apiError[item.key] &&
                          apiError[item.key][0]}
                      </ErrorMsg> */}
                  </FormField>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {showBtn ? (
        <>
          <div className="footer-line " />
          <div className=" col-12  modal-footer">
            <Button className=" btn-primary mr-4">
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              className=" btn-borderless"
              onClick={() => setShowAmazonModal(false)}>
              Discard Changes
            </Button>
          </div>
        </>
      ) : (
        ''
      )}
    </ModalBox>
  );
}

EditAmazonAccountDetails.defaultProps = {
  setShowAmazonModal: () => {},
};

EditAmazonAccountDetails.propTypes = {
  setShowAmazonModal: PropTypes.func,
};
