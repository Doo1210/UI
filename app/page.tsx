"use client";

import {
  Activity,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  Box,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
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
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
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
import { useEffect, useMemo, useRef, useState } from "react";

type Role = "system" | "org" | "user";
type NavItem = { label: string; icon: LucideIcon; badge?: string };
type NavGroup = {
  label: string;
  icon: LucideIcon;
  items?: NavItem[];
  badge?: string;
};

const businessNav: NavGroup[] = [
  { label: "UniBot", icon: Bot },
  { label: "数字员工", icon: UserRoundCog, badge: "NEW" },
  {
    label: "广场",
    icon: Store,
    items: [
      { label: "智能体广场", icon: Bot },
      { label: "插件广场", icon: Blocks },
      { label: "MCP广场", icon: RadioTower },
      { label: "技能广场", icon: WandSparkles },
      { label: "模型广场", icon: BrainCircuit },
    ],
  },
  {
    label: "开发中心",
    icon: Workflow,
    items: [
      { label: "智能体开发", icon: Bot },
      { label: "资源库", icon: LibraryBig },
      { label: "智能体评测", icon: ClipboardCheck, badge: "NEW" },
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
    label: "工业引擎",
    icon: Factory,
    items: [{ label: "视觉引擎", icon: ScanEye }],
  },
  {
    label: "运行中心",
    icon: Activity,
    items: [
      { label: "智能体运行时", icon: Gauge },
      { label: "镜像仓库", icon: Box },
      { label: "智能体观测", icon: Eye, badge: "NEW" },
    ],
  },
];

const managementItems: Record<string, NavItem[]> = {
  平台运营: [
    { label: "审核工作台", icon: ClipboardCheck },
    { label: "广场治理", icon: ShieldCheck },
    { label: "运营看板", icon: LayoutDashboard },
  ],
  管理中心: [
    { label: "组织管理", icon: UsersRound },
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

function parentOf(label: string) {
  return businessNav.find((group) => group.items?.some((item) => item.label === label))?.label;
}

export default function Home() {
  const [role, setRole] = useState<Role>("system");
  const [selected, setSelected] = useState("智能体广场");
  const [expanded, setExpanded] = useState<string[]>(["广场"]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [organization, setOrganization] = useState(organizations[0]);
  const [flyout, setFlyout] = useState<{ title: string; items: NavItem[]; top: number; pinned: boolean } | null>(null);
  const flyoutCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentRole = roles.find((item) => item.value === role)!;
  const currentParent = parentOf(selected);

  const pageLabel = selected;
  const context = useMemo(() => {
    if (selected === "统计分析") {
      return role === "system" ? "数据范围：全平台" : role === "org" ? "数据范围：本组织" : "数据范围：仅本人";
    }
    if (selected === "API Key管理") return role === "user" ? "管理仅属于我的访问凭证" : "安全管理平台访问凭证";
    return "发现适合工业场景的智能体，让业务快速连接智能能力";
  }, [role, selected]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFlyout(null);
        setRoleOpen(false);
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
    setFlyout(null);
    setOrgOpen(false);
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const changeRole = (nextRole: Role) => {
    setRole(nextRole);
    setFlyout(null);
    setOrgOpen(false);
    setUserMenuOpen(false);
    setRoleOpen(false);
    if (nextRole === "user" && ["平台运营", "组织管理", "平台配置", "OAuth密钥管理"].includes(selected)) {
      setSelected("统计分析");
    } else if (nextRole === "org" && ["平台运营", "平台配置", "OAuth密钥管理"].includes(selected)) {
      setSelected("组织管理");
    }
  };

  const cancelFlyoutClose = () => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current);
    flyoutCloseTimer.current = null;
  };

  const getFlyoutTop = (element: HTMLElement, itemCount: number, above: boolean) => {
    const rect = element.getBoundingClientRect();
    const height = 16 + itemCount * 44;
    return above
      ? Math.max(16, rect.top - height - 8)
      : Math.max(16, Math.min(rect.top - 8, window.innerHeight - height - 16));
  };

  const showMenuFlyout = (title: string, items: NavItem[], element: HTMLElement, above = false) => {
    cancelFlyoutClose();
    setFlyout((current) => current?.title === title && current.pinned
      ? current
      : { title, items, top: getFlyoutTop(element, items.length, above), pinned: false });
  };

  const toggleMenuFlyout = (title: string, items: NavItem[], element: HTMLElement, above = false) => {
    cancelFlyoutClose();
    if (flyout?.title === title && flyout.pinned) {
      setFlyout(null);
      return;
    }
    setFlyout({ title, items, top: getFlyoutTop(element, items.length, above), pinned: true });
  };

  const scheduleFlyoutClose = () => {
    cancelFlyoutClose();
    flyoutCloseTimer.current = setTimeout(() => {
      setFlyout((current) => current?.pinned ? current : null);
    }, 180);
  };

  const handleGroup = (group: NavGroup, element: HTMLElement) => {
    if (!group.items) {
      selectPage(group.label);
      return;
    }
    if (collapsed) {
      toggleMenuFlyout(group.label, group.items, element);
      return;
    }
    setExpanded((current) =>
      current.includes(group.label)
        ? current.filter((item) => item !== group.label)
        : [...current, group.label],
    );
  };

  const isManagementSelected = (label: string) =>
    selected === label || managementItems[label]?.some((item) => item.label === selected);

  return (
    <div className="app-shell">
      <button className="mobile-menu" aria-label="打开导航" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>

      {mobileOpen && <button className="mobile-scrim" aria-label="关闭导航" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true"><Sparkles size={18} strokeWidth={2.4} /></div>
          {!collapsed && (
            <div className="brand-copy">
              <strong>万悟</strong>
              <span>工业智能体平台</span>
            </div>
          )}
          <button
            className="collapse-button"
            aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
            onClick={() => { setCollapsed((value) => !value); setFlyout(null); setOrgOpen(false); setUserMenuOpen(false); }}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
          <button className="mobile-close" aria-label="关闭导航" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        {orgOpen && <button className="org-menu-dismiss" aria-label="关闭组织切换" onClick={() => setOrgOpen(false)} />}
        <div className="org-switcher">
          <button className="org-trigger" aria-expanded={orgOpen} onClick={() => { setOrgOpen((value) => !value); setFlyout(null); setUserMenuOpen(false); }} title={collapsed ? organization : undefined}>
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

        <nav className="business-nav" aria-label="核心业务导航">
          {businessNav.map((group) => {
            const Icon = group.icon;
            const isOpen = expanded.includes(group.label);
            const isActive = selected === group.label || currentParent === group.label;
            return (
              <div className="nav-group" key={group.label}>
                <button
                  className={`nav-item nav-parent ${isActive ? "active-parent" : ""} ${selected === group.label ? "active" : ""}`}
                  title={collapsed ? group.label : undefined}
                  aria-expanded={group.items ? (collapsed ? flyout?.title === group.label : isOpen) : undefined}
                  onClick={(event) => handleGroup(group, event.currentTarget)}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  {!collapsed && <span className="nav-label">{group.label}</span>}
                  {!collapsed && group.badge && <span className="new-badge">{group.badge}</span>}
                  {!collapsed && group.items && (isOpen ? <ChevronDown className="nav-chevron" size={15} /> : <ChevronRight className="nav-chevron" size={15} />)}
                </button>
                {!collapsed && group.items && isOpen && (
                  <div className="subnav">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.label}
                          className={`nav-item subnav-item ${selected === item.label ? "active" : ""}`}
                          onClick={() => selectPage(item.label)}
                        >
                          <ItemIcon size={16} strokeWidth={1.9} />
                          <span className="nav-label">{item.label}</span>
                          {item.badge && <span className="new-badge">{item.badge}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="utility-nav">
          <button className={`nav-item ${selected === "API Key管理" ? "active" : ""}`} title={collapsed ? "API Key管理" : undefined} onClick={() => selectPage("API Key管理")}>
            <KeyRound size={18} strokeWidth={1.9} /><span className="nav-label">API Key管理</span>
          </button>
          <button className={`nav-item ${selected === "统计分析" ? "active" : ""}`} title={collapsed ? "统计分析" : undefined} onClick={() => selectPage("统计分析")}>
            <BarChart3 size={18} strokeWidth={1.9} /><span className="nav-label">统计分析</span>
          </button>
          {role === "system" && (
            <button
              className={`nav-item ${isManagementSelected("平台运营") ? "active" : ""}`}
              title={collapsed ? "平台运营" : undefined}
              onMouseEnter={(event) => showMenuFlyout("平台运营", managementItems.平台运营, event.currentTarget, true)}
              onMouseLeave={scheduleFlyoutClose}
              onFocus={(event) => showMenuFlyout("平台运营", managementItems.平台运营, event.currentTarget, true)}
              onBlur={scheduleFlyoutClose}
            >
              <ShieldCheck size={18} strokeWidth={1.9} /><span className="nav-label">平台运营</span>{!collapsed && <ChevronRight className="nav-chevron" size={15} />}
            </button>
          )}
          {role === "system" ? (
            <button
              className={`nav-item ${isManagementSelected("管理中心") ? "active" : ""}`}
              title={collapsed ? "管理中心" : undefined}
              onMouseEnter={(event) => showMenuFlyout("管理中心", managementItems.管理中心, event.currentTarget, true)}
              onMouseLeave={scheduleFlyoutClose}
              onFocus={(event) => showMenuFlyout("管理中心", managementItems.管理中心, event.currentTarget, true)}
              onBlur={scheduleFlyoutClose}
            >
              <Settings2 size={18} strokeWidth={1.9} /><span className="nav-label">管理中心</span>{!collapsed && <ChevronRight className="nav-chevron" size={15} />}
            </button>
          ) : role === "org" ? (
            <button className={`nav-item ${selected === "组织管理" ? "active" : ""}`} title={collapsed ? "组织管理" : undefined} onClick={() => selectPage("组织管理")}>
              <Settings2 size={18} strokeWidth={1.9} /><span className="nav-label">管理中心</span>
            </button>
          ) : null}
        </div>

        <div className="sidebar-footer">
          <div className="avatar">林</div>
          {!collapsed && <div className="profile-copy"><strong>林雨晴</strong><span>{currentRole.label}</span></div>}
          {!collapsed && (
            <button
              className={`icon-button user-more ${userMenuOpen ? "active" : ""}`}
              aria-label="打开用户菜单"
              aria-expanded={userMenuOpen}
              onClick={() => { setUserMenuOpen((value) => !value); setOrgOpen(false); setFlyout(null); }}
            >
              <MoreHorizontal size={18} />
            </button>
          )}
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
        <>
          {flyout.pinned && <button className="flyout-dismiss" aria-label="关闭二级菜单" onClick={() => setFlyout(null)} />}
          <div
            className={`nav-flyout ${flyout.pinned ? "" : "is-management-hover"}`}
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
        </>
      )}

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>工作台</span><ChevronRight size={14} /><strong>{pageLabel}</strong></div>
          <div className="top-actions">
            <button className="top-icon" aria-label="帮助"><CircleHelp size={19} /></button>
            <button className="top-icon notification" aria-label="通知"><Bell size={19} /><i /></button>
            <div className="role-switcher">
              <button className="role-trigger" aria-expanded={roleOpen} onClick={() => setRoleOpen((value) => !value)}>
                <span className="role-avatar">{currentRole.short}</span>
                <span><small>预览角色</small><strong>{currentRole.label}</strong></span>
                <ChevronDown size={15} />
              </button>
              {roleOpen && (
                <div className="role-menu">
                  <div className="role-menu-title">切换权限视角</div>
                  {roles.map((item) => (
                    <button key={item.value} className={role === item.value ? "active" : ""} onClick={() => changeRole(item.value)}>
                      <span className="role-avatar">{item.short}</span><span>{item.label}</span>{role === item.value && <Check size={15} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" />万悟智能体生态</div>
              <h1>{pageLabel}</h1>
              <p>{context}</p>
            </div>
            <div className="heading-actions">
              {selected === "智能体广场" && <button className="secondary-button"><Clock3 size={16} />使用记录</button>}
              <button className="primary-button"><Plus size={17} />{selected === "智能体广场" ? "创建智能体" : "新建"}</button>
            </div>
          </div>

          {selected === "智能体广场" ? (
            <Marketplace />
          ) : (
            <PlaceholderPage selected={selected} role={role} context={context} />
          )}
        </section>
      </main>
    </div>
  );
}

function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const categories = ["全部", "设备运维", "质量管理", "安全生产", "工艺优化", "知识服务"];
  const filtered = agents.filter((agent) =>
    (category === "全部" || agent.tag === category) &&
    (agent.name.includes(query) || agent.desc.includes(query)),
  );

  return (
    <>
      <div className="hero-strip">
        <div className="hero-copy">
          <span className="hero-kicker"><Sparkles size={14} />本周精选</span>
          <h2>让每个工业场景，都有一位懂业务的智能助手</h2>
          <p>连接企业知识、业务系统与现场数据，快速启用经过验证的智能体。</p>
          <button>探索精选智能体 <ChevronRight size={15} /></button>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="visual-core"><Bot size={31} /></div>
          <span className="visual-node node-one"><Database size={15} /></span>
          <span className="visual-node node-two"><Workflow size={15} /></span>
          <span className="visual-node node-three"><Factory size={15} /></span>
        </div>
      </div>

      <div className="explore-toolbar">
        <div className="category-tabs">
          {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <label className="resource-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索智能体" /></label>
      </div>

      <div className="section-heading"><div><h3>热门智能体</h3><span>{filtered.length} 个资源</span></div><button>查看全部 <ChevronRight size={15} /></button></div>
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
      {filtered.length === 0 && <div className="empty-state"><Search size={28} /><strong>未找到相关智能体</strong><span>试试其他关键词或分类</span></div>}
    </>
  );
}

function PlaceholderPage({ selected, role, context }: { selected: string; role: Role; context: string }) {
  const isStats = selected === "统计分析";
  const isKey = selected === "API Key管理";
  const values = isStats ? ["18,642", "2.84M", "98.7%", "¥ 8,426"] : isKey ? ["12", "9", "3", "2小时前"] : ["24", "18", "96.4%", "今日 10:32"];
  const labels = isStats ? ["智能体调用", "Token 消耗", "调用成功率", "本月预估成本"] : isKey ? ["全部密钥", "正常使用", "即将过期", "最近使用"] : ["全部项目", "运行中", "健康度", "最近更新"];
  return (
    <>
      <div className="scope-banner">
        <span className="scope-icon"><ShieldCheck size={18} /></span>
        <div><strong>{context}</strong><p>当前以{role === "system" ? "系统管理员" : role === "org" ? "组织管理员" : "其他用户"}身份浏览，菜单与数据范围已按权限自动调整。</p></div>
        <button>查看权限说明 <ChevronRight size={15} /></button>
      </div>
      <div className="metric-grid">
        {values.map((value, index) => (
          <div className="metric-card" key={labels[index]}><span>{labels[index]}</span><strong>{value}</strong><small>{index === 2 ? "+1.2% 较上周" : "较上周保持稳定"}</small></div>
        ))}
      </div>
      <div className="data-panel">
        <div className="data-panel-head"><div><h3>{isStats ? "用量趋势" : isKey ? "密钥列表" : `${selected}概览`}</h3><span>最近 30 天</span></div><button><FileKey2 size={16} />导出数据</button></div>
        <div className="chart-placeholder">
          <div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0</span></div>
          <div className="chart-area">
            {[42, 55, 48, 69, 58, 76, 71, 84, 78, 92, 86, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
        </div>
      </div>
    </>
  );
}
