import type { ChangeEvent } from "react";

interface InputTypes {
  label: string;
  placeholder: string;
  type: string;
  value: any;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const Input = ({
  label,
  placeholder,
  type,
  value,
  name,
  onChange,
  disabled,
}: InputTypes) => {
  return (
    <div className="mt-4">
      <label className="block mb-2 text-md font-semibold text-black">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
