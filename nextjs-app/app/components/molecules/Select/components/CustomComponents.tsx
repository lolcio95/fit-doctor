import {
  components,
  ContainerProps,
  ControlProps,
  OptionProps,
  MenuProps,
  MenuListProps,
} from "react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import clsx from "clsx";

export const CustomContainer = ({ children, ...props }: ContainerProps) => {
  return (
    <components.SelectContainer {...props} className="w-full md:max-w-[200px]">
      {children}
    </components.SelectContainer>
  );
};

export const CustomControl = ({ children, ...props }: ControlProps) => {
  return (
    <components.Control {...props}>
      <div className="w-full flex items-center justify-between bg-background-card border rounded-md px-3 py-2 text-sm cursor-pointer">
        <div className="flex">{children}</div>
        <ChevronDownIcon size={16} />
      </div>
    </components.Control>
  );
};

export const CustomOption = (props: OptionProps) => {
  return (
    <components.Option {...props}>
      <div
        className={clsx(
          "flex items-center justify-between text-sm p-2 rounded-sm cursor-pointer",
          {
            "bg-muted text-background-secondary": props.isFocused,
          }
        )}
      >
        <span>{props.label}</span>
        {props.isSelected && <CheckIcon size={16} />}
      </div>
    </components.Option>
  );
};

export const CustomMenu = (props: MenuProps) => {
  return (
    <components.Menu {...props}>
      <div className="bg-background-card px-1 py-2 border rounded-md mt-1">
        {props.children}
      </div>
    </components.Menu>
  );
};

export const CustomMenuList = (props: MenuListProps) => {
  return (
    <components.MenuList
      {...props}
      className="max-h-60 overflow-auto scrollbar-hide bg-background-card rounded-md text-sm"
    >
      {props.children}
    </components.MenuList>
  );
};
