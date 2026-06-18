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
- Validates STAR and hunt logic as S1QL with selectable Auto, 1.0, and 2.0 modes before conversion.
- Maps a broad SentinelOne/S1QL field registry to Cortex-style fields, including event metadata, process, parent process, file, generic object, registry, network, DNS, identity, endpoint, signature, module, and threat metadata fields.
- Normalizes common S1QL spelling variants such as `ObjectType`, `object_type`, and `Object Type`, then applies contextual mapping for generic object fields based on surrounding `ObjectType` logic.
- Classifies each item as BIOC Rule, Correlation Rule, XQL Hunt, IOC Rule, or Exception Review.
- Correlates rule context to MITRE ATT&CK tactics, techniques, and sub-techniques with confidence and rationale.
- Extracts BIOC/rule-builder notes, manual-review flags, complexity, risk, and confidence.
- Imports SentinelOne-style JSON exports or CSV inventory rows.
- Exports the enriched migration matrix as CSV or JSON, including the draft XQL and field map.
- Stores working data in browser local storage.

For the complete deterministic conversion logic, see [CONVERSION_APPENDIX.md](CONVERSION_APPENDIX.md).

## Import Fields

CSV or JSON import works best with these fields:

```text
name,type,s1qlVersion,severity,scope,owner,status,logic
```

Accepted `type` values are `star`, `hunt`, `exclusion`, and `ioc`. The importer also normalizes common names such as `Deep Visibility`, `indicator`, `allow`, and `hash`.

Accepted `s1qlVersion` values are `auto`, `1.0`, and `2.0`. If omitted, the validator uses auto-detection and treats rules without S1QL 2.0-only operators as 1.0-compatible.

For JSON exports, the importer looks for arrays named `rules`, `items`, `data`, `results`, or `detections`, then attempts to extract query text from fields such as `query`, `queryText`, `filter`, `expression`, `logic`, `ruleQuery`, and `dvQuery`.

`sample-import.csv` is included as a quick import test/template.

## Vercel

Deploy the utility with the Vercel project root set to:

```text
LU_EDR_Migration
```

No build step is required; the folder is a static site. `vercel.json` adds clean URLs and basic browser security headers.

## Note

The translator creates review-ready drafts, not production-certified detections. Final Cortex implementation should be validated against tenant schema, real Cortex telemetry, alert volume, endpoint impact, SOC routing, and exception-risk approval.
