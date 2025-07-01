import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { adminApi, RevenueSummary } from '../services/api';
import { Card, Select, InputNumber, Row, Col, Spin, Alert, Typography, Space } from 'antd';
const { Option } = Select;
const { Title: AntTitle } = Typography;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart: React.FC = () => {
  // State cho params và dữ liệu
  const [loaiThongKe, setLoaiThongKe] = useState<'THANG' | 'QUY' | 'NAM'>('THANG');
  const [nam, setNam] = useState<number>(2025);
  const [thang, setThang] = useState<number>(6);
  const [quy, setQuy] = useState<number>(4);
  const [dataChart, setDataChart] = useState<RevenueSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.getRevenueSummary(loaiThongKe, nam, loaiThongKe === 'THANG' ? thang : undefined, loaiThongKe === 'QUY' ? quy : undefined);
        setDataChart(data);
      } catch (err: any) {
        setError('Lỗi khi tải dữ liệu doanh thu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loaiThongKe, nam, thang, quy]);

  // Chuẩn bị dữ liệu cho chart
  const chartData = {
    labels: dataChart.map((item) => item.nhan),
    datasets: [
      {
        label: 'Doanh thu',
        data: dataChart.map((item) => item.doanhThu),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Số hóa đơn',
        data: dataChart.map((item) => item.soHoaDon),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tổng kết doanh thu',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Doanh thu (VNĐ)' },
      },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Số hóa đơn' },
      },
    },
  };

  return (
    <Card className="admin-chart-container" bordered={false} style={{ marginBottom: 24 }}>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }} gutter={[16, 16]}>
        <Col>
          <AntTitle level={5} style={{ margin: 0 }}>Tổng kết doanh thu</AntTitle>
        </Col>
        <Col>
          <Space>
            <Select value={loaiThongKe} style={{ width: 120 }} onChange={v => setLoaiThongKe(v)}>
              <Option value="THANG">Theo tháng</Option>
              <Option value="QUY">Theo quý</Option>
              <Option value="NAM">Theo năm</Option>
            </Select>
            <InputNumber value={nam} min={2000} max={2100} onChange={v => setNam(Number(v))} style={{ width: 100 }} />
            {loaiThongKe === 'THANG' && (
              <InputNumber value={thang} min={1} max={12} onChange={v => setThang(Number(v))} style={{ width: 80 }} />
            )}
            {loaiThongKe === 'QUY' && (
              <InputNumber value={quy} min={1} max={4} onChange={v => setQuy(Number(v))} style={{ width: 80 }} />
            )}
          </Space>
        </Col>
      </Row>
      <div style={{ minHeight: 320 }}>
        {loading ? (
          <Spin tip="Đang tải dữ liệu..." size="large" style={{ width: '100%' }} />
        ) : error ? (
          <Alert type="error" message={error} showIcon />
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>
    </Card>
  );
};

export default SalesChart; 