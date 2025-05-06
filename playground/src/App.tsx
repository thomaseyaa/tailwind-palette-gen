import { useMemo, useState } from "react";
import { analyze } from "./lib";

export function App() {
  const [hex, setHex] = useState("#3b82f6");
  const [name, setName] = useState("brand");

  const result = useMemo(() => {
    try {
      return { ok: true as const, ...analyze(hex) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false as const, error: msg };
    }
  }, [hex]);

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
        <section className="swatches">
          {Object.entries(result.palette).map(([shade, color]) => (
            <div key={shade} className="swatch" style={{ background: color }}>
              <span className="shade">{shade}</span>
              <span className="hex">{color}</span>
            </div>
          ))}
        </section>
      ) : (
        <section className="error">{result.error}</section>
      )}
    </main>
  );
}
