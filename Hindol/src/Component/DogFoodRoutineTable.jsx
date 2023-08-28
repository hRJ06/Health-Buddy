import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { allFoodRoutines } from '../data/dogFood';

const DogFoodRoutineTable = ({ dogIndex }) => {
  const dogData = allFoodRoutines[dogIndex];
  return (
    <Table className="table w-full border-collapse border border-gray-300">
      <Thead className="bg-gray-200">
        <Tr>
          <Th className="px-4 py-2">Day</Th>
          <Th className="px-4 py-2">Breakfast</Th>
          <Th className="px-4 py-2">Lunch</Th>
          <Th className="px-4 py-2">Dinner</Th>
        </Tr>
      </Thead>
      <Tbody>
        {dogData.map((dog, index) => (
          <Tr key={index} className="bg-white hover:bg-blue-100">
            <Td className="border px-4 py-2">{dog.day}</Td>
            <Td className="border px-4 py-2">{dog.breakfast}</Td>
            <Td className="border px-4 py-2">{dog.lunch}</Td>
            <Td className="border px-4 py-2">{dog.dinner}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default DogFoodRoutineTable;
