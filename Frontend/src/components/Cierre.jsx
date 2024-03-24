import React, { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import clienteAxios from '../config/clienteAxios';
import { Button } from 'primereact/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Exportar
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";

const Cierre = ({ cierreDialog, setCierreDialog, cierre }) => {
    
    
    const objectCierre = {
        NApertura: 0,
        NombreC: "",
        fechaApertura: "",
        fechaCierre: "",
        TotalVentaE: 0,
        TotalEnCheques: 0,
        TotalEnTarjetas: 0,
        TotalTrans: 0,
        TotalContado: 0,
        TotalCredito: 0,
        TotalApertura: 0,
        TotalEntrada: 0,
        TotalVentaE: 0,
        TotalAbono: 0,
        TotalApartado: 0,
        TotalEntradasEfec: 0,
        TotalSistema: 0,
        TotalSalida: 0,
        PagoCompras: 0,
        PagoGastos: 0,
        Depositos: 0,
        TotalDevolucion: 0,
        TotalSalidasEfec: 0,
        TotalAbonoE: 0,
        AbonosCheques: 0,
        ABonosTRans: 0,
        AbonosTarjeta: 0,
        TotalSistema: 0,
        TotalArqueo: 0,
        TotalDiferencia: 0
    };

    const [cierreData, setCierreData] = useState({ ...objectCierre, ...cierre });

    const [year, month, day] = cierreData.FechaApertura ? cierreData.FechaApertura.split('-') : [null, null, null];

    //Formato de fecha para Frontend
    const fechaApertura = year ? new Date(year, month - 1, day).toLocaleDateString() : '';
    const fechaCierre = year ? new Date(year, month - 1, day).toLocaleDateString() : '';

    //Formato de fecha para excel
    const fechaAperturaFormateada = year ? format(new Date(year, month - 1, day), 'd \'de\' MMMM \'de\' yyyy', { locale: es }) : '';

    useEffect(() => {
        const cargarCierre = async () => {
            if (cierre && cierre.Cierre) {

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

                const response = await clienteAxios.post('/caja/cierre', {                    
                    nApertura: cierre.idApertura
                }, config);
                const { data } = response;
                if (Array.isArray(data) && data.length > 0) {
                    setCierreData(data[0]);
                } else {
                    setCierreData(null);
                }
            }
        }
        cargarCierre();
    }, [cierre]);

    const hideDialog = () => {
        setCierreDialog(false);
    };


    const getDataRows = () => {
        const aperturaDataRows = [
            [[], 'Número de Apertura', cierreData.NApertura],
            [[], 'Nombre del Cajero', cierreData.NombreC],
            [[], 'Fecha Apertura', fechaApertura],
            [[], 'Fecha Cierre', fechaCierre]
        ];

        const ventaDataRows = [
            [[], 'Efectivo', cierreData.TotalVentaE],
            [[], 'Cheques', cierreData.TotalEnCheques],
            [[], 'Tarjetas', cierreData.TotalEnTarjetas],
            [[], 'Transferencia/Deposito', cierreData.TotalTrans],
            [[], 'Venta Contado', cierreData.TotalContado],
            [[], 'Venta Credito', cierreData.TotalCredito]
        ];

        const flujoEfectivoDataRows = [
            [[], 'Fondo Apertura', cierreData.TotalApertura],
            [],
            [[], 'Entradas'],
            [],
            [[], 'Mov. Entrada', cierreData.TotalEntrada],
            [[], 'Ventas Efectivo', cierreData.TotalVentaE],
            [[], 'Abonos CxC - EFE', cierreData.TotalAbono],
            [[], 'Apartados Cobros', cierreData.TotalApartado],
            [[], 'Total Entradas en Efectivo', cierreData.TotalEntradasEfec],
            [[], 'Efectivo Sistema', cierreData.TotalSistema],
            [],
            [[], 'Salidas'],
            [],
            [[], 'Mov. Salida', cierreData.TotalSalida],
            [[], 'Factura de Compras', cierreData.PagoCompras],
            [[], 'Factura de Gastos', cierreData.PagoGastos],
            [[], 'Depósitos', cierreData.Depositos],
            [[], 'Devoluciones', cierreData.TotalDevolucion],
            [[], 'Total Salidas en Efectivo', cierreData.TotalSalidasEfec],
        ];

        const abonosDataRows = [
            [[], 'Efectivo', cierreData.TotalAbonoE],
            [[], 'Cheques', cierreData.AbonosCheques],
            [[], 'Transferencia/Depósitos', cierreData.ABonosTRans],
            [[], 'Tarjeta', cierreData.AbonosTarjeta],
        ];

        const totalesCajaDataRows = [
            [[], 'Total Sistema', cierreData.TotalSistema],
            [[], 'Total Cajero', cierreData.TotalArqueo],
            [[], 'Diferencia en Caja', cierreData.TotalDiferencia],
        ];

        return [aperturaDataRows, ventaDataRows, flujoEfectivoDataRows, abonosDataRows, totalesCajaDataRows];
    };

    // Exportar a Excel
    const exportToExcel = () => {
        if (!cierreData) {
            mostarAlertaFlotante('error', 'No hay cierre de caja para exportar a Excel.');
        } else {
            const titleRow = [[], 'Reporte de Cierre de caja del ' + fechaAperturaFormateada];
            const subtitleApertura = [[], 'APERTURA'];
            const subtitleVentas = [[], 'VENTAS'];
            const subtitleFlujoEfectivo = [[], 'FLUJO DE EFECTIVO'];
            const subtitleAbonos = [[], 'ABONOS'];
            const subtitleTotalesCaja = [[], 'TOTALES DE CAJA']

            const [aperturaDataRows, ventaDataRows, flujoEfectivoDataRows, abonosDataRows, totalesCajaDataRows] = getDataRows();

            const allRows = [
                [],
                titleRow,
                [],
                subtitleApertura,
                [],
                ...aperturaDataRows,
                [],
                subtitleVentas,
                [],
                ...ventaDataRows,
                [],
                subtitleFlujoEfectivo,
                [],
                ...flujoEfectivoDataRows,
                [],
                subtitleAbonos,
                [],
                ...abonosDataRows,
                [],
                subtitleTotalesCaja,
                [],
                ...totalesCajaDataRows,
            ];

            const ws = XLSX.utils.aoa_to_sheet(allRows);

            // Combinar las celdas
            ws['!merges'] = [
                { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },   // Titulo
                { s: { r: 3, c: 1 }, e: { r: 3, c: 2 } },    // Subtítulo Apertura
                { s: { r: 10, c: 1 }, e: { r: 10, c: 2 } }, // Subtítulo Ventas
                { s: { r: 19, c: 1 }, e: { r: 19, c: 2 } }, // Subtítulo Flujo Efectivo
                { s: { r: 41, c: 1 }, e: { r: 41, c: 2 } }, // Subtítulo Abonos
                { s: { r: 48, c: 1 }, e: { r: 48, c: 2 } }  // Subtítulo Totales de Caja
            ];
            // Definir el tamaño de las columnas
            ws['!cols'] = [
                { wch: 5 }, // A
                { wch: 25 }, // B
                { wch: 20 }, // C
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Cierre de Caja");
            XLSX.writeFile(wb, "Reporte Cierre de Caja.xlsx");
        }
    };

    const getDataRowsForPDF = () => {
        const aperturaDataRows = [
            ['Número de Apertura', cierreData.NApertura],
            ['Nombre del Cajero', cierreData.NombreC],
            ['Fecha Apertura', fechaApertura],
            ['Fecha Cierre', fechaCierre]
        ];

        const ventaDataRows = [
            ['Efectivo', cierreData.TotalVentaE],
            ['Cheques', cierreData.TotalEnCheques],
            ['Tarjetas', cierreData.TotalEnTarjetas],
            ['Transferencia/Deposito', cierreData.TotalTrans],
            ['Venta Contado', cierreData.TotalContado],
            ['Venta Credito', cierreData.TotalCredito]
        ];

        const flujoEfectivoDataRows = [
            ['Fondo Apertura', cierreData.TotalApertura],
            ['Mov. Entrada', cierreData.TotalEntrada],
            ['Ventas Efectivo', cierreData.TotalVentaE],
            ['Abonos CxC - EFE', cierreData.TotalAbono],
            ['Apartados Cobros', cierreData.TotalApartado],
            ['Total Entradas en Efectivo', cierreData.TotalEntradasEfec],
            ['Efectivo Sistema', cierreData.TotalSistema],
            ['Mov. Salida', cierreData.TotalSalida],
            ['Factura de Compras', cierreData.PagoCompras],
            ['Factura de Gastos', cierreData.PagoGastos],
            ['Depósitos', cierreData.Depositos],
            ['Devoluciones', cierreData.TotalDevolucion],
            ['Total Salidas en Efectivo', cierreData.TotalSalidasEfec],
        ];

        const abonosDataRows = [
            ['Efectivo', cierreData.TotalAbonoE],
            ['Cheques', cierreData.AbonosCheques],
            ['Transferencia/Depósitos', cierreData.ABonosTRans],
            ['Tarjeta', cierreData.AbonosTarjeta],
        ];

        const totalesCajaDataRows = [
            ['Total Sistema', cierreData.TotalSistema],
            ['Total Cajero', cierreData.TotalArqueo],
            ['Diferencia en Caja', cierreData.TotalDiferencia],
        ];

        return [aperturaDataRows, ventaDataRows, flujoEfectivoDataRows, abonosDataRows, totalesCajaDataRows];
    };

    // Exportar a PDF
    const exportToPDF = () => {
        if (!cierreData) {
            mostarAlertaFlotante('error', 'No hay cierre de caja para exportar a PDF.');
        } else {
            const doc = new jsPDF();
            const subtitles = ['APERTURA', 'VENTAS', 'FLUJO DE EFECTIVO', 'ABONOS', 'TOTALES DE CAJA'];
            const dataRows = getDataRowsForPDF();
            let y = 15;

            const pageCenter = doc.internal.pageSize.width / 2;

            doc.text("Reporte de Cierre de Caja", pageCenter, 15, { align: "center" });
            doc.text(`del ${fechaAperturaFormateada}`, pageCenter, 25, { align: "center" });
            
            y += 25; // Saltos de línea para los subtítulos

            for (let i = 0; i < subtitles.length; i++) {
                doc.setFontSize(16);
                doc.text(subtitles[i], pageCenter, y, { align: "center" });
                y += 10;

                if (subtitles[i] === 'FLUJO DE EFECTIVO' && dataRows[i].length > 0) {
                    // Parte 1: Fondo Apertura
                    doc.autoTable({
                        startY: y,
                        body: [
                            ['Atributo', 'Valor'],
                            ['Fondo Apertura', dataRows[i][0][1]]
                        ],
                        theme: 'striped',
                        styles: { fontSize: 12 },
                        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
                        bodyStyles: { textColor: [0, 0, 0] },
                        alternateRowStyles: { fillColor: [208, 236, 231] },
                        columnStyles: {
                            0: { cellWidth: 100 }, // Ancho de la columna "Atributo"
                            1: { cellWidth: 'auto' } // Ancho de la columna "Valor"
                        }
                    });

                    y = doc.autoTable.previous.finalY + 10;


                    // Parte 2: Entradas
                    doc.setFontSize(14);
                    doc.text('Entradas', 15, y);
                    y += 10;

                    doc.autoTable({
                        startY: y,
                        head: [['Atributo', 'Valor']],
                        body: dataRows[i].slice(1, 7), // selecciona las entradas
                        theme: 'striped',
                        styles: { fontSize: 12 },
                        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
                        bodyStyles: { textColor: [0, 0, 0] },
                        alternateRowStyles: { fillColor: [208, 236, 231] },
                        columnStyles: {
                            0: { cellWidth: 100 }, // Ancho de la columna "Atributo"
                            1: { cellWidth: 'auto' } // Ancho de la columna "Valor"
                        }
                    });

                    y = doc.autoTable.previous.finalY + 10;

                    // Parte 3: Salidas
                    doc.setFontSize(14);
                    doc.text('Salidas', 15, y);
                    y += 10;

                    doc.autoTable({
                        startY: y,
                        head: [['Atributo', 'Valor']],
                        body: dataRows[i].slice(7), // selecciona las salidas
                        theme: 'striped',
                        styles: { fontSize: 12 },
                        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
                        bodyStyles: { textColor: [0, 0, 0] },
                        alternateRowStyles: { fillColor: [208, 236, 231] },
                        columnStyles: {
                            0: { cellWidth: 100 }, // Ancho de la columna "Atributo"
                            1: { cellWidth: 'auto' } // Ancho de la columna "Valor"
                        }
                    });

                    y = doc.autoTable.previous.finalY + 10;
                } else {
                    // Si no es "FLUJO DE EFECTIVO" o no hay datos, generar tabla normal
                    doc.autoTable({
                        startY: y,
                        head: [['Atributo', 'Valor']],
                        body: dataRows[i],
                        theme: 'striped',
                        styles: { fontSize: 12 },
                        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
                        bodyStyles: { textColor: [0, 0, 0] },
                        alternateRowStyles: { fillColor: [208, 236, 231] },
                        columnStyles: {
                            0: { cellWidth: 100 }, // Ancho de la columna "Atributo"
                            1: { cellWidth: 'auto' } // Ancho de la columna "Valor"
                        }
                    });

                    y = doc.autoTable.previous.finalY + 10;
                }

            }
            doc.save("Reporte de Cierre de Caja.pdf");
        }
    };

    return (
        <Dialog visible={cierreDialog} style={{ width: '32rem' }} header={"Cierre: " + cierre.Cierre} modal className="p-fluid" onHide={hideDialog}>
            <div className='flex mb-2 justify-end'>
                <Button className='mr-1 text-white text-sm bg-green-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportToExcel} />
                <Button className='text-white text-sm bg-red-600 p-3 rounded-md uppercase font-bold' type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportToPDF} data-pr-tooltip="PDF" />
            </div>
            <div className="field bg-sky-400" style={{ display: 'flex', justifyContent: 'center', color: 'blue', borderRadius: '10px' }}>
                <label htmlFor="apertura" className="font-bold  text-white" style={{ margin: 0, padding: 0 }}>Apertura</label>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="nApertura" className="font-bold">Número de Apertura: </label>
                <InputText id="nApertura" value={cierreData.NApertura} required className='w-64'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="nombreC" className="font-bold">Nombre del Cajero: </label>
                <InputText id="nombreC" value={cierreData.NombreC} required className='w-64'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="fechaApertura" className="font-bold">Fecha Apertura: </label>
                <InputText id="fechaApertura" value={fechaApertura} required className='w-64'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="fechaCierre" className="font-bold">Fecha Cierre: </label>
                <InputText id="fechaCierre" value={fechaCierre} required className='w-64'/>
            </div>
            <div className="field bg-sky-400" style={{ display: 'flex', justifyContent: 'center', color: 'blue', borderRadius: '10px' }}>
                <label htmlFor="ventas" className="font-bold  text-white" style={{ margin: 0, padding: 0 }}>Ventas</label>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalVentaE" className="font-bold">Efectivo: </label>
                <InputText id="totalVentaE" value={cierreData.TotalVentaE} required className='w-64'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalEnCheques" className="font-bold">Cheques: </label>
                <InputText id="totalEnCheques" value={cierreData.TotalEnCheques} required className='w-64'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalEnTarjetas" className="font-bold">Tarjetas: </label>
                <InputText id="totalEnTarjetas" value={cierreData.TotalEnTarjetas} required className='w-64'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalTrans" className="font-bold">Transferencia / Deposito: </label>
                <InputText id="totalTrans" value={cierreData.TotalTrans} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalContado" className="font-bold">Venta Contado: </label>
                <InputText id="totalContado" value={cierreData.TotalContado} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalCredito" className="font-bold">Venta Crédito: </label>
                <InputText id="totalCredito" value={cierreData.TotalCredito} required className='w-64' />
            </div>
            <div className="field bg-sky-400" style={{ display: 'flex', justifyContent: 'center', color: 'blue', borderRadius: '10px' }}>
                <label htmlFor="flujoEfectivo" className="font-bold  text-white" style={{ margin: 0, padding: 0 }}>Flujo de Efectivo</label>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalApertura" className="font-bold">Fondo Apertura: </label>
                <InputText id="totalApertura" value={cierreData.TotalApertura} required className='w-64' />
            </div>
            <div className="field" style={{ display: 'block', color: 'green' }}>
                <label htmlFor="entradas" className="font-bold" style={{ display: 'block', color: 'green' }}>Entradas</label>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalEntrada" className="font-bold">Mov. Entrada: </label>
                <InputText id="totalEntrada" value={cierreData.TotalEntrada} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalVentaE" className="font-bold">Ventas en Efectivo: </label>
                <InputText id="totalVentaE" value={cierreData.TotalVentaE} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalAbonoE" className="font-bold">Abonos CxC - EFE: </label>
                <InputText id="totalAbonoE" value={cierreData.TotalAbono} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalApartado" className="font-bold">Apartados Cobros: </label>
                <InputText id="totalApartado" value={cierreData.TotalApartado} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalEntradasEfec" className="font-bold">Total Entradas de Efectivo: </label>
                <InputText id="totalEntradasEfec" value={cierreData.TotalEntradasEfec} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalSistema" className="font-bold">Efectivo Sistema: </label>
                <InputText id="totalSistema" value={cierreData.TotalSistema} required className='w-64' />
            </div>
            <div className="field" style={{ display: 'block', color: 'green' }}>
                <label htmlFor="Salidas" className="font-bold" style={{ display: 'block', color: 'red' }}>Salidas</label>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="movSalida" className="font-bold">Mov Salida: </label>
                <InputText id="movSalida" value={cierreData.TotalSalida} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="pagoCompras" className="font-bold">Factura de Compras: </label>
                <InputText id="pagoCompras" value={cierreData.PagoCompras} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="pagoGastos" className="font-bold">Factura de Gastos: </label>
                <InputText id="pagoGastos" value={cierreData.PagoGastos} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="depositos" className="font-bold">Depósitos: </label>
                <InputText id="depositos" value={cierreData.Depositos} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalDevolucion" className="font-bold">Devoluciones: </label>
                <InputText id="totalDevolucion" value={cierreData.TotalDevolucion} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalSalidasEfec" className="font-bold">Total Salidas de Efectivo:</label>
                <InputText id="totalSalidasEfec" value={cierreData.TotalSalidasEfec} required className='w-64' />
            </div>
            <div className="field bg-sky-400" style={{ display: 'flex', justifyContent: 'center', color: 'blue', borderRadius: '10px' }}>
                <label htmlFor="abonos" className="font-bold  text-white" style={{ margin: 0, padding: 0 }}>Abonos</label>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="TotalAbonoE" className="font-bold">Efectivo: </label>
                <InputText id="TotalAbonoE" value={cierreData.TotalAbonoE} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="abonosCheques" className="font-bold">Cheques: </label>
                <InputText id="abonosCheques" value={cierreData.AbonosCheques} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="abonosTRans" className="font-bold">Transferencia/Depósitos: </label>
                <InputText id="abonosTRans" value={cierreData.ABonosTRans} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="abonosTarjeta" className="font-bold">Tarjeta: </label>
                <InputText id="abonosTarjeta" value={cierreData.AbonosTarjeta} required className='w-64' />
            </div>
            <div className="field bg-sky-400" style={{ display: 'flex', justifyContent: 'center', color: 'blue', borderRadius: '10px' }}>
                <label htmlFor="totalesCaja" className="font-bold  text-white" style={{ margin: 0, padding: 0 }}> Totales de Caja</label>
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalSistema" className="font-bold">Total Sistema: </label>
                <InputText id="totalSistema" value={cierreData.TotalSistema} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalArqueo" className="font-bold">Total Cajero: </label>
                <InputText id="totalArqueo" value={cierreData.TotalArqueo} required className='w-64' />
            </div>
            <div className='flex justify-between items-center m-1'>
                <label htmlFor="totalDiferencia" className="font-bold">Diferencia en Caja: </label>
                <InputText id="totalDiferencia" value={cierreData.TotalDiferencia} required className='w-64' />
            </div>
        </Dialog>
    );
};

export default Cierre;