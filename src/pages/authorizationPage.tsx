import { setCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useState } from 'react';
import { trpc } from '~/utils/trpc';

interface IFormErrors {
  login_error?: string;
  password_error?: string;
  server_error?: string;
}

const IndexPage: NextPage = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState<IFormErrors>({});

  const signUpHook = trpc.userRouter.signUp.useMutation();
  const signInHook = trpc.userRouter.signIn.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const action = submitter.name;

    // Очистим ошибки перед отправкой
    setError({});

    // Простая валидация формы
    const newErrors: IFormErrors = {};

    if (!formData.login) newErrors.login_error = 'Email обязателен';
    if (!formData.password) newErrors.password_error = 'Пароль обязателен';

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);

      return;
    }

    try {
      if (action === 'login') {
        console.log('Регистрация');
        await signInHook.mutateAsync(
          { login: formData.login, password: formData.password },
          {
            onError(error) {
              newErrors.server_error = error.message;
              setError(newErrors);
            },
            onSuccess(data) {
              setCookie('token', data.token);
              window.location.reload();
            },
          },
        );
      } else if (action === 'register') {
        await signUpHook.mutateAsync(
          { login: formData.login, password: formData.password },
          {
            onError(error) {
              newErrors.server_error = error.message;
              setError(newErrors);
            },
            onSuccess(data) {
              setCookie('token', data.token);
              window.location.reload();
            },
          },
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {error.server_error && (
          <p className="text-red-500 text-sm mb-4">{error.server_error}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="login"
              className="block text-sm font-medium text-gray-700"
            >
              Логин
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {error.login_error && (
              <p className="text-red-500 text-xs mt-1">{error.login_error}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {error.password_error && (
              <p className="text-red-500 text-xs mt-1">
                {error.password_error}
              </p>
            )}
          </div>

          <button
            type="submit"
            name="login"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Войти
          </button>

          <button
            type="submit"
            name="register"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};

export default IndexPage;
