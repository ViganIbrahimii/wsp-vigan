import { Table } from "@/types/interfaces/table.interface";
import { Dialog, DialogContent, DialogFullScreenContent, FullScreenDialog } from "../dialog";

interface TableDetailDialogProps {
  item?: Table
}

const TableDetailDialog: React.FC<TableDetailDialogProps> = ({item}) => {
  return (
    <FullScreenDialog isOpen={true}>
      <DialogFullScreenContent className="h-screen">
        <div className="bg-body-gradient">
          Dialog Contents
        </div>
      </DialogFullScreenContent>
    </FullScreenDialog>
  )
}

export default TableDetailDialog;