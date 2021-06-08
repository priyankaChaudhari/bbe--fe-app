/* eslint-disable react/jsx-props-no-spreading */
/* eslint no-restricted-syntax: off */
/* eslint no-nested-ternary:off */

import React, { useState } from 'react';

import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TrashIcons, RedTrashIcon } from '../../theme/images';
import { CheckBox } from '../../common';

export default function DragDrop({ setSelectedFiles }) {
  const [files, setFiles] = useState([]);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  //   const [currentRejectedFiles, setRejectedFiles] = useState([]);

  const img = {
    display: 'block',
    width: '100%',
    height: '100%',
  };

  const removeFile = (file) => {
    const newFiles = [...files];
    for (const fileList of newFiles) {
      for (const item of fileList) {
        if (file.name === item.name) {
          if (fileList.length === 1) {
            newFiles.splice(newFiles.indexOf(fileList), 1);
          } else {
            fileList.splice(fileList.indexOf(item), 1);
          }
        }
      }
    }
    setFiles(newFiles);
    setSelectedFiles(newFiles);
    setShowDeleteMsg({ [file.name]: false });
  };

  // const removeAll = () => {
  //   setFiles([]);
  //   setSelectedFiles([]);
  // };

  const showThumbnail = (thumbnail) => {
    return <>{thumbnail}</>;
  };

  const Previews = () => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: 'image/*',
      // : 'image/*, video/*, .pdf',
      onDrop: (acceptedFiles, rejectedFiles) => {
        // if (rejectedFiles) {
        //   setRejectedFiles(rejectedFiles);
        // }
        setSelectedFiles([...files, acceptedFiles]);
        if (rejectedFiles.length === 0) {
          setFiles((prevFiles) => [
            ...prevFiles,
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              }),
            ),
          ]);
        }
      },
    });

    const generateFileType = (type, preview) => {
      if (type.includes('image')) {
        return <img src={preview} alt="img" style={img} />;
      }
      return '';
    };

    const thumbnail = files.map((item) => (
      <ul className="Image-container" key={Math.random()}>
        {item.map((file) => (
          <li>
            <CheckBox className="selected-img mt-4">
              <label
                className="check-container customer-pannel"
                htmlFor="add-addendum">
                <input type="checkbox" id="add-addendum" />
                <span className="checkmark" />
                <CheckSelectImage>
                  {' '}
                  {generateFileType(file.type, file.preview)}
                  {showDeleteMsg[file.name] ? <div className="blur-bg" /> : ''}
                  <div
                    className="remove-box"
                    role="presentation"
                    onClick={() => setShowDeleteMsg({ [file.name]: true })}>
                    <img className="trash-icon" src={TrashIcons} alt="check" />
                  </div>
                  {showDeleteMsg[file.name] ? (
                    <div
                      className="delete-msg"
                      onClick={() => removeFile(file)}
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
    ));
    return (
      <section>
        <div className="mb-4" {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className=" mb-3 ">
            <br />
            Drag and drop some files here, or click to select files
          </div>
        </div>
        {showThumbnail(thumbnail)}

        {/* <>
          {files.length > 0 && (
            <div className="row">
              <div className="col-12 text-center mt-4 mb-lg-0 mb-3">
                <Button type="button" onClick={() => removeAll()}>
                  Remove All
                </Button>
              </div>
            </div>
          )}
        </> */}

        {/* {currentRejectedFiles.length ? (
          <div className="text-danger">File size is larger than 26 Mb</div>
        ) : (
          ''
        )} */}
      </section>
    );
  };
  return <Previews />;
}

DragDrop.defaultProps = {
  setSelectedFiles: () => {},
};

DragDrop.propTypes = {
  setSelectedFiles: PropTypes.func,
};

const CheckSelectImage = styled.div`
  background-color: #f4f6fc;
  border-radius: 8px;
  width: 170px;
  height: 170px;
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
  .remove-box {
    background-color: #ffffff;
    border: 1px solid #e2e2ea;
    border-radius: 6px;
    width: 40px;
    height: 40px;
    position: absolute;
    bottom: -8px;
    right: -8px;
    padding: 9px;
    .trash-icon {
      width: 22px;
    }
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
