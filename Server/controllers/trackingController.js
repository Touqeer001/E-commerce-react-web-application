import { getOrderTracking } from "../services/trackingService.js";

export const getTracking = (req, res) => {
  res.status(200).json({ success: true, data: getOrderTracking(req.params.orderId) });
};
