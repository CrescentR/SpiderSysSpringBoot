import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Layout,
    Row,
    Col,
    Card,
    Statistic,
    Space,
    Button,
    Typography,
    Tooltip,
    Spin,
    message,
    DatePicker,
    Select,
    Input,
    Table,
    Empty,
} from 'antd'
import { ReloadOutlined,  BarChartOutlined, PieChartOutlined } from '@ant-design/icons'
import { theme } from 'antd'
import * as echarts from 'echarts'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { RangePicker } = DatePicker

// ------- 接口返回类型 -------
type SummaryData = {
    countTask: number
    countResult: number
    statusData: { status: string; count: number }[]
    dateData: { date: string; count: number }[]
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8888'

const Reports: React.FC = () => {
    const { token } = theme.useToken()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<SummaryData | null>(null)

    // 过滤器本地状态（如果你的后端支持筛选，可以把这些值拼到请求里）
    const [kw, setKw] = useState('')
    const [statuses, setStatuses] = useState<string[]>([])
    const [range, setRange] = useState<[string | null, string | null]>([null, null])

    const pieRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)
    const pieChart = useRef<echarts.EChartsType | null>(null)
    const lineChart = useRef<echarts.EChartsType | null>(null)

    const fetchSummary = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_BASE}/SummaryData/get`)
            const json = await res.json()
            if (json?.code === 200 && json?.data) {
                setData(json.data as SummaryData)
            } else {
                throw new Error(json?.msg || '接口返回异常')
            }
        } catch (err: any) {
            message.error(err?.message || '获取数据失败')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSummary() }, [])

    // 基于筛选的派生数据（前端过滤；如后端支持请改为带参请求）
    const filtered = useMemo(() => {
        if (!data) return null
        let d = { ...data }

        if (statuses.length) {
            d = { ...d, statusData: d.statusData.filter(s => statuses.includes(s.status)) }
        }

        if (range[0] && range[1]) {
            const [start, end] = range
            d = {
                ...d,
                dateData: d.dateData.filter(x => x.date >= start! && x.date <= end!),
            }
        }

        if (kw.trim()) {
            // 关键词可用于过滤站点/任务名；当前没有明细字段，这里仅作占位不生效
        }

        return d
    }, [data, statuses, range, kw])

    // 统计指标
    const metrics = useMemo(() => {
        const totalTask = filtered?.countTask ?? 0
        const totalResult = filtered?.countResult ?? 0
        const totalStatus = (filtered?.statusData || []).reduce((a, b) => a + b.count, 0)
        const completed = (filtered?.statusData || []).find(s => s.status === '已完成')?.count ?? 0
        const successRate = totalStatus ? Math.round((completed / totalStatus) * 100) : 0
        const avgPerDay = (filtered?.dateData?.length ? Math.round((filtered!.dateData.reduce((a, b) => a + b.count, 0) / filtered!.dateData.length)) : 0)
        return { totalTask, totalResult, successRate, avgPerDay }
    }, [filtered])

    // 渲染图表
    useEffect(() => {
        if (!filtered) return

        if (pieRef.current) {
            pieChart.current?.dispose()
            pieChart.current = echarts.init(pieRef.current)
            pieChart.current.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'item' },
                legend: { top: 0, right: 0, textStyle: { color: token.colorText } },
                series: [
                    {
                        type: 'pie',
                        name: '状态分布',
                        radius: ['40%', '68%'],
                        itemStyle: { borderRadius: 8, borderColor: token.colorBgContainer, borderWidth: 2 },
                        label: { formatter: '{b}: {d}%' },
                        data: (filtered.statusData || []).map(s => ({ name: s.status, value: s.count })),
                    },
                ],
            })
        }

        if (lineRef.current) {
            lineChart.current?.dispose()
            lineChart.current = echarts.init(lineRef.current)
            const x = (filtered.dateData || []).map(d => d.date)
            const y = (filtered.dateData || []).map(d => d.count)
            // 简易 3 日移动平均
            const ma3 = y.map((_, i) => {
                const arr = y.slice(Math.max(0, i - 2), i + 1)
                const avg = arr.reduce((a, b) => a + b, 0) / arr.length
                return Math.round(avg)
            })

            lineChart.current.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '3%', bottom: '8%', containLabel: true },
                xAxis: { type: 'category', data: x, axisLine: { lineStyle: { color: token.colorBorder } }, axisLabel: { color: token.colorTextSecondary } },
                yAxis: { type: 'value', axisLabel: { color: token.colorTextSecondary }, splitLine: { lineStyle: { color: token.colorSplit } } },
                series: [
                    { name: '抓取量', type: 'bar', data: y, barMaxWidth: 28, emphasis: { focus: 'series' } },
                    { name: '3日均线', type: 'line', smooth: true, data: ma3, symbol: 'circle', symbolSize: 8 },
                ],
            })
        }

        const onResize = () => { pieChart.current?.resize(); lineChart.current?.resize() }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [filtered, token])


    // 导出图表图片
    const exportPng = (which: 'pie' | 'line') => {
        const chart = which === 'pie' ? pieChart.current : lineChart.current
        if (!chart) { message.info('图表尚未渲染'); return }
        const dataUrl = chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' })
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `${which === 'pie' ? '状态分布' : '每日趋势'}.png`
        a.click()
    }

    const columns = [
        { title: '日期', dataIndex: 'date', key: 'date', width: 140 },
        { title: '抓取量', dataIndex: 'count', key: 'count', render: (v: number) => v.toLocaleString() },
    ]

    return (
        <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
            <Header style={{ background: token.colorBgContainer, borderBottom: `1px solid ${token.colorSplit}` }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Space size={8} direction="vertical">
                            <Space>
                                <BarChartOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
                                <Title level={4} style={{ margin: 0 }}>报表</Title>
                            </Space>
                            <Text type="secondary">抓取任务与结果的可视化报表</Text>
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Tooltip title="刷新">
                                <Button icon={<ReloadOutlined />} onClick={fetchSummary}>刷新</Button>
                            </Tooltip>
                        </Space>
                    </Col>
                </Row>
            </Header>

            <Content style={{ padding: 24 }}>
                <Spin spinning={loading} tip="加载中...">
                    {/* 筛选区 */}
                    <Card style={{ borderRadius: 16, marginBottom: 16 }}>
                        <Row gutter={[12, 12]} align="middle">
                            <Col xs={24} md={10}>
                                <Space direction="vertical" style={{ width: '100%' }} size={4}>
                                    <Text type="secondary">时间范围</Text>
                                    <RangePicker style={{ width: '100%' }} onChange={(d) => setRange([d?.[0]?.format('YYYY-MM-DD') || null, d?.[1]?.format('YYYY-MM-DD') || null])} />
                                </Space>
                            </Col>
                            <Col xs={24} md={8}>
                                <Space direction="vertical" style={{ width: '100%' }} size={4}>
                                    <Text type="secondary">状态</Text>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="选择状态..."
                                        options={[...new Set((data?.statusData || []).map(s => s.status))].map(s => ({ label: s, value: s }))}
                                        onChange={setStatuses}
                                        style={{ width: '100%' }}
                                    />
                                </Space>
                            </Col>
                            <Col xs={24} md={6}>
                                <Space direction="vertical" style={{ width: '100%' }} size={4}>
                                    <Text type="secondary">关键词</Text>
                                    <Input placeholder="站点/任务名（占位）" value={kw} onChange={e => setKw(e.target.value)} />
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    {/* KPI */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={{ borderRadius: 16 }}>
                                <Space direction="vertical" size={4}>
                                    <Text type="secondary">总任务数</Text>
                                    <Statistic value={metrics.totalTask} />
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={{ borderRadius: 16 }}>
                                <Space direction="vertical" size={4}>
                                    <Text type="secondary">结果总数</Text>
                                    <Statistic value={metrics.totalResult} />
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={{ borderRadius: 16 }}>
                                <Space direction="vertical" size={4}>
                                    <Text type="secondary">完成率</Text>
                                    <Statistic value={metrics.successRate} suffix="%" />
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={{ borderRadius: 16 }}>
                                <Space direction="vertical" size={4}>
                                    <Text type="secondary">日均抓取量</Text>
                                    <Statistic value={metrics.avgPerDay} />
                                </Space>
                            </Card>
                        </Col>
                    </Row>

                    {/* 图表 */}
                    {(!filtered || (!filtered.statusData?.length && !filtered.dateData?.length)) ? (
                        <Card style={{ borderRadius: 16, marginTop: 16 }}>
                            <Empty description="暂无数据" />
                        </Card>
                    ) : (
                        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                            <Col xs={24} lg={10}>
                                <Card style={{ borderRadius: 16 }} title={<Space><PieChartOutlined />状态分布</Space>} extra={<Button size="small" onClick={() => exportPng('pie')}>导出图片</Button>}>
                                    <div ref={pieRef} style={{ width: '100%', height: 320 }} />
                                </Card>
                            </Col>
                            <Col xs={24} lg={14}>
                                <Card style={{ borderRadius: 16 }} title={<Space><BarChartOutlined />每日抓取趋势</Space>} extra={<Button size="small" onClick={() => exportPng('line')}>导出图片</Button>}>
                                    <div ref={lineRef} style={{ width: '100%', height: 360 }} />
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* 明细表（按天）*/}
                    <Card style={{ borderRadius: 16, marginTop: 16 }} title="按天明细">
                        <Table
                            rowKey={(r) => r.date}
                            columns={columns}
                            dataSource={filtered?.dateData || []}
                            pagination={{ pageSize: 7, showSizeChanger: false }}
                            size="middle"
                        />
                    </Card>
                </Spin>
            </Content>
        </Layout>
    )
}

export default Reports
