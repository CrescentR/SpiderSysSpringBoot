import { jsx as _jsx } from "react/jsx-runtime";
import { theme } from 'antd';
export default function Settings() {
    const { token } = theme.useToken();
    return (_jsx("div", { style: { padding: 24, minHeight: 280, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }, children: "\u8BBE\u7F6E" }));
}
