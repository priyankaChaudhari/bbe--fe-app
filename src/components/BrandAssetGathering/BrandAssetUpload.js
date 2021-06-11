/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */

import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';
import queryString from 'query-string';
import ReactTooltip from 'react-tooltip';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import Theme from '../../theme/Theme';
import {
  GrayCheckIcon,
  OrangeCheckMark,
  ArrowRightBlackIcon,
  GrayInfoIcon,
  LeftArrowIcon,
  OrangeDownloadPdf,
  CloseIcon,
  TrashIcons,
  RedTrashIcon,
  WhiteArrowRight,
  FileCloud,
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
  PATH_UNAUTHROIZED_BRAND_ASSET_SUMMARY,
  PATH_UNAUTHORIZED_BRAND_ASSET,
} from '../../constants';
import { BrandSteps } from '../../constants/FieldConstants';
import axiosInstance from '../../axios';
import { API_DOCUMENTS } from '../../constants/ApiConstants';
import { deleteDocument, getDocuments } from '../../api';
import {
  getBrandAssetsDetail,
  updateBrandAssetStep,
} from '../../api/BrandAssestsApi';

const viewOptions = [
  { value: 'brand-logo', label: 'Brand Logo' },
  { value: 'brand-guidelines', label: 'Brand Guidelines' },
  { value: 'font-files', label: 'Font Files' },
  { value: 'iconography', label: 'Iconography' },
  { value: 'additional-brand-material', label: 'Additional Brand Material' },
];

