import axiosInstance from '../axios';
import {
  API_ARTICLE_COLLECTIONS,
  API_ARTICLE_BOARDS,
  API_ARTICLE_CARDS,
  API_ARTICLE_SEARCH,
  API_UPDATE_ARTICLE,
  API_CREATE_ARTICLE,
} from '../constants/ApiConstants';

export async function getArticleCollections() {
  const result = await axiosInstance
    .get(API_ARTICLE_COLLECTIONS)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export function getArticleSearch(searchTerms, collectionId) {
  const params = { searchTerms, collectionId };
  const result = axiosInstance
    .get(API_ARTICLE_SEARCH, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getArticleBoards(id, type) {
  const params =
    type === 'boards' ? { collectionId: id, boardId: 'home' } : { boardId: id };
  const result = await axiosInstance
    .get(API_ARTICLE_BOARDS, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getArticleCards() {
  const result = await axiosInstance
    .get(API_ARTICLE_CARDS)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateArticle(data) {
  const result = await axiosInstance
    .post(API_UPDATE_ARTICLE, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createArticle(data) {
  const result = await axiosInstance
    .post(API_CREATE_ARTICLE, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
