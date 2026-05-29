/* portfolio-tweaks.jsx — live design controls for the portfolio.
   Drives CSS variables + data-attributes on <html>; the vanilla
   page + stylesheet react to them. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": ["#34d399", "#2dd4bf"],
  "reduceMotion": false,
  "heroLayout": "split",
  "grid": true
}/*EDITMODE-END*/;

const ACCENT_PALETTES = [
  ["#34d399", "#2dd4bf"], // emerald (default)
  ["#6366f1", "#22d3ee"], // indigo + cyan
  ["#22d3ee", "#38bdf8"], // cyan / sky
  ["#fbbf24", "#fb923c"], // amber
  ["#c084fc", "#a855f7"], // violet
  ["#fb7185", "#f472b6"], // rose
];

function PortfolioTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement;
    const accent = Array.isArray(t.accent) ? t.accent : [t.accent, t.accent];
    r.style.setProperty("--accent", accent[0]);
    r.style.setProperty("--accent-2", accent[1] || accent[0]);
    r.setAttribute("data-motion", t.reduceMotion ? "reduced" : "on");
    r.setAttribute("data-hero", t.heroLayout || "split");
    r.setAttribute("data-grid", t.grid ? "on" : "off");
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent" />
      <TweakColor
        label="Color theme"
        value={t.accent}
        options={ACCENT_PALETTES}
        onChange={(v) => setTweak("accent", v)}
      />

      <TweakSection label="Hero" />
      <TweakRadio
        label="Layout"
        value={t.heroLayout}
        options={["split", "centered"]}
        onChange={(v) => setTweak("heroLayout", v)}
      />

      <TweakSection label="Motion & detail" />
      <TweakToggle
        label="Reduce motion"
        value={t.reduceMotion}
        onChange={(v) => setTweak("reduceMotion", v)}
      />
      <TweakToggle
        label="Background grid"
        value={t.grid}
        onChange={(v) => setTweak("grid", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweak-root")).render(<PortfolioTweaks />);
