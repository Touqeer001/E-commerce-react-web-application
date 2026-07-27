import { useCallback, useState } from "react";
import TrackingContext from "./TrackingContext";
import { getOrderTracking } from "../Services/trackingService";

const TrackingProvider = ({ children }) => {
  const [tracking, setTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const fetchTracking = useCallback(async (orderId) => {
    setTrackingLoading(true);
    try {
      const response = await getOrderTracking(orderId);
      setTracking(response.data.data);
      return response.data.data;
    } finally { setTrackingLoading(false); }
  }, []);

  return <TrackingContext.Provider value={{ tracking, trackingLoading, fetchTracking }}>{children}</TrackingContext.Provider>;
};

export default TrackingProvider;
