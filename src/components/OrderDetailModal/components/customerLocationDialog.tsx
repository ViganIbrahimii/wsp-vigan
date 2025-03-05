"use client"

import React, { useEffect, useMemo, useState } from "react"
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { CloseIcon, TrashIcon } from "@/icons"
import "leaflet/dist/leaflet.css";
import { useDeleteOrder } from "@/lib/hooks/mutations/orders/useDeleteOrder"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogClose,
  DialogContentNoPadding,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import { MainButton } from "@/components/mainButton"
import { OrderListItem } from "@/types/interfaces/order.interface"
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { TableDetailOrderItemCard } from "./TableDetailOrderItemCard"
import dynamic from "next/dynamic";

// Dynamic imports of react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });

interface CustomerLocationDialogProps {
  lat: number;
  lng: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

const CustomerLocationDialog: React.FC<CustomerLocationDialogProps> = ({
  lat,
  lng
}) => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState({ lat, lng });

  const [hasMounted, setHasMounted] = useState(false);

  const LeafletMap = useMemo(
    () =>
        dynamic(() => import('./leafLet'), {
            loading: () => <p>A map is loading</p>,
            ssr: false,
        }),
    [],
  );

  useEffect(() => {
    setHasMounted(true); // Mark the component as mounted to ensure client-side rendering
  }, []);

  
  useEffect(()=>{
    setLocation({lat, lng})
  }, [lat, lng])
  
  if (!hasMounted) return null; // Prevent rendering during SSR

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <a className="text-blue-500 underline">Location on Map</a>
      </DialogTrigger>
      <DialogContentNoPadding className="py-6">
        <DialogHeader className="px-6">
          <DialogTitle>Customer Location</DialogTitle>
          <DialogClose asChild>
            <IconButton
              variant="primaryWhite"
              size="large"
              icon={CloseIcon}
              iconSize="24"
              isActive={true}
            />
          </DialogClose>
        </DialogHeader>
        <div className="w-full pb-4">
          {/* <LoadScript googleMapsApiKey={process.env.GOOGLEMAP_API_KEY || ""}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}
              zoom={10}
            >
              <Marker position={location} />
            </GoogleMap>
          </LoadScript> */}
          <LeafletMap lat={lat} lng={lng} />
        </div>
      </DialogContentNoPadding>
    </Dialog>
  )
}

export default CustomerLocationDialog
