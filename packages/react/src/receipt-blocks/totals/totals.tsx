import { formatUSD } from "belt/format";
import styles from "./totals.module.css";
import { ChevronDown } from "react-feather";
import { Adjustment, Receipt, Tax } from "versa_unstable_sdk";

type Colors = {
  brand: string;
  brandHighContrast: string;
  brandThemeLight: boolean;
};

export function Totals({
  taxes,
  header,
  adjustments,
  colors,
}: {
  taxes: Tax[];
  header: Receipt["header"];
  adjustments: Adjustment[] | null;
  colors: Colors;
}) {
  return (
    <div className={styles.grandTotal}>
      <div className={styles.totalBlock}>
        <div className={styles.blockLabel}>Subtotal</div>
        <div className={styles.blockValue}>
          {formatUSD(header.subtotal / 100)}
        </div>
      </div>
      {adjustments &&
        adjustments.map((a: any, index: any) => (
          <div className={styles.totalBlock} key={index}>
            <div className={styles.blockLabel}>{a.adjustment_type}</div>
            <div className={styles.blockValue}>{formatUSD(a.amount / 100)}</div>
          </div>
        ))}
      {taxes && (
        <div className={`tft-row ${styles.taxesFeesTipWrap}`}>
          {taxes.map((tft: any, index: number) => (
            <div key={index} className={styles.row}>
              <div className={styles.blockLabel}>{tft.name}</div>
              <div className={styles.blockValue}>
                {formatUSD(tft.amount / 100)}
              </div>
            </div>
          ))}
          {taxes.length > 5 && (
            <div className={styles.row}>
              <div
                className={styles.blockLabel}
                style={{
                  color: colors.brandHighContrast,
                }}
              >
                View All
                <ChevronDown
                  style={{
                    stroke: colors.brandHighContrast,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      <div className={`${styles.totalBlock} ${styles.bottomLine}`}>
        <div className={styles.blockLabel}>Total</div>
        <div className={styles.blockValue}>{formatUSD(header.total / 100)}</div>
      </div>
    </div>
  );
}
