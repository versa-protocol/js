import { Org, Receipt } from "@versaprotocol/schema";
import {
  ActionBlock,
  ActivityBlock,
  BlockWrap,
  Footer,
  ItemizedCarRental,
  ItemizedFlight,
  ItemizedLodging,
  ItemizedSubscription,
  ItemizedTransitRoute,
  LineItems,
  LocalBusiness,
  ReceiptHeader,
  Shipment,
  ThirdParty,
  Totals,
} from "./../receipt-blocks";
import {
  Activity,
  aggregateAdjustments,
  aggregateEcommerceItems,
  aggregateTaxes,
} from "@versaprotocol/belt";
import styles from "./base_receipt.module.css";
import { Payments } from "../receipt-blocks/payments";
import { Parties } from "../receipt-blocks/parties/parties";

export function ReceiptDisplay({
  receipt,
  merchant,
  theme,
  activities,
}: {
  merchant: Org;
  receipt: Receipt;
  theme?: string;
  activities?: Activity[];
}) {
  const data = receipt;

  // Theming
  const colors = {
    brand: "",
    brandHighContrast: "",
    brandThemeLight: false,
  };
  if (
    receipt?.header?.third_party &&
    receipt?.header?.third_party.make_primary &&
    receipt?.header?.third_party.merchant.brand_color
  ) {
    colors.brand = receipt?.header?.third_party.merchant.brand_color;
  } else {
    colors.brand = merchant?.brand_color || "#000000";
  }
  // Should the brand theme be light with dark text, or dark with light text?
  colors.brandThemeLight = brightnessByColor(colors.brand) > 190;
  // If the brand color is effectively black or white...
  if (
    brightnessByColor(colors.brand) < 40 ||
    brightnessByColor(colors.brand) > 215
  ) {
    colors.brandHighContrast = "var(--blue)";
  } else {
    colors.brandHighContrast = colors.brand;
  }

  return (
    <div className={styles.receiptWrap}>
      {/* Header */}

      <ReceiptHeader
        merchant={merchant}
        header={data.header}
        brandColor={colors.brand}
      />

      {/* Itemization */}

      {data.header.third_party && !data.header.third_party.make_primary && (
        <BlockWrap>
          <ThirdParty
            third_party={data.header.third_party}
            merchant={merchant}
          />
        </BlockWrap>
      )}
      {data.itemization.subscription && (
        <>
          <BlockWrap>
            <ItemizedSubscription
              subscription={data.itemization.subscription}
            />
          </BlockWrap>
          <BlockWrap>
            <LineItems
              items={data.itemization.subscription.subscription_items}
            />
          </BlockWrap>
        </>
      )}
      {data.itemization.car_rental && (
        <>
          <BlockWrap>
            <ItemizedCarRental car_rental={data.itemization.car_rental} />
          </BlockWrap>
          <BlockWrap>
            <LineItems items={data.itemization.car_rental.items} />
          </BlockWrap>
        </>
      )}
      {data.itemization.ecommerce && (
        <>
          {data.itemization.ecommerce.shipments && (
            <BlockWrap>
              <Shipment
                data={data.itemization.ecommerce.shipments}
                brandColor={colors.brand}
              />
            </BlockWrap>
          )}
          <BlockWrap>
            <LineItems
              items={aggregateEcommerceItems(data.itemization.ecommerce)}
            />
          </BlockWrap>
        </>
      )}
      {data.itemization.lodging && (
        <>
          <BlockWrap>
            <ItemizedLodging data={data.itemization.lodging} theme={theme} />
          </BlockWrap>
          <BlockWrap>
            <LineItems items={data.itemization.lodging.items} />
          </BlockWrap>
        </>
      )}
      {data.itemization.flight && (
        <BlockWrap>
          <ItemizedFlight flight={data.itemization.flight} />
        </BlockWrap>
      )}
      {data.itemization.transit_route && (
        <BlockWrap>
          <ItemizedTransitRoute
            transit_route={data.itemization.transit_route}
            header={data.header}
            theme={theme}
          />
        </BlockWrap>
      )}
      {data.itemization.general && (
        <BlockWrap>
          <LineItems items={(data.itemization.general as any).line_items} />
        </BlockWrap>
      )}

      {/* Totals: Taxes, Fees, Tip */}
      <BlockWrap>
        <Totals
          taxes={aggregateTaxes(data.itemization)}
          header={receipt.header}
          adjustments={aggregateAdjustments(data.itemization)}
          colors={colors}
        />
      </BlockWrap>

      {/* Actions */}

      {data.actions && data.actions.length > 0 && (
        <BlockWrap>
          <ActionBlock
            actions={data.actions}
            brandTheme={colors.brand}
            brandThemeContrastLight={colors.brandThemeLight}
          />
        </BlockWrap>
      )}

      {/* Local Transaction */}

      {data.header.location && (
        <BlockWrap>
          <LocalBusiness
            location={data.header.location}
            theme={theme}
            brandColor={colors.brandHighContrast}
          />
        </BlockWrap>
      )}

      {/* Payments */}

      {data.payments && data.payments.length > 0 && (
        <BlockWrap>
          <Payments payments={data.payments} header={data.header} />
        </BlockWrap>
      )}

      {/* Parties */}

      {(data.header.customer || merchant.address) && (
        <div className={styles.fullPageHide}>
          <BlockWrap>
            <Parties customer={data.header.customer} merchant={merchant} />
          </BlockWrap>
        </div>
      )}

      {/* Activity */}

      {!!activities?.length && (
        <BlockWrap>
          <ActivityBlock activities={activities} />
        </BlockWrap>
      )}

      {/* Footer */}

      <Footer
        mapAttribution={
          data.itemization.lodging ||
          (data.itemization.transit_route &&
            data.itemization.transit_route.transit_route_items.length < 2)
            ? true
            : false
        }
      />
    </div>
  );
}

function brightnessByColor(color: string) {
  var r = "",
    g = "",
    b = "";
  const hasFullSpec = color.length == 7;
  var m = color.substring(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
  if (m) {
    var r = parseInt(m[0] + (hasFullSpec ? "" : m[0]), 16).toString(),
      g = parseInt(m[1] + (hasFullSpec ? "" : m[1]), 16).toString(),
      b = parseInt(m[2] + (hasFullSpec ? "" : m[2]), 16).toString();
  }
  if (typeof r != "undefined") {
    return (Number(r) * 299 + Number(g) * 587 + Number(b) * 114) / 1000;
  }
  return 0;
}