export default function BrandAssetUpload() {
  const history = useHistory();
  const { id, brandId } = useParams();
  const params = queryString.parse(history.location.search);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [documentData, setDocumentData] = useState([]);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [brandAssetData, setBrandAssetData] = useState([]);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [noImages, setNoImages] = useState(false);

  const [uploadCount, setUploadCount] = useState({
    'brand-logo': 0,
    'brand-guidelines': 0,
    'font-files': 0,
    iconography: 0,
    'additional-brand-material': 0,
  });

  const formats = {
    'brand-logo': 'image/*, .eps, .ai',
    'brand-guidelines': 'image/*, .pdf, .tif, .psd, .docx',
    'font-files': '.ttf, .otf, .woff',
    iconography: 'image/*',
    'additional-brand-material': '',
  };
  const selectedFiles = [];

  const getDocumentList = (docType) => {
    setDroppedFiles([]);
    setIsLoading({ loader: true, type: 'page' });
    getDocuments(brandId, 'brandassets', docType).then((response) => {
      setDocumentData(response);
      const newCount = uploadCount;
      newCount[params.step] = response.length;
      setUploadCount(newCount);
      setIsLoading({ loader: false, type: 'page' });
    });
  };

  useEffect(() => {
    setSelectedStep(BrandSteps.find((op) => op.url === params.step));
    const docType =
      BrandSteps.find((op) => op.url === params.step) &&
      BrandSteps.find((op) => op.url === params.step).key;
    getDocumentList(docType);
    getBrandAssetsDetail(brandId).then((response) => {
      setBrandAssetData(response && response.data);
      if (
        response &&
        response.data &&
        response.data.steps &&
        response.data.steps[params.step] === 'none'
      ) {
        setNoImages(true);
      } else setNoImages(false);
    });
  }, [params.step]);

  const destructureselectedFiles = () => {
    const formData = [];
    for (const files of selectedFiles) {
      for (const item of files) {
        formData.push({
          original_name: item.name,
          entity_id: brandId,
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

  const createDocument = (files) => {
    const documentError = { error: false, message: '' };
    setIsLoading({ loader: true, type: 'button' });
    const formData = destructureselectedFiles();
    axiosInstance
      .post(API_DOCUMENTS, formData, {
        onUploadProgress: (data) => {
          files &&
            files.map((file) => {
              file.progress = (data.loaded / data.total) * 100;
            });
          setDroppedFiles(files);
        },
      })
      .then((res) => {
        for (const detail of res.data) {
          if (detail && detail.presigned_url !== '') {
            const request = {
              meta: createMetaData(detail.original_name),
              url: detail.presigned_url,
              headers: {
                'Content-type': detail.mime_type,
              },
            };
            if (detail && detail.error) {
              documentError.error = true;
              documentError.message = detail.error.mime_type
                ? detail.error.mime_type[0]
                : detail.error;
              const validFiles = files.filter((file) => {
                file.progress = 0;
                return detail.original_name !== file.original_name;
              });
              setDroppedFiles(validFiles);
            }
            axios
              .put(request.url, request.meta, { headers: request.headers })
              .then(() => {
                axiosInstance
                  .patch(
                    `${API_DOCUMENTS + detail.id}/`,
                    {
                      status: 'available',
                    },
                    {
                      onUploadProgress: (data) => {
                        files &&
                          files.map((file) => {
                            file.progress = Math.round(
                              (100 * data.loaded) / data.total,
                            );
                          });
                        setDroppedFiles(files);
                      },
                    },
                  )
                  .then((r) => {
                    const newFiles = documentData || [];
                    files &&
                      files.map((file) => {
                        file.progress = 0;
                      });
                    setDroppedFiles(files);
                    newFiles.push(r.data);
                    setDocumentData(newFiles);
                    setDroppedFiles([]);
                    const newCount = uploadCount;
                    newCount[params.step] = newFiles.length;
                    setUploadCount(newCount);
                    // getDocumentList(selectedStep && selectedStep.key);
                  });
                setIsLoading({ loader: false, type: 'button' });
              });
          }
        }
        if (documentError && documentError.error) {
          toast.error(documentError && documentError.message);
          setIsLoading({ loader: false, type: 'button' });
        }
        return res;
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: params && params.step && formats && formats[params.step],
    onDrop: (acceptedFiles) => {
      const files = [];
      selectedFiles.push(acceptedFiles);
      acceptedFiles.map((file) => {
        files.push({ file, progress: 1 });
      });
      setDroppedFiles(files);
      createDocument(files);
    },
  });

  const redirectTo = (value) => {
    setIsLoading({ loader: true, type: 'button' });
    updateBrandAssetStep(brandId, {
      steps: {
        ...brandAssetData.steps,
        [selectedStep && selectedStep.key]: noImages ? 'none' : value,
      },
    }).then((response) => {
      if (response && response.status === 200)
        if (selectedStep && selectedStep.skip === 'summary') {
          history.push(
            history.location.pathname.includes('/assigned-brand-asset/')
              ? PATH_UNAUTHROIZED_BRAND_ASSET_SUMMARY.replace(
                  ':id',
                  id,
                ).replace(':brandId', brandId)
              : PATH_BRAND_ASSET_SUMMARY.replace(':id', id).replace(
                  ':brandId',
                  brandId,
                ),
          );
        } else
          history.push({
            pathname: history.location.pathname.includes(
              '/assigned-brand-asset/',
            )
              ? PATH_UNAUTHORIZED_BRAND_ASSET.replace(':id', id).replace(
                  ':brandId',
                  brandId,
                )
              : PATH_BRAND_ASSET.replace(':id', id).replace(
                  ':brandId',
                  brandId,
                ),
            search: `step=${selectedStep && selectedStep.skip}`,
          });

      setIsLoading({ loader: false, type: 'button' });
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
            <li key={file.id}>
              <CheckBox className="selected-img mb-3">
                <label
                  className="check-container customer-pannel"
                  htmlFor="add-addendum">
                  <input type="checkbox" id="add-addendum" />
                  <span className="checkmark" />
                  <CheckSelectImage>
                    <embed
                      type={file && file.mime_type}
                      src={file && file.presigned_url}
                      className="image-thumbnail"
                      width="250"
                      height="200"
                    />
                    {/* <img
                      src={file && file.presigned_url}
                      className="image-thumbnail"
                      alt={file.original_name}
                    /> */}
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

        {droppedFiles &&
          droppedFiles.map((file) => (
            <li key={file && file.file.lastModified}>
              <CheckBox className="selected-img mb-3">
                <label
                  className="check-container customer-pannel"
                  htmlFor="add-addendum">
                  <input type="checkbox" id="add-addendum" />
                  <span className="checkmark" />
                  <CheckSelectImage>
                    <div className="image-thumbnail">
                      <div className="uploading-file-name">
                        Uploading file
                        <div className="file-path"> {file.file.name}</div>
                      </div>
                      {file && file.progress > 0 && (
                        <div className="uploading-progress-bar ">
                          file.progress
                          <progress value={10} label={`${file.progress}%`} />
                          {/* <ProgressBar
                            now={file.percent}
                            label={`${file.progress}%`}
                      /> */}
                        </div>
                      )}
                    </div>
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
      {/* <HeaderDownloadFuntionality>
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
      </HeaderDownloadFuntionality> */}
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
                  history.push(
                    PATH_CUSTOMER_DETAILS.replace(':id', id).replace(
                      ':brandId',
                      brandId,
                    ),
                  )
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
                  history.push({
                    pathname: history.location.pathname.includes(
                      '/assigned-brand-asset/',
                    )
                      ? PATH_UNAUTHORIZED_BRAND_ASSET.replace(
                          ':id',
                          id,
                        ).replace(':brandId', brandId)
                      : PATH_BRAND_ASSET.replace(':id', id).replace(
                          ':brandId',
                          brandId,
                        ),
                    search: `step=${item.url}`,
                  });
                }}>
                {/* if step complete show this and add active class to item.label and file upload */}
                {item && item.url && uploadCount && uploadCount[item.url] ? (
                  <img
                    className="checked-gray"
                    src={OrangeCheckMark}
                    alt="check"
                  />
                ) : (
                  <img
                    className="checked-gray"
                    src={GrayCheckIcon}
                    alt="check"
                  />
                )}
                <div className="check-list-item">
                  <div
                    className={
                      item && item.url && uploadCount && uploadCount[item.url]
                        ? 'check-list-label active'
                        : 'check-list-label'
                    }>
                    {item.label}
                  </div>
                  <div
                    className={
                      item && item.url && uploadCount && uploadCount[item.url]
                        ? 'check-list-file-uploaded active'
                        : 'check-list-file-uploaded'
                    }>
                    {item && item.url && uploadCount && uploadCount[item.url]}{' '}
                    files uploaded
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
              history.push({
                pathname: history.location.pathname.includes(
                  '/assigned-brand-asset/',
                )
                  ? PATH_UNAUTHORIZED_BRAND_ASSET.replace(':id', id).replace(
                      ':brandId',
                      brandId,
                    )
                  : PATH_BRAND_ASSET.replace(':id', id).replace(
                      ':brandId',
                      brandId,
                    ),
                search: `step=${event.value}`,
              });
            }}
            className="customer-dropdown-select d-lg-none d-block mb-3 "
          />
        </DropDownBrandAsset>

        {/* {isLoading.loader && isLoading.type === 'page' ? (
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
            */}

        {isLoading.loader && isLoading.type === 'page' ? (
          <PageLoader color="#FF5933" type="page" />
        ) : (
          <BrandAssetBody>
            <div className="label-heading">
              Part {selectedStep && selectedStep.step}/5
            </div>
            <h3 className="page-heading ">
              {selectedStep && selectedStep.label}
            </h3>
            <p className="normal-text mt-1 mb-0">
              {selectedStep && selectedStep.subtitle}
            </p>
            <div className="gray-normal-text mt-1 mb-4">
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
                    <span style={{ color: '#BFC5D2', fontSize: '12px' }}>
                      All Accepted Formats
                    </span>
                    <p style={{ color: 'white', fontSize: '12px' }}>
                      {' '}
                      ai, .eps, .png, .jpg or .gif
                    </p>
                  </ReactTooltip>
                </>
              ) : (
                ''
              )}
            </div>
            <DragDropImg>
              {(documentData && documentData.length) ||
              (droppedFiles && droppedFiles.length) ? (
                <section className="thumbnail-dropzone mb-3">
                  <div
                    className="mb-4"
                    {...getRootProps({ className: 'dropzone mb-3' })}>
                    <input {...getInputProps()} />

                    <div className="thumbnail-select-files">
                      <img
                        className="mb-2"
                        width="70px"
                        src={FileCloud}
                        alt="file-cloud"
                      />
                      <br />
                      Drag and drop your files here or <span>browse </span>
                    </div>
                  </div>

                  {showDocuments()}
                </section>
              ) : (
                <section
                  className={
                    noImages ? 'drag-drop mb-4 disabled' : 'drag-drop mb-4'
                  }>
                  <div
                    className="mb-4"
                    {...getRootProps({ className: 'dropzone mb-3' })}>
                    <input {...getInputProps()} />

                    <div className=" select-files ">
                      <img
                        className="mb-2"
                        width="70px"
                        src={FileCloud}
                        alt="file-cloud"
                      />
                      <br />
                      Drag and drop your files here or <span>browse </span>
                    </div>
                  </div>

                  {showDocuments()}
                </section>
              )}
              {params &&
              (params.step === 'additional-brand-material' ||
                params.step === 'iconography') ? (
                <CheckBox className="mt-4 mb-4">
                  <label
                    className="check-container customer-pannel "
                    htmlFor="step">
                    {params.step === 'iconography'
                      ? 'We don’t have any special icons'
                      : 'We don’t have any other branding materials'}
                    <input
                      className="checkboxes"
                      type="checkbox"
                      id="step"
                      readOnly
                      onChange={() => setNoImages(!noImages)}
                    />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
              ) : (
                ''
              )}
            </DragDropImg>
          </BrandAssetBody>
        )}
      </div>

      <BrandAssetFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-right">
              <span
                className="skip-step cursor"
                onClick={() => redirectTo('skipped')}
                role="presentation">
                Skip this step
              </span>
              <Button
                className="btn-primary"
                disabled={
                  isLoading.loader ||
                  (documentData && documentData.length === 0)
                }
                onClick={() => redirectTo('completed')}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  <>
                    Next Step
                    <img
                      className="btn-icon ml-2"
                      width="16px"
                      src={WhiteArrowRight}
                      alt=""
                    />{' '}
                  </>
                )}
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
  .gray-normal-text {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
  }

  .Image-container {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: contents;

    li {
      display: inline-block;
      margin-right: 20px;
      vertical-align: text-bottom;

      .remove-box {
        display: none;
      }
      .uploading-file-name {
        text-align: center;
        padding-top: 60px;
        color: ${Theme.black};

        .file-path {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 80px;
          margin: auto;
        }
      }

      &:hover {
        .remove-box {
          background-color: ${Theme.white};
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
    padding-left: 95px;
    padding-right: 95px;
    margin-top: 50px;
  }
  @media only screen and (max-width: 767px) {
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 50px;
    .Image-container {
      list-style-type: none;
      padding: 0;
      margin: 0;
      display: contents;

      li {
        margin-right: 15px;

        &:hover {
          .remove-box {
            bottom: 4px;
            right: 4px;
          }
        }
      }
    }
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
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    margin-right: 20px;
  }
  @media only screen and (max-width: 330px) {
    .skip-step {
      color: ${Theme.gray40};
      font-size: ${Theme.extraNormal};
      margin-right: 10px;
    }
  }
`;

const DropDownBrandAsset = styled.div`
  margin-top: 100px;

  .css-yk16xz-control {
    background: ${Theme.gray8};
    border: none;
  }
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
`;

const CheckSelectImage = styled.div`
  background-color: ${Theme.gray8};
  border-radius: 8px;
  width: 170px;
  height: 170px;
  position: relative;

  .image-thumbnail {
    width: 170px;
    height: 170px;
    border-radius: 8px;
  }
  .blur-bg {
    background-color: rgba(46, 56, 77, 0.6);
    width: 170px;
    height: 170px;
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
    background-color: ${Theme.white};
    max-width: 160px;
    color: ${Theme.red};
    font-size: 16px;
    text-align: center;
    position: absolute;
    top: 62px;
    padding: 16px 13px;
    width: 100%;
    left: 6px;
    font-weight: 600;
    .red-trash-icon {
      width: 18px;
      vertical-align: text-top;
      margin-right: 6px;
    }
  }

  @media only screen and (max-width: 767px) {
    width: 160px;
    height: 160px;
    .image-thumbnail {
      width: 160px;
      height: 160px;
    }
    .blur-bg {
      width: 160px;
      height: 160px;
    }
    .confirm-delete-cross {
      right: 3px;
      top: 3px;
    }
    .delete-msg {
      max-width: 150px;
      top: 62px;
      padding: 10px;
      width: 100%;
      left: 6px;
    }
  }
`;

const DragDropImg = styled.div`
  padding-bottom: 60px;
  section {
    &.thumbnail-dropzone {
      display: flex;
      flex-flow: wrap;
      cursor: pointer;
      .dropzone {
        width: 170px;
        height: 170px;
        border: 1px dotted ${Theme.gray40};
        border-radius: 4px;
        padding: 50px 22px 0 20px;
        text-align: center;
        margin-right: 20px;
      }
      .thumbnail-select-files {
        font-size: ${Theme.extraNormal};
        color: ${Theme.black};
        text-align: center;

        span {
          color: ${Theme.orange};
        }
      }
    }
    &.drag-drop {
      .dropzone {
        max-width: 550px;
        height: 170px;
        border: 1px dotted ${Theme.gray40};
        border-radius: 4px;
        padding: 50px 22px 0 20px;
        text-align: center;
        margin-right: 20px;
      }
      .select-files {
        font-size: ${Theme.extraNormal};
        color: ${Theme.black};
        text-align: center;

        span {
          color: ${Theme.orange};
        }
      }
    }
  }
  @media only screen and (max-width: 767px) {
    section {
      &.thumbnail-dropzone {
        .dropzone {
          margin-right: 15px;
          width: 160px;
          height: 160px;
        }
      }
    }
  }
`;
