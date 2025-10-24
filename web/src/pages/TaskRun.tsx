import React, { useMemo, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Popconfirm,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

const ROLE_OPTIONS = [
    { label: "Admin", value: "Admin" },
    { label: "Editor", value: "Editor" },
    { label: "Viewer", value: "Viewer" },
];

const seed: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "Editor" },
    { id: 3, name: "Carol", email: "carol@example.com", role: "Viewer" },
];

const uid = (): number =>
    Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);

const EditableCrudTable: React.FC = () => {
    const [data, setData] = useState<User[]>(seed);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const [form] = Form.useForm<User>();

    const filtered = useMemo(() => {
        if (!search.trim()) return data;
        const s = search.trim().toLowerCase();
        return data.filter(
            (r) =>
                r.name.toLowerCase().includes(s) ||
                r.email.toLowerCase().includes(s) ||
                r.role.toLowerCase().includes(s)
        );
    }, [data, search]);

    const openAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: User) => {
        setEditing(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setData((prev) => prev.filter((x) => x.id !== id));
        message.success("Deleted");
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editing) {
                setData((prev) =>
                    prev.map((x) => (x.id === editing.id ? { ...editing, ...values } : x))
                );
                message.success("Updated");
            } else {
                const item: User = { id: uid(), ...values };
                setData((prev) => [item, ...prev]);
                message.success("Added");
            }
            setModalOpen(false);
            setEditing(null);
            form.resetFields();
        } catch {
            // ignore validation errors
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
        setEditing(null);
        form.resetFields();
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: (a: User, b: User) => a.name.localeCompare(b.name),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a: User, b: User) => a.email.localeCompare(b.email),
        },
        {
            title: "Role",
            dataIndex: "role",
            filters: ROLE_OPTIONS.map((r) => ({ text: r.label, value: r.value })),
            onFilter: (value: string, record: User) => record.role === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, record: User) => (
                <Space>
                    <Button type="link" onClick={() => openEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete item"
                        description={`Are you sure you want to delete ${record.name}?`}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen p-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-4">
                    <Input.Search
                        allowClear
                        placeholder="Search name / email / role"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="sm:max-w-sm"
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        New
                    </Button>
                </div>

                <Table<User>
                    rowKey="id"
                    columns={columns}
                    dataSource={filtered}
                    pagination={{ pageSize: 5, showTotal: (t) => `${t} items` }}
                />

                <Modal
                    title={editing ? `Edit: ${editing.name}` : "Create new"}
                    open={modalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText={editing ? "Save" : "Create"}
                >
                    <Form<User>
                        layout="vertical"
                        form={form}
                        initialValues={{ role: ROLE_OPTIONS[2].value }}
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: "Please enter a name" }]}
                        >
                            <Input placeholder="e.g., Jane Doe" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Please enter an email" },
                                { type: "email", message: "Invalid email" },
                            ]}
                        >
                            <Input placeholder="e.g., jane@example.com" />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: "Select a role" }]}
                        >
                            <Select options={ROLE_OPTIONS} placeholder="Select a role" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default EditableCrudTable;
