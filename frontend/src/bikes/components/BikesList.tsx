import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import { useBikesProvider } from "../providers/useBikesProvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

export const BikesList = () => {
  const {
    bikes,
    totalCount,
    page,
    pageSize,
    deleteBike,
    createBike,
    isLoading,
    load,
  } = useBikesProvider();

  useEffect(() => {
    load(1, 10);
  }, []);

  // gestion du changement de page ou de limite
  const onPageChange = (newPage: number, newPageSize: number) => {
    load(newPage, newPageSize);
  };

  return (
    <Space
      orientation="vertical"
      style={{ padding: ".25rem .5rem", width: "100%" }}
    >
      <AddBikeButton createBike={createBike} />
      {isLoading ? (
        <Skeleton />
      ) : (
        bikes.map((bike) => (
          <BikeListItem key={bike.id} bike={bike} deleteBike={deleteBike} />
        ))
      )}
      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalCount}
        onChange={onPageChange}
        pageSizeOptions={[10, 20, 50]}
        showSizeChanger
        showTotal={(total) => `${total} bike(s)`}
        style={{ marginTop: "1rem", alignSelf: "center" }}
      />
    </Space>
  );
};
