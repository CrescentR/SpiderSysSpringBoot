/**
 * @file TaskList.tsx
 * @description 任务列表页面：演示在前端进行基础的增删改（CRUD）操作。
 * 使用 React 18 + Ant Design 5 的最新写法，包含详细中文注释，便于学习。
 */

import React, {useEffect, useState} from 'react'
import {message, Table, Button, Modal, Form, Input, Space, Popconfirm, Select,} from 'antd'
import type {ColumnsType} from 'antd/es/table'
// import CustomPageHeader from '@/components/PageHeader'
import axios from 'axios'
import {PlusOutlined} from "@ant-design/icons";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 任务的基本类型定义
interface TaskItem {
    id: number
    name: string
    description: string,
    keywords: Array<string>,
    maxPages: number,
    status: string,
    createdAt: string,
    updatedAt: string
}

// 状态选项（下拉框使用）
// const STATUS_OPTIONS: TaskItem['status'][] = ['待运行', '运行中', '已完成', '失败']

const TaskListPage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    // const { token } = theme.useToken()
    // 任务列表状态（模拟数据源）。真实项目中可替换为后端 API。
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [total, setTotal] = useState<number>(0)
    const [editing, setEditing] = useState<TaskItem | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [listForm] = Form.useForm<TaskItem>();
    const [searchForm] = Form.useForm();
    const columns: ColumnsType<TaskItem> = [
        {title: "任务名称", dataIndex: "name", key: "name"},
        {title: "描述", dataIndex: "description", key: "description"},
        {
            title: "关键词",
            dataIndex: "keywords",
            key: "keywords",
            render: (keywords: string[]) => keywords.join(", "),
        },
        {title: "最大页数", dataIndex: "maxPages", key: "maxPages"},
        {title: "状态", dataIndex: "status", key: "status"},
        {title: "创建时间", dataIndex: "createdAt", key: "createdAt"},
        {title: "更新时间", dataIndex: "updatedAt", key: "updatedAt"},
        {
            title: "操作", key: "actions",
            render: (_: unknown, record: TaskItem) => (
                <Space>
                    <Button type="link" onClick={() => openEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title={"删除该任务"}
                        description={"确定要删除该任务吗？此操作不可撤销。"}
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => runTask(record, record.id)}>
                        运行
                    </Button>
                </Space>
            ),
        },
    ]

    const fetchTasks = async (page = currentPage, size = pageSize,searchKeyword={}) => {
        try {
            setLoading(true);
            if(searchKeyword!=null && Object.keys(searchKeyword).length>0){
                const res = await axios.get(`${BASE_URL}/SpiderTask/search`, {
                    params: {
                        currentPage: currentPage,
                        pageSize: pageSize,
                        searchKeyword:searchKeyword,
                    },
                });
                if (res.data.code === 200) {
                    message.destroy();
                    messageApi.success({content: "搜索任务成功", duration: 2});
                    setTasks(res.data.data);
                    const totalCount = res.data.total || 0;
                    setTotal(totalCount)
                } else {
                    messageApi.error(res.data.msg || "搜索任务失败");
                }
            }else{
                const res2 = await axios.get(`${BASE_URL}/SpiderTask/query`, {
                    params: {
                        currentPage: page, pageSize: size,
                    },
                })
                if (res2.data.code === 200) {
                    message.destroy();
                    messageApi.success({content: "获取任务列表成功", duration: 2});
                    setTasks(res2.data.data);
                    const totalCount = res2.data.total || 0;
                    setTotal(totalCount)
                } else {
                    messageApi.error(res2.data.msg || "获取任务列表失败");
                }
            }
            }catch (error) {
            console.error("获取任务列表失败:", error);
            message.error("获取任务列表失败");
        } finally {

            setLoading(false)
        }
    };
    useEffect(() => {
        const values = searchForm.getFieldsValue();
        fetchTasks(values);
    }, [currentPage, pageSize]);
    const handleKeyword = (keywords: string) => {
        return keywords.split(/[,，]/)              // 按中英文逗号分割
            .map(k => k.trim())          // 去掉空格
            .filter(k => k.length > 0);  // 去掉空字符串
    }
    const openAdd = () => {
        setEditing(null);
        listForm.resetFields();
        setModalOpen(true);
    }
    const openEdit = (record: TaskItem) => {
        setEditing(record);
        listForm.setFieldsValue(record);
        setModalOpen(true);
    }
    const handleOk = async () => {
        const param = await listForm.validateFields();
        if (typeof param.keywords === "string") {
            param.keywords = handleKeyword(param.keywords);
        }
        console.log(param)
        if (editing) {
            const res = await axios.post(`${BASE_URL}/SpiderTask/update`, {
                ...param,
                id: editing.id
            });
            if (res.data.code === 200) {
                message.success("修改成功");
                setModalOpen(false);
                setEditing(null);
                await fetchTasks();
            } else {
                message.error(res.data.msg || "修改失败");
            }
        } else {
            const res = await axios.post(`${BASE_URL}/SpiderTask/insert`, param);
            if (res.data.code === 200) {
                message.success("添加成功");
                setModalOpen(false);
                setEditing(null);
                await fetchTasks();
            } else {
                message.error(res.data.msg || "修改失败");
            }
            message.success(res.data.msg || "添加成功");
        }
        await fetchTasks();
    }
    const handleSearch = () => {
        setCurrentPage(1);
        fetchTasks(searchForm.getFieldsValue());
    }
    const handleCancel = () => {
        setModalOpen(false);
        setEditing(null);
        listForm.resetFields();
    }
    const handleReset = () => {
        searchForm.resetFields();
        setCurrentPage(1);
        fetchTasks();
    }
    const handleDelete = async (id: number) => {
        const res = await axios.post(`${BASE_URL}/SpiderTask/delete?id=${id}`);
        message.success(res.data.msg || "删除成功");
        await fetchTasks();
    }
    const runTask = async (record: TaskItem, id: number) => {
        listForm.setFieldsValue(record);
        const param = await listForm.validateFields();
        const res = await axios.get(`${BASE_URL}/SpiderTask/start?id=${id}`);
        param.status = "已完成";
        if (res.data.code === 200) {
            const res2 = await axios.post(`${BASE_URL}/SpiderTask/update`, {
                ...param,
                id: id
            });
            if (res2.data.code === 200) {
                await fetchTasks();
                messageApi.success("任务启动成功!")
            } else {
                messageApi.error(res2.data.msg || "任务状态更新失败!")
            }
        } else {
            messageApi.error(res.data.msg || "任务启动失败!")
        }
    }
    return (
        <>
            {contextHolder}
            <div className="min-h-screen p-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <Form layout="inline" form={searchForm}>
                        <Form.Item name="searchInfo" label="搜索">
                            <Input placeholder="支持搜索名称、描述、关键词、时间" allowClear
                                   style={{width: 300}}/>
                        </Form.Item>
                        <Form.Item name="status" label="任务状态">
                            <Select
                                placeholder="选择状态"
                                allowClear
                                style={{width: 200}}
                                onChange={()=>{
                                    setCurrentPage(1);
                                    fetchTasks(searchForm.getFieldsValue());
                                }}
                            >
                                <Select.Option value="OK">已完成</Select.Option>
                                <Select.Option value="CREATED">已创建</Select.Option>
                                <Select.Option value="FAIL">已失败</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" onClick={handleSearch}>
                                    搜索
                                </Button>
                                <Button onClick={handleReset}>重置</Button>
                            </Space>
                        </Form.Item>
                    </Form>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4">
                        <h2>任务列表</h2>
                        <Button type="primary" icon={<PlusOutlined/>} onClick={openAdd}>
                            新增
                        </Button>
                    </div>
                    <Table<TaskItem>
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
                    <Modal
                        title={editing ? `编辑任务:${editing.name}` : "新增任务"}
                        open={modalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText={editing ? "保存" : "创建"}
                        cancelText="取消"
                    >
                        <Form<TaskItem>
                            layout="vertical"
                            form={listForm}
                        >
                            <Form.Item
                                name="name"
                                label="任务名称"
                                rules={[{required: true, message: "请输入任务名称"}]}
                            >
                                <Input placeholder="任务名称"/>
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="任务描述"
                            >
                                <Input placeholder="任务描述"/>
                            </Form.Item>
                            <Form.Item
                                name="keywords"
                                label="爬取关键词"
                                rules={[{required: true, message: "请输入需要爬取的关键词,用英文逗号隔开"}]}
                            >
                                <Select
                                    mode="tags"
                                    tokenSeparators={[",", "，"]}
                                    placeholder="输入后回车或使用逗号分隔"
                                />
                                {/*<Input placeholder="请输入需要爬取的关键词,用英文逗号隔开"/>*/}
                            </Form.Item>
                            <Form.Item
                                name="maxPages"
                                label="最大爬取页面数量"
                            >

                                <Input placeholder="请输入需要爬取最大页面数量"/>
                            </Form.Item>
                            <Form.Item
                                name="timeout"
                                label="时间延迟(秒)"
                            >
                                <Input placeholder="请输入时间延迟(秒)"/>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>

    )
}

export default TaskListPage
