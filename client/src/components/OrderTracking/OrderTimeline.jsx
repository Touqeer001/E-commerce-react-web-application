import TrackingStep from "./TrackingStep";
import { getTimelineSteps } from "./trackingConfig";

const OrderTimeline = ({ status }) => {
  const steps = getTimelineSteps(status);
  const currentIndex = steps.indexOf(status);

  return (
    <ol className="order-tracking-timeline" aria-label="Order tracking timeline">
      {steps.map((step, index) => (
        <TrackingStep
          key={step}
          status={step}
          state={
            currentIndex === -1 || index > currentIndex
              ? "upcoming"
              : index === currentIndex
                ? "current"
                : "complete"
          }
          isLast={index === steps.length - 1}
        />
      ))}
    </ol>
  );
};

export default OrderTimeline;
