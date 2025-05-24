import { useEffect, useMemo, useRef, useState } from "react";
import { analyze, format, OUTPUT_FORMATS, type OutputFormat } from "./lib";

function readHashState(): { hex?: string; name?: string } {
  if (typeof window === "undefined") return {};
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return {};
  const params = new URLSearchParams(raw);
  return {
    hex: params.get("hex") ?? undefined,
    name: params.get("name") ?? undefined,
  };
}

export function App() {
  const initial = readHashState();
  const [hex, setHex] = useState(initial.hex ?? "#3b82f6");
  const [name, setName] = useState(initial.name ?? "brand");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("tailwind-v4");

  // Reflect (hex, name) into the URL hash so palettes are shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("hex", hex);
    params.set("name", name);
    const next = `#${params.toString()}`;
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [hex, name]);

  const result = useMemo(() => {
    try {
      return { ok: true as const, ...analyze(hex) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false as const, error: msg };
    }
  }, [hex]);

  const formatted = useMemo(() => {
    if (!result.ok) return "";
    return format(
      { name, palette: result.palette, oklch: result.oklch },
      outputFormat,
    );
  }, [result, name, outputFormat]);

  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!formatted) return;
    void navigator.clipboard?.writeText(formatted);
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="container">
      <header>
        <h1>tailwind-palette-gen</h1>
        <p>
          Pick a base color, see the generated 50-950 palette in OKLCH-driven
          shades.
        </p>
      </header>

      <section className="controls">
        <label>
          Base color
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            data-invalid={!result.ok || undefined}
            spellCheck={false}
          />
          <input
            type="color"
            value={result.ok ? hex : "#3b82f6"}
            onChange={(e) => setHex(e.target.value)}
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            spellCheck={false}
          />
        </label>
      </section>

      {result.ok ? (
        <>
          <section className="swatches">
            {Object.entries(result.palette).map(([shade, color]) => {
              const o = result.oklch[shade];
              // Light backgrounds need dark text and vice versa. The OKLCH
              // L coordinate is already in our hands so we use it directly
              // instead of recomputing a luminance from the hex.
              const textColor = o.l > 0.55 ? "#18181b" : "#fafafa";
              return (
                <div
                  key={shade}
                  className="swatch"
                  style={{ background: color, color: textColor, textShadow: "none" }}
                >
                  <span className="shade">{shade}</span>
                  <span className="hex">{color}</span>
                </div>
              );
            })}
          </section>

          {result.contrastIssues.length > 0 && (
            <section className="warnings">
              <h2>Contrast warnings</h2>
              <ul>
                {result.contrastIssues.map((issue, i) => (
                  <li key={i}>
                    <code>{issue.from}</code> → <code>{issue.to}</code>:
                    {" "}OKLCH-L delta {issue.delta.toFixed(3)} (threshold {issue.threshold})
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="output">
            <div className="output-header">
              <label>
                Format
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                >
                  {OUTPUT_FORMATS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={handleCopy} className="copy">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea readOnly value={formatted} rows={14} spellCheck={false} />
          </section>
        </>
      ) : (
        <section className="error">{result.error}</section>
      )}
    </main>
  );
}
