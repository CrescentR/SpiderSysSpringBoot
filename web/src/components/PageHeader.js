import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @file PageHeader.tsx
 * @description 通用页面头部组件，使用 Ant Design 5 的 Typography。
 */
import React from 'react';
import { Typography } from 'antd';
// 使用最新写法：避免使用 antd v4 的 PageHeader（已不推荐），改用 Typography。
const CustomPageHeader = ({ title, subtitle }) => (_jsxs("div", { style: { margin: '0 0 16px 0' }, children: [_jsx(Typography.Title, { level: 3, style: { marginBottom: 4 }, children: title }), subtitle ? (_jsx(Typography.Text, { type: "secondary", children: subtitle })) : null] }));
export default CustomPageHeader;
