import { CSS_TOKENS, TOKEN_MAP, type ThemeValues, type TokenValue } from "./tokens";

/** Serialize a token value to its CSS string, applying the token's unit for ranges. */
export function cssVarValue(key: string, value: TokenValue): string {
  const t = TOKEN_MAP[key];
  if (!t) return String(value);
  if (t.type === "range") return `${value}${t.unit ?? ""}`;
  return String(value); // color / select values are used verbatim
}

/** Build the full { "--token": "value" } map for every CSS-backed token. */
export function buildRootVars(values: ThemeValues): Record<string, string> {
  const out: Record<string, string> = {};
  for (const t of CSS_TOKENS) {
    const v = values[t.key] ?? t.default;
    out[`--${t.key}`] = cssVarValue(t.key, v);
  }
  return out;
}

/** A `:root { ... }` string for server-side injection (correct first paint, no flash). */
export function rootCssString(values: ThemeValues): string {
  const vars = buildRootVars(values);
  const body = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `:root{${body}}`;
}
