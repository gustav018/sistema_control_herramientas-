import React, { useState } from 'react';
import * as xlsx from 'xlsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendFields = [
    { key: 'identificacion', label: 'Identificación (Requerido)' },
    { key: 'descripcion', label: 'Descripción (Requerido)' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'calibradoPor', label: 'Calibrado por (Requerido)' },
    { key: 'certificado', label: 'Certificado N° (Requerido)' },
    { key: 'frecuencia', label: 'Frecuencia (Requerido)' },
    { key: 'ultimaCalibracion', label: 'Última Fecha de Calibración' },
    { key: 'proximaCalibracion', label: 'Próxima Fecha de Calibración' },
    { key: 'responsable', label: 'Responsable' }
];

// Helper para castear cualquier formato de Excel a JS Date válido
const parseExcelDate = (val) => {
    if (!val) return new Date();
    // Si viene como Date object (porque usamos cellDates: true)
    if (val instanceof Date) return val;
    // Si es un string "DD/MM/YYYY" o algo similar
    if (typeof val === 'string') {
        const parts = val.split(/[-/]/);
        if (parts.length === 3) {
            // Asumimos DD-MM-YYYY o DD/MM/YYYY
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            let year = parseInt(parts[2], 10);
            if (year < 100) year += 2000;
            return new Date(year, month, day);
        }
        return new Date(val); // Intento nativo
    }
    // Si es numero de serie de Excel (rare case)
    if (typeof val === 'number') {
        return new Date(Math.round((val - 25569) * 86400 * 1000));
    }
    return new Date();
};

