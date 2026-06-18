# Conversion Appendix

This appendix documents the deterministic conversion logic used by the SentinelOne STAR to Palo Alto Cortex migration utility.

The utility is a first-pass migration assistant. It does not claim tenant-certified Cortex syntax, exact SentinelOne export parity, or production-ready detection behavior. Every output should be validated against the destination Cortex tenant schema, telemetry availability, alert volume, and SOC routing.

## 1. Processing Pipeline

Each imported or pasted item passes through the same high-level pipeline:

1. Normalize the source item into the internal shape:
   - `type`
   - `name`
   - `severity`
   - `scope`
   - `owner`
   - `status`
   - `logic`
2. Extract rule logic from raw text or JSON.
3. Classify the source item into a Cortex destination.
4. Translate fields, event types, operators, and values.
5. Generate draft Cortex XQL.
6. Generate BIOC or rule-builder notes.
7. Generate field-mapping metadata.
8. Generate manual-review flags.
9. Assign risk, confidence, and complexity.
10. Render and export the enriched migration matrix.

## 2. Supported Source Types

| Internal type | Source meaning | Main conversion path |
|---|---|---|
| `star` | SentinelOne STAR detection rule | Field/operator rewrite into draft Cortex XQL, usually BIOC or Correlation candidate |
| `hunt` | SentinelOne Deep Visibility or analyst hunt | Draft XQL hunt, promoted only after validation |
| `ioc` | Hash, IP, domain, URL, or blocklist indicator | IOC extraction and Cortex XQL indicator check |
| `exclusion` | Allow, suppression, interoperability, performance, or path exclusion | Exception Review, not automatic allow-rule migration |

## 3. Import Normalization

CSV import works best with:

```text
name,type,severity,scope,owner,status,logic
```

JSON import accepts either a single object or arrays under these keys:

```text
rules, items, data, results, detections
```

For rule text, the importer checks these fields:

```text
logic, query, queryText, filter, expression, description, path, value, indicator
```

For embedded STAR export JSON, the extraction layer prefers:

```text
query, queryText, filter, expression, logic, ruleQuery, dvQuery, description
```

If no structured query field is found, the whole object is stringified so the analyst can still review it.

## 4. Type Normalization

| Input contains | Normalized type |
|---|---|
| `hunt`, `deep` | `hunt` |
| `excl`, `allow` | `exclusion` |
| `ioc`, `indicator`, `hash` | `ioc` |
| Anything else | `star` |

## 5. Severity Normalization

| Input contains | Normalized severity |
|---|---|
| `critical` | `Critical` |
| `high` | `High` |
| `low` | `Low` |
| Anything else | `Medium` |

## 6. Status Normalization

| Input contains | Normalized status |
|---|---|
| `ready` | `Ready for pilot` |
| `retire` | `Retire` |
| `backlog` | `Backlog` |
| Anything else | `Needs validation` |

## 7. Cortex Destination Classification

Classification is heuristic and based on source type plus text found in the name and logic.

### Exception Review

An item is classified as `Exception Review` if:

- Source type is `exclusion`
- Text includes one of:
  - `exclusion`
  - `allow`
  - `path exclusion`
  - `certificate`
  - `signer`
  - `white_hash`
  - `interoperability`
  - `performance`
  - `suppress`

Recommended work:

```text
Re-justify the exclusion and determine whether Cortex needs alert exclusion,
disable prevention, disable injection, or no migration.
```

### IOC Rule

An item is classified as `IOC Rule` if:

- Source type is `ioc`
- Text includes one of:
  - `sha256`
  - `sha1`
  - `md5`
  - `domain`
  - `ip`
  - `indicator`
  - `blocklist`
  - `known bad`

Recommended work:

```text
Normalize indicators, deduplicate, add expiration and source, then load through
Cortex IOC workflows or SIEM controls.
```

### Correlation Rule

An item is classified as `Correlation Rule` if temporal, threshold, join, or cross-source logic is detected.

Sequence or threshold signals:

```text
count, threshold, within, followed by, multiple, join, after, before, over <number>,
failed ... success, same source
```

External dataset signals:

```text
identity, firewall, cloud, siem, ngfw, vpn, email, okta, entra, azure, aws, gcp, sso
```

Recommended work:

```text
Rewrite as scheduled XQL with an explicit time window, threshold, suppression
logic, and test volume.
```

### BIOC Rule

An item is classified as `BIOC Rule` when it is a STAR rule and endpoint behavior is detected without stronger Correlation/IOC/Exception signals.

Endpoint behavior signals:

```text
eventtype, process, proc, cmdline, command, powershell, pwsh, rundll32,
regsvr32, wscript, cscript, persistence, credential, file, registry,
network, dstip, srcproc, tgtproc, rclone, lolbin
```

Recommended work:

