import { useContext } from "react";
import TrackingContext from "../context/TrackingContext";

const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) throw new Error("useTracking must be used inside TrackingProvider");
  return context;
};

export default useTracking;