const ImportarHerramientas = () => {
    const [file, setFile] = useState(null);
    const [workbook, setWorkbook] = useState(null);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [excelDataRaw, setExcelDataRaw] = useState([]);
    const [excelHeaders, setExcelHeaders] = useState([]);

    // Almacena qué Columna de Excel corresponde a qué Campo de Backend
    const [mapping, setMapping] = useState({});

    // Estados de UI
    const [step, setStep] = useState(1);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Paso 1: Leer el achivo y sus hojas
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = xlsx.read(bstr, { type: 'binary', cellDates: true });
                setWorkbook(wb);
                setSheetNames(wb.SheetNames);
                setSelectedSheet(wb.SheetNames[0]);
                processSheet(wb, wb.SheetNames[0]);
                setStep(2); // Avanza a Seleccionar Hoja y Mapeo
            };
            reader.readAsBinaryString(selectedFile);
        }
    };

    // Al cambiar la hoja seleccionada
    const handleSheetChange = (e) => {
        const sheet = e.target.value;
        setSelectedSheet(sheet);
        if (workbook) processSheet(workbook, sheet);
    };

    const processSheet = (wb, sheetName) => {
        const ws = wb.Sheets[sheetName];
        // Header: 1 asegura que devuelve array de arrays o fuerza extracción de la primera fila
        const sheetJson = xlsx.utils.sheet_to_json(ws, { defval: "" });
        if (sheetJson.length > 0) {
            const headers = Object.keys(sheetJson[0]);
            setExcelHeaders(headers);
            setExcelDataRaw(sheetJson);

            // Auto-mapeo inteligente (intenta hacer match por similitud)
            const autoMap = {};
            backendFields.forEach(bf => {
                // Busca una col en el excel que incluya al menos el id del campo, ej "identificacion" -> "Identificación"
                const matchedAttr = headers.find(h => h.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(bf.key.toLowerCase()));
                if (matchedAttr) {
                    autoMap[bf.key] = matchedAttr;
                } else if (bf.key === 'descripcion' && headers.includes('Descripción')) autoMap[bf.key] = 'Descripción';
                else autoMap[bf.key] = ''; // vacio manda al usuario a elegir
            });
            setMapping(autoMap);
        } else {
            setExcelHeaders([]);
            setExcelDataRaw([]);
            setMapping({});
        }
    };

    const handleMappingChange = (backendKey, excelHeader) => {
        setMapping(prev => ({ ...prev, [backendKey]: excelHeader }));
    };

    // Paso 3: Confirmar Mapeo y ver Preview
    const generatePreview = () => {
        const mappedData = excelDataRaw.map(row => {
            const newRow = {};
            backendFields.forEach(bf => {
                const excelCol = mapping[bf.key];
                const rawVal = excelCol ? row[excelCol] : "";

                // Aplicar el parseo de fecha correcto
                if (bf.key === 'ultimaCalibracion' || bf.key === 'proximaCalibracion') {
                    newRow[bf.key] = parseExcelDate(rawVal).toISOString().split('T')[0]; // preview date string
                } else {
                    newRow[bf.key] = rawVal;
                }
            });
            return newRow;
        });
        setPreview(mappedData.slice(0, 5));
        setStep(3);
    };

    const handleUpload = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            // Generar el payload final usando el mapping
            const finalPayload = excelDataRaw.map(row => {
                const newRow = {};
                backendFields.forEach(bf => {
                    const excelCol = mapping[bf.key];
                    let val = excelCol ? row[excelCol] : "";

                    if (bf.key === 'ultimaCalibracion' || bf.key === 'proximaCalibracion') {
                        val = parseExcelDate(val);
                    }
                    newRow[bf.key] = val;
                });
                return newRow;
            });

            const user = JSON.parse(localStorage.getItem('user'));
            const finalDataWithUser = finalPayload.map(h => ({ ...h, userId: user._id }));

            const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const apiUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

            const res = await axios.post(
                apiUrl + "/api/herramienta/bulk",
                finalDataWithUser,
                { withCredentials: true }
            );

            setMessage(`Se importaron exitosamente ${res.data.count} herramientas.`);
            setStep(4); // Exito Final
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al subir herramientas. Asegúrate de que las fechas tengan formato válido y no falten campos requeridos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Asistente de Importación Masiva Excel</h2>

            <div className="card p-4 mt-3">
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* PASO 1 */}
                {step === 1 && (
                    <div>
                        <h4>Paso 1: Selecciona el archivo</h4>
                        <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileChange} />
                    </div>
                )}

                {/* PASO 2 */}
                {step === 2 && (
                    <div>
                        <h4>Paso 2: Relacionar Columnas</h4>
                        <div className="mb-3">
                            <label className="form-label">Selecciona la Hoja de Trabajo:</label>
                            <select className="form-select w-50" value={selectedSheet} onChange={handleSheetChange}>
                                {sheetNames.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>

                        <hr />
                        <p className="text-muted">A la izquierda ves el campo requerido por el sistema, a la derecha selecciona la columna de tu Excel que lo contiene.</p>

                        <div className="row">
                            {backendFields.map(bf => (
                                <div className="col-md-6 mb-2 d-flex align-items-center" key={bf.key}>
                                    <div className="w-50 fw-bold">{bf.label}</div>
                                    <div className="w-50">
                                        <select
                                            className="form-select form-select-sm"
                                            value={mapping[bf.key] || ''}
                                            onChange={(e) => handleMappingChange(bf.key, e.target.value)}
                                        >
                                            <option value="">-- Ignorar / No mapear --</option>
                                            {excelHeaders.map(hdr => (
                                                <option key={hdr} value={hdr}>{hdr}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <button className="btn btn-secondary me-2" onClick={() => { setFile(null); setStep(1); }}>Cancelar</button>
                            <button className="btn btn-primary" onClick={generatePreview}>Generar Vista Previa</button>
                        </div>
                    </div>
                )}

                {/* PASO 3 */}
                {step === 3 && (
                    <div>
                        <h4>Paso 3: Confirmación Visual</h4>
                        <p className="text-muted">Asegúrate de que la información se ve correctamente antes de disparar la carga masiva. (Se muestran los primeros 5).</p>

                        <div className="table-responsive bg-light p-2 rounded border">
                            <table className="table table-bordered table-striped mt-2">
                                <thead>
                                    <tr>
                                        {backendFields.map(bf => <th key={bf.key}>{bf.label}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, idx) => (
                                        <tr key={idx}>
                                            {backendFields.map(bf => <td key={bf.key}>{row[bf.key]}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <button className="btn btn-secondary me-2" disabled={loading} onClick={() => setStep(2)}>Atrás</button>
                            <button className="btn btn-success" disabled={loading} onClick={handleUpload}>
                                {loading ? 'Enviando...' : 'Confirmar e Importar Todo'}
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 4 */}
                {step === 4 && (
                    <div className="text-center py-5">
                        <h3 className="text-success mb-3">¡Importación Finalizada!</h3>
                        <button className="btn btn-outline-primary me-2" onClick={() => { setStep(1); setFile(null); }}>Importar otro archivo</button>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>Ir al Dashboard</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ImportarHerramientas;
