/* eslint-disable no-nested-ternary */
import { useContext, useState } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faAngleDown, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import AppContext from '../../../helpers/AppContext';
import UserInfo from './UserInfo';

import '../../../styles/core/components/LoggedDropdownButton.css';

import AuthContext from '../../../helpers/core/AuthContext';

const UserDropdownButton = ({ compact = false }) => {
  const { logged, signOut } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(AppContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line consistent-return
  const onClick = ({ key }) => {
    // eslint-disable-next-line default-case
    switch (key) {
      case 'darkmode':
        return setDarkMode(!darkMode);
      case 'logout':
        return signOut(() => navigate('/', { intended: '/' }));
    }
  };

  const items = [
    {
      icon: <FontAwesomeIcon icon={faMoon} />,
      label: `Dark mode · ${darkMode ? 'On' : 'Off'}`,
      key: 'darkmode',
      role: 'menuitemcheckbox',
      'aria-checked': darkMode
    },
    { type: 'divider' },
    {
      icon: <FontAwesomeIcon icon={faPowerOff} />,
      label: 'Sign out',
      key: 'logout'
    }
  ];

  return (
    <Dropdown menu={{ items, onClick }} onOpenChange={flag => setOpen(flag)} open={open} trigger={['click']}>
      <Button type="text" size="large" className="logged-dropdown-button" aria-label="Open account menu">
        <Space size={8}>
          <UserInfo user={logged} noText={compact} link={false} />
          <FontAwesomeIcon icon={faAngleDown} />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default UserDropdownButton;
