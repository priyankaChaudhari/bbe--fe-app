import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { InputSearchWithRadius } from '../../common';
import { SearchIcon, RemoveIcon, ReadBookIcon } from '../../theme/images/index';
import { getArticleBoards, getArticleSearch } from '../../api/index';
import { PATH_ARTICLE_DETAILS } from '../../constants';

export default function ArticleSearch({
  setSelectedArticle,
  setActiveField,
  setArticleData,
  setScrollToTop,
}) {
  const history = useHistory();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [searchCount, setSearchCount] = useState(null);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    event.persist();
    setIsLoading({ loader: true, type: 'button' });
    setTimeout(() => {
      getArticleSearch(event.target.value, id || null).then((response) => {
        setSearchedData(response.data && response.data.result);
        setSearchCount(response.data && response.data.count);
        setIsLoading({ loader: false, type: 'button' });
      });
    }, 1000);
  };

  const redirectToArticle = (item) => {
    setScrollToTop(true);
    if (id) {
      setIsLoading({ loader: true, type: 'button' });
      getArticleBoards(
        item && item.boards && item.boards[0] && item.boards[0].id,
        'sections',
      ).then((response) => {
        setArticleData(response && response.data);
        setActiveField({
          board: item && item.boards && item.boards[0] && item.boards[0].id,
          article: item && item.id,
        });
        setSelectedArticle(item);
        setIsLoading({ loader: false, type: 'button' });
      });
    } else {
      history.push({
        pathname: `${PATH_ARTICLE_DETAILS.replace(':id', item.collection.id)}`,
        state: item,
      });
    }
    setSearchQuery('');
  };

  const generateSearchHTML = () => {
    const options = [];
    if (searchedData) {
      for (const item of searchedData) {
        options.push(
          <li
            className="cursor"
            role="presentation"
            onClick={() => redirectToArticle(item)}
            key={item.id}>
            <img className="book-list-icon" src={ReadBookIcon} alt="" />
            <div className="header-list">
              {item.preferredPhrase}

              <div className="sub-list">
                {item.collection && item.collection.name} |{' '}
                {item.boards && item.boards[0] && item.boards[0].title}
              </div>
            </div>
          </li>,
        );
      }
    }
    return options;
  };

  return (
    <InputSearchWithRadius className="mb-3">
      <input
        className={
          searchQuery &&
          searchQuery.length > 0 &&
          !isLoading.loader &&
          isLoading.type === 'button'
            ? 'article-search pb-5  form-control search-filter'
            : ' form-control search-filter'
        }
        placeholder="Search"
        onChange={(event) => handleSearch(event)}
        value={searchQuery || ''}
      />
      {searchQuery && searchQuery.length > 1 ? (
        <div className="drop-down-option">
          <ul>
            {isLoading.loader && isLoading.type === 'button' ? (
              <p className="search-loader">Loading....</p>
            ) : (
              <>
                <div className="result-found  ml-3">
                  {searchCount} results found
                </div>
                {generateSearchHTML()}
              </>
            )}
          </ul>
        </div>
      ) : (
        ''
      )}

      {searchQuery ? (
        <img
          className="remove-icon"
          src={RemoveIcon}
          alt=""
          onClick={() => setSearchQuery('')}
          role="presentation"
        />
      ) : (
        ''
      )}

      <img src={SearchIcon} alt="search" className="search-input-icon" />
    </InputSearchWithRadius>
  );
}

ArticleSearch.defaultProps = {
  setActiveField: () => {},
  setArticleData: () => {},
  setSelectedArticle: () => {},
  setScrollToTop: () => {},
};

ArticleSearch.propTypes = {
  setSelectedArticle: PropTypes.func,
  setArticleData: PropTypes.func,
  setActiveField: PropTypes.func,
  setScrollToTop: PropTypes.func,
};
