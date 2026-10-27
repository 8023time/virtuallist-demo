import { useState } from "react";
import { Card, Col, List, Row, Space, Statistic, Typography } from "antd";
import FixedSizeVirtualList, {
  BUFFER_COUNT,
} from "../components/FixedSizeVirtualList";

export default function FixedSizeVirtualListPage() {
  const [itemHeight, _] = useState(60);
  const [data] = useState(
    Array.from({ length: 100000 }, (_, i) => ({
      id: i,
      name: `列表数据 ${i + 1}`,
    })),
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="数据总量" value={data.length} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="缓存区数量" value={BUFFER_COUNT} suffix=" 条" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="单项高度" value={itemHeight} suffix="px" />
          </Card>
        </Col>
      </Row>

      <Card title="固定高度虚拟列表" styles={{ body: { padding: 0 } }}>
        <div
          style={{ padding: "12px 24px", borderBottom: "1px solid #f0f0f0" }}
        >
          <Row style={{ width: "100%" }}>
            <Col span={4}>序号</Col>
            <Col flex="auto">名称</Col>
          </Row>
        </div>
        <FixedSizeVirtualList
          data={data}
          itemHeight={itemHeight}
          totalCount={data.length}
          style={{ height: "min(54vh, 560px)" }}
          itemRenderer={(item, index) => (
            <List.Item
              style={{
                height: "100%",
                padding: "0 24px",
              }}
            >
              <Row style={{ width: "100%" }}>
                <Col span={4}>
                  <Typography.Text type="secondary">
                    {String(index + 1).padStart(6, "0")}
                  </Typography.Text>
                </Col>
                <Col flex="auto">{item.name}</Col>
              </Row>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}
