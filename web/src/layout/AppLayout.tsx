import React from 'react'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import AutoBreadcrumb from '../components/AutoBreadcrumb'
import { HEADER_NAV } from '@/config/menu'

const { Header, Content } = Layout

const AppLayout: React.FC = () => {
  const location = useLocation()
  const path = location.pathname


  // 顶栏
  const headerItems: MenuProps['items'] = HEADER_NAV.map(it => ({
    key: it.key,
    label: (
      <Link to={it.key}>
        <span>{React.createElement(it.icon)} {it.label}</span>
      </Link>
    )
  }))


  // 选中顶栏：优先匹配除了'/'之外的前缀
  const selectedHeaderKey = (() => {
    const keys = HEADER_NAV.map(h => h.key).filter(k => k !== '/')
    const match = keys.find(k => path.startsWith(k))
    return match ?? '/'
  })()


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedHeaderKey]}
          items={headerItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>

      <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>

        <Layout style={{ padding: '0 24px 24px', minHeight: '100%' }}>
          <AutoBreadcrumb />
          <Content style={{ background: 'transparent', minHeight: '100%' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppLayout