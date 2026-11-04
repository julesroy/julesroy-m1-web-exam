import {
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import {
  Button,
  Card,
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

interface BikeTechnicalSpecsCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
  updateBike: (input: UpdateBikeModel) => Promise<unknown>;
}

type SpecsValues = {
  frameMaterial: string;
  frameSizeCm: number | null;
  wheelSizeInches: number | null;
  gearCount: number | null;
  weightKg: number | null;
};

type SpecsErrors = Partial<Record<keyof SpecsValues, string>>;

// extraction des valeurs de specifications techniques
const toValues = (bike: BikeModel): SpecsValues => ({
  frameMaterial: bike.frameMaterial,
  frameSizeCm: bike.frameSizeCm,
  wheelSizeInches: bike.wheelSizeInches,
  gearCount: bike.gearCount,
  weightKg: bike.weightKg,
});

// validation des donnees techniques
const validate = (values: SpecsValues): SpecsErrors => {
  const errors: SpecsErrors = {};
  if (!values.frameMaterial.trim())
    errors.frameMaterial = "Frame material is required";
  if (values.frameSizeCm === null || values.frameSizeCm <= 0)
    errors.frameSizeCm = "Frame size must be greater than 0";
  if (values.wheelSizeInches === null || values.wheelSizeInches <= 0)
    errors.wheelSizeInches = "Wheel size must be greater than 0";
  if (values.gearCount === null || values.gearCount < 1)
    errors.gearCount = "Gear count must be at least 1";
  if (values.weightKg === null || values.weightKg <= 0)
    errors.weightKg = "Weight must be greater than 0";
  return errors;
};

export const BikeTechnicalSpecsCard = ({
  bike,
  isLoading,
  updateBike,
}: BikeTechnicalSpecsCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<SpecsValues | null>(null);
  const [errors, setErrors] = useState<SpecsErrors>({});

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

  // sauvegarde des specifications techniques modifiees
  const save = () => {
    if (!values) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    updateBike({
      frameMaterial: values.frameMaterial.trim(),
      frameSizeCm: values.frameSizeCm ?? undefined,
      wheelSizeInches: values.wheelSizeInches ?? undefined,
      gearCount: values.gearCount ?? undefined,
      weightKg: values.weightKg ?? undefined,
    })
      .then(cancel)
      .catch(() => {})
      .finally(() => setIsSaving(false));
  };

  const value = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    {
      key: "frameMaterial",
      label: "Frame material",
      children: value(bike?.frameMaterial),
    },
    {
      key: "frameSizeCm",
      label: "Frame size",
      children: value(bike && `${bike.frameSizeCm} cm`),
    },
    {
      key: "wheelSizeInches",
      label: "Wheel size",
      children: value(bike && `${bike.wheelSizeInches}"`),
    },
    {
      key: "gearCount",
      label: "Gear count",
      children: value(bike && `${bike.gearCount} speed${bike.gearCount > 1 ? "s" : ""}`),
    },
    {
      key: "weightKg",
      label: "Weight",
      children: value(bike && `${bike.weightKg} kg`),
    },
  ];

  return (
    <Card
      title="Technical specifications"
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
            aria-label="Edit technical specifications"
            disabled={!bike}
            onClick={startEditing}
          />
        )
      }
    >
      {isEditing && values ? (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <label htmlFor="bike-edit-frameMaterial">Frame material *</label>
            <Input
              id="bike-edit-frameMaterial"
              value={values.frameMaterial}
              status={errors.frameMaterial && "error"}
              onChange={(e) => {
                setValues({ ...values, frameMaterial: e.target.value });
                setErrors({ ...errors, frameMaterial: undefined });
              }}
            />
            {errors.frameMaterial && (
              <Typography.Text type="danger">
                {errors.frameMaterial}
              </Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label htmlFor="bike-edit-frameSizeCm">Frame size (cm) *</label>
            <InputNumber
              id="bike-edit-frameSizeCm"
              style={{ width: "100%" }}
              min={1}
              value={values.frameSizeCm}
              status={errors.frameSizeCm && "error"}
              onChange={(val) => {
                setValues({ ...values, frameSizeCm: val });
                setErrors({ ...errors, frameSizeCm: undefined });
              }}
            />
            {errors.frameSizeCm && (
              <Typography.Text type="danger">
                {errors.frameSizeCm}
              </Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label htmlFor="bike-edit-wheelSizeInches">Wheel size (in) *</label>
            <InputNumber
              id="bike-edit-wheelSizeInches"
              style={{ width: "100%" }}
              min={1}
              value={values.wheelSizeInches}
              status={errors.wheelSizeInches && "error"}
              onChange={(val) => {
                setValues({ ...values, wheelSizeInches: val });
                setErrors({ ...errors, wheelSizeInches: undefined });
              }}
            />
            {errors.wheelSizeInches && (
              <Typography.Text type="danger">
                {errors.wheelSizeInches}
              </Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label htmlFor="bike-edit-gearCount">Gear count *</label>
            <InputNumber
              id="bike-edit-gearCount"
              style={{ width: "100%" }}
              min={1}
              step={1}
              value={values.gearCount}
              status={errors.gearCount && "error"}
              onChange={(val) => {
                setValues({ ...values, gearCount: val });
                setErrors({ ...errors, gearCount: undefined });
              }}
            />
            {errors.gearCount && (
              <Typography.Text type="danger">
                {errors.gearCount}
              </Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label htmlFor="bike-edit-weightKg">Weight (kg) *</label>
            <InputNumber
              id="bike-edit-weightKg"
              style={{ width: "100%" }}
              min={0.1}
              step={0.1}
              value={values.weightKg}
              status={errors.weightKg && "error"}
              onChange={(val) => {
                setValues({ ...values, weightKg: val });
                setErrors({ ...errors, weightKg: undefined });
              }}
            />
            {errors.weightKg && (
              <Typography.Text type="danger">
                {errors.weightKg}
              </Typography.Text>
            )}
          </Col>
        </Row>
      ) : (
        <Descriptions column={1} items={items} />
      )}
    </Card>
  );
};
