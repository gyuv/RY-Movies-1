"use client";

import { useState } from "react";
import type { WatchOption } from "@/types";

const TIER_META: Record<WatchOption["tier"], { label: string; className: string }> = {
  flatrate: { label: "Subscription", className: "border-marquee text-marquee" },
  free: { label: "Free", className: "border-reel-teal text-reel-teal" },
  ads: { label: "Free with ads", className: "border-reel-teal text-reel-teal" },
  rent: { label: "Rent", className: "border-reel-rose text-reel-rose" },
  buy: { label: "Buy", className: "border-reel-rose text-reel-rose" },
};

/**
 * Provider tab-switcher: same "Server 1 / Server 2" interaction pattern as
 * a stream-mirror switcher, but every tab is a real, licensed provider
 * (Netflix, Prime, Tubi, etc.) from TMDb's watch/providers data. Selecting
 * a tab doesn't try to embed their player in an iframe — that violates
 * every provider's terms and usually just fails — it opens their real
 * page in a new tab, which is the only place a subscription/DRM stream can
 * legally play anyway.
 */
export default function WatchBadges({ options }: { options: WatchOption[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(
    options[0] ? `${options[0].tier}-${options[0].providerId}` : null
  );

  if (options.length === 0) {
    return (
      <p className="text-paper-dim text-sm">
        No licensed streaming availability found for your region right now.
      </p>
    );
  }

  const order: WatchOption["tier"][] = ["free", "ads", "flatrate", "rent", "buy"];
  const sorted = [...options].sort((a, b) => order.indexOf(a.tier) - order.indexOf(b.tier));
  const active = sorted.find((o) => `${o.tier}-${o.providerId}` === activeKey) ?? sorted[0];

  return (
    <div>
      {/* Tab strip */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sorted.map((opt) => {
          const key = `${opt.tier}-${opt.providerId}`;
          const isActive = key === activeKey;
          return (
            <button
              key={key}
              onClick={() => setActiveKey(key)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wide border transition-colors ${
                isActive
                  ? TIER_META[opt.tier].className
                  : "border-ink-line text-paper-dim hover:text-paper hover:border-paper-dim"
              }`}
            >
              {opt.providerName}
            </button>
          );
        })}
      </div>

      {/* Active provider panel */}
      {active && (
        <div className="border border-ink-line bg-ink p-4">
          <p className={`stub-label mb-1 ${TIER_META[active.tier].className.split(" ")[1]}`}>
            {TIER_META[active.tier].label}
          </p>
          <p className="text-paper font-display italic text-lg mb-3">{active.providerName}</p>
          <a
            href={active.deepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 border border-marquee text-marquee text-sm hover:bg-marquee hover:text-ink transition-colors"
          >
            Open on {active.providerName} →
          </a>
        </div>
      )}
    </div>
  );
}
