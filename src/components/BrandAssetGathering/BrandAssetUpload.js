/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';
import queryString from 'query-string';
import ReactTooltip from 'react-tooltip';
import Select from 'react-select';
// import { Line } from 'rc-progress';
import axios from 'axios';

import Theme from '../../theme/Theme';
import {
  GrayCheckIcon,
  ArrowRightBlackIcon,
  GrayInfoIcon,
  LeftArrowIcon,
  OrangeDownloadPdf,
  CloseIcon,
  TrashIcons,
  RedTrashIcon,
} from '../../theme/images';
import {
  Button,
  CheckBox,
  HeaderDownloadFuntionality,
  PageLoader,
} from '../../common';
import {
  PATH_BRAND_ASSET,
  PATH_BRAND_ASSET_SUMMARY,
  PATH_CUSTOMER_DETAILS,
} from '../../constants';
import { BrandSteps } from '../../constants/FieldConstants';
import DragNDrop from './DragNDrop';
import axiosInstance from '../../axios';
import { API_DOCUMENTS } from '../../constants/ApiConstants';
import { deleteDocument, getDocuments } from '../../api';

const viewOptions = [
  { value: 'brand-logo', label: 'Brand Logo' },
  { value: 'brand-guidelines', label: 'Brand Guidelines' },
  { value: 'font-files', label: 'Font Files' },
  { value: 'iconography', label: 'Iconography' },
  { value: 'additional-brand-material', label: 'Additional Brand Material' },
];

