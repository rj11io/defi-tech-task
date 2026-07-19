import { memo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography } from 'antd';

import LoggedDropdownButton from '../user/LoggedDropdownButton';
import AppContext from '../../../helpers/AppContext';

const { Header } = Layout;
const { Text } = Typography;

const HeaderComponent = () => {
  const { isMobile } = useContext(AppContext);

  return (
    <Header id="topbar" className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="brand" aria-label="Daybook home">
          <span className="brand-mark" aria-hidden="true">
            D
          </span>
          <span>
            <Text className="brand-name">Daybook</Text>
            <Text type="secondary" className="brand-subtitle">
              Personal ledger
            </Text>
          </span>
        </Link>
        <LoggedDropdownButton compact={isMobile} />
      </div>
    </Header>
  );
};

export default memo(HeaderComponent);
