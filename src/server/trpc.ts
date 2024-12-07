/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v11/router
 * @see https://trpc.io/docs/v11/procedures
 */

import { initTRPC, TRPCError } from '@trpc/server';
import type { createTRPCContext } from './context';
import { getCookie } from 'cookies-next';
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';
import superjson from 'superjson';

// const t = initTRPC.context<Context>().create({
//   /**
//    * @see https://trpc.io/docs/v11/data-transformers
//    */
//   transformer,
//   /**
//    * @see https://trpc.io/docs/v11/error-formatting
//    */
//   errorFormatter({ shape }) {
//     return shape;
//   },
// });

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  }  
});

/**
 * Create a router
 * @see https://trpc.io/docs/v11/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v11/procedures
 **/
export const publicProcedure = t.procedure;

export const userProcedure = publicProcedure.use(async (opts) => {
  const { req, res, prisma } = opts.ctx;

  let token = await getCookie('token', { req: req, res: res });
  if (!token)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Cookie не указан' });

  const user = await prisma.user.findFirst({
    where: {
      token: token,
    },
  });

  if (!user)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `Cookie некорректный ${token.toString()}`,
    });

  if (!user.time_token_expiration)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Время жизни токена не заполнено',
    });

  const current_date = new Date();
  console.log('current_date', current_date);
  console.log('user.time_token_expiration', user.time_token_expiration);
  if (current_date > user.time_token_expiration) {
    const new_token = uuidv4();
    const expire_date = new Date(
      current_date.getTime() + 31 * 24 * 60 * 60 * 1000,
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: new_token,
        time_token_expiration: expire_date,
      },
    });

    token = new_token;
  }

  return opts.next({
    ctx: {
      token: token,
      req,
      res,
      prisma,
      user,
    },
  });
});

export const adminProcedure = userProcedure.use(async (opts) => {
  const { req, res, user, prisma } = opts.ctx;

  if (!user.is_admin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Пользователь не является администратором',
    });
  }
  return opts.next({
    ctx: {
      req,
      res,
      prisma,
      user,
    },
  });
});

/**
 * Merge multiple routers together
 * @see https://trpc.io/docs/v11/merging-routers
 */
export const mergeRouters = t.mergeRouters;

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/v11/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;
