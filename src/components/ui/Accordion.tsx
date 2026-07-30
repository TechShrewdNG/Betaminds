"use client";

import { useId, useState } from "react";
import styles from "./ui.module.css";

export type AccordionItem = { q: string; a: string };

/** FAQ stack. One row open at a time; clicking the open row closes it. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${base}-panel-${index}`;
        const buttonId = `${base}-button-${index}`;
        return (
          <div key={item.q} className={styles.accordionRow}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={buttonId}
                className={styles.accordionButton}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className={styles.accordionSign} aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
                {item.q}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={styles.accordionPanel}
              hidden={!isOpen}
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
