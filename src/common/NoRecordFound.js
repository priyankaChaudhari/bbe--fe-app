import React from 'react';
import { TelescopeIcon } from '../theme/images';

export default function NoRecordFound() {
  return (
    <div className="text-center no-record-found">
      <img src={TelescopeIcon} alt="No record found" />
      <p>We looked high and low, but…</p>
      <strong>No records found.</strong>
    </div>
  );
}
