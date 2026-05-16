import React, { useState, useEffect } from "react";
import type { stockItem } from "../../types";
import {
  getProductos,
  modificarProducto,
} from "../../services/app/stockService";
import ProductsTable from "../../components/app/ProductsTable";
import ProductsListing from "../../components/app/ProductsListing";

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
        setError(err.message);
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

    try {
      await modificarProducto(formData.id, formData);

      setData((prev) =>
        prev.map((item) => (item.id === formData.id ? formData : item)),
      );

      handleEditing();
    } catch (err) {
      console.error(err);
      alert("Error al modificar producto");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

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
