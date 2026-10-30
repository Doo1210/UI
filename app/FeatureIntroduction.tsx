"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ArrowRight, Box, CheckCircle2, Code2, FileCode2, Layers, PanelsTopLeft, Play, ShieldCheck, Terminal, Workflow, X } from "lucide-react";
import type { PlatformStatus } from "./HomeDashboard";
import type { PlatformApplication } from "./PlatformIntroduction";

export type FeatureId = "runtime" | "sdk" | "lowcode";
const features = {
  runtime: {
    title: "智能体运行时", icon: Box, label: "部署与托管", headline: "把代码交付为可运行的智能体服务。",
    description: "面向自定义代码开发的智能体，集中部署、管理运行实例与镜像，提供容器化运行环境。",
    audience: "高代码开发人员 · 部署与运维人员", action: "进入运行时",
    capabilities: [
      { title: "部署自定义智能体", text: "通过镜像或 YAML 配置描述运行环境，管理部署版本。", icon: FileCode2 },
      { title: "查看实例状态", text: "查看实例、Pod 就绪情况与运行日志，辅助定位部署问题。", icon: Terminal },
      { title: "管理运行资源", text: "围绕实例调整副本与扩缩容配置，管理关联镜像。", icon: Layers },
    ],
    steps: [["准备代码与镜像", "完成智能体代码开发，准备运行镜像和配置。"], ["配置与部署", "选择镜像版本，填写资源、端口和环境配置。"], ["验证运行状态", "检查实例与访问入口，再按需调整运行资源。"]],
    scenario: "托管设备数据处理智能体", scenarioText: "已有自定义 Python 处理程序，需要稳定运行并提供业务调用入口。通过运行时管理部署和版本；若需被专家或工作流调用，再将开放接口登记为可调用工具。",
    boundary: "运行时管理容器与实例；专家和工作流的业务质量分析仍在智能应用洞察中完成。",
  },
  sdk: {
    title: "软件开发套件", icon: Code2, label: "代码集成", headline: "用熟悉的代码，连接专家与工作流。",
    description: "面向业务系统集成与自定义开发，通过开发指南和调用示例，了解认证、输入输出与执行结果处理。",
    audience: "应用开发人员 · 系统集成人员", action: "查看开发指南",
    capabilities: [
      { title: "了解接入方式", text: "梳理服务地址、凭证、组织范围与权限，明确调用前提。", icon: ShieldCheck },
      { title: "集成专家与工作流", text: "参考输入参数、输出结果与错误处理示例组织业务调用。", icon: Code2 },
      { title: "参考示例项目", text: "从具体业务场景了解请求与结果处理的完整路径。", icon: FileCode2 },
    ],
    steps: [["确认授权范围", "确定目标组织、可调用对象和凭证管理方式。"], ["参考接入示例", "了解输入结构，将业务字段映射为请求参数。"], ["处理业务结果", "结合执行状态处理返回结果、异常和后续动作。"]],
    scenario: "将诊断能力接入设备管理系统", scenarioText: "业务系统提交设备信息，调用诊断专家或工作流，再将分析结果展示给现场人员。先通过示例明确数据结构，正式接入时再核对真实接口契约。",
    boundary: "当前展示接入方案与伪代码，不代表已有可下载 SDK、真实接口地址或已开放的生产 API。",
  },
  lowcode: {
    title: "低代码 UI", icon: PanelsTopLeft, label: "业务界面搭建", headline: "一个业务界面，承载多个工作流。",
    description: "围绕业务人员的操作搭建界面，将查询、提交与复核等不同动作分别连接工作流。界面与工作流独立管理。",
    audience: "业务应用搭建人员 · 流程开发人员", action: "进入 UI 工作台",
    capabilities: [
      { title: "组织业务界面", text: "以表单、数据展示与操作按钮组织业务人员的日常操作。", icon: PanelsTopLeft },
      { title: "绑定多个工作流", text: "一个界面关联多条工作流，不同业务动作可分别调用。", icon: Workflow },
      { title: "对齐数据与权限", text: "发布前核对输入输出映射、工作流版本和使用权限。", icon: ShieldCheck },
    ],
    steps: [["创建界面应用", "围绕业务任务命名应用，组织页面和业务操作。"], ["关联多个工作流", "按查询、提交和复核等动作选择关联工作流。"], ["核对与发布", "确认数据映射、授权和版本后，再向业务人员开放。"]],
    scenario: "搭建设备运维工作台", scenarioText: "同一页面中，异常上报连接处置流程，质量复核连接质检流程，资料更新连接知识审核流程。业务人员使用统一界面，后台工作流各自维护。",
    boundary: "当前工作台可演示多工作流绑定；可视化编辑器、输入输出映射与正式发布仍为规划内容。",
  },
};

