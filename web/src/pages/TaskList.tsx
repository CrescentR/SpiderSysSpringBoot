import React, { useEffect, useState } from "react";
import {
    message,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Popconfirm,
    Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

// @ts-ignore
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface TaskItem {
    id: number;
    name: string;
    description: string;
    keywords: Array<string>;
    maxPages: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const TaskListPage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [editing, setEditing] = useState<TaskItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [listForm] = Form.useForm<TaskItem>();
    const [searchForm] = Form.useForm();

    /** 表格列配置 */
    const columns: ColumnsType<TaskItem> = [
        { title: "任务名称", dataIndex: "name", key: "name" },
        { title: "描述", dataIndex: "description", key: "description" },
        {
            title: "关键词",
            dataIndex: "keywords",
            key: "keywords",
            render: (keywords: string[]) => (Array.isArray(keywords) ? keywords.join(", ") : keywords),
        },
        { title: "最大页数", dataIndex: "maxPages", key: "maxPages" },
        { title: "状态", dataIndex: "status", key: "status" },
        { title: "创建时间", dataIndex: "createdAt", key: "createdAt" },
        { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt" },
        {
            title: "操作",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => openEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="删除该任务"
                        description="确定要删除该任务吗？此操作不可撤销。"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => runTask(record.id)}>
                        运行
                    </Button>
                </Space>
            ),
        },
    ];

    /** ✅ 获取任务列表（统一函数） */
    const fetchTasks = async (filters?: any) => {
        const { searchInfo, status } = filters || searchForm.getFieldsValue();

        try {
            setLoading(true);
            let res;

            if (searchInfo || status) {
                // 调用搜索接口
                res = await axios.get(`${BASE_URL}/SpiderTask/search`, {
                    params: {
                        currentPage,
                        pageSize,
                        searchKeyword: searchInfo || "",
                        status: status || "",
                    },
                });
                if (res.data.code === 200) {
                    const { data, total: totalCount } = res.data;
                    setTasks(data || []);
                    setTotal(totalCount || 0);
                } else {
                    messageApi.error(res.data.msg || "搜索任务失败");
                }
            } else {
                // 调用普通查询接口
                res = await axios.get(`${BASE_URL}/SpiderTask/query`);
				
                if (res.data.code === 200) {
                    setTasks(res.data.data || []);
                    setTotal(res.data.total || 0);
                } else {
                    messageApi.error(res.data.msg || "获取任务列表失败");
                }
            }
        } catch (error) {
            console.error("获取任务失败:", error);
            message.error("获取任务失败");
        } finally {
            setLoading(false);
        }
    };

    /** ✅ 生命周期：加载/分页变化触发 */
    useEffect(() => {
        fetchTasks();
    }, [currentPage, pageSize]);

    /** 添加、编辑、删除逻辑保持不变 */
    const openAdd = () => {
        setEditing(null);
        listForm.resetFields();
        setModalOpen(true);
    };
    const openEdit = (record: TaskItem) => {
        setEditing(record);
        listForm.setFieldsValue(record);
        setModalOpen(true);
    };
    const handleOk = async () => {
        const param = await listForm.validateFields();
        if (editing) {
            const res = await axios.post(`${BASE_URL}/SpiderTask/update`, {
                ...param,
                id: editing.id,
            });
            if (res.data.code === 200) {
                message.success("修改成功");
                setModalOpen(false);
                await fetchTasks();
            } else {
                message.error(res.data.msg || "修改失败");
            }
        } else {
            const res = await axios.post(`${BASE_URL}/SpiderTask/insert`, param);
            if (res.data.code === 200) {
                message.success("添加成功");
                setModalOpen(false);
                await fetchTasks();
            } else {
                message.error(res.data.msg || "添加失败");
            }
        }
    };
    const handleDelete = async (id: number) => {
        const res = await axios.post(`${BASE_URL}/SpiderTask/delete?id=${id}`);
        message.success(res.data.msg || "删除成功");
        await fetchTasks();
    };
    const runTask = async (id: number) => {
        const res = await axios.get(`${BASE_URL}/SpiderTask/start?id=${id}`);
        if (res.data.code === 200) {
            messageApi.success("任务启动成功!");
            await fetchTasks();
        } else {
            messageApi.error(res.data.msg || "任务启动失败!");
        }
    };

    /** ✅ 搜索与重置逻辑 */
    const handleSearch = () => {
        setCurrentPage(1);
        fetchTasks(searchForm.getFieldsValue());
    };
    const handleReset = () => {
        searchForm.resetFields();
        setCurrentPage(1);
        fetchTasks();
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen p-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    {/* 搜索表单 */}
                    <Form layout="inline" form={searchForm}>
                        <Form.Item name="searchInfo" label="搜索">
                            <Input
                                placeholder="支持搜索名称、描述、关键词"
                                allowClear
                                style={{ width: 300 }}
                            />
                        </Form.Item>
                        <Form.Item name="status" label="任务状态">
                            <Select
                                placeholder="选择状态"
                                allowClear
                                style={{ width: 200 }}
                                onChange={() => {
                                    setCurrentPage(1);
                                    fetchTasks(searchForm.getFieldsValue());
                                }}
                            >
                                <Select.Option value="已完成">已完成</Select.Option>
                                <Select.Option value="已创建">已创建</Select.Option>
                                <Select.Option value="已失败">已失败</Select.Option>
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

                    {/* 操作栏 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4 mt-4">

                        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                            新增
                        </Button>
                    </div>

                    {/* 表格 */}
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
                                setCurrentPage(page);
                                setPageSize(size ?? pageSize);
                            },
                            onShowSizeChange: (_, size) => {
                                setCurrentPage(1);
                                setPageSize(size);
                            },
                        }}
                    />

                    {/* 弹窗表单 */}
                    <Modal
                        title={editing ? `编辑任务：${editing.name}` : "新增任务"}
                        open={modalOpen}
                        onOk={handleOk}
                        onCancel={() => {
                            setModalOpen(false);
                            setEditing(null);
                            listForm.resetFields();
                        }}
                        okText={editing ? "保存" : "创建"}
                        cancelText="取消"
                    >
                        <Form<TaskItem> layout="vertical" form={listForm}>
                            <Form.Item
                                name="name"
                                label="任务名称"
                                rules={[{ required: true, message: "请输入任务名称" }]}
                            >
                                <Input placeholder="任务名称" />
                            </Form.Item>
                            <Form.Item name="description" label="任务描述">
                                <Input placeholder="任务描述" />
                            </Form.Item>
                            <Form.Item
                                name="keywords"
                                label="爬取关键词"
                                rules={[
                                    { required: true, message: "请输入关键词（可用逗号分隔）" },
                                ]}
                            >
                                <Select
                                    mode="tags"
                                    tokenSeparators={[",", "，"]}
                                    placeholder="输入后回车或使用逗号分隔"
                                />
                            </Form.Item>
                            <Form.Item name="maxPages" label="最大爬取页面数量">
                                <Input placeholder="请输入最大页数" />
                            </Form.Item>
                            <Form.Item name="timeout" label="时间延迟(秒)">
                                <Input placeholder="请输入时间延迟(秒)" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default TaskListPage;
