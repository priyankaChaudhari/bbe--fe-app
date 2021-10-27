import React, { useState } from 'react';

import Modal from 'react-modal';
import { bool, func } from 'prop-types';

import { CloseIcon } from '../../theme/images';
import { PageLoader, ModalBox, FormField, Button } from '..';
import { createArticle } from '../../api';

export default function ShareIdeaModal({
  showArticle,
  setShowArticle,
  showArticleSuccess,
  setShowArticleSuccess,
}) {
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [formData, setFormData] = useState({});
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const saveArticle = () => {
    setIsLoading({ loader: true, type: 'button' });
    createArticle(formData).then((response) => {
      if (response?.status === 201) {
        setShowArticleSuccess(true);
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <Modal
      isOpen={showArticle}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Profile modal">
      <ModalBox>
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => setShowArticle(false)}
          role="presentation"
        />

        {!showArticleSuccess ? (
          <div className="modal-body">
            <h4>Share your Idea</h4>
            <p className="text-detail-modal">
              Please fill out the form below to submit an idea, whether it be a
              new feature, change to an existing feature or a new knowledge base
              article.
            </p>

            <FormField className="mt-3">
              <textarea
                className=" text-area"
                rows="6"
                placeholder="Please provide details of the idea you have."
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    description: event.target.value,
                  })
                }
              />
            </FormField>
            <Button
              className={
                !formData.description
                  ? 'btn-primary mt-4 w-100 disabled'
                  : 'btn-primary mt-4 w-100'
              }
              onClick={() => saveArticle()}
              disabled={!formData.description}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        ) : (
          <div className="modal-body">
            <h5 className="mt-4">Thanks for sharing your ideas!</h5>
            <p className="text-detail-modal pt-0 pb-0">
              Your request to add knowledge has been submitted. One of our
              knowledge experts will review, and if approved, they will create
              and publish the knowledge.
            </p>

            <Button
              className="btn-primary mt-3 w-100"
              onClick={() => setShowArticle(false)}>
              Continue
            </Button>
          </div>
        )}
      </ModalBox>
    </Modal>
  );
}

ShareIdeaModal.defaultProps = {
  showArticle: {},
  showArticleSuccess: false,
  setShowArticle: () => {},
  setShowArticleSuccess: () => {},
};

ShareIdeaModal.propTypes = {
  showArticle: func,
  setShowArticle: func,
  setShowArticleSuccess: func,
  showArticleSuccess: bool,
};
