import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import type { CreateBikeModel } from "../models/BikeModel";

interface AddBikeButtonProps {
  createBike: (input: CreateBikeModel) => Promise<void>;
}

type BikeFormValues = {
  brand: string;
  model: string;
  description: string;
  category: string;
  frameMaterial: string;
  frameSizeCm: number | null;
  wheelSizeInches: number | null;
  gearCount: number | null;
  weightKg: number | null;
  electric: boolean;
  priceEuros: number | null;
};

type BikeFormErrors = Partial<Record<keyof BikeFormValues, string>>;

const emptyValues: BikeFormValues = {
  brand: "",
  model: "",
  description: "",
  category: "",
  frameMaterial: "",
  frameSizeCm: 54,
  wheelSizeInches: 28,
  gearCount: 11,
  weightKg: 10.5,
  electric: false,
  priceEuros: 499,
};

// validation des donnees du formulaire
const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.frameMaterial.trim()) errors.frameMaterial = "Frame material is required";
  if (values.frameSizeCm === null || values.frameSizeCm <= 0)
    errors.frameSizeCm = "Frame size must be greater than 0";
  if (values.wheelSizeInches === null || values.wheelSizeInches <= 0)
    errors.wheelSizeInches = "Wheel size must be greater than 0";
  if (values.gearCount === null || values.gearCount < 1)
    errors.gearCount = "Gear count must be at least 1";
  if (values.weightKg === null || values.weightKg <= 0)
    errors.weightKg = "Weight must be greater than 0";
  if (values.priceEuros === null || values.priceEuros < 0)
    errors.priceEuros = "Price must be positive or zero";
  return errors;
};

// transformation des valeurs de saisie en modele de creation
const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  frameSizeCm: values.frameSizeCm ?? 54,
  wheelSizeInches: values.wheelSizeInches ?? 28,
  gearCount: values.gearCount ?? 1,
  weightKg: values.weightKg ?? 10,
  electric: values.electric,
  priceCents: Math.round((values.priceEuros ?? 0) * 100),
});

export const AddBikeButton = ({ createBike }: AddBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(emptyValues);
  const [errors, setErrors] = useState<BikeFormErrors>({});

  const close = () => {
    setValues(emptyValues);
    setErrors({});
    setIsOpen(false);
  };

  // confirmation de l'ajout d'un nouveau velo
  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    createBike(toCreateBikeModel(values))
      .then(close)
      .finally(() => setIsSaving(false));
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Add bike
      </Button>
      <Modal
        open={isOpen}
        title="New bike model"
        okText="Add bike"
        onCancel={close}
        onOk={onConfirm}
        confirmLoading={isSaving}
        width={600}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <label htmlFor="bike-brand">Brand *</label>
            <Input
              id="bike-brand"
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
            <label htmlFor="bike-model">Model *</label>
            <Input
              id="bike-model"
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
            <label htmlFor="bike-category">Category *</label>
            <Input
              id="bike-category"
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
            <label htmlFor="bike-frameMaterial">Frame material *</label>
            <Input
              id="bike-frameMaterial"
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
          <Col span={8}>
            <label htmlFor="bike-frameSizeCm">Frame size (cm) *</label>
            <InputNumber
              id="bike-frameSizeCm"
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
          <Col span={8}>
            <label htmlFor="bike-wheelSizeInches">Wheel size (in) *</label>
            <InputNumber
              id="bike-wheelSizeInches"
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
          <Col span={8}>
            <label htmlFor="bike-gearCount">Gear count *</label>
            <InputNumber
              id="bike-gearCount"
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
            <label htmlFor="bike-weightKg">Weight (kg) *</label>
            <InputNumber
              id="bike-weightKg"
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
          <Col span={12}>
            <label htmlFor="bike-priceEuros">Price (€) *</label>
            <InputNumber
              id="bike-priceEuros"
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
              <Typography.Text type="danger">
                {errors.priceEuros}
              </Typography.Text>
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
            <label htmlFor="bike-description">Description</label>
            <Input.TextArea
              id="bike-description"
              rows={3}
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
