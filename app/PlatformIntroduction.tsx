"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ArrowRight, BadgeCheck, CheckCircle2, Clock3, Database, Expand, FileText, Network, Workflow, X } from "lucide-react";
import type { IndustrialPlatform, PlatformId, PlatformStatus } from "./HomeDashboard";

export type PlatformApplication = { applicant: string; contact: string; purpose: string; submittedAt: string };

const stories: Record<PlatformId, {
  headline: string; features: string[]; metrics: [string, string][]; previewTitle: string;
  source: string; expert: string; workflow: string; result: string;
  scenarios: { title: string; problem: string; solution: string }[];
}> = {
  ontology: {
    headline: "让工业对象，成为可理解的业务上下文。",
    features: ["以设备、产线和业务对象为中心组织信息，梳理对象之间的关联。", "为专家提供设备归属、关联文档和上下游信息，辅助分析问题。", "从对象视角查看数据，让业务流程围绕具体设备和产线展开。"],
    metrics: [["工业对象", "128"], ["对象关系", "356"], ["数据视图", "12"]], previewTitle: "装配产线 · 对象关系",
    source: "设备对象与关联数据", expert: "结合设备归属、检修记录与关联规程，辅助判断故障原因。", workflow: "围绕设备对象发起处置任务，把分析结果带入后续处理。", result: "设备上下文 → 诊断建议 → 处置任务",
    scenarios: [{ title: "设备故障溯源", problem: "设备信息分散，分析时需要反复查找关联资料。", solution: "通过设备关联产线、检修记录与文档，为诊断专家提供上下文。" }, { title: "产线影响分析", problem: "单台设备异常后，难以快速识别受影响的业务对象。", solution: "沿对象关系查看关联产线和设备，再由工作流组织后续排查。" }],
  },
  vision: {
    headline: "让现场画面，进入业务处置流程。",
    features: ["集中组织摄像头和图像来源，关联对应的工位与业务场景。", "配置视觉检测任务，查看检测结果和异常位置。", "保留告警画面与检测证据，为事件触发和人工复核提供依据。"],
    metrics: [["检测工位", "8"], ["检测任务", "16"], ["待复核记录", "3"]], previewTitle: "质检工位 A-03 · 检测结果",
    source: "检测结果与告警证据", expert: "结合缺陷类型和现场图像，辅助人员理解异常及可能原因。", workflow: "通过事件中心接收检测告警，组织复核、处置和结果记录。", result: "检测告警 → 质量复核 → 处置记录",
    scenarios: [{ title: "产品外观质检", problem: "发现外观异常后，检测结果与人工处置容易脱节。", solution: "将缺陷位置与检测画面关联到复核任务，辅助质量人员处理。" }, { title: "现场安全巡检", problem: "现场巡检画面较多，异常需要及时交给责任人确认。", solution: "以视觉告警触发巡检工作流，由人员复核并记录处理结果。" }],
  },
  timeseries: {
    headline: "从设备曲线中，读懂现场变化。",
    features: ["以设备和测点组织时序指标，明确指标含义和采集来源。", "选择时间范围查看变化趋势，比较关键指标的变化。", "围绕异常时段整理线索，为分析和后续处置提供数据依据。"],
    metrics: [["接入测点", "256"], ["趋势视图", "24"], ["异常记录", "6"]], previewTitle: "空压机 AC-102 · 温度趋势",
    source: "测点趋势与异常时段", expert: "读取异常前后的趋势和设备信息，辅助解释指标变化。", workflow: "把异常事件交给诊断流程，组织人员检查与处理结果记录。", result: "指标异常 → 专家诊断 → 检查任务",
    scenarios: [{ title: "设备状态分析", problem: "指标曲线持续变化，异常原因需要结合上下文判断。", solution: "围绕异常时间窗整理温度与负载数据，交由专家辅助分析。" }, { title: "能耗异常排查", problem: "能耗增加后，需要确认发生时间和关联设备。", solution: "先定位能耗变化时段，再由工作流组织设备和工况排查。" }],
  },
  design: {
    headline: "让设计对象与版本，连接后续执行。",
    features: ["围绕项目组织设计对象和资料，明确设计工作的上下文。", "查看设计版本与变更信息，帮助协作人员对齐工作依据。", "组织审查任务与协作记录，将审查结果带入业务流程。"],
    metrics: [["设计项目", "12"], ["设计版本", "36"], ["审查任务", "5"]], previewTitle: "传动组件 · 设计版本 V2.3",
    source: "设计对象与审查信息", expert: "结合设计资料与相关知识，辅助整理审查关注点。", workflow: "连接设计审查、修改确认与结果记录，明确各阶段责任。", result: "设计变更 → 协同审查 → 版本确认",
    scenarios: [{ title: "设计变更审查", problem: "变更涉及多份资料，需要对齐版本和审查意见。", solution: "以设计对象和版本为依据组织审查，结合专家建议整理意见。" }, { title: "设计交付协作", problem: "设计输出交给下游时，任务和资料需要保持对应。", solution: "将设计结果关联到交付流程，记录审查结论与交接信息。" }],
  },
};