export default function BrandAssetUpload() {
  const history = useHistory();
  const { id } = useParams();
  const params = queryString.parse(history.location.search);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [documentData, setDocumentData] = useState([]);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState();

  const getDocumentList = (docType) => {
    setIsLoading({ loader: true, type: 'page' });
    getDocuments('BAFNKpr', 'brandassets', docType).then((response) => {
      setDocumentData(response);
      setIsLoading({ loader: false, type: 'page' });
    });
  };

  useEffect(() => {
    setSelectedStep(BrandSteps.find((op) => op.url === params.step));
    const docType = BrandSteps.find((op) => op.url === params.step).key;
    setSelectedFiles([]);
    getDocumentList(docType);
  }, [params.step]);

  const destructureselectedFiles = () => {
    const formData = [];
    for (const files of selectedFiles) {
      for (const item of files) {
        formData.push({
          original_name: item.name,
          entity_id: 'BAFNKpr',
          entity_type: 'brandassets',
          mime_type: item.type,
          status: 'requested',
          document_type: selectedStep && selectedStep.key,
        });
      }
    }
    return formData;
  };
  const createMetaData = (name) => {
    for (const fileList of selectedFiles) {
      for (const item of fileList) {
        if (name === item.name) {
          return item;
        }
      }
    }
    return null;
  };
  const createDocument = () => {
    setIsLoading({ loader: true, type: 'button' });
    const formData = destructureselectedFiles();
    console.log('FORM DATA', formData);
    axiosInstance
      .post(API_DOCUMENTS, formData, {
        onUploadProgress: (data) => {
          console.log('>>>>', Math.round((100 * data.loaded) / data.total));
          setUploadProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .then((res) => {
        console.log('******', res);
        if (res && res.data && res.data.presigned_url !== '') {
          const request = {
            meta: createMetaData(res.data.original_name),
            url: res.data.presigned_url,
            headers: {
              'Content-type': res.data.mime_type,
            },
          };
          axios
            .put(request.url, request.meta, { headers: request.headers })
            .then(() => {
              axiosInstance
                .patch(`${API_DOCUMENTS + res.data.id}/`, {
                  status: 'available',
                })
                .then(() => {
                  setSelectedFiles([]);
                  getDocumentList(selectedStep && selectedStep.key);
                });
              setIsLoading({ loader: false, type: 'button' });
            });
        }
        return res;
      });
  };

  const saveImages = () => {
    createDocument();
  };

  const skipStep = () => {
    if (selectedStep && selectedStep.skip === 'summary') {
      history.push(PATH_BRAND_ASSET_SUMMARY.replace(':id', id));
    } else
      history.push({
        pathname: PATH_BRAND_ASSET.replace(':id', id),
        search: `step=${selectedStep && selectedStep.skip}`,
      });
  };

  const deleteImage = (imageId) => {
    setIsLoading({ loader: true, type: 'page' });
    deleteDocument(imageId).then((res) => {
      if (res && res.status === 204) {
        getDocumentList(selectedStep && selectedStep.key);
      }
    });
  };

  const showDocuments = () => {
    return (
      <ul className="Image-container" key={Math.random()}>
        {documentData &&
          documentData.map((file) => (
            <li>
              <CheckBox className="selected-img mt-4">
                <label
                  className="check-container customer-pannel"
                  htmlFor="add-addendum">
                  <input type="checkbox" id="add-addendum" />
                  <span className="checkmark" />
                  <CheckSelectImage>
                    <img
                      src={file && file.presigned_url}
                      className="image-thumbnail"
                      alt={file.original_name}
                    />
                    {showDeleteMsg[file.id] ? <div className="blur-bg" /> : ''}
                    <div
                      className="remove-box"
                      role="presentation"
                      onClick={() => setShowDeleteMsg({ [file.id]: true })}>
                      <img
                        className="trash-icon"
                        src={TrashIcons}
                        alt="check"
                      />
                    </div>
                    {showDeleteMsg[file.id] ? (
                      <div
                        className="delete-msg"
                        onClick={() => {
                          deleteImage(file.id);
                        }}
                        role="presentation">
                        {' '}
                        <img
                          className="red-trash-icon"
                          src={RedTrashIcon}
                          alt="check"
                        />
                        Confirm Delete
                        <img
                          className="confirm-delete-cross"
                          src={CloseIcon}
                          alt="check"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteMsg({ [file.id]: false });
                          }}
                          role="presentation"
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </CheckSelectImage>
                </label>
              </CheckBox>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <>
      <HeaderDownloadFuntionality>
        <div className="container-fluid">
          <div className="row">
            {' '}
            <div className="col-md-6 col-sm-12"> Contract Management</div>
            <div className="col-md-6 col-sm-12">
              <ul className="contract-download-nav ">
                <li className="download-pdf">
                  <img
                    src={OrangeDownloadPdf}
                    alt="download"
                    className="download-pdf-icon upload-icon "
                    role="presentation"
                  />
                  Upload
                </li>
                <li>
                  <span className="divide-arrow " />
                </li>
                <li className="download-pdf">
                  <img
                    src={OrangeDownloadPdf}
                    alt="download"
                    className="download-pdf-icon "
                    role="presentation"
                  />
                  Download
                </li>
                <li>
                  <span className="divide-arrow hide-mobile" />
                </li>
                <li>
                  <img
                    width="18px"
                    src={CloseIcon}
                    alt="close"
                    className="float-right cursor remove-cross-icon"
                    onClick={() => {
                      history.push(
                        history && history.location && history.location.state,
                      );
                    }}
                    role="presentation"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </HeaderDownloadFuntionality>
      <BackToStep>
        {' '}
        <div className="container-fluid">
          {' '}
          <div className="row">
            <div className="col-12">
              <div
                role="presentation"
                className="back-link"
                onClick={() =>
                  history.push(PATH_CUSTOMER_DETAILS.replace(':id', id))
                }>
                <img
                  src={LeftArrowIcon}
                  alt="aarow-back"
                  className="arrow-back-icon "
                />
                Back to Dashboard
              </div>
            </div>
          </div>
        </div>{' '}
      </BackToStep>
      <div className="container-fluid">
        <BrandAssetSideBar className="d-none d-lg-block">
          <div className="label-heading mb-3">Your BrandSteps</div>
          <ul className="asset-check-list">
            {BrandSteps.map((item) => (
              <li
                className="cursor"
                key={item.key}
                role="presentation"
                onClick={() => {
                  setSelectedFiles([]);
                  history.push({
                    pathname: PATH_BRAND_ASSET.replace(':id', id),
                    search: `step=${item.url}`,
                  });
                }}>
                {/* if step complete show this
              <img className="checked-gray" src={OrangeCheckMark} alt="check" /> and add active class to item.labe and file upload */}
                <img className="checked-gray" src={GrayCheckIcon} alt="check" />
                <div className="check-list-item">
                  <div className="check-list-label">{item.label}</div>
                  <div className="check-list-file-uploaded">
                    {selectedFiles.length} files uploaded
                  </div>
                </div>
                {item.url === params.step ? (
                  <img
                    className="active-arrow-icon"
                    src={ArrowRightBlackIcon}
                    alt="arrow"
                  />
                ) : (
                  ''
                )}
                <div className="clear-fix" />
              </li>
            ))}
          </ul>
        </BrandAssetSideBar>

        <DropDownBrandAsset>
          <Select
            options={viewOptions}
            defaultValue={viewOptions.find((op) => op.value === params.step)}
            onChange={(event) => {
              setSelectedFiles([]);
              history.push({
                pathname: PATH_BRAND_ASSET.replace(':id', id),
                search: `step=${event.value}`,
              });
            }}
            className="customer-dropdown-select d-lg-none d-block mb-3 "
          />
        </DropDownBrandAsset>

        {isLoading.loader && isLoading.type === 'page' ? (
          <PageLoader color="#FF5933" type="page" />
        ) : (
          <BrandAssetBody>
            {' '}
            <div className="label-heading">
              Part {selectedStep && selectedStep.step}/5
            </div>
            <h3 className="page-heading ">
              {selectedStep && selectedStep.label}
            </h3>
            <p className="normal-text mt-1 mb-0">
              {selectedStep && selectedStep.subtitle}
            </p>
            <p className="gray-normal-text mt-1">
              {selectedStep && selectedStep.format ? (
                <>
                  Preferred format: {selectedStep.format}{' '}
                  <img
                    className="gray-info-icon"
                    width="15px "
                    src={GrayInfoIcon}
                    alt=""
                    data-tip
                    data-for="format"
                  />
                  <ReactTooltip place="bottom" id="format">
                    <p>All Accepted Formats</p>
                    ai, .eps, .png, .jpg or .gif
                  </ReactTooltip>
                </>
              ) : (
                ''
              )}
            </p>
            <div>
              <DragNDrop
                setSelectedFiles={setSelectedFiles}
                // fileType={selectedStep && selectedStep.format}
                fileLength={selectedFiles && selectedFiles.length}
              />
              <div className="progress-bar-value">
                {uploadProgress > 0 && (
                  <progress
                    value={uploadProgress}
                    label={`${uploadProgress}%`}
                  />
                )}
                {/* <progress value="67" max="100" /> */}
              </div>
              {showDocuments()}
              {/* <Line percent="10" strokeWidth="4" strokeColor="#D3D3D3" /> */}
            </div>
          </BrandAssetBody>
        )}
      </div>

      <BrandAssetFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-right">
              <span
                className="skip-step cursor"
                onClick={() => skipStep()}
                role="presentation">
                Skip this step
              </span>
              <Button
                className="btn-primary"
                disabled={
                  (selectedFiles && selectedFiles.length === 0) ||
                  isLoading.loader
                }
                onClick={() => saveImages()}>
                Next Step
              </Button>
            </div>
          </div>
        </div>
      </BrandAssetFooter>
    </>
  );
}

const BrandAssetBody = styled.div`
  padding-left: 400px;
  margin-top: 100px;

  .gray-info-icon {
    vertical-align: bottom;
    margin-left: 3px;
  }
  .Image-container {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      margin-right: 20px;

      .remove-box {
        display: none;
      }

      &:hover {
        .remove-box {
          background-color: #ffffff;
          border: 1px solid #e2e2ea;
          border-radius: 6px;
          width: 40px;
          height: 40px;
          position: absolute;
          bottom: 3px;
          right: 3px;
          padding: 9px;
          display: block;
          .trash-icon {
            width: 22px;
          }
        }
      }
    }
  }
  @media only screen and (max-width: 991px) {
    padding-left: 0px;
    margin-top: 50px;
  }
`;

const BrandAssetSideBar = styled.div`
  background-color: #f4f6fc;
  border-radius: 15px;
  max-width: 340px;
  position: fixed;
  top: 145px;
  left: 20px;
  padding: 20px;
  width: 100%;
  height: 70%;
  bottom: 90px;

  .asset-check-list {
    list-style-type: none;
    padding: 0;
    marging: 0;
    li {
      margin-bottom: 15px;

      .check-list-item {
        float: left;
        word-break: break-all;
        width: 76%;
        .check-list-label {
          color: ${Theme.black};
          font-size: ${Theme.normal};
          padding-bottom: 2px;
          &.active {
            font-weight: 600;
          }
        }
        .check-list-file-uploaded {
          font-size: ${Theme.extraNormal};
          color: ${Theme.gray40};
          &.active {
            color: ${Theme.orange};
          }
        }
      }
      .checked-gray {
        overflow-wrap: break-word;
        text-align: left;
        float: left;
        width: 16px;
        margin-right: 10px;
        margin-top: 12px;
      }
      .active-arrow-icon {
        width: 20px;
        float: right;
        margin-top: 11px;
      }
    }
  }
`;
const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 3;
  top: 70px;
  padding: 22px 0px 18px 0px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};

  .skip-steps {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    cursor: pointer;
  }
`;

const BrandAssetFooter = styled.div`
  border: 1px solid ${Theme.gray7};
  bottom: 0px;
  background: ${Theme.white};
  position: fixed;
  min-height: 60px;
  z-index: 2;
  width: 100%;
  padding: 8px 0;

  .skip-step {
    color: #556178;
    font-size: 14px;
    margin-right: 20px;
  }
`;

const DropDownBrandAsset = styled.div`
  margin-top: 100px;

  .css-yk16xz-control {
    background: #f4f6fc;
    border: none;
  }
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
`;

const CheckSelectImage = styled.div`
  background-color: #f4f6fc;
  border-radius: 8px;
  width: 180px;
  height: 180px;
  position: relative;

  .image-thumbnail {
    width: 180px;
    height: 180px;
    border-radius: 8px;
    
    
  }
  .blur-bg {
    background-color: rgba(46, 56, 77, 0.6);
    width: 180px;
    height: 180px;
    border-radius: 8px;
    position: absolute;
    top: 0;
  }
  .selected-img {
    position: absolute;
    top: 5px;
    left: 5px;
  }
  .confirm-delete-cross {
    position: absolute;
    width: 12px;
    top: 7px;
  }
  
  .delete-msg {
    border-radius: 6px;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    max-width: 170px;
    color: #d60000;
    font-size: 16px;
    text-align: center;
    position: absolute;
    top: 62px;
    padding: 16px;
    width: 100%;
    left: 6px;
    font-weight: 600;
    .red-trash-icon {
      width: 18px;
      vertical-align: text-top;
      margin-right: 6px;
    }
}
  }
`;
