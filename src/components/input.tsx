import * as React from "react"
import { CloseIcon } from "@/icons"

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  extraStyles?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      placeholder,
      extraStyles,
      type = "text",
      value,
      onChange,
      onClear,
      icon,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId()

    return (
      <div className={cn("relative w-full text-caption-bold", extraStyles)}>
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute flex items-center justify-center">
              <div className="rounded-full bg-black-5 p-3">
                <IconWrapper Component={icon} size="24" color="black100" />
              </div>
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "peer block w-full appearance-none border border-black-10 bg-white-60 px-2.5 pb-2.5 pt-6 focus:outline-none",
              "h-[48px] rounded-6 text-black-100 placeholder-transparent focus:border-black-10",
              icon ? "pl-14" : "px-4",
              className
            )}
            placeholder=""
            ref={ref}
            value={value}
            onChange={onChange}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 top-2 cursor-text text-black-60 transition-all",
              "peer-placeholder-shown:text-body-normal",
              "text-black-60 peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-caption-normal",
              icon && "left-14"
            )}
          >
            {placeholder}
          </label>
          {value && onClear && (
            <div
              className="absolute inset-y-0 right-4 flex cursor-pointer items-center"
              onClick={onClear}
            >
              <IconWrapper Component={CloseIcon} size="20" color="black100" />
            </div>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
