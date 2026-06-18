const storageKey = "s1-cortex-cutover-items-v2";
const legacyStorageKey = "s1-cortex-cutover-items-v1";

const fieldMappings = {
  eventtype: {
    cortex: "event_type",
    label: "Event type",
    confidence: "High",
    notes: "Mapped to Cortex XDR event_type enum when the SentinelOne event value is recognized."
  },
  tgtprocname: {
    cortex: "action_process_image_name",
    label: "Target process name",
    confidence: "High",
    notes: "The process being created or acted on."
  },
  tgtprocimagename: {
    cortex: "action_process_image_name",
    label: "Target process name",
    confidence: "High",
    notes: "The process being created or acted on."
  },
  tgtproccmdline: {
    cortex: "action_process_image_command_line",
    label: "Target process command line",
    confidence: "High",
    notes: "Command-line matching usually carries over cleanly to Cortex XQL or BIOC conditions."
  },
  tgtproccmdlinehash: {
    cortex: "action_process_image_command_line",
    label: "Target process command line hash",
    confidence: "Low",
    notes: "Hash-derived command-line fields should be checked against tenant schema before use."
  },
  tgtprocpath: {
    cortex: "action_process_image_path",
    label: "Target process path",
    confidence: "High",
    notes: "Path matching should be normalized for Windows slashes and case."
  },
  srcprocname: {
    cortex: "actor_process_image_name",
    label: "Source process name",
    confidence: "High",
    notes: "The parent or actor process."
  },
  srcprocimagename: {
    cortex: "actor_process_image_name",
    label: "Source process name",
    confidence: "High",
    notes: "The parent or actor process."
  },
  srcproccmdline: {
    cortex: "actor_process_command_line",
    label: "Source process command line",
    confidence: "High",
    notes: "The parent or actor process command line."
  },
  srcprocpath: {
    cortex: "actor_process_image_path",
    label: "Source process path",
    confidence: "High",
    notes: "The parent or actor process path."
  },
  filepath: {
    cortex: "action_file_path",
    label: "File path",
    confidence: "Medium",
    notes: "Confirm whether the SentinelOne field referred to source, target, or resulting file path."
  },
  filefullpath: {
    cortex: "action_file_path",
    label: "File path",
    confidence: "Medium",
    notes: "Confirm whether the SentinelOne field referred to source, target, or resulting file path."
  },
  tgtfilepath: {
    cortex: "action_file_path",
    label: "Target file path",
    confidence: "High",
    notes: "The file being created, modified, deleted, or read."
  },
  srcfilepath: {
    cortex: "actor_process_image_path",
    label: "Source file path",
    confidence: "Medium",
    notes: "Often maps to the actor process image path, but confirm the original event family."
  },
  filehash: {
    cortex: "action_file_sha256",
    label: "File hash",
    confidence: "Medium",
    notes: "Assumes SHA-256. Change to action_file_sha1 or action_file_md5 if the source hash differs."
  },
  sha256: {
    cortex: "action_file_sha256",
    label: "SHA-256",
    confidence: "High",
    notes: "Use for file indicator matching."
  },
  sha1: {
    cortex: "action_file_sha1",
    label: "SHA-1",
    confidence: "High",
    notes: "Use only when SHA-256 is unavailable."
  },
  md5: {
    cortex: "action_file_md5",
    label: "MD5",
    confidence: "High",
    notes: "Use only for legacy indicators."
  },
  registrykeypath: {
    cortex: "action_registry_key_name",
    label: "Registry key path",
    confidence: "High",
    notes: "Registry path matching should be tested on Windows telemetry from the tenant."
  },
  registryvalue: {
    cortex: "action_registry_value_name",
    label: "Registry value",
    confidence: "Medium",
    notes: "Confirm value-name versus value-data requirements before production use."
  },
  registryvaluedata: {
    cortex: "action_registry_data",
    label: "Registry value data",
    confidence: "Medium",
    notes: "Confirm value-name versus value-data requirements before production use."
  },
  dstip: {
    cortex: "action_remote_ip",
    label: "Destination IP",
    confidence: "High",
    notes: "Remote endpoint IP for network events."
  },
  dstport: {
    cortex: "action_remote_port",
    label: "Destination port",
    confidence: "High",
    notes: "Remote endpoint port for network events."
  },
  dsthostname: {
    cortex: "action_external_hostname",
    label: "Destination hostname",
    confidence: "Medium",
    notes: "Hostname availability depends on DNS and network telemetry shape."
  },
  domain: {
    cortex: "action_external_hostname",
    label: "Domain",
    confidence: "Medium",
    notes: "Validate whether the source rule used DNS request, URL host, or indicator domain."
  },
  url: {
    cortex: "action_url",
    label: "URL",
    confidence: "Medium",
    notes: "URL telemetry may come from endpoint, browser, NGFW, or another integrated source."
  },
  srcip: {
    cortex: "actor_remote_ip",
    label: "Source IP",
    confidence: "Low",
    notes: "Endpoint process events usually do not expose a source IP in the same way network devices do."
  },
  username: {
    cortex: "actor_effective_username",
    label: "User name",
    confidence: "High",
    notes: "Effective user associated with the actor process."
  },
  user: {
    cortex: "actor_effective_username",
    label: "User name",
    confidence: "High",
    notes: "Effective user associated with the actor process."
  },
  endpointname: {
    cortex: "agent_hostname",
    label: "Endpoint name",
    confidence: "High",
    notes: "Agent hostname in Cortex XDR."
  },
  hostname: {
    cortex: "agent_hostname",
    label: "Endpoint name",
    confidence: "High",
    notes: "Agent hostname in Cortex XDR."
  },
  sitename: {
    cortex: "agent_installation_package",
    label: "Site name",
    confidence: "Low",
    notes: "SentinelOne site scoping usually becomes tenant, group, tag, or deployment-scope logic instead of a direct field."
  },
  os: {
    cortex: "agent_os_type",
    label: "Operating system",
    confidence: "High",
    notes: "Use to split Windows, macOS, and Linux logic where needed."
  },
  objecttype: {
    cortex: "event_type",
    label: "Object type",
    confidence: "High",
    notes: "Semantic mapping: SentinelOne object type values such as Process, File, Registry, Network, and Module become Cortex event_type enums."
  },
  objectname: {
    cortex: "action_process_image_name",
    label: "Object name",
    confidence: "Medium",
    notes: "Generic S1 object name. Usually maps to action process/file/registry/network fields depending on ObjectType; verify with the surrounding rule context."
  },
  objectpath: {
    cortex: "action_file_path",
    label: "Object path",
    confidence: "Medium",
    notes: "Generic S1 object path. Confirm whether the object is a process image, file, registry key, or another entity before production use."
  },
  objecthash: {
    cortex: "action_file_sha256",
    label: "Object hash",
    confidence: "Medium",
    notes: "Generic S1 object hash. Assumes SHA-256 unless the source value or export identifies MD5/SHA-1."
  },
  objectsha256: {
    cortex: "action_file_sha256",
    label: "Object SHA-256",
    confidence: "High",
    notes: "SHA-256 hash for a file or process object."
  },
  objectsha1: {
    cortex: "action_file_sha1",
    label: "Object SHA-1",
    confidence: "High",
    notes: "SHA-1 hash for a file or process object."
  },
  objectmd5: {
    cortex: "action_file_md5",
    label: "Object MD5",
    confidence: "High",
    notes: "MD5 hash for a file or process object."
  },
  processname: {
    cortex: "action_process_image_name",
    label: "Process name",
    confidence: "High",
    notes: "Generic process name mapped to the action process."
  },
  processcmdline: {
    cortex: "action_process_image_command_line",
    label: "Process command line",
    confidence: "High",
    notes: "Generic process command line mapped to the action process command line."
  },
  processcommandline: {
    cortex: "action_process_image_command_line",
    label: "Process command line",
    confidence: "High",
    notes: "Generic process command line mapped to the action process command line."
  },
  processpath: {
    cortex: "action_process_image_path",
    label: "Process path",
    confidence: "High",
    notes: "Generic process path mapped to the action process image path."
  },
  parentprocessname: {
    cortex: "actor_process_image_name",
    label: "Parent process name",
    confidence: "High",
    notes: "Parent process name mapped to the actor process."
  },
  parentprocesscmdline: {
    cortex: "actor_process_command_line",
    label: "Parent process command line",
    confidence: "High",
    notes: "Parent process command line mapped to actor process command line."
  },
  parentprocesspath: {
    cortex: "actor_process_image_path",
    label: "Parent process path",
    confidence: "High",
    notes: "Parent process path mapped to actor process image path."
  },
  filename: {
    cortex: "action_file_name",
    label: "File name",
    confidence: "High",
    notes: "File name for file-object conditions."
  },
  fileextension: {
    cortex: "action_file_extension",
    label: "File extension",
    confidence: "Medium",
    notes: "File extension availability should be validated against tenant telemetry."
  },
  ipaddress: {
    cortex: "action_remote_ip",
    label: "IP address",
    confidence: "Medium",
    notes: "Generic IP mapped to remote IP; validate directionality before production use."
  },
  destinationip: {
    cortex: "action_remote_ip",
    label: "Destination IP",
    confidence: "High",
    notes: "Destination IP mapped to remote IP."
  },
  destinationport: {
    cortex: "action_remote_port",
    label: "Destination port",
    confidence: "High",
    notes: "Destination port mapped to remote port."
  },
  remoteip: {
    cortex: "action_remote_ip",
    label: "Remote IP",
    confidence: "High",
    notes: "Remote IP for network activity."
  },
  remoteport: {
    cortex: "action_remote_port",
    label: "Remote port",
    confidence: "High",
    notes: "Remote port for network activity."
  },
  dnsrequest: {
    cortex: "action_external_hostname",
    label: "DNS request",
    confidence: "Medium",
    notes: "DNS request mapped to external hostname; validate DNS dataset availability."
  },
  dnsquery: {
    cortex: "action_external_hostname",
    label: "DNS query",
    confidence: "Medium",
    notes: "DNS query mapped to external hostname; validate DNS dataset availability."
  },
  accountname: {
    cortex: "actor_effective_username",
    label: "Account name",
    confidence: "High",
    notes: "Account or user context mapped to actor effective username."
  },
  userprincipalname: {
    cortex: "actor_effective_username",
    label: "User principal name",
    confidence: "Medium",
    notes: "UPN mapped to actor effective username; validate exact identity field in tenant telemetry."
  },
  agentuuid: {
    cortex: "agent_id",
    label: "Agent UUID",
    confidence: "Medium",
    notes: "Agent identifier mapped to Cortex agent_id where available."
  },
  groupname: {
    cortex: "agent_installation_package",
    label: "Group name",
    confidence: "Low",
    notes: "S1 group scoping usually becomes endpoint group, tag, or deployment scoping rather than a direct event field."
  }
};

const eventTypeMappings = {
  "process creation": "ENUM.PROCESS",
  "process": "ENUM.PROCESS",
  "process start": "ENUM.PROCESS",
  "file creation": "ENUM.FILE",
  "file modification": "ENUM.FILE",
  "file deletion": "ENUM.FILE",
  "file": "ENUM.FILE",
  "registry": "ENUM.REGISTRY",
  "registry value modified": "ENUM.REGISTRY",
  "network connection": "ENUM.NETWORK",
  "network": "ENUM.NETWORK",
  "dns": "ENUM.NETWORK",
  "module": "ENUM.LOAD_IMAGE",
  "module load": "ENUM.LOAD_IMAGE"
};

