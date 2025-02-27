import { LiveCounterTableSortingOption } from "@/constants/liveCounterSortingOptions"
import { Table } from "@/types/interfaces/table.interface"

export const sortTableData = (
  tableData: Table[] | undefined,
  sortOption: LiveCounterTableSortingOption
): Table[] => {
  if (!tableData) return []
  
  const sortedData = [...tableData]
  
  switch (sortOption) {
    case LiveCounterTableSortingOption.TABLE_NAME_ASCENDING_STATUS:
      return sortedData.sort((a, b) => {
        // Extract numbers from table names
        const aMatches = a.name.match(/\d+/)
        const bMatches = b.name.match(/\d+/)
        
        // If both names contain numbers, sort numerically
        if (aMatches && bMatches) {
          const aNum = parseInt(aMatches[0])
          const bNum = parseInt(bMatches[0])
          return aNum - bNum
        }
        
        // If only one name contains a number, place it first
        if (aMatches) return -1
        if (bMatches) return 1
        
        // If no numbers, sort alphabetically
        return a.name.localeCompare(b.name)
      })

    case LiveCounterTableSortingOption.TABLE_NAME_DESCENDING_STATUS:
      return sortedData.sort((a, b) => {
        const aMatches = a.name.match(/\d+/)
        const bMatches = b.name.match(/\d+/)
        
        // If one has a number and the other doesn't
        if (aMatches && !bMatches) return -1  // a has number, comes first
        if (!aMatches && bMatches) return 1   // b has number, comes first
        
        // If both have numbers, sort numerically in descending order
        if (aMatches && bMatches) {
          const aNum = parseInt(aMatches[0])
          const bNum = parseInt(bMatches[0])
          return bNum - aNum
        }
        
        // If neither has numbers, sort alphabetically in descending order
        return b.name.localeCompare(a.name)
      })
      
    // case LiveCounterTableSortingOption.OCCUPIED_FIRST:
    //   return sortedData.sort((a, b) => {
    //     const aOccupied = a.orders && a.orders.length > 0 ? 1 : 0
    //     const bOccupied = b.orders && b.orders.length > 0 ? 1 : 0
    //     if (aOccupied === bOccupied) {
    //       // If occupation status is the same, sort by table name
    //       const aNum = parseInt(a.name.replace(/\D/g, ''))
    //       const bNum = parseInt(b.name.replace(/\D/g, ''))
    //       return aNum - bNum
    //     }
    //     return bOccupied - aOccupied // Occupied tables first
    //   })
      
    // case LiveCounterTableSortingOption.EMPTY_FIRST:
    //   return sortedData.sort((a, b) => {
    //     const aEmpty = a.orders && a.orders.length > 0 ? 0 : 1
    //     const bEmpty = b.orders && b.orders.length > 0 ? 0 : 1
    //     if (aEmpty === bEmpty) {
    //       // If empty status is the same, sort by table name
    //       const aNum = parseInt(a.name.replace(/\D/g, ''))
    //       const bNum = parseInt(b.name.replace(/\D/g, ''))
    //       return aNum - bNum
    //     }
    //     return bEmpty - aEmpty // Empty tables first
    //   })
    
    case LiveCounterTableSortingOption.OCCUPIED_FIRST:
      return sortedData.sort((a, b) => {
        const aOccupied = a.order && (a.order.status === "ready" || a.order.status === "ordered" || a.order.status === "served" || a.order.status === "advanced") ? 1 : 0
        const bOccupied = b.order && (b.order.status === "ready" || b.order.status === "ordered" || b.order.status === "served" || b.order.status === "advanced") ? 1 : 0
        if (aOccupied === bOccupied) {
          // If occupation status is the same, sort by table name
          const aNum = parseInt(a.name.replace(/\D/g, ''))
          const bNum = parseInt(b.name.replace(/\D/g, ''))
          return aNum - bNum
        }
        return bOccupied - aOccupied // Occupied tables first
      })
    case LiveCounterTableSortingOption.EMPTY_FIRST:
      return sortedData.sort((a, b) => {
        const aEmpty = a.order && (a.order.status === "ready" || a.order.status === "ordered" || a.order.status === "served" || a.order.status === "advanced") ? 0 : 1
        const bEmpty = b.order && (b.order.status === "ready" || b.order.status === "ordered" || b.order.status === "served" || b.order.status === "advanced") ? 0 : 1
        if (aEmpty === bEmpty) {
          // If empty status is the same, sort by table name
          const aNum = parseInt(a.name.replace(/\D/g, ''))
          const bNum = parseInt(b.name.replace(/\D/g, ''))
          return aNum - bNum
        }
        return bEmpty - aEmpty // Empty tables first
      })
    default:
      return sortedData
  }
}