import React from 'react'
import { Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom'

const AutoBreadcrumb: React.FC = () => {
  const location = useLocation()

  const items = React.useMemo(() => {
    const list: { title: React.ReactNode }[] = [{ title: <Link to="/">Home</Link> }]
    const path = location.pathname

    if (path === '/') return list

    if (path.startsWith('/task-list')) {
      list.push({ title: '任务列表' })
      return list
    }
    if (path.startsWith('/spider-result')) {
      list.push({ title: '爬虫结果' })
      return list
    }
    if (path.startsWith('/reports')) {
      list.push({ title: '报表' })
      return list
    }
    list.push({ title: '未分类' })
    return list
  }, [location.pathname])

  return <Breadcrumb items={items} style={{ margin: '16px 0' }} />
}

export default AutoBreadcrumb
