import { Paper, Grid2, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import Head from 'next/head';
import { Dispatch, SetStateAction, useState, type ReactNode } from 'react';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import { trpc } from '~/utils/trpc';
import { TestCase } from '@prisma/client';
import { get2dimensional } from '~/utils/get2dimmensional';
import { Optional } from '@tanstack/react-query';


type IProps = {
  item: TestCase | undefined,
  handle_update_function: (({ obj }: {
    obj: TestCase;
  }) => Promise<void>) | undefined
}

export const TestCaseUpsertField = ({ item, handle_update_function }: IProps) => {
  const [n, setN] = useState<number>(item?.n || 2); // Начальное количество строк
  const [m, setM] = useState<number>(item?.m || 4); // Начальное количество столбцов
  const [input_data, setInputData] = useState<number[][]>(item?.input_grid ? get2dimensional(item?.input_grid, item?.m!) :
    Array.from({ length: n }, () => Array(m).fill(0))
  );
  const [expected_data, setExpectedData] = useState<number[][]>(item?.expected_value ? get2dimensional(item?.expected_value, item?.m!) :
    Array.from({ length: n }, () => Array(m).fill(0))
  );
  const upsertTestCaseHook = trpc.testCaseRouter.upsertTestCase.useMutation();

  const handleInputDataChange = (rowIndex: number, colIndex: number, value: string) => {
    if (value === '1' || value === '0') {
      const newData = [...input_data];
      newData[rowIndex][colIndex] = Number(value);
      setInputData(newData);
    }
  };

  const handleInputExpectedChange = (rowIndex: number, colIndex: number, value: string) => {
    const number_value = Number(value);

    if (number_value >= 1 && number_value <= 10) {
      const newData = [...expected_data];
      newData[rowIndex][colIndex] = Number(value);
      setExpectedData(newData);
    }
  };

  const handleSizeChange = (newN: number, newM: number) => {
    newN = Math.max(1, newN);
    newN = Math.min(newN, 10);

    newM = Math.max(1, newM);
    newM = Math.min(newM, 10);

    setN(newN);
    setM(newM);

    // Изменяем размер таблицы на основе новых значений n и m
    const newData_input_data = Array.from({ length: newN }, (_, rowIndex) =>
      Array.from({ length: newM }, (_, colIndex) =>
        input_data[rowIndex]?.[colIndex] !== undefined ? input_data[rowIndex][colIndex] : 0
      )
    );
    setInputData(newData_input_data);

    const newData_expected_data = Array.from({ length: newN }, (_, rowIndex) =>
      Array.from({ length: newM }, (_, colIndex) =>
        expected_data[rowIndex]?.[colIndex] !== undefined ? expected_data[rowIndex][colIndex] : 0
      )
    );
    setExpectedData(newData_expected_data);
  };

  const upsertTestCase = async () => {
    if (handle_update_function) {
      const new_test_case = await upsertTestCaseHook.mutateAsync({
        id: item?.id,
        n: n,
        m: m,
        input_grid: input_data.flat(),
        expected_grid: expected_data.flat()
      })

      handle_update_function({obj: new_test_case});
    }
  }

  return (
    <div>
      <Paper elevation={8} className='p-3'>
        <TextField
          label="Строки (n)"
          type="number"
          value={n}
          onChange={(e) => handleSizeChange(Number(e.target.value), m)}
          variant="outlined"
          size="small"
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Колонки (m)"
          type="number"
          value={m}
          onChange={(e) => handleSizeChange(n, Number(e.target.value))}
          variant="outlined"
          size="small"
        />
        <div className='text-2xl my-2'>Входные данные</div>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {Array.from({ length: m }).map((_, colIndex) => (
                  <TableCell key={colIndex}>Колонка {colIndex + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: n }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: m }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <TextField
                        type="number"
                        value={input_data[rowIndex]?.[colIndex] ?? 0}
                        onChange={(e) => handleInputDataChange(rowIndex, colIndex, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className='text-2xl my-2'>Ожидаемые данные</div>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {Array.from({ length: m }).map((_, colIndex) => (
                  <TableCell key={colIndex}>Колонка {colIndex + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: n }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: m }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <TextField
                        type="number"
                        value={expected_data[rowIndex]?.[colIndex] ?? 0}
                        onChange={(e) => handleInputExpectedChange(rowIndex, colIndex, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" style={{ marginTop: '20px' }} onClick={upsertTestCase}>Сохранить</Button>
      </Paper>
    </div>
  );
};