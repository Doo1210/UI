"use client";

import {
  Activity,
  BarChart3,
  Blocks,
  Bot,
  Box,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Database,
  Eye,
  ExternalLink,
  Factory,
  FileKey2,
  Gauge,
  GitFork,
  Info,
  KeyRound,
  LayoutDashboard,
  LibraryBig,
  ListChecks,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  RadioTower,
  ScanEye,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  UserRoundCog,
  UserRound,
  UsersRound,
  WandSparkles,
  Webhook,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";

type Role = "system" | "org" | "user";
type NavItem = { label: string; icon: LucideIcon; badge?: string };
type NavGroup = {
  label: string;
  icon: LucideIcon;
  items?: NavItem[];
  badge?: string;
};

const businessNav: NavGroup[] = [
  { label: "专家", icon: MessageSquareText, badge: "BETA" },
  { label: "本体智能体", icon: BrainCircuit },
  { label: "资产广场", icon: Store },
  {
    label: "开发中心",
    icon: Workflow,
    items: [
      { label: "智能体开发", icon: Bot },
      { label: "资源库", icon: LibraryBig },
    ],
  },
  {
    label: "事件中心",
    icon: Webhook,
    items: [
      { label: "事件接入", icon: RadioTower },
      { label: "事件任务", icon: ListChecks },
    ],
  },
  {
    label: "部署运行",
    icon: Activity,
    items: [
      { label: "智能体运行时", icon: Gauge },
      { label: "镜像仓库", icon: Box },
    ],
  },
  {
    label: "工业引擎",
    icon: Factory,
    items: [{ label: "视觉引擎", icon: ScanEye }],
  },
];

const managementItems: Record<string, NavItem[]> = {
  平台运营: [
    { label: "广场治理", icon: ShieldCheck },
    { label: "运营看板", icon: LayoutDashboard },
  ],
  管理中心: [
    { label: "人员管理", icon: UsersRound },
    { label: "平台配置", icon: SlidersHorizontal },
    { label: "OAuth密钥管理", icon: LockKeyhole },
  ],
};

const roles: { value: Role; label: string; short: string }[] = [
  { value: "system", label: "系统管理员", short: "系" },
  { value: "org", label: "组织管理员", short: "组" },
  { value: "user", label: "其他用户", short: "用" },
];

const organizations = ["--- 系统 ---", "测试", "测试 - 测试1", "测试 - 测试1 - 测试11"];

const agents = [
  {
    name: "设备故障诊断专家",
    desc: "基于设备运行数据定位故障原因，生成检修建议与处置步骤。",
    tag: "设备运维",
    uses: "2.4k",
    tone: "violet",
    icon: Activity,
  },
  {
    name: "质量分析助手",
    desc: "分析产线质检数据，追踪质量波动并识别潜在影响因素。",
    tag: "质量管理",
    uses: "1.8k",
    tone: "blue",
    icon: BarChart3,
  },
  {
    name: "安全生产顾问",
    desc: "辅助识别作业风险，生成合规检查清单与班前安全提示。",
    tag: "安全生产",
    uses: "1.3k",
    tone: "orange",
    icon: ShieldCheck,
  },
  {
    name: "工艺参数优化师",
    desc: "结合历史批次数据，提供关键工艺参数的优化建议。",
    tag: "工艺优化",
    uses: "986",
    tone: "green",
    icon: SlidersHorizontal,
  },
  {
    name: "能源管理助手",
    desc: "监测用能变化与异常峰值，形成车间节能分析报告。",
    tag: "能源管理",
    uses: "756",
    tone: "cyan",
    icon: Gauge,
  },
  {
    name: "工业知识问答",
    desc: "连接企业知识库，为一线人员提供准确、可追溯的专业问答。",
    tag: "知识服务",
    uses: "3.1k",
    tone: "indigo",
    icon: MessageSquareText,
  },
];

const assetTypes = ["智能体", "技能", "插件", "MCP", "模型"] as const;
type AssetType = (typeof assetTypes)[number];
type PlazaScheme = "tabs" | "secondary";

const assetTypeNavigation: { label: AssetType; menuLabel: string; icon: LucideIcon }[] = [
  { label: "智能体", menuLabel: "智能体广场", icon: Bot },
  { label: "技能", menuLabel: "技能广场", icon: WandSparkles },
  { label: "插件", menuLabel: "插件广场", icon: Blocks },
  { label: "MCP", menuLabel: "MCP 广场", icon: RadioTower },
  { label: "模型", menuLabel: "模型广场", icon: BrainCircuit },
];

const ontologyPrimaryItems: NavItem[] = [
  { label: "本体智能体", icon: UserRoundCog },
  { label: "知识网络", icon: Workflow },
];

const ontologyDataItems: NavItem[] = [
  { label: "连接管理", icon: Database },
  { label: "扫描管理", icon: ScanEye },
  { label: "数据视图", icon: LayoutDashboard },
];

const ontologyTabsNav: NavItem[] = [
  { label: "本体智能体", icon: UserRoundCog },
  { label: "知识网络", icon: Workflow },
  { label: "数据连接", icon: Database },
];

const assetCategories: Record<AssetType, string[]> = {
  智能体: ["全部", "设备运维", "质量管理", "安全生产", "工艺优化", "能源管理", "知识服务"],
  技能: ["全部", "数据处理", "内容生成", "知识检索", "流程自动化"],
  插件: ["全部", "生产系统", "数据连接", "消息通知", "效率工具"],
  MCP: ["全部", "数据库", "文件系统", "企业应用", "开发工具"],
  模型: ["全部", "通用语言", "工业视觉", "向量模型", "代码模型"],
};

const assetCatalog: Record<AssetType, typeof agents> = {
  智能体: agents,
  技能: [
    { name: "设备数据清洗", desc: "自动识别异常值、缺失值和重复数据，形成标准设备数据集。", tag: "数据处理", uses: "1.6k", tone: "blue", icon: Database },
    { name: "工业报告生成", desc: "根据生产与运营数据，生成结构化周报、月报和分析摘要。", tag: "内容生成", uses: "1.2k", tone: "violet", icon: FileKey2 },
    { name: "企业知识检索", desc: "跨知识库检索专业资料，并返回带来源的精确答案。", tag: "知识检索", uses: "2.1k", tone: "indigo", icon: Search },
  ],
  插件: [
    { name: "MES 数据连接器", desc: "连接主流制造执行系统，读取工单、产量与质量数据。", tag: "生产系统", uses: "1.4k", tone: "violet", icon: Blocks },
    { name: "企业微信通知", desc: "将智能体任务结果、异常与审批消息发送至企业微信。", tag: "消息通知", uses: "986", tone: "green", icon: MessageSquareText },
    { name: "OPC UA 设备接入", desc: "通过标准工业协议连接现场设备并订阅实时数据。", tag: "数据连接", uses: "764", tone: "orange", icon: RadioTower },
  ],
  MCP: [
    { name: "PostgreSQL MCP", desc: "让智能体安全查询 PostgreSQL 数据库结构与业务数据。", tag: "数据库", uses: "1.1k", tone: "blue", icon: Database },
    { name: "文件系统 MCP", desc: "在受控目录中读取、检索和管理企业文档与文件。", tag: "文件系统", uses: "832", tone: "cyan", icon: LibraryBig },
    { name: "企业应用 MCP", desc: "统一连接企业内部应用，为智能体提供标准化工具接口。", tag: "企业应用", uses: "658", tone: "indigo", icon: RadioTower },
  ],
  模型: [
    { name: "万悟工业大模型", desc: "面向工业知识问答、任务规划和复杂场景推理的通用模型。", tag: "通用语言", uses: "3.8k", tone: "violet", icon: BrainCircuit },
    { name: "多模态质检模型", desc: "理解工业图像与文本指令，辅助识别产品外观缺陷。", tag: "工业视觉", uses: "1.5k", tone: "orange", icon: Eye },
    { name: "工业向量模型", desc: "针对工业术语与企业知识优化的语义检索向量模型。", tag: "向量模型", uses: "2.3k", tone: "green", icon: Search },
  ],
};

export default function Home() {
  const role: Role = "system";
  const [selected, setSelected] = useState("专家");
  const [plazaScheme, setPlazaScheme] = useState<PlazaScheme>("secondary");
  const [assetType, setAssetType] = useState<AssetType>("智能体");
  const [activeSecondary, setActiveSecondary] = useState<"plaza" | "ontology" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [organization, setOrganization] = useState(organizations[0]);
  const [flyout, setFlyout] = useState<{ title: string; items: NavItem[]; top: number } | null>(null);
  const flyoutCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentRole = roles.find((item) => item.value === role)!;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFlyout(null);
        setOrgOpen(false);
        setUserMenuOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current);
    };
  }, []);

  const selectPage = (label: string) => {
    setSelected(label);
    setActiveSecondary(
      plazaScheme === "secondary" && label === "本体智能体"
        ? "ontology"
        : plazaScheme === "secondary" && label === "资产广场"
          ? "plaza"
          : null,
    );
    setFlyout(null);
    setOrgOpen(false);
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const selectSecondaryPage = (label: string) => {
    setSelected(label);
    setFlyout(null);
    setOrgOpen(false);
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const cancelFlyoutClose = () => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current);
    flyoutCloseTimer.current = null;
  };

  const getFlyoutTop = (element: HTMLElement, itemCount: number, above: boolean) => {
    const rect = element.getBoundingClientRect();
    const height = 12 + itemCount * 36;
    return above
      ? Math.max(16, rect.top - height - 8)
      : Math.max(16, Math.min(rect.top - 8, window.innerHeight - height - 16));
  };

  const showMenuFlyout = (title: string, items: NavItem[], element: HTMLElement, above = false) => {
    cancelFlyoutClose();
    setFlyout({ title, items, top: getFlyoutTop(element, items.length, above) });
  };

  const scheduleFlyoutClose = () => {
    cancelFlyoutClose();
    flyoutCloseTimer.current = setTimeout(() => {
      setFlyout(null);
    }, 180);
  };

  const isManagementSelected = (label: string) =>
    selected === label || managementItems[label]?.some((item) => item.label === selected);

  return (
    <div className="app-shell">
      <button className="mobile-menu" aria-label="打开导航" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>

      {mobileOpen && <button className="mobile-scrim" aria-label="关闭导航" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? "is-mobile-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true"><Sparkles size={18} strokeWidth={2.4} /></div>
          <div className="brand-copy">
            <strong>万悟</strong>
            <span>工业智能体平台</span>
          </div>
          <button className="mobile-close" aria-label="关闭导航" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        {orgOpen && <button className="org-menu-dismiss" aria-label="关闭组织切换" onClick={() => setOrgOpen(false)} />}
        <div className="org-switcher">
          <button className="org-trigger" aria-expanded={orgOpen} onClick={() => { setOrgOpen((value) => !value); setFlyout(null); setUserMenuOpen(false); }}>
            <span className="org-trigger-icon"><Building2 size={17} strokeWidth={2} /></span>
            <span className="org-name">{organization}</span>
            {orgOpen ? <ChevronDown className="org-chevron is-open" size={17} /> : <ChevronDown className="org-chevron" size={17} />}
          </button>
          {orgOpen && (
            <div className="org-menu" role="listbox" aria-label="切换组织">
              {organizations.map((item) => (
                <button
                  key={item}
                  className={organization === item ? "active" : ""}
                  onClick={() => { setOrganization(item); setOrgOpen(false); }}
                >
                  <span className="org-option-icon"><UsersRound size={18} strokeWidth={2} /></span>
                  <span>{item}</span>
                  {organization === item && <Check size={15} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeSecondary === "ontology" ? (
          <nav className="business-nav secondary-business-nav" aria-label="本体智能体二级导航">
            <button className="secondary-business-back" onClick={() => setActiveSecondary(null)}>
              <ChevronLeft size={17} />
              <span>本体智能体</span>
            </button>
            <div className="secondary-nav">
              {ontologyPrimaryItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button key={item.label} className={selected === item.label ? "active" : ""} onClick={() => selectSecondaryPage(item.label)}>
                    <ItemIcon size={17} strokeWidth={1.9} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="secondary-section-label">数据连接</div>
              {ontologyDataItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button key={item.label} className={selected === item.label ? "active" : ""} onClick={() => selectSecondaryPage(item.label)}>
                    <ItemIcon size={17} strokeWidth={1.9} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        ) : activeSecondary === "plaza" ? (
          <nav className="business-nav secondary-business-nav" aria-label="资产广场二级导航">
            <button className="secondary-business-back" onClick={() => setActiveSecondary(null)}>
              <ChevronLeft size={17} />
              <span>资产广场</span>
            </button>
            <div className="secondary-nav">
              {assetTypeNavigation.map((item) => {
                const TypeIcon = item.icon;
                return (
                  <button key={item.label} className={assetType === item.label ? "active" : ""} onClick={() => setAssetType(item.label)}>
                    <TypeIcon size={17} strokeWidth={1.9} />
                    <span>{item.menuLabel}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        ) : (
        <nav className="business-nav" aria-label="核心业务导航">
          {businessNav.filter((group) => !group.items && (plazaScheme === "secondary" || group.label !== "本体智能体")).map((group) => {
            const Icon = group.icon;
            return (
              <Fragment key={group.label}>
              <button key={group.label} className={`nav-item ${selected === group.label ? "active" : ""}`} onClick={() => selectPage(group.label)}>
                <Icon size={18} strokeWidth={1.9} />
                <span className="nav-label">{group.label}</span>
                {group.badge && <span className="new-badge">{group.badge}</span>}
                {(group.label === "本体智能体" || (plazaScheme === "secondary" && group.label === "资产广场")) && <ChevronRight className="nav-chevron" size={15} />}
              </button>
              {plazaScheme === "tabs" && group.label === "专家" && (
                <div className="nav-section ontology-inline-section">
                  <div className="nav-section-label">本体智能体</div>
                  <div className="nav-section-items">
                    {ontologyTabsNav.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button key={item.label} className={`nav-item ${selected === item.label ? "active" : ""}`} onClick={() => selectPage(item.label)}>
                          <ItemIcon size={18} strokeWidth={1.9} />
                          <span className="nav-label">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              </Fragment>
            );
          })}
          {businessNav.filter((group) => group.items).map((group) => (
            <div className="nav-section" key={group.label}>
              <div className="nav-section-label">{group.label}</div>
              <div className="nav-section-items">
                {group.items!.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button key={item.label} className={`nav-item ${selected === item.label ? "active" : ""}`} onClick={() => selectPage(item.label)}>
                      <ItemIcon size={18} strokeWidth={1.9} />
                      <span className="nav-label">{item.label}</span>
                      {item.badge && <span className="new-badge">{item.badge}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        )}

        <div className="utility-nav">
          <button className={`nav-item ${selected === "API Key管理" ? "active" : ""}`} onClick={() => selectPage("API Key管理")}>
            <KeyRound size={18} strokeWidth={1.9} /><span className="nav-label">API Key管理</span>
          </button>
          <button className={`nav-item ${selected === "统计看板" ? "active" : ""}`} onClick={() => selectPage("统计看板")}>
            <BarChart3 size={18} strokeWidth={1.9} /><span className="nav-label">统计看板</span>
          </button>
          {role === "system" && (
            <button
              className={`nav-item ${isManagementSelected("平台运营") ? "active" : ""}`}
              onMouseEnter={(event) => showMenuFlyout("平台运营", managementItems.平台运营, event.currentTarget, true)}
              onMouseLeave={scheduleFlyoutClose}
              onFocus={(event) => showMenuFlyout("平台运营", managementItems.平台运营, event.currentTarget, true)}
              onBlur={scheduleFlyoutClose}
            >
              <ShieldCheck size={18} strokeWidth={1.9} /><span className="nav-label">平台运营</span><ChevronRight className="nav-chevron" size={15} />
            </button>
          )}
          {role === "system" ? (
            <button
              className={`nav-item ${isManagementSelected("管理中心") ? "active" : ""}`}
              onMouseEnter={(event) => showMenuFlyout("管理中心", managementItems.管理中心, event.currentTarget, true)}
              onMouseLeave={scheduleFlyoutClose}
              onFocus={(event) => showMenuFlyout("管理中心", managementItems.管理中心, event.currentTarget, true)}
              onBlur={scheduleFlyoutClose}
            >
              <Settings2 size={18} strokeWidth={1.9} /><span className="nav-label">管理中心</span><ChevronRight className="nav-chevron" size={15} />
            </button>
          ) : role === "org" ? (
            <button className={`nav-item ${selected === "人员管理" ? "active" : ""}`} onClick={() => selectPage("人员管理")}>
              <Settings2 size={18} strokeWidth={1.9} /><span className="nav-label">管理中心</span>
            </button>
          ) : null}
        </div>

        <div className="sidebar-footer">
          <div className="avatar">林</div>
          <div className="profile-copy"><strong>林雨晴</strong><span>{currentRole.label}</span></div>
          <button
            className={`icon-button user-more ${userMenuOpen ? "active" : ""}`}
            aria-label="打开用户菜单"
            aria-expanded={userMenuOpen}
            onClick={() => { setUserMenuOpen((value) => !value); setOrgOpen(false); setFlyout(null); }}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {userMenuOpen && (
          <>
            <button className="user-menu-dismiss" aria-label="关闭用户菜单" onClick={() => setUserMenuOpen(false)} />
            <div className="user-menu" role="menu" aria-label="用户菜单">
              <button onClick={() => selectPage("个人信息")}><UserRound size={17} /><span>个人信息</span></button>
              <button onClick={() => selectPage("画像配置")}><UserRoundCog size={17} /><span>画像配置</span></button>
              <div className="user-menu-divider" />
              <button onClick={() => selectPage("帮助文档")}><CircleHelp size={17} /><span>帮助文档</span><ExternalLink className="user-menu-end" size={14} /></button>
              <button onClick={() => selectPage("开源仓库")}><GitFork size={17} /><span>开源仓库</span><ExternalLink className="user-menu-end" size={14} /></button>
              <button onClick={() => selectPage("关于")}><Info size={17} /><span>关于</span><small className="user-menu-end">V1.2.0</small></button>
              <div className="user-menu-divider" />
              <button className="logout-item" onClick={() => setUserMenuOpen(false)}><LogOut size={17} /><span>登出</span></button>
            </div>
          </>
        )}
      </aside>

      {flyout && (
        <div
          className="nav-flyout is-management-hover"
          style={{ top: flyout.top }}
          role="dialog"
          aria-label={`${flyout.title}二级菜单`}
          onMouseEnter={cancelFlyoutClose}
          onMouseLeave={scheduleFlyoutClose}
        >
          <div className="flyout-list">
            {flyout.items.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className={selected === item.label ? "active" : ""} onClick={() => selectPage(item.label)}>
                  <span className="flyout-icon"><Icon size={17} /></span>
                  <span>{item.label}</span>
                  {selected === item.label && <Check size={15} className="flyout-check" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <main className="main-area">
        <section className="content">
          {selected === "资产广场" ? (
            <Marketplace
              key={`${plazaScheme}-${assetType}`}
              assetType={assetType}
              showTypeTabs={plazaScheme === "tabs"}
              onAssetTypeChange={setAssetType}
            />
          ) : (
            selected === "数据连接" ? <DataConnectionPage /> : selected === "数据视图" ? <DataViewPage /> : <PlaceholderPage selected={selected} />
          )}
        </section>
      </main>

      <div className="scheme-comparison" aria-label="资产广场方案对比">
        <span>方案对比</span>
        <div>
          <button className={plazaScheme === "secondary" ? "active" : ""} onClick={() => { setPlazaScheme("secondary"); if (selected === "资产广场") setActiveSecondary("plaza"); }}>方案一 <small>覆盖侧栏</small></button>
          <button className={plazaScheme === "tabs" ? "active" : ""} onClick={() => {
            setPlazaScheme("tabs");
            if (activeSecondary === "plaza") setActiveSecondary(null);
            if (activeSecondary === "ontology") setActiveSecondary(null);
            if (["本体智能体", "连接管理", "扫描管理", "数据视图"].includes(selected)) setSelected("数据连接");
          }}>方案二 <small>顶部 Tab</small></button>
        </div>
      </div>
    </div>
  );
}

function Marketplace({ assetType, showTypeTabs, onAssetTypeChange }: { assetType: AssetType; showTypeTabs: boolean; onAssetTypeChange: (type: AssetType) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const categories = assetCategories[assetType];
  const assets = assetCatalog[assetType];
  const typeIcons: Record<AssetType, LucideIcon> = { 智能体: Bot, 技能: WandSparkles, 插件: Blocks, MCP: RadioTower, 模型: BrainCircuit };
  const ActiveTypeIcon = typeIcons[assetType];
  const filtered = assets.filter((agent) =>
    (category === "全部" || agent.tag === category) &&
    (agent.name.includes(query) || agent.desc.includes(query)),
  );

  const changeAssetType = (nextType: AssetType) => {
    onAssetTypeChange(nextType);
    setCategory("全部");
    setQuery("");
  };

  return (
    <>
      {showTypeTabs && <div className="asset-type-tabs" role="tablist" aria-label="资产类型">
        {assetTypes.map((item) => {
          const TypeIcon = typeIcons[item];
          return (
            <button key={item} role="tab" aria-selected={assetType === item} className={assetType === item ? "active" : ""} onClick={() => changeAssetType(item)}>
              <TypeIcon size={17} strokeWidth={1.9} />
              <span>{item}</span>
            </button>
          );
        })}
      </div>}

      <div className="explore-toolbar">
        <div className="category-tabs" aria-label={`${assetType}分类`}>
          {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <label className="resource-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`搜索${assetType}`} /></label>
      </div>

      <div className="hero-strip">
        <div className="hero-copy">
          <span className="hero-kicker"><Sparkles size={14} />本周精选</span>
          <h2>发现优质{assetType}资产，快速装配工业智能应用</h2>
          <p>平台精选、统一治理、开箱即用，让每项智能能力都能被高效复用。</p>
          <button>探索精选{assetType} <ChevronRight size={15} /></button>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="visual-core"><ActiveTypeIcon size={31} /></div>
          <span className="visual-node node-one"><Database size={15} /></span>
          <span className="visual-node node-two"><Workflow size={15} /></span>
          <span className="visual-node node-three"><Factory size={15} /></span>
        </div>
      </div>

      <div className="section-heading"><div><h3>热门{assetType}</h3><span>{filtered.length} 个资源</span></div><button>查看全部 <ChevronRight size={15} /></button></div>
      <div className="agent-grid">
        {filtered.map((agent) => {
          const Icon = agent.icon;
          return (
            <article className="agent-card" key={agent.name}>
              <div className="agent-card-top">
                <span className={`agent-icon ${agent.tone}`}><Icon size={22} /></span>
                <button aria-label="更多操作"><MoreHorizontal size={18} /></button>
              </div>
              <h4>{agent.name}</h4>
              <p>{agent.desc}</p>
              <div className="agent-meta"><span>{agent.tag}</span><span><UsersRound size={14} /> {agent.uses} 次使用</span></div>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="empty-state"><Search size={28} /><strong>未找到相关{assetType}</strong><span>试试其他关键词或分类</span></div>}
    </>
  );
}

function PlaceholderPage({ selected }: { selected: string }) {
  const profiles: Record<string, { labels: string[]; values: string[]; panel: string }> = {
    本体智能体: { labels: ["智能体总数", "运行中", "任务完成率", "今日执行"], values: ["24", "18", "96.4%", "386"], panel: "任务执行趋势" },
    智能体开发: { labels: ["智能体项目", "已发布", "调试中", "本周更新"], values: ["32", "21", "7", "12"], panel: "开发活跃度" },
    资源库: { labels: ["资源总数", "知识资源", "工具资源", "本周新增"], values: ["1,248", "836", "412", "46"], panel: "资源使用趋势" },
    事件接入: { labels: ["接入源", "今日事件", "处理成功率", "异常事件"], values: ["18", "12,684", "99.2%", "23"], panel: "事件接入趋势" },
    事件任务: { labels: ["任务总数", "运行中", "执行成功率", "待处理"], values: ["86", "24", "97.8%", "6"], panel: "任务运行趋势" },
    视觉引擎: { labels: ["模型数量", "运行任务", "识别准确率", "今日检测"], values: ["16", "9", "98.1%", "8,642"], panel: "检测量趋势" },
    智能体运行时: { labels: ["运行实例", "健康实例", "可用率", "平均延迟"], values: ["68", "65", "99.6%", "126ms"], panel: "实例运行趋势" },
    镜像仓库: { labels: ["镜像总数", "生产版本", "存储用量", "本周推送"], values: ["126", "34", "286 GB", "18"], panel: "镜像使用趋势" },
    "API Key管理": { labels: ["全部密钥", "正常使用", "即将过期", "今日调用"], values: ["12", "9", "3", "4,286"], panel: "密钥调用趋势" },
    统计看板: { labels: ["智能体调用", "Token 消耗", "调用成功率", "本月成本"], values: ["18,642", "2.84M", "98.7%", "¥ 8,426"], panel: "用量趋势" },
  };
  const profile = profiles[selected] ?? { labels: ["全部项目", "运行中", "健康度", "今日处理"], values: ["24", "18", "96.4%", "128"], panel: `${selected}趋势` };
  const metricIcons = [Database, Activity, Gauge, Check];
  return (
    <>
      <div className="metric-grid">
        {profile.values.map((value, index) => {
          const MetricIcon = metricIcons[index];
          return (
            <div className="metric-card" key={profile.labels[index]}>
              <div className="metric-card-top"><span>{profile.labels[index]}</span><i><MetricIcon size={16} /></i></div>
              <strong>{value}</strong>
            </div>
          );
        })}
      </div>
      <div className="overview-grid">
        <div className="data-panel">
          <div className="data-panel-head"><div><h3>{profile.panel}</h3><span>近 30 天</span></div><button><FileKey2 size={16} />导出</button></div>
          <div className="chart-placeholder">
            <div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0</span></div>
            <div className="chart-area">
              {[42, 55, 48, 69, 58, 76, 71, 84, 78, 92, 86, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
          </div>
        </div>
        <div className="recent-panel">
          <div className="recent-panel-head"><h3>最近动态</h3><button>查看全部 <ChevronRight size={14} /></button></div>
          <div className="recent-list">
            {["生产环境", "数据同步", "自动化任务", "版本更新"].map((item, index) => (
              <div className="recent-item" key={item}>
                <span className="recent-icon"><Activity size={15} /></span>
                <div><strong>{item}</strong><span>{["10:32", "09:48", "08:20", "昨日 18:06"][index]}</span></div>
                <em>{index === 2 ? "进行中" : "正常"}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function DataConnectionPage() {
  const [activeTab, setActiveTab] = useState<"连接管理" | "扫描管理" | "数据视图">("连接管理");
  return (
    <div className="data-connection-page">
      <div className="connection-tabs" role="tablist" aria-label="数据连接功能">
        {(["连接管理", "扫描管理", "数据视图"] as const).map((item) => (
          <button key={item} role="tab" aria-selected={activeTab === item} className={activeTab === item ? "active" : ""} onClick={() => setActiveTab(item)}>{item}</button>
        ))}
      </div>
      {activeTab === "数据视图" ? <DataViewPage nested /> : <PlaceholderPage selected={activeTab} />}
    </div>
  );
}

function DataViewPage({ nested = false }: { nested?: boolean }) {
  const [viewType, setViewType] = useState<"原子视图" | "自定义视图">("原子视图");
  const rows = viewType === "原子视图"
    ? [["设备基础信息", "device_base", "12", "已发布"], ["工单运行记录", "work_order", "18", "已发布"], ["质量检测结果", "quality_result", "15", "草稿"]]
    : [["设备运行全景", "device_overview", "26", "已发布"], ["产线质量分析", "quality_analysis", "22", "编辑中"]];
  return (
    <div className={`data-view-page ${nested ? "is-nested" : ""}`}>
      <div className={`data-view-tabs ${nested ? "is-secondary" : ""}`} role="tablist" aria-label="数据视图类型">
        {(["原子视图", "自定义视图"] as const).map((item) => (
          <button key={item} role="tab" aria-selected={viewType === item} className={viewType === item ? "active" : ""} onClick={() => setViewType(item)}>{item}</button>
        ))}
      </div>
      <div className="data-view-toolbar">
        <label className="resource-search"><Search size={16} /><input placeholder="搜索视图" /></label>
        <button><LayoutDashboard size={16} />新建{viewType}</button>
      </div>
      <div className="data-view-panel">
        <div className="data-view-head"><span>视图名称</span><span>标识</span><span>字段数</span><span>状态</span></div>
        {rows.map((row) => (
          <div className="data-view-row" key={row[1]}><strong>{row[0]}</strong><code>{row[1]}</code><span>{row[2]}</span><em>{row[3]}</em></div>
        ))}
      </div>
    </div>
  );
}