const mitreRules = [
  {
    id: "T1059.001",
    technique: "Command and Scripting Interpreter",
    subtechnique: "PowerShell",
    tactics: ["Execution"],
    confidence: "High",
    reference: "https://attack.mitre.org/techniques/T1059/001/",
    match: /\bpowershell(?:\.exe)?\b|\bpwsh(?:\.exe)?\b|-encodedcommand|\b-enc\b|invoke-expression|invoke-webrequest/i,
    rationale: "Rule context references PowerShell, pwsh, encoded commands, or PowerShell download/execution cmdlets."
  },
  {
    id: "T1059.003",
    technique: "Command and Scripting Interpreter",
    subtechnique: "Windows Command Shell",
    tactics: ["Execution"],
    confidence: "High",
    reference: "https://attack.mitre.org/techniques/T1059/003/",
    match: /\bcmd(?:\.exe)?\b|\/c\s|\/k\s|\.bat\b|\.cmd\b/i,
    rationale: "Rule context references Windows command shell execution."
  },
  {
    id: "T1059.004",
    technique: "Command and Scripting Interpreter",
    subtechnique: "Unix Shell",
    tactics: ["Execution"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1059/004/",
    match: /\b(?:bash|sh|zsh|ksh|dash)(?:\s|-c|$)|\/bin\/(?:bash|sh|zsh|ksh|dash)\b/i,
    rationale: "Rule context references Unix shell execution."
  },
  {
    id: "T1059.005",
    technique: "Command and Scripting Interpreter",
    subtechnique: "Visual Basic",
    tactics: ["Execution"],
    confidence: "High",
    reference: "https://attack.mitre.org/techniques/T1059/005/",
    match: /\bwscript(?:\.exe)?\b|\bcscript(?:\.exe)?\b|\.vbs\b|\.vbe\b/i,
    rationale: "Rule context references Windows Script Host or Visual Basic script execution."
  },
  {
    id: "T1059.007",
    technique: "Command and Scripting Interpreter",
    subtechnique: "JavaScript",
    tactics: ["Execution"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1059/007/",
    match: /\.js\b|\.jse\b|\bnode(?:\.exe)?\b/i,
    rationale: "Rule context references JavaScript or Node-based script execution."
  },
  {
    id: "T1218.005",
    technique: "System Binary Proxy Execution",
    subtechnique: "Mshta",
    tactics: ["Defense Evasion"],
    confidence: "High",
    reference: "https://attack.mitre.org/techniques/T1218/005/",
    match: /\bmshta(?:\.exe)?\b/i,
    rationale: "Rule context references mshta proxy execution."
  },
  {
    id: "T1218.010",
    technique: "System Binary Proxy Execution",
    subtechnique: "Regsvr32",
    tactics: ["Defense Evasion"],
    confidence: "High",
    reference: "https://attack.mitre.org/techniques/T1218/010/",
    match: /\bregsvr32(?:\.exe)?\b|\bscrobj\.dll\b|\b\/i:https?:\/\//i,
    rationale: "Rule context references regsvr32 or scriptlet-based proxy execution."
  },
  {
    id: "T1218.011",
    technique: "System Binary Proxy Execution",
    subtechnique: "Rundll32",
    tactics: ["Defense Evasion"],
    confidence: "High",
    reference: "https://attack.mitre.org/techniques/T1218/011/",
    match: /\brundll32(?:\.exe)?\b/i,
    rationale: "Rule context references rundll32 proxy execution."
  },
  {
    id: "T1105",
    technique: "Ingress Tool Transfer",
    subtechnique: "",
    tactics: ["Command and Control"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1105/",
    match: /\bcertutil(?:\.exe)?\b|urlcache|bitsadmin|invoke-webrequest|iwr\s|curl(?:\.exe)?\b|wget(?:\.exe)?\b|download|http:\/\/|https:\/\//i,
    rationale: "Rule context suggests tools or commands used to download or transfer payloads into the environment."
  },
  {
    id: "T1027",
    technique: "Obfuscated Files or Information",
    subtechnique: "",
    tactics: ["Defense Evasion"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1027/",
    match: /encodedcommand|\b-enc\b|base64|frombase64string|obfuscat|xor|compress|gzip/i,
    rationale: "Rule context references encoded, compressed, or obfuscated content."
  },
  {
    id: "T1547.001",
    technique: "Boot or Logon Autostart Execution",
    subtechnique: "Registry Run Keys / Startup Folder",
    tactics: ["Persistence", "Privilege Escalation"],
    confidence: "High",
    reference: "https://attack.mitre.org/techniques/T1547/001/",
    match: /\\currentversion\\run\b|\\currentversion\\runonce\b|startup folder|\\startup\\|registrykeypath.*\\run/i,
    rationale: "Rule context references Run/RunOnce keys or Startup folder persistence."
  },
  {
    id: "T1053.005",
    technique: "Scheduled Task/Job",
    subtechnique: "Scheduled Task",
    tactics: ["Execution", "Persistence", "Privilege Escalation"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1053/005/",
    match: /\bschtasks(?:\.exe)?\b|scheduled task|task scheduler|\\tasks\\/i,
    rationale: "Rule context references Windows scheduled task creation or execution."
  },
  {
    id: "T1047",
    technique: "Windows Management Instrumentation",
    subtechnique: "",
    tactics: ["Execution"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1047/",
    match: /\bwmic(?:\.exe)?\b|wmi-|win32_process|wmiprvse(?:\.exe)?\b|__eventfilter|commandlineeventconsumer/i,
    rationale: "Rule context references WMI execution or WMI persistence components."
  },
  {
    id: "T1003",
    technique: "OS Credential Dumping",
    subtechnique: "",
    tactics: ["Credential Access"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1003/",
    match: /lsass|mimikatz|sekurlsa|procdump|comsvcs\.dll|minidump|credential dump|sam hive|ntds\.dit/i,
    rationale: "Rule context references credential dumping tools, targets, or artifacts."
  },
  {
    id: "T1567.002",
    technique: "Exfiltration Over Web Service",
    subtechnique: "Exfiltration to Cloud Storage",
    tactics: ["Exfiltration"],
    confidence: "High",
    reference: "https://attack.mitre.org/techniques/T1567/002/",
    match: /\brclone(?:\.exe)?\b|megasync|mega\.nz|dropbox|google drive|onedrive|box\.com|s3:\/\/|aws s3/i,
    rationale: "Rule context references cloud-storage tooling or destinations commonly used for exfiltration."
  },
  {
    id: "T1041",
    technique: "Exfiltration Over C2 Channel",
    subtechnique: "",
    tactics: ["Exfiltration"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1041/",
    match: /exfil|upload|dstip is not empty|action_remote_ip|large outbound|outbound transfer|send files/i,
    rationale: "Rule context suggests outbound transfer or exfiltration behavior."
  },
  {
    id: "T1071.001",
    technique: "Application Layer Protocol",
    subtechnique: "Web Protocols",
    tactics: ["Command and Control"],
    confidence: "Low",
    reference: "https://attack.mitre.org/techniques/T1071/001/",
    match: /http:\/\/|https:\/\/|user-agent|websocket|post\s+http|curl(?:\.exe)?\b/i,
    rationale: "Rule context references web protocols. This may be C2, download, or benign web activity and needs validation."
  },
  {
    id: "T1486",
    technique: "Data Encrypted for Impact",
    subtechnique: "",
    tactics: ["Impact"],
    confidence: "Medium",
    reference: "https://attack.mitre.org/techniques/T1486/",
    match: /ransom|encrypt files|encrypted extension|vssadmin.*delete|shadow.*copy.*delete|bcdedit.*recoveryenabled/i,
    rationale: "Rule context references ransomware-style encryption or recovery disruption activity."
  }
];

const s1qlOperatorSupport = {
  "1.0": new Set(["=", "!=", ">", "<", ">=", "<=", "contains", "not contains", "in", "not in", "matches", "regexp", "is empty", "is not empty"]),
  "2.0": new Set(["=", "!=", ">", "<", ">=", "<=", "contains", "not contains", "in", "not in", "matches", "regexp", "starts with", "ends with", "is empty", "is not empty"])
};

const s1qlTwoOnlyOperators = new Set(["starts with", "ends with"]);

const s1qlKnownFieldNames = new Set([
  ...Object.keys(fieldMappings),
  "eventtype",
  "tgtprocname",
  "tgtproccmdline",
  "tgtprocpath",
  "srcprocname",
  "srcproccmdline",
  "registrykeypath",
  "dstip",
  "dstport",
  "username",
  "endpointname",
  "hostname",
  "sha256",
  "sha1",
  "md5"
]);

const fieldAliases = {
  object: "objectname",
  objecttype: "objecttype",
  objecttypename: "objecttype",
  objectname: "objectname",
  objectpath: "objectpath",
  objectfullpath: "objectpath",
  objecthash: "objecthash",
  objectsha256: "objectsha256",
  objectsha1: "objectsha1",
  objectmd5: "objectmd5",
  targetprocessname: "tgtprocname",
  targetprocesscmdline: "tgtproccmdline",
  targetprocesscommandline: "tgtproccmdline",
  targetprocesspath: "tgtprocpath",
  parentprocessname: "parentprocessname",
  parentprocesscmdline: "parentprocesscmdline",
  parentprocesscommandline: "parentprocesscmdline",
  parentprocesspath: "parentprocesspath",
  sourceprocessname: "srcprocname",
  sourceprocesscmdline: "srcproccmdline",
  sourceprocesspath: "srcprocpath",
  processcommandline: "processcommandline",
  commandline: "processcmdline",
  cmdline: "processcmdline",
  imagepath: "processpath",
  imagepathname: "processpath",
  filepathname: "filepath",
  fullfilepath: "filefullpath",
  destinationip: "destinationip",
  destinationport: "destinationport",
  dstaddress: "dstip",
  dstipaddress: "dstip",
  dstportnumber: "dstport",
  remoteaddress: "remoteip",
  remoteipaddress: "remoteip",
  remoteportnumber: "remoteport",
  domainname: "domain",
  hostname: "hostname",
  computername: "hostname",
  endpoint: "endpointname",
  endpointname: "endpointname",
  username: "username",
  accountname: "accountname",
  userprincipalname: "userprincipalname"
};

const supplementalFieldMappings = {
  eventid: ["event_id", "Event ID", "Medium", "Event identifier. Validate Cortex availability for the source dataset."],
  eventname: ["event_sub_type", "Event name", "Medium", "Event name mapped to event subtype where available."],
  eventsubtype: ["event_sub_type", "Event subtype", "Medium", "Event subtype mapped to Cortex event_sub_type."],
  eventtime: ["_time", "Event time", "High", "Event timestamp mapped to Cortex _time."],
  timestamp: ["_time", "Timestamp", "High", "Event timestamp mapped to Cortex _time."],
  createdat: ["_time", "Created at", "Medium", "Creation timestamp mapped to _time for review; validate exact temporal semantics."],
  updatedat: ["_time", "Updated at", "Low", "Updated timestamp is not always equivalent to event time; validate before use."],

  agentid: ["agent_id", "Agent ID", "High", "Endpoint agent identifier."],
  agentuuid: ["agent_id", "Agent UUID", "High", "Endpoint agent UUID mapped to Cortex agent_id."],
  agentversion: ["agent_version", "Agent version", "Medium", "Agent version field; validate tenant schema."],
  agentos: ["agent_os_type", "Agent OS", "High", "Agent operating system."],
  agentostype: ["agent_os_type", "Agent OS type", "High", "Agent operating system type."],
  agenthostname: ["agent_hostname", "Agent hostname", "High", "Agent hostname."],
  endpointid: ["agent_id", "Endpoint ID", "Medium", "Endpoint identifier mapped to agent_id where available."],
  endpointtype: ["agent_os_type", "Endpoint type", "Low", "Endpoint type usually informs scope rather than detection logic; validate mapping."],
  endpointos: ["agent_os_type", "Endpoint OS", "High", "Endpoint operating system type."],
  computername: ["agent_hostname", "Computer name", "High", "Computer name mapped to agent hostname."],
  machineid: ["agent_id", "Machine ID", "Medium", "Machine identifier mapped to agent_id where available."],
  siteid: ["agent_installation_package", "Site ID", "Low", "SentinelOne site identity usually maps to scope/tags rather than a direct event field."],
  site: ["agent_installation_package", "Site", "Low", "SentinelOne site usually maps to scope/tags rather than a direct event field."],
  groupid: ["agent_installation_package", "Group ID", "Low", "SentinelOne group usually maps to endpoint scope/tags rather than a direct event field."],

  pid: ["action_process_instance_id", "PID", "Medium", "Process ID mapped to action process instance when available."],
  processid: ["action_process_instance_id", "Process ID", "Medium", "Process ID mapped to action process instance when available."],
  tgtprocpid: ["action_process_instance_id", "Target process PID", "Medium", "Target process ID."],
  srcprocpid: ["actor_process_instance_id", "Source process PID", "Medium", "Source or parent process ID."],
  parentpid: ["actor_process_instance_id", "Parent PID", "Medium", "Parent process ID mapped to actor process instance."],
  parentprocessid: ["actor_process_instance_id", "Parent process ID", "Medium", "Parent process ID mapped to actor process instance."],
  processuser: ["actor_effective_username", "Process user", "Medium", "Process user mapped to actor effective username."],
  processintegritylevel: ["action_process_integrity_level", "Process integrity level", "Medium", "Windows integrity level; validate field availability."],
  integritylevel: ["action_process_integrity_level", "Integrity level", "Medium", "Windows integrity level; validate field availability."],
  signer: ["action_process_signature_vendor", "Signer", "Medium", "Signer/vendor mapped to process signature vendor where available."],
  signeridentity: ["action_process_signature_vendor", "Signer identity", "Medium", "Signer identity mapped to process signature vendor where available."],
  signedstatus: ["action_process_signature_status", "Signed status", "Medium", "Signature status mapped to process signature status where available."],
  signaturestatus: ["action_process_signature_status", "Signature status", "Medium", "Signature status mapped to process signature status."],
  publisher: ["action_process_signature_vendor", "Publisher", "Medium", "Publisher mapped to signature vendor where available."],
  certificate: ["action_process_signature_vendor", "Certificate", "Low", "Certificate matching may need signer, thumbprint, or chain-specific fields."],

  filesize: ["action_file_size", "File size", "Medium", "File size mapped to action file size where available."],
  filetype: ["action_file_type", "File type", "Medium", "File type mapped to action file type where available."],
  oldfilepath: ["action_file_path", "Old file path", "Low", "Rename/move events may need old/new path-specific fields; validate event family."],
  newfilepath: ["action_file_path", "New file path", "Low", "Rename/move events may need old/new path-specific fields; validate event family."],
  oldfilename: ["action_file_name", "Old file name", "Low", "Rename events may need old/new name-specific fields; validate event family."],
  newfilename: ["action_file_name", "New file name", "Low", "Rename events may need old/new name-specific fields; validate event family."],

  registrykey: ["action_registry_key_name", "Registry key", "High", "Registry key mapped to Cortex registry key name."],
  registrypath: ["action_registry_key_name", "Registry path", "High", "Registry path mapped to Cortex registry key name."],
  registrykeyname: ["action_registry_key_name", "Registry key name", "High", "Registry key name."],
  registryvaluename: ["action_registry_value_name", "Registry value name", "High", "Registry value name."],
  registrydata: ["action_registry_data", "Registry data", "Medium", "Registry value data."],
  registryvaluepath: ["action_registry_key_name", "Registry value path", "Medium", "Registry value path mapped to key name; verify key/value split."],

  srcipaddress: ["actor_remote_ip", "Source IP address", "Medium", "Source IP mapped to actor remote IP; validate source directionality."],
  sourceipaddress: ["actor_remote_ip", "Source IP address", "Medium", "Source IP mapped to actor remote IP; validate source directionality."],
  sourceip: ["actor_remote_ip", "Source IP", "Medium", "Source IP mapped to actor remote IP; validate source directionality."],
  sourceport: ["actor_remote_port", "Source port", "Medium", "Source port mapped to actor remote port; validate source directionality."],
  dsthostname: ["action_external_hostname", "Destination hostname", "Medium", "Destination hostname."],
  destinationhostname: ["action_external_hostname", "Destination hostname", "Medium", "Destination hostname."],
  remotehostname: ["action_external_hostname", "Remote hostname", "Medium", "Remote hostname."],
  urlhost: ["action_external_hostname", "URL host", "Medium", "URL host mapped to external hostname."],
  requesturl: ["action_url", "Request URL", "Medium", "Request URL mapped to action_url where available."],
  targeturl: ["action_url", "Target URL", "Medium", "Target URL mapped to action_url where available."],
  dnsresponse: ["action_remote_ip", "DNS response", "Low", "DNS response may require resolved-IP-specific fields; validate tenant schema."],
  protocol: ["action_network_protocol", "Protocol", "Medium", "Network protocol; validate field availability."],
  networkprotocol: ["action_network_protocol", "Network protocol", "Medium", "Network protocol; validate field availability."],

  loginuser: ["actor_effective_username", "Login user", "High", "Login user mapped to actor effective username."],
  osusername: ["actor_effective_username", "OS username", "High", "OS username mapped to actor effective username."],
  domainuser: ["actor_effective_username", "Domain user", "Medium", "Domain user mapped to actor effective username; validate domain handling."],
  userdomain: ["actor_effective_username", "User domain", "Low", "User domain may require a separate identity field; validate tenant schema."],

  threatname: ["causality_actor_process_image_name", "Threat name", "Low", "Threat name is detection metadata, not raw endpoint telemetry; validate Cortex alert dataset usage."],
  threatid: ["alert_id", "Threat ID", "Low", "Threat ID maps better to alert data than xdr_data endpoint telemetry."],
  analystverdict: ["event_sub_type", "Analyst verdict", "Low", "Verdict is metadata and may not exist in xdr_data."],
  confidencelevel: ["event_sub_type", "Confidence level", "Low", "Confidence level is detection metadata; validate destination dataset."],
  detectionname: ["event_sub_type", "Detection name", "Low", "Detection name is alert metadata, not raw endpoint telemetry."],
  rulename: ["event_sub_type", "Rule name", "Low", "Rule name is alert metadata, not raw endpoint telemetry."],
  ruleid: ["event_sub_type", "Rule ID", "Low", "Rule ID is alert metadata, not raw endpoint telemetry."],

  modulepath: ["action_module_path", "Module path", "Medium", "Loaded module path where available."],
  modulename: ["action_module_name", "Module name", "Medium", "Loaded module name where available."],
  modulesha256: ["action_module_sha256", "Module SHA-256", "Medium", "Loaded module SHA-256 where available."]
};

Object.entries(supplementalFieldMappings).forEach(([key, [cortex, label, confidence, notes]]) => {
  if (!fieldMappings[key]) fieldMappings[key] = { cortex, label, confidence, notes };
});

Object.assign(fieldAliases, {
  "event type": "eventtype",
  "event name": "eventname",
  "event subtype": "eventsubtype",
  "event time": "eventtime",
  "object type": "objecttype",
  "object name": "objectname",
  "object path": "objectpath",
  "object full path": "objectpath",
  "object hash": "objecthash",
  "object sha256": "objectsha256",
  "object sha1": "objectsha1",
  "object md5": "objectmd5",
  "process name": "processname",
  "process command line": "processcommandline",
  "process cmdline": "processcmdline",
  "process path": "processpath",
  "parent process name": "parentprocessname",
  "parent process command line": "parentprocesscmdline",
  "parent process path": "parentprocesspath",
  "file name": "filename",
  "file path": "filepath",
  "file full path": "filefullpath",
  "file extension": "fileextension",
  "file hash": "filehash",
  "registry key": "registrykey",
  "registry path": "registrypath",
  "registry key path": "registrykeypath",
  "registry value": "registryvalue",
  "registry value name": "registryvaluename",
  "registry value data": "registryvaluedata",
  "destination ip": "destinationip",
  "destination port": "destinationport",
  "destination hostname": "destinationhostname",
  "remote ip": "remoteip",
  "remote port": "remoteport",
  "remote hostname": "remotehostname",
  "source ip": "sourceip",
  "source port": "sourceport",
  "dns request": "dnsrequest",
  "dns query": "dnsquery",
  "dns response": "dnsresponse",
  "request url": "requesturl",
  "target url": "targeturl",
  "url host": "urlhost",
  "account name": "accountname",
  "user principal name": "userprincipalname",
  "login user": "loginuser",
  "os username": "osusername",
  "agent id": "agentid",
  "agent uuid": "agentuuid",
  "agent version": "agentversion",
  "agent hostname": "agenthostname",
  "endpoint id": "endpointid",
  "endpoint name": "endpointname",
  "computer name": "computername",
  "site name": "sitename",
  "group name": "groupname",
  "threat name": "threatname",
  "rule name": "rulename",
  "module name": "modulename",
  "module path": "modulepath"
});

const demoItems = [
  {
    id: makeId(),
    type: "star",
    name: "Suspicious PowerShell EncodedCommand",
    severity: "High",
    scope: "Workstations",
    owner: "Detection Engineering",
    status: "Needs validation",
    logic: 'EventType = "Process Creation" AND TgtProcCmdLine contains "-EncodedCommand" AND SrcProcName in ("powershell.exe","pwsh.exe")'
  },
  {
    id: makeId(),
    type: "star",
    name: "Rclone exfiltration candidate",
    severity: "Critical",
    scope: "All endpoints",
    owner: "Threat Hunting",
    status: "Ready for pilot",
    logic: 'EventType = "Process Creation" AND TgtProcName = "rclone.exe" AND TgtProcPath contains "\\\\Users\\\\" AND DstIP is not empty AND automated response: network quarantine'
  },
  {
    id: makeId(),
    type: "star",
    name: "Suspicious Run Key Persistence",
    severity: "High",
    scope: "Windows servers",
    owner: "Detection Engineering",
    status: "Needs validation",
    logic: 'EventType = "Registry" AND RegistryKeyPath contains "\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run" AND SrcProcName not in ("msiexec.exe","setup.exe")'
  },
  {
    id: makeId(),
    type: "hunt",
    name: "Multiple failed admin logons then success",
    severity: "Medium",
    scope: "Identity + endpoint",
    owner: "SOC",
    status: "Backlog",
    logic: "Count failed admin logons followed by a successful logon from the same source within 30 minutes"
  },
  {
    id: makeId(),
    type: "exclusion",
    name: "Build directory performance exclusion",
    severity: "Medium",
    scope: "Developer workstations",
    owner: "Endpoint Engineering",
    status: "Needs validation",
    logic: "Path exclusion: C:\\Builds\\*; mode: performance/interoperability; reason: compile latency"
  },
  {
    id: makeId(),
    type: "ioc",
    name: "Known bad file hash",
    severity: "High",
    scope: "All endpoints",
    owner: "IR",
    status: "Ready for pilot",
    logic: "sha256: 4f2c0b5d6c8d6a2f0d2b8a9d5e0b7f3c18a4c1d7b6e8a901d2c3b4a5f6071829"
  }
];

let items = loadItems();

const form = document.querySelector("#item-form");
const fields = {
  type: document.querySelector("#source-type"),
  s1qlVersion: document.querySelector("#s1ql-version"),
  severity: document.querySelector("#severity"),
  scope: document.querySelector("#scope"),
  owner: document.querySelector("#owner"),
  name: document.querySelector("#name"),
  logic: document.querySelector("#logic")
};
const filters = {
  source: document.querySelector("#filter-source"),
  target: document.querySelector("#filter-target"),
  status: document.querySelector("#filter-status"),
  search: document.querySelector("#search")
};
const summaryGrid = document.querySelector("#summary-grid");
const matrixBody = document.querySelector("#matrix-body");
const detailsPanel = document.querySelector("#details-panel");
const detailsTitle = document.querySelector("#details-title");
const detailsContent = document.querySelector("#details-content");
const xqlPreview = document.querySelector("#xql-preview");
const translationMeta = document.querySelector("#translation-meta");
const biocPreview = document.querySelector("#bioc-preview");
const mappingPreview = document.querySelector("#mapping-preview");
const issuesPreview = document.querySelector("#issues-preview");
const mitrePreview = document.querySelector("#mitre-preview");
const s1qlPreview = document.querySelector("#s1ql-preview");
const copyXqlButton = document.querySelector("#copy-xql");
const exportTranslationButton = document.querySelector("#export-translation");

function makeId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadItems() {
  try {
    const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
    return saved ? normalizeImported(JSON.parse(saved)) : [...demoItems];
  } catch {
    return [...demoItems];
  }
}

function saveItems() {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

function analyzeItem(item) {
  const extracted = extractRuleText(item.logic);
  const text = `${item.name} ${extracted.query} ${item.logic}`.toLowerCase();
  const isExclusion = item.type === "exclusion" || /exclusion|allow|path exclusion|certificate|signer|white_hash|interoperability|performance|suppress/.test(text);
  const isIoc = item.type === "ioc" || /\bsha256\b|\bsha1\b|\bmd5\b|\bdomain\b|\bip\b|indicator|blocklist|known bad/.test(text);
  const hasSequence = /count|threshold|within|followed by|multiple|join|after|before|over \d+|failed.*success|same source/.test(text);
  const hasExternalData = /identity|firewall|cloud|siem|ngfw|vpn|email|okta|entra|azure|aws|gcp|sso/.test(text);
  const endpointBehavior = /eventtype|process|proc|cmdline|command|powershell|pwsh|rundll32|regsvr32|wscript|cscript|persistence|credential|file|registry|network|dstip|srcproc|tgtproc|rclone|lolbin/.test(text);
  const responseAction = /quarantine|kill|isolate|remediate|rollback|response|terminate|disable network/.test(text);
  const broadExclusion = /c:\\\\\*|c:\\\\users\\\\\*|programdata\\\\\*|appdata\\\\\*|temp\\\\\*|\\\*$|entire|recursive|all files/.test(text);

  let target = "XQL Hunt";
  let confidence = "Medium";
  let risk = severityRisk(item.severity);
  let recommendedWork = "Convert to XQL, run against 30-90 days of Cortex telemetry, then decide whether it should alert.";
  let nextChecks = [
    "Map SentinelOne fields to Cortex XDR datasets.",
    "Measure expected hit volume before enabling alerts.",
    "Document owner, scope, and retirement criteria."
  ];

  if (isExclusion) {
    target = "Exception Review";
    confidence = "Medium";
    risk = broadExclusion || /performance|interoperability|disable/.test(text) ? "High" : "Medium";
    recommendedWork = "Re-justify the exclusion and determine whether Cortex needs alert exclusion, disable prevention, disable injection, or no migration.";
    nextChecks = [
      "Confirm whether the SentinelOne exclusion suppressed alerts, reduced prevention, or reduced monitoring.",
      "Replace broad path rules with path plus signer/hash/process scope where possible.",
      "Require owner, business justification, expiration, and pilot testing."
    ];
  } else if (isIoc) {
    target = "IOC Rule";
    confidence = "High";
    risk = "Low";
    recommendedWork = "Normalize indicators, deduplicate, add expiration and source, then load through Cortex IOC workflows or SIEM controls.";
    nextChecks = [
      "Confirm indicator type and hash algorithm.",
      "Deduplicate against threat intel and existing blocklists.",
      "Set expiration and alert routing."
    ];
  } else if (hasSequence || hasExternalData) {
    target = "Correlation Rule";
    confidence = hasExternalData ? "Medium" : "High";
    risk = responseAction ? "High" : severityRisk(item.severity);
    recommendedWork = "Rewrite as scheduled XQL with an explicit time window, threshold, suppression logic, and test volume.";
    nextChecks = [
      "Confirm all required datasets are onboarded to Cortex.",
      "Define schedule, lookback window, and suppression/cooldown.",
      "Test for excessive hits before production."
    ];
  } else if (endpointBehavior) {
    target = item.type === "hunt" ? "XQL Hunt" : "BIOC Rule";
    confidence = item.type === "hunt" ? "Medium" : "High";
    risk = responseAction ? "High" : severityRisk(item.severity);
    recommendedWork = item.type === "hunt"
      ? "Keep as an XQL hunt first; promote to BIOC after baseline testing shows alert quality."
      : "Map process, file, registry, and network fields into Cortex xdr_data and validate as a BIOC candidate.";
    nextChecks = [
      "Validate field mapping in Cortex xdr_data.",
      "Run against pilot endpoints and recent telemetry.",
      "Decide alert-only versus behavioral prevention."
    ];
  }

  const s1ql = validateS1ql(item, extracted);
  const translation = translateToCortex(item, { target, confidence, risk, responseAction }, extracted, s1ql);
  const downgradedConfidence = lowerConfidence(confidence, translation);
  const mitre = correlateMitre(item, translation, { target, risk });

  return {
    ...item,
    target,
    confidence: downgradedConfidence,
    risk,
    recommendedWork,
    nextChecks,
    s1ql,
    translation,
    mitre
  };
}

function severityRisk(severity) {
  if (severity === "Critical") return "High";
  if (severity === "High") return "Medium";
  return "Low";
}

function lowerConfidence(confidence, translation) {
  const highIssues = translation.issues.filter((issue) => issue.level === "High").length;
  const lowMappings = translation.fieldMap.filter((field) => field.confidence === "Low").length;
  if (highIssues || lowMappings >= 2) return "Low";
  if (confidence === "High" && (translation.issues.length || lowMappings)) return "Medium";
  return confidence;
}

function validateS1ql(item, extracted) {
  if (item.type === "exclusion") {
    return {
      requestedVersion: item.s1qlVersion || "auto",
      detectedVersion: "n/a",
      status: "Not applicable",
      summary: "Exclusion review items are not validated as S1QL detection logic.",
      findings: []
    };
  }

  if (item.type === "ioc") {
    return {
      requestedVersion: item.s1qlVersion || "auto",
      detectedVersion: "n/a",
      status: "Not applicable",
      summary: "IOC items are validated through indicator extraction instead of S1QL syntax.",
      findings: []
    };
  }

  const requestedVersion = item.s1qlVersion || "auto";
  const query = normalizeKnownFieldPhrases(normalizeRuleSpacing(extracted.query));
  const findings = [];

  if (!query) {
    findings.push(s1qlFinding("Error", "Empty rule logic", "Paste a STAR or Deep Visibility S1QL expression before converting."));
  }

  checkS1qlDelimiters(query, findings);
  checkS1qlBooleanPlacement(query, findings);
  checkS1qlConditionSyntax(query, findings);
  checkS1qlUnsupportedSyntax(query, findings);

  const detectedVersion = detectS1qlVersion(query, requestedVersion, findings);
  checkS1qlVersionSupport(query, requestedVersion, detectedVersion, findings);

  const status = findings.some((finding) => finding.level === "Error")
    ? "Invalid"
    : findings.some((finding) => finding.level === "Warning")
      ? "Valid with warnings"
      : "Valid";

  return {
    requestedVersion,
    detectedVersion,
    status,
    summary: summarizeS1qlStatus(status, requestedVersion, detectedVersion),
    findings: findings.length ? findings : [s1qlFinding("Ok", "S1QL syntax checks passed", "No local S1QL syntax errors were detected.")]
  };
}

function s1qlFinding(level, title, detail) {
  return { level, title, detail };
}

function checkS1qlDelimiters(query, findings) {
  const stack = [];
  let quoteChar = "";
  let escaped = false;

  for (let index = 0; index < query.length; index += 1) {
    const char = query[index];

    if (quoteChar) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quoteChar) {
        quoteChar = "";
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quoteChar = char;
    } else if (char === "(") {
      stack.push({ char, index });
    } else if (char === ")") {
      if (!stack.length) {
        findings.push(s1qlFinding("Error", "Unmatched closing parenthesis", `Unexpected ")" near character ${index + 1}.`));
      } else {
        stack.pop();
      }
    }
  }

  if (quoteChar) {
    findings.push(s1qlFinding("Error", "Unclosed string literal", `Missing closing ${quoteChar} quote.`));
  }

  stack.forEach((entry) => {
    findings.push(s1qlFinding("Error", "Unclosed parenthesis", `Missing closing ")" for "(" near character ${entry.index + 1}.`));
  });
}

function checkS1qlBooleanPlacement(query, findings) {
  const bare = stripS1qlStrings(query).trim();
  if (!bare) return;

  if (/^(AND|OR)\b/i.test(bare)) {
    findings.push(s1qlFinding("Error", "Leading boolean operator", "S1QL expressions should not start with AND or OR."));
  }

  if (/\b(AND|OR|NOT)\s*$/i.test(bare)) {
    findings.push(s1qlFinding("Error", "Trailing boolean operator", "S1QL expressions should not end with AND, OR, or NOT."));
  }

  if (/\b(AND|OR)\s+(AND|OR)\b/i.test(bare)) {
    findings.push(s1qlFinding("Error", "Consecutive boolean operators", "Remove duplicate AND/OR operators or add the missing condition."));
  }

  if (/\bNOT\s+(AND|OR)\b/i.test(bare)) {
    findings.push(s1qlFinding("Error", "Invalid NOT placement", "NOT should precede a condition or parenthesized expression."));
  }

  if (/\b(and|or|not)\b/.test(query) && !/\b(AND|OR|NOT)\b/.test(query)) {
    findings.push(s1qlFinding("Info", "Lowercase boolean operators", "The converter accepts lowercase booleans, but exported STAR rules commonly use uppercase AND/OR/NOT."));
  }
}

function checkS1qlConditionSyntax(query, findings) {
  const conditions = extractS1qlConditions(query);
  const withoutStrings = stripS1qlStrings(query);

  if (!conditions.length && /[A-Za-z][A-Za-z0-9_]*\s*(=|!=|>|<|\bcontains\b|\bin\b|\bmatches\b)/i.test(withoutStrings)) {
    findings.push(s1qlFinding("Error", "Could not parse condition", "The rule appears to contain a condition, but the field/operator/value shape is malformed."));
  }

  conditions.forEach((condition) => {
    const key = normalizeFieldKey(condition.field);
    const operator = condition.operator.toLowerCase();
    const value = condition.value.trim();

    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(condition.field)) {
      findings.push(s1qlFinding("Error", "Invalid field name", `${condition.field} should start with a letter and contain only letters, numbers, and underscores.`));
    }

    if (!s1qlKnownFieldNames.has(key) && !fieldMappings[key]) {
      findings.push(s1qlFinding("Info", "Unmapped S1QL field", `${condition.field} is syntactically usable, but this utility does not have a Cortex field mapping for it yet.`));
    }

    if ((operator === "in" || operator === "not in") && !(value.startsWith("(") && value.endsWith(")"))) {
      findings.push(s1qlFinding("Error", "Malformed IN list", `${condition.field} ${condition.operator} should be followed by a parenthesized list.`));
    }

    if ((operator === "in" || operator === "not in") && value.startsWith("(")) {
      const listItems = parseListItems(value);
      if (!listItems.length) {
        findings.push(s1qlFinding("Error", "Empty IN list", `${condition.field} ${condition.operator} has no values.`));
      }
      if (/,\s*\)/.test(value)) {
        findings.push(s1qlFinding("Warning", "Trailing comma in list", `${condition.field} ${condition.operator} has a trailing comma that may not be accepted by S1QL.`));
      }
    }

    if ((operator === "contains" || operator === "not contains" || operator === "matches" || operator === "regexp" || operator === "starts with" || operator === "ends with") && !value) {
      findings.push(s1qlFinding("Error", "Missing comparison value", `${condition.field} ${condition.operator} needs a value.`));
    }

    if ((operator === "is empty" || operator === "is not empty") && value) {
      findings.push(s1qlFinding("Warning", "Unexpected value after empty check", `${condition.field} ${condition.operator} should not be followed by an additional value.`));
    }
  });

  checkS1qlOrphanedFields(query, conditions, findings);
}

function checkS1qlUnsupportedSyntax(query, findings) {
  const stripped = stripS1qlStrings(query);

  if (/[;{}]/.test(stripped)) {
    findings.push(s1qlFinding("Warning", "Unexpected punctuation", "Semicolons or braces are not expected in simple STAR S1QL filter expressions."));
  }

  if (/\bSELECT\b|\bFROM\b|\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bLIMIT\b/i.test(stripped)) {
    findings.push(s1qlFinding("Warning", "SQL-like syntax detected", "STAR S1QL filters are expected to be boolean expressions, not full SQL statements."));
  }

  if (/\b(?:and|or|not)\b/.test(stripped) && /\b(?:AND|OR|NOT)\b/.test(stripped)) {
    findings.push(s1qlFinding("Info", "Mixed boolean casing", "Normalize boolean operator casing before final import to reduce parser ambiguity."));
  }
}

function detectS1qlVersion(query, requestedVersion, findings) {
  const stripped = stripS1qlStrings(query);
  const usesTwoOnly = /\bstarts\s+with\b|\bends\s+with\b/i.test(stripped);

  if (requestedVersion === "1.0" && usesTwoOnly) return "2.0";
  if (requestedVersion === "2.0") return "2.0";
  if (requestedVersion === "1.0") return "1.0";
  if (usesTwoOnly) return "2.0";

  findings.push(s1qlFinding("Info", "S1QL version not explicit", "No version-specific operator was detected; the rule is treated as S1QL 1.0-compatible."));
  return "1.0-compatible";
}

function checkS1qlVersionSupport(query, requestedVersion, detectedVersion, findings) {
  const conditions = extractS1qlConditions(query);
  const supportedVersion = requestedVersion === "auto" ? (detectedVersion === "2.0" ? "2.0" : "1.0") : requestedVersion;
  const supported = s1qlOperatorSupport[supportedVersion] || s1qlOperatorSupport["1.0"];

  conditions.forEach((condition) => {
    const operator = condition.operator.toLowerCase();
    if (!supported.has(operator)) {
      findings.push(s1qlFinding("Error", "Operator not supported for selected S1QL version", `${condition.operator} is not enabled for S1QL ${supportedVersion} in this validator.`));
    }
    if (requestedVersion === "1.0" && s1qlTwoOnlyOperators.has(operator)) {
      findings.push(s1qlFinding("Error", "S1QL 2.0 operator in S1QL 1.0 rule", `${condition.operator} requires S1QL 2.0 mode.`));
    }
  });
}

function summarizeS1qlStatus(status, requestedVersion, detectedVersion) {
  if (status === "Invalid") return `Blocking S1QL issues found for ${requestedVersion === "auto" ? detectedVersion : `S1QL ${requestedVersion}`}.`;
  if (status === "Valid with warnings") return `S1QL checks passed with review notes for ${requestedVersion === "auto" ? detectedVersion : `S1QL ${requestedVersion}`}.`;
  return `S1QL checks passed for ${requestedVersion === "auto" ? detectedVersion : `S1QL ${requestedVersion}`}.`;
}

function extractS1qlConditions(query) {
  const conditions = [];
  const normalizedQuery = normalizeKnownFieldPhrases(query);
  const operatorPattern = /(is\s+not\s+empty|is\s+empty|not\s+contains|starts\s+with|ends\s+with|not\s+in|contains|matches|regexp|in|!=|>=|<=|=|>|<)/i;
  const valuePattern = /(?!(?:AND|OR|NOT)\b)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\((?:[^()"']+|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*\)|[^\s)]+)/;
  const conditionPattern = new RegExp(`\\b([A-Za-z][A-Za-z0-9_]*)\\b\\s+${operatorPattern.source}(?:\\s+${valuePattern.source})?`, "gi");
  let match;

  while ((match = conditionPattern.exec(normalizedQuery))) {
    conditions.push({
      field: match[1],
      operator: match[2].replace(/\s+/g, " "),
      value: match[3] || "",
      start: match.index,
      end: conditionPattern.lastIndex
    });
  }

  return conditions;
}

function checkS1qlOrphanedFields(query, conditions, findings) {
  const covered = new Array(query.length).fill(false);
  conditions.forEach((condition) => {
    for (let index = condition.start; index < condition.end; index += 1) covered[index] = true;
  });

  const stripped = stripS1qlStrings(query);
  const fieldPattern = /\b([A-Z][A-Za-z0-9_]{2,})\b/g;
  let match;

  while ((match = fieldPattern.exec(stripped))) {
    const token = match[1];
    const upper = token.toUpperCase();
    if (["AND", "OR", "NOT", "TRUE", "FALSE", "NULL"].includes(upper)) continue;
    if (covered[match.index]) continue;
    const after = stripped.slice(match.index + token.length, match.index + token.length + 18);
    if (/^\s*(AND|OR|\)|$)/i.test(after)) {
      findings.push(s1qlFinding("Warning", "Field without operator", `${token} appears without a comparison operator.`));
    }
  }
}

function stripS1qlStrings(query) {
  let output = "";
  let quoteChar = "";
  let escaped = false;

  for (const char of String(query || "")) {
    if (quoteChar) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quoteChar) {
        quoteChar = "";
      }
      output += " ";
    } else if (char === '"' || char === "'") {
      quoteChar = char;
      output += " ";
    } else {
      output += char;
    }
  }

  return output;
}

function correlateMitre(item, translation, classification) {
  if (item.type === "exclusion") {
    return {
      coverage: "Control / exception review",
      matches: [],
      notes: [
        "Exclusions are mapped to compensating-control review instead of ATT&CK technique coverage.",
        "If the exclusion suppresses a specific detection, map the suppressed detection logic rather than the exclusion object."
      ]
    };
  }

  const text = [
    item.name,
    item.logic,
    translation.normalizedStar,
    classification.target
  ].join(" ").toLowerCase();

  const matched = mitreRules
    .filter((rule) => rule.match.test(text))
    .map((rule) => ({
      id: rule.id,
      tactic: rule.tactics.join(", "),
      tactics: rule.tactics,
      technique: rule.technique,
      subtechnique: rule.subtechnique,
      displayName: rule.subtechnique ? `${rule.technique}: ${rule.subtechnique}` : rule.technique,
      confidence: adjustMitreConfidence(rule, text, translation, classification),
      rationale: rule.rationale,
      reference: rule.reference
    }));

  const deduped = dedupeMitreMatches(matched);
  const notes = buildMitreNotes(item, deduped, translation, classification);

  return {
    coverage: deduped.length ? "Mapped" : "Needs analyst mapping",
    matches: deduped,
    notes
  };
}

function adjustMitreConfidence(rule, text, translation, classification) {
  if (rule.confidence === "Low") return "Low";
  if (translation.fieldMap.some((field) => field.confidence === "Low")) return rule.confidence === "High" ? "Medium" : rule.confidence;
  if (classification.target === "Correlation Rule" && /identity|firewall|cloud|vpn|email|siem/.test(text)) return rule.confidence === "High" ? "Medium" : rule.confidence;
  return rule.confidence;
}

function dedupeMitreMatches(matches) {
  const byId = new Map();
  const confidenceRank = { High: 3, Medium: 2, Low: 1 };

  matches.forEach((match) => {
    const existing = byId.get(match.id);
    if (!existing || confidenceRank[match.confidence] > confidenceRank[existing.confidence]) {
      byId.set(match.id, match);
    }
  });

  return [...byId.values()].sort((a, b) => {
    const confidenceRankLocal = { High: 3, Medium: 2, Low: 1 };
    if (confidenceRankLocal[b.confidence] !== confidenceRankLocal[a.confidence]) {
      return confidenceRankLocal[b.confidence] - confidenceRankLocal[a.confidence];
    }
    return a.id.localeCompare(b.id);
  });
}

function buildMitreNotes(item, matches, translation, classification) {
  const notes = [];

  if (!matches.length) {
    notes.push("No deterministic ATT&CK match was found. Add analyst mapping based on threat behavior, not only field names.");
  }

  if (classification.target === "Correlation Rule") {
    notes.push("Correlation candidates may span multiple ATT&CK techniques; validate against the complete sequence and data sources.");
  }

  if (translation.responseAction) {
    notes.push("Response actions are not ATT&CK coverage by themselves; map the triggering behavior separately from the automated action.");
  }

  if (item.type === "ioc") {
    notes.push("IOC-only rules often map to malware or infrastructure tracking rather than a precise ATT&CK behavior unless surrounding behavior is present.");
  }

  return notes;
}

function analyzedItems() {
  return items.map(analyzeItem);
}

function extractRuleText(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) {
    return { query: "", sourceFormat: "Plain text", extractedFrom: "empty input" };
  }

  try {
    const parsed = JSON.parse(raw);
    const candidate = findQueryCandidate(parsed);
    if (candidate) {
      return {
        query: candidate.value,
        sourceFormat: "SentinelOne JSON",
        extractedFrom: candidate.path,
        parsed
      };
    }
  } catch {
    // Plain STAR expressions are the common case.
  }

  return { query: raw, sourceFormat: "Plain text", extractedFrom: "logic" };
}

function findQueryCandidate(value, path = "root", depth = 0) {
  if (depth > 5 || value == null) return null;

  if (typeof value === "string") {
    if (looksLikeRuleLogic(value)) return { value, path };
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const found = findQueryCandidate(value[index], `${path}[${index}]`, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof value !== "object") return null;

  const preferredKeys = [
    "query",
    "queryText",
    "filter",
    "expression",
    "logic",
    "ruleQuery",
    "dvQuery",
    "description"
  ];

  for (const key of preferredKeys) {
    if (typeof value[key] === "string" && value[key].trim()) {
      return { value: value[key], path: `${path}.${key}` };
    }
  }

  for (const [key, child] of Object.entries(value)) {
    const found = findQueryCandidate(child, `${path}.${key}`, depth + 1);
    if (found) return found;
  }

  return null;
}

function looksLikeRuleLogic(value) {
  return /\b(EventType|TgtProc|SrcProc|CmdLine|Registry|DstIP|SHA256|contains|AND|OR|in\s*\()/i.test(value);
}

function translateToCortex(item, classification, extracted, s1ql) {
  if (item.type === "exclusion") return translateException(item, classification);
  if (item.type === "ioc") return translateIoc(item, classification);

  const issues = [];
  const conditionMap = [];
  const fieldMap = [];
  const seenFields = new Set();
  const query = normalizeKnownFieldPhrases(normalizeRuleSpacing(extracted.query));
  const translationContext = {
    issues,
    fieldMap,
    conditionMap,
    seenFields,
    objectTypeHint: inferObjectTypeHint(query)
  };
  let filter = query || "/* Paste or import SentinelOne STAR logic to generate a Cortex XQL filter. */";

  if (extracted.sourceFormat === "SentinelOne JSON") {
    issues.push({
      level: "Info",
      text: `Parsed STAR logic from ${extracted.extractedFrom}. Review other exported metadata manually.`
    });
  }

  if (s1ql?.status === "Invalid") {
    issues.push({
      level: "High",
      text: "S1QL validation found blocking syntax errors. Fix the source rule before trusting the Cortex translation."
    });
  } else if (s1ql?.findings.some((finding) => finding.level === "Warning")) {
    issues.push({
      level: "Medium",
      text: "S1QL validation found warnings. Review version assumptions and operator support before production migration."
    });
  }

  filter = replaceBinaryOperators(filter, translationContext);
  filter = replaceEmptyOperators(filter, translationContext);
  filter = replaceLogicalOperators(filter);
  filter = replaceKnownPhrases(filter, issues);
  filter = normalizeWhitespaceOutsideStrings(filter);

  discoverUnmappedFields(query, fieldMap, issues, seenFields);
  detectManualReviewNeeds(query, issues);

  const fields = selectOutputFields(fieldMap, classification.target);
  const xql = [
    "dataset = xdr_data",
    `| filter ${filter}`,
    `| fields ${fields.join(", ")}`,
    "| sort desc _time",
    "| limit 100"
  ].join("\n");

  const biocConditions = buildBiocConditions(conditionMap, classification.target);
  const complexity = scoreComplexity(query, issues, conditionMap);

  return {
    sourceFormat: extracted.sourceFormat,
    extractedFrom: extracted.extractedFrom,
    normalizedStar: query,
    xql,
    targetUse: classification.target,
    fieldMap,
    biocConditions,
    issues,
    complexity,
    responseAction: classification.responseAction
  };
}

function translateException(item, classification) {
  const issues = [];
  const broad = /c:\\\\\*|c:\\\\users\\\\\*|programdata\\\\\*|appdata\\\\\*|temp\\\\\*|\\\*$|entire|recursive|all files/i.test(item.logic);
  if (broad) {
    issues.push({
      level: "High",
      text: "Broad path or recursive exclusion detected. Scope by signer, hash, process, endpoint group, and expiration before migrating."
    });
  }
  if (/performance|interoperability|disable/i.test(item.logic)) {
    issues.push({
      level: "High",
      text: "Performance or interoperability exclusion may reduce inspection or prevention. Validate with endpoint engineering."
    });
  }

  return {
    sourceFormat: "Exception",
    extractedFrom: "logic",
    normalizedStar: item.logic,
    xql: [
      "/* Cortex exception migration review */",
      `/* ${item.name} */`,
      "Decision: migrate only if business owner, endpoint scope, expiration, and compensating controls are approved.",
      "Recommended Cortex destination: alert exclusion, prevention exception, agent policy exception, or retire."
    ].join("\n"),
    targetUse: classification.target,
    fieldMap: [],
    biocConditions: [
      "Identify whether the SentinelOne rule suppressed alerts, prevention, monitoring, or performance scanning.",
      "Replace broad path rules with signer/hash/path/process scoped controls where possible.",
      "Add owner, justification, expiration, and pilot endpoints before production rollout."
    ],
    issues,
    complexity: broad ? "High" : "Medium",
    responseAction: false
  };
}

function translateIoc(item, classification) {
  const indicators = extractIndicators(item.logic);
  const filters = [];
  const fieldMap = [];

  if (indicators.sha256.length) {
    filters.push(`action_file_sha256 in (${indicators.sha256.map(quote).join(", ")})`);
    fieldMap.push(fieldMapEntry("sha256", "action_file_sha256"));
  }
  if (indicators.sha1.length) {
    filters.push(`action_file_sha1 in (${indicators.sha1.map(quote).join(", ")})`);
    fieldMap.push(fieldMapEntry("sha1", "action_file_sha1"));
  }
  if (indicators.md5.length) {
    filters.push(`action_file_md5 in (${indicators.md5.map(quote).join(", ")})`);
    fieldMap.push(fieldMapEntry("md5", "action_file_md5"));
  }
  if (indicators.ip.length) {
    filters.push(`action_remote_ip in (${indicators.ip.map(quote).join(", ")})`);
    fieldMap.push({ source: "ip", cortex: "action_remote_ip", confidence: "Medium", notes: "Validate network telemetry source." });
  }
  if (indicators.domain.length) {
    filters.push(`action_external_hostname in (${indicators.domain.map(quote).join(", ")})`);
    fieldMap.push({ source: "domain", cortex: "action_external_hostname", confidence: "Medium", notes: "Validate whether matching should happen on DNS, URL, or network data." });
  }

  const issues = indicators.total
    ? []
    : [{ level: "Medium", text: "No normalized indicator value was detected. Import may need explicit hash, IP, domain, or URL columns." }];

  return {
    sourceFormat: "IOC",
    extractedFrom: "logic",
    normalizedStar: item.logic,
    xql: [
      "dataset = xdr_data",
      `| filter ${filters.length ? filters.join(" or ") : "/* add normalized indicator filters */"}`,
      "| fields _time, agent_hostname, action_file_name, action_file_sha256, action_remote_ip, action_external_hostname",
      "| sort desc _time",
      "| limit 100"
    ].join("\n"),
    targetUse: classification.target,
    fieldMap,
    biocConditions: [
      "Load active indicators through Cortex IOC or threat intel workflow.",
      "Add source, confidence, owner, and expiration.",
      "Deduplicate against existing blocklists before enabling alerting."
    ],
    issues,
    complexity: indicators.total > 10 ? "Medium" : "Low",
    responseAction: false
  };
}

function replaceEmptyOperators(input, context) {
  return input.replace(/\b([A-Za-z][A-Za-z0-9_]*)\b\s+(is\s+not\s+empty|is\s+empty)\b/gi, (match, rawField, operator) => {
    const mapped = mapField(rawField, context);
    const condition = operator.toLowerCase() === "is not empty"
      ? `(${mapped.cortex} != null and ${mapped.cortex} != "")`
      : `(${mapped.cortex} = null or ${mapped.cortex} = "")`;
    context.conditionMap.push({
      sourceField: rawField,
      cortexField: mapped.cortex,
      operator,
      value: "",
      expression: condition
    });
    return condition;
  });
}

function replaceBinaryOperators(input, context) {
  const binaryOperator = /(not\s+contains|contains|starts\s+with|ends\s+with|matches|regexp|not\s+in|in|!=|>=|<=|=|>|<)/i;
  const valuePattern = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\([^)]+\)|[^\s)]+)/;
  const conditionPattern = new RegExp(`\\b([A-Za-z][A-Za-z0-9_]*)\\b\\s+${binaryOperator.source}\\s+${valuePattern.source}`, "gi");

  return input.replace(conditionPattern, (match, rawField, rawOperator, rawValue) => {
    const mapped = mapField(rawField, context);
    const operator = rawOperator.toLowerCase().replace(/\s+/g, " ");
    const expression = translateCondition(rawField, mapped.cortex, operator, rawValue, context.issues);
    context.conditionMap.push({
      sourceField: rawField,
      cortexField: mapped.cortex,
      operator,
      value: rawValue,
      expression
    });
    return expression;
  });
}

function replaceLogicalOperators(input) {
  return input
    .replace(/\bAND\b/g, "and")
    .replace(/\bOR\b/g, "or")
    .replace(/\bNOT\b/g, "not");
}

function replaceKnownPhrases(input, issues) {
  let output = input;

  if (/automated response\s*:/i.test(output)) {
    issues.push({
      level: "High",
      text: "SentinelOne automated response was detected. Rebuild response actions in Cortex playbooks or alert actions after a staged pilot."
    });
    output = output.replace(/(?:\band\s+)?automated response\s*:[^)\n]+/gi, "");
  }

  return output;
}

function translateCondition(sourceField, cortexField, operator, rawValue, issues) {
  const fieldKey = normalizeFieldKey(sourceField);

  if (fieldKey === "eventtype") {
    return translateEventTypeCondition(operator, rawValue, issues);
  }

  if (fieldKey === "objecttype") {
    return translateObjectTypeCondition(operator, rawValue, issues);
  }

  const value = normalizeValue(rawValue);

  switch (operator) {
    case "contains":
      return `${cortexField} contains ${value}`;
    case "not contains":
      return `not (${cortexField} contains ${value})`;
    case "starts with":
      issues.push({ level: "Info", text: "Starts-with logic was translated to XQL startswith syntax; verify exact operator support in your tenant." });
      return `${cortexField} startswith ${value}`;
    case "ends with":
      issues.push({ level: "Info", text: "Ends-with logic was translated to XQL endswith syntax; verify exact operator support in your tenant." });
      return `${cortexField} endswith ${value}`;
    case "matches":
    case "regexp":
      issues.push({ level: "Medium", text: "Regex matching should be performance-tested before production alerting." });
      return `${cortexField} ~= ${value}`;
    case "in":
    case "not in":
      return `${cortexField} ${operator} ${normalizeListValue(rawValue)}`;
    default:
      return `${cortexField} ${operator} ${value}`;
  }
}

function translateEventTypeCondition(operator, rawValue, issues) {
  const normalizedValues = parseListItems(rawValue).map((value) => value.toLowerCase());
  const mappedValues = normalizedValues.map((value) => eventTypeMappings[value]).filter(Boolean);

  if (!mappedValues.length) {
    issues.push({
      level: "Medium",
      text: `Unknown EventType value ${rawValue}. Keep event_type placeholder and verify the Cortex enum.`
    });
    return `event_type ${operator} ${normalizeValue(rawValue)}`;
  }

  if (operator === "in" || operator === "not in") {
    return `event_type ${operator} (${unique(mappedValues).join(", ")})`;
  }

  if (mappedValues.length > 1) {
    return `event_type in (${unique(mappedValues).join(", ")})`;
  }

  return `event_type ${operator} ${mappedValues[0]}`;
}

function translateObjectTypeCondition(operator, rawValue, issues) {
  const normalizedValues = parseListItems(rawValue).map((value) => value.toLowerCase());
  const objectTypeMappings = {
    process: "ENUM.PROCESS",
    file: "ENUM.FILE",
    registry: "ENUM.REGISTRY",
    registrykey: "ENUM.REGISTRY",
    registryvalue: "ENUM.REGISTRY",
    network: "ENUM.NETWORK",
    dns: "ENUM.NETWORK",
    module: "ENUM.LOAD_IMAGE",
    moduleload: "ENUM.LOAD_IMAGE",
    ip: "ENUM.NETWORK",
    url: "ENUM.NETWORK"
  };
  const mappedValues = normalizedValues
    .map((value) => objectTypeMappings[normalizeFieldAliasKey(value)])
    .filter(Boolean);

  if (!mappedValues.length) {
    issues.push({
      level: "Medium",
      text: `Unknown ObjectType value ${rawValue}. Keep event_type placeholder and verify the Cortex event family.`
    });
    return `event_type ${operator} ${normalizeValue(rawValue)}`;
  }

  if (operator === "in" || operator === "not in") {
    return `event_type ${operator} (${unique(mappedValues).join(", ")})`;
  }

  if (mappedValues.length > 1) {
    return `event_type in (${unique(mappedValues).join(", ")})`;
  }

  return `event_type ${operator} ${mappedValues[0]}`;
}

function mapField(rawField, context) {
  const key = normalizeFieldKey(rawField);
  const contextual = contextualFieldMapping(key, context);
  const mapped = contextual || fieldMappings[key] || {
    cortex: rawField,
    confidence: "Low",
    notes: "No built-in field mapping. Verify the correct Cortex dataset and field before production use."
  };

  if (!context.seenFields.has(key)) {
    context.seenFields.add(key);
    context.fieldMap.push({
      source: rawField,
      cortex: mapped.cortex,
      label: mapped.label || rawField,
      confidence: mapped.confidence,
      notes: mapped.notes
    });

    if (!fieldMappings[key]) {
      context.issues.push({
        level: "Medium",
        text: `No automatic mapping for SentinelOne field ${rawField}.`
      });
    }
  }

  return mapped;
}

function contextualFieldMapping(key, context) {
  const objectType = context.objectTypeHint;
  if (!objectType) return null;

  if (key === "objectname") {
    if (objectType === "file") {
      return {
        cortex: "action_file_name",
        label: "Object name",
        confidence: "High",
        notes: "Contextual mapping from ObjectType=File to Cortex action_file_name."
      };
    }
    if (objectType === "registry") {
      return {
        cortex: "action_registry_key_name",
        label: "Object name",
        confidence: "Medium",
        notes: "Contextual mapping from ObjectType=Registry to Cortex registry key name; validate key/value semantics."
      };
    }
    if (objectType === "network") {
      return {
        cortex: "action_external_hostname",
        label: "Object name",
        confidence: "Medium",
        notes: "Contextual mapping from ObjectType=Network to hostname; validate IP, domain, and URL directionality."
      };
    }
    if (objectType === "module") {
      return {
        cortex: "action_module_name",
        label: "Object name",
        confidence: "Medium",
        notes: "Contextual mapping from ObjectType=Module to loaded module name; validate module telemetry availability."
      };
    }
  }

  if (key === "objectpath") {
    if (objectType === "process") {
      return {
        cortex: "action_process_image_path",
        label: "Object path",
        confidence: "High",
        notes: "Contextual mapping from ObjectType=Process to Cortex action process image path."
      };
    }
    if (objectType === "file") {
      return {
        cortex: "action_file_path",
        label: "Object path",
        confidence: "High",
        notes: "Contextual mapping from ObjectType=File to Cortex action file path."
      };
    }
    if (objectType === "registry") {
      return {
        cortex: "action_registry_key_name",
        label: "Object path",
        confidence: "High",
        notes: "Contextual mapping from ObjectType=Registry to Cortex registry key name."
      };
    }
    if (objectType === "network") {
      return {
        cortex: "action_url",
        label: "Object path",
        confidence: "Medium",
        notes: "Contextual mapping from ObjectType=Network to URL; validate whether the source value is a URL, host, or IP."
      };
    }
    if (objectType === "module") {
      return {
        cortex: "action_module_path",
        label: "Object path",
        confidence: "Medium",
        notes: "Contextual mapping from ObjectType=Module to loaded module path; validate module telemetry availability."
      };
    }
  }

  if (key === "objecthash") {
    if (objectType === "process") {
      return {
        cortex: "action_process_image_sha256",
        label: "Object hash",
        confidence: "Medium",
        notes: "Contextual mapping from ObjectType=Process to action process SHA-256; verify hash algorithm."
      };
    }
    if (objectType === "file") {
      return {
        cortex: "action_file_sha256",
        label: "Object hash",
        confidence: "Medium",
        notes: "Contextual mapping from ObjectType=File to action file SHA-256; verify hash algorithm."
      };
    }
    if (objectType === "module") {
      return {
        cortex: "action_module_sha256",
        label: "Object hash",
        confidence: "Medium",
        notes: "Contextual mapping from ObjectType=Module to loaded module SHA-256; verify hash algorithm and telemetry availability."
      };
    }
  }

  return null;
}

function inferObjectTypeHint(query) {
  const conditions = extractS1qlConditions(query);
  const objectTypeCondition = conditions.find((condition) => normalizeFieldKey(condition.field) === "objecttype");
  if (!objectTypeCondition) return "";

  const values = parseListItems(objectTypeCondition.value).map((value) => normalizeFieldAliasKey(value));
  const first = values[0] || "";
  if (/process/.test(first)) return "process";
  if (/file/.test(first)) return "file";
  if (/registr/.test(first)) return "registry";
  if (/network|dns|ip|url/.test(first)) return "network";
  if (/module|loadimage/.test(first)) return "module";
  return "";
}

function normalizeFieldKey(rawField) {
  const aliasKey = normalizeFieldAliasKey(rawField);
  return fieldAliases[aliasKey] || aliasKey;
}

function normalizeFieldAliasKey(rawField) {
  return String(rawField || "")
    .toLowerCase()
    .replace(/[`"']/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function discoverUnmappedFields(query, fieldMap, issues, seenFields) {
  const candidatePattern = /\b([A-Z][A-Za-z0-9_]{2,})\b(?=\s*(?:=|!=|>=|<=|>|<|\bin\b|\bcontains\b|\bmatches\b|\bis\b))/g;
  let match;

  while ((match = candidatePattern.exec(query))) {
    const rawField = match[1];
    const key = normalizeFieldKey(rawField);
    if (seenFields.has(key)) continue;
    if (fieldMappings[key]) continue;
    seenFields.add(key);
    fieldMap.push({
      source: rawField,
      cortex: rawField,
      label: rawField,
      confidence: "Low",
      notes: "Field was detected but not mapped by the built-in dictionary."
    });
    issues.push({
      level: "Medium",
      text: `Detected unmapped field ${rawField}. Add a tenant-specific mapping before enabling.`
    });
  }
}

function detectManualReviewNeeds(query, issues) {
  const checks = [
    {
      pattern: /\bwithin\s+\d+|\bfollowed by\b|\bafter\b|\bbefore\b/i,
      level: "High",
      text: "Temporal sequence logic needs a scheduled correlation rule, explicit lookback, and suppression window."
    },
    {
      pattern: /\bcount\b|\bthreshold\b|\bgroup by\b|\bhaving\b/i,
      level: "High",
      text: "Threshold logic needs aggregation in XQL and alert-volume testing."
    },
    {
      pattern: /\bjoin\b|\bidentity\b|\bfirewall\b|\bcloud\b|\bvpn\b|\bemail\b|\bsiem\b/i,
      level: "Medium",
      text: "Cross-source logic depends on available Cortex datasets and integrations."
    },
    {
      pattern: /\bcase sensitive\b|\bcase-sensitive\b/i,
      level: "Medium",
      text: "Case-sensitivity requirements should be validated against Cortex string matching behavior."
    },
    {
      pattern: /\*|\?/,
      level: "Info",
      text: "Wildcard syntax may need conversion to contains, regex, or explicit path matching."
    }
  ];

  checks.forEach((check) => {
    if (check.pattern.test(query)) issues.push({ level: check.level, text: check.text });
  });
}

function buildBiocConditions(conditionMap, target) {
  if (!conditionMap.length) {
    return target === "Correlation Rule"
      ? ["No simple BIOC conditions were extracted. Build this as scheduled XQL or a correlation rule."]
      : ["No simple BIOC conditions were extracted. Confirm the STAR export includes structured rule logic."];
  }

  const conditions = conditionMap.map((condition) => {
    const friendlyOperator = condition.operator === "=" ? "equals" : condition.operator;
    const value = condition.value ? ` ${stripOuterQuotes(condition.value)}` : "";
    return `${condition.cortexField} ${friendlyOperator}${value}`;
  });

  if (target === "BIOC Rule") return conditions;
  return [
    ...conditions,
    "Use these as the endpoint-behavior portion of the XQL or correlation rule."
  ];
}

function scoreComplexity(query, issues, conditions) {
  const booleanCount = (query.match(/\bAND\b|\bOR\b|\bNOT\b/gi) || []).length;
  const highIssues = issues.filter((issue) => issue.level === "High").length;
  const mediumIssues = issues.filter((issue) => issue.level === "Medium").length;

  if (highIssues || booleanCount >= 5 || conditions.length >= 6) return "High";
  if (mediumIssues || booleanCount >= 2 || conditions.length >= 3) return "Medium";
  return "Low";
}

function selectOutputFields(fieldMap, target) {
  const defaults = ["_time", "agent_hostname", "actor_effective_username"];
  const mapped = fieldMap.map((field) => field.cortex).filter(Boolean);
  const investigative = [
    "actor_process_image_name",
    "actor_process_command_line",
    "action_process_image_name",
    "action_process_image_command_line",
    "action_file_path",
    "action_remote_ip",
    "action_remote_port"
  ];

  if (target === "Correlation Rule") {
    return unique([...defaults, ...mapped, ...investigative, "event_type"]);
  }

  return unique([...defaults, ...mapped, ...investigative]);
}

function extractIndicators(value) {
  const text = String(value || "");
  const sha256 = text.match(/\b[a-f0-9]{64}\b/gi) || [];
  const sha1 = text.match(/\b[a-f0-9]{40}\b/gi) || [];
  const md5 = text.match(/\b[a-f0-9]{32}\b/gi) || [];
  const ip = text.match(/\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g) || [];
  const domain = text.match(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi) || [];

  return {
    sha256: unique(sha256.map((item) => item.toLowerCase())),
    sha1: unique(sha1.map((item) => item.toLowerCase())),
    md5: unique(md5.map((item) => item.toLowerCase())),
    ip: unique(ip),
    domain: unique(domain.map((item) => item.toLowerCase())),
    total: sha256.length + sha1.length + md5.length + ip.length + domain.length
  };
}

function normalizeRuleSpacing(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function normalizeKnownFieldPhrases(value) {
  let output = String(value || "");
  const phraseFields = [
    ["Object Type", "ObjectType"],
    ["Object Name", "ObjectName"],
    ["Object Path", "ObjectPath"],
    ["Object Full Path", "ObjectPath"],
    ["Object Hash", "ObjectHash"],
    ["Object SHA256", "ObjectSHA256"],
    ["Object SHA1", "ObjectSHA1"],
    ["Object MD5", "ObjectMD5"],
    ["Event Type", "EventType"],
    ["Event Name", "EventName"],
    ["Event Subtype", "EventSubtype"],
    ["Event Sub Type", "EventSubtype"],
    ["Event Time", "EventTime"],
    ["Event ID", "EventID"],
    ["Process Name", "ProcessName"],
    ["Process ID", "ProcessID"],
    ["Process Command Line", "ProcessCommandLine"],
    ["Process CmdLine", "ProcessCmdLine"],
    ["Process Path", "ProcessPath"],
    ["Process User", "ProcessUser"],
    ["Process Integrity Level", "ProcessIntegrityLevel"],
    ["Integrity Level", "IntegrityLevel"],
    ["Parent Process Name", "ParentProcessName"],
    ["Parent Process Command Line", "ParentProcessCmdLine"],
    ["Parent Process CmdLine", "ParentProcessCmdLine"],
    ["Parent Process Path", "ParentProcessPath"],
    ["Parent Process ID", "ParentProcessID"],
    ["Parent PID", "ParentPID"],
    ["File Name", "FileName"],
    ["File Path", "FilePath"],
    ["File Full Path", "FileFullPath"],
    ["File Extension", "FileExtension"],
    ["File Hash", "FileHash"],
    ["File Size", "FileSize"],
    ["File Type", "FileType"],
    ["Old File Path", "OldFilePath"],
    ["New File Path", "NewFilePath"],
    ["Old File Name", "OldFileName"],
    ["New File Name", "NewFileName"],
    ["Registry Key Path", "RegistryKeyPath"],
    ["Registry Path", "RegistryPath"],
    ["Registry Key", "RegistryKey"],
    ["Registry Value Name", "RegistryValueName"],
    ["Registry Value Data", "RegistryValueData"],
    ["Registry Value Path", "RegistryValuePath"],
    ["Registry Value", "RegistryValue"],
    ["Registry Data", "RegistryData"],
    ["Destination IP", "DestinationIP"],
    ["Destination Port", "DestinationPort"],
    ["Destination Hostname", "DestinationHostname"],
    ["Destination Host Name", "DestinationHostname"],
    ["Remote IP", "RemoteIP"],
    ["Remote Port", "RemotePort"],
    ["Remote Hostname", "RemoteHostname"],
    ["Remote Host Name", "RemoteHostname"],
    ["Source IP", "SourceIP"],
    ["Source Port", "SourcePort"],
    ["Source IP Address", "SourceIPAddress"],
    ["IP Address", "IPAddress"],
    ["Network Protocol", "NetworkProtocol"],
    ["DNS Request", "DNSRequest"],
    ["DNS Query", "DNSQuery"],
    ["DNS Response", "DNSResponse"],
    ["Request URL", "RequestURL"],
    ["Target URL", "TargetURL"],
    ["URL Host", "URLHost"],
    ["Account Name", "AccountName"],
    ["User Principal Name", "UserPrincipalName"],
    ["Login User", "LoginUser"],
    ["OS Username", "OSUsername"],
    ["OS User Name", "OSUsername"],
    ["Domain User", "DomainUser"],
    ["User Domain", "UserDomain"],
    ["Agent ID", "AgentID"],
    ["Agent UUID", "AgentUUID"],
    ["Agent Version", "AgentVersion"],
    ["Agent OS Type", "AgentOSType"],
    ["Agent OS", "AgentOS"],
    ["Agent Hostname", "AgentHostname"],
    ["Agent Host Name", "AgentHostname"],
    ["Endpoint ID", "EndpointID"],
    ["Endpoint Name", "EndpointName"],
    ["Endpoint Type", "EndpointType"],
    ["Endpoint OS", "EndpointOS"],
    ["Computer Name", "ComputerName"],
    ["Machine ID", "MachineID"],
    ["Site Name", "SiteName"],
    ["Site ID", "SiteID"],
    ["Group Name", "GroupName"],
    ["Group ID", "GroupID"],
    ["Signer Identity", "SignerIdentity"],
    ["Signed Status", "SignedStatus"],
    ["Signature Status", "SignatureStatus"],
    ["Threat Name", "ThreatName"],
    ["Threat ID", "ThreatID"],
    ["Detection Name", "DetectionName"],
    ["Analyst Verdict", "AnalystVerdict"],
    ["Confidence Level", "ConfidenceLevel"],
    ["Rule Name", "RuleName"],
    ["Rule ID", "RuleID"],
    ["Module Name", "ModuleName"],
    ["Module Path", "ModulePath"],
    ["Module SHA256", "ModuleSHA256"]
  ];

  phraseFields
    .sort((left, right) => right[0].length - left[0].length)
    .forEach(([phrase, canonical]) => {
    const pattern = new RegExp(`\\b${phrase.replace(/\s+/g, "\\s+")}\\b`, "gi");
    output = output.replace(pattern, canonical);
  });

  return output;
}

function normalizeWhitespaceOutsideStrings(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}

function normalizeValue(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return '""';
  if (value.startsWith("(") && value.endsWith(")")) return normalizeListValue(value);
  if (/^ENUM\./.test(value) || /^(true|false|null)$/i.test(value) || /^-?\d+(\.\d+)?$/.test(value)) return value;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return quote(stripOuterQuotes(value));
  return quote(value);
}

function normalizeListValue(rawValue) {
  const values = parseListItems(rawValue);
  return `(${values.map((value) => (/^ENUM\./.test(value) ? value : quote(value))).join(", ")})`;
}

function parseListItems(rawValue) {
  const trimmed = String(rawValue || "").trim();
  const body = trimmed.startsWith("(") && trimmed.endsWith(")") ? trimmed.slice(1, -1) : trimmed;
  const values = [];
  let value = "";
  let quoteChar = "";

  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    const next = body[index + 1];
    if (quoteChar) {
      if (char === "\\" && next) {
        value += char + next;
        index += 1;
      } else if (char === quoteChar) {
        quoteChar = "";
      } else {
        value += char;
      }
    } else if (char === '"' || char === "'") {
      quoteChar = char;
    } else if (char === ",") {
      if (value.trim()) values.push(stripOuterQuotes(value.trim()));
      value = "";
    } else {
      value += char;
    }
  }

  if (value.trim()) values.push(stripOuterQuotes(value.trim()));
  return values;
}

function stripOuterQuotes(value) {
  const text = String(value || "").trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1);
  }
  return text;
}

function quote(value) {
  return `"${String(value ?? "").replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function fieldMapEntry(source, cortex) {
  const mapping = fieldMappings[source] || {};
  return {
    source,
    cortex,
    label: mapping.label || source,
    confidence: mapping.confidence || "Medium",
    notes: mapping.notes || "Generated from indicator extraction."
  };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function currentDraftItem() {
  return {
    id: "draft",
    type: fields.type.value,
    s1qlVersion: fields.s1qlVersion.value,
    name: fields.name.value.trim() || "Draft SentinelOne item",
    severity: fields.severity.value,
    scope: fields.scope.value.trim() || "Unscoped",
    owner: fields.owner.value.trim() || "Unassigned",
    status: "Needs validation",
    logic: fields.logic.value.trim()
  };
}

function render() {
  renderSummary();
  renderMatrix();
  renderTranslationPreview();
}

function renderSummary() {
  const data = analyzedItems();
  const counts = {
    total: data.length,
    star: data.filter((item) => item.type === "star").length,
    translated: data.filter((item) => item.translation.xql && item.type !== "exclusion").length,
    mitreMapped: data.filter((item) => item.mitre.matches.length).length,
    highRisk: data.filter((item) => item.risk === "High").length
  };

  summaryGrid.innerHTML = `
    <article class="metric-card"><small>Total inventory</small><span>${counts.total}</span><p>Rules, hunts, IOCs, and exclusions staged for cutover.</p></article>
    <article class="metric-card"><small>STAR rules</small><span>${counts.star}</span><p>Primary SentinelOne detections ready for Cortex translation.</p></article>
    <article class="metric-card"><small>Draft outputs</small><span>${counts.translated}</span><p>Items with generated XQL, IOC, or BIOC migration artifacts.</p></article>
    <article class="metric-card"><small>MITRE mapped</small><span>${counts.mitreMapped}</span><p>Items with deterministic ATT&CK tactic and technique correlation.</p></article>
    <article class="metric-card"><small>High risk</small><span>${counts.highRisk}</span><p>Prioritize for owner review and staged pilot validation.</p></article>
  `;
}

function renderTranslationPreview() {
  const draft = analyzeItem(currentDraftItem());
  xqlPreview.textContent = draft.translation.xql;

  translationMeta.innerHTML = `
    <span class="mini-stat"><small>Target</small><strong>${escapeHtml(draft.target)}</strong></span>
    <span class="mini-stat"><small>Confidence</small><strong class="${confidenceClass(draft.confidence)}">${escapeHtml(draft.confidence)}</strong></span>
    <span class="mini-stat"><small>Risk</small><strong class="${riskClass(draft.risk)}">${escapeHtml(draft.risk)}</strong></span>
    <span class="mini-stat"><small>S1QL</small><strong>${escapeHtml(draft.s1ql.status)}</strong></span>
  `;

  s1qlPreview.innerHTML = s1qlHtml(draft.s1ql);
  biocPreview.innerHTML = listHtml(draft.translation.biocConditions);

  mappingPreview.innerHTML = draft.translation.fieldMap.length
    ? draft.translation.fieldMap.map((field) => `
      <article class="mapping-card">
        <strong>${escapeHtml(field.source)} <span>-></span> ${escapeHtml(field.cortex)}</strong>
        <small>${escapeHtml(field.confidence)} confidence</small>
        <p>${escapeHtml(field.notes)}</p>
      </article>
    `).join("")
    : `<p class="empty-note">No structured STAR fields detected yet.</p>`;

  issuesPreview.innerHTML = draft.translation.issues.length
    ? draft.translation.issues.map((issue) => `<li><strong>${escapeHtml(issue.level)}:</strong> ${escapeHtml(issue.text)}</li>`).join("")
    : `<li>No blocking translation gaps detected for this draft.</li>`;

  mitrePreview.innerHTML = mitreHtml(draft.mitre);
}

function renderMatrix() {
  const search = filters.search.value.trim().toLowerCase();
  const rows = analyzedItems().filter((item) => {
    const sourceMatch = filters.source.value === "all" || item.type === filters.source.value;
    const targetMatch = filters.target.value === "all" || item.target === filters.target.value;
    const statusMatch = filters.status.value === "all" || item.status === filters.status.value;
    const searchMatch = !search || `${item.name} ${item.logic} ${item.scope} ${item.owner} ${item.translation.xql}`.toLowerCase().includes(search);
    return sourceMatch && targetMatch && statusMatch && searchMatch;
  });

  matrixBody.innerHTML = rows.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.scope)} / ${escapeHtml(item.owner)}</small></td>
      <td><span class="pill">${sourceLabel(item.type)}</span><small>${escapeHtml(item.severity)}</small></td>
      <td>${escapeHtml(item.target)}<small>${escapeHtml(item.translation.complexity)} complexity</small><small>S1QL: ${escapeHtml(item.s1ql.status)}</small><small>${escapeHtml(primaryMitreLabel(item.mitre))}</small></td>
      <td><span class="${riskClass(item.risk)}">${escapeHtml(item.risk)}</span></td>
      <td><span class="${confidenceClass(item.confidence)}">${escapeHtml(item.confidence)}</span></td>
      <td>
        <select class="status-select" data-status-id="${item.id}">
          ${["Backlog", "Needs validation", "Ready for pilot", "Retire"].map((status) => `<option ${item.status === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </td>
      <td>${escapeHtml(item.recommendedWork)}<small>${escapeHtml(item.translation.issues[0]?.text || item.logic)}</small></td>
      <td>
        <div class="row-actions">
          <button type="button" class="quiet" data-details-id="${item.id}">Details</button>
          <button type="button" class="quiet" data-delete-id="${item.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  if (!rows.length) {
    matrixBody.innerHTML = `<tr><td colspan="8">No migration items match the current filters.</td></tr>`;
  }
}

function showDetails(id) {
  const item = analyzedItems().find((candidate) => candidate.id === id);
  if (!item) return;

  detailsTitle.textContent = item.name;
  detailsContent.innerHTML = `
    <article class="detail-box">
      <h3>Recommendation</h3>
      <p><strong>Cortex target:</strong> ${escapeHtml(item.target)}</p>
      <p><strong>Risk:</strong> ${escapeHtml(item.risk)}</p>
      <p><strong>Confidence:</strong> ${escapeHtml(item.confidence)}</p>
      <p><strong>Complexity:</strong> ${escapeHtml(item.translation.complexity)}</p>
      <p><strong>S1QL:</strong> ${escapeHtml(item.s1ql.status)} (${escapeHtml(item.s1ql.detectedVersion)})</p>
      <p>${escapeHtml(item.recommendedWork)}</p>
    </article>
    <article class="detail-box">
      <h3>Validation checklist</h3>
      <ul>${item.nextChecks.map((check) => `<li>${escapeHtml(check)}</li>`).join("")}</ul>
    </article>
    <article class="detail-box wide">
      <h3>Draft Cortex XQL</h3>
      <pre>${escapeHtml(item.translation.xql)}</pre>
    </article>
    <article class="detail-box wide">
      <h3>S1QL Validation</h3>
      <div class="validation-list">${s1qlHtml(item.s1ql)}</div>
    </article>
    <article class="detail-box">
      <h3>BIOC or Rule Builder Notes</h3>
      <ul>${item.translation.biocConditions.map((condition) => `<li>${escapeHtml(condition)}</li>`).join("")}</ul>
    </article>
    <article class="detail-box">
      <h3>Manual Review Flags</h3>
      <ul>${item.translation.issues.length ? item.translation.issues.map((issue) => `<li><strong>${escapeHtml(issue.level)}:</strong> ${escapeHtml(issue.text)}</li>`).join("") : "<li>No blocking translation gaps detected.</li>"}</ul>
    </article>
    <article class="detail-box wide">
      <h3>MITRE ATT&CK Correlation</h3>
      <div class="mitre-list">${mitreHtml(item.mitre)}</div>
      ${item.mitre.notes.length ? `<ul>${item.mitre.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>` : ""}
    </article>
    <article class="detail-box wide">
      <h3>Field Mapping</h3>
      ${fieldMappingTable(item.translation.fieldMap)}
    </article>
    <article class="detail-box wide">
      <h3>Original SentinelOne Logic</h3>
      <pre>${escapeHtml(item.logic)}</pre>
    </article>
  `;
  detailsPanel.hidden = false;
  detailsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function fieldMappingTable(fieldMap) {
  if (!fieldMap.length) return `<p>No structured fields were extracted.</p>`;
  return `
    <div class="mini-table-scroll">
      <table class="mini-table">
        <thead><tr><th>SentinelOne Field</th><th>Cortex Field</th><th>Confidence</th><th>Notes</th></tr></thead>
        <tbody>
          ${fieldMap.map((field) => `
            <tr>
              <td>${escapeHtml(field.source)}</td>
              <td>${escapeHtml(field.cortex)}</td>
              <td>${escapeHtml(field.confidence)}</td>
              <td>${escapeHtml(field.notes)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function addItem(event) {
  event.preventDefault();
  items.unshift({
    id: makeId(),
    type: fields.type.value,
    s1qlVersion: fields.s1qlVersion.value,
    name: fields.name.value.trim() || "Untitled SentinelOne item",
    severity: fields.severity.value,
    scope: fields.scope.value.trim() || "Unscoped",
    owner: fields.owner.value.trim() || "Unassigned",
    status: "Needs validation",
    logic: fields.logic.value.trim()
  });
  saveItems();
  render();
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function normalizeImported(data) {
  const rows = normalizeImportRows(data);

  return rows.map((item) => ({
    id: item.id || makeId(),
    type: normalizeType(readAny(item, ["type", "source", "ruleType", "kind", "category"]) || "star"),
    s1qlVersion: normalizeS1qlVersion(readAny(item, ["s1qlVersion", "s1ql", "queryLanguageVersion", "languageVersion"]) || "auto"),
    name: String(readAny(item, ["name", "ruleName", "title", "displayName"]) || "Imported item"),
    severity: normalizeSeverity(readAny(item, ["severity", "level", "riskLevel"]) || "Medium"),
    scope: String(readAny(item, ["scope", "site", "group", "agentGroup", "tenant"]) || "Imported"),
    owner: String(readAny(item, ["owner", "createdBy", "author", "user"]) || "Imported"),
    status: normalizeStatus(readAny(item, ["status", "migrationStatus"]) || "Needs validation"),
    logic: String(readAny(item, ["logic", "query", "queryText", "filter", "expression", "description", "path", "value", "indicator"]) || JSON.stringify(item))
  }));
}

function normalizeImportRows(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of ["rules", "items", "data", "results", "detections"]) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [data];
}

function readAny(item, keys) {
  for (const key of keys) {
    if (item?.[key] != null && item[key] !== "") return item[key];
  }
  for (const key of keys) {
    const found = findNestedKey(item, key.toLowerCase());
    if (found != null && found !== "") return found;
  }
  return "";
}

function findNestedKey(value, keyName, depth = 0) {
  if (depth > 4 || value == null || typeof value !== "object") return "";
  if (Object.prototype.hasOwnProperty.call(value, keyName)) return value[keyName];

  for (const [key, child] of Object.entries(value)) {
    if (key.toLowerCase() === keyName) return child;
    const found = findNestedKey(child, keyName, depth + 1);
    if (found != null && found !== "") return found;
  }

  return "";
}

function normalizeType(value) {
  const text = String(value).toLowerCase();
  if (text.includes("hunt") || text.includes("deep")) return "hunt";
  if (text.includes("excl") || text.includes("allow")) return "exclusion";
  if (text.includes("ioc") || text.includes("indicator") || text.includes("hash")) return "ioc";
  return "star";
}

function normalizeSeverity(value) {
  const text = String(value).toLowerCase();
  if (text.includes("critical")) return "Critical";
  if (text.includes("high")) return "High";
  if (text.includes("low")) return "Low";
  return "Medium";
}

function normalizeS1qlVersion(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("2")) return "2.0";
  if (text.includes("1")) return "1.0";
  return "auto";
}

function normalizeStatus(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("ready")) return "Ready for pilot";
  if (text.includes("retire")) return "Retire";
  if (text.includes("backlog")) return "Backlog";
  return "Needs validation";
}

function importFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const text = String(reader.result || "");
    let imported = [];

    try {
      if (file.name.toLowerCase().endsWith(".json")) {
        imported = normalizeImported(JSON.parse(text));
      } else {
        const rows = parseCsvRows(text);
        const headers = rows.shift()?.map((header) => header.trim()) || [];
        imported = normalizeImported(rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]))));
      }
    } catch (error) {
      alert(`Import failed: ${error.message}`);
      return;
    }

    items = [...imported, ...items];
    saveItems();
    render();
  });
  reader.readAsText(file);
}

function exportCsv() {
  const headers = [
    "name",
    "type",
    "s1qlVersion",
    "s1qlDetectedVersion",
    "s1qlStatus",
    "s1qlFindings",
    "severity",
    "scope",
    "owner",
    "status",
    "cortexTarget",
    "risk",
    "confidence",
    "complexity",
    "recommendedWork",
    "mitreCoverage",
    "mitreTechniques",
    "mitreTactics",
    "mitreRationale",
    "mitreReferences",
    "xql",
    "biocConditions",
    "fieldMappings",
    "issues",
    "logic"
  ];
  const rows = analyzedItems().map((item) => [
    item.name,
    item.type,
    item.s1qlVersion || "auto",
    item.s1ql.detectedVersion,
    item.s1ql.status,
    item.s1ql.findings.map((finding) => `${finding.level}: ${finding.title} - ${finding.detail}`).join(" | "),
    item.severity,
    item.scope,
    item.owner,
    item.status,
    item.target,
    item.risk,
    item.confidence,
    item.translation.complexity,
    item.recommendedWork,
    item.mitre.coverage,
    item.mitre.matches.map((match) => `${match.id} ${match.displayName} (${match.confidence})`).join(" | "),
    unique(item.mitre.matches.flatMap((match) => match.tactics)).join(" | "),
    item.mitre.matches.map((match) => match.rationale).join(" | "),
    item.mitre.matches.map((match) => match.reference).join(" | "),
    item.translation.xql,
    item.translation.biocConditions.join(" | "),
    item.translation.fieldMap.map((field) => `${field.source}->${field.cortex} (${field.confidence})`).join(" | "),
    item.translation.issues.map((issue) => `${issue.level}: ${issue.text}`).join(" | "),
    item.logic
  ].map(csvCell).join(","));
  download("s1-to-cortex-migration-matrix.csv", [headers.join(","), ...rows].join("\n"), "text/csv");
}

function exportJson() {
  download("s1-to-cortex-migration-matrix.json", JSON.stringify(analyzedItems(), null, 2), "application/json");
}

function exportCurrentTranslation() {
  const draft = analyzeItem(currentDraftItem());
  download("cortex-translation-draft.json", JSON.stringify(draft, null, 2), "application/json");
}

async function copyCurrentXql() {
  const xql = analyzeItem(currentDraftItem()).translation.xql;
  try {
    await navigator.clipboard.writeText(xql);
    copyXqlButton.textContent = "Copied";
    setTimeout(() => {
      copyXqlButton.textContent = "Copy XQL";
    }, 1400);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(xqlPreview);
    selection.removeAllRanges();
    selection.addRange(range);
    copyXqlButton.textContent = "Selected";
    setTimeout(() => {
      copyXqlButton.textContent = "Copy XQL";
    }, 1400);
  }
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function sourceLabel(type) {
  return {
    star: "STAR",
    hunt: "Deep Visibility",
    exclusion: "Exclusion",
    ioc: "IOC"
  }[type] || type;
}

function riskClass(risk) {
  return `risk-${String(risk).toLowerCase()}`;
}

function confidenceClass(confidence) {
  return `confidence-${String(confidence).toLowerCase()}`;
}

function listHtml(itemsToRender) {
  return itemsToRender.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function s1qlHtml(s1ql) {
  const classes = {
    Error: "validation-error",
    Warning: "validation-warning",
    Info: "validation-info",
    Ok: "validation-ok"
  };

  const header = `
    <article class="validation-item ${s1ql.status === "Invalid" ? "validation-error" : s1ql.status === "Valid with warnings" ? "validation-warning" : "validation-ok"}">
      <strong>${escapeHtml(s1ql.status)}</strong>
      <small>${escapeHtml(s1ql.summary)}</small>
    </article>
  `;

  const findings = s1ql.findings.map((finding) => `
    <article class="validation-item ${classes[finding.level] || "validation-info"}">
      <strong>${escapeHtml(finding.level)}: ${escapeHtml(finding.title)}</strong>
      <p>${escapeHtml(finding.detail)}</p>
    </article>
  `).join("");

  return header + findings;
}

function mitreHtml(mitre) {
  if (!mitre.matches.length) {
    return `
      <p class="empty-note">${escapeHtml(mitre.notes[0] || "No ATT&CK correlation detected.")}</p>
    `;
  }

  return mitre.matches.map((match) => `
    <article class="mitre-card">
      <strong><a href="${escapeHtml(match.reference)}" target="_blank" rel="noreferrer">${escapeHtml(match.id)}</a> ${escapeHtml(match.displayName)}</strong>
      <small>${escapeHtml(match.tactic)} / ${escapeHtml(match.confidence)} confidence</small>
      <p>${escapeHtml(match.rationale)}</p>
    </article>
  `).join("");
}

function primaryMitreLabel(mitre) {
  const primary = mitre.matches[0];
  if (!primary) return "MITRE: needs analyst mapping";
  return `MITRE: ${primary.id} ${primary.subtechnique || primary.technique}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

form.addEventListener("submit", addItem);
document.querySelector("#import-file").addEventListener("change", (event) => importFile(event.target.files?.[0]));
document.querySelector("#load-demo").addEventListener("click", () => {
  items = [...demoItems.map((item) => ({ ...item, id: makeId() }))];
  saveItems();
  render();
});
document.querySelector("#clear-items").addEventListener("click", () => {
  items = [];
  saveItems();
  render();
  detailsPanel.hidden = true;
});
document.querySelector("#export-csv").addEventListener("click", exportCsv);
document.querySelector("#export-json").addEventListener("click", exportJson);
document.querySelector("#close-details").addEventListener("click", () => {
  detailsPanel.hidden = true;
});
copyXqlButton.addEventListener("click", copyCurrentXql);
exportTranslationButton.addEventListener("click", exportCurrentTranslation);

Object.values(fields).forEach((field) => field.addEventListener("input", renderTranslationPreview));
Object.values(filters).forEach((filter) => filter.addEventListener("input", renderMatrix));

matrixBody.addEventListener("change", (event) => {
  const select = event.target.closest("[data-status-id]");
  if (!select) return;
  const item = items.find((candidate) => candidate.id === select.dataset.statusId);
  if (!item) return;
  item.status = select.value;
  saveItems();
  render();
});

matrixBody.addEventListener("click", (event) => {
  const detailsButton = event.target.closest("[data-details-id]");
  const deleteButton = event.target.closest("[data-delete-id]");

  if (detailsButton) {
    showDetails(detailsButton.dataset.detailsId);
  }

  if (deleteButton) {
    items = items.filter((item) => item.id !== deleteButton.dataset.deleteId);
    saveItems();
    render();
    detailsPanel.hidden = true;
  }
});

render();
