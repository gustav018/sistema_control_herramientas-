import { useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import useAxios from "../../hooks/useAxios";
import SubMenu from '../SubMenu';
import { Link } from 'react-router-dom';

const Reporte = () => {


  const idUsuarioLogin = () => JSON.parse(localStorage.getItem('user'))?._id || '';
  const idUsuario = idUsuarioLogin();
  console.log(idUsuario)

  const { data: datos, isLoading, error } = useAxios("http://localhost:8000/api/herramienta/user/" + idUsuario);

  useEffect(() => {

    if (datos) {
      generatePDF();

    }
  }, [datos]);
  const mostrarNombreUsuario = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4', true);
    const formatDate = (date) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const fechaFomateada = (`${day}/${month}/${year}`);
      return fechaFomateada;
    }

    // Table data

    const tableData = datos
      .map(herramienta => [
        herramienta.identificacion,
        herramienta.descripcion,
        herramienta.userId.sucursal,
        herramienta.calibradoPor,
        herramienta.certificado,
        herramienta.frecuencia,
        formatDate(herramienta.ultimaCalibracion),
        formatDate(herramienta.proximaCalibracion),
        (`${herramienta.colaboradorId.nombre} ${herramienta.colaboradorId.apellido}`),

      ]);

    // Add header to PDF
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);

    // Add the header table
    autoTable(doc, {
      startY: 10, // Comenzar desde la posición Y 10
      startX: 10, // Comenzar desde la posición X 10
      theme: 'plain',
      head: [['Logo', 'PLANILLA DE ESTADO DE INSTRUMENTOS Y EQUIPOS', 'FL 01\nRevision: 00\nPagina 1/1']], // Fila de encabezado con saltos de línea
      body: [['', '', '']], // Fila vacía
      styles: {
        lineWidth: 0.1, // Ancho de línea
        lineColor: [255, 255, 255], // Color de línea
        fillColor: false, // Desactivar color de relleno
        textColor: [0, 0, 0] // Color de texto
      },
      headStyles: {
        fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1,
        halign: 'center', // Alinear horizontalmente al centro
      },
      bodyStyles: {
        lineWidth: [0.1, 0, 0], // Ancho de líneas para el cuerpo
        lineColor: [0, 0, 0], // Color de línea para el cuerpo
        fillColor: false, // Desactivar color de relleno para el cuerpo
        textColor: [0, 0, 0] // Color de texto para el cuerpo
      },
      columnStyles: {
        0: { cellWidth: 'auto' }, // Ancho automático para la primera columna
        1: { cellWidth: 'auto' }, // Ancho automático para la segunda columna
        2: { cellWidth: 'auto' } // Ancho automático para la tercera columna
      },
      // Márgenes
    });


    // Add table to PDF
    autoTable(doc, {
      startY: 30, // Start from Y position 30
      theme: 'plain',
      head: [['Identificacion','Descripcion', 'Ubicacion', 'Calibrado por', "Certificacion N°", "Frecuencia", "Ultima fecha de Caliracion", "Proxima Fecha de Calibracion", "Responsable"]], // Header row
      body: tableData, // Body rows
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
    });

    // Add footer to PDF
    doc.setFont('helvetica', 'bold');
    doc.text(`Responsable: ${mostrarNombreUsuario()}`, 10, doc.internal.pageSize.height - 10);
    doc.text('Firma:__________________', 100, doc.internal.pageSize.height - 10);
    doc.text(`Fecha: ${formatDate(new Date())}`, 220, doc.internal.pageSize.height - 10);
    // Save the PDF
    doc.save('report.pdf');
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading || !datos) { // Show loading message or handle case when 'datos' is null
    return <div>Loading...</div>;
  }

  return (
    <>
      <SubMenu>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Generating PDF...</h1>
          <Link to="/sistema/herramientas/list" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" rel="noopener noreferrer"><i className="fas fa-arrow-left fa-sm text-white-50" /> Back to Home</Link>
        </div>
      </SubMenu>

    </>
  );
};

export default Reporte;