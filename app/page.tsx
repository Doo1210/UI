"use client";

import {
  Activity,
  BadgeCheck,
  BarChart3,
  Blocks,
  Bot,
  Box,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Cpu,
  Database,
  Eye,
  ExternalLink,
  Factory,
  Filter,
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
  MoreVertical,
  Network,
  PackageOpen,
  Paperclip,
  PanelLeft,
  PanelsTopLeft,
  Pencil,
  Plus,
  RadioTower,
  RefreshCw,
  ScanEye,
  Search,
  Send,
  Settings2,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Trash2,
  Upload,
  UserRoundCog,
  UserRound,
  UsersRound,
  WandSparkles,
  Webhook,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

type Role = "system" | "org" | "operator" | "user";
type NavItem = { label: string; icon: LucideIcon; badge?: string };
type NavGroup = {
  label: string;
  icon: LucideIcon;
  items?: NavItem[];
  badge?: string;
};

const businessNav: NavGroup[] = [
  { label: "Unibot", icon: Bot },
  { label: "专家", icon: BadgeCheck, badge: "BETA" },
  { label: "本体智能体", icon: Share2 },
  { label: "资产广场", icon: Store },
  {
    label: "开发中心",
    icon: Workflow,
    items: [
      { label: "智能体开发", icon: PanelsTopLeft },
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
  { value: "operator", label: "运营人员", short: "运" },
  { value: "user", label: "普通用户", short: "普" },
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

type AssetType = "智能体" | "技能" | "插件" | "MCP" | "模型";

const assetTypeNavigation: { label: AssetType; menuLabel: string; icon: LucideIcon }[] = [
  { label: "智能体", menuLabel: "智能体", icon: Sparkles },
  { label: "技能", menuLabel: "技能", icon: WandSparkles },
  { label: "插件", menuLabel: "插件", icon: Blocks },
  { label: "MCP", menuLabel: "MCP", icon: RadioTower },
  { label: "模型", menuLabel: "模型", icon: Cpu },
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
  const [role, setRole] = useState<Role>("system");
  const [selected, setSelected] = useState("专家");
  const [assetType, setAssetType] = useState<AssetType>("智能体");
  const [activeSecondary, setActiveSecondary] = useState<"plaza" | "ontology" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [organization, setOrganization] = useState(organizations[0]);
  const [ontologyPageKey, setOntologyPageKey] = useState(0);
  const [hasBoundaryMenu, setHasBoundaryMenu] = useState(false);
  const [flyout, setFlyout] = useState<{ title: string; items: NavItem[]; top: number } | null>(null);
  const businessNavRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => {
    const navigation = businessNavRef.current;
    if (!navigation) return;

    const updateBoundaryState = () => {
      const buttons = navigation.querySelectorAll("button");
      const lastButton = buttons[buttons.length - 1];
      if (!lastButton) {
        setHasBoundaryMenu(false);
        return;
      }

      const navigationBottom = navigation.getBoundingClientRect().bottom;
      const lastButtonBottom = lastButton.getBoundingClientRect().bottom;
      setHasBoundaryMenu(lastButtonBottom >= navigationBottom - 18);
    };

    const frame = window.requestAnimationFrame(updateBoundaryState);
    const resizeObserver = new ResizeObserver(updateBoundaryState);
    resizeObserver.observe(navigation);
    navigation.addEventListener("scroll", updateBoundaryState, { passive: true });
    window.addEventListener("resize", updateBoundaryState);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      navigation.removeEventListener("scroll", updateBoundaryState);
      window.removeEventListener("resize", updateBoundaryState);
    };
  }, [activeSecondary, role, mobileOpen]);

  const selectPage = (label: string) => {
    if (label === "本体智能体") setOntologyPageKey((value) => value + 1);
    setSelected(label);
    setActiveSecondary(
      label === "本体智能体"
        ? "ontology"
        : label === "资产广场"
          ? "plaza"
          : null,
    );
    setFlyout(null);
    setOrgOpen(false);
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const selectSecondaryPage = (label: string) => {
    if (label === "本体智能体") setOntologyPageKey((value) => value + 1);
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

  const canViewPlatformOperations = role === "system" || role === "operator";
  const canViewManagementCenter = role === "system" || role === "org";
  const visibleManagementItems = role === "org"
    ? managementItems.管理中心.filter((item) => item.label === "人员管理")
    : managementItems.管理中心;

  const switchRole = (nextRole: Role) => {
    const losesPlatformOperations =
      nextRole !== "system" && nextRole !== "operator" && isManagementSelected("平台运营");
    const losesManagementCenter =
      ((nextRole !== "system" && nextRole !== "org") ||
        (nextRole === "org" && selected !== "人员管理")) &&
      isManagementSelected("管理中心");

    setRole(nextRole);
    if (losesPlatformOperations || losesManagementCenter) {
      setSelected("专家");
      setActiveSecondary(null);
    }
    setUserMenuOpen(false);
    setFlyout(null);
  };

  return (
    <div className="app-shell">
      <button className="mobile-menu" aria-label="打开导航" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>

      {mobileOpen && <button className="mobile-scrim" aria-label="关闭导航" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? "is-mobile-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-logo-image" role="img" aria-label="平台 Logo">
            <Sparkles size={25} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <button className="mobile-close" aria-label="关闭导航" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        {orgOpen && <button className="org-menu-dismiss" aria-label="关闭组织切换" onClick={() => setOrgOpen(false)} />}
        <div className="org-switcher">
          <button className="org-trigger" aria-expanded={orgOpen} onClick={() => { setOrgOpen((value) => !value); setFlyout(null); setUserMenuOpen(false); }}>
            <span className="org-trigger-icon"><UsersRound size={16} strokeWidth={2} /></span>
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
                  <span className="org-option-icon"><UsersRound size={16} strokeWidth={2} /></span>
                  <span>{item}</span>
                  {organization === item && <Check size={15} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeSecondary === "ontology" ? (
          <nav ref={businessNavRef} className="business-nav secondary-business-nav" aria-label="本体智能体二级导航">
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
          <nav ref={businessNavRef} className="business-nav secondary-business-nav" aria-label="资产广场二级导航">
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
        <nav ref={businessNavRef} className="business-nav" aria-label="核心业务导航">
          {businessNav.filter((group) => !group.items).map((group) => {
            const Icon = group.icon;
            return (
              <Fragment key={group.label}>
              <button key={group.label} className={`nav-item ${selected === group.label ? "active" : ""}`} onClick={() => selectPage(group.label)}>
                <Icon className={group.label === "专家" ? "expert-nav-icon" : undefined} size={18} strokeWidth={1.9} />
                <span className="nav-label">{group.label}</span>
                {group.badge && <span className="new-badge">{group.badge}</span>}
                {(group.label === "本体智能体" || group.label === "资产广场") && <ChevronRight className="nav-chevron" size={15} />}
              </button>
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

        <div className={`utility-nav ${hasBoundaryMenu ? "has-boundary-glass" : ""}`}>
          <button className={`nav-item ${selected === "API Key管理" ? "active" : ""}`} onClick={() => selectPage("API Key管理")}>
            <KeyRound size={18} strokeWidth={1.9} /><span className="nav-label">API Key管理</span>
          </button>
          <button className={`nav-item ${selected === "统计看板" ? "active" : ""}`} onClick={() => selectPage("统计看板")}>
            <BarChart3 size={18} strokeWidth={1.9} /><span className="nav-label">统计看板</span>
          </button>
          {canViewPlatformOperations && (
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
          {canViewManagementCenter && (
            <button
              className={`nav-item ${isManagementSelected("管理中心") ? "active" : ""}`}
              onMouseEnter={(event) => showMenuFlyout("管理中心", visibleManagementItems, event.currentTarget, true)}
              onMouseLeave={scheduleFlyoutClose}
              onFocus={(event) => showMenuFlyout("管理中心", visibleManagementItems, event.currentTarget, true)}
              onBlur={scheduleFlyoutClose}
            >
              <Settings2 size={18} strokeWidth={1.9} /><span className="nav-label">管理中心</span><ChevronRight className="nav-chevron" size={15} />
            </button>
          )}
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
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="role-switcher-outside" role="group" aria-label="切换用户角色">
          {roles.map((item) => (
            <button
              key={item.value}
              className={role === item.value ? "active" : ""}
              aria-pressed={role === item.value}
              onClick={() => switchRole(item.value)}
            >
              {item.label}
            </button>
          ))}
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
              key={assetType}
              assetType={assetType}
            />
          ) : (
            selected === "本体智能体" ? <OntologyAgentPage key={ontologyPageKey} />
              : selected === "知识网络" ? <KnowledgeNetworkPage />
                : selected === "数据连接" ? <DataConnectionPage />
                  : selected === "连接管理" ? <ConnectionManagementPage />
                    : selected === "扫描管理" ? <ScanManagementPage />
                      : selected === "数据视图" ? <DataViewPage />
                        : <PlaceholderPage selected={selected} />
          )}
        </section>
      </main>

    </div>
  );
}

function Marketplace({ assetType }: { assetType: AssetType }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const categories = assetCategories[assetType];
  const assets = assetCatalog[assetType];
  const typeIcons: Record<AssetType, LucideIcon> = { 智能体: Bot, 技能: WandSparkles, 插件: Blocks, MCP: RadioTower, 模型: Cpu };
  const ActiveTypeIcon = typeIcons[assetType];
  const filtered = assets.filter((agent) =>
    (category === "全部" || agent.tag === category) &&
    (agent.name.includes(query) || agent.desc.includes(query)),
  );

  return (
    <>
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
    Unibot: { labels: ["今日会话", "任务完成率", "可用工具", "知识资源"], values: ["186", "97.2%", "28", "1,248"], panel: "Unibot 调用趋势" },
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

const ontologyAgents = [
  { name: "供应链业务分析员", desc: "面向供应链团队的数字专家，负责日常监控、风险分析与执行协同。", skills: 7, knowledge: 1, status: "已发布", updated: "2026/08/12 09:43" },
  { name: "供应链数据采集专员", desc: "采集供应链业务实体数据，自动校验并录入企业数据空间。", skills: 6, knowledge: 1, status: "已发布", updated: "2026/06/17 17:07" },
  { name: "生产计划协同专家", desc: "结合订单、产能与库存数据，辅助制定生产计划与异常处置。", skills: 4, knowledge: 2, status: "草稿", updated: "2026/06/09 20:10" },
  { name: "设备运维助手", desc: "识别设备异常并关联维修知识，为现场人员生成处置建议。", skills: 5, knowledge: 3, status: "已发布", updated: "2026/06/09 09:29" },
];

const knowledgeNetworks = [
  { name: "供应链业务知识网络", desc: "覆盖从订单到发货的供应链业务流程数据，包含实体、关系和行动对象。", objects: 14, relations: 17, actions: 2, updated: "2026/04/27 18:41" },
  { name: "设备运维知识网络", desc: "汇聚设备台账、故障、维修工单和备件信息，支撑运维诊断。", objects: 9, relations: 12, actions: 4, updated: "2026/08/06 16:26" },
];

function PageToolbar({ searchPlaceholder, filterLabel = "状态", children }: { searchPlaceholder: string; filterLabel?: string; children?: ReactNode }) {
  return (
    <div className="prototype-toolbar">
      <div className="prototype-toolbar-actions">{children}</div>
      <div className="prototype-toolbar-filters">
        <label className="prototype-search"><Search size={16} /><input placeholder={searchPlaceholder} /></label>
        <label className="prototype-select"><span>{filterLabel}</span><select defaultValue="全部"><option>全部</option><option>已发布</option><option>草稿</option></select><ChevronDown size={14} /></label>
        <button className="toolbar-icon-button" aria-label="筛选"><Filter size={16} /></button>
        <button className="toolbar-icon-button" aria-label="刷新"><RefreshCw size={16} /></button>
      </div>
    </div>
  );
}

function OntologyAgentPage() {
  const [detail, setDetail] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  if (activeAgent) return <OntologyAgentWorkspace name={activeAgent} />;
  if (detail) return <OntologyAgentDetail name={detail} onBack={() => setDetail(null)} />;
  return (
    <div className="prototype-page">
      <PageToolbar searchPlaceholder="搜索名称 / ID">
        <button className="primary-action"><Plus size={17} />新建本体智能体</button>
      </PageToolbar>
      <div className="prototype-card-grid">
        {ontologyAgents.map((agent) => (
          <div className="entity-card" key={agent.name} role="button" aria-label={`查看${agent.name}详情`} onClick={() => setDetail(agent.name)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setDetail(agent.name); }}>
            <div className="entity-card-head">
              <span className="entity-avatar agent"><Bot size={23} /></span>
              <div><div className="entity-title-row"><h3>{agent.name}</h3><em className={agent.status === "已发布" ? "published" : "draft"}>{agent.status}</em></div><p>{agent.desc}</p></div>
              <button aria-label="更多操作" onClick={(event) => event.stopPropagation()}><MoreHorizontal size={18} /></button>
            </div>
            <div className="entity-card-meta"><span>修改者：admin</span><span>技能：{agent.skills}</span><span>知识：{agent.knowledge}</span></div>
            <div className="entity-card-footer"><span className="entity-card-time">更新时间：{agent.updated}</span>{agent.status === "已发布" && <button className="agent-use-button" onClick={(event) => { event.stopPropagation(); setActiveAgent(agent.name); }}><MessageSquareText size={14} />使用</button>}</div>
          </div>
        ))}
      </div>
      <div className="prototype-pagination"><span>共 {ontologyAgents.length} 条</span><button className="active">1</button><button>20 条/页 <ChevronDown size={13} /></button></div>
    </div>
  );
}

function OntologyAgentWorkspace({ name }: { name: string }) {
  const [message, setMessage] = useState("");
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const conversations = [
    `@${name} 分析本周供应链风险`,
    "梳理重点订单交付情况",
    "查询库存预警与缺料信息",
    "生成今日供应链业务简报",
    "分析采购订单延期原因",
    "给出生产计划调整建议",
  ];
  const sendMessage = () => {
    if (!message.trim()) return;
    setSentMessage(message.trim());
    setMessage("");
  };
  return <div className={`agent-workspace ${historyOpen ? "history-open" : ""}`}>
    {historyOpen && <aside className="conversation-history">
      <div className="history-search"><Search size={14} /><input placeholder="搜索对话记录" /></div>
      <div className="history-section-label">最近对话</div>
      <div className="history-list">{conversations.map((item, index) => <button key={item} className={index === 0 ? "active" : ""}><MessageSquareText size={14} /><span>{item}</span>{index === 0 && <Trash2 size={13} />}</button>)}</div>
      <div className="history-end">没有更多了</div>
    </aside>}
    <div className="agent-workspace-main">
    <div className="agent-workspace-topbar">
      <div><button className={`toolbar-icon-button ${historyOpen ? "active" : ""}`} aria-label="会话列表" onClick={() => setHistoryOpen((value) => !value)}><PanelLeft size={17} /></button><button className="toolbar-icon-button" aria-label="新建会话" onClick={() => setSentMessage(null)}><Plus size={18} /></button></div>
    </div>
    <div className={`agent-conversation ${sentMessage ? "has-message" : ""}`}>
      {!sentMessage ? <div className="agent-welcome"><span className="welcome-agent-icon"><Bot size={32} /></span><h2>您好，有什么可以帮您？</h2><p>向本体智能体发送任务指令，获取业务分析与执行建议</p></div> : <div className="conversation-thread"><div className="user-message"><span>林</span><p><b>@{name}</b> {sentMessage}</p></div><div className="agent-message"><span className="entity-avatar agent"><Bot size={18} /></span><div><strong>{name}</strong><p>已收到您的任务。我正在结合知识网络和业务数据进行分析，稍后将为您整理关键结论与建议。</p></div></div></div>}
      <div className="agent-composer">
        <div className="composer-model"><button>万悟行业模型 <ChevronDown size={13} /></button></div>
        <div className="composer-input"><span className="agent-mention">@{name}</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="输入任务指令，让本体智能体开始为您工作" /></div>
        <div className="composer-footer"><span className="composer-tag"><Bot size={14} />本体智能体</span><div><button aria-label="添加附件"><Paperclip size={18} /></button><button className="send-button" aria-label="发送" disabled={!message.trim()} onClick={sendMessage}><Send size={17} /></button></div></div>
      </div>
      <div className="workspace-disclaimer">内容由 AI 生成，仅供参考</div>
    </div>
    </div>
  </div>;
}

function OntologyAgentDetail({ name, onBack }: { name: string; onBack: () => void }) {
  const [section, setSection] = useState("基本设定");
  const sections = ["基本设定", "技能配置", "知识配置", "嵌入配置", "定时任务"];
  return (
    <div className="detail-layout">
      <aside className="detail-nav">
        <button className="detail-back" onClick={onBack}><ChevronLeft size={16} />返回本体智能体</button>
        {sections.map((item) => <button key={item} className={section === item ? "active" : ""} onClick={() => setSection(item)}>{item}</button>)}
      </aside>
      <div className="detail-surface">
        <div className="detail-title"><div><h2>{section}</h2><p>{section === "基本设定" ? "定义本体智能体的名称、简介和核心职责。" : `配置本体智能体的${section}能力。`}</p></div><span className="detail-status">已发布</span></div>
        {section === "基本设定" ? <div className="prototype-form">
          <label><span><b>*</b> 名称</span><input defaultValue={name} /></label>
          <label><span>简介</span><textarea defaultValue="这是无人机供应链团队的本体智能体，负责生产交付链路的日常监控与执行协同。" /></label>
          <label><span><b>*</b> 角色</span><textarea defaultValue="# 角色设定\n供应链智能分析助手\n# 角色定位\n帮助业务人员识别风险并提供决策建议" /></label>
          <label><span><b>*</b> 任务</span><textarea defaultValue="协助处理供应链知识网络相关任务，支持库存预警、订单追踪和物料推荐。" /></label>
          <div className="form-actions"><button>保存草稿</button><button className="primary-action">保存并发布</button></div>
        </div> : <div className="detail-empty"><PackageOpen size={34} /><strong>{section}</strong><span>选择资源并完成当前配置</span><button className="primary-action"><Plus size={16} />添加配置</button></div>}
      </div>
    </div>
  );
}

function KnowledgeNetworkPage() {
  const [detail, setDetail] = useState<string | null>(null);
  if (detail) return <KnowledgeNetworkDetail name={detail} onBack={() => setDetail(null)} />;
  return (
    <div className="prototype-page">
      <PageToolbar searchPlaceholder="搜索知识网络" filterLabel="标签">
        <button className="primary-action"><Plus size={17} />新建知识网络</button>
        <button className="secondary-action"><Upload size={16} />导入</button>
      </PageToolbar>
      <div className="prototype-card-grid knowledge-grid">
        {knowledgeNetworks.map((network) => <div className="entity-card" key={network.name} role="button" aria-label={`查看${network.name}详情`} onClick={() => setDetail(network.name)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setDetail(network.name); }}>
          <div className="entity-card-head"><span className="entity-avatar network"><Network size={23} /></span><div><h3>{network.name}</h3><p>{network.desc}</p></div><button aria-label="更多操作"><MoreHorizontal size={18} /></button></div>
          <div className="entity-card-meta"><span>对象类 {network.objects}</span><span>关系类 {network.relations}</span><span>行动类 {network.actions}</span></div>
          <div className="entity-card-time">更新时间：{network.updated}</div>
        </div>)}
      </div>
    </div>
  );
}

function KnowledgeNetworkDetail({ name, onBack }: { name: string; onBack: () => void }) {
  const [activeSection, setActiveSection] = useState("概述");
  const recent = [["工厂", "生产设施", "2026/05/13 14:35"], ["采购订单", "业务单据", "2026/05/13 14:19"], ["物料", "主数据", "2026/05/13 11:11"], ["物料领料单", "业务单据", "2026/05/13 11:10"], ["产品BOM", "产品结构", "2026/05/13 11:10"]];
  const functionItems: { label: string; icon: LucideIcon; count?: number }[] = [
    { label: "概述", icon: LayoutDashboard },
    { label: "建模预览", icon: Network },
    { label: "对象类", icon: Box, count: 14 },
    { label: "关系类", icon: GitFork, count: 17 },
    { label: "行动类", icon: Activity, count: 2 },
    { label: "概念分组", icon: LibraryBig, count: 4 },
    { label: "任务管理", icon: ListChecks },
  ];
  return <div className="network-detail-layout">
    <aside className="network-function-nav">
      <button className="network-detail-back" onClick={onBack}><ChevronLeft size={16} /><span>返回知识网络</span></button>
      <div className="network-function-primary">
        {functionItems.slice(0, 2).map(item => { const ItemIcon = item.icon; return <button key={item.label} className={activeSection === item.label ? "active" : ""} onClick={() => setActiveSection(item.label)}><ItemIcon size={16} /><span>{item.label}</span></button>; })}
      </div>
      <div className="network-function-label">资源</div>
      <div className="network-function-resources">
        {functionItems.slice(2).map(item => { const ItemIcon = item.icon; return <button key={item.label} className={activeSection === item.label ? "active" : ""} onClick={() => setActiveSection(item.label)}><ItemIcon size={16} /><span>{item.label}</span>{item.count !== undefined && <em>{item.count}</em>}</button>; })}
      </div>
    </aside>
    <div className="network-detail-content">
      <div className="network-detail-header"><span className="entity-avatar network"><Network size={21} /></span><div><h2>{name}</h2><p>覆盖从订单到发货的供应链业务流程数据，为业务分析和本体智能体提供统一语义。</p><div className="network-detail-meta"><span>修改者：admin</span><span>更新时间：2026/04/27 18:41</span></div></div><button className="secondary-action"><Pencil size={15} />编辑</button></div>
      {activeSection === "概述" ? <>
        <div className="network-stat-grid">{[["对象类", "14", Box], ["关系类", "17", GitFork], ["行动类", "2", Activity]].map(([label,value,Icon]) => { const StatIcon = Icon as LucideIcon; return <div className="network-stat" key={label as string}><i><StatIcon size={25} /></i><div><span>{label as string}</span><strong>{value as string}</strong></div><button onClick={() => setActiveSection(label as string)}><Plus size={14} />新建{label as string}</button></div>; })}</div>
        <div className="prototype-table recent-objects"><div className="table-title">最近修改的对象类</div><div className="prototype-table-head five"><span>名称</span><span>标签</span><span>修改者</span><span>更新时间</span><span>操作</span></div>{recent.map(row => <div className="prototype-table-row five" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span>admin</span><span>{row[2]}</span><button><MoreHorizontal size={17} /></button></div>)}</div>
      </> : activeSection === "建模预览" ? <div className="network-model-preview"><div className="model-preview-toolbar"><strong>知识网络建模预览</strong><span>14 个对象 · 17 条关系</span><button className="secondary-action"><RefreshCw size={14} />刷新布局</button></div><div className="model-canvas"><span className="model-node central">采购订单</span><span className="model-node node-a">供应商</span><span className="model-node node-b">物料</span><span className="model-node node-c">仓库</span><span className="model-node node-d">工厂</span><i className="model-edge edge-a" /><i className="model-edge edge-b" /><i className="model-edge edge-c" /><i className="model-edge edge-d" /></div></div> : <div className="network-resource-panel"><div className="network-resource-head"><div><h3>{activeSection}</h3><span>管理知识网络中的{activeSection}资源</span></div><button className="primary-action"><Plus size={16} />新建{activeSection}</button></div><div className="prototype-table"><div className="prototype-table-head resource-columns"><span>名称</span><span>标识</span><span>标签</span><span>修改者</span><span>更新时间</span><span>操作</span></div>{recent.slice(0, activeSection === "行动类" ? 2 : 4).map((row, index) => <div className="prototype-table-row resource-columns" key={`${activeSection}-${row[0]}`}><strong>{row[0]}</strong><code>{["factory", "purchase_order", "material", "material_request"][index]}</code><span>{row[1]}</span><span>admin</span><span>{row[2]}</span><button><MoreHorizontal size={17} /></button></div>)}</div></div>}
    </div>
  </div>;
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
      {activeTab === "连接管理" ? <ConnectionManagementPage compact /> : activeTab === "扫描管理" ? <ScanManagementPage compact /> : <DataViewPage nested />}
    </div>
  );
}

function ConnectionManagementPage({ compact = false }: { compact?: boolean }) {
  const rows = [
    ["供应链生产库", "MySQL", "192.168.0.21:3306", "admin", "2026/08/12 14:32", "扫描完成"],
    ["设备运维数据仓", "PostgreSQL", "10.12.8.16:5432", "林雨晴", "2026/08/11 09:18", "扫描完成"],
    ["质量检测数据源", "MySQL", "172.20.4.35:3306", "周航", "2026/08/08 18:06", "未扫描"],
  ];
  return <div className={`prototype-page ${compact ? "is-compact" : ""}`}>
    <PageToolbar searchPlaceholder="搜索连接名称、连接地址" filterLabel="连接类型"><button className="primary-action"><Plus size={17} />新建连接</button></PageToolbar>
    <div className="prototype-table connection-table">
      <div className="prototype-table-head connection-columns"><span>名称</span><span>连接类型</span><span>连接地址</span><span>操作人</span><span>更新时间</span><span>最近扫描状态</span></div>
      {rows.map(row => <div className="prototype-table-row connection-columns" key={row[0]}><strong>{row[0]}</strong><span className="db-type"><Database size={15} />{row[1]}</span><code>{row[2]}</code><span>{row[3]}</span><span>{row[4]}</span><em className={row[5] === "扫描完成" ? "success" : "muted"}>{row[5]}</em></div>)}
    </div>
    <div className="prototype-pagination"><span>共 {rows.length} 条</span><button className="active">1</button><button>20 条/页 <ChevronDown size={13} /></button></div>
  </div>;
}

function ScanManagementPage({ compact = false }: { compact?: boolean }) {
  const scans = [
    ["供应链生产库", "全量扫描", "已完成", "14", "2026/08/12 14:32", "18秒"],
    ["设备运维数据仓", "增量扫描", "运行中", "9", "2026/08/13 10:06", "进行中"],
    ["质量检测数据源", "结构扫描", "等待中", "--", "2026/08/13 10:18", "--"],
  ];
  return <div className={`prototype-page ${compact ? "is-compact" : ""}`}>
    <PageToolbar searchPlaceholder="搜索扫描任务" filterLabel="任务状态"><button className="primary-action"><ScanEye size={17} />新建扫描任务</button></PageToolbar>
    <div className="prototype-table"><div className="prototype-table-head scan-columns"><span>数据源</span><span>扫描方式</span><span>状态</span><span>发现视图</span><span>开始时间</span><span>耗时</span></div>{scans.map(row => <div className="prototype-table-row scan-columns" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><em className={row[2] === "已完成" ? "success" : row[2] === "运行中" ? "running" : "muted"}>{row[2]}</em><span>{row[3]}</span><span>{row[4]}</span><span>{row[5]}</span></div>)}</div>
  </div>;
}

function DataViewPage({ nested = false }: { nested?: boolean }) {
  const [viewType, setViewType] = useState<"原子视图" | "自定义视图">("原子视图");
  const rows = viewType === "原子视图"
    ? [["工厂实体", "factory_entity", "12", "新增", "供应链生产库"], ["生产订单事件", "production_order_event", "18", "新增", "供应链生产库"], ["仓库实体", "warehouse_entity", "15", "已发布", "供应链生产库"], ["采购订单事件", "purchase_order_event", "22", "已发布", "供应链生产库"]]
    : [["供应链交付全景", "supply_chain_overview", "26", "已发布", "业务分析组"], ["产线质量分析", "quality_analysis", "22", "编辑中", "质量管理组"]];
  return (
    <div className={`data-view-page ${nested ? "is-nested" : ""}`}>
      <div className={`data-view-tabs ${nested ? "is-secondary" : ""}`} role="tablist" aria-label="数据视图类型">
        {(["原子视图", "自定义视图"] as const).map((item) => (
          <button key={item} role="tab" aria-selected={viewType === item} className={viewType === item ? "active" : ""} onClick={() => setViewType(item)}>{item}</button>
        ))}
      </div>
      <div className="data-view-workspace">
        <aside className="view-group-panel"><div><strong>{viewType === "原子视图" ? "已扫描数据源" : "自定义视图分组"}</strong><button><Plus size={14} /></button></div><label><Search size={14} /><input placeholder="搜索分组" /></label><button className="active">全部视图 ({rows.length})</button>{viewType === "原子视图" ? <><button>MySQL · 供应链生产库</button><button>PostgreSQL · 设备仓</button></> : <><button>业务分析组 (1)</button><button>质量管理组 (1)</button><button>未分组 (0)</button></>}</aside>
        <div className="view-main-panel">
      <div className="data-view-toolbar">
        <div><button className="primary-action"><Plus size={16} />新建{viewType}</button><button className="secondary-action"><Upload size={15} />导入</button><button className="secondary-action disabled"><Trash2 size={15} />删除</button></div>
        <label className="resource-search"><Search size={16} /><input placeholder="搜索视图" /></label>
      </div>
      <div className="data-view-panel">
        <div className="data-view-head extended"><span>视图名称</span><span>技术名称</span><span>字段数</span><span>状态</span><span>来源 / 分组</span></div>
        {rows.map((row) => (
          <div className="data-view-row extended" key={row[1]}><strong>{row[0]}</strong><code>{row[1]}</code><span>{row[2]}</span><em>{row[3]}</em><span>{row[4]}</span></div>
        ))}
      </div>
        </div>
      </div>
    </div>
  );
}