```text
Map process, file, registry, and network fields into Cortex xdr_data and validate
as a BIOC candidate.
```

### XQL Hunt

An item is classified as `XQL Hunt` by default, or when the source is a Deep Visibility hunt without enough confidence to make it an alerting rule.

Recommended work:

```text
Convert to XQL, run against 30-90 days of Cortex telemetry, then decide whether
it should alert.
```

## 8. Risk Assignment

Base severity risk:

| Severity | Risk |
|---|---|
| `Critical` | `High` |
| `High` | `Medium` |
| `Medium` | `Low` |
| `Low` | `Low` |

Risk is increased to `High` when:

- Automated response behavior is detected:
  - `quarantine`
  - `kill`
  - `isolate`
  - `remediate`
  - `rollback`
  - `response`
  - `terminate`
  - `disable network`
- Broad exclusion behavior is detected.
- Performance or interoperability exclusions are detected.

IOC items are assigned `Low` migration risk because the transformation itself is usually straightforward. Operational risk still depends on source quality and alert routing.

## 9. Confidence Assignment

Initial confidence:

| Destination | Initial confidence |
|---|---|
| IOC Rule | High |
| BIOC Rule | High |
| Correlation Rule with external datasets | Medium |
| Correlation Rule without external datasets | High |
| XQL Hunt | Medium |
| Exception Review | Medium |

Confidence is lowered when:

- A high-severity manual review issue exists.
- Two or more low-confidence field mappings exist.
- A nominally high-confidence conversion has unmapped fields or review warnings.

## 10. Complexity Assignment

Complexity is based on boolean count, condition count, and manual-review flags.

| Condition | Complexity |
|---|---|
| High manual-review issue exists | High |
| Boolean operators >= 5 | High |
| Extracted conditions >= 6 | High |
| Medium manual-review issue exists | Medium |
| Boolean operators >= 2 | Medium |
| Extracted conditions >= 3 | Medium |
| Otherwise | Low |

Boolean operators counted:

```text
AND, OR, NOT
```

## 11. Field Mapping Dictionary

The utility maps known SentinelOne fields to Cortex-style fields. Unknown fields are preserved as-is and marked `Low` confidence.

| SentinelOne field | Cortex field | Confidence | Notes |
|---|---|---|---|
| `EventType` | `event_type` | High | Mapped to Cortex event enum when recognized |
| `TgtProcName` | `action_process_image_name` | High | Target process name |
| `TgtProcImageName` | `action_process_image_name` | High | Target process name |
| `TgtProcCmdLine` | `action_process_image_command_line` | High | Target process command line |
| `TgtProcCmdLineHash` | `action_process_image_command_line` | Low | Hash-derived command-line logic needs tenant validation |
| `TgtProcPath` | `action_process_image_path` | High | Target process image path |
| `SrcProcName` | `actor_process_image_name` | High | Source, parent, or actor process name |
| `SrcProcImageName` | `actor_process_image_name` | High | Source, parent, or actor process name |
| `SrcProcCmdLine` | `actor_process_command_line` | High | Source, parent, or actor command line |
| `SrcProcPath` | `actor_process_image_path` | High | Source, parent, or actor path |
| `FilePath` | `action_file_path` | Medium | Confirm source/target/result file semantics |
| `FileFullPath` | `action_file_path` | Medium | Confirm source/target/result file semantics |
| `TgtFilePath` | `action_file_path` | High | Target file path |
| `SrcFilePath` | `actor_process_image_path` | Medium | Often maps to actor image path; confirm event family |
| `FileHash` | `action_file_sha256` | Medium | Assumes SHA-256 unless source indicates otherwise |
| `sha256` | `action_file_sha256` | High | SHA-256 file indicator |
| `sha1` | `action_file_sha1` | High | SHA-1 file indicator |
| `md5` | `action_file_md5` | High | MD5 file indicator |
| `RegistryKeyPath` | `action_registry_key_name` | High | Registry key path |
| `RegistryValue` | `action_registry_value_name` | Medium | Confirm value-name versus value-data |
| `RegistryValueData` | `action_registry_data` | Medium | Confirm value-name versus value-data |
| `DstIP` | `action_remote_ip` | High | Destination or remote IP |
| `DstPort` | `action_remote_port` | High | Destination or remote port |
| `DstHostName` | `action_external_hostname` | Medium | Depends on DNS/network telemetry |
| `Domain` | `action_external_hostname` | Medium | Confirm DNS, URL host, or indicator domain |
| `Url` | `action_url` | Medium | Depends on endpoint/browser/NGFW data source |
| `SrcIP` | `actor_remote_ip` | Low | Endpoint process events often do not expose this directly |
| `UserName` | `actor_effective_username` | High | Effective actor user |
| `User` | `actor_effective_username` | High | Effective actor user |
| `EndpointName` | `agent_hostname` | High | Cortex agent hostname |
| `HostName` | `agent_hostname` | High | Cortex agent hostname |
| `SiteName` | `agent_installation_package` | Low | S1 site scoping usually maps better to tenant/group/tag controls |
| `OS` | `agent_os_type` | High | Endpoint operating system |

