export const light = {
  token: {
    colorPrimary: '#2f6fed',
    colorInfo: '#2f6fed',
    colorBgLayout: '#f4f7fb',
    colorBgContainer: '#ffffff',
    colorText: '#17243b',
    colorTextSecondary: '#66758a',
    colorBorderSecondary: '#e6ebf2',
    borderRadius: 12,
    fontFamily: 'Lato, sans-serif'
  },
  components: {
    Button: { controlHeight: 40, fontWeight: 700 },
    Card: { borderRadiusLG: 16, paddingLG: 24 },
    Input: { controlHeight: 40 },
    Select: { controlHeight: 40 },
    Table: { headerBg: '#f7f9fc', rowHoverBg: '#f7faff' }
  }
};

export const dark = {
  token: {
    colorBgBase: '#101722',
    colorBgLayout: '#151e2b',
    colorBgContainer: '#1b2737',
    colorBorder: '#304054',
    colorBorderSecondary: '#2a394d',
    colorPrimary: '#79a7ff',
    colorInfo: '#79a7ff',
    colorText: '#f1f5fb',
    colorTextSecondary: '#aebbd0',
    borderRadius: 12,
    fontFamily: 'Lato, sans-serif'
  },
  components: {
    Button: { controlHeight: 40, fontWeight: 700 },
    Card: { borderRadiusLG: 16, paddingLG: 24 },
    Input: { controlHeight: 40 },
    Select: { controlHeight: 40 },
    Table: { headerBg: '#223147', rowHoverBg: '#243851' }
  }
};

export default {};
