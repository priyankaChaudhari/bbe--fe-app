/* eslint-disable import/prefer-default-export */
export const userDetails = [
  {
    key: 'first_name',
    label: 'First name',
    placeholder: 'Enter First name',
    type: 'text',
    section: 1,
    pattern: {
      value: /^[0-9a-zA-Z_-]*$/i,
      message: 'Special characters are not allowed.',
    },
  },

  {
    key: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    type: 'text',
    section: 1,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: 'Invalid email address.',
    },
  },
  {
    key: 'last_name',
    label: 'Last name',
    placeholder: 'Enter Last name',
    type: 'text',
    section: 2,
    pattern: {
      value: /^[0-9a-zA-Z_-]*$/i,
      message: 'Special characters are not allowed.',
    },
  },
  {
    key: 'phone_number',
    label: 'Phone',
    placeholder: 'Enter Phone',
    type: 'text',
    section: 2,
  },
  {
    key: 'old_password',
    label: 'Current password',
    placeholder: 'Enter current password',
    type: 'password',
    section: 3,
  },
  {
    key: 'new_password',
    label: 'New password',
    placeholder: 'Enter new password',
    type: 'password',
    section: 4,
  },
];
