import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @file index.tsx
 * @description This file defines the routing configuration of the application.
 */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
const AppLayout = lazy(() => import('@/layout/AppLayout'));
const Home = lazy(() => import('@/pages/Home'));
const Reports = lazy(() => import('@/pages/Reports'));
const Settings = lazy(() => import('@/pages/Settings'));
const Feature = lazy(() => import('@/pages/Feature'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const TaskList = lazy(() => import('@/pages/TaskList'));
const SpiderResult = lazy(() => import('@/pages/SpiderResult'));
const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(AppLayout, {}),
        children: [
            { index: true, element: _jsx(Home, {}) },
            { path: 'reports', element: _jsx(Reports, {}) },
            { path: 'settings', element: _jsx(Settings, {}) },
            { path: 'feature/:n', element: _jsx(Feature, {}) },
            { path: 'task-list', element: _jsx(TaskList, {}) },
            { path: 'spider-result', element: _jsx(SpiderResult, {}) },
            { path: '*', element: _jsx(NotFound, {}) }
        ]
    }
]);
export default router;
