import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { message, Table, Button, Modal, Form, Input, Space, Popconfirm, Select, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
// @ts-ignore
const BASE_URL = import.meta.env.VITE_BASE_URL;
const TaskListPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [editing, setEditing] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [listForm] = Form.useForm();
    const [searchForm] = Form.useForm();
    /** 表格列配置 */
    const columns = [
        { title: "任务名称", dataIndex: "name", key: "name" },
        { title: "描述", dataIndex: "description", key: "description" },
        {
            title: "关键词",
            dataIndex: "keywords",
            key: "keywords",
            render: (keywords) => (Array.isArray(keywords) ? keywords.join(", ") : keywords),
        },
        { title: "最大页数", dataIndex: "maxPages", key: "maxPages" },
        { title: "状态", dataIndex: "status", key: "status" },
        { title: "创建时间", dataIndex: "createdAt", key: "createdAt" },
        { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt" },
        {
            title: "操作",
            key: "actions",
            render: (_, record) => (_jsxs(Space, { children: [_jsx(Button, { type: "link", onClick: () => openEdit(record), children: "\u7F16\u8F91" }), _jsx(Popconfirm, { title: "\u5220\u9664\u8BE5\u4EFB\u52A1", description: "\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u4EFB\u52A1\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002", okText: "\u786E\u5B9A", cancelText: "\u53D6\u6D88", onConfirm: () => handleDelete(record.id), children: _jsx(Button, { type: "link", danger: true, children: "\u5220\u9664" }) }), _jsx(Button, { type: "link", onClick: () => runTask(record.id), children: "\u8FD0\u884C" })] })),
        },
    ];
    /** ✅ 获取任务列表（统一函数） */
    const fetchTasks = async (filters) => {
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
                }
                else {
                    messageApi.error(res.data.msg || "搜索任务失败");
                }
            }
            else {
                // 调用普通查询接口
                res = await axios.get(`${BASE_URL}/SpiderTask/query`);
                if (res.data.code === 200) {
                    setTasks(res.data.data || []);
                    setTotal(res.data.total || 0);
                }
                else {
                    messageApi.error(res.data.msg || "获取任务列表失败");
                }
            }
        }
        catch (error) {
            console.error("获取任务失败:", error);
            message.error("获取任务失败");
        }
        finally {
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
    const openEdit = (record) => {
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
            }
            else {
                message.error(res.data.msg || "修改失败");
            }
        }
        else {
            const res = await axios.post(`${BASE_URL}/SpiderTask/insert`, param);
            if (res.data.code === 200) {
                message.success("添加成功");
                setModalOpen(false);
                await fetchTasks();
            }
            else {
                message.error(res.data.msg || "添加失败");
            }
        }
    };
    const handleDelete = async (id) => {
        const res = await axios.post(`${BASE_URL}/SpiderTask/delete?id=${id}`);
        message.success(res.data.msg || "删除成功");
        await fetchTasks();
    };
    const runTask = async (id) => {
        const res = await axios.get(`${BASE_URL}/SpiderTask/start?id=${id}`);
        if (res.data.code === 200) {
            messageApi.success("任务启动成功!");
            await fetchTasks();
        }
        else {
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
    return (_jsxs(_Fragment, { children: [contextHolder, _jsx("div", { className: "min-h-screen p-6 bg-white", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsxs(Form, { layout: "inline", form: searchForm, children: [_jsx(Form.Item, { name: "searchInfo", label: "\u641C\u7D22", children: _jsx(Input, { placeholder: "\u652F\u6301\u641C\u7D22\u540D\u79F0\u3001\u63CF\u8FF0\u3001\u5173\u952E\u8BCD", allowClear: true, style: { width: 300 } }) }), _jsx(Form.Item, { name: "status", label: "\u4EFB\u52A1\u72B6\u6001", children: _jsxs(Select, { placeholder: "\u9009\u62E9\u72B6\u6001", allowClear: true, style: { width: 200 }, onChange: () => {
                                            setCurrentPage(1);
                                            fetchTasks(searchForm.getFieldsValue());
                                        }, children: [_jsx(Select.Option, { value: "\u5DF2\u5B8C\u6210", children: "\u5DF2\u5B8C\u6210" }), _jsx(Select.Option, { value: "\u5DF2\u521B\u5EFA", children: "\u5DF2\u521B\u5EFA" }), _jsx(Select.Option, { value: "\u5DF2\u5931\u8D25", children: "\u5DF2\u5931\u8D25" })] }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", onClick: handleSearch, children: "\u641C\u7D22" }), _jsx(Button, { onClick: handleReset, children: "\u91CD\u7F6E" })] }) })] }), _jsx("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4 mt-4", children: _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: openAdd, children: "\u65B0\u589E" }) }), _jsx(Table, { loading: loading, rowKey: "id", columns: columns, dataSource: tasks, pagination: {
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
                            } }), _jsx(Modal, { title: editing ? `编辑任务：${editing.name}` : "新增任务", open: modalOpen, onOk: handleOk, onCancel: () => {
                                setModalOpen(false);
                                setEditing(null);
                                listForm.resetFields();
                            }, okText: editing ? "保存" : "创建", cancelText: "\u53D6\u6D88", children: _jsxs(Form, { layout: "vertical", form: listForm, children: [_jsx(Form.Item, { name: "name", label: "\u4EFB\u52A1\u540D\u79F0", rules: [{ required: true, message: "请输入任务名称" }], children: _jsx(Input, { placeholder: "\u4EFB\u52A1\u540D\u79F0" }) }), _jsx(Form.Item, { name: "description", label: "\u4EFB\u52A1\u63CF\u8FF0", children: _jsx(Input, { placeholder: "\u4EFB\u52A1\u63CF\u8FF0" }) }), _jsx(Form.Item, { name: "keywords", label: "\u722C\u53D6\u5173\u952E\u8BCD", rules: [
                                            { required: true, message: "请输入关键词（可用逗号分隔）" },
                                        ], children: _jsx(Select, { mode: "tags", tokenSeparators: [",", "，"], placeholder: "\u8F93\u5165\u540E\u56DE\u8F66\u6216\u4F7F\u7528\u9017\u53F7\u5206\u9694" }) }), _jsx(Form.Item, { name: "maxPages", label: "\u6700\u5927\u722C\u53D6\u9875\u9762\u6570\u91CF", children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u6700\u5927\u9875\u6570" }) }), _jsx(Form.Item, { name: "timeout", label: "\u65F6\u95F4\u5EF6\u8FDF(\u79D2)", children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u65F6\u95F4\u5EF6\u8FDF(\u79D2)" }) })] }) })] }) })] }));
};
export default TaskListPage;
