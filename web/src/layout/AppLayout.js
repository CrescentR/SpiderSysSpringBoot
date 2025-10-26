import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AutoBreadcrumb from '../components/AutoBreadcrumb';
import { HEADER_NAV } from '@/config/menu';
const { Header, Content } = Layout;
const AppLayout = () => {
    const location = useLocation();
    const path = location.pathname;
    // 顶栏
    const headerItems = HEADER_NAV.map(it => ({
        key: it.key,
        label: (_jsx(Link, { to: it.key, children: _jsxs("span", { children: [React.createElement(it.icon), " ", it.label] }) }))
    }));
    // 选中顶栏：优先匹配除了'/'之外的前缀
    const selectedHeaderKey = (() => {
        const keys = HEADER_NAV.map(h => h.key).filter(k => k !== '/');
        const match = keys.find(k => path.startsWith(k));
        return match ?? '/';
    })();
    return (_jsxs(Layout, { style: { minHeight: '100vh' }, children: [_jsxs(Header, { style: { display: 'flex', alignItems: 'center' }, children: [_jsx("div", { className: "demo-logo" }), _jsx(Menu, { theme: "dark", mode: "horizontal", selectedKeys: [selectedHeaderKey], items: headerItems, style: { flex: 1, minWidth: 0 } })] }), _jsx(Layout, { style: { minHeight: 'calc(100vh - 64px)' }, children: _jsxs(Layout, { style: { padding: '0 24px 24px', minHeight: '100%' }, children: [_jsx(AutoBreadcrumb, {}), _jsx(Content, { style: { background: 'transparent', minHeight: '100%' }, children: _jsx(Outlet, {}) })] }) })] }));
};
export default AppLayout;
