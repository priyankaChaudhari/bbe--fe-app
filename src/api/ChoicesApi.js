import axiosInstance from '../axios';
import {
  API_BGS,
  API_CHOICES,
  API_SERVICE_TYPE,
  API_MARKETPLACES,
  API_ALL_MARKETPLACES,
  API_ADM,
  API_THRESHOLD_TYPE,
  API_YOY_PERCENTAGE,
} from '../constants/ApiConstants';

export async function getStatus() {
  const result = await axiosInstance
    .get(`${API_CHOICES}status`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getCountry() {
  const result = await axiosInstance
    .get(`${API_CHOICES}country`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getState(country) {
  const result = await axiosInstance
    .get(`${API_CHOICES}country/${country}/state`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getCategories() {
  const result = await axiosInstance
    .get(`${API_CHOICES}category`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getChannels() {
  const result = await axiosInstance
    .get(`${API_CHOICES}channel`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getSellerType() {
  const result = await axiosInstance
    .get(`${API_CHOICES}seller-type`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getRoles() {
  const result = await axiosInstance
    .get(`${API_CHOICES}role`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getContactRoles() {
  const result = await axiosInstance
    .get(`${API_CHOICES}contact-role`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getManagersList(type, hybridSelectedDashboard) {
  const api =
    type === 'Growth Strategist' || type === 'BGS' || type === 'BGS Manager'
      ? API_BGS
      : API_ADM;

  let params = {};
  if (type === 'Sponsored Advertising Ad Manager' || type === 'Ad Manager') {
    params = { dashboard: 'sponsored_ad_dashboard' };
  }
  if (type === 'DSP Ad Manager') {
    params = { dashboard: 'dsp_ad_performance' };
  }

  if (hybridSelectedDashboard && type === 'Hybrid Ad Manager') {
    params = { dashboard: hybridSelectedDashboard };
  }

  const result = await axiosInstance
    .get(`${api}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getGrowthStrategist() {
  const result = await axiosInstance
    .get(`${API_BGS}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getOneTimeService() {
  const result = await axiosInstance
    .get(`${API_CHOICES}onetime-services`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getMonthlyService() {
  const result = await axiosInstance
    .get(`${API_CHOICES}monthly-services`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getRevenueShare() {
  const result = await axiosInstance
    .get(`${API_CHOICES}rev-share`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getLength() {
  const result = await axiosInstance
    .get(`${API_CHOICES}contract-length`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getMarketplaces() {
  const result = await axiosInstance
    .get(`${API_CHOICES}marketplace-types`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAdditionalServices(type) {
  const params = { service_type: type };
  const result = await axiosInstance
    .get(API_SERVICE_TYPE, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getContractStatus() {
  const result = await axiosInstance
    .get(`${API_CHOICES}contract-status`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export const getMarketPlaceList = async (id) => {
  let response;
  if (id === undefined) {
    response = await axiosInstance.get(API_ALL_MARKETPLACES);
  } else {
    response = await axiosInstance.get(API_MARKETPLACES, {
      params: { customer_id: id },
    });
  }
  return response;
};

export async function getAdManagers() {
  const result = await axiosInstance
    .get(`${API_ADM}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getThresholdType() {
  const result = await axiosInstance
    .get(`${API_CHOICES + API_THRESHOLD_TYPE}`)
    .then((response) => {
      return response && response.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getYoyPercentage() {
  const result = await axiosInstance
    .get(`${API_CHOICES + API_YOY_PERCENTAGE}`)
    .then((response) => {
      return response && response.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
