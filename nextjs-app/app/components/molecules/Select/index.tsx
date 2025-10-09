"use client";

import React, { useCallback, useState } from "react";
import { Select as CustomSelect, SelectValue } from "./components/Select";

interface SelectProps {
  placeholder?: string;
  options: SelectValue[];
  value?: string;
  onChange?: (value: string) => void;
}
export const Select = ({
  placeholder,
  value,
  options,
  onChange,
}: SelectProps) => {
  const [selected, setSelected] = useState<SelectValue>({
    label: placeholder ?? "",
    value: value ?? "",
  });

  const handleSetSelected = useCallback((value: SelectValue) => {
    setSelected(value);
  }, []);

  return (
    <CustomSelect
      options={options}
      selected={selected}
      setSelected={handleSetSelected}
      onChange={onChange}
    />
  );
};
