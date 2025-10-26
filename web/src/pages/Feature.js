import { jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { theme } from 'antd';
export default function Feature() {
    const { n } = useParams();
    const { token } = theme.useToken();
    return (_jsxs("div", { style: { padding: 24, minHeight: 280, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }, children: ["\u529F\u80FD", n] }));
}
