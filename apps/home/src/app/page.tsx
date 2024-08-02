import Image from "next/image";
import styles from "./page.module.css";

export function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Homepage for the Versa JS Monorepo. Built with Next.js</p>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </main>
  );
}
