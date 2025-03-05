import * as React from "react"
import { CloseIcon } from "@/icons" // Make sure to import the CloseIcon

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper"

export interface IconInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  value: string
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void // Optional clear handler
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  (
    {
      className,
      placeholder,
      type = "text",
      value,
      icon,
      onChange,
      onClear,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex flex-row items-center justify-between w-full text-caption-bold border-2 border-black-10  rounded-6">
        {icon && 
          <div className="flex items-center justify-center bg-gray-100 h-[46px] min-w-[46px] rounded-full mr-2">
            <IconWrapper Component={icon} size={"20"} />
          </div>
        }
        <input
          type={type}
          className={cn(
            "peer block w-full appearance-none bg-white-60 px-2.5 pb-2.5 pt-6 focus:outline-none rounded-6",
            "h-[48px] px-4 text-black-100 placeholder-transparent focus:border-black-10",
            className
          )}
          placeholder=""
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        <label
          className={cn(
            "absolute left-[60px] top-2 text-black-60 transition-all",
            "peer-placeholder-shown:text-body-normal",
            "text-black-60 peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-caption-normal"
          )}
        >
          {placeholder}
        </label>
        {value && onClear && (
          <div
            className="absolute inset-y-0 right-4 flex cursor-pointer items-center"
            onClick={onClear}
          >
            <IconWrapper Component={CloseIcon} size={"20"} color={"black100"} />
          </div>
        )}
      </div>
    )
  }
)

IconInput.displayName = "IconInput"

export { IconInput }
