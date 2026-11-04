import {
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Input,
  InputNumber,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";

interface BikeGeneralInfoCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
  updateBike: (input: UpdateBikeModel) => Promise<unknown>;
}

type GeneralInfoValues = {
  brand: string;
  model: string;
  category: string;
  priceEuros: number | null;
  electric: boolean;
  description: string;
};

type GeneralInfoErrors = Partial<Record<keyof GeneralInfoValues, string>>;

// extraction des valeurs initiales du formulaire
const toValues = (bike: BikeModel): GeneralInfoValues => ({
  brand: bike.brand,
  model: bike.model,
  category: bike.category,
  priceEuros: bike.priceCents / 100,
  electric: bike.electric,
  description: bike.description,
});

// validation des champs generaux
const validate = (values: GeneralInfoValues): GeneralInfoErrors => {
  const errors: GeneralInfoErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (values.priceEuros === null || values.priceEuros < 0)
    errors.priceEuros = "Price must be positive or zero";
  return errors;
};

export const BikeGeneralInfoCard = ({
  bike,
  isLoading,
  updateBike,
}: BikeGeneralInfoCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<GeneralInfoValues | null>(null);
  const [errors, setErrors] = useState<GeneralInfoErrors>({});

  // passage en mode edition
  const startEditing = () => {
    if (!bike) return;
    setValues(toValues(bike));
    setErrors({});
    setIsEditing(true);
  };

  // annulation de l'edition
  const cancel = () => {
    setValues(null);
    setErrors({});
    setIsEditing(false);
  };

  // enregistrement des modifications
  const save = () => {
    if (!values) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    updateBike({
      brand: values.brand.trim(),
      model: values.model.trim(),
      category: values.category.trim(),
      priceCents: Math.round((values.priceEuros ?? 0) * 100),
      electric: values.electric,
      description: values.description.trim(),
    })
      .then(cancel)
      .catch(() => { })
      .finally(() => setIsSaving(false));
  };

  const value = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    {
      key: "brand",
      label: "Brand",
      children: value(bike?.brand),
    },
    {
      key: "model",
      label: "Model",
      children: value(bike?.model),
    },
    {
      key: "category",
      label: "Category",
      children: value(bike?.category && bike.category),
    },
    {
      key: "price",
      label: "Price",
      children: value(bike && bike.priceCents / 100 + " €"),
    },
    {
      key: "electric",
      label: "Motorisation",
      children: value(bike && (bike.electric ? "Electric" : "Mechanical")
      ),
    },
    {
      key: "description",
      label: "Description",
      children: value(bike?.description),
    },
  ];

  return (
    <Card
      title="General information"
      style={{ height: "100%" }}
      extra={
        isEditing ? (
          <Space>
            <Button icon={<CloseOutlined />} onClick={cancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSaving}
              onClick={save}
            >
              Save
            </Button>
          </Space>
        ) : (
          <Button
            icon={<EditOutlined />}
            aria-label="Edit general information"
            disabled={!bike}
            onClick={startEditing}
          />
        )
      }
    >
      {isEditing && values ? (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <label htmlFor="bike-edit-brand">Brand *</label>
            <Input
              id="bike-edit-brand"
              value={values.brand}
              status={errors.brand && "error"}
              onChange={(e) => {
                setValues({ ...values, brand: e.target.value });
                setErrors({ ...errors, brand: undefined });
              }}
            />
            {errors.brand && (
              <Typography.Text type="danger">{errors.brand}</Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label htmlFor="bike-edit-model">Model *</label>
            <Input
              id="bike-edit-model"
              value={values.model}
              status={errors.model && "error"}
              onChange={(e) => {
                setValues({ ...values, model: e.target.value });
                setErrors({ ...errors, model: undefined });
              }}
            />
            {errors.model && (
              <Typography.Text type="danger">{errors.model}</Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label htmlFor="bike-edit-category">Category *</label>
            <Input
              id="bike-edit-category"
              value={values.category}
              status={errors.category && "error"}
              onChange={(e) => {
                setValues({ ...values, category: e.target.value });
                setErrors({ ...errors, category: undefined });
              }}
            />
            {errors.category && (
              <Typography.Text type="danger">{errors.category}</Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label htmlFor="bike-edit-price">Price (€) *</label>
            <InputNumber
              id="bike-edit-price"
              style={{ width: "100%" }}
              min={0}
              step={1}
              value={values.priceEuros}
              status={errors.priceEuros && "error"}
              onChange={(val) => {
                setValues({ ...values, priceEuros: val });
                setErrors({ ...errors, priceEuros: undefined });
              }}
            />
            {errors.priceEuros && (
              <Typography.Text type="danger">{errors.priceEuros}</Typography.Text>
            )}
          </Col>
          <Col span={24}>
            <Checkbox
              checked={values.electric}
              onChange={(e) =>
                setValues({ ...values, electric: e.target.checked })
              }
            >
              Electric bike
            </Checkbox>
          </Col>
          <Col span={24}>
            <label htmlFor="bike-edit-description">Description</label>
            <Input.TextArea
              id="bike-edit-description"
              rows={3}
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </Col>
        </Row>
      ) : (
        <Descriptions column={1} items={items} />
      )}
    </Card>
  );
};
