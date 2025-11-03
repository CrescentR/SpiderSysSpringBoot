import React, { useEffect, useRef, useState } from 'react'
import { Layout, Row, Col, Card, Statistic, Space, Button, Typography, Tooltip, Spin, message } from 'antd'
import { ReloadOutlined, ThunderboltOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons'
import { theme } from 'antd'
import gsap from 'gsap'
import * as echarts from 'echarts'

const { Header, Content } = Layout
const { Title, Text } = Typography

// ------- 接口返回类型 -------
type SummaryData = {
    countTask: number
    countResult: number
    statusData: { status: string; count: number }[]
    dateData: { date: string; count: number }[]
}

const Home: React.FC = () => {
    const { token } = theme.useToken()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<SummaryData | null>(null)

    const rootRef = useRef<HTMLDivElement>(null)
    const pieRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)
    const pieChart = useRef<echarts.EChartsType | null>(null)
    const lineChart = useRef<echarts.EChartsType | null>(null)

    // 拉取接口
    const fetchSummary = async () => {
        try {
            setLoading(true)
            const res = await fetch('http://localhost:8888/SummaryData/get')
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

    // 首次进入：载入数据 + 入场动效
    // 首次进入：载入数据 + 入场动效
    useEffect(() => {
        fetchSummary()
        // 使用 gsap.context 以便在卸载时安全回滚，并避免清理函数返回 Timeline 类型
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
            tl.from(rootRef.current, { autoAlpha: 0, y: 12, duration: 0.4 })
        }, rootRef)
        return () => { ctx.revert() }
    }, [])

    // 初始化/更新图表
    useEffect(() => {
        if (!data) return

        // 饼图：状态分布
        if (pieRef.current) {
            pieChart.current?.dispose()
            pieChart.current = echarts.init(pieRef.current)
            pieChart.current.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'item' },
                legend: { top: 0, right: 0, textStyle: { color: token.colorText } },
                series: [
                    {
                        name: '状态分布',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: { borderRadius: 8, borderColor: token.colorBgContainer, borderWidth: 2 },
                        label: { show: true, formatter: '{b}: {d}%' },
                        data: data.statusData.map(s => ({ name: s.status, value: s.count })),
                    },
                ],
            })
        }

        // 折线图：每日抓取量
        if (lineRef.current) {
            lineChart.current?.dispose()
            lineChart.current = echarts.init(lineRef.current)
            lineChart.current.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '3%', bottom: '8%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: data.dateData.map(d => d.date),
                    axisLine: { lineStyle: { color: token.colorBorder } },
                    axisLabel: { color: token.colorTextSecondary },
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: token.colorTextSecondary },
                    splitLine: { lineStyle: { color: token.colorSplit } },
                },
                series: [
                    {
                        name: '抓取量',
                        type: 'line',
                        smooth: true,
                        areaStyle: {},
                        symbol: 'circle',
                        symbolSize: 8,
                        data: data.dateData.map(d => d.count),
                    },
                ],
            })
        }

        const onResize = () => {
            pieChart.current?.resize()
            lineChart.current?.resize()
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [data, token])

    // KPI 卡片（只保留接口所需）
    const KpiCards = (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
                <Card style={{ borderRadius: 16 }}>
                    <Space align="center">
                        <ThunderboltOutlined style={{ fontSize: 28, color: token.colorPrimary }} />
                        <div>
                            <Text type="secondary">总任务数</Text>
                            <Statistic value={data?.countTask ?? 0} valueStyle={{ fontWeight: 700 }} />
                        </div>
                    </Space>
                </Card>
            </Col>
            <Col xs={24} sm={12}>
                <Card style={{ borderRadius: 16 }}>
                    <Space align="center">
                        <BarChartOutlined style={{ fontSize: 28, color: token.colorSuccess }} />
                        <div>
                            <Text type="secondary">结果总数</Text>
                            <Statistic value={data?.countResult ?? 0} valueStyle={{ fontWeight: 700 }} />
                        </div>
                    </Space>
                </Card>
            </Col>
        </Row>
    )

    return (
        <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
            <Header style={{ background: token.colorBgContainer, borderBottom: `1px solid ${token.colorSplit}` }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Space size={8} direction="vertical">
                            <Space>
                                <ThunderboltOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
                                <Title level={4} style={{ margin: 0 }}>爬虫系统概览</Title>
                            </Space>
                            <Text type="secondary">汇总任务与抓取量（接口驱动）</Text>
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Tooltip title="刷新数据">
                                <Button icon={<ReloadOutlined />} onClick={fetchSummary}>刷新</Button>
                            </Tooltip>
                        </Space>
                    </Col>
                </Row>
            </Header>

            <Content ref={rootRef} style={{ padding: 24 }}>
                <Spin spinning={loading} tip="加载中...">
                    {KpiCards}

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} lg={10}>
                            <Card style={{ borderRadius: 16 }} title={<Space><PieChartOutlined />状态分布</Space>}>
                                <div ref={pieRef} style={{ width: '100%', height: 320 }} />
                            </Card>
                        </Col>
                        <Col xs={24} lg={14}>
                            <Card style={{ borderRadius: 16 }} title={<Space><BarChartOutlined />每日抓取趋势</Space>}>
                                <div ref={lineRef} style={{ width: '100%', height: 320 }} />
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            </Content>
        </Layout>
    )
}

export default Home

