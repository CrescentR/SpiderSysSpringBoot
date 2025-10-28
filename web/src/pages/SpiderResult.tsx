import React, { useEffect, useState } from "react";
import {
    message,
    Table,
    Button,
    Form,
    Input,
    Space,
    Popconfirm,
    DatePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

interface ResultItem {
    id: number;
    taskName: string;
    taskId: number;
    title: string;
    keywords: string;
    url: string;
    source: string;
    dateTime: string;
}

const { RangePicker } = DatePicker;

const TaskResultPage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [result, setResult] = useState<ResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchForm] = Form.useForm();

    /** 表格列配置 */
    const columns: ColumnsType<ResultItem> = [
        { title: "任务名称", dataIndex: "taskName", key: "taskName", width: 150 },
        { title: "标题", dataIndex: "title", key: "title", width: 300 },
        { title: "关键词", dataIndex: "keywords", key: "keywords", width: 150 },
        {
            title: "链接",
            dataIndex: "url",
            key: "url",
            width: 300,
            render: (url) =>
                url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#1677ff",
                            fontWeight: 500,
                            textDecoration: "underline",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#4096ff";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#1677ff";
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {url}
                    </a>
                ) : (
                    <span style={{ color: "#999" }}>无</span>
                )
        },
        { title: "来源", dataIndex: "source", key: "source", width: 150 },
        { title: "时间", dataIndex: "dateTime", key: "dateTime", width: 200 },
    ];

    const fetchResult = async (page = currentPage, size = pageSize) => {
        const formValues = searchForm.getFieldsValue();
        const { searchKeywords, dateRange } = formValues;

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
                startTime: startTime,
                endTime: endTime,
            };

            const res1 = await axios.post(`${VITE_BASE_URL}/SpiderResult/search`, requestBody);

            if (res1.data.code === 200) {
                const { data, total: totalCount } = res1.data;

                // 获取任务名称映射
                try {
                    const res2 = await axios.get(`${VITE_BASE_URL}/SpiderTask/getTaskName`);

                    if (res2.data.code === 200) {
                        const taskMap: Record<number, string> = {};
                        res2.data.data.forEach((task: { id: number; name: string }) => {
                            taskMap[task.id] = task.name;
                        });

                        // 将任务名称映射到结果列表
                        const enrichedData = (data || []).map((item: ResultItem) => ({
                            ...item,
                            taskName: taskMap[item.taskId] || "未知任务",
                        }));

                        setResult(enrichedData);
                    } else {
                        setResult(data || []);
                        messageApi.warning(res2.data.msg || "获取任务名称失败");
                    }
                } catch (error) {
                    console.error("获取任务名称失败:", error);
                    setResult(data || []);
                }

                setTotal(totalCount || 0);
            } else {
                messageApi.error(res1.data.msg || "搜索结果失败");
            }
        } catch (error) {
            console.error("获取结果列表失败:", error);
            message.error("获取结果列表失败");
        } finally {
            setLoading(false);
        }
    };

    // 初始加载和页码/页大小变化时调用
    useEffect(() => {
        fetchResult(currentPage, pageSize);
    }, [currentPage, pageSize]);

    // 日期范围变化时立即搜索
    const handleDateRangeChange = () => {
        setCurrentPage(1);
        fetchResult(1, pageSize);
    };

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
            const res = await axios.post(`${VITE_BASE_URL}/SpiderResult/deleteBatch`, selectedRowKeys);
            if (res.data.code === 200) {
                message.destroy();
                messageApi.success({ content: "批量删除成功!", duration: 2 });
                setSelectedRowKeys([]);
                // 删除后刷新列表
                fetchResult(currentPage, pageSize);
            } else {
                message.destroy();
                messageApi.error(res.data.msg || "批量删除失败!");
            }
        } finally {
            setLoading(false);
        }
    };

    // 点击搜索按钮时才搜索关键词
    const handleSearch = () => {
        setCurrentPage(1);
        fetchResult(1, pageSize);
    };

    // 重置表单并查询全部
    const handleReset = () => {
        searchForm.resetFields();
        setCurrentPage(1);
        fetchResult(1, pageSize);
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen p-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    {/* 搜索表单 */}
                    <Form layout="inline" form={searchForm}>
                        <Form.Item name="searchKeywords" label="搜索" style={{ marginBottom: "10px" }}>
                            <Input
                                placeholder="支持搜索标题、关键词、来源"
                                allowClear
                                style={{ width: 300 }}
                                onPressEnter={handleSearch}
                            />
                        </Form.Item>
                        <Form.Item name="dateRange" label="日期范围" style={{ marginBottom: "10px" }}>
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
                    <Table<ResultItem>
                        rowSelection={rowSelection}
                        loading={loading}
                        rowKey="id"
                        columns={columns}
                        dataSource={result}
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
                        scroll={{ x: 'max-content' }}  // 允许横向滚动，支持列宽调整
                    />
                </div>
            </div>
        </>
    );
};

export default TaskResultPage;