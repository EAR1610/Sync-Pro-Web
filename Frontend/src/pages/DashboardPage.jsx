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
        if( !token ) {
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

        const {data} = await response;        
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
      <React.Fragment>
        <Button icon="pi pi-eye" rounded text raised severity="info" className="mr-2" onClick={() => editProduct(rowData)} />
        {/* <Button icon="pi pi-trash" rounded text raised severity="danger" onClick={() => confirmDeleteProduct(rowData)} /> */}
      </React.Fragment>
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
    const doc = new jsPDF();
    const tableColumn = ["Barras", "Descripcion", "Existencia", "Costo", "PrecioFinal"];
    const tableRows = [];
    products.forEach(product => {
      const productData = [
        product.Barras,
        product.Descripcion,
        product.Existencia,
        product.Costo,
        product.PrecioFinal
      ];
      tableRows.push(productData);
    });
    const pageCenter = doc.internal.pageSize.width / 2;
    doc.text("Inventario de Productos", pageCenter, 10, { align: "center" });
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("Inventario de Productos.pdf");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-space-between" >
        <div className="flex-1 justify-content-end">
          <span className="p-input-icon-left p-5">            
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
          </span>
        </div>
        <div>
          <Button className='mr-1 text-white text-sm bg-green-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportToExcel} data-pr-tooltip="XLS" />
          <Button className='text-white text-sm bg-red-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportToPDF} data-pr-tooltip="PDF" />
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
          scrollHeight="500px"
          globalFilter={globalFilterValue}
        >
          {/* {columns.map((col, i) => (
            <Column key={col.field} field={col.field} header={col.header} sortable filter />
          ))} */}

          <Column body={actionBodyTemplate} exportable={false} style={{ width: '4rem' }}></Column>
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