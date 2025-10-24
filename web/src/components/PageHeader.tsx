/**
 * @file PageHeader.tsx
 * @description 通用页面头部组件，使用 Ant Design 5 的 Typography。
 */

import React from 'react'
import { Typography } from 'antd'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

// 使用最新写法：避免使用 antd v4 的 PageHeader（已不推荐），改用 Typography。
const CustomPageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <div style={{ margin: '0 0 16px 0' }}>
    <Typography.Title level={3} style={{ marginBottom: 4 }}>{title}</Typography.Title>
    {subtitle ? (
      <Typography.Text type="secondary">{subtitle}</Typography.Text>
    ) : null}
  </div>
)

export default CustomPageHeader