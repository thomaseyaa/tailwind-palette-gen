import { useMemo, useRef, useState } from "react";
import { analyze, format, OUTPUT_FORMATS, type OutputFormat } from "./lib";

export function App() {
  const [hex, setHex] = useState("#3b82f6");
  const [name, setName] = useState("brand");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("tailwind-v4");

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
          />
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </section>

      {result.ok ? (
        <>
          <section className="swatches">
            {Object.entries(result.palette).map(([shade, color]) => (
              <div key={shade} className="swatch" style={{ background: color }}>
                <span className="shade">{shade}</span>
                <span className="hex">{color}</span>
              </div>
            ))}
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
