import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import useAxios from "../hooks/useAxios";

const ReporteIso = () => {
  const { data: datos, isLoading, error } = useAxios("https://sistemacontrolherramientas-production.up.railway.app/api/herramienta");

  useEffect(() => {
    // Generate PDF when component mounts
    if (datos) {
      generatePDF();
    }
  }, [datos]); // Run the effect whenever 'datos' changes

  const generatePDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4', true);

    // Table data
    const tableData = datos.map(herramienta => [herramienta.identificacion, herramienta.ubicacion, herramienta.calibradoPor]);

    // Add header to PDF
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Header Column 1', 20, 10);
    doc.text('Header Column 2', 80, 10);
    doc.text('Header Column 3', 150, 10);

    // Add table to PDF
   // Add table to PDF
   
// Add table to PDF
autoTable(doc, {
    theme: 'plain', // Added theme: 'plain'
    head: [['Identificacion', 'Ubicacion', 'Calibrado por']], // Header row
    body: tableData, // Body rows
    styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 }, // Add this line
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 }, // Add this line
});


    

    // Add footer to PDF
    doc.setFont('helvetica', 'bold');
    doc.text('Footer Column 1', 10, doc.internal.pageSize.height - 10);
    doc.text('Footer Column 2', 80, doc.internal.pageSize.height - 10);
    doc.text('Footer Column 3', 150, doc.internal.pageSize.height - 10);
    doc.text('Footer Column 4', 220, doc.internal.pageSize.height - 10);

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
      <div>Generating PDF...</div>
      {/* Render table here if needed */}
    </>
  );
};

export default ReporteIso;
