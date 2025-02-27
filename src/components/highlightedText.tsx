// components/HighlightedText.tsx
import React from "react"
// @ts-ignore
import Highlighter from "react-highlight-words"

import { cn } from "../lib/utils"

interface HighlightedTextProps {
  text: string
  searchTerm: string
  className?: string
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerm,
  className,
}) => {
  return (
    <Highlighter
      highlightClassName={cn("bg-semantic-red-20", className)}
      searchWords={[searchTerm]}
      autoEscape={true}
      textToHighlight={text}
    />
  )
}

export default HighlightedText
