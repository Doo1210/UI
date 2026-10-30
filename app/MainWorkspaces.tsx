"use client";

import { useState } from "react";
import { ArrowRight, BadgeCheck, BarChart3, Box, CheckCircle2, ChevronRight, Clock3, Code2, Cpu, Database, LibraryBig, Plus, RadioTower, Search, Workflow, type LucideIcon } from "lucide-react";

type ModuleProfile = {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  tabs: { label: string; rows: { name: string; detail: string; status: string }[] }[];
  createLabel?: string;
};

const modules: Record<string, ModuleProfile> = {
  软件开发套件: {
    title: "软件开发套件",
    eyebrow: "DEVELOPER TOOLS",
    description: "查看开发接入说明与示例，了解如何通过代码连接专家、工作流和工具。",
    icon: Code2,
    tabs: [
      { label: "开发指南", rows: [
        { name: "接入与身份认证", detail: "示例指南 · 配置服务地址与凭证，了解组织与授权范围", status: "原型示例" },
        { name: "调用专家与工作流", detail: "示例指南 · 请求参数、返回结果和异常处理", status: "原型示例" },
        { name: "自定义工具接入", detail: "示例指南 · 定义工具输入输出与调用方式", status: "原型示例" },
      ] },
      { label: "示例项目", rows: [
        { name: "专家调用示例", detail: "模拟项目 · 业务系统发起专家请求并读取结果", status: "原型示例" },
        { name: "工作流集成示例", detail: "模拟项目 · 传入业务参数并查询执行结果", status: "原型示例" },
      ] },
    ],
  },
  专家: {
    title: "专家",
    eyebrow: "INTELLIGENT APPLICATIONS",
    description: "配置具备明确职责、知识和工具的数字专家，完成试运行、发布与迭代。",
    icon: BadgeCheck,
    createLabel: "创建专家",
    tabs: [
      { label: "我的专家", rows: [
        { name: "设备故障诊断专家", detail: "设备运维 · 最近更新于今天 09:40", status: "已发布" },
        { name: "质量分析专家", detail: "质量管理 · 最近更新于昨日 16:25", status: "已发布" },
        { name: "安全生产顾问", detail: "安全生产 · 最近更新于 10 月 11 日", status: "草稿" },
      ] },
      { label: "运行记录", rows: [
        { name: "设备故障诊断 · 设备 A-102", detail: "由时序异常触发 · 今天 09:18", status: "已完成" },
        { name: "质量分析 · 产线 3", detail: "由工作流调用 · 今天 08:34", status: "已完成" },
      ] },
    ],
  },
  工作流: {
    title: "工作流",
    eyebrow: "INTELLIGENT APPLICATIONS",
    description: "设计可追踪的业务步骤，连接专家、知识、工具和工业事件。",
    icon: Workflow,
    createLabel: "创建工作流",
    tabs: [
      { label: "我的工作流", rows: [
        { name: "设备异常处置工作流", detail: "时序异常 → 专家诊断 → 维修派单", status: "已发布" },
        { name: "视觉质检闭环工作流", detail: "视觉告警 → 人工复核 → 结果回写", status: "已发布" },
        { name: "知识更新审核", detail: "数据源同步 → 变更审核 → 发布", status: "草稿" },
      ] },
      { label: "执行记录", rows: [
        { name: "设备异常处置 #1042", detail: "今天 09:18 · 4 个节点", status: "进行中" },
        { name: "视觉质检闭环 #1038", detail: "今天 08:56 · 6 个节点", status: "已完成" },
      ] },
    ],
  },
  智能体运行时: {
    title: "智能体运行时",
    eyebrow: "AGENT RUNTIME",
    description: "部署和管理托管高代码智能体，提供安全稳定的容器化运行环境。",
    icon: Box,
    tabs: [
      { label: "运行实例", rows: [
        { name: "文本处理 Agent", detail: "v4 · Pods 3/3 · 自动扩缩容 1–3", status: "运行中" },
        { name: "设备数据处理服务", detail: "v3 · Pods 1/1 · 最近部署于 10 月 12 日", status: "运行中" },
      ] },
      { label: "镜像仓库", rows: [
        { name: "tenant-1/text-agent", detail: "2 个版本 · 最近推送于 10 月 13 日", status: "已扫描" },
        { name: "tenant-1/agents-demo", detail: "6 个版本 · 最近推送于 9 月 14 日", status: "已扫描" },
      ] },
    ],
  },
  模型中心: {
    title: "模型中心",
    eyebrow: "FOUNDATION CAPABILITIES",
    description: "统一接入和管理语言、嵌入、重排及多模态模型，控制授权与配额。",
    icon: Cpu,
    tabs: [
      { label: "模型目录", rows: [
        { name: "万悟工业大模型", detail: "通用语言 · 工业问答与任务规划", status: "可用" },
        { name: "工业向量模型", detail: "嵌入模型 · 知识检索", status: "可用" },
        { name: "多模态质检模型", detail: "视觉模型 · 图像理解", status: "可用" },
      ] },
      { label: "调用与配额", rows: [
        { name: "本组织模型配额", detail: "按模型查看限额与使用情况", status: "正常" },
      ] },
    ],
  },
  知识中心: {
    title: "知识中心",
    eyebrow: "FOUNDATION CAPABILITIES",
    description: "围绕知识库、数据源和检索质量管理可被专家与工作流引用的知识。",
    icon: LibraryBig,
    tabs: [
      { label: "知识库", rows: [
        { name: "设备检修规程", detail: "182 份文档 · 最近更新于今天", status: "已发布" },
        { name: "产线质量标准", detail: "96 份文档 · 最近更新于 10 月 12 日", status: "已发布" },
      ] },
      { label: "数据源", rows: [
        { name: "设备文档同步", detail: "每天 02:00 自动更新", status: "正常" },
        { name: "质量标准导入", detail: "文件上传 · 最近同步于昨日", status: "正常" },
      ] },
      { label: "检索调试", rows: [
        { name: "检索效果检查", detail: "验证召回片段、来源和权限过滤", status: "可调试" },
      ] },
    ],
  },
  资源库: {
    title: "资源库",
    eyebrow: "FOUNDATION CAPABILITIES",
    description: "管理专家与工作流可使用的技能、MCP 服务、插件和连接器。",
    icon: Database,
    tabs: [
      { label: "技能", rows: [
        { name: "设备故障分析技能", detail: "设备运维 · v1.2", status: "已发布" },
        { name: "质量报告编写技能", detail: "质量管理 · v1.0", status: "已发布" },
      ] },
      { label: "MCP", rows: [
        { name: "企业知识检索 MCP", detail: "知识中心 · 带来源检索", status: "可用" },
        { name: "工业数据查询 MCP", detail: "数据服务 · 只读工具调用", status: "可用" },
      ] },
      { label: "插件", rows: [
        { name: "报告导出插件", detail: "文档工具 · 导出业务报告", status: "可用" },
        { name: "企业消息通知插件", detail: "通知工具 · 发送任务结果", status: "可用" },
      ] },
      { label: "连接器", rows: [
        { name: "MES 数据连接器", detail: "生产系统 · 只读查询", status: "可用" },
        { name: "OPC UA 设备接入", detail: "现场数据 · 测点订阅", status: "可用" },
      ] },
    ],
  },
  事件中心: {
    title: "事件中心",
    eyebrow: "EVENT CENTER",
    description: "集中接入外部事件，配置触发任务，并追踪专家与工作流的处理结果。",
    icon: RadioTower,
    tabs: [
      { label: "事件接入", rows: [
        { name: "视觉质检告警", detail: "Kafka · 最近触发于今天 09:12", status: "已启用" },
        { name: "设备异常 WebHook", detail: "WebHook · 最近触发于今天 08:54", status: "已启用" },
        { name: "每小时巡检", detail: "定时触发 · 下次执行 10:00", status: "已启用" },
      ] },
      { label: "事件任务", rows: [
        { name: "视觉缺陷处置", detail: "匹配视觉告警 → 质量异常工作流", status: "运行中" },
        { name: "设备异常诊断", detail: "匹配时序异常 → 设备故障诊断专家", status: "运行中" },
      ] },
      { label: "执行记录", rows: [
        { name: "视觉告警 #EV-1042", detail: "今天 09:12 · 已创建处置任务", status: "已处理" },
      ] },
    ],
  },
  智能应用洞察: {
    title: "智能应用洞察",
    eyebrow: "AGENT INSIGHTS",
    description: "观测专家与工作流的运行表现，评测输出质量，并通过版本对比持续优化。",
    icon: BarChart3,
    tabs: [
      { label: "观测", rows: [
        { name: "专家调用链", detail: "模型、工具与知识检索步骤", status: "正常" },
        { name: "工作流执行链", detail: "节点耗时、失败与重试", status: "正常" },
        { name: "设备诊断超时", detail: "异常记录 · 专家 v1.6 · 今日 09:18", status: "待分析" },
      ] },
      { label: "评测", rows: [
        { name: "设备故障诊断回归评测", detail: "42 个样本 · 专家 v1.6", status: "已完成" },
        { name: "视觉质检流程评测", detail: "18 个场景 · 工作流 v2.1", status: "已完成" },
        { name: "设备故障诊断样本集", detail: "测试集 · 专家 · 42 个测试样本", status: "可用" },
      ] },
      { label: "评优", rows: [
        { name: "设备故障诊断版本对比", detail: "专家 v1.5 → v1.6 · 质量与时延", status: "已完成" },
        { name: "视觉质检流程版本对比", detail: "工作流 v2.0 → v2.1 · 任务成功率", status: "进行中" },
        { name: "知识检索召回优化", detail: "优化建议 · 设备诊断专家 · 6 个退化样本", status: "待处理" },
      ] },
    ],
  },
};

