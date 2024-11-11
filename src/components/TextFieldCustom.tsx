import { Paper } from "@mui/material";

export const TextFieldCustom = ({ field_name, field_value}: { field_name: string, field_value: string | number }) => {
    return (
        <div className="flex flex-col my-2">
            <label className="text-gray-700 font-semibold mb-2" htmlFor={`field_id_${field_name}`}>{field_name}</label>
            <input
                type="text"
                id={`field_id_${field_name}`}
                value={field_value}
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};