function Preview({ platform }: { platform: IndustrialPlatform }) {
  const story = stories[platform.id];
  return <div className="pi-preview">
    <div className="pi-preview-bar"><span className="pi-window-dots"><i /><i /><i /></span><span>{story.previewTitle}</span><small>模拟界面</small></div>
    <div className="pi-preview-metrics">{story.metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className={`pi-preview-canvas ${platform.id}`}>
      {platform.id === "ontology" && <svg viewBox="0 0 480 230" role="img" aria-label="装配产线与设备、检修记录、工艺规程的关系示例">
        <g stroke="#b6c8e9" strokeWidth="1.5" fill="none"><path d="M240 112L89 50M240 112L390 50M240 112L90 185M240 112L390 185" /></g>
        <g className="pi-svg-label"><text x="150" y="68">属于</text><text x="314" y="68">关联</text><text x="144" y="165">参考</text><text x="312" y="165">记录</text></g>
        <g className="pi-svg-node"><rect x="25" y="28" width="128" height="44" rx="8" /><text x="89" y="55">装配产线 A</text><rect x="326" y="28" width="128" height="44" rx="8" /><text x="390" y="55">生产工单</text><rect x="25" y="163" width="128" height="44" rx="8" /><text x="89" y="190">工艺规程</text><rect x="326" y="163" width="128" height="44" rx="8" /><text x="390" y="190">检修记录</text></g>
        <rect x="164" y="86" width="152" height="53" rx="9" fill="#074ce0" /><text x="240" y="118" fill="white" textAnchor="middle" fontSize="14">装配机器人 R-03</text>
      </svg>}
      {platform.id === "vision" && <svg viewBox="0 0 480 230" role="img" aria-label="模拟工件表面检测画面，标记一处待复核缺陷">
        <rect x="0" y="0" width="480" height="230" fill="#202630" /><g stroke="#343d49" strokeWidth="1"><path d="M0 45H480M0 90H480M0 135H480M0 180H480M80 0V230M160 0V230M240 0V230M320 0V230M400 0V230" /></g>
        <path d="M100 48L327 35L392 78V177L166 200L100 153Z" fill="#6f7d8e" stroke="#adbacb" strokeWidth="2" /><path d="M100 48L166 91L392 78M166 91V200" stroke="#b6c0cd" fill="none" /><ellipse cx="268" cy="129" rx="41" ry="29" fill="#363f4b" stroke="#b5c2d3" strokeWidth="4" /><path d="M329 107L344 121L333 139L348 152" stroke="#d5dce7" fill="none" strokeWidth="3" />
        <rect x="315" y="96" width="48" height="69" fill="none" stroke="#80aaff" strokeWidth="2" /><rect x="294" y="73" width="109" height="21" rx="3" fill="#074ce0" /><text x="348" y="87" fontSize="11" fill="white" textAnchor="middle">表面异常 · 待复核</text><text x="15" y="215" fontSize="10" fill="#cbd5e1">CAM-A03 · 示例帧 09:42:18</text>
      </svg>}
      {platform.id === "timeseries" && <svg viewBox="0 0 480 230" role="img" aria-label="设备温度趋势示例，10点后出现高于参考阈值的波动">
        <g stroke="#e1e6ef"><path d="M45 40H450M45 85H450M45 130H450M45 175H450" /></g><g className="pi-svg-label"><text x="15" y="44">90</text><text x="15" y="89">75</text><text x="15" y="134">60</text><text x="15" y="179">45</text><text x="45" y="204">08:00</text><text x="170" y="204">09:00</text><text x="300" y="204">10:00</text><text x="415" y="204">11:00</text><text x="15" y="21">°C</text></g>
        <rect x="316" y="30" width="94" height="145" fill="#edf2ff" /><path d="M45 129L73 122L99 128L126 114L151 120L177 105L203 113L229 98L255 106L281 91L307 99L333 59L357 43L383 55L409 85L437 91" fill="none" stroke="#074ce0" strokeWidth="3" strokeLinejoin="round" /><path d="M45 70H450" stroke="#7386ab" strokeDasharray="5 5" /><rect x="304" y="5" width="110" height="22" rx="4" fill="#074ce0" /><text x="359" y="20" fill="white" textAnchor="middle" fontSize="11">异常时间窗</text>
      </svg>}
      {platform.id === "design" && <svg viewBox="0 0 480 230" role="img" aria-label="传动组件设计图纸示意，版本V2.3处于审查中">
        <g stroke="#edf0f5"><path d="M0 30H480M0 60H480M0 90H480M0 120H480M0 150H480M0 180H480M0 210H480M60 0V230M120 0V230M180 0V230M240 0V230M300 0V230M360 0V230M420 0V230" /></g>
        <g stroke="#3662a2" fill="#f5f8fe" strokeWidth="2"><path d="M111 75L296 49L371 87V158L186 187L111 148Z" /><path d="M111 75L186 113L371 87M186 113V187" fill="none" /><ellipse cx="264" cy="87" rx="42" ry="20" /><ellipse cx="264" cy="87" rx="18" ry="9" /><path d="M130 85V136L167 156V105Z" /></g><g stroke="#8c9db7" strokeWidth="1" fill="none"><path d="M106 164L183 204M106 157V174M183 195V211M198 204L373 176M198 196V211M373 168V183" /></g><g className="pi-svg-label"><text x="123" y="198">120 mm</text><text x="274" y="207">240 mm</text></g><rect x="332" y="13" width="129" height="24" rx="4" fill="#e9effd" /><text x="396" y="29" fill="#074ce0" textAnchor="middle" fontSize="11">V2.3 · 审查中</text>
      </svg>}
    </div>
    <div className="pi-preview-footer"><span><span className="pi-live-dot" />图文与数据均为原型示例</span><span>用于演示平台能力</span></div>
  </div>;
}

export function PlatformIntroduction({ platform, status, canActivate, organization, application, onBack, onRequest, onActivate, onEnter }: {
  platform: IndustrialPlatform; status: PlatformStatus; canActivate: boolean; organization: string; application?: PlatformApplication;
  onBack: () => void; onRequest: (application: PlatformApplication) => void; onActivate: () => void; onEnter: () => void;
}) {
  const story = stories[platform.id];
  const Icon = platform.icon;
  const [modal, setModal] = useState<"application" | "preview" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [applicant, setApplicant] = useState("林雨晴");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState("");
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  const statusLabel = status === "active" ? "已开通" : status === "pending" ? "审批中" : "未开通";
  const action = () => status === "active" ? onEnter() : setModal("application");
  const actions = <>
    <button className="home-button primary" onClick={action}>{status === "active" ? "进入平台" : status === "pending" ? "查看申请" : "申请开通"}<ArrowRight size={16} /></button>
    {status === "pending" && canActivate && <button className="pi-approval-button" onClick={onActivate}>模拟审批通过</button>}
  </>;
  return <div className="platform-intro-page pi-page">
    <header className="pi-topbar"><div className="pi-banner-inner"><button className="intro-back" onClick={onBack}><ChevronLeft size={20} />返回总览</button><div className="pi-banner-platform"><span className="pi-banner-logo"><Icon size={22} /></span><h1>{platform.title}</h1><span className={`platform-status ${status}`}>{statusLabel}</span></div><div className="pi-banner-actions">{actions}</div></div></header>
    <section className="pi-hero">
      <div className="pi-hero-copy"><span className="pi-platform-label">工业能力 · 按需接入</span><h2>{story.headline}</h2><p>{platform.summary}</p><div className="pi-keywords">{platform.keywords.map(item => <span key={item}>{item}</span>)}</div><div className="pi-hero-note">{status === "active" ? "开通范围：" + organization : status === "pending" ? "申请已提交，等待审核" : "按组织申请，审核通过后使用"}</div></div>
      <figure className="pi-hero-visual"><Preview platform={platform} /><figcaption><span>平台工作台预览 · 模拟界面</span><button onClick={() => setModal("preview")}><Expand size={13} />放大查看</button></figcaption></figure>
    </section>
    <section className="pi-features" aria-labelledby="pi-features-heading"><div className="pi-section-heading"><h2 id="pi-features-heading">这个平台可以做什么</h2><span>围绕工业现场，组织专业能力</span></div><div className="pi-feature-grid">{platform.features.map((feature, index) => { const FeatureIcon = [Database, Network, Workflow][index]; return <article key={feature}><FeatureIcon size={22} /><h3>{feature}</h3><p>{story.features[index]}</p></article>; })}</div></section>
    <section className="pi-collaboration" aria-labelledby="pi-collaboration-heading"><div className="pi-section-heading"><div><span className="pi-eyebrow">连接专家与工作流</span><h2 id="pi-collaboration-heading">从专业能力，到业务行动</h2></div><span className="pi-planning-badge">协同方案示例</span></div><div className="pi-flow"><div><Icon size={21} /><strong>{story.source}</strong><span>{platform.title}</span></div><ArrowRight size={20} /><div><BadgeCheck size={21} /><strong>专家分析 · 工作流处理</strong><span>结合知识与工具组织业务步骤</span></div><ArrowRight size={20} /><div><CheckCircle2 size={21} /><strong>交给业务人员处理</strong><span>{story.result}</span></div></div><div className="pi-collaboration-details"><div><h3>专家如何使用</h3><p>{story.expert}</p></div><div><h3>工作流如何使用</h3><p>{story.workflow}</p></div></div><p className="pi-integration-note">以上为拟议协同方式；实际可用能力以平台接入与授权配置为准。</p></section>
    <div className="pi-lower-grid"><section className="pi-scenarios" aria-labelledby="pi-scenarios-heading"><div className="pi-section-heading"><h2 id="pi-scenarios-heading">适合哪些业务场景</h2></div>{story.scenarios.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.problem}</p><div><ArrowRight size={15} /><span>{item.solution}</span></div></article>)}</section><aside className="pi-onboarding"><span className="pi-eyebrow">按需接入</span><h2>开通与使用</h2><ol><li><span>1</span><div><strong>提交组织申请</strong><p>填写业务用途与联系方式，申请范围为 {organization}。</p></div></li><li><span>2</span><div><strong>等待审核与配置</strong><p>审核通过后，按需完成数据连接和成员授权。</p></div></li><li><span>3</span><div><strong>进入平台工作台</strong><p>从总览卡片进入专属导航，使用专业功能。</p></div></li></ol><div className="pi-onboarding-note"><FileText size={16} /><p>当前为交互原型，申请和审批仅在当前会话中模拟，不会发送真实开通请求。</p></div></aside></div>
    <dialog aria-labelledby="pi-dialog-title" ref={dialog} className={`pi-dialog ${modal === "preview" ? "pi-dialog-preview" : ""}`} onCancel={() => setModal(null)}>
      <div className="pi-dialog-head"><div><span className="pi-eyebrow">{modal === "preview" ? "模拟界面" : status === "pending" ? "组织开通申请" : "按组织开通"}</span><h2 id="pi-dialog-title">{modal === "preview" ? platform.title + "预览" : status === "pending" ? "申请已提交" : "申请开通" + platform.title}</h2></div><button aria-label="关闭弹窗" onClick={() => setModal(null)}><X size={20} /></button></div>
      {modal === "preview" ? <Preview platform={platform} /> : status === "pending" ? <div className="pi-application-summary"><p role="status"><Clock3 size={18} />审批中，请等待管理员审核。</p><dl><div><dt>申请组织</dt><dd>{organization}</dd></div><div><dt>申请人</dt><dd>{application?.applicant ?? "林雨晴"}</dd></div><div><dt>联系方式</dt><dd>{application?.contact ?? "未记录"}</dd></div><div><dt>业务用途</dt><dd>{application?.purpose ?? "原型示例申请"}</dd></div><div><dt>提交时间</dt><dd>{application ? new Date(application.submittedAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }) : "当前会话"}</dd></div></dl><small>原型演示申请，尚未接入真实审批服务。</small><button className="home-button primary" onClick={() => setModal(null)}>知道了</button></div> : <form className="pi-application-form" onSubmit={event => { event.preventDefault(); if (!applicant.trim() || !contact.trim() || !purpose.trim()) return; onRequest({ applicant: applicant.trim(), contact: contact.trim(), purpose: purpose.trim(), submittedAt: new Date().toISOString() }); }}>
        <label>申请组织<input value={organization} readOnly /></label><div className="pi-form-pair"><label>申请人<input required maxLength={40} value={applicant} onChange={event => setApplicant(event.target.value)} autoComplete="name" /></label><label>联系方式<input required maxLength={100} value={contact} onChange={event => setContact(event.target.value)} placeholder="手机号或邮箱" /></label></div><label>业务用途<textarea required maxLength={500} rows={4} value={purpose} onChange={event => setPurpose(event.target.value)} placeholder="说明希望解决的问题、适用场景与使用范围" /></label><p>提交后状态变为“审批中”，审核通过后开放平台入口。本次提交仅用于原型演示。</p><div className="pi-form-actions"><button type="button" className="home-button secondary" onClick={() => setModal(null)}>取消</button><button type="submit" className="home-button primary">提交申请<ArrowRight size={15} /></button></div>
      </form>}
    </dialog>
  </div>;
}
