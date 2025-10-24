
import { theme } from 'antd'

export default function Settings() {
  const { token } = theme.useToken()
  return (
    <div style={{ padding: 24, minHeight: 280, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
      设置
    </div>
  )
}
