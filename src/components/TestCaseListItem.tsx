import { Button, Paper, TextField } from '@mui/material';
import Head from 'next/head';
import { Dispatch, SetStateAction, useState, type ReactNode } from 'react';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import { trpc } from '~/utils/trpc';
import { TestCase } from '@prisma/client';
import { TextFieldCustom } from './TextFieldCustom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { get2dimensional } from '~/utils/get2dimmensional';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';

interface IProps {
    item: TestCase,
    delete_function: (({ id }: {
        id: number;
    }) => Promise<void>) | undefined
}
const getColor = (value: number) => {
    // Используем HSL для создания разных оттенков
    const hue = (value * 137) % 360; // 137 - простое число для разнообразия цветов
    return `hsl(${hue}, 60%, 80%)`; // Устанавливаем цветовую насыщенность и светлость
};

export const TestCaseListItem = ({ item, delete_function: delete_function }: IProps) => {
    const transformed_input_array = get2dimensional(item.input_grid, item.m);
    const transformed_expected_array = get2dimensional(item.expected_value, item.m);
    const transformed_output_array = get2dimensional(item.output_grid, item.m);


    const handleDeleteTestCase = async () => {
        if (delete_function) await delete_function({id: item.id});
    };

    return (
        <Paper elevation={8} className='p-3 my-3'>
            {item.is_successful === true && <div className='text-green-500 text-2xl flex items-center justify-end'>Успешно <DoneIcon /></div>}
            {item.is_successful === false && <div className='text-red-500 text-2xl flex items-center justify-end'>Неуспешно <CloseIcon /></div>}
            <div className='grid grid-cols-9 gap-4 items-start'>
                <TextFieldCustom field_name='id' field_value={item.id} />
                <TextFieldCustom field_name='N' field_value={item.n} />
                <TextFieldCustom field_name='M' field_value={item.m} />
                <div className="overflow-x-auto col-span-2">
                    <div className='text-gray-700 font-semibold mb-2'>Входные данные</div>
                    <table className="min-w-full bg-white border border-gray-300">
                        <tbody>
                            {transformed_input_array.map((row, rowIndex) => (
                                <tr key={rowIndex} className="even:bg-gray-50">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="py-2 px-4 border-b border-gray-300 text-gray-700">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {
                    transformed_expected_array && transformed_expected_array.length > 0 &&
                    <div className='col-span-2'>
                        <div className='text-gray-700 font-semibold mb-2'>Ожидаемый результат</div>
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${transformed_expected_array[0].length}, minmax(0, 1fr))` }}>
                            {transformed_expected_array.map((row, rowIndex) =>
                                row.map((cell, cellIndex) => (
                                    <div
                                        key={`${rowIndex}-${cellIndex}`}
                                        className="p-4 border border-gray-300 text-center"
                                        style={{ backgroundColor: getColor(cell) }} // Динамический цвет фона
                                    >
                                        {cell}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                }
                {
                    transformed_output_array && transformed_output_array.length > 0 &&
                    <div className='col-span-2'>
                        <div className='text-gray-700 font-semibold mb-2'>Итоговый результат</div>
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${transformed_output_array[0].length}, minmax(0, 1fr))` }}>
                            {transformed_output_array.map((row, rowIndex) =>
                                row.map((cell, cellIndex) => (
                                    <div
                                        key={`${rowIndex}-${cellIndex}`}
                                        className="p-4 border border-gray-300 text-center"
                                        style={{ backgroundColor: getColor(cell) }} // Динамический цвет фона
                                    >
                                        {cell}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                }

            </div>
            {delete_function &&
                <div className='flex flex-row gap-2'>

                    <Link className="" href={`/test_case/${item.id}`}>
                        <Button variant="outlined" className='my-4'><ModeEditIcon /></Button>
                    </Link>
                    <Button variant="outlined" className='my-4' onClick={handleDeleteTestCase}><DeleteIcon /></Button>
                </div>}

        </Paper>
    );
};