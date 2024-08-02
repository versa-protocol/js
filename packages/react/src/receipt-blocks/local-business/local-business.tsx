import styles from "./local-business.module.css";
// import Image from "next/image";
import { Place } from "versa_unstable_sdk";

export function LocalBusiness({
  location,
  theme,
  brandColor,
}: {
  location: Place;
  theme: any;
  brandColor: any;
}) {
  return (
    <div className={styles.localBusinessWrap}>
      <div className={styles.localBusiness}>
        <div>
          {location.address && (
            <div className={styles.mapWrap}>
              {/* <Image
                src={`https://api.mapbox.com/styles/v1/mapbox/${
                  theme == "light" ? "light-v11" : "dark-v11"
                }/static/pin-s+555555(${location.address.lon},${
                  location.address.lat
                })/${location.address.lon},${
                  location.address.lat
                },14,0/400x140@2x?logo=false&attribution=false&access_token=${
                  process.env.MAPBOX_TOKEN
                }`}
                width={400}
                height={140}
                alt=""
              /> */}
            </div>
          )}
          <div className={styles.localBusinessProfile}>
            {location.address && (
              <div>
                {location.address.street_address}
                <br />
                {location.address.city}, {location.address.region}{" "}
                {location.address.postal_code}
              </div>
            )}
            <div>{location.phone}</div>
            {/* <div>
              <span
                style={{
                  color: brandColor,
                }}
              >
                {location.hours_summary}
              </span>{" "}
              &nbsp;·&nbsp;{" "}
              <span className={styles.modifierText}>Show more</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
