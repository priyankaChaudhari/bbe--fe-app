/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */

import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';
import queryString from 'query-string';
import ReactTooltip from 'react-tooltip';
import Select, { components } from 'react-select';
import Modal from 'react-modal';

import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

import { toast, ToastContainer } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import $ from 'jquery';

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
  CaretUp,
} from '../../theme/images';
import {
  Button,
  CheckBox,
  HeaderDownloadFuntionality,
  PageLoader,
  UnauthorizedHeader,
  ModalBox,
  ActionDropDown,
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
  getBrandAssetsSummary,
  updateBrandAssetStep,
} from '../../api/BrandAssestsApi';
import BrandAssetsPreview from './BrandAssetsPreview';

const viewOptions = [
  { value: 'brand-logo', label: 'Brand Logo' },
  { value: 'brand-guidelines', label: 'Brand Guidelines' },
  { value: 'font-files', label: 'Font Files' },
  { value: 'iconography', label: 'Iconography' },
  { value: 'additional-brand-material', label: 'Additional Brand Material' },
];

const customStyles = {
  content: {
    maxWidth: '100% ',
    width: '100% ',
    height: '100%',
    inset: '0px',
  },
};

const customStylesForAlert = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '474px ',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function BrandAssetUpload() {
  const history = useHistory();
  const { id, brandId } = useParams();
  const params = queryString.parse(history.location.search);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [brandAssetData, setBrandAssetData] = useState([]);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [noImages, setNoImages] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // const [imagesAssets, setImagesAssets] = useState([]);
  const [showAssetPreview, setShowAssetPreview] = useState({
    selectedFile: null,
    show: false,
    documents: documentData,
    index: 0,
  });
  const [showBtns, setShowBtns] = useState({ upload: null, download: null });
  const [selectedDropdown, setSelectedDropdown] = useState({});
  const [downloadIds, setDownloadIds] = useState([]);
  const downloadOptions = [
    { value: 'current', label: 'Current asset type only' },
    { value: 'all', label: 'All asset types' },
  ];

  const [uploadCount, setUploadCount] = useState({
    'brand-logo': '0 files uploaded',
    'brand-guidelines': '0 files uploaded',
    'font-files': '0 files uploaded',
    iconography: '0 files uploaded',
    'additional-brand-material': '0 files uploaded',
  });

  const formats = {
    'brand-logo': '.ai, .eps, .png, .jpg or .gif',
    'brand-guidelines': '.jpg, .png, .pdf, .tif, .psd, .docx',
    'font-files': '.ttf, .otf, or .woff',
    iconography: '.ai, .eps, .svg, .png, .jpg or .gif',
    'additional-brand-material': 'any',
  };
  const selectedFiles = [];
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowDeleteMsg(false);
    }
  };

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const setPreviewImageData = (response) => {
    if (showAssetPreview.selectedFile && response) {
      // for first element
      if (showAssetPreview.index === 0) {
        setShowAssetPreview({
          selectedFile: response[showAssetPreview.index],
          show: true,
          documents: response,
          index: showAssetPreview.index,
        });
      }

      // for last element
      if (showAssetPreview.index === response.length) {
        const index = showAssetPreview.index ? showAssetPreview.index - 1 : 0;
        setShowAssetPreview({
          selectedFile: response[index],
          show: true,
          documents: response,
          index,
        });
      }

      // for middle
      if (
        showAssetPreview.index >= 1 &&
        showAssetPreview.index < response.length
      ) {
        setShowAssetPreview({
          selectedFile: response[showAssetPreview.index],
          show: true,
          documents: response,
          index: showAssetPreview.index,
        });
      }
    }
    // if docuemnt list is empty
    if (!(response && response.length)) {
      setShowAssetPreview({
        selectedFile: null,
        show: false,
        documents: response,
        index: 0,
      });
    }
    setShowConfirmationModal(false);
    setIsLoadingDocument(false);
  };

  const handleDownloadOptions = (event) => {
    setIsLoading({ loader: true, type: 'page' });
    getDocuments(
      brandId,
      'brandassets',
      event.value === 'all' ? '' : selectedStep.key,
    ).then((response) => {
      const ids = [];
      response && response.forEach((op) => ids.push(op.id));
      setDownloadIds(ids);
      setSelectedDropdown({ ...selectedDropdown, dropdownValue: event });
      setIsLoading({ loader: false, type: 'page' });
    });
  };

  const getDocumentList = (docType) => {
    setDroppedFiles([]);
    setIsLoading({ loader: true, type: 'page' });
    if (
      selectedDropdown &&
      selectedDropdown.dropdownValue &&
      selectedDropdown.dropdownValue.value === 'all'
    )
      handleDownloadOptions({ value: 'all', label: 'All asset types' });

    getDocuments(brandId, 'brandassets', docType).then((response) => {
      if (
        (selectedDropdown &&
          selectedDropdown.dropdownValue &&
          selectedDropdown.dropdownValue.event === 'current') ||
        (selectedDropdown && selectedDropdown.dropdownValue === undefined)
      ) {
        const ids = [];
        response && response.forEach((op) => ids.push(op.id));
        setDownloadIds(ids);
      }
      setDocumentData(response);
      setPreviewImageData(response);
      setIsLoading({ loader: false, type: 'page' });
    });
  };

  const getAssetsSummary = () => {
    const tempCounts = {};
    getBrandAssetsSummary(brandId).then((response) => {
      setSelectedDropdown({
        ...selectedDropdown,
        total: response && response.data && response.data.total_images,
      });
      if (response && response.data && response.data.steps) {
        Object.keys(response.data.steps).forEach((key) => {
          const tempKey = key.replaceAll('_', '-');
          tempCounts[tempKey] = response.data.steps[key];
        });
        setUploadCount(tempCounts);
      }
    });
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setSelectedStep(BrandSteps.find((op) => op.url === params.step));
    const docType =
      BrandSteps.find((op) => op.url === params.step) &&
      BrandSteps.find((op) => op.url === params.step).key;
    if (
      selectedDropdown &&
      selectedDropdown.dropdownValue &&
      selectedDropdown.dropdownValue === 'all'
    ) {
      handleDownloadOptions({ value: 'all', label: 'All asset types' });
    }
    getDocumentList(docType);
    getAssetsSummary();
    getBrandAssetsDetail(brandId).then((response) => {
      setBrandAssetData(response && response.data);
      if (response && response.data && response.data.is_completed)
        setShowBtns({ ...showBtns, upload: false });
      else setShowBtns({ ...showBtns, upload: true });
      if (
        response &&
        response.data &&
        response.data.steps &&
        response.data.steps[
          params.step === 'additional-brand-material'
            ? 'additional_brand_material'
            : params.step
        ] === 'none'
      ) {
        setNoImages(true);
        $('.checkboxes input:checkbox').prop('checked', true);
      } else {
        setNoImages(false);
        $('.checkboxes input:checkbox').prop('checked', false);
      }
    });
  }, [params.step]);

  // $(document).on('click', (e) => {
  //   if ($(e.target).closest('#hideDelete').length === 0) {
  //     setShowDeleteMsg(false);
  //   }
  // });

  const destructureselectedFiles = () => {
    const formData = [];
    for (const files of selectedFiles) {
      for (const item of files) {
        formData.push({
          original_name: item.name,
          entity_id: brandId,
          entity_type: 'brandassets',
          size: item.size,
          mime_type: item.type
            ? item.type
            : params.step === 'font-files'
            ? `font/${item.name.split('.')[1]}`
            : item.name.split('.')[1],
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
    if (files && files.length) setIsLoading({ loader: true, type: 'button' });
    const formData = destructureselectedFiles();

    axiosInstance
      .post(API_DOCUMENTS, formData, {
        onUploadProgress: (data) => {
          files &&
            files.map((file) => {
              if (file.progress > 0) file.progress = 50; // (data.loaded / data.total) * 100;
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
                            if (file.progress > 0)
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
                    newFiles.unshift(r.data);
                    setDocumentData(newFiles);
                    setDroppedFiles([]);
                    setUploadCount({
                      ...uploadCount,
                      [params.step]:
                        newFiles.length === 1
                          ? '1 file uploaded'
                          : `${newFiles.length} files uploaded`,
                    });
                  })
                  .catch((error) => {
                    toast.error(
                      error &&
                        error.response &&
                        error.response.data &&
                        error.response.data.detail,
                    );
                    setIsLoading({ loader: false, type: 'page' });
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
      })
      .catch((error) => {
        toast.error(
          <div>
            The person who asked you to complete this section has changed who
            has access.
            <br /> Please reach out to onboarding@buyboxexperts.com if you have
            any questions.
          </div>,
        );
        setDroppedFiles([]);
        setIsLoading({ loader: false, type: 'page' });
      });
  };
  const { getRootProps, getInputProps } = useDropzone({
    // accept: params && params.step && formats && formats[params.step],
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

  const redirectTo = (value, step = null, type) => {
    setIsLoading({ loader: true, type: 'button' });
    updateBrandAssetStep(brandId, {
      steps: {
        ...brandAssetData.steps,
        [selectedStep && selectedStep.key]: noImages ? 'none' : value,
      },
      last_visited_step: selectedStep && selectedStep.skip,
    }).then((response) => {
      if (response && response.status === 200) {
        if (
          type === 'brandmaterial' &&
          params &&
          params.step === 'additional-brand-material'
        ) {
          setShowBtns({ upload: false, download: false });
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
            search: `step=additional-brand-material`,
          });
        } else if (
          type !== 'lhs' &&
          selectedStep &&
          selectedStep.skip === 'summary'
        ) {
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
            search: step
              ? `step=${step}`
              : `step=${selectedStep && selectedStep.skip}`,
          });

        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const deleteImage = (imageId) => {
    setIsLoading({ loader: true, type: 'page' });
    setIsLoadingDocument(true);
    deleteDocument(imageId).then((res) => {
      if (res && res.status === 204) {
        getDocumentList(selectedStep && selectedStep.key);
        getAssetsSummary();
        setShowDeleteMsg(false);
      }
      if (res && res.status === 401) {
        setIsLoading({ loader: false, type: 'page' });
        toast.error('Access Denied, Unable to upload.');
      }
    });
  };

  const saveLastStep = () => {
    updateBrandAssetStep(brandId, { last_visited_step: selectedStep.url });
    history.push(
      PATH_CUSTOMER_DETAILS.replace(':id', id).replace(':brandId', brandId),
    );
  };

  const handleDownloadIds = (event) => {
    const ids = [...downloadIds];
    if (event.target.checked) {
      const index = ids.indexOf(event.target.name);
      if (index === -1) ids.push(event.target.name);
    }
    if (!event.target.checked) {
      const index = ids.indexOf(event.target.name);
      if (index > -1) ids.splice(index, 1);
    }
    setDownloadIds(ids);
  };

  const navigateStep = (item) => {
    if (
      documentData &&
      documentData.length &&
      (params && params.step) !== item.url
    )
      redirectTo('completed', item.url, 'lhs');
    else
      history.push({
        pathname: history.location.pathname.includes('/assigned-brand-asset/')
          ? PATH_UNAUTHORIZED_BRAND_ASSET.replace(':id', id).replace(
              ':brandId',
              brandId,
            )
          : PATH_BRAND_ASSET.replace(':id', id).replace(':brandId', brandId),
        search: `step=${item.url}`,
      });
  };

  const onClickOfObject = (file, i) => {
    // const result = documentData.filter((item) =>
    //   item.mime_type.includes('image'),
    // );
    // setImagesAssets(result);

    setShowAssetPreview({
      selectedFile: file,
      show: true,
      documents: documentData,
      index: i,
    });
  };

  const showDocuments = () => {
    return (
      <ul className="Image-container" key={Math.random()}>
        {droppedFiles &&
          droppedFiles.length > 0 &&
          droppedFiles.map((file) => (
            <li key={file && file.file.lastModified}>
              <CheckBox className="selected-img mb-3">
                <label
                  className="check-container customer-pannel"
                  htmlFor="add-addendum">
                  {/* <input type="checkbox" id="add-addendum" />
                  <span className="checkmark" /> */}
                  <CheckSelectImage>
                    <div className="image-thumbnail">
                      <div className="uploading-file-name">
                        Uploading file
                        <div className="file-path"> {file.file.name}</div>
                      </div>
                      {file && file.progress && file.progress > 0 && (
                        <div className="uploading-progress-bar ">
                          file.progress
                          <Progress
                            percent={file.progress}
                            theme={{
                              active: {
                                symbol: '',
                                color: '#ff5933',
                              },
                              success: {
                                symbol: '',
                                color: '#ff5933',
                              },
                              status: '',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </CheckSelectImage>
                </label>
              </CheckBox>
            </li>
          ))}

        {documentData &&
          documentData.length > 0 &&
          documentData.map((file, i) => (
            <li key={file.id}>
              <CheckBox className="selected-img mb-3">
                <label
                  className="check-container customer-pannel"
                  htmlFor={file.id}>
                  {showBtns.download ? (
                    <>
                      <input
                        type="checkbox"
                        name={file.id}
                        id={file.id}
                        defaultChecked={downloadIds.find(
                          (op) => op === file.id,
                        )}
                        onChange={(event) => handleDownloadIds(event)}
                      />
                      <span className="checkmark" />{' '}
                    </>
                  ) : (
                    ''
                  )}
                  <CheckSelectImage>
                    <object
                      className="image-thumbnail"
                      data={file && file.presigned_url}
                      type={file && file.mime_type}
                      width="250"
                      height="200"
                      role="presentation">
                      <div className="unsupport-file-name">
                        <div className="file-path">
                          {file && file.original_name}
                        </div>
                      </div>
                    </object>
                    {/* FOR Object tag clickable */}
                    <div
                      className="clickable"
                      onClick={() =>
                        brandAssetData &&
                        brandAssetData.is_completed &&
                        (showBtns.upload || showBtns.download)
                          ? ''
                          : onClickOfObject(file, i)
                      }
                      role="presentation"
                    />
                    {showDeleteMsg[file.id] ? <div className="blur-bg" /> : ''}

                    {brandAssetData &&
                    brandAssetData.is_completed &&
                    (showBtns.download || showBtns.upload) ? (
                      ''
                    ) : (
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
                    )}

                    {showDeleteMsg[file.id] ? (
                      <div
                        id="hideDelete"
                        ref={ref}
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        pauseOnFocusLoss={false}
      />
      {brandAssetData && brandAssetData.is_completed ? (
        <HeaderDownloadFuntionality>
          <div className="container-fluid">
            <div className="row">
              {' '}
              <div className="col-md-6 col-sm-12">
                {' '}
                <div className="header-title"> Brand Assets</div>
              </div>
              <div className="col-md-6 col-sm-12">
                <ul className="contract-download-nav ">
                  <li
                    className={
                      showBtns.upload || showBtns.download
                        ? 'download-pdf disabled'
                        : 'download-pdf'
                    }
                    role="presentation"
                    onClick={() =>
                      setShowBtns({ download: false, upload: true })
                    }>
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
                  <li
                    className={
                      showBtns.upload || showBtns.download
                        ? 'download-pdf disabled'
                        : 'download-pdf'
                    }
                    role="presentation"
                    onClick={() => {
                      setShowBtns({ download: true, upload: false });
                    }}>
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
                        history.push(PATH_CUSTOMER_DETAILS.replace(':id', id));
                      }}
                      role="presentation"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </HeaderDownloadFuntionality>
      ) : (
        <>
          {history.location.pathname.includes('/assigned-brand-asset/') ? (
            <UnauthorizedHeader />
          ) : (
            <BackToStep>
              {' '}
              <div className="container-fluid">
                {' '}
                <div className="row">
                  <div className="col-12">
                    <div
                      role="presentation"
                      className="back-link"
                      onClick={() => saveLastStep()}>
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
          )}
        </>
      )}

      <BrandAssetSideBar
        className="d-none d-lg-block"
        completed={brandAssetData && brandAssetData.is_completed}
        history={history.location.pathname}>
        <div className="label-heading mb-3">Your BrandSteps</div>
        <ul className="asset-check-list">
          {BrandSteps.map((item) => (
            <li
              className="cursor"
              key={item.key}
              role="presentation"
              onClick={() => navigateStep(item)}>
              {/* if step complete show this and add active class to item.label and file upload */}
              {item &&
              item.url &&
              uploadCount &&
              uploadCount[item.url] &&
              uploadCount[item.url] &&
              !uploadCount[item.url].includes('Skipped') &&
              uploadCount[item.url] !== '0 files uploaded' ? (
                <img
                  className="checked-gray"
                  src={OrangeCheckMark}
                  alt="check"
                />
              ) : (
                <img className="checked-gray" src={GrayCheckIcon} alt="check" />
              )}
              <div className="check-list-item">
                <div
                  className={
                    item &&
                    item.url &&
                    uploadCount &&
                    uploadCount[item.url] &&
                    !uploadCount[item.url].includes('Skipped') &&
                    uploadCount[item.url] !== '0 files uploaded'
                      ? 'check-list-label active'
                      : 'check-list-label'
                  }>
                  {item.label}
                </div>
                <div
                  className={
                    item &&
                    item.url &&
                    uploadCount &&
                    uploadCount[item.url] &&
                    !uploadCount[item.url].includes('Skipped') &&
                    uploadCount[item.url] !== '0 files uploaded'
                      ? 'check-list-file-uploaded active'
                      : 'check-list-file-uploaded'
                  }>
                  {item && item.url && uploadCount && uploadCount[item.url]}{' '}
                  {/* files uploaded */}
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

      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader
          component="upload-brand-asset"
          color="#FF5933"
          type="page"
        />
      ) : (
        <BrandAssetBody
          completed={brandAssetData && brandAssetData.is_completed}>
          <DropDownBrandAsset className="customer-dropdown-select d-lg-none d-block mb-3 ">
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
              components={{ DropdownIndicator }}
            />
          </DropDownBrandAsset>
          <div className="container-fluid">
            <div className="row">
              <div className="col-9 ">
                <div className="label-heading">
                  Part {selectedStep && selectedStep.step}/5
                </div>

                <h3 className="page-heading ">
                  {selectedStep && selectedStep.label}
                </h3>
                <p className="normal-text mt-1 mb-0">
                  {selectedStep && selectedStep.subtitle}
                </p>
                <div className="gray-normal-text mt-1 mb-3">
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
                        <p
                          style={{
                            color: 'white',
                            fontSize: '12px',
                            textTransform: 'initial',
                          }}>
                          {formats && params.step && formats[params.step]}
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
                      {showBtns.upload ||
                      history.location.pathname.includes(
                        '/assigned-brand-asset/',
                      ) ? (
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
                            Drag and drop your files here or{' '}
                            <span>browse </span>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}

                      {showDocuments()}
                    </section>
                  ) : (
                    <section
                      className={
                        noImages ? 'drag-drop mb-4 disabled' : 'drag-drop mb-4'
                      }>
                      {showBtns.upload ||
                      history.location.pathname.includes(
                        '/assigned-brand-asset/',
                      ) ? (
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
                            Drag and drop your files here or{' '}
                            <span>browse </span>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}

                      {showDocuments()}
                    </section>
                  )}
                  {params &&
                  (params.step === 'additional-brand-material' ||
                    params.step === 'iconography') &&
                  documentData &&
                  documentData.length === 0 ? (
                    <CheckBox className="checkboxes mt-4 mb-4">
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
                          defaultChecked={noImages}
                          onChange={(event) => {
                            if (brandAssetData && brandAssetData.is_completed) {
                              if (event.target.checked)
                                redirectTo('none', '', 'brandmaterial');
                              if (
                                !event.target.checked &&
                                documentData &&
                                documentData.length === 0
                              ) {
                                setShowBtns({ upload: true, download: false });
                              }
                            }

                            setNoImages(!noImages);
                          }}
                        />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  ) : (
                    ''
                  )}
                </DragDropImg>
              </div>
              <div className="col-3  text-right pr-lg-5 ">
                <ActionDropDown className="w-170 text-left">
                  {showBtns.download ? (
                    <Select
                      classNamePrefix="react-select "
                      options={downloadOptions}
                      defaultValue={
                        selectedDropdown.dropdownValue === undefined
                          ? downloadOptions[0]
                          : selectedDropdown.dropdownValue
                      }
                      onChange={(event) => handleDownloadOptions(event)}
                      components={{ DropdownIndicator }}
                    />
                  ) : (
                    ''
                  )}
                </ActionDropDown>
              </div>
            </div>
          </div>
        </BrandAssetBody>
      )}
      <>
        {isLoading.loader && isLoading.type === 'page' ? (
          <PageLoader
            component="upload-brand-asset"
            color="#FF5933"
            type="page"
          />
        ) : (
          <>
            {showBtns.download ||
            showBtns.upload ||
            !(brandAssetData && brandAssetData.is_completed) ? (
              <BrandAssetFooter data-test="brandAssetFooter">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 text-right">
                      {brandAssetData && brandAssetData.is_completed ? (
                        <span className="skip-step cursor">
                          {showBtns.download
                            ? `${
                                downloadIds && downloadIds.length
                              } files selected`
                            : ''}
                        </span>
                      ) : (
                        <span
                          className="skip-step cursor"
                          onClick={() => redirectTo('skipped', '', '')}
                          role="presentation">
                          Skip this step
                        </span>
                      )}

                      {showBtns.download ? (
                        <>
                          <a
                            href={`${
                              process.env.REACT_APP_BASE_APP_URL +
                              process.env.REACT_APP_API_VERSION +
                              API_DOCUMENTS
                            }download/?token=${localStorage.getItem('token')}&${
                              selectedDropdown &&
                              selectedDropdown.total === downloadIds &&
                              downloadIds.length
                                ? queryString.stringify({
                                    brand_assets_id: [brandId],
                                  })
                                : queryString.stringify({
                                    document_id: downloadIds,
                                  })
                            }`}
                            target="_self"
                            onClick={() => {
                              toast.success(
                                'Files will download shortly, Do not close the browser.',
                              );
                              setIsLoading({
                                loader: true,
                                type: 'page',
                              });
                              setTimeout(() => {
                                setShowBtns({ download: false, upload: false });
                                getDocumentList(
                                  selectedStep && selectedStep.key,
                                );

                                setIsLoading({
                                  loader: false,
                                  type: 'page',
                                });
                              }, 4000);
                            }}>
                            <Button
                              className="btn-primary"
                              disabled={
                                isLoading.loader ||
                                (downloadIds && downloadIds.length === 0)
                              }>
                              {isLoading.loader &&
                              isLoading.type === 'button' ? (
                                <PageLoader color="#fff" type="button" />
                              ) : (
                                'Download Selected'
                              )}
                            </Button>
                          </a>
                          <Button
                            className="btn-transparent w-50 on-boarding ml-4"
                            onClick={() => {
                              getDocumentList(selectedStep && selectedStep.key);
                              setShowBtns({ download: false, upload: false });
                              setIsLoading({ loader: false, type: 'button' });
                            }}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="btn-primary"
                          disabled={
                            isLoading.loader || noImages
                              ? false
                              : showBtns.download &&
                                downloadIds &&
                                downloadIds.length === 0
                              ? true
                              : documentData && documentData.length === 0
                          }
                          onClick={() =>
                            showBtns.upload &&
                            brandAssetData &&
                            brandAssetData.is_completed
                              ? (setShowBtns({
                                  download: false,
                                  upload: false,
                                }),
                                getDocumentList(
                                  selectedStep && selectedStep.key,
                                ))
                              : redirectTo('completed', '', '')
                          }>
                          {isLoading.loader && isLoading.type === 'button' ? (
                            <PageLoader color="#fff" type="button" />
                          ) : (
                            <>
                              {brandAssetData && brandAssetData.is_completed ? (
                                <>
                                  {showBtns.upload
                                    ? 'Finish uploading'
                                    : 'Download Selected'}
                                </>
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
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </BrandAssetFooter>
            ) : (
              ''
            )}
          </>
        )}
      </>

      <Modal
        isOpen={showAssetPreview && showAssetPreview.show}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <ModalBox>
          <BrandAssetsPreview
            showAssetPreview={showAssetPreview}
            setShowAssetPreview={setShowAssetPreview}
            documentData={documentData}
            setShowConfirmationModal={setShowConfirmationModal}
            isLoading={isLoading}
          />
        </ModalBox>
      </Modal>

      <Modal
        isOpen={showConfirmationModal}
        style={customStylesForAlert}
        ariaHideApp={false}
        onRequestClose={() => setShowConfirmationModal(false)}
        contentLabel="Edit modal">
        <ModalBox>
          <div className="modal-body">
            <div className="alert-msg ">
              <span>Are you sure you want to delete this asset?</span>
            </div>
            <div className="text-center ">
              <Button
                onClick={() => {
                  deleteImage(
                    showAssetPreview &&
                      showAssetPreview.selectedFile &&
                      showAssetPreview.selectedFile.id,
                  );
                }}
                type="button"
                className="btn-primary on-boarding  mr-2 pb-2 mb-1">
                {isLoadingDocument ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Yes'
                )}
              </Button>

              <Button
                onClick={() => {
                  setShowConfirmationModal(false);
                }}
                type="button"
                className=" btn-transparent w-50 on-boarding ">
                Cancel
              </Button>

              {/* </Link> */}
            </div>
          </div>
        </ModalBox>
      </Modal>
    </>
  );
}

const BrandAssetBody = styled.div`
  padding-left: 400px;
  margin-top: ${(props) => (props.completed ? '50px' : '95px')};
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
        padding-top: 50px;
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
    margin-top: 80px;
  }
  @media only screen and (max-width: 767px) {
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 80px;

    .Image-container {
      li {
        margin-right: 15px;
      }
    }
  }
`;

const BrandAssetSideBar = styled.div`
  background-color: #f4f6fc;
  border-radius: 15px;
  max-width: 340px;
  position: fixed;
  top: ${(props) =>
    props.completed
      ? '100px'
      : props.history.includes('/assigned-brand-asset/')
      ? '80px'
      : '145px'};
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
          font-family: ${Theme.baseFontFamily};
          &.active {
            font-family: ${Theme.titleFontFamily};
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
  margin-top: 50px;

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
  .unsupport-file-name {
    padding: 80px 0;
    color: ${Theme.black};

    .file-path {
      color: ${Theme.black};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 145px;
      vertical-align: middle;
      position: relative;
      margin: 0 auto;
      text-align: center;
    }
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

  .clickable {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
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
      right: 4px;
      top: 4px;
    }
    .delete-msg {
      max-width: 150px;
      top: 62px;
      padding: 10px;
      width: 100%;
      left: 6px;
      font-weight: 600;
    }
  }
`;

const DragDropImg = styled.div`
  padding-bottom: 80px;
  max-height: 70vh;
  overflow: auto;
  section {
    &.thumbnail-dropzone {
      display: flex;
      flex-flow: wrap;

      .dropzone {
        width: 170px;
        height: 170px;
        border: 1px dotted ${Theme.gray40};
        border-radius: 4px;
        padding: 50px 22px 0 20px;
        text-align: center;
        margin-right: 20px;
        cursor: pointer;
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
        cursor: pointer;
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
          width: 160px;
          height: 160px;
          margin-right: 15px;
        }
      }
    }
  }
  @media only screen and (min-width: 1920px) {
    max-height: 100vh;
  }
`;
