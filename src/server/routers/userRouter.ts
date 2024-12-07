import { publicProcedure, router, userProcedure } from '../trpc';
import { z } from 'zod';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';

export const userRouter = router({
  getUserByCookie: userProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    // const currentDate = new Date();
    // const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay());
    // await setCookie('token', token, { req, res, expires: nextMonth});

    return user;
  }),
  signIn: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const hashedPassword = hmacSHA512(input.password, 'some_salt').toString();
      let user = await prisma.user.findFirst({
        where: {
          login: input.login,
          password: hashedPassword,
        },
      });

      if (!user)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Пользователь с такими реквизитами не найден',
        });

      const current_date = new Date();
      if (current_date > user.time_token_expiration) {
        const new_token = uuidv4();
        const expire_date = new Date(
          current_date.getTime() + 31 * 24 * 60 * 60 * 1000,
        );

        user = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            token: new_token,
            time_token_expiration: expire_date,
          },
        });
      }

      return user;
    }),
  signUp: publicProcedure
    .input(
      z.object({
        login: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const existing_user = await prisma.user.findFirst({
        where: {
          login: input.login,
        },
      });
      if (existing_user)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Пользователь с таким логином уже существует',
        });

      const hashedPassword = hmacSHA512(input.password, 'some_salt').toString();
      const new_token = uuidv4();

      const currentDate = new Date();
      const nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDay(),
      );

      const new_user = await prisma.user.create({
        data: {
          login: input.login,
          password: hashedPassword,
          is_admin: false,
          time_token_expiration: nextMonth,
          token: new_token,
        },
      });

      return new_user;
    })
});
