import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button} from "@mui/material";
import { TestCaseUpsertField } from '~/components/upsertTestCase';
import { TestCaseListItem } from '~/components/TestCaseListItem';
import { TestCase } from '@prisma/client';
import { NextPageWithLayout } from '../_app';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';

const TestCaseViewPage: NextPageWithLayout = () => {
  let { id } = useRouter().query;
  let isEnable = true;
  let isFirstLoad = true;

  if (!id || typeof id != 'string') {
    isEnable = false;
    id = "-1";
  }

  const [current_test_case, set_current_test_case] = useState<TestCase>();

  const test_case_query = trpc.testCaseRouter.getById.useQuery({ id: Number(id) }, {
    enabled: isEnable,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (test_case_query.data && isFirstLoad) {
      isFirstLoad = false;
      set_current_test_case(test_case_query.data)
    }
  }, [test_case_query.data])


  const handleNewTestCase = async ({ obj }: { obj: TestCase }) => {
    console.log("obj", obj);
    set_current_test_case(obj);
  };

  return (
    <>
      <Link className="" href={`/`}>
        <Button variant="outlined" style={{ marginBottom: '20px' }}>Домой</Button>
      </Link>
      {
        current_test_case &&
        <div>
          <TestCaseUpsertField item={current_test_case} handle_update_function={handleNewTestCase} />
          <TestCaseListItem delete_function={undefined} item={current_test_case} />
        </div>
      }
    </>
  );
};

export default TestCaseViewPage;