export function MainWorkspace({ section, createIntent = false }: { section: string; createIntent?: boolean }) {
  const profile = modules[section];
  const [tab, setTab] = useState(createIntent && profile?.createLabel ? profile.createLabel : profile?.tabs[0]?.label ?? "");
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [created, setCreated] = useState<string[]>([]);
  if (!profile) return null;
  const Icon = profile.icon;
  const current = profile.tabs.find((item) => item.label === tab) ?? profile.tabs[0];
  const rows = [...created.map((item) => ({ name: item, detail: "刚刚创建 · 草稿", status: "草稿" })), ...current.rows].filter((item) => `${item.name}${item.detail}`.includes(search));
  const isCreating = tab === profile.createLabel;

  return <div className="module-workspace">
    <div className="module-heading"><div className="module-heading-icon"><Icon size={24} /></div><div><span className="home-eyebrow">{profile.eyebrow}</span><h1>{profile.title}</h1><p>{profile.description}</p></div></div>
    <div className="module-toolbar">
      <div className="module-tabs" role="group" aria-label={`${profile.title}功能切换`}>{profile.tabs.map((item) => <button key={item.label} className={tab === item.label ? "active" : ""} aria-pressed={tab === item.label} onClick={() => { setTab(item.label); setSearch(""); }}>{item.label}</button>)}</div>
      {profile.createLabel && <button className="module-create" onClick={() => { setName(""); setTab(profile.createLabel!); }}><Plus size={16} />{profile.createLabel}</button>}
    </div>
    {isCreating ? <section className="module-create-panel"><div className="module-create-symbol"><Icon size={25} /></div><h2>{profile.createLabel}</h2><p>先为{section}命名，保存草稿后继续配置能力和发布范围。</p><form onSubmit={(event) => { event.preventDefault(); if (name.trim()) { setCreated((items) => [name.trim(), ...items]); setTab(profile.tabs[0].label); setName(""); } }}><label htmlFor="module-name">名称</label><input id="module-name" value={name} onChange={(event) => setName(event.target.value)} placeholder={`请输入${section}名称`} required /><div><button type="button" onClick={() => setTab(profile.tabs[0].label)}>取消</button><button type="submit">保存草稿 <ArrowRight size={15} /></button></div></form></section>
      : <section className="module-list-panel"><div className="module-list-head"><div><h2>{current.label}</h2><span>共 {rows.length} 项</span></div><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`搜索${current.label}`} /></label></div><div className="module-rows">{rows.map((item) => <div className="module-row" key={`${current.label}-${item.name}`}><span className="module-row-icon"><Icon size={18} /></span><div><strong>{item.name}</strong><small>{item.detail}</small></div><em>{item.status}</em><ChevronRight size={16} /></div>)}{rows.length === 0 && <div className="module-empty">没有找到匹配内容，试试其他关键词。</div>}</div></section>}
    <div className="module-context"><CheckCircle2 size={16} /><span>当前展示的是用于验证导航与页面结构的原型数据。</span><Clock3 size={14} /></div>
  </div>;
}

