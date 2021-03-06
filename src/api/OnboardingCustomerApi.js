import axiosInstance from '../axios';
import {
  API_ACCOUNT_SUMMARY,
  API_AMAZON_ACCOUNT_DETAILS,
  API_AMAZON_SELLER_ACCOUNT,
  API_AMAZON_VENDOR_ACCOUNT,
  API_BILLING_INFO,
  API_CUSTOMER_MEMBER,
  API_DSP_CONTACT,
  API_EDIT_EMAIL,
  API_ONBOARD_CUSTOMER,
  API_PAYMENT_TERMS,
  API_SAVE_PAYMENT_TERMS,
  API_STEPS_ASSIGNED,
  API_VERIFY_TOKEN,
  API_VERIFY_USER,
  API_VIDEO_LINKS,
  API_AMAZON_SELLER_CENTRAL_BULK_CREATE,
  API_AMAZON_VENDOR_CENTRAL_BULK_CREATE,
  API_AMAZON_SELLER_CENTRAL_BULK_UPDATE,
  API_AMAZON_VENDOR_CENTRAL_BULK_UPDATE,
} from '../constants';

export async function updateOnBoardCustomer(id, data) {
  const result = await axiosInstance
    .patch(`${API_ONBOARD_CUSTOMER + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function askSomeoneData(data) {
  const result = await axiosInstance
    .post(API_STEPS_ASSIGNED, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateAskSomeoneData(id, data) {
  const result = await axiosInstance
    .patch(`${API_STEPS_ASSIGNED + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getStepDetails(customer, step) {
  const params = { customer_onboarding: customer, step };
  const result = await axiosInstance
    .get(API_STEPS_ASSIGNED, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function verifyStepToken(key) {
  const params = { key };
  const result = await axiosInstance
    .get(API_VERIFY_TOKEN, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function accountSummary(id) {
  const result = await axiosInstance
    .get(API_ACCOUNT_SUMMARY.replace(':id', id))
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getVideoLink(id, step) {
  const params = { step };
  const result = await axiosInstance
    .get(API_VIDEO_LINKS.replace(':id', id), { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function editCustomerEmail(data) {
  const result = await axiosInstance
    .post(API_EDIT_EMAIL, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function verifyStepUser(email, customerOnboarding) {
  const result = await axiosInstance
    .post(API_VERIFY_USER, { email, customer_onboarding: customerOnboarding })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBillingDetails(customer) {
  const params = { customer };
  if (customer !== undefined) {
    const result = await axiosInstance
      .get(API_BILLING_INFO, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return '';
}
export async function getPaymentTermsDetails(customer) {
  const params = { customer };
  if (customer !== undefined) {
    const result = await axiosInstance
      .get(API_PAYMENT_TERMS, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return '';
}
export async function saveBillingInfo(data, id) {
  if (id) {
    const result = await axiosInstance
      .patch(`${API_BILLING_INFO + id}/`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  const result = await axiosInstance
    .post(API_BILLING_INFO, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
export async function savePaymentTerms(data, customer) {
  const params = { customer };
  if (customer !== undefined) {
    const result = await axiosInstance
      .post(`${API_SAVE_PAYMENT_TERMS}`, data, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return '';
}
export async function getAmazonAccountDetails(step, id) {
  const params = { step };
  const result = await axiosInstance
    .get(API_AMAZON_ACCOUNT_DETAILS.replace(':id', id), { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function saveAmazonSellerAccount(data, id, NoAmazonAccount) {
  const params = { no_amazon_account: NoAmazonAccount };

  if (id) {
    const result = await axiosInstance
      .patch(`${API_AMAZON_SELLER_ACCOUNT + id}/`, data, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  const result = await axiosInstance
    .post(API_AMAZON_SELLER_ACCOUNT, data, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function saveAmazonVendorAccount(data, id, NoAmazonAccount) {
  const params = { no_amazon_account: NoAmazonAccount };
  if (id) {
    const result = await axiosInstance
      .patch(`${API_AMAZON_VENDOR_ACCOUNT + id}/`, data, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  const result = await axiosInstance
    .post(API_AMAZON_VENDOR_ACCOUNT, data, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

//  Bulk create Seller primary & secondary marketplaces for Amazaon Account
export async function saveAmazonSellerMarketplaces(data, id, noAmazonAccount) {
  const params = { no_amazon_account: noAmazonAccount };

  if (id) {
    const result = await axiosInstance
      .patch(`${API_AMAZON_SELLER_CENTRAL_BULK_UPDATE}`, data, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  const result = await axiosInstance
    .post(API_AMAZON_SELLER_CENTRAL_BULK_CREATE, data, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

//  Bulk create Vendor primary & secondary marketplaces for Amazaon Account
export async function saveAmazonVendorMarketplaces(data, id, noAmazonAccount) {
  const params = { no_amazon_account: noAmazonAccount };

  if (id) {
    const result = await axiosInstance
      .patch(`${API_AMAZON_VENDOR_CENTRAL_BULK_UPDATE}`, data, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  const result = await axiosInstance
    .post(API_AMAZON_VENDOR_CENTRAL_BULK_CREATE, data, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAmazonSeller(marketplace) {
  const params = { marketplace };
  const result = await axiosInstance
    .get(API_AMAZON_SELLER_ACCOUNT, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAmazonVendor(marketplace) {
  const params = { marketplace };
  const result = await axiosInstance
    .get(API_AMAZON_VENDOR_ACCOUNT, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteAmazonAccount(type, id) {
  const result = await axiosInstance
    .delete(
      type === 'seller'
        ? `${API_AMAZON_SELLER_ACCOUNT + id}/`
        : `${API_AMAZON_VENDOR_ACCOUNT + id}/`,
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function saveDSPContact(data, id) {
  if (id) {
    const result = await axiosInstance
      .patch(`${API_DSP_CONTACT + id}/`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  const result = await axiosInstance
    .post(API_DSP_CONTACT, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDSPContact(customer) {
  const params = { customer };
  if (customer !== undefined) {
    const result = await axiosInstance
      .get(API_DSP_CONTACT, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return null;
}

export async function updateDSPContact(id, dspContact) {
  const result = await axiosInstance
    .patch(`${API_DSP_CONTACT + id}/`, dspContact)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBPRoles(customer, user) {
  const params = { customer, user };

  const result = await axiosInstance
    .get(API_CUSTOMER_MEMBER, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
