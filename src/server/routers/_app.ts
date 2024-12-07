/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { testCaseRouter } from './testCase';
import { userRouter } from './userRouter';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  testCaseRouter: testCaseRouter,
  userRouter: userRouter
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
