import React, { useState, useEffect } from "react";
import type { stockItem } from "../../types";
import {
  getProductos,
  modificarProducto,
} from "../../services/app/stockService";
import ProductsTable from "../../components/app/ProductsTable";
import ProductsListing from "../../components/app/ProductsListing";
import { getErrorMessage } from "../../utils/app/errorHandler";

function Stock() {
  const [data, setData] = useState<stockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<stockItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductos();
        setData(data);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditing = (item?: stockItem) => {
    if (item) {
      setEditing(true);
      setFormData({ ...item });
    } else {
      setEditing(false);
      setFormData(null);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    setLoading(true);
    try {
      await modificarProducto(formData.id, formData);

      setData((prev) =>
        prev.map((item) => (item.id === formData.id ? formData : item)),
      );

      handleEditing();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div
          className="
            w-10 h-10

            rounded-full

            border-4 border-slate-700
            border-t-sky-400

            animate-spin
          "
        />

        <p className="text-slate-400 text-md">Cargando...</p>
      </div>
    );
  if (error)
    return <div className="text-center text-slate-400">Error: {error}</div>;

  return (
    <>
      <ProductsTable data={data} handleEditing={handleEditing} />

      {editing && formData && (
        <ProductsListing
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
          handleEditing={handleEditing}
        />
      )}
    </>
  );
}

export default Stock;
