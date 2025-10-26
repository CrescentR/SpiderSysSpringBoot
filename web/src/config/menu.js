import { HomeOutlined, BarChartOutlined, SettingOutlined, UserOutlined, LaptopOutlined, NotificationOutlined, UnorderedListOutlined, FileTextOutlined } from '@ant-design/icons';
export const HEADER_NAV = [
    { key: '/', label: '首页', icon: HomeOutlined },
    { key: '/task-list', label: '任务列表', icon: UnorderedListOutlined },
    { key: '/spider-result', label: '爬虫结果', icon: FileTextOutlined },
    { key: '/reports', label: '报表', icon: BarChartOutlined },
    { key: '/settings', label: '设置', icon: SettingOutlined },
    { key: '/test-page', label: '测试页面', icon: SettingOutlined }
];
export const SIDE_GROUPS = [
    { key: 'sub1', label: '模块 1', icon: UserOutlined, start: 1, count: 4 },
    { key: 'sub2', label: '模块 2', icon: LaptopOutlined, start: 5, count: 4 },
    { key: 'sub3', label: '模块 3', icon: NotificationOutlined, start: 9, count: 4 }
];
export const featurePath = (n) => `/feature/${n}`;
export const openKeyFromPath = (path) => {
    if (path.startsWith('/feature/')) {
        const n = Number(path.split('/').pop() || '1');
        const groupIndex = Math.floor((n - 1) / 4);
        return `sub${groupIndex + 1}`;
    }
    return 'sub1';
};
