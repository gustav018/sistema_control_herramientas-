const mongoose = require("mongoose");
const db_name = process.env.BASE_DATOS || "control_herramientas";
const mongodb_uri = process.env.MONGODB_URI || `mongodb://127.0.0.1/${db_name}`;

mongoose.connect(mongodb_uri)
	.then(() => console.log(`✅ Conexión exitosa a la base de datos: ${db_name}`))
	.catch(err => {
		console.error(`❌ Error CRÍTICO al conectar a la base de datos: ${db_name}`);
		console.error(err);
		// No matamos el proceso (process.exit) para permitir que Railway reinicie o muestre logs,
		// pero el servidor quedará "zombie" si no hay BD.
	});
