import {
  EyeOutlined,
  ShopOutlined
} from "@ant-design/icons";
import { Col, Row, Space, Tag } from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { ListItem } from "../../shared/components/ListItem";
import type { BikeModel } from "../models/BikeModel";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeListItemProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

// formatage du montant en centimes vers euros
const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });

export const BikeListItem = ({ bike, deleteBike }: BikeListItemProps) => {
  return (
    <ListItem>
      <Col span={8}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <ShopOutlined />
          <span style={{ fontWeight: 500 }}>
            {`${bike.brand} ${bike.model}`}
          </span>
        </Space>
      </Col>
      <Col span={6}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <Tag>{bike.category}</Tag>
          <span style={{ color: "#666" }}>{bike.frameMaterial}</span>
        </Space>
      </Col>
      <Col span={6} style={{ fontWeight: "bold" }}>
        {formatPrice(bike.priceCents)}
      </Col>
      <Col span={4}>
        <Row gutter={[4, 4]} justify="end">
          <Col>
            <ButtonLink
              to="/bikes/$bikeId"
              params={{ bikeId: bike.id }}
              aria-label="View bike details"
            >
              <EyeOutlined />
            </ButtonLink>
          </Col>
          <Col>
            <DeleteBikeButton bike={bike} deleteBike={deleteBike} />
          </Col>
        </Row>
      </Col>
    </ListItem>
  );
};
