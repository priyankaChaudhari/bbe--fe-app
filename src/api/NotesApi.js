import queryString from 'query-string';
import axiosInstance from '../axios';
import { API_NOTES } from '../constants/ApiConstants';

export async function getNotes(
  customerId,
  searchString,
  pageNumber,
  selectedFilters,
) {
  const filters = { ...selectedFilters };

  let statusParams = {};
  if (selectedFilters && selectedFilters.team && selectedFilters.team.length) {
    statusParams = queryString.stringify({
      team: selectedFilters.team,
    });
  }

  if (
    !(selectedFilters && selectedFilters.team && selectedFilters.team.length) &&
    filters.notes === 'Team Notes'
  ) {
    filters.no_team = true;
  }

  delete filters.team;
  delete filters.notes;

  const params = {
    customer: customerId,
    expand: 'user',
    page: pageNumber || 1,
    ...filters,
  };

  if (searchString) {
    params.q = searchString;
  }

  const result = await axiosInstance
    .get(
      `${API_NOTES}?${statusParams && statusParams.length ? statusParams : ''}`,
      { params },
    )
    .then((response) => {
      return response && response.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export const saveNotes = async (data) => {
  const params = { customer: data.customer };

  const result = await axiosInstance
    .post(API_NOTES, data, { params })
    .then((res) => {
      return res && res.data;
    })
    .catch((err) => {
      return err;
    });

  return result;
};

export const updateNotes = async (noteId, data) => {
  const params = { customer: data.customer };

  const result = await axiosInstance
    .patch(`${API_NOTES + noteId}/`, data, { params })
    .then((res) => {
      return res && res.data;
    })
    .catch((err) => {
      return err;
    });

  return result;
};

export async function deleteNote(NoteId) {
  const result = await axiosInstance
    .delete(`${API_NOTES + NoteId}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getRecentNotes(customer) {
  const params = { customer, recent: '-created_at', expand: 'user' };
  const result = await axiosInstance
    .get(API_NOTES, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
