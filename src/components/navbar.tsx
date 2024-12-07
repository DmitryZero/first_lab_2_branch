import { deleteCookie } from 'cookies-next';
import * as React from 'react';
import UserContext from '~/Context/UserContext';

export default function Navbar() {
  const contextController = React.useContext(UserContext);

  const handleLogout = async () => {
    await deleteCookie('token');
    window.location.reload();
  };

  return (
    <nav className="bg-white text-gray-700 p-4 mb-5 rounded-md shadow-md">
      <div className="flex justify-end space-x-4">
        {contextController.user && (
          <div className="flex gap-3 items-center">
            <p>
              Привет,{' '}
              <span className="font-semibold">
                {contextController.user.login}
              </span>{' '}
              ({contextController.user.is_admin ? 'Админ' : 'Пользователь'})
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
