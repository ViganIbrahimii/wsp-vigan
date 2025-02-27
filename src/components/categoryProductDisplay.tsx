"use client"

import * as React from "react"
import { useState } from "react"

import { Tab } from "@/components/tab" // Adjust the import path as needed

interface Category {
  id: number
  name: string
  products: string[]
}

interface CategoryProductDisplayProps {
  categories: Category[]
}

const CategoryProductDisplay: React.FC<CategoryProductDisplayProps> = ({
  categories,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories[0]?.id || null
  )

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative">
        {/* Categories background */}
        <div className="absolute inset-x-0 top-0 h-12 rounded-t-3xl bg-gray-200"></div>

        {/* Categories */}
        <div className="relative flex space-x-2 px-4 pt-2">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                ${
                  selectedCategoryId === category.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                } 
                cursor-pointer rounded-t-xl px-4 py-2 transition-colors
                ${
                  selectedCategoryId === category.id
                    ? "after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-2 after:rounded-b-xl after:bg-black after:content-['']"
                    : ""
                }
              `}
            >
              {category.name}
            </div>
          ))}
        </div>

        {/* Products background */}
        <div className="mt-[-8px] rounded-3xl bg-gray-200 p-4">
          {selectedCategoryId !== null && (
            <div className="overflow-x-auto">
              <div className="flex space-x-2 px-4 py-2">
                {categories
                  .find((category) => category.id === selectedCategoryId)
                  ?.products.map((product, index) => (
                    <div key={index} className="flex-shrink-0">
                      <Tab variant="primary" className="whitespace-nowrap">
                        {product}
                      </Tab>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryProductDisplay
