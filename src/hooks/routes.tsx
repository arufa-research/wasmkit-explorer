import { useRoutes } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTv, faBuildingLock } from '@fortawesome/free-solid-svg-icons';

import LogsPage from '../pages/Logs';
import BlocksPage from '../pages/Blocks';
import AccountsPage from '../pages/Accounts';
import ContractsPage from '../pages/Contracts';
import TransactionsPage from '../pages/Transactions';
// import { ReactComponent as AccountsIcon } from '../../assets/icons/menu/accounts.svg';
// import { ReactComponent as BlocksIcon } from '../assets/icons/blocks.svg';
// import { ReactComponent as TransactionsIcon } from '../../assets/icons/menu/transactions.svg';
// import { ReactComponent as ContractsIcon } from '../../assets/icons/menu/contracts.svg';
// import { ReactComponent as LogsIcon } from '../../assets/icons/menu/logs.svg';
// import { ReactComponent as SettingsIcon } from '../../assets/icons/menu/settings.svg';


const useAppRoutes = ({
  handleToggleClose,
  handleToggleOpen,
}: {
  handleToggleClose: Function;
  handleToggleOpen: Function;
}) => {
  const menu = [
    {
      name: 'Contracts',
      icon: <FontAwesomeIcon icon={faUser} />,
      path: '/',
      element: <ContractsPage />,
    },
    {
      name: 'Accounts',
      icon: <FontAwesomeIcon icon={faUser} />,
      path: '/accounts',
      element: (
        <AccountsPage
          handleToggleClose={handleToggleClose}
          handleToggleOpen={handleToggleOpen}
        />
      ),
    },
    {
      name: 'Blocks',
      icon: <FontAwesomeIcon icon={faBuildingLock} />,
      path: '/blocks',
      element: <BlocksPage />,
    },
    {
      name: 'Transactions',
      icon: <FontAwesomeIcon icon={faBuildingLock} />,
      path: '/transactions',
      element: <TransactionsPage />,
    },
    {
      name: 'Logs',
      icon: <FontAwesomeIcon icon={faTv} />,
      path: '/logs',
      element: <LogsPage />,
    },
    // {
    //   name: 'Settings',
    //   icon: <SettingsIcon className="w-6 h-6" />,
    //   path: '/settings',
    // },
  ];

  const routes = [
    // {
    //   name: 'Onboard',
    //   path: '/onboard',
    //   element: <OnboardPage />,
    // },
    // Add routes that cannot be accessed directly from the menu entry
    ...menu,
  ];

  return {
    menu,
    routes: useRoutes(routes),
  };
};

export default useAppRoutes;
