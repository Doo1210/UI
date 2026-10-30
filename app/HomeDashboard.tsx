"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { FeatureId } from "./FeatureIntroduction";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BellRing,
  Box,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Database,
  GitFork,
  History,
  LayoutDashboard,
  Network,
  PanelsTopLeft,
  ScanEye,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type PlatformId = "ontology" | "vision" | "timeseries" | "design";
export type PlatformStatus = "active" | "available" | "pending";

export type IndustrialPlatform = {
  id: PlatformId;
  title: string;
  shortName: string;
  icon: LucideIcon;
  descriptor: string;
  summary: string;
  keywords: string[];
  features: string[];
  accent: string;
  navigation: { label: string; icon: LucideIcon }[];
};

export const industrialPlatforms: IndustrialPlatform[] = [
  {
    id: "ontology",
    title: "本体平台",
    shortName: "本体",
    icon: Network,
    descriptor: "连接工业对象",
    summary: "建立设备、产线与业务对象之间的关系，让专家和工作流理解现场上下文。",
    keywords: ["对象关系", "知识网络", "数据视图"],
    features: ["建立统一的工业对象与关系", "把设备上下文提供给专家和工作流", "在对象视角查看相关数据与规则"],
    accent: "ontology",
    navigation: [
      { label: "本体智能体", icon: BadgeCheck },
      { label: "知识网络", icon: Network },
      { label: "连接管理", icon: Database },
      { label: "扫描管理", icon: ScanEye },
      { label: "数据视图", icon: LayoutDashboard },
    ],
  },
  {
    id: "vision",
    title: "视觉平台",
    shortName: "视觉",
    icon: ScanEye,
    descriptor: "看见现场变化",
    summary: "管理视觉检测任务与告警，让图像结果进入可追踪的业务处置流程。",
    keywords: ["视觉设备", "检测任务", "告警证据"],
    features: ["接入视频与图像设备", "管理检测任务和算法", "将检测告警连接到事件中心"],
    accent: "vision",
    navigation: [
      { label: "视觉概览", icon: LayoutDashboard },
      { label: "设备管理", icon: ScanEye },
      { label: "检测任务", icon: Workflow },
      { label: "告警记录", icon: BellRing },
    ],
  },
  {
    id: "timeseries",
    title: "时序平台",
    shortName: "时序",
    icon: Activity,
    descriptor: "读懂设备趋势",
    summary: "汇集测点与指标，查看时间窗内的变化，发现异常并触发后续任务。",
    keywords: ["测点指标", "趋势分析", "异常检测"],
    features: ["管理测点和时序指标", "按设备与时间窗分析趋势", "把异常转为事件和工作流任务"],
    accent: "timeseries",
    navigation: [
      { label: "时序概览", icon: LayoutDashboard },
      { label: "测点管理", icon: CircleDot },
      { label: "趋势分析", icon: Activity },
      { label: "异常检测", icon: BellRing },
    ],
  },
  {
    id: "design",
    title: "设计平台",
    shortName: "设计",
    icon: Box,
    descriptor: "连接设计与执行",
    summary: "围绕设计对象、版本和审查任务组织工作，并与专家和流程协同。",
    keywords: ["设计对象", "版本管理", "审查任务"],
    features: ["查看设计对象及其版本", "跟踪审查和协作任务", "将设计结果带入后续流程"],
    accent: "design",
    navigation: [
      { label: "设计概览", icon: LayoutDashboard },
      { label: "设计项目", icon: Box },
      { label: "版本管理", icon: GitFork },
      { label: "审查任务", icon: CheckCircle2 },
    ],
  },
];

type UsageRange = "today" | "week" | "month" | "halfyear";
const usageRanges: { key: UsageRange; label: string }[] = [
  { key: "today", label: "今日" },
  { key: "week", label: "近7日" },
  { key: "month", label: "近30日" },
  { key: "halfyear", label: "近180日" },
];
const demoUsage: Record<UsageRange, { experts: number; workflows: number }> = {
  today: { experts: 42, workflows: 27 },
  week: { experts: 328, workflows: 216 },
  month: { experts: 1386, workflows: 924 },
  halfyear: { experts: 8420, workflows: 5680 },
};
const demoTokens: Record<UsageRange, number> = { today: 64000, week: 526000, month: 2280000, halfyear: 13800000 };

const statusContent: Record<PlatformStatus, string> = {
  active: "已开通",
  available: "未开通",
  pending: "审批中",
};

