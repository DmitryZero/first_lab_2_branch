import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import { useEffect, useState } from 'react';
import { TestCaseUpsertField } from '~/components/upsertTestCase';
import { TestCaseListItem } from '~/components/TestCaseListItem';
import { TestCase } from '@prisma/client';



const IndexPage: NextPageWithLayout = () => {

  const [test_cases_list, set_test_cases_list] = useState<TestCase[]>([]);

  const { data: test_case_list_query } = trpc.testCaseRouter.list.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false
  });

  useEffect(() => {
    if (test_case_list_query) set_test_cases_list(test_case_list_query)
  }, [test_case_list_query])

  const deleteTestCaseHook = trpc.testCaseRouter.deleteTestCase.useMutation();

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
        test_cases_list.map((item) => {
          return (
            <TestCaseListItem delete_function={handleDeleteTestCase} key={item.id} item={item} />
          )
        })
      }
    </>
  );
};

export default IndexPage;