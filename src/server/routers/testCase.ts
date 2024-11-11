import { router, publicProcedure } from '../trpc';
import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { number, z } from 'zod';
import { prisma } from '~/server/prisma';
import { get2dimensional } from '~/utils/get2dimmensional';

const calculateFields = (input_array: number[], n: number, m: number) => { //Функция для решения задачи "Восстановление доминошек" 
  const transformed_input_array = get2dimensional(input_array, m);

  for (let i = 0; i < n; i++) {

    for (let j = 0; j < m; j++) {
      transformed_input_array[i][j] = transformed_input_array[i][j] === 0 ? -1 : 0;
    }
  }

  let fieldNum = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (transformed_input_array[i][j] !== 0) continue;

      fieldNum++;
      transformed_input_array[i][j] = fieldNum;

      if (j < m - 1 && transformed_input_array[i][j + 1] === -1) {
        transformed_input_array[i][j + 1] = fieldNum;
        continue;
      }

      if (i < n - 1 && transformed_input_array[i + 1][j] === -1) {
        transformed_input_array[i + 1][j] = fieldNum;
      }
    }
  }

  return transformed_input_array.flat();
}

export const testCaseRouter = router({
  list: publicProcedure //Получить список Тест-кейсов
    .query(async ({ ctx }) => {
      return await prisma.testCase.findMany({
        orderBy: {
          id: 'desc'
        }
      });
    }),
  getById: publicProcedure //Получить Тест-кейс по id
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ input, ctx }) => {
      return await prisma.testCase.findFirst({
        where: {
          id: input.id
        },
        orderBy: {
          id: 'desc'
        }
      });
    }),
  upsertTestCase: publicProcedure //Создать/обновить тест-кейс
    .input(z.object({
      id: z.number().nullish(),
      n: z.number(),
      m: z.number(),
      input_grid: z.number().array(),
      expected_grid: z.number().array(),
    }))
    .mutation(async ({ input, ctx }) => {
      const output_grid = calculateFields(input.input_grid, input.n, input.m);

      const new_test_case = prisma.testCase.upsert({
        where: {
          id: input.id || -1,
        },
        create: {
          n: input.n,
          m: input.m,
          input_grid: input.input_grid,
          output_grid: output_grid,
          expected_value: input.expected_grid,
          is_successful: input.expected_grid.length === output_grid.length && input.expected_grid.every((item, index) => item === output_grid[index])
        },
        update: {
          n: input.n,
          m: input.m,
          input_grid: input.input_grid,
          output_grid: output_grid,
          expected_value: input.expected_grid,
          is_successful: input.expected_grid.length === output_grid.length && input.expected_grid.every((item, index) => item === output_grid[index])
        }
      })

      return new_test_case;
    }),
  deleteTestCase: publicProcedure //Удалить тест-кейс по id
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input, ctx }) => {
      const deleted_test_case = prisma.testCase.delete({
        where: {
          id: input.id
        }
      })

      return deleted_test_case;
    })
})