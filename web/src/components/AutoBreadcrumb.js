import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
const AutoBreadcrumb = () => {
    const location = useLocation();
    const items = React.useMemo(() => {
        const list = [{ title: _jsx(Link, { to: "/", children: "Home" }) }];
        const path = location.pathname;
        if (path === '/')
            return list;
        if (path.startsWith('/task-list')) {
            list.push({ title: '任务列表' });
            return list;
        }
        if (path.startsWith('/spider-result')) {
            list.push({ title: '爬虫结果' });
            return list;
        }
        if (path.startsWith('/reports')) {
            list.push({ title: '报表' });
            return list;
        }
        if (path.startsWith('/settings')) {
            list.push({ title: '设置' });
            return list;
        }
        if (path.startsWith('/feature/')) {
            const n = path.split('/').pop();
            list.push({ title: '功能页' });
            list.push({ title: `功能${n}` });
            return list;
        }
        list.push({ title: '未分类' });
        return list;
    }, [location.pathname]);
    return _jsx(Breadcrumb, { items: items, style: { margin: '16px 0' } });
};
export default AutoBreadcrumb;
