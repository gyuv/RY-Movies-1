import type { WatchOption } from "@/types";

const TIER_META: Record<
  WatchOption["tier"],
  { label: string; className: string }
> = {
  flatrate: { label: "Subscription", className: "border-marquee text-marquee" },
  free: { label: "Free", className: "border-reel-teal text-reel-teal" },
  ads: { label: "Free with ads", className: "border-reel-teal text-reel-teal" },
  rent: { label: "Rent", className: "border-reel-rose text-reel-rose" },
  buy: { label: "Buy", className: "border-reel-rose text-reel-rose" },
};

export default function WatchBadges({ options }: { options: WatchOption[] }) {
  if (options.length === 0) {
    return (
      <p className="text-paper-dim text-sm">
        No licensed streaming availability found for your region right now.
      </p>
    );
  }

  // group by tier, preserving a sensible viewing order
  const order: WatchOption["tier"][] = ["free", "ads", "flatrate", "rent", "buy"];
  const grouped = order
    .map((tier) => ({ tier, items: options.filter((o) => o.tier === tier) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-5">
      {grouped.map(({ tier, items }) => (
        <div key={tier}>
          <p className="stub-label mb-2">{TIER_META[tier].label}</p>
          <div className="flex flex-wrap gap-2">
            {items.map((opt) => (
              <a
                key={`${tier}-${opt.providerId}`}
                href={opt.deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-2 border bg-ink-raised hover:bg-ink-line/40 transition-colors ${TIER_META[tier].className}`}
              >
                <span className="text-sm text-paper">{opt.providerName}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
