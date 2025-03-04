import * as React from "react"

import { cn } from "@/lib/utils"
import {
  fontBodyBold,
  fontCaptionBold,
  fontCaptionNormal,
  fontHeadline,
} from "@/styles/typography"

interface CodeInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  labelBold?: string
  labelNormal?: string
  extraStyles?: string
  onComplete?: (value: string) => void
  disabled?: boolean
  isInvalid?: boolean
}

const CodeInput = React.forwardRef<HTMLDivElement, CodeInputProps>(
  (
    {
      length = 6,
      value = "",
      onChange,
      labelBold,
      labelNormal = "Enter 6 digit pin",
      extraStyles,
      onComplete,
      disabled = false,
      isInvalid = false,
      ...props
    },
    ref
  ) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
    // Track the current position (the rightmost filled input or the first empty one)
    const getCurrentPosition = () => {
      const valueLength = value.length
      return valueLength < length ? valueLength : length - 1
    }

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const newValue = e.target.value
      // Only accept numerical values
      if (!/^\d*$/.test(newValue)) return

      // Take the last character if more than one digit is entered
      const digit = newValue.slice(-1)

      // Update the value
      const newCodeValue =
        value.slice(0, index) + digit + value.slice(index + 1)

      onChange(newCodeValue)

      // Focus the next input if a digit was entered - with a small delay to ensure DOM updates
      if (digit && index < length - 1) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus()
        }, 10)
      }

      // Call onComplete if all digits have been entered
      if (newCodeValue.length === length && onComplete) {
        onComplete(newCodeValue)
      }
    }

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      // Handle backspace
      if (e.key === "Backspace") {
        if (value[index]) {
          // Clear the current input first
          const newCodeValue =
            value.slice(0, index) + "" + value.slice(index + 1)
          onChange(newCodeValue)
        } else if (index > 0) {
          // If current input is empty, delete the previous value and move back
          const newCodeValue =
            value.slice(0, index - 1) + "" + value.slice(index)
          onChange(newCodeValue)

          // Move to the previous input if current is empty - with a small delay
          setTimeout(() => {
            inputRefs.current[index - 1]?.focus()
          }, 10)
        }
        return
      }

      // Only allow right arrow navigation
      if (
        e.key === "ArrowRight" &&
        index < length - 1 &&
        index < value.length
      ) {
        inputRefs.current[index + 1]?.focus()
        return
      }

      // Prevent left arrow navigation except when current field is empty
      if (e.key === "ArrowLeft" && index > 0 && !value[index]) {
        inputRefs.current[index - 1]?.focus()
        return
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData("text/plain").trim()

      // Only process if pasted content is numeric and doesn't exceed the code length
      if (!/^\d*$/.test(pastedData)) return

      const pastedCode = pastedData.slice(0, length)
      onChange(pastedCode.padEnd(value.length, value.slice(pastedCode.length)))

      // Focus the appropriate input after paste
      if (pastedCode.length === length) {
        inputRefs.current[length - 1]?.focus()
      } else {
        inputRefs.current[pastedCode.length]?.focus()
      }

      // Call onComplete if all digits have been entered
      if (pastedCode.length === length && onComplete) {
        onComplete(pastedCode)
      }
    }

    // Update to ensure input refs are properly set up when the component mounts
    React.useEffect(() => {
      // Pre-populate input refs array
      inputRefs.current = inputRefs.current.slice(0, length)

      // Focus the first empty input or the last input if all filled
      const currentPosition = getCurrentPosition()
      setTimeout(() => {
        inputRefs.current[currentPosition]?.focus()
      }, 100)
    }, [length])

    // Prevent focusing on inputs that come before the current position
    const handleFocus = (index: number) => {
      const currentPosition = getCurrentPosition()

      // If trying to focus on an input before the current position,
      // redirect focus to the current position
      if (index < currentPosition) {
        inputRefs.current[currentPosition]?.focus()
        return
      }

      // If trying to focus on an input after the current position,
      // redirect focus to the current position
      if (index > currentPosition) {
        inputRefs.current[currentPosition]?.focus()
        return
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col items-center justify-center",
          extraStyles
        )}
        {...props}
      >
        {(labelBold || labelNormal) && (
          <div className="mb-2 text-center">
            <p className="text-black-60">
              {labelBold && (
                <span className={fontCaptionBold}>{labelBold}</span>
              )}
              {labelNormal && (
                <span className={fontCaptionNormal}>{labelNormal}</span>
              )}
            </p>
          </div>
        )}

        <div className="flex gap-1">
          {Array.from({ length }).map((_, index) => (
            <div key={index} className="relative">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={value[index] || ""}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => handleFocus(index)}
                onPaste={handlePaste}
                disabled={disabled}
                className={cn(
                  fontHeadline,
                  "h-12 w-12 rounded-full border text-center",
                  "focus:outline-none",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  isInvalid
                    ? "bg-white-60 text-red-500"
                    : value[index]
                      ? "focus:border-black-60 border-black-100 bg-black-100 text-white-100"
                      : "focus:border-black-60 border-black-10 bg-white-60 text-black-100 focus:bg-white"
                )}
                aria-label={`Code digit ${index + 1}`}
                aria-invalid={isInvalid}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
)

CodeInput.displayName = "CodeInput"

export { CodeInput }