## 12. Event Type Mapping

| SentinelOne EventType value | Cortex value |
|---|---|
| `Process Creation` | `ENUM.PROCESS` |
| `Process` | `ENUM.PROCESS` |
| `Process Start` | `ENUM.PROCESS` |
| `File Creation` | `ENUM.FILE` |
| `File Modification` | `ENUM.FILE` |
| `File Deletion` | `ENUM.FILE` |
| `File` | `ENUM.FILE` |
| `Registry` | `ENUM.REGISTRY` |
| `Registry Value Modified` | `ENUM.REGISTRY` |
| `Network Connection` | `ENUM.NETWORK` |
| `Network` | `ENUM.NETWORK` |
| `DNS` | `ENUM.NETWORK` |
| `Module` | `ENUM.LOAD_IMAGE` |
| `Module Load` | `ENUM.LOAD_IMAGE` |

Unknown event types are preserved as `event_type <operator> <value>` and flagged for manual review.

## 13. Operator Conversion

| SentinelOne-style operator | Cortex draft output | Notes |
|---|---|---|
| `=` | `field = value` | Field and event values are normalized first |
| `!=` | `field != value` | Field and event values are normalized first |
| `>` | `field > value` | Numeric/date semantics must be validated |
| `<` | `field < value` | Numeric/date semantics must be validated |
| `>=` | `field >= value` | Numeric/date semantics must be validated |
| `<=` | `field <= value` | Numeric/date semantics must be validated |
| `contains` | `field contains value` | Used for command line, path, registry, and string matching |
| `not contains` | `not (field contains value)` | Parenthesized to protect boolean logic |
| `in (...)` | `field in (...)` | List values are normalized and quoted |
| `not in (...)` | `field not in (...)` | List values are normalized and quoted |
| `starts with` | `field startswith value` | Adds an info flag for syntax verification |
| `ends with` | `field endswith value` | Adds an info flag for syntax verification |
| `matches` | `field ~= value` | Adds a medium regex-performance warning |
| `regexp` | `field ~= value` | Adds a medium regex-performance warning |
| `is not empty` | `(field != null and field != "")` | Converts SentinelOne emptiness test |
| `is empty` | `(field = null or field = "")` | Converts SentinelOne emptiness test |

Boolean operators are normalized:

| Source | Output |
|---|---|
| `AND` | `and` |
| `OR` | `or` |
| `NOT` | `not` |

## 14. Value Normalization

The converter normalizes values as follows:

- Existing quoted strings are preserved and escaped.
- Bare strings are quoted.
- Numeric values remain unquoted.
- `true`, `false`, and `null` remain unquoted.
- `ENUM.*` values remain unquoted.
- Parenthesized lists are parsed into quoted, comma-separated lists.
- Backslashes and quotation marks inside strings are escaped.

## 15. Draft XQL Template

For STAR and hunt items, generated XQL uses this template:

```xql
dataset = xdr_data
| filter <translated filter>
| fields <selected fields>
| sort desc _time
| limit 100
```

Default selected fields:

```text
_time, agent_hostname, actor_effective_username
```

Investigation fields added when useful:

```text
actor_process_image_name,
actor_process_command_line,
action_process_image_name,
action_process_image_command_line,
action_file_path,
action_remote_ip,
action_remote_port,
event_type
```

Fields explicitly referenced by the source rule are also added to the output field list.

## 16. BIOC or Rule-Builder Notes

For every extracted condition, the utility generates a human-readable note:

```text
<cortex field> <friendly operator> <value>
```

If the item is not a BIOC candidate, the notes are still included as the endpoint-behavior portion of a hunt or correlation rule.

If no conditions are extracted:

- Correlation candidate:

```text
No simple BIOC conditions were extracted. Build this as scheduled XQL or a correlation rule.
```

- Other candidate:

```text
No simple BIOC conditions were extracted. Confirm the STAR export includes structured rule logic.
```

## 17. Manual Review Flags

The utility adds manual-review flags for logic that should not be blindly converted.

