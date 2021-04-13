/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
// import Select from 'react-select';
import { Collapse } from 'react-collapse';
import LoadingBar from 'react-top-loading-bar';

import Theme from '../../theme/Theme';
import Header from '../../common/Header';
import {
  OnBoardingBody,
  ContractFormField,
  // FormField,
  Button,
  PageLoader,
} from '../../common';
import { LeftArrowIcon, CaretUp } from '../../theme/images';
import AskSomeone from './AskSomeone';
import { updateCustomerDetails } from '../../api';
import { getCustomerDetails } from '../../store/actions';
import { SocialIcons } from '../../constants/FieldConstants';

export default function CompanyDigital() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });

  useEffect(() => {
    // dispatch(getCustomerDetails(userInfo.customer));
    dispatch(getCustomerDetails('CMMVciw'));
  }, [dispatch, userInfo.customer]);

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
    if (formData && Object.keys(formData).length) {
      updateCustomerDetails(userInfo.customer, formData).then((res) => {
        if (res && res.status === 200) {
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    } else {
      setIsLoading({ loader: false, type: 'button' });
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const generateHTML = () => {
    return (
      <>
        <ContractFormField className="mt-3">
          <label>
            Website
            <input
              className="form-control"
              type="text"
              placeholder="Enter Website"
              defaultValue={data && data.website}
              name="website"
              onChange={(event) => handleChange(event)}
            />
          </label>
        </ContractFormField>
        <div className="label-title mb-1 mt-4">Social</div>
        <div className="row">
          {SocialIcons.map((item) => (
            <>
              <div className="col-4 mt-3 pr-0">
                <span>
                  <img
                    src={item.onboard}
                    alt={item.key}
                    className={item.property}
                  />{' '}
                  {item.label}
                </span>
              </div>
              <div className="col-8 ">
                {' '}
                <ContractFormField>
                  <input
                    className="form-control"
                    type="text"
                    placeholder={`Enter ${item.label} URL`}
                    name={item.key}
                    defaultValue={data && data[item.key]}
                    onChange={(event) => handleChange(event)}
                  />
                </ContractFormField>
              </div>
            </>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <LoadingBar color="#FF5933" progress="50" />

      <BackToStep>
        <div className="container-fluid">
          {' '}
          <div className="row">
            <div className="col-6">
              {' '}
              <div role="presentation" className="back-link">
                <img
                  src={LeftArrowIcon}
                  alt="aarow-back"
                  className="arrow-back-icon "
                />
                Back a step
              </div>
            </div>
            <div className="col-6 text-right ">
              <div className="skip-steps pr-2">Skip this step</div>
            </div>
          </div>
        </div>
      </BackToStep>

      {loader ? (
        <PageLoader component="modal" color="#FF5933" type="page" />
      ) : (
        <OnBoardingBody className="body-white">
          <div className="white-card-base panel">
            <p className="account-steps m-0">Step 2 of 4</p>
            <h3 className="page-heading ">Your company’s digital presence</h3>
            <p className="info-text-gray m-0 ">
              Need help on why we need this information? <br />{' '}
              <a className="video-link" href="*">
                Click here to watch the video.
              </a>
            </p>
            <AskSomeone setIsChecked={setIsChecked} isChecked={isChecked} />
            {!isChecked ? (
              <>
                {generateHTML()}
                <Button
                  className="btn-primary w-100  mt-4"
                  onClick={() => saveDetails()}>
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Continue'
                  )}
                </Button>
              </>
            ) : (
              ''
            )}
          </div>
          {isChecked ? (
            <div className="white-card-base panel gap-none">
              <div
                className="label-title cursor mt-4"
                type="button"
                role="presentation"
                onClick={() => setOpenCollapse(!openCollapse)}>
                Expand questions
                <img
                  className="arrow-up"
                  src={CaretUp}
                  alt="arrow"
                  style={{
                    transform: openCollapse ? 'rotate(180deg)' : '',
                  }}
                />
                <div className="clear-fix" />
              </div>
              <CollapseOpenContainer>
                <Collapse isOpened={openCollapse}>{generateHTML()}</Collapse>
              </CollapseOpenContainer>
              <Button
                className={
                  isChecked
                    ? 'btn-primary w-100  mt-4 disabled'
                    : 'btn-primary w-100  mt-4'
                }
                disabled={isChecked}>
                Continue
              </Button>
            </div>
          ) : (
            ''
          )}
        </OnBoardingBody>
      )}
    </>
  );
}

const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 2;
  padding: 20px 0px 20px 0px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};

  .skip-steps {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    cursor: pointer;
  }
`;

const CollapseOpenContainer = styled.div`
  opacity: 0.6;
`;
