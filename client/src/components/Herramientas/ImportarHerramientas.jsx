import React, { useState } from 'react';
import * as xlsx from 'xlsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ImportarHerramientas = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = xlsx.read(bstr, { type: 'binary', cellDates: true });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = xlsx.utils.sheet_to_json(ws);
                setPreview(data.slice(0, 5)); // Mostrar primeros 5
            };
            reader.readAsBinaryString(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setMessage(null);
        setError(null);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = xlsx.read(bstr, { type: 'binary', cellDates: true });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const excelData = xlsx.utils.sheet_to_json(ws);

                // Mapear Excel a MongoDB usando cabeceras típicas
                const mappedData = excelData.map(item => ({
                    identificacion: item['Identificación'],
                    descripcion: item['Descripción'] || item['Descripcion'],
                    ubicacion: item['Ubicación'] || item['Ubicacion'],
                    calibradoPor: item['Calibrado por'],
                    certificado: item['Certificado N°'],
                    frecuencia: item['Frecuencia'],
                    ultimaCalibracion: item['Última Fecha de Calibración'] || item['Ultima Fecha de Calibracion'] || new Date(),
                    proximaCalibracion: item['Próxima Fecha de Calibración'] || item['Proxima Fecha de Calibracion'] || item['"Próxima Fecha de Calibración"'] || new Date(),
                    responsable: item['Responsable']
                }));

                const user = JSON.parse(localStorage.getItem('user'));

                // Set user Id before pushing
                const finalData = mappedData.map(h => ({ ...h, userId: user._id }));

                const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const apiUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

                const res = await axios.post(
                    apiUrl + "/api/herramienta/bulk",
                    finalData,
                    { withCredentials: true }
                );

                setMessage(`Se importaron exitosamente ${res.data.count} herramientas.`);
                setPreview([]);
                setFile(null);
            } catch (err) {
                console.error(err);
                setError("Error al subir herramientas. Revisa el formato del Excel o la conectividad.");
            } finally {
                setLoading(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="container mt-4">
            <h2>Importar Herramientas desde Excel</h2>
            <div className="card p-4 mt-3 col-md-8">
                <p>El Excel debe tener las siguientes cabeceras: <b>Identificación, Descripción, Ubicación, Calibrado por, Certificado N°, Frecuencia, Última Fecha de Calibración, Próxima Fecha de Calibración, Responsable</b>.</p>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                    <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileChange} />
                </div>

                {preview.length > 0 && (
                    <div className="mt-4">
                        <h5>Vista Previa (Primeras 5 Filas)</h5>
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Identificación</th>
                                        <th>Descripción</th>
                                        <th>Responsable</th>
                                        <th>Certificado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row['Identificación']}</td>
                                            <td>{row['Descripción'] || row['Descripcion']}</td>
                                            <td>{row['Responsable']}</td>
                                            <td>{row['Certificado N°']}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <button
                    className="btn btn-primary mt-3"
                    onClick={handleUpload}
                    disabled={!file || loading}
                >
                    {loading ? 'Subiendo...' : 'Subir e Importar Data'}
                </button>
                <br />
                <button
                    className="btn btn-secondary mt-2"
                    onClick={() => navigate('/')}
                >
                    Regresar al Dashboard
                </button>
            </div>
        </div>
    );
};

export default ImportarHerramientas;