| Signal | Level | Review reason |
|---|---|---|
| `within <number>` | High | Temporal sequence logic needs scheduled correlation, lookback, and suppression |
| `followed by` | High | Sequence logic needs correlation design |
| `after` | High | Sequence logic needs correlation design |
| `before` | High | Sequence logic needs correlation design |
| `count` | High | Threshold logic needs aggregation and alert-volume testing |
| `threshold` | High | Threshold logic needs aggregation and alert-volume testing |
| `group by` | High | Aggregation needs explicit grouping and testing |
| `having` | High | Aggregation needs explicit threshold logic |
| `join` | Medium | Cross-source logic depends on Cortex dataset availability |
| `identity` | Medium | Requires identity dataset/integration validation |
| `firewall` | Medium | Requires firewall dataset/integration validation |
| `cloud` | Medium | Requires cloud dataset/integration validation |
| `vpn` | Medium | Requires VPN dataset/integration validation |
| `email` | Medium | Requires email dataset/integration validation |
| `siem` | Medium | Requires SIEM/data ingestion validation |
| `case sensitive` | Medium | Cortex string matching behavior must be validated |
| `case-sensitive` | Medium | Cortex string matching behavior must be validated |
| `*` | Info | Wildcard syntax may need conversion |
| `?` | Info | Wildcard syntax may need conversion |
| `automated response:` | High | Rebuild in Cortex playbooks or alert actions after pilot |

## 18. Automated Response Handling

SentinelOne automated response text is intentionally removed from generated XQL and converted into a high-risk manual-review flag.

Reason:

- Detection logic and response action are separate migration concerns.
- A SentinelOne response action may not map one-to-one to Cortex.
- Quarantine/isolation/termination actions need staged pilot testing.

Response signals:

```text
quarantine, kill, isolate, remediate, rollback, response, terminate, disable network
```

## 19. IOC Extraction

IOC items use a dedicated extraction path.

Recognized values:

| Indicator type | Pattern | Cortex field |
|---|---|---|
| SHA-256 | 64 hex characters | `action_file_sha256` |
| SHA-1 | 40 hex characters | `action_file_sha1` |
| MD5 | 32 hex characters | `action_file_md5` |
| IPv4 | IPv4 address pattern | `action_remote_ip` |
| Domain | `name.tld` style pattern | `action_external_hostname` |

IOC draft XQL template:

```xql
dataset = xdr_data
| filter <indicator filters>
| fields _time, agent_hostname, action_file_name, action_file_sha256, action_remote_ip, action_external_hostname
| sort desc _time
| limit 100
```

IOC migration notes:

```text
Load active indicators through Cortex IOC or threat intel workflow.
Add source, confidence, owner, and expiration.
Deduplicate against existing blocklists before enabling alerting.
```

If no normalized IOC is detected, the utility adds:

```text
No normalized indicator value was detected. Import may need explicit hash, IP,
domain, or URL columns.
```

## 20. Exclusion Conversion

Exclusions are not converted directly into Cortex allow rules.

The utility generates an exception-review output instead:

```text
Decision: migrate only if business owner, endpoint scope, expiration, and
compensating controls are approved.
Recommended Cortex destination: alert exclusion, prevention exception, agent
policy exception, or retire.
```

Broad exclusion signals:

```text
C:\*
C:\Users\*
ProgramData\*
AppData\*
Temp\*
paths ending in \*
entire
recursive
all files
```

High-risk exclusion signals:

```text
performance, interoperability, disable
```

Exception review checklist:

```text
Identify whether the SentinelOne rule suppressed alerts, prevention, monitoring,
or performance scanning.
Replace broad path rules with signer/hash/path/process scoped controls where possible.
Add owner, justification, expiration, and pilot endpoints before production rollout.
```

## 21. Exported Matrix Fields

CSV export includes:

```text
name,
type,
severity,
scope,
owner,
status,
cortexTarget,
risk,
confidence,
complexity,
recommendedWork,
xql,
biocConditions,
fieldMappings,
issues,
logic
```

JSON export includes the full enriched item object, including:

```text
target,
confidence,
risk,
recommendedWork,
nextChecks,
translation.sourceFormat,
translation.extractedFrom,
translation.normalizedStar,
translation.xql,
translation.targetUse,
translation.fieldMap,
translation.biocConditions,
translation.issues,
translation.complexity,
translation.responseAction
```

## 22. Known Limitations

The utility does not yet:

- Query the Cortex schema from a tenant.
- Query SentinelOne APIs directly.
- Guarantee official Cortex XQL syntax for every operator.
- Convert every possible STAR export field.
- Preserve nested boolean precedence beyond the text-level rewrite.
- Generate production-ready correlation schedules.
- Generate Cortex playbooks or automated response actions.
- Distinguish all file source/target/result semantics.
- Determine whether a destination tenant has the needed datasets.
- Deduplicate against existing Cortex rules.

## 23. Required Human Validation

Before production enablement, validate:

1. Cortex dataset and field availability.
2. Event type enum correctness.
3. Boolean precedence.
4. Alert volume over 30-90 days.
5. False-positive rate.
6. Endpoint performance impact.
7. SOC routing and severity.
8. Suppression/cooldown behavior.
9. Automated response action safety.
10. Exception owner, scope, expiration, and compensating controls.

