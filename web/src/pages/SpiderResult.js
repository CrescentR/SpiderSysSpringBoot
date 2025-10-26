import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * @file TaskList.tsx
 * @description 任务列表页面：演示在前端进行基础的增删改（CRUD）操作。
 * 使用 React 18 + Ant Design 5 的最新写法，包含详细中文注释，便于学习。
 */
import React, { useEffect, useState } from 'react';
import { Table, message, Popconfirm, Button } from 'antd';
// import CustomPageHeader from '@/components/PageHeader'
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
// 状态选项（下拉框使用）
// const STATUS_OPTIONS: TaskItem['status'][] = ['待运行', '运行中', '已完成', '失败']
const TaskResultPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const columns = [
        { title: "任务id", dataIndex: "taskName", key: "taskName" },
        { title: "标题", dataIndex: "title", key: "title" },
        { title: "关键词", dataIndex: "keywords", key: "title" },
        {
            title: "链接", dataIndex: "url", key: "url",
            render: (url, _) => (url ? (_jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", style: {
                    color: '#1677ff',
                    fontWeight: 500,
                    textDecoration: 'underline',
                }, onMouseEnter: (e) => {
                    e.currentTarget.style.color = '#4096ff';
                }, onMouseLeave: (e) => {
                    e.currentTarget.style.color = '#1677ff';
                }, onClick: (e) => {
                    // 可选：防止行点击事件（如果你让整行可点）重复打开
                    e.stopPropagation();
                }, children: url })) : (_jsx("span", { style: { color: '#999' }, children: "\u65E0" }))),
        },
        { title: "来源", dataIndex: "source", key: "source" },
        { title: "时间", dataIndex: "dateTime", key: "dateTime" },
    ];
    const fetchTasks = async (page = currentPage, size = pageSize) => {
        try {
            setLoading(true);
            const res1 = await axios.get(`${BASE_URL}/SpiderResult/query`, {
                params: {
                    currentPage: page, pageSize: size,
                },
            });
            const res2 = await axios.get(`${BASE_URL}/SpiderTask/getTaskName`);
            if (res1.data.code === 200) {
                setTasks(res1.data.data);
                const totalCount = res1.data.total || 0;
                setTotal(totalCount);
            }
            else {
                message.destroy();
                messageApi.error(res1.data.msg || "获取结果列表失败");
            }
            if (res2.data.code === 200) {
                const taskMap = {};
                res2.data.data.forEach((task) => {
                    taskMap[task.id] = task.name;
                });
                // 将任务名称映射到结果列表
                res1.data.data.forEach((item) => {
                    item.taskName = taskMap[item.taskId] || '未知任务';
                });
            }
            else {
                messageApi.error(res2.data.msg || "获取任务名称失败");
            }
        }
        catch (error) {
            message.destroy();
            console.error("获取结果列表失败:", error);
            messageApi.error("获取结果列表失败");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTasks(currentPage, pageSize);
    }, [currentPage, pageSize]);
    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };
    const handleBatchDelete = async () => {
        if (selectedRowKeys.length === 0) {
            messageApi.warning("请先选择要删除的行!");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/SpiderResult/deleteBatch`, selectedRowKeys);
            if (res.data.code === 200) {
                message.destroy();
                messageApi.success({ content: "批量删除成功!", duration: 2 });
                setSelectedRowKeys([]);
                // 删除后刷新列表
                fetchTasks(currentPage, pageSize);
            }
            else {
                message.destroy();
                messageApi.error(res.data.msg || "批量删除失败!");
            }
        }
        finally {
            setLoading(true);
        }
    };
    return (_jsxs(_Fragment, { children: [contextHolder, _jsxs("div", { style: { padding: 20 }, children: [_jsx("div", { style: { marginBottom: 16 }, children: _jsx(Popconfirm, { title: "\u786E\u8BA4\u5220\u9664\u9009\u4E2D\u7684\u9879\uFF1F", onConfirm: handleBatchDelete, okText: "\u786E\u8BA4", cancelText: "\u53D6\u6D88", children: _jsx(Button, { danger: true, disabled: !selectedRowKeys.length, loading: loading, children: "\u5220\u9664\u9009\u4E2D\u9879" }) }) }), _jsx("h2", { children: "\u7ED3\u679C\u5217\u8868" }), _jsx(Table, { rowSelection: rowSelection, loading: loading, rowKey: "id", columns: columns, dataSource: tasks, pagination: {
                            current: currentPage,
                            pageSize,
                            total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (t) => `共 ${t} 条`,
                            onChange: (page, size) => {
                                // 页码或页大小变化即触发 useEffect 拉取
                                setCurrentPage(page);
                                setPageSize(size ?? pageSize);
                            },
                            onShowSizeChange: (_, size) => {
                                // 切换每页数量时回到第 1 页更友好
                                setCurrentPage(1);
                                setPageSize(size);
                            },
                        } })] })] }));
};
export default TaskResultPage;
