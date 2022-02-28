import axiosInstance from '../axios';
import {
  API_REPORTS_SECTION,
  API_CUSTOMER,
  API_REPORTS_TYPES,
  API_REPORTS_DOWNLOAD,
} from '../constants';

export async function getBPUserList(query) {
  const params = { q: query };
  let result = {};
  result = await axiosInstance
    .get(API_CUSTOMER, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getReportTypes() {
  let result = {};
  result = await axiosInstance
    .get(API_REPORTS_TYPES)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getReportsSectionData(reportType, searchString, page) {
  let params = { page };

  if (searchString !== '') {
    params = {
      ...params,
      q: searchString,
    };
  }

  if (reportType !== 'reportType') {
    params = {
      ...params,
      report_type: reportType,
    };
  }

  let result = {};
  result = await axiosInstance
    .get(`${API_REPORTS_SECTION}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getReportDownload(
  selctedUser,
  timeFilter,
  startDate,
  endDate,
  reportID,
) {
  let result = {};

  let params = {
    customer: selctedUser,
    date_range: timeFilter,
    report: reportID,
  };

  if (timeFilter === 'custom') {
    params = {
      ...params,
      start_date: startDate,
      end_date: endDate,
    };
  }
  result = await axiosInstance
    .get(API_REPORTS_DOWNLOAD, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
