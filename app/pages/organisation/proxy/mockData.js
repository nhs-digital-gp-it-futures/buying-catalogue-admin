export const organisation = {
  organisationId: 'b7ee5261-43e7-4589-907b-5eef5e98c085',
  name: 'Cheshire and Merseyside Commissioning Hub',
  odsCode: '13Y',
  primaryRoleId: 'RO98',
  address: {
    line1: 'C/O NHS ENGLAND, 1W09, 1ST FLOOR',
    line2: 'QUARRY HOUSE',
    line3: 'QUARRY HILL',
    town: 'LEEDS',
    county: 'WEST YORKSHIRE',
    postcode: 'LS2 7UE',
    country: 'ENGLAND',
  },
  catalogueAgreementSigned: false,
};

export const unrelatedOrgs = [
  {
    organisationId: '43cc8258-6e92-4d39-9296-edc5bb000563',
    name: 'Cumbria and North East Commissioning Hub',
    odsCode: '13X',
  },
  {
    organisationId: '6d37d7fb-df06-403c-9c46-d649919f9158',
    name: 'East – H&J Commissioning Hub',
    odsCode: '14R',
  },
  {
    organisationId: 'bb21dd07-58df-457a-a9cb-6b035684692b',
    name: 'East Commissioning Hub',
    odsCode: '14E',
  },
  {
    organisationId: 'd795a598-26f0-46fb-8a6e-f22cd912d7dc',
    name: 'Greater Manchester Commissioning Hub',
    odsCode: '14J',
  },
  {
    organisationId: 'dff57334-4055-48cf-a569-da490ccdc66a',
    name: 'Hampshire, Isle of Wight and Thames Valley – H&J Commissioning Hub',
    odsCode: '14W',
  },
];

export const unrelatedOrgsRadio = [
  {
    value: '43cc8258-6e92-4d39-9296-edc5bb000563',
    text: 'Cumbria and North East Commissioning Hub',
  },
  {
    value: '6d37d7fb-df06-403c-9c46-d649919f9158',
    text: 'East – H&J Commissioning Hub',
  },
  {
    value: 'bb21dd07-58df-457a-a9cb-6b035684692b',
    text: 'East Commissioning Hub',
  },
  {
    value: 'd795a598-26f0-46fb-8a6e-f22cd912d7dc',
    text: 'Greater Manchester Commissioning Hub',
  },
  {
    value: 'dff57334-4055-48cf-a569-da490ccdc66a',
    text: 'Hampshire, Isle of Wight and Thames Valley – H&J Commissioning Hub',
  },
];

export const relatedOrgs = [
  {
    organisationId: '2459261a-d8f0-464a-bff7-45b2d7adb1ef',
    name: 'Yorkshire and Humber Commissioning Hub',
    odsCode: '13V',
  },
  {
    organisationId: '7a9b95b0-1d0b-4ba4-84f6-59d710938141',
    name: 'South East – H&J Commissioning Hub',
    odsCode: '97T',
  },
  {
    organisationId: '6672cfe8-1583-4d02-a0af-83d29bcb0513',
    name: 'South West South Commissioning Hub',
    odsCode: '15G',
  },
  {
    organisationId: 'bac2e2e0-143f-412a-9e78-8618f09cf779',
    name: 'West Midlands Commissioning Hub',
    odsCode: '14C',
  },
  {
    organisationId: 'a98f01d6-3f73-4b59-b213-e2bd3397c16f',
    name: 'Cumbria and North East – H&J Commissioning Hub',
    odsCode: '14P',
  },
];

export const relatedOrgsTable = [
  [
    {
      data: 'Yorkshire and Humber Commissioning Hub',
      dataTestId: 'related-org-name-2459261a-d8f0-464a-bff7-45b2d7adb1ef',
    },
    {
      data: '13V',
      dataTestId: 'related-org-odsCode-2459261a-d8f0-464a-bff7-45b2d7adb1ef',
    },
    {
      href: '/admin/organisations/removeproxy/orgId/2459261a-d8f0-464a-bff7-45b2d7adb1ef',
      data: 'Remove',
      dataTestId: 'related-org-remove-2459261a-d8f0-464a-bff7-45b2d7adb1ef',
    },
  ],
  [
    {
      data: 'South East – H&J Commissioning Hub',
      dataTestId: 'related-org-name-7a9b95b0-1d0b-4ba4-84f6-59d710938141',
    },
    {
      data: '97T',
      dataTestId: 'related-org-odsCode-7a9b95b0-1d0b-4ba4-84f6-59d710938141',
    },
    {
      href: '/admin/organisations/removeproxy/orgId/7a9b95b0-1d0b-4ba4-84f6-59d710938141',
      data: 'Remove',
      dataTestId: 'related-org-remove-7a9b95b0-1d0b-4ba4-84f6-59d710938141',
    },
  ],
  [
    {
      data: 'South West South Commissioning Hub',
      dataTestId: 'related-org-name-6672cfe8-1583-4d02-a0af-83d29bcb0513',
    },
    {
      data: '15G',
      dataTestId: 'related-org-odsCode-6672cfe8-1583-4d02-a0af-83d29bcb0513',
    },
    {
      href: '/admin/organisations/removeproxy/orgId/6672cfe8-1583-4d02-a0af-83d29bcb0513',
      data: 'Remove',
      dataTestId: 'related-org-remove-6672cfe8-1583-4d02-a0af-83d29bcb0513',
    },
  ],
  [
    {
      data: 'West Midlands Commissioning Hub',
      dataTestId: 'related-org-name-bac2e2e0-143f-412a-9e78-8618f09cf779',
    },
    {
      data: '14C',
      dataTestId: 'related-org-odsCode-bac2e2e0-143f-412a-9e78-8618f09cf779',
    },
    {
      href: '/admin/organisations/removeproxy/orgId/bac2e2e0-143f-412a-9e78-8618f09cf779',
      data: 'Remove',
      dataTestId: 'related-org-remove-bac2e2e0-143f-412a-9e78-8618f09cf779',
    },
  ],
  [
    {
      data: 'Cumbria and North East – H&J Commissioning Hub',
      dataTestId: 'related-org-name-a98f01d6-3f73-4b59-b213-e2bd3397c16f',
    },
    {
      data: '14P',
      dataTestId: 'related-org-odsCode-a98f01d6-3f73-4b59-b213-e2bd3397c16f',
    },
    {
      href: '/admin/organisations/removeproxy/orgId/a98f01d6-3f73-4b59-b213-e2bd3397c16f',
      data: 'Remove',
      dataTestId: 'related-org-remove-a98f01d6-3f73-4b59-b213-e2bd3397c16f',
    },
  ],
];

export const errors = {
  messagge: 'Select the organisation you are looking for',
  errorList: [{
    text: 'Select the organisation you are looking for',
    href: '#relatedOrganisationId',
  }],
};
