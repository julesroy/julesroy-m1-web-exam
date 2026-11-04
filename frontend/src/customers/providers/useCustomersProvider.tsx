import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
  PaginatedCustomersModel
} from "../models/CustomerModel";

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1); // variables d'etat pour la pagination exo 1
  const [pageSize, setPageSize] = useState<number>(10); // nombre de customers par page, 10 par defaut exo 1
  const [totalCount, setTotalCount] = useState<number>(0); // nombre total de customers exo 1

  const load = (targetPage: number = page, targetLimit: number = pageSize) => {
    setIsLoading(true);
    axios
      .get<PaginatedCustomersModel>("http://localhost:3000/customers", {
        params: { page: targetPage, limit: targetLimit }, // on utilise les parametres définis dans le backend pour gerer la reponse paginee
      })
      .then((result) => { // on met a jour les varibales d'etat avec les donnees reçues du backend
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
        setPage(targetPage);
        setPageSize(targetLimit);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCustomer = (id: string) => {
    axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    });
  };

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then((result) => {
        // Keep the same order as the backend: last name, then first name
        setCustomers((prev) =>
          [...prev, result.data].sort(
            (a, b) =>
              a.lastName.localeCompare(b.lastName) ||
              a.firstName.localeCompare(b.firstName),
          ),
        );
      });

  return { customers, load, isLoading, deleteCustomer, createCustomer, totalCount, page, pageSize };
};