export function HomeDashboard({
  organization,
  role,
  statuses,
  onNavigate,
  onOpenPlatform,
  onEnterPlatform,
  highCodeStatus,
  onOpenFeature,
  onReturnLegacy,
}: {
  organization: string;
  role: "system" | "org" | "operator" | "user";
  statuses: Record<PlatformId, PlatformStatus>;
  onNavigate: (label: string) => void;
  onOpenPlatform: (id: PlatformId) => void;
  onEnterPlatform: (id: PlatformId) => void;
  highCodeStatus: PlatformStatus;
  onOpenFeature: (id: FeatureId) => void;
  onReturnLegacy: () => void;
}) {
  const overviewRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = overviewRef.current;
    if (!element) return;
    let frame = 0;
    const fit = () => {
      element.style.removeProperty("--overview-height");
      if (window.innerWidth < 1181 || window.innerHeight < 800) return;
      const top = element.getBoundingClientRect().top;
      const available = Math.max(1, window.innerHeight - top - 16);
      element.style.setProperty("--overview-height", `${available}px`);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit); };
    let lastWidth = 0;
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (width !== lastWidth) { lastWidth = width; schedule(); }
    });
    if (element.parentElement) observer.observe(element.parentElement);
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(schedule);
    fit();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", schedule); };
  }, []);
  const [usageRange, setUsageRange] = useState<UsageRange>("month");
  const [tokenRange, setTokenRange] = useState<UsageRange>("month");
  const canSwitchScope = role === "system" || role === "org";
  const [selectedScope, setSelectedScope] = useState<"all" | "personal">(canSwitchScope ? "all" : "personal");
  const scope = canSwitchScope ? selectedScope : "personal";
  const allScopeLabel = role === "system" ? "全平台" : "全组织";
  const scopeLabel = scope === "personal" ? "个人" : allScopeLabel;
  const activeCount = industrialPlatforms.filter((platform) => statuses[platform.id] === "active").length;
  const organizationScale = organization === "--- 系统 ---" ? 1 : organization === "测试" ? .45 : organization === "测试 - 测试1" ? .22 : .11;
  const scopeScale = scope === "personal" ? organizationScale * .25 : role === "system" ? 1 : organizationScale;
  const scaled = (value: number) => Math.max(1, Math.round(value * scopeScale));
  const formatCount = (value: number) => new Intl.NumberFormat("zh-CN").format(scaled(value));
  const tokenTotal = scaled(demoTokens[tokenRange]);
  const tokenDisplay = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(tokenTotal);
  const resources = [
    { label: "技能", count: 36, icon: Sparkles, destination: "资源库" },
    { label: "MCP", count: 14, icon: Network, destination: "资源库" },
    { label: "插件", count: 21, icon: Box, destination: "资源库" },
    { label: "知识库", count: 12, icon: Database, destination: "知识中心" },
  ];

  return (
    <div className="home-page" ref={overviewRef}>
      <section className="overview-hero" aria-label="平台总览"><div className="overview-hero-copy"><span className="overview-eyebrow">元景·万悟工业智能体平台</span><div className="overview-title-row"><h2>连接专业能力，让智能应用落地。</h2><button className="home-version-switch" onClick={onReturnLegacy} title="切换到旧版页面（原型）"><History size={13} />返回旧版</button></div></div></section>
      <div className="home-core-area">
        <section className="home-work-panel" aria-labelledby="home-work-title">
          <div className="home-panel-head"><div className="home-overview-title"><h1 id="home-work-title">应用概况</h1>{canSwitchScope && <div className="home-scope-switch" role="group" aria-label="应用概况与可用资源统计范围">{[{ value: "all", label: allScopeLabel }, { value: "personal", label: "个人" }].map(item => <button key={item.value} aria-pressed={scope === item.value} aria-controls="home-work-metrics home-resource-stats" onClick={() => setSelectedScope(item.value as "all" | "personal")}>{item.label}</button>)}</div>}</div></div>
          <div className="home-statistics-body" id="home-work-metrics">
            <section className="home-statistics-group home-app-group" aria-labelledby="home-inventory-title">
              <h2 id="home-inventory-title" className="home-inventory-heading">智能应用</h2>
              <div className="home-inventory-metrics">
                <button onClick={() => onNavigate("专家")}><BadgeCheck size={17} /><span>专家</span><strong>{formatCount(24)}</strong></button>
                <button onClick={() => onNavigate("工作流")}><Workflow size={17} /><span>工作流</span><strong>{formatCount(18)}</strong></button>
              </div>
            </section>
            <section className="home-statistics-group home-usage-group" aria-labelledby="home-usage-title">
              <div className="home-usage-heading"><h2 id="home-usage-title">使用次数</h2><div className="home-range-switch" role="group" aria-label="使用次数时间范围">{usageRanges.map(range => <button key={range.key} className={usageRange === range.key ? "active" : ""} aria-pressed={usageRange === range.key} aria-controls="home-usage-values" onClick={() => setUsageRange(range.key)}>{range.label}</button>)}</div></div>
              <div className="home-usage-metrics" id="home-usage-values"><div><span>专家调用</span><strong>{formatCount(demoUsage[usageRange].experts)}</strong><small>次</small></div><div><span>工作流执行</span><strong>{formatCount(demoUsage[usageRange].workflows)}</strong><small>次</small></div></div>
            </section>
            <section className="home-statistics-group home-token-group" aria-labelledby="home-token-title">
              <div className="home-usage-heading"><h2 id="home-token-title">Token消耗</h2><div className="home-range-switch" role="group" aria-label="Token消耗时间范围">{usageRanges.map(range => <button key={range.key} className={tokenRange === range.key ? "active" : ""} aria-pressed={tokenRange === range.key} aria-controls="home-token-values" onClick={() => setTokenRange(range.key)}>{range.label}</button>)}</div></div>
              <div className="home-token-metric" id="home-token-values"><span>消耗总量</span><div><strong title={`${formatCount(demoTokens[tokenRange])} Tokens`}>{tokenDisplay}</strong><small>Tokens</small></div></div>
            </section>
          </div>
        </section>

      <section className="home-resources" aria-labelledby="home-resources-title">
        <div className="home-resources-title"><div><h2 id="home-resources-title">可用资源</h2></div><span>{scopeLabel}</span></div>
        <div className="home-resource-grid" id="home-resource-stats">{resources.map((item) => { const Icon = item.icon; return <button key={item.label} onClick={() => onNavigate(item.destination)}><span className="home-resource-icon"><Icon size={17} /></span><span>{item.label}</span><strong>{formatCount(item.count)}</strong><ChevronRight size={14} /></button>; })}</div>
      </section>
      </div>

      <section className="home-advanced-services" aria-labelledby="home-advanced-title">
        <h2 id="home-advanced-title">高级功能</h2>
        <div className="home-advanced-grid">
          <button onClick={() => onOpenFeature("runtime")}><Box size={20} /><span><strong>智能体运行时 <small>{statusContent[highCodeStatus]}</small></strong><span>部署和管理高代码智能体</span></span><ArrowRight size={15} /></button>
          <button onClick={() => onOpenFeature("sdk")}><Code2 size={20} /><span><strong>软件开发套件</strong><span>开发指南与代码集成示例</span></span><ArrowRight size={15} /></button>
          <button onClick={() => onOpenFeature("lowcode")}><PanelsTopLeft size={20} /><span><strong>低代码 UI</strong><span>构建业务界面，绑定多个工作流</span></span><ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="home-platforms" aria-labelledby="home-platforms-title">
        <div className="home-section-head">
          <div><h2 id="home-platforms-title">工业引擎</h2><p>让专业平台的能力，融入你的业务流程。</p></div>
          <span className="platform-count">已开通 <strong>{activeCount}</strong> / {industrialPlatforms.length}</span>
        </div>
        <div className="home-platform-grid">
          {industrialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const status = statuses[platform.id];
            const mainAction = status === "active" ? "进入平台" : "查看介绍";
            return (
              <article key={platform.id} className={`home-platform-card ${platform.accent}`}>
                <button className="platform-card-hitarea" onClick={() => status === "active" ? onEnterPlatform(platform.id) : onOpenPlatform(platform.id)} aria-label={`${platform.title}，${statusContent[status]}，${mainAction}`} />
                <div className="platform-card-main">
                  <span className="platform-card-top"><span className="platform-card-icon"><Icon size={25} strokeWidth={1.7} /></span><span className={`platform-status ${status}`}>{statusContent[status]}</span></span>
                  <span className="platform-card-copy"><span className="platform-descriptor">{platform.descriptor}</span><span className="platform-card-title">{platform.title}</span><span className="platform-card-description">{platform.summary}</span></span>
                </div>
                <button className="platform-card-action" onClick={() => onOpenPlatform(platform.id)} aria-label={`查看${platform.title}介绍`}>查看介绍<ArrowRight size={15} /></button>
              </article>
            );
          })}
        </div>
      </section>

    </div>
  );
}

export function IndustrialWorkspace({ platform, section }: { platform: IndustrialPlatform; section: string }) {
  const Icon = platform.icon;
  return (
    <div className="industrial-workspace">
      <div className="workspace-topline"><span>{platform.title}</span><ChevronRight size={14} /><strong>{section}</strong></div>
      <div className="workspace-intro"><span className={`workspace-icon ${platform.accent}`}><Icon size={26} /></span><div><span className="home-eyebrow">PLATFORM WORKSPACE</span><h1>{section}</h1><p>{platform.summary}</p></div></div>
      <div className="workspace-feature-grid">{platform.features.map((feature, index) => <article key={feature}><span>0{index + 1}</span><h2>{feature}</h2><p>在{platform.title}中查看与管理相关内容，并与主平台的专家、工作流和事件协同。</p></article>)}</div>
    </div>
  );
}
