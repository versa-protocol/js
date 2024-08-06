import { formatDateTime, formatUSD } from "@versaprotocol/belt";
import styles from "./itemized-subscription.module.css";
import { Subscription } from "@versaprotocol/schema";

export function ItemizedSubscription({
  subscription,
}: {
  subscription: Subscription;
}) {
  return (
    <div className={styles.subscriptionWrap}>
      {subscription.subscription_items.map((s: any, index: number) => (
        <>
          {s.subscription_type == "recurring" && (
            <div className={styles.subscriptionNote} key={index}>
              Your subscription was renewed for your team of {s.quantity}. Your
              next bill will be on {formatDateTime(s.current_period_end)}.
            </div>
          )}
        </>
      ))}
    </div>
  );
}
