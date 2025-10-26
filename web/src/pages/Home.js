import { jsx as _jsx } from "react/jsx-runtime";
import { theme } from 'antd';
export default function Home() {
    const { token } = theme.useToken();
    return (_jsx("div", { style: { padding: 24, minHeight: '100%', background: token.colorBgContainer, borderRadius: token.borderRadiusLG }, children: "\u9996\u9875" }));
}
