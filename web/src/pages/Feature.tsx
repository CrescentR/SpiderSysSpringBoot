
import { useParams } from 'react-router-dom'
import { theme } from 'antd'

export default function Feature() {
  const { n } = useParams()
  const { token } = theme.useToken()
  return (
    <div style={{ padding: 24, minHeight: 280, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
      功能{n}
    </div>
  )
}
