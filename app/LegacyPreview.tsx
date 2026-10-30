"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, MoreVertical, UsersRound } from "lucide-react";
import sourceNavigation from "./legacy-navigation.json";

type LegacyItem = { key: string; name: string; icon?: string; navigationMode?: string; footer?: boolean; beta?: boolean; systemOnly?: boolean; children?: LegacyItem[] };
const sourceMenus = sourceNavigation as LegacyItem[];

function LegacyIcon({ item }: { item: LegacyItem }) {
  return <span className="legacy-source-icon" aria-hidden="true" style={item.icon ? { maskImage: `url("${item.icon}")`, WebkitMaskImage: `url("${item.icon}")` } : { visibility: "hidden" }} />;
}

export function LegacyPreview({ organization, userRole, onReturn }: { organization: string; userRole: string; onReturn: () => void }) {
  const [selected, setSelected] = useState<LegacyItem>(sourceMenus[0]);
  const [secondary, setSecondary] = useState<LegacyItem | null>(null);
  const [flyout, setFlyout] = useState<{ item: LegacyItem; top: number } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filter = (items: LegacyItem[]): LegacyItem[] => items.filter(item => !item.systemOnly || userRole === "系统管理员").map(item => ({ ...item, ...(item.children ? { children: filter(item.children) } : {}) }));
  const menus = filter(sourceMenus);
  const primary = menus.filter(item => !item.footer);
  const footer = menus.filter(item => item.footer);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setFlyout(null); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);
  const clearClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const scheduleClose = () => { clearClose(); closeTimer.current = setTimeout(() => setFlyout(null), 160); };
  const firstLeaf = (item: LegacyItem): LegacyItem | undefined => item.children?.flatMap(child => child.children ?? [child]).find(child => !child.children && child.navigationMode !== "DRILL_DOWN");
  const choose = (item: LegacyItem) => {
    clearClose(); setFlyout(null);
    if (item.navigationMode === "DRILL_DOWN") { setSecondary(item); setSelected(firstLeaf(item) ?? item); }
    else setSelected(item);
  };
  const showFlyout = (item: LegacyItem, element: HTMLElement) => {
    clearClose();
    const top = Math.max(10, Math.min(element.getBoundingClientRect().top - 4, window.innerHeight - (item.children?.length ?? 0) * 35 - 22));
    setFlyout({ item, top });
  };
  const containsSelected = (item: LegacyItem): boolean => item.key === selected.key || !!item.children?.some(containsSelected);
  const renderItem = (item: LegacyItem) => <button key={item.key} className={`legacy-nav-item ${item.navigationMode === "DRILL_DOWN" ? secondary?.key === item.key ? "active" : "" : selected.key === item.key ? "active" : ""}`} onClick={() => choose(item)} aria-current={selected.key === item.key ? "page" : undefined}><LegacyIcon item={item} /><span className="legacy-nav-label">{item.name}</span>{item.beta && <small>BETA</small>}{item.navigationMode === "DRILL_DOWN" && <ChevronRight size={14} />}</button>;
  const renderGroupOrItem = (item: LegacyItem) => item.children?.length && item.navigationMode !== "DRILL_DOWN" ? <section className="legacy-nav-section" key={item.key} aria-label={item.name}><div className="legacy-nav-heading">{item.name}</div>{item.children.map(renderItem)}</section> : renderItem(item);
  return <div className="legacy-shell">
    <aside className="legacy-sidebar" aria-label="旧版导航栏">
      <button className="legacy-brand" onClick={onReturn} aria-label="点击平台 Logo 返回新版总览" title="返回新版总览">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="wanwu-brand.png" alt="中国联通 · 元景万悟" />
      </button>
      <div className="legacy-organization"><span className="legacy-org-icon"><UsersRound size={14} /></span><span>{organization === "系统空间" ? "--- 系统 ---" : organization}</span><ChevronDown size={13} /></div>
      <nav className="legacy-nav" aria-label={secondary ? `${secondary.name}二级导航` : "旧版业务导航"}>{secondary ? <><button className="legacy-drill-back" onClick={() => { setSecondary(null); setFlyout(null); }}><ChevronLeft size={17} /><span>{secondary.name}</span></button>{secondary.children?.map(renderGroupOrItem)}</> : primary.map(renderGroupOrItem)}</nav>
      <div className="legacy-utilities">{footer.map(item => <button key={item.key} className={`legacy-nav-item ${containsSelected(item) ? "active" : ""}`} aria-expanded={item.children ? flyout?.item.key === item.key : undefined} aria-controls={item.children && flyout?.item.key === item.key ? "legacy-footer-flyout" : undefined} onMouseEnter={event => { if (item.children) showFlyout(item, event.currentTarget); }} onMouseLeave={scheduleClose} onClick={event => item.children ? flyout?.item.key === item.key ? setFlyout(null) : showFlyout(item, event.currentTarget) : choose(item)}><LegacyIcon item={item} /><span className="legacy-nav-label">{item.name}</span>{item.children && <ChevronRight size={14} />}</button>)}</div>
      <div className="legacy-user"><span className="legacy-avatar">林</span><div><strong>林雨晴</strong><small>{userRole}</small></div><MoreVertical size={16} aria-hidden="true" /></div>
      {flyout && <><button className="legacy-flyout-dismiss" aria-label="关闭旧版管理菜单" onClick={() => setFlyout(null)} /><nav id="legacy-footer-flyout" className="legacy-flyout" aria-label={flyout.item.name} style={{ top: flyout.top } as CSSProperties} onMouseEnter={clearClose} onMouseLeave={scheduleClose}>{flyout.item.children?.map(renderItem)}</nav></>}
    </aside>
    <main className="legacy-main"><div className="legacy-page-label" aria-live="polite"><span>旧版工作台{secondary ? ` / ${secondary.name}` : ""}</span><h1>{selected.name}</h1></div><p className="legacy-return-hint">侧栏布局模拟 · 点击左上角 Logo 返回新版总览</p></main>
  </div>;
}