function FeaturePreview({ id }: { id: FeatureId }) {
  const [language, setLanguage] = useState("Python");
  const [bindings, setBindings] = useState(["设备异常处置", "视觉质检复核"]);
  const [result, setResult] = useState("");
  const code = language === "Python" ? '# 调用结构示意，非可运行 SDK\nrequest = {\n  "target": "设备故障诊断专家",\n  "inputs": {"device": "AC-102"}\n}\n# 获取执行结果 → 回写业务系统' : '// 调用结构示意，非可运行 SDK\nconst request = {\n  target: "设备故障诊断专家",\n  inputs: { device: "AC-102" }\n};\n// 获取执行结果 → 回写业务系统';
  return <div className="afi-preview"><div className="afi-preview-head"><span>{id === "runtime" ? "运行实例概览" : id === "sdk" ? "接入示例" : "设备运维工作台"}</span><small>交互示例</small></div>
    {id === "runtime" ? <><div className="afi-instances">{[["设备数据处理 Agent", "v1.2 · Pods 2 / 2"], ["文档解析 Agent", "v2.0 · Pods 1 / 1"]].map(([name, detail]) => <div key={name}><Box size={18} /><span><strong>{name}</strong><small>{detail}</small></span><em>运行中</em></div>)}</div><div className="afi-terminal"><span>$ 查看部署日志 · 模拟</span><code>[09:42:11] 镜像已拉取<br />[09:42:13] 应用进程启动<br />[09:42:15] 就绪检查通过</code></div></> : id === "sdk" ? <><div className="afi-language" role="group" aria-label="代码示例语言">{["Python", "JavaScript"].map(item => <button key={item} aria-pressed={language === item} onClick={() => setLanguage(item)}>{item}</button>)}</div><pre className="afi-code"><code>{code}</code></pre><div className="afi-code-note">示意请求结构，需按实际接口文档实现。</div></> : <><div className="afi-ui-form"><label>设备编号<input readOnly value="AC-102 · 空压机" /></label><span>关联工作流（点击切换）</span><div className="afi-binding-options">{["设备异常处置", "视觉质检复核", "知识更新审核"].map(item => <button key={item} aria-pressed={bindings.includes(item)} onClick={() => { setBindings(items => items.includes(item) ? items.filter(value => value !== item) : [...items, item]); setResult(""); }}>{bindings.includes(item) ? <CheckCircle2 size={13} /> : <Workflow size={13} />}{item}</button>)}</div><button className="afi-run-example" disabled={bindings.length === 0} onClick={() => setResult(`已模拟提交，关联 ${bindings.length} 个工作流；未执行真实任务。`)}><Play size={13} />模拟提交</button><p role="status">{result || `当前关联 ${bindings.length} 个工作流`}</p></div></>}
    <div className="afi-preview-note">原型模拟内容 · 不代表真实运行数据</div>
  </div>;
}

