import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Exportar archivos
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import clienteAxios from "../config/clienteAxios";

const VentasPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [sale, setSale] = useState([])
  const [record, setRecord] = useState([]);
  const [selectSale, setSelectSale] = useState(null);  

  const toast = useRef(null);

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const mostarAlertaFlotante = () => {
    toast.current.show({ severity: 'error', summary: 'Información', detail: 'No hay ventas registradas en las fechas establecidas' });
  }
  
  const columns = [
    { field: 'Fecha', header: 'Fecha' },
    { field: 'Tipo', header: 'Tipo' },
    { field: 'NombreCliente', header: 'Cliente' },
    { field: 'Exento', header: 'Exento' },
    { field: 'TotalDescuento', header: 'Total Descuento' },
    { field: 'TotalImpuesto', header: 'TotalI Impuesto' },
    { field: 'Total', header: 'Total' }
  ]

  const cargarVentas = async () => {    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCargando(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },        
      }
      
      const response = await clienteAxios.post('/reporte_ventas/general', {
          fechaDesde: startDate,
          fechaHasta: finalDate,
          codMoneda: 1,
          rdTipo: 0,
          vendedorId: -1,
          bodegaId: -1,
          contadorCredit: "NO"
      }, config);      

      if (!response) {
        throw new Error('Error al cargar las ventas');
      }      

      let { data } = await response;      
      setLoading(false);

      // Ordenar los datos por fecha (más antigua a más reciente)
      data.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Fecha.split('/');
        const [dayB, monthB, yearB] = b.Fecha.split('/');
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
      });
      setSale(data);
    } catch (error) {
      mostarAlertaFlotante();
      setSale([]);
      console.log('Hubo un error:', error);
    }
  };

  const onSearchClick = () => {
    // Si las fechas son válidas, cambia shouldSearch a true
    if (startDate && finalDate) {
      cargarVentas();
    }
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const formattedStartDate = format(new Date(startDate), 'd MMMM yyyy', { locale: es });
    const formattedFinalDate = format(new Date(finalDate), 'd MMMM yyyy', { locale: es });
    const titleRow = ['Reporte de Ventas desde el ' + formattedStartDate + ' hasta el ' + formattedFinalDate];
    const emptyRow = [];
    const headerRow = ['Fecha', 'Tipo', 'Cliente', 'Exento', 'Descuento', 'Impuesto', 'Total'];
    const dataRows = sale.map(sale => [
      sale.Fecha,
      sale.Tipo,
      sale.NombreCliente,
      sale.Exento,
      sale.TotalDescuento,
      sale.TotalImpuesto,
      sale.Total
    ]);
    const allRows = [emptyRow, titleRow, emptyRow, headerRow, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(allRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte de Ventas");
    XLSX.writeFile(wb, "Reporte de Ventas.xlsx");
  };


  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Fecha", "Tipo", "Cliente", "Exento", "Descuento", "Impuesto", "Total"];
    const tableRows = [];
    sale.forEach(sale => {
      const reportData = [
        sale.Fecha,
        sale.Tipo,
        sale.NombreCliente,
        sale.Exento,
        sale.TotalDescuento,
        sale.TotalImpuesto,
        sale.Total
      ];
      tableRows.push(reportData);
    });
    const formattedStartDate = format(new Date(startDate), 'd MMMM yyyy', { locale: es });
    const formattedFinalDate = format(new Date(finalDate), 'd MMMM yyyy', { locale: es });

    const pageCenter = doc.internal.pageSize.width / 2;

    doc.text("Reporte de Ventas", pageCenter, 10, { align: "center" });
    doc.text(`Desde: ${formattedStartDate}`, pageCenter, 20, { align: "center" });
    doc.text(`Hasta: ${formattedFinalDate}`, pageCenter, 30, { align: "center" });

    doc.autoTable(tableColumn, tableRows, { startY: 40 });
    doc.save('Reporte de Ventas.pdf');
  };

  const renderHeader = () => {
    return (
      <div className="card flex flex-wrap gap-3 p-fluid">
        <div className="flex-auto">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
            Fecha Desde
          </label>
          <Calendar id="buttondisplay" value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" showIcon  />
        </div>
        <div className="flex-auto">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
            Fecha Hasta
          </label>
          <Calendar value={finalDate} onChange={(e) => setFinalDate(e.value)} dateFormat="dd/mm/yy" showIcon />
        </div>
        <button className='text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold' onClick={onSearchClick}>Buscar</button>
        <Button  className='mr-1 text-white text-sm bg-green-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportToExcel} data-pr-tooltip="XLS" />
        <Button  className='text-white text-sm bg-red-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportToPDF} data-pr-tooltip="PDF" />
      </div>
    )
  };

  const header = renderHeader();

  return (
    <div>
      <div className="card flex justify-content-center">
            <Toast ref={toast} />
      </div>
      <div className="card">      
        <DataTable
          dataKey=""
          size='small'
          header={header}
          filters={filters}
          loading={loading}
          showGridlines
          removableSort
          value={sale}
          tableStyle={{ minWidth: '50rem' }}
          paginator
          rows={25}
          rowsPerPageOptions={[5, 10, 25, 50]}
          selectionMode="single"
          selection={selectSale}
          onSelectionChange={(e) => setSelectSale(e.value)}
          scrollable
          scrollHeight="500px"
          globalFilter={globalFilterValue}
        >
          {columns.map((col, i) => (
            <Column
              key={`${col.field}-${i}`}
              field={col.field}
              header={col.header}
            //sortable
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
}

export default VentasPage