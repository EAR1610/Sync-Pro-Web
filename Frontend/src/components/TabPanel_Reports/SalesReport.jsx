 import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Dropdown } from "primereact/dropdown";

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Exportar archivos
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";

import clienteAxios from "../../config/clienteAxios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SalesReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [sale, setSale] = useState([])
  const [selectSale, setSelectSale] = useState(null);

  const toast = useRef(null);

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const mostarAlertaFlotante = (tipo, message) => {
    toast.current.show({ severity: tipo, summary: 'Información', detail: message });
  }

  // Definir un estado para los vendedores
  const [sellers, setSellers] = useState([{ nombre: 'TODOS', value: -1 }]);
  const [selectedSeller, setSelectedSeller] = useState(-1);

  const paymentTypes = [
    { label: 'Contado', value: 'CON' },
    { label: 'Crédito', value: 'CRE' },
    { label: 'CON/CRE', value: 'NO' }
  ];

  const [selectedPaymentType, setSelectedPaymentType] = useState('NO');

  const navigate = useNavigate();

  useEffect(() => {

    const verificarAcceso = () => {
      const auth = JSON.parse(localStorage.getItem('auth') || {});
      if (!auth.esAdmin) {
        navigate('/dashboard');
      }
    }

    const fetchSellers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
        const response = await clienteAxios.get('/vendedor', config);

        if (!response) {
          throw new Error('Error al cargar los vendedores.');
        }
        const { data } = response;

        const vendedores = sellers.concat(data);
        setSellers(vendedores);
        setSelectedSeller(-1);
      } catch (error) {
        console.error('Hubo un error:', error);
      }
    };
    verificarAcceso();
    fetchSellers();
  }, [])


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

      mostarAlertaFlotante('info', 'Consultando las ventas');

      const response = await clienteAxios.post('/reporte_ventas/general', {
        fechaDesde: startDate,
        fechaHasta: finalDate,
        codMoneda: 1,
        rdTipo: 0,
        vendedorId: selectedSeller,
        bodegaId: -1,
        contadorCredit: selectedPaymentType
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
      mostarAlertaFlotante('error', 'No hay ventas registradas en las fechas establecidas');
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
    if (sale.length === 0) {
      mostarAlertaFlotante('error', 'No hay ventas para generar el reporte');
    } else {
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

      // Sumar totales al final del Excel
      const totalExento = sale.reduce((sum, record) => sum + record.Exento, 0);
      const totalDescuento = sale.reduce((sum, record) => sum + record.TotalDescuento, 0);
      const totalImpuesto = sale.reduce((sum, record) => sum + record.TotalImpuesto, 0);
      const total = sale.reduce((sum, record) => sum + record.Total, 0);

      // Agregar una fila vacía antes de los totales
      const emptyTotalRow = ['', '', '', '', '', '', ''];

      const totalRow = ['Total', '', '', totalExento, totalDescuento, totalImpuesto, total];
      const allRows = [emptyRow, titleRow, emptyRow, headerRow, ...dataRows, emptyTotalRow, totalRow];

      const ws = XLSX.utils.aoa_to_sheet(allRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reporte de Ventas");
      XLSX.writeFile(wb, "Reporte de Ventas.xlsx");
    }
  };


  // Exportar a PDF
  const exportToPDF = () => {
    if (sale.length === 0) {
      mostarAlertaFlotante('error', 'No hay ventas para generar el reporte');
    } else {
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

      // Insertar fila vacía
      tableRows.push([]);

      // Calcular los totales
      const totalExento = sale.reduce((sum, record) => sum + record.Exento, 0);
      const totalDescuento = sale.reduce((sum, record) => sum + record.TotalDescuento, 0);
      const totalImpuesto = sale.reduce((sum, record) => sum + record.TotalImpuesto, 0);
      const total = sale.reduce((sum, record) => sum + record.Total, 0);

      // Agregar los totales a la fila de totales
      const totalRow = ["Total", "", "", totalExento, totalDescuento, totalImpuesto, total];
      tableRows.push(totalRow);

      doc.autoTable({
        startY: 40, // Mover la tabla hacia abajo
        head: [tableColumn],
        body: tableRows,
        didParseCell: function (data) {
          if (data.row.index === tableRows.length - 1) {
            data.cell.styles.fillColor = [220, 220, 220];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });
      doc.save('Reporte de Ventas.pdf');
    }
  };

  const renderHeader = () => {
    return (
      <div className="card flex flex-wrap gap-3 p-fluid justify-center">
        <div className="flex-auto">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
            Fecha Desde
          </label>
          <Calendar id="buttondisplay" value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" showIcon className="bg-sky-400" />
        </div>
        <div className="flex-auto">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
            Fecha Hasta
          </label>
          <Calendar value={finalDate} onChange={(e) => setFinalDate(e.value)} dateFormat="dd/mm/yy" showIcon />
        </div>
        <div className="flex-auto">
          <label htmlFor="sellerDropdown" className="font-bold block mb-2">
            Vendedor
          </label>
          <Dropdown
            id="sellerDropdown"
            value={selectedSeller}
            options={sellers}
            onChange={(e) => setSelectedSeller(e.value)}
            optionLabel="nombre" // nombre de la API
            placeholder="Selecciona un vendedor"
          />
        </div>
        <div className="flex-auto">
          <label htmlFor="paymentTypeDropdown" className="font-bold block mb-2">
            Tipo de Pago
          </label>
          <Dropdown
            id="paymentTypeDropdown"
            value={selectedPaymentType}
            options={paymentTypes}
            onChange={(e) => setSelectedPaymentType(e.value)}
            placeholder="Selecciona un tipo de pago"
          />
        </div>
        <button className='text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold' onClick={onSearchClick}>Buscar</button>
        <Button className='mr-1 text-white text-sm bg-green-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportToExcel} data-pr-tooltip="XLS" />
        <Button className='text-white text-sm bg-red-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportToPDF} data-pr-tooltip="PDF" />
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

export default SalesReport