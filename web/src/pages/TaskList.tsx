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
    DatePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

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

const { RangePicker } = DatePicker;

const TaskListPage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [editing, setEditing] = useState<TaskItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
            render: (keywords: string[]) =>
                Array.isArray(keywords) ? keywords.join(", ") : keywords,
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

    const fetchTasks = async (page = currentPage, size = pageSize) => {
        const formValues = searchForm.getFieldsValue();
        const { searchKeywords, status, dateRange } = formValues;

        try {
            setLoading(true);

            // 格式化日期范围
            let startTime = "";
            let endTime = "";
            if (dateRange && dateRange.length === 2) {
                startTime = dateRange[0].format("YYYY-MM-DD HH:mm");
                endTime = dateRange[1].format("YYYY-MM-DD HH:mm");
            }

            // 构造请求体
            const requestBody = {
                currentPage: page,
                pageSize: size,
                searchKeywords: searchKeywords || "",
                status: status || "",
                startTime: startTime,
                endTime: endTime,
            };

            const res = await axios.post(`${VITE_BASE_URL}/SpiderTask/search`, requestBody);

            if (res.data.code === 200) {
                const { data, total: totalCount } = res.data;
                setTasks(data || []);
                setTotal(totalCount || 0);
            } else {
                messageApi.error(res.data.msg || "搜索任务失败");
            }
        } catch (error) {
            console.error("获取任务失败:", error);
            message.error("获取任务失败");
        } finally {
            setLoading(false);
        }
    };

    // 初始加载时只传分页参数
    useEffect(() => {
        fetchTasks(1, pageSize);
    }, []);

    // 状态变化时立即搜索
    const handleStatusChange = () => {
        setCurrentPage(1);
        fetchTasks(1, pageSize);
    };

    // 日期范围变化时立即搜索
    const handleDateRangeChange = () => {
        setCurrentPage(1);
        fetchTasks(1, pageSize);
    };

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
    const rowSelection = {
        selectedRowKeys,
        onChange:setSelectedRowKeys,
    }
    const handleOk = async () => {
        const param = await listForm.validateFields();
        if (editing) {
            const res = await axios.post(`${VITE_BASE_URL}/SpiderTask/update`, {
                ...param,
                id: editing.id,
            });
            if (res.data.code === 200) {
                message.success("修改成功");
                setModalOpen(false);
                await fetchTasks(currentPage, pageSize);
            } else {
                message.error(res.data.msg || "修改失败");
            }
        } else {
            const res = await axios.post(`${VITE_BASE_URL}/SpiderTask/insert`, param);
            if (res.data.code === 200) {
                message.success("添加成功");
                setModalOpen(false);
                await fetchTasks(currentPage, pageSize);
            } else {
                message.error(res.data.msg || "添加失败");
            }
        }
    };

    const handleDelete = async (id: number) => {
        const res = await axios.post(`${VITE_BASE_URL}/SpiderTask/delete?id=${id}`);
        message.success(res.data.msg || "删除成功");
        await fetchTasks(currentPage, pageSize);
    };
    const handleBatchDelete = async () => {
        if (selectedRowKeys.length === 0) {
            messageApi.warning("请先选择要删除的行!");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${VITE_BASE_URL}/SpiderTask/deleteBatch`, selectedRowKeys)
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
    const runTask = async (id: number) => {
        const res = await axios.get(`${VITE_BASE_URL}/SpiderTask/start?id=${id}`);
        if (res.data.code === 200) {
            messageApi.success("任务启动成功!");
            await fetchTasks(currentPage, pageSize);
        } else {
            messageApi.error(res.data.msg || "任务启动失败!");
        }
    };

    // 点击搜索按钮时才搜索关键词
    const handleSearch = () => {
        setCurrentPage(1);
        fetchTasks(1, pageSize);
    };

    // 重置表单并查询全部
    const handleReset = () => {
        searchForm.resetFields();
        setCurrentPage(1);
        fetchTasks(1, pageSize);
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen p-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    {/* 搜索表单 */}
                    <Form layout="inline" form={searchForm}>
                        <Form.Item name="searchKeywords" label="搜索">
                            <Input
                                placeholder="支持搜索名称、描述、关键词"
                                allowClear
                                style={{ width: 300 }}
                                onPressEnter={handleSearch}
                            />
                        </Form.Item>
                        <Form.Item name="status" label="任务状态">
                            <Select
                                placeholder="选择状态"
                                allowClear
                                style={{ width: 200 }}
                                onChange={handleStatusChange}
                            >
                                <Select.Option value="已完成">已完成</Select.Option>
                                <Select.Option value="已创建">已创建</Select.Option>
                                <Select.Option value="已失败">已失败</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="dateRange" label="日期范围">
                            <RangePicker
                                placeholder={["开始日期", "结束日期"]}
                                showTime={{ format: "HH:mm" }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={handleDateRangeChange}
                            />
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

                    {/* 表格 */}
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
                                setCurrentPage(page);
                                setPageSize(size ?? pageSize);
                                fetchTasks(page, size ?? pageSize);
                            },
                            onShowSizeChange: (_, size) => {
                                setCurrentPage(1);
                                setPageSize(size);
                                fetchTasks(1, size);
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
                                rules={[{ required: true, message: "请输入关键词（可用逗号分隔）" }]}
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