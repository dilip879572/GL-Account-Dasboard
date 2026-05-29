export const ACCOUNT_TYPES = ['Debit', 'Credit', 'Debit/Credit'];

export const SECTIONS = [
  'Accounts Group',
  'BS Inventories',
  'BS Current Assets',
  'BS Non-Current Assets',
  'BS Trade and Other Receivables',
  'BS Goods Transferred to Third-Party',
  'BS Other Current Assets',
  'BS Deferred Expenses',
  'BS Cash and Cash Equivalents',
  'BS Fixed Assets',
  'BS Intangible Assets',
  'PL Revenue',
  'PL Cost of Goods Sold',
  'PL Operating Expenses',
  'PL Other Income',
  'PL Other Expenses',
  'PL Finance Costs',
  'PL Tax Expense',
];

export const ACCOUNTS_GROUPS = [
  'Assets',
  'Liabilities',
  'Equity',
  'Revenue',
  'Expenses',
  'Cost of Goods Sold',
  'Other Income',
  'Other Expenses',
];

export const DIMENSIONS = [
  { id: 1, name: 'Item', trackAmount: false, trackQuantity: false },
  { id: 2, name: 'Warehouse', trackAmount: false, trackQuantity: false },
  { id: 3, name: 'Company', trackAmount: false, trackQuantity: false },
  { id: 4, name: 'Contract', trackAmount: false, trackQuantity: false },
  { id: 5, name: 'Department', trackAmount: false, trackQuantity: false },
  { id: 6, name: 'Project', trackAmount: false, trackQuantity: false },
  { id: 7, name: 'Deferred Ex.', trackAmount: false, trackQuantity: false },
];

export const initialAccounts = [
  {
    id: '1', code: '1000000', description: 'Non-Current Assets',
    type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Assets',
    parentId: null, offBalance: false, details: '', dimensions: [],
    children: [
      {
        id: '1-1', code: '1100000', description: 'Property, Plant & Equipment',
        type: 'Dr/Cr', section: 'BS Fixed Assets', accountsGroup: 'Assets',
        parentId: '1', offBalance: false, details: '', dimensions: [],
        children: [
          {
            id: '1-1-1', code: '1110000', description: 'Land',
            type: 'Dr', section: 'BS Fixed Assets', accountsGroup: 'Assets',
            parentId: '1-1', offBalance: false, details: '', dimensions: [],
            children: [],
          },
          {
            id: '1-1-2', code: '1120000', description: 'Buildings',
            type: 'Dr', section: 'BS Fixed Assets', accountsGroup: 'Assets',
            parentId: '1-1', offBalance: false, details: '', dimensions: [],
            children: [],
          },
        ],
      },
      {
        id: '1-2', code: '1200000', description: 'Intangible Assets',
        type: 'Dr/Cr', section: 'BS Intangible Assets', accountsGroup: 'Assets',
        parentId: '1', offBalance: false, details: '', dimensions: [],
        children: [],
      },
    ],
  },
  {
    id: '2', code: '2000000', description: 'Current Assets',
    type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Assets',
    parentId: null, offBalance: false, details: '', dimensions: [],
    children: [
      {
        id: '2-1', code: '2010000', description: 'Inventories',
        type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Assets',
        parentId: '2', offBalance: false, details: '', dimensions: [],
        children: [
          {
            id: '2-1-1', code: '2010100', description: 'Raw Materials and Production Supplies',
            type: 'Dr', section: 'BS Inventories', accountsGroup: 'Assets',
            parentId: '2-1', offBalance: false, details: '',
            dimensions: [
              { id: 1, name: 'Item', trackAmount: true, trackQuantity: true },
              { id: 2, name: 'Warehouse', trackAmount: false, trackQuantity: true },
            ],
            children: [],
          },
          {
            id: '2-1-2', code: '2010200', description: 'Goods',
            type: 'Dr', section: 'BS Inventories', accountsGroup: 'Assets',
            parentId: '2-1', offBalance: false, details: '',
            dimensions: [
              { id: 1, name: 'Item', trackAmount: true, trackQuantity: true },
              { id: 2, name: 'Warehouse', trackAmount: false, trackQuantity: true },
            ],
            children: [],
          },
          {
            id: '2-1-3', code: '2010300', description: 'Work in Progress',
            type: 'Dr', section: 'Accounts Group', accountsGroup: 'Assets',
            parentId: '2-1', offBalance: false, details: '', dimensions: [],
            children: [],
          },
          {
            id: '2-1-4', code: '2010400', description: 'Finished Goods',
            type: 'Dr', section: 'BS Inventories', accountsGroup: 'Assets',
            parentId: '2-1', offBalance: false, details: '',
            dimensions: [
              { id: 1, name: 'Item', trackAmount: true, trackQuantity: true },
              { id: 2, name: 'Warehouse', trackAmount: false, trackQuantity: true },
            ],
            children: [],
          },
        ],
      },
      {
        id: '2-2', code: '2020000', description: 'Current Financial Assets',
        type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Assets',
        parentId: '2', offBalance: false, details: '', dimensions: [],
        children: [],
      },
      {
        id: '2-3', code: '2030000', description: 'Trade and Other Current Receivables',
        type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Assets',
        parentId: '2', offBalance: false, details: '', dimensions: [],
        children: [],
      },
      {
        id: '2-4', code: '2050000', description: 'Cash and Cash Equivalents',
        type: 'Dr', section: 'Accounts Group', accountsGroup: 'Assets',
        parentId: '2', offBalance: false, details: '', dimensions: [],
        children: [],
      },
    ],
  },
  {
    id: '3', code: '3000000', description: 'Liabilities',
    type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Liabilities',
    parentId: null, offBalance: false, details: '', dimensions: [],
    children: [
      {
        id: '3-1', code: '3100000', description: 'Current Liabilities',
        type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Liabilities',
        parentId: '3', offBalance: false, details: '', dimensions: [],
        children: [],
      },
      {
        id: '3-2', code: '3200000', description: 'Non-Current Liabilities',
        type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Liabilities',
        parentId: '3', offBalance: false, details: '', dimensions: [],
        children: [],
      },
    ],
  },
  {
    id: '4', code: '4000000', description: 'Equity',
    type: 'Dr/Cr', section: 'Accounts Group', accountsGroup: 'Equity',
    parentId: null, offBalance: false, details: '', dimensions: [],
    children: [],
  },
  {
    id: '5', code: '5000000', description: 'Revenue',
    type: 'Cr', section: 'PL Revenue', accountsGroup: 'Revenue',
    parentId: null, offBalance: false, details: '', dimensions: [],
    children: [],
  },
  {
    id: '6', code: '6000000', description: 'Cost of Goods Sold',
    type: 'Dr', section: 'PL Cost of Goods Sold', accountsGroup: 'Cost of Goods Sold',
    parentId: null, offBalance: false, details: '', dimensions: [],
    children: [],
  },
  {
    id: '7', code: '7000000', description: 'Operating Expenses',
    type: 'Dr', section: 'PL Operating Expenses', accountsGroup: 'Expenses',
    parentId: null, offBalance: false, details: '', dimensions: [],
    children: [],
  },
];
