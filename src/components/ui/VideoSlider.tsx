"use client";

import { useState } from "react";
import styles from "./ui.module.css";
import { youtubeId } from "@/lib/youtube";

export type VideoItem = { title: string; youtubeUrl: string };

/**
 * One YouTube video at a time, click-to-play like `PromoVideo`, with
 * prev/next controls when there's more than one — the "slider" the summit
 * page asked for.
 *
 * Click-to-play rather than an embedded player up front for the same reason
 * as PromoVideo: nothing autoplays with sound the visitor didn't ask for,
 * and a slide the visitor never reaches never loads YouTube's iframe at all.
 * `youtube-nocookie.com` avoids setting tracking cookies before that click.
 *
 * Rows whose URL doesn't parse to a video ID are dropped rather than shown
 * broken — an editor pasting a bad link finds out from the missing card
 * matching Media Services and gallery images filtering the same way,
 * not from a visitor hitting a dead player.
 */
export function VideoSlider({ items }: { items: VideoItem[] }) {
  const valid = items
    .map((item) => ({ ...item, id: youtubeId(item.youtubeUrl) }))
    .filter((item) => item.id !== "");

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  if (valid.length === 0) return null;
  const current = valid[index % valid.length];

  const step = (delta: number) => {
    setPlaying(false);
    setIndex((value) => (value + delta + valid.length) % valid.length);
  };

  return (
    <div>
      <div className={styles.promoFrame} style={{ aspectRatio: "16 / 9" }}>
        {playing ? (
          <iframe
            key={current.id}
            className={styles.videoEmbed}
            src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1`}
            title={current.title || "Summit highlight video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={styles.promoPoster}
            onClick={() => setPlaying(true)}
            aria-label={current.title ? `Play: ${current.title}` : "Play video"}
          >
            {/* YouTube always has this thumbnail — no CMS field needed. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${current.id}/hqdefault.jpg`}
              alt=""
              className={styles.promoPosterImg}
              loading="lazy"
            />
            <span className={styles.promoPlay}>
              <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
                <path d="M1 1.5v15l14-7.5-14-7.5z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <div className={styles.videoFoot}>
        <div className={styles.videoTitle}>{current.title}</div>
        {valid.length > 1 ? (
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.round}
              onClick={() => step(-1)}
              aria-label="Previous video"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.round}
              onClick={() => step(1)}
              aria-label="Next video"
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
