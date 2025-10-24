
import { theme } from 'antd'

export default function Home() {
  const { token } = theme.useToken()
  return (
    <div style={{ padding: 24, minHeight: '100%', background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
      首页
    </div>
  )
}