# SentinelOne STAR to Palo Alto Cortex Utility

Standalone browser utility for staging SentinelOne-to-Cortex detection migration work.

## Use

Open `index.html` directly, or run a local static server:

```powershell
node server.mjs 4288
```

Then browse to `http://127.0.0.1:4288/`.

## What It Does

- Translates pasted SentinelOne STAR logic into draft Cortex XQL.
- Maps common SentinelOne fields such as `EventType`, `TgtProcCmdLine`, `SrcProcName`, `RegistryKeyPath`, `DstIP`, and hash fields to Cortex-style fields.
- Classifies each item as BIOC Rule, Correlation Rule, XQL Hunt, IOC Rule, or Exception Review.
- Extracts BIOC/rule-builder notes, manual-review flags, complexity, risk, and confidence.
- Imports SentinelOne-style JSON exports or CSV inventory rows.
- Exports the enriched migration matrix as CSV or JSON, including the draft XQL and field map.
- Stores working data in browser local storage.

## Import Fields

CSV or JSON import works best with these fields:

```text
name,type,severity,scope,owner,status,logic
```

Accepted `type` values are `star`, `hunt`, `exclusion`, and `ioc`. The importer also normalizes common names such as `Deep Visibility`, `indicator`, `allow`, and `hash`.

For JSON exports, the importer looks for arrays named `rules`, `items`, `data`, `results`, or `detections`, then attempts to extract query text from fields such as `query`, `queryText`, `filter`, `expression`, `logic`, `ruleQuery`, and `dvQuery`.

`sample-import.csv` is included as a quick import test/template.

## Vercel

Deploy the utility with the Vercel project root set to:

```text
xdr-cutover-utility
```

No build step is required; the folder is a static site. `vercel.json` adds clean URLs and basic browser security headers.

## Note

The translator creates review-ready drafts, not production-certified detections. Final Cortex implementation should be validated against tenant schema, real Cortex telemetry, alert volume, endpoint impact, SOC routing, and exception-risk approval.
