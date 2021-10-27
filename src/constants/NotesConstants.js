const filtersOption = {
  notes: [
    { label: 'All Notes' },
    { label: 'My Notes', value: 'my_notes' },
    { label: 'Team Notes' },
  ],
  teams: [
    { team: 'Sales Team' },
    { team: 'On-boarding Team' },
    { team: 'BGS Team' },
    { team: 'Creative Team' },
    { team: 'Advertising Team' },
    { team: 'Finance Team' },
  ],
  archived: [
    { label: 'Hide archived', value: 'hide' },
    { label: 'Show archived', value: '' },
    { label: 'Only show archived', value: 'only_archived' },
  ],
};
export default filtersOption;