type LowCodeApp = { id: number; name: string; status: string; bindings: string[] };
const workflowOptions = ["设备异常处置工作流", "视觉质检闭环工作流", "知识更新审核工作流"];

export function LowCodeWorkspace() {
  const [apps, setApps] = useState<LowCodeApp[]>([
    { id: 1, name: "设备运维工作台", status: "草稿", bindings: [workflowOptions[0], workflowOptions[1]] },
    { id: 2, name: "质量复核界面", status: "已发布", bindings: [workflowOptions[1]] },
  ]);
  const [activeId, setActiveId] = useState(1);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const active = apps.find((app) => app.id === activeId) ?? apps[0];
  const toggleBinding = (workflow: string) => setApps((items) => items.map((app) => app.id === active.id ? { ...app, bindings: app.bindings.includes(workflow) ? app.bindings.filter((item) => item !== workflow) : [...app.bindings, workflow] } : app));
  const addApp = () => {
    const name = newName.trim();
    if (!name) return;
    const id = Date.now();
    setApps((items) => [{ id, name, status: "草稿", bindings: [] }, ...items]);
    setActiveId(id);
    setNewName("");
    setCreating(false);
  };

  return <div className="module-workspace lowcode-workspace">
    <div className="module-heading"><div className="module-heading-icon"><Workflow size={24} /></div><div><span className="home-eyebrow">INTELLIGENT APPLICATIONS</span><h1>低代码 UI</h1><p>设计面向业务人员的界面，一个界面应用可绑定多个工作流。</p></div></div>
    <div className="lowcode-columns">
      <section className="lowcode-app-list" aria-label="界面应用列表">
        <div className="lowcode-section-head"><div><span>界面应用</span><strong>{apps.length}</strong></div><button aria-label="创建界面应用" onClick={() => setCreating(true)}><Plus size={16} /></button></div>
        {creating && <form className="lowcode-create-form" onSubmit={(event) => { event.preventDefault(); addApp(); }}><label htmlFor="lowcode-name">应用名称</label><input id="lowcode-name" value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="输入界面名称" /><div><button type="button" onClick={() => setCreating(false)}>取消</button><button type="submit">创建</button></div></form>}
        {apps.map((app) => <button key={app.id} className={`lowcode-app-item ${app.id === activeId ? "active" : ""}`} onClick={() => setActiveId(app.id)}><span><strong>{app.name}</strong><small>{app.bindings.length} 个已绑定工作流 · {app.status}</small></span><ChevronRight size={16} /></button>)}
      </section>
      <div className="lowcode-detail">
        <section className="lowcode-preview" aria-labelledby="lowcode-preview-title"><div className="lowcode-detail-head"><div><span className="home-eyebrow">UI PREVIEW</span><h2 id="lowcode-preview-title">{active.name}</h2></div><span className="lowcode-state">{active.status}</span></div><div className="lowcode-preview-canvas"><div className="lowcode-preview-toolbar">业务操作界面 <span>预览</span></div><div className="lowcode-preview-body"><strong>发起业务任务</strong><span>选择现场对象，填写必要信息后调用已绑定工作流。</span><div className="lowcode-preview-field">设备或产线 <span>选择对象</span></div><div className="lowcode-preview-field">任务说明 <span>输入内容</span></div><div className="lowcode-preview-action">提交任务</div></div></div></section>
        <section className="lowcode-bindings" aria-labelledby="lowcode-bindings-title"><div className="lowcode-detail-head"><div><span className="home-eyebrow">WORKFLOW BINDINGS</span><h2 id="lowcode-bindings-title">关联工作流</h2></div><span className="lowcode-binding-count">已关联 {active.bindings.length}</span></div><p>同一个界面可承载多个业务动作，分别连接不同工作流。</p><div className="lowcode-workflow-list">{workflowOptions.map((workflow) => <button key={workflow} className={active.bindings.includes(workflow) ? "bound" : ""} aria-pressed={active.bindings.includes(workflow)} onClick={() => toggleBinding(workflow)}><span className="lowcode-workflow-icon"><Workflow size={16} /></span><span>{workflow}</span><span className="lowcode-bind-indicator">{active.bindings.includes(workflow) ? <CheckCircle2 size={18} /> : <Plus size={17} />}</span></button>)}</div><div className="lowcode-binding-note">正式发布前需确认工作流版本、权限与输入输出映射。当前绑定只供页面内演示，离开页面后会重置。</div></section>
      </div>
    </div>
  </div>;
}
