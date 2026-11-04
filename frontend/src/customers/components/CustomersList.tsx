import { Skeleton, Space, Pagination } from "antd";
import { useEffect } from "react";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

export const CustomersList = () => {
  const { customers, deleteCustomer, createCustomer, isLoading, load, totalCount, page, pageSize } =
    useCustomersProvider();

  useEffect(() => {
    load();
  }, []);

  // gestion changement de page ou taille de page
  const onPageChange = (newPage: number, newPageSize: number) => {
    load(newPage, newPageSize);
  };
  return (
    <Space
      orientation="vertical"
      style={{ padding: ".25rem .5rem", width: "100%" }}
    >
      <AddCustomerButton createCustomer={createCustomer} />
      {isLoading ? (
        <Skeleton />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={deleteCustomer}
          />
        ))
      )}
      {/* on ajoute le composant pagination de antd qui prend en compte les differnets parametres */}
      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalCount}
        onChange={onPageChange}
        pageSizeOptions={[10, 20, 50]}
        showSizeChanger
        showTotal={(total) => `${total} client(s)`}
        style={{ marginTop: "1rem", alignSelf: "center" }}
      />
    </Space>
  );
};
