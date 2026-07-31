const standardSteps = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];
const cancelledSteps = ["Pending", "Confirmed", "Cancelled"];

export const getTimelineSteps = (status) =>
  status === "Cancelled" ? cancelledSteps : standardSteps;
