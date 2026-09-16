export type HDLLanguage = 'Verilog' | 'SystemVerilog' | 'VHDL';

export interface TargetDevice {
  vendor: string;
  family: string;
  part: string;
  package?: string;
  speedGrade?: string;
  lutCount?: number;
  ffCount?: number;
  bramCount?: number;
  dspCount?: number;
}

export interface ClockConstraint {
  name: string;
  periodNs: number;
  port: string;
}

export interface ToolchainConfig {
  synthesis: 'yosys' | 'vendor' | 'custom';
  simulation: 'icarus' | 'verilator' | 'vendor' | 'custom';
  placeAndRoute: 'nextpnr' | 'vpr' | 'vendor' | 'custom';
  programmer: 'openfpgaloader' | 'iceprog' | 'ecpprog' | 'vendor' | 'custom';
}

export interface ProjectManifest {
  name: string;
  version: string;
  topModule: string;
  language: HDLLanguage;
  sources: string[];
  simulationSources: string[];
  constraints: string[];
  target: TargetDevice;
  board?: string;
  toolchain: ToolchainConfig;
  synthesisSettings?: Record<string, any>;
  implementationSettings?: Record<string, any>;
}

export type Severity = 'INFO' | 'WARNING' | 'ERROR' | 'FATAL';

export interface DiagnosticMessage {
  id: string;
  severity: Severity;
  tool: string;
  stage: string;
  file?: string;
  line?: number;
  column?: number;
  message: string;
  possibleCause?: string;
  rawLine?: string;
}

export interface ResourceMetric {
  used: number;
  available: number;
  percentage: number;
}

export interface ResourceUtilization {
  luts: ResourceMetric;
  flipFlops: ResourceMetric;
  bram: ResourceMetric;
  dsp: ResourceMetric;
  io: ResourceMetric;
  primitives?: Record<string, number>;
  hierarchical?: Record<string, any>;
}

export interface TimingPathElement {
  type: 'FF' | 'LUT' | 'BRAM' | 'NET' | 'IO';
  name: string;
  delayNs: number;
}

export interface TimingPath {
  source: string;
  destination: string;
  slackNs: number;
  requiredNs: number;
  actualNs: number;
  logicDepth: number;
  elements: TimingPathElement[];
}

export interface TimingSummary {
  clockName: string;
  requiredNs: number;
  actualNs: number;
  slackNs: number;
  worstPaths: TimingPath[];
}

export type BuildStage =
  | 'SOURCE_ANALYSIS'
  | 'ELABORATION'
  | 'ELABORATE'
  | 'SYNTHESIS'
  | 'SYNTHESIZE'
  | 'NETLIST'
  | 'PACK'
  | 'PLACE'
  | 'ROUTE'
  | 'TIMING'
  | 'BITSTREAM'
  | 'PROGRAM'
  | 'PARSE'
  | 'SIMULATE';

export type BuildStatus = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'CANCELLED';

// Strongly Typed Build Artifact Models
export interface BaseArtifact {
  path: string;
  type: string;
  hash: string;
  generatedAt: string;
  tool: string;
  toolVersion?: string;
  device?: string;
  buildId: string;
  sizeBytes?: number;
}

export interface SourceArtifact extends BaseArtifact {
  type: 'SOURCE';
  language: HDLLanguage;
}

export interface NetlistArtifact extends BaseArtifact {
  type: 'NETLIST';
  format: 'JSON' | 'VERILOG';
  cellCount: number;
}

export interface PlacementArtifact extends BaseArtifact {
  type: 'PLACEMENT';
  format: 'ASC' | 'CONFIG';
  utilizationSummary: ResourceUtilization;
}

export interface RoutingArtifact extends BaseArtifact {
  type: 'ROUTING';
  format: 'ASC' | 'CONFIG';
}

export interface TimingArtifact extends BaseArtifact {
  type: 'TIMING';
  summary: TimingSummary;
  passed: boolean;
}

export interface BitstreamArtifact extends BaseArtifact {
  type: 'BITSTREAM';
  format: 'BIN' | 'BIT';
  checksum: string;
}

export interface BuildStageResult {
  stage: BuildStage;
  status: BuildStatus;
  durationMs: number;
  stdout: string;
  stderr: string;
  diagnostics: DiagnosticMessage[];
  outputFiles: string[];
  artifacts?: BaseArtifact[];
}

export interface BuildResult {
  buildId: string;
  timestamp: string;
  status: BuildStatus;
  stages: Partial<Record<BuildStage, BuildStageResult>>;
  utilization?: ResourceUtilization;
  timing?: TimingSummary;
  bitstreamPath?: string;
}

export interface BoardDefinition {
  id: string;
  name: string;
  manufacturer?: string;
  fpga: TargetDevice;
  clockMHz: number;
  clockPin: string;
  pins: Record<string, { pin: string; ioStandard: string; description?: string }>;
  leds?: Record<string, string>;
  buttons?: Record<string, string>;
  uart?: { txPin: string; rxPin: string; baudRate: number };
  programmer?: string;
}

export type EventType =
  | 'PROJECT_OPENED'
  | 'PROJECT_SAVED'
  | 'SOURCE_CHANGED'
  | 'BUILD_STARTED'
  | 'BUILD_STAGE_STARTED'
  | 'BUILD_STAGE_COMPLETED'
  | 'BUILD_STAGE_FAILED'
  | 'ELABORATION_STARTED'
  | 'ELABORATION_COMPLETED'
  | 'SYNTHESIS_STARTED'
  | 'SYNTHESIS_COMPLETED'
  | 'PLACEMENT_STARTED'
  | 'PLACEMENT_COMPLETED'
  | 'ROUTING_STARTED'
  | 'ROUTING_COMPLETED'
  | 'TIMING_STARTED'
  | 'TIMING_COMPLETED'
  | 'BITSTREAM_STARTED'
  | 'BITSTREAM_CREATED'
  | 'HARDWARE_CONNECTED'
  | 'HARDWARE_DISCONNECTED'
  | 'PROGRAMMING_STARTED'
  | 'PROGRAMMING_COMPLETED';

export type EventCallback = (payload: any) => void;
