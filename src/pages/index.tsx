import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import type { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import type { AppRouter } from '~/server/routers/_app';
import { List, Paper } from "@mui/material";
import { TestCaseUpsertField } from '~/components/upsertTestCase';
import { TestCaseListItem } from '~/components/TestCaseListItem';
import { TestCase } from '@prisma/client';
import { Optional } from '@tanstack/react-query';



const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useUtils();

  const [test_cases_list, set_test_cases_list] = useState<TestCase[]>([]);

  const { data: test_case_list_query } = trpc.testCaseRouter.list.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (test_case_list_query) set_test_cases_list(test_case_list_query)
  }, [test_case_list_query])

  const deleteTestCaseHook = trpc.testCaseRouter.deleteTestCase.useMutation();
  const upsertTestCaseHook = trpc.testCaseRouter.upsertTestCase.useMutation();

  const handleDeleteTestCase = async ({ id }: { id: number }) => {
    await deleteTestCaseHook.mutateAsync({ id: id })
    set_test_cases_list([...(test_cases_list || []).filter(i => i.id !== id)]);
  };

  const handleNewTestCase = async ({ obj }: { obj: TestCase }) => {

    set_test_cases_list([obj, ...(test_cases_list || [])]);
  };



  return (
    <>
      <TestCaseUpsertField item={undefined} handle_update_function={handleNewTestCase} />
      {
        test_cases_list && test_cases_list.map((item, i) => {
          return (
            <TestCaseListItem delete_function={handleDeleteTestCase} key={item.id} item={item} />
          )
        })
      }
    </>
  );
};

export default IndexPage;