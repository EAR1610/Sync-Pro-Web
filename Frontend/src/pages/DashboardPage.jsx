import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import Product from '../components/Product';


// Exportar archivos
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import clienteAxios from '../config/clienteAxios';

const DashboardPage = () => {
  let emptyProduct = {
    id: null,
    name: '',
    image: null,
    description: '',
    price: 0,
    quantity: 0,
  };
  const [products, setProducts] = useState([]);
  const [registro, setRegistro] = useState([]);

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [product, setProduct] = useState(emptyProduct);

  const [productDialog, setProductDialog] = useState(false);
  const columns = [
    { field: 'Barras', header: 'Barras' },
    { field: 'Descripcion', header: 'Descripcion' },
    { field: 'Existencia', header: 'Existencia' },
    { field: 'Costo', header: 'Costo' },
    { field: 'PrecioFinal', header: 'Precio' }
  ];

  useEffect(() => {
    const cargarProductos = async () => {
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
          }
        }
        const response = await clienteAxios.get('/dashboard/personalizado', config);
        if (!response) {
          throw new Error('Error al cargar los productos');
        }

        const { data } = await response;
        setLoading(false);
        setProducts(data);
      } catch (error) {
        console.error('Hubo un error:', error);
      }
    };

    cargarProductos();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const editProduct = (rowData) => {
    setProductDialog(true);
    setRegistro(rowData)
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          icon="pi pi-eye"
          onClick={() => editProduct(rowData)}
          style={{ padding: '0.0rem', fontSize: '0.75rem', backgroundColor: '#48BB78', color: '#FFFFFF' }}
        />
        <Button
          icon="pi pi-pencil"
          onClick={() => alert('Opción en desarrollo')}
          style={{ padding: '0.0rem', fontSize: '0.75rem', backgroundColor: '#4299E1', color: '#FFFFFF' }}
          className='ml-1'
        />
        <Button
          icon="pi pi-trash"
          onClick={() => alert('Opción en desarrollo')}
          style={{ padding: '0.0rem', fontSize: '0.75rem', backgroundColor: '#F56565', color: '#FFFFFF' }}
          className='ml-1'
        />
      </div>
    );
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const titleRow = ['Inventario de Productos'];
    const emptyRow = [];
    const headerRow = ['Barras', 'Descripcion', 'Existencia', 'Costo', 'PrecioFinal'];
    const dataRows = products.map(product => [
      product.Barras,
      product.Descripcion,
      product.Existencia,
      product.Costo,
      product.PrecioFinal
    ]);
    const allRows = [emptyRow, titleRow, emptyRow, headerRow, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(allRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario de Productos");
    XLSX.writeFile(wb, "Inventario de Productos.xlsx");
  };

  // Exportar a PDF
  const exportToPDF = () => {
    if (products.length === 0) {
      console.error('No hay productos para generar el reporte');
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["Barras", "Descripcion", "Existencia", "Costo", "PrecioFinal"];
    const tableRows = [];

    // Agregar los datos de los productos a las filas de la tabla
    products.forEach(product => {
      const rowData = [
        product.Barras,
        product.Descripcion,
        product.Existencia,
        product.Costo,
        product.PrecioFinal
      ];
      tableRows.push(rowData);
    });

    // Agregar título al PDF
    doc.text("Inventario de Productos", 105, 10, { align: "center" });

    // Agregar la tabla al PDF
    doc.autoTable({
      startY: 20, // Mover la tabla hacia abajo
      head: [tableColumn],
      body: tableRows,
    });

    // Guardar el documento PDF
    doc.save('Inventario de Productos.pdf');
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-space-between" >
        <div className="flex-1 justify-content-end">
          <span className="">
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className='border rounded-lg' />
          </span>
          <div className='mt-2'>
            <Button className='mr-1 text-white text-sm bg-green-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportToExcel} data-pr-tooltip="XLS" />
            <Button className='text-white text-sm bg-red-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportToPDF} data-pr-tooltip="PDF" />
          </div>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div>
      <div className="card">

        <DataTable
          dataKey="Barras"
          size='small'
          header={header}
          filters={filters}
          loading={loading}
          showGridlines
          removableSort
          value={products}
          tableStyle={{ minWidth: '50rem' }}
          paginator
          rows={25}
          rowsPerPageOptions={[5, 10, 25, 50]}
          selectionMode="single"
          selection={selectedProduct}
          onSelectionChange={(e) => setSelectedProduct(e.value)}
          scrollable
          scrollHeight="400px"
          globalFilter={globalFilterValue}
          className='p-datatable-gridlines text-xs' // text-sm reduce el tamaño de la fuente, py-1 reduce la altura de las filas
        >
          <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ width: '4rem' }}></Column>
          {columns.map((col, i) => (
            <Column key={`${col.field}-${i}`} field={col.field} header={col.header} sortable />
          ))}
        </DataTable>

      </div>
      {productDialog && <Product productDialog={productDialog} product={registro} setProductDialog={setProductDialog} />}
    </div>
  );
}

export default DashboardPage