import { useState } from "react";
import { Card, Col, Row, Space, Statistic, Typography } from "antd";
import VariableSizeVirtualList, {
  BUFFER_COUNT,
} from "../components/VariableSizeVirtualList";

export default function VariableSizeVirtualListPage() {
  const [estimatedHeight] = useState(80);
  const [data] = useState(
    Array.from({ length: 100000 }, (_, index) => ({
      id: index,
      title: `列表数据 ${index + 1}`,
      content:
        index % 5 === 0
          ? "这个是四行内容的示例:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          : index % 4 === 0
            ? "这个是三行内容的示例:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            : index % 2 === 0
              ? "这个是二行内容的示例:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              : "这个是一行内容的示例",
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
            <Statistic title="缓冲区数量" value={BUFFER_COUNT} suffix=" 条" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="预估高度" value={estimatedHeight} suffix="px" />
          </Card>
        </Col>
      </Row>

      <Card title="动态高度虚拟列表" styles={{ body: { padding: 0 } }}>
        <VariableSizeVirtualList
          data={data}
          estimatedHeight={estimatedHeight}
          style={{ height: "min(54vh, 560px)" }}
          itemRenderer={(item, index) => (
            <div
              style={{
                padding: "14px 24px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Typography.Text type="secondary">
                {String(index + 1).padStart(6, "0")}
              </Typography.Text>
              <Typography.Text strong style={{ marginLeft: 16 }}>
                {item.title}
              </Typography.Text>
              <Typography.Paragraph
                type="secondary"
                style={{ margin: "8px 0 0" }}
              >
                {item.content}
              </Typography.Paragraph>
            </div>
          )}
        />
      </Card>
    </Space>
  );
}
