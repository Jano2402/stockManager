import React from "react";
import type { compraAgrupada } from "../../types";

type BillingsTableProps = {
  data: compraAgrupada[];
};

function BillingsTable({ data }: BillingsTableProps) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Sifones</th>
            <th>Bidón 6L</th>
            <th>Bidón 12L</th>
            <th>Total Compra</th>
            <th>Total Pagado</th>
            <th>Debe</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.nombre}</td>
              <td>{item.sifones}</td>
              <td>{item.bidon6L}</td>
              <td>{item.bidon12L}</td>
              <td>{item.totalCompra}</td>
              <td>{item.totalPagado}</td>
              <td>{item.totalDebiendo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BillingsTable;
