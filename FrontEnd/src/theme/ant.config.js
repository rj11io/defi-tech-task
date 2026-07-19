export const light = {
  token: {
    colorPrimary: '#2563eb',
    colorInfo: '#2563eb',
    colorSuccess: '#15803d',
    colorError: '#dc2626',
    colorBgLayout: '#f6f7f9',
    colorBgContainer: '#ffffff',
    colorText: '#18212f',
    colorTextSecondary: '#697386',
    colorBorder: '#e4e7ec',
    borderRadius: 10,
    borderRadiusLG: 14,
    controlHeight: 42,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  components: {
    Card: { paddingLG: 20 },
    Table: { headerBg: '#f9fafb', headerColor: '#697386' },
    Layout: { headerBg: '#ffffff', bodyBg: '#f6f7f9' }
  }
};

export const dark = {
  token: {
    colorBgBase: '#111318',
    colorBgLayout: '#111318',
    colorBgContainer: '#191c23',
    colorBorder: '#30343e',
    colorBorderSecondary: '#272b34',
    colorPrimary: '#6b9cff',
    colorInfo: '#6b9cff',
    colorSuccess: '#4ade80',
    colorError: '#fb7185',
    borderRadius: 10,
    borderRadiusLG: 14,
    controlHeight: 42,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  components: {
    Card: { paddingLG: 20 },
    Table: { headerBg: '#20242c' },
    Layout: { headerBg: '#191c23', bodyBg: '#111318' }
  }
};

export default {};
