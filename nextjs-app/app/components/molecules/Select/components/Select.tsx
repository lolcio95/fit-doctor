"use client";
import {
  CustomContainer,
  CustomOption,
  CustomControl,
  CustomMenu,
  CustomMenuList,
} from "./CustomComponents";
import isEqual from "lodash/isEqual";
import { memo } from "react";
import dynamic from "next/dynamic";
import { StylesConfig } from "react-select";
import { ChevronDownIcon } from "lucide-react";

const ReactSelect = dynamic(() => import("react-select"), {
  loading: () => (
    <div className="w-full md:max-w-[200px]">
      <div className="w-full flex items-center justify-between bg-background border rounded-md px-3 py-2 text-sm cursor-pointer">
        <div className="flex">Category</div>
        <ChevronDownIcon size={16} />
      </div>
    </div>
  ),
});

export type SelectValue = {
  label: string;
  value: string;
};

interface SelectComponentProps {
  selected: SelectValue;
  setSelected: (newValue: { label: string; value: string }) => void;
  onChange?: (value: string) => void;
  options: SelectValue[];
}

const SelectComponent = ({
  options,
  selected,
  setSelected,
  onChange,
}: SelectComponentProps) => {
  const customStyles: StylesConfig = {
    container: (provided) => ({
      ...provided,
    }),
    dropdownIndicator: () => ({
      display: "none",
    }),
  };

  return (
    <ReactSelect
      styles={customStyles}
      value={selected}
      onChange={(newValue) => {
        const option = newValue as { label: string; value: string } | null;

        if (option) {
          setSelected(option);
          onChange?.(option.value);
        }
      }}
      unstyled
      options={options}
      components={{
        SelectContainer: CustomContainer,
        Option: CustomOption,
        Control: CustomControl,
        Menu: CustomMenu,
        MenuList: CustomMenuList,
      }}
    />
  );
};

export const Select = memo(SelectComponent, (prevProps, nextProps) => {
  return (
    isEqual(prevProps.selected, nextProps.selected) &&
    prevProps.setSelected === nextProps.setSelected &&
    prevProps.onChange === nextProps.onChange &&
    isEqual(prevProps.options, nextProps.options)
  );
});