export function FeatureIntroduction({ id, organization, status, canActivate, canEnter, application, onBack, onEnter, onRequest, onActivate }: {
  id: FeatureId; organization: string; status: PlatformStatus; canActivate: boolean; canEnter: boolean; application?: PlatformApplication;
  onBack: () => void; onEnter: () => void; onRequest: (application: PlatformApplication) => void; onActivate: () => void;
}) {
  const feature = features[id];
  const Icon = feature.icon;
  const isRuntime = id === "runtime";
  const statusLabel = !isRuntime ? "可使用" : status === "active" ? "已开通" : status === "pending" ? "审批中" : "未开通";
  const [requestOpen, setRequestOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [purpose, setPurpose] = useState("");
  const [contact, setContact] = useState("");
  const [applicant, setApplicant] = useState("林雨晴");
  useEffect(() => { if (requestOpen) dialog.current?.showModal(); else dialog.current?.close(); }, [requestOpen]);
  const blocked = isRuntime && status === "active" && !canEnter;
  return <div className="pi-page afi-page">
    <header className="pi-topbar"><div className="pi-banner-inner"><button className="intro-back" onClick={onBack}><ChevronLeft size={20} />返回总览</button><div className="pi-banner-platform"><span className="pi-banner-logo"><Icon size={22} /></span><h1>{feature.title}</h1><span className={`platform-status ${isRuntime ? status : "active"}`}>{statusLabel}</span></div><div className="pi-banner-actions"><button className="home-button primary" disabled={blocked} onClick={() => isRuntime && status !== "active" ? setRequestOpen(true) : onEnter()}>{blocked ? "需使用权限" : isRuntime && status === "available" ? "申请开通" : isRuntime && status === "pending" ? "查看申请" : feature.action}<ArrowRight size={15} /></button>{isRuntime && status === "pending" && canActivate && <button className="pi-approval-button" onClick={onActivate}>模拟审批通过</button>}</div></div></header>
    <section className="afi-hero"><div><span className="afi-label">高级功能 / {feature.label}</span><h2>{feature.headline}</h2><p>{feature.description}</p><div className="afi-audience"><strong>适合谁使用</strong><span>{feature.audience}</span></div><div className="afi-access-note">{isRuntime ? blocked ? "服务已开通，请联系管理员获取使用权限。" : `${organization} · ${statusLabel} · 按组织申请` : "从顶部入口开始使用，进入现有功能工作区。"}</div></div><FeaturePreview id={id} /></section>
    <section className="afi-capabilities" aria-label="主要用途">{feature.capabilities.map(item => { const ItemIcon = item.icon; return <article key={item.title}><ItemIcon size={21} /><h3>{item.title}</h3><p>{item.text}</p></article>; })}</section>
    <section className="afi-start" aria-labelledby="afi-start-title"><div className="afi-section-head"><span>使用路径</span><h2 id="afi-start-title">从准备到使用，分三步完成</h2></div><ol>{feature.steps.map(([title, detail], index) => <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div>{index < 2 && <ArrowRight size={18} />}</li>)}</ol></section>
    <div className="afi-bottom-grid"><section className="afi-scenario"><span className="afi-label">典型场景 · 方案示例</span><h2>{feature.scenario}</h2><p>{feature.scenarioText}</p></section><aside className="afi-boundary"><h3>使用前需要了解</h3><p>{feature.boundary}</p><small>{isRuntime ? "申请、审批与运行数据仅在当前会话中演示，不会部署真实容器。" : "本页为原型演示，正式能力以接入与授权配置为准。"}</small></aside></div>
    <dialog ref={dialog} className="pi-dialog" aria-labelledby="afi-request-title" onCancel={() => setRequestOpen(false)}><div className="pi-dialog-head"><div><span className="pi-eyebrow">智能体运行时 · 组织级服务</span><h2 id="afi-request-title">{status === "pending" ? "申请已提交" : "申请开通"}</h2></div><button aria-label="关闭申请弹窗" onClick={() => setRequestOpen(false)}><X size={20} /></button></div>
      {status === "pending" ? <div className="pi-application-summary"><p role="status">审批中，请等待管理员审核。</p><dl>{[["组织", organization], ["申请人", application?.applicant ?? "林雨晴"], ["联系方式", application?.contact ?? "未记录"], ["业务用途", application?.purpose ?? "原型示例申请"], ["提交时间", application ? new Date(application.submittedAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }) : "当前会话"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><small>仅用于演示，不会发送真实开通请求。</small><button className="home-button primary" onClick={() => setRequestOpen(false)}>知道了</button></div> : <form className="pi-application-form" onSubmit={event => { event.preventDefault(); if (applicant.trim() && purpose.trim() && contact.trim()) onRequest({ applicant: applicant.trim(), purpose: purpose.trim(), contact: contact.trim(), submittedAt: new Date().toISOString() }); }}><label>申请组织<input readOnly value={organization} /></label><div className="pi-form-pair"><label>申请人<input required maxLength={40} value={applicant} onChange={event => setApplicant(event.target.value)} /></label><label>联系方式<input required maxLength={100} placeholder="手机号或邮箱" value={contact} onChange={event => setContact(event.target.value)} /></label></div><label>业务用途<textarea required rows={4} maxLength={500} placeholder="描述智能体用途与托管需求" value={purpose} onChange={event => setPurpose(event.target.value)} /></label><p>审核通过后开放运行时入口。当前为原型模拟申请。</p><div className="pi-form-actions"><button className="home-button secondary" type="button" onClick={() => setRequestOpen(false)}>取消</button><button className="home-button primary" type="submit">提交申请<ArrowRight size={15} /></button></div></form>}
    </dialog>
  </div>;
}
