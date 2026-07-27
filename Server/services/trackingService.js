import trackingTemplates from "../data/trackingData.js";

export const getOrderTracking = (orderId) => {
  const delivered = String(orderId).endsWith("0") || String(orderId).endsWith("5");
  const currentIndex = delivered ? 4 : 2;
  const orderedAt = Date.now() - 1000 * 60 * 60 * 24;
  const courierName = "LittleTrendz Express";
  const trackingId = `LTZ-${String(orderId).replace(/[^a-zA-Z0-9]/g, "").slice(-10).toUpperCase()}`;

  const history = trackingTemplates.slice(0, currentIndex + 1).map((event, index) => ({
    ...event,
    completed: true,
    dateTime: new Date(orderedAt + event.offset * 60 * 60 * 1000).toISOString(),
    courierName,
    trackingId,
    sequence: index,
  }));

  return {
    orderId,
    currentStatus: trackingTemplates[currentIndex].status,
    estimatedDelivery: delivered ? "Delivered" : "Expected in 2–3 business days",
    courierName,
    trackingId,
    steps: trackingTemplates.map((event, index) => ({ ...event, completed: index <= currentIndex })),
    history,
  };
};
