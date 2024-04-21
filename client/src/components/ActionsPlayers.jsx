import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import useAxios from "../hooks/useAxios";
import SubMenu from '../components/SubMenu';
import { Link } from 'react-router-dom';

const Reporte = () => {
  const { data: datosHerramienta, isLoading: isLoadingHerramienta, error: errorHerramienta } = useAxios("http://localhost:8000/api/herramienta");
  const { data: datosColaborador, isLoading: isLoadingColaborador, error: errorColaborador } = useAxios("http://localhost:8000/api/colaborador/661ea1687c34feeb88923d8b");

  useEffect(() => {
    // Generate PDF when component mounts
    if (datosHerramienta && datosColaborador) {
      generatePDF(datosHerramienta, datosColaborador);
    }
  }, [datosHerramienta, datosColaborador]); // Run the effect whenever either 'datosHerramienta' or 'datosColaborador' changes

  const mostrarNombreUsuario = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
  };

  const generatePDF = (herramientas, colaborador) => {
    const doc = new jsPDF('landscape', 'mm', 'a4', true);
    const formatDate = (date) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Prepare table data
    const tableData = herramientas.map(herramienta => [
      herramienta.identificacion,
      herramienta.ubicacion,
      herramienta.calibradoPor,
      herramienta.certificado,
      herramienta.frecuencia,
      formatDate(herramienta.ultimaCalibracion),
      formatDate(herramienta.proximaCalibracion),
      `${colaborador.colaborador.nombre} ${colaborador.colaborador.apellido}`
    ]);

    // Add header to PDF
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);

    // Add the header table
    autoTable(doc, {
      startY: 10,
      startX: 10,
      theme: 'plain',
      head: [['Logo', 'PLANILLA DE ESTADO DE INSTRUMENTOS Y EQUIPOS', 'FL 01\nRevision: 00\nPagina 1/1']],
      body: [['', '', '']],
      styles: {
        lineWidth: 0.1,
        lineColor: [255, 255, 255],
        fillColor: false,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        halign: 'center',
      },
      bodyStyles: {
        lineWidth: [0.1, 0, 0],
        lineColor: [0, 0, 0],
        fillColor: false,
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
      },
    });

    // Add table to PDF
    autoTable(doc, {
      startY: 30,
      theme: 'plain',
      head: [['Identificacion', 'Ubicacion', 'Calibrado por', 'Certificacion N°', 'Frecuencia', 'Ultima fecha de Calibracion', 'Proxima Fecha de Calibracion', 'Responsable']],
      body: tableData,
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

  if (errorHerramienta || errorColaborador) {
    return <div>Error al cargar los datos.</div>;
  }

  if (isLoadingHerramienta || isLoadingColaborador || !datosHerramienta || !datosColaborador) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <SubMenu>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Generando PDF...</h1>
          <Link to="/" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" rel="noopener noreferrer"><i className="fas fa-arrow-left fa-sm text-white-50" /> Volver a Inicio</Link>
        </div>
      </SubMenu>
    </>
  );
};

export default Reporte;
