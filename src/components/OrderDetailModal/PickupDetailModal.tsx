import { CloseIcon } from "@/icons";
import { DialogDescription, DialogFullScreenContent, DialogHeader, DialogTitle, FullScreenDialog } from "../dialog";
import { IconButton } from "../iconButton";
import { OrderInfoCard } from "./components/OrderInfoCard";
import { OrderItemDetailPanel } from "./components/OrderItemDetailPanel";
import { useGetOrder } from "@/lib/hooks/queries/orders/useGetOrder";
import { GetOrderParams } from "@/api/orders";
import { OrderPayInfoPanel } from "./components/OrderPayInfoPanel";
import { OrderListItem } from "@/types/interfaces/order.interface";
import EditOrderDialog from "./EditOrderModal";
import CancelOrderDialog from "./components/cancelOrderDialog";

interface PickupDetailDialogProps {
  item?: OrderListItem
  isAggregator?: boolean
  onClose: () => void
  onUpdate?: ()=>void
}

const PickupDetailDialog: React.FC<PickupDetailDialogProps> = ({item, onClose, onUpdate, isAggregator}) => {
  const {
    data: orderDetailQueryData,
    error: orderDetailQueryError,
    isLoading: orderDetailLoading,
    isRefetching: orderDetailRefetching,
    refetch: refetchOrderDetail,
  } = useGetOrder({
    order_id: item?.order_id
  } as GetOrderParams)

  return (
    <FullScreenDialog isOpen={Boolean(item)} onOpenChange={open => !open && onClose()}>
      <DialogFullScreenContent className="h-screen">
        <DialogHeader className="hidden">
          <DialogTitle>Pickup Order</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">
          Table Detail Modal
        </DialogDescription>
        <div className="relative bg-body-gradient flex flex-row">
          <IconButton
            className="absolute right-4 top-4"
            variant="primaryWhite"
            size="large"
            icon={CloseIcon}
            iconSize="24"
            isActive={true}
            onClick={onClose}
          />
          <div className="flex flex-col w-full h-[96vh] m-4 gap-4">
            <div className="flex flex-row w-full gap-4 items-center">
              <h1 className="text-2xl font-bold mr-6">Pickup Order</h1>
              {
                !isAggregator &&
                <EditOrderDialog 
                  order={orderDetailQueryData?.data.data} 
                  orderListItem = {item}
                  isLoading={orderDetailLoading || orderDetailRefetching} 
                  onOrderItemUpdate={()=>{
                    refetchOrderDetail?.()
                  }}
                  onOrderUpdate={()=>{
                    onUpdate?.()
                  }}
                />
              }
              <CancelOrderDialog orderListItem={item!} 
                onCancelOrder={()=>{
                  onUpdate?.()
                  onClose?.()
                }}
              />
            </div>
            <div className="flex flex-row w-full gap-2">
              <div className="flex flex-row w-3/4 gap-2">
                <div className="flex w-1/3">
                  <OrderInfoCard order={item} variant = "uesr-name" />
                </div>
                <div className="flex w-1/3">
                  <OrderInfoCard order={item} variant = "order-number" />
                </div>
                <div className="flex w-1/3">
                  <OrderInfoCard order={item} variant = "order-status" />
                </div>
              </div>
              <div className="flex w-1/4">
                <OrderInfoCard orderDetail={orderDetailQueryData?.data.data} variant = "date-time" />
              </div>
            </div>
            <div className="flex flex-row w-full max-h-[calc(100vh-180px)] gap-2 subwindow-scroll-container overflow-auto">
              <div className="flex flex-row w-3/4 gap-2">
                <OrderItemDetailPanel order={orderDetailQueryData?.data.data} isLoading={orderDetailLoading || orderDetailRefetching} 
                  onDiscountUpdate={()=>{
                    refetchOrderDetail()
                  }}
                />
              </div>
              <div className="flex w-1/4">
                {!orderDetailQueryError && 
                  <OrderPayInfoPanel order={orderDetailQueryData?.data.data} isLoading={orderDetailLoading || orderDetailRefetching} 
                    onCloseOrder={()=>{
                      onUpdate?.()
                      onClose?.()
                    }}
                    onPayOrder={()=>{
                      refetchOrderDetail()
                      onUpdate?.()
                    }}
                  />
                }
              </div>
            </div>
          </div>
         
        </div>
      </DialogFullScreenContent>
    </FullScreenDialog>
  )
}

export default PickupDetailDialog;