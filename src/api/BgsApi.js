import axiosInstance from '../axios';
import { API_CUSTOMER } from '../constants/ApiConstants';

export default async function getBGSCustomerList(
  pageNumber,
  id,
  value,
  role,
  hybridSelectedDashboard,
  startDate,
  endDate,
) {
  const params = {
    page: pageNumber,
    user: id,
    daily_facts: value.type,
  };
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }

  if (role === 'Sponsored Advertising Ad Manager' || role === 'Ad Manager') {
    params.dashboard = 'sponsored_ad_dashboard';
  }

  if (
    role === 'Growth Strategist' ||
    role === 'BGS' ||
    role === 'BGS Manager'
  ) {
    params.dashboard = 'sale_performance';
  }
  if (role === 'DSP Ad Manager') {
    params.dashboard = 'dsp_ad_performance';
  }

  if (hybridSelectedDashboard && role === 'Hybrid Ad Manager') {
    params.dashboard = hybridSelectedDashboard;
  }

  const result = await axiosInstance
    .get(API_CUSTOMER, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
