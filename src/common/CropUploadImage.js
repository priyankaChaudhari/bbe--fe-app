import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Modal from 'react-modal';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import b64toBlob from 'b64-to-blob';

import {
  CloseIcon,
  CompanyDefaultUser,
  DefaultUser,
} from '../theme/images/index';
import { API_DOCUMENTS } from '../constants/ApiConstants';
import axiosInstance from '../axios';
import { Button, PageLoader } from './index';
import ModalBox from './ModalBox';
import EditIcons from '../theme/images/icons/edit-icon.svg';
import { getCustomerDetails } from '../store/actions/customerState';
import { showProfileLoader, userMe } from '../store/actions/userState';
import ErrorMsg from './ErrorMsg';

export default function CropUploadImage({ type, id, setDocumentImage }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'page' });
  const [cropData, setCropData] = useState({});
  const [cropper, setCropper] = useState('');
  const [image, setImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [fileDetails, setFileDetails] = useState({});
  const imageID =
    setDocumentImage &&
    setDocumentImage[0] &&
    Object.keys(setDocumentImage[0]) &&
    Object.keys(setDocumentImage[0])[0];
  const defaultPic = type === 'customer' ? CompanyDefaultUser : DefaultUser;

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      maxWidth: '600px',
      transform: 'translate(-50%, -50%)',
    },
  };

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      fileDetails.preview = cropper.getCroppedCanvas().toDataURL();
      setCropData(fileDetails);
    }
  };

  const onImageChanged = (e) => {
    setIsLoading({ loader: true, type: 'page' });
    if (fileDetails && Object.keys(fileDetails).length !== 0) {
      setFileDetails({});
      setCropData({});
    }

    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    setFileDetails(files[0]);
    reader.readAsDataURL(files[0]);
    setShowModal(true);
    e.target.value = '';
    setIsLoading({ loader: false, type: 'page' });
  };

  const createDocument = () => {
    const base64ToBlob =
      fileDetails && fileDetails.preview && fileDetails.preview.split(',')[1];
    const blob = b64toBlob(base64ToBlob, fileDetails.type);
    const formData = {
      original_name: fileDetails.name,
      entity_id: id,
      entity_type: type,
      mime_type: blob.type,
      status: 'requested',
      size: blob.size,
      document_type: 'profile_photo',
    };
    const api = imageID
      ? axiosInstance.patch(`${API_DOCUMENTS + imageID}/`, formData)
      : axiosInstance.post(API_DOCUMENTS, formData);

    setIsLoading({ loader: true, type: 'button' });
    api.then((res) => {
      if (res && res.data && res.data.presigned_url !== '') {
        const request = {
          url: res.data.presigned_url,
          headers: {
            'Content-type': res.data.mime_type,
          },
        };
        axios.put(request.url, blob, { headers: request.headers }).then(() => {
          axiosInstance
            .patch(`${API_DOCUMENTS + res.data.id}/`, {
              status: 'available',
            })
            .then(() => {
              if (type === 'user') {
                dispatch(userMe());
                dispatch(showProfileLoader(true));
              } else {
                dispatch(getCustomerDetails(id));
              }
              setIsLoading({ loader: false, type: 'button' });
              setShowModal(false);
            });
        });
      } else {
        setIsLoading({ loader: false, type: 'button' });
      }
      return res;
    });
  };

  const cancelImageCrop = () => {
    if (cropData && cropData.preview === undefined) {
      setFileDetails({});
      setImage('');
      setCropData({});
      setCropper('');
      setShowModal(false);
    } else {
      const newCrop = fileDetails;
      delete newCrop.preview;
      setCropData({ ...cropData, preview: undefined });
      setFileDetails(newCrop);
    }
  };

  const checkImageFormat = () => {
    if (image === '') {
      return (
        <PageLoader component="modal" color="#FF5933" type="page" height={40} />
      );
    }
    const value = image && image.split(';') && image.split(';')[0];
    if (!value.includes('image')) {
      return (
        <ErrorMsg className="text-center">Please check the format.</ErrorMsg>
      );
    }
    return '';
  };

  return (
    <div>
      <Modal
        isOpen={showModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Image upload modal">
        <ModalBox className="crop-image">
          <img
            className="float-right cursor cross-icon "
            src={CloseIcon}
            alt="close"
            role="presentation"
            onClick={() => {
              setShowModal(false);
            }}
          />
          <>
            <div className="modal-body">
              <h4 className="mb-3"> Upload Profile Photo</h4>

              <div className="row text-center">
                {fileDetails && fileDetails.preview === undefined ? (
                  <div className="col-12">
                    {' '}
                    <Cropper
                      className="crop-cantainer-img"
                      initialAspectRatio={1 / 1}
                      aspectRatio={1 / 1}
                      preview=".img-preview"
                      src={image}
                      viewMode={1}
                      guides={false}
                      minCropBoxHeight={200}
                      minCropBoxWidth={200}
                      minCanvasHeight={200}
                      minCanvasWidth={200}
                      minContainerHeight={200}
                      background={false}
                      responsive
                      autoCropArea={1}
                      checkOrientation={false}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                    />
                  </div>
                ) : (
                  <div className="col-12">
                    <div className="croped-img">
                      <img src={fileDetails.preview} alt="pic" />
                    </div>
                  </div>
                )}
              </div>
              {checkImageFormat()}
            </div>
            {image &&
            image.split(';') &&
            image.split(';')[0].includes('image') ? (
              <>
                <div className="footer-line" />
                <div className="row">
                  <div className="col-12 text-center">
                    {cropData && cropData.preview === undefined ? (
                      <Button
                        className=" btn-primary m-3 p-2"
                        type="button"
                        onClick={(event) => getCropData(event)}>
                        Crop Image
                      </Button>
                    ) : (
                      <Button
                        className=" btn-primary m-3 p-2"
                        type="button"
                        onClick={() => createDocument()}>
                        {isLoading.loader && isLoading.type === 'button' ? (
                          <PageLoader color="#fff" type="button" />
                        ) : (
                          'Upload'
                        )}
                      </Button>
                    )}
                    {isLoading.loader && isLoading.type === 'button' ? (
                      ''
                    ) : (
                      <Button
                        className=" btn-gray m-3 p-2"
                        type="button"
                        onClick={() => cancelImageCrop()}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Button
                className=" btn-gray m-3 p-2"
                type="button"
                onClick={() => cancelImageCrop()}>
                Cancel
              </Button>
            )}
          </>
        </ModalBox>
      </Modal>

      <UpdateProfile>
        <div className="update-profile">
          <img
            src={
              (fileDetails && fileDetails.preview === '') ||
              (fileDetails && fileDetails.preview === undefined)
                ? setDocumentImage &&
                  setDocumentImage[0] &&
                  Object.values(setDocumentImage[0])
                  ? Object.values(setDocumentImage[0])[0]
                  : defaultPic
                : fileDetails.preview
            }
            className={
              type === 'customer' ? 'profile-photo' : 'edit-profile mr-3'
            }
            alt="profile"
          />
          {/* <img
            src={ViewIcons}
            alt="brand"
            className={type === 'customer' ? 'view-customer-icon' : 'view-icon'}
            role="presentation"
            onClick={() => {
              setShowModal(true);
            }}
          /> */}
        </div>
        <div
          className={
            type === 'customer' ? 'edit-account' : 'edit-profile-pic cursor'
          }>
          <img src={EditIcons} alt="brand" className="edit-icon cursor" />
          <input
            type="file"
            accept="image/*"
            className="hide_file cursor"
            onChange={(event) => onImageChanged(event)}
          />
        </div>
      </UpdateProfile>
    </div>
  );
}
CropUploadImage.defaultProps = {
  setDocumentImage: [],
  id: '',
};

CropUploadImage.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  setDocumentImage: PropTypes.arrayOf(PropTypes.object),
};

const UpdateProfile = styled.div`
 position: relative;
  .update-profile {
    position: relative;

    .view-icon {
      display: none;
      left: 14px;
      top: 15px;
      position: absolute;
      cursor: pointer;
    }

    .view-customer-icon {
      display: none;
      left: 50px;
      top: 50px;
      position: absolute;
      cursor: pointer;
    }
  }

    .edit-account {
        bottom: 5px;
        width: 45px;
        height: 45px;
        position: absolute;
        left: 98px;
        padding: 10px;
        border-radius: 50%;
        background: white;
        border: 1px solid rgba(46, 91, 255, 0.08);
        cursor: pointer;

        .edit-icon {
          width: 24px;
            cursor: pointer;
          
        }
          .hide_file {
            position: absolute;
            z-index: 1000;
            opacity: 0;
            right: 0;
            top: 0;
            height: 100%;
            font-size: 24px;
           
          }
        }
      }

  .edit-profile-pic {
    width: 25px;
    height: 25px;
    bottom: 3px;
    bottom: -6px;
    position: absolute;
    left: 31px;
    padding: 4px;
    border-radius: 50%;
    background: white;
    border: 1px solid rgba(46, 91, 255, 0.08);
    cursor: pointer;

    .edit-icon {
      width: 14px;
    }
    .hide_file {
      position: absolute;
      z-index: 1000;
      opacity: 0;
      cursor: pointer;
      right: 0;
      top: 0;
      height: 100%;
      font-size: 24px;
    }
  }
`;
