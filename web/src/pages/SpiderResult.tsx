/**
 * @file TaskList.tsx
 * @description 任务列表页面：演示在前端进行基础的增删改（CRUD）操作。
 * 使用 React 18 + Ant Design 5 的最新写法，包含详细中文注释，便于学习。
 */

import React, {useEffect, useState} from 'react'
import {Table, message,Popconfirm,Button} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import axios from 'axios'
const VITE_BASE_URL= import.meta.env.VITE_BASE_URL
// 任务的基本类型定义
interface TaskItem {
    id: number
    taskName: string
    taskId: number
    title: string,
    keywords: string,
    url: string,
    source: string,
    dateTime: string,

}

// 状态选项（下拉框使用）
// const STATUS_OPTIONS: TaskItem['status'][] = ['待运行', '运行中', '已完成', '失败']

const TaskResultPage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [total, setTotal] = useState<number>(0)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const columns: ColumnsType<TaskItem> = [
        {title: "任务名称", dataIndex: "taskName", key: "taskName"},
        {title: "标题", dataIndex: "title", key: "title"},
        {title: "关键词", dataIndex: "keywords", key: "title"},
        {
            title: "链接", dataIndex: "url", key: "url",
            render: (url, _) => (
                url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#1677ff',
                            fontWeight: 500,
                            textDecoration: 'underline',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#4096ff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#1677ff';
                        }}
                        onClick={(e) => {
                            // 可选：防止行点击事件（如果你让整行可点）重复打开
                            e.stopPropagation();
                        }}
                    >
                        {url}
                    </a>
                ) : (
                    <span style={{color: '#999'}}>无</span>
                )
            ),
        },
        {title: "来源", dataIndex: "source", key: "source"},
        {title: "时间", dataIndex: "dateTime", key: "dateTime"},
    ]


    const fetchTasks = async (page = currentPage, size = pageSize) => {
        try {
            setLoading(true);
            const res1 = await axios.get(`${VITE_BASE_URL}/SpiderResult/query`, {
                params: {
                    currentPage: page, pageSize: size,
                },
            })
            const res2 = await axios.get(`${VITE_BASE_URL}/SpiderTask/getTaskName`)

            if (res1.data.code === 200) {
                setTasks(res1.data.data);
                const totalCount = res1.data.total || 0;
                setTotal(totalCount)
            } else {
                message.destroy();
                messageApi.error(res1.data.msg || "获取结果列表失败");
            }
            if (res2.data.code === 200) {
                const taskMap: Record<number, string> = {};
                res2.data.data.forEach((task: { id: number; name: string }) => {
                    taskMap[task.id] = task.name;
                });
                // 将任务名称映射到结果列表
                res1.data.data.forEach((item: TaskItem) => {
                    item.taskName = taskMap[item.taskId] || '未知任务';
                });
            } else {
                messageApi.error(res2.data.msg || "获取任务名称失败");
            }
        } catch (error) {
            message.destroy();
            console.error("获取结果列表失败:", error);
            messageApi.error("获取结果列表失败");
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchTasks(currentPage, pageSize);
    }, [currentPage, pageSize]);
    const rowSelection = {
        selectedRowKeys,
        onChange:setSelectedRowKeys,
    }
    const handleBatchDelete = async () => {
        if (selectedRowKeys.length === 0) {
            messageApi.warning("请先选择要删除的行!");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${VITE_BASE_URL}/SpiderResult/deleteBatch`, selectedRowKeys)
            if (res.data.code === 200) {
                message.destroy();
                messageApi.success({content:"批量删除成功!",duration:2});
                setSelectedRowKeys([]);
                // 删除后刷新列表
                fetchTasks(currentPage, pageSize);
            } else {
                message.destroy();
                messageApi.error(res.data.msg || "批量删除失败!");
            }
        } finally {
            setLoading(true)
        }
    }

    return (
        <>
            {contextHolder}
            <div style={{padding: 20}}>
                <div style={{marginBottom:16}}>
                        <Popconfirm
                            title="确认删除选中的项？"
                            onConfirm={handleBatchDelete}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button danger disabled={!selectedRowKeys.length} loading={loading}>
                                删除选中项
                            </Button>
                        </Popconfirm>
                </div>
                    <h2>结果列表</h2>
                    <Table<TaskItem>
                        rowSelection={rowSelection}
                        loading={loading}
                        rowKey="id"
                        columns={columns}
                        dataSource={tasks}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (t) => `共 ${t} 条`,
                            onChange: (page, size) => {
                                // 页码或页大小变化即触发 useEffect 拉取
                                setCurrentPage(page)
                                setPageSize(size ?? pageSize)
                            },
                            onShowSizeChange: (_, size) => {
                                // 切换每页数量时回到第 1 页更友好
                                setCurrentPage(1)
                                setPageSize(size)
                            },
                        }}
                    />

            </div>
        </>
    )
}

export default TaskResultPage
