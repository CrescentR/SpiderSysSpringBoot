/**
 * @file TaskList.tsx
 * @description 任务列表页面：演示在前端进行基础的增删改（CRUD）操作。
 * 使用 React 18 + Ant Design 5 的最新写法，包含详细中文注释，便于学习。
 */

import React,{useEffect, useState } from 'react'
import {Table, message} from 'antd'
import type { ColumnsType } from 'antd/es/table'
// import CustomPageHeader from '@/components/PageHeader'
import axios from 'axios'
const BASE_URL=import.meta.env.VITE_BASE_URL;
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
  // const { token } = theme.useToken()
  // 任务列表状态（模拟数据源）。真实项目中可替换为后端 API。
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [loading,setLoading]=useState(false);
  const columns:ColumnsType<TaskItem>=[
    { title: "任务名称", dataIndex: "name", key: "name" },
    { title: "描述", dataIndex: "description", key: "description" },
    {
      title: "关键词",
      dataIndex: "keywords",
      key: "keywords",
      render: (keywords: string[]) => keywords.join(", "),
    },
    { title: "最大页数", dataIndex: "maxPages", key: "maxPages" },
    { title: "状态", dataIndex: "status", key: "status" },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt" },
    { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt" },
  ]
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const fetchTasks=async (page = currentPage, size = pageSize) =>{
    try{
      setLoading(true);
      const res=await axios.get(`${BASE_URL}/SpiderTask/query`,{
        params: {
          currentPage: page, pageSize: size,
        },
      })
      if(res.data.code === 200) {
        setTasks(res.data.data);
        const totalCount = res.data.total || 0;
        setTotal(totalCount)
      }else{
        message.error(res.data.msg || "获取任务列表失败");
      }
    }catch (error){
        console.error("获取任务列表失败:",error);
        message.error("获取任务列表失败");
    }finally {
      setLoading(false)
    }
  };
  useEffect(()=>{
    fetchTasks(currentPage, pageSize);
  },[currentPage, pageSize]);
  // // 自增 ID（前端生成，真实项目中由后端生成）
  // const nextIdRef = React.useRef<number>(3)
  //
  // // 新增/编辑弹窗相关状态
  // const [addOpen, setAddOpen] = React.useState(false)
  // const [editOpen, setEditOpen] = React.useState(false)
  // const [editing, setEditing] = React.useState<TaskItem | null>(null)
  //
  // // Antd 的 Form 实例（受控表单）
  // const [addForm] = Form.useForm<{ name: string; status: TaskItem['status'] }>()
  // const [editForm] = Form.useForm<{ name: string; status: TaskItem['status'] }>()
  //
  // // 打开“新增”弹窗
  // const openAddModal = () => {
  //   addForm.resetFields()
  //   setAddOpen(true)
  // }
  //
  // // 提交新增
  // const submitAdd = async () => {
  //   try {
  //     const values = await addForm.validateFields()
  //     const newTask: TaskItem = {
  //       id: nextIdRef.current++,
  //       name: values.name,
  //       status: values.status,
  //       createdAt: new Date().toLocaleString()
  //     }
  //     setTasks(prev => [newTask, ...prev])
  //     setAddOpen(false)
  //     message.success('任务已新增')
  //   } catch (e) {
  //     console.error('提交新增失败:', e)
  //     message.error(`新增任务失败：${getErrorMessage(e)}`)
  //   }
  // }
  //
  // // 打开“编辑”弹窗
  // const openEditModal = (record: TaskItem) => {
  //   setEditing(record)
  //   editForm.setFieldsValue({ name: record.name, status: record.status })
  //   setEditOpen(true)
  // }
  //
  // // 提交编辑
  // const submitEdit = async () => {
  //   try {
  //     const values = await editForm.validateFields()
  //     setTasks(prev => prev.map(t => t.id === editing!.id ? { ...t, name: values.name, status: values.status } : t))
  //     setEditOpen(false)
  //     setEditing(null)
  //     message.success('任务已更新')
  //   } catch (e) {
  //     console.error('提交编辑失败:', e)
  //     message.error(`更新任务失败：${getErrorMessage(e)}`)
  //   }
  // }
  //
  // // 删除任务（带确认）
  // const deleteTask = (id: number) => {
  //   setTasks(prev => prev.filter(t => t.id !== id))
  //   message.success('任务已删除')
  // }


  return (
      <div style={{ padding:20 }}>
        <h2>任务列表</h2>
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
      </div>


  )
}

export default TaskListPage
