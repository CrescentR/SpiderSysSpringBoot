/**
 * @file index.tsx
 * @description This file defines the routing configuration of the application.
 */

import  { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const AppLayout = lazy(() => import('@/layout/AppLayout'))
const Home = lazy(() => import('@/pages/Home'))
const Reports = lazy(() => import('@/pages/Reports'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const TaskList = lazy(() => import('@/pages/TaskList'))
const SpiderResult = lazy(() => import('@/pages/SpiderResult'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'reports', element: <Reports /> },
      { path: 'task-list', element: <TaskList /> },
      { path: 'spider-result', element: <SpiderResult /> },
      { path: '*', element: <NotFound /> }
    ]
  }
])

export default router