import { setCookie } from 'cookies-next';
import { router, userProcedure } from '../trpc';

export const userRouter = router({
  getClientByCookie: userProcedure.query(async ({ ctx }) => {
    const { user, token, req, res } = ctx;

    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay());
    await setCookie('token', token, { req, res, expires: nextMonth});

    return {
      user: user,
      token: token,
    };
  }),
});
