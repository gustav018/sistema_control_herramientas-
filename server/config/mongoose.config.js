const mongoose = require("mongoose");
const db_name = process.env.BASE_DATOS || "control_herramientas";
const mongodb_uri = process.env.MONGODB_URI || `mongodb://127.0.0.1/${db_name}`;

mongoose.connect(mongodb_uri)
	.then(() => console.log(`Established a connection to the database ${db_name}`))
	.catch(err => console.log(`Something went wrong when connecting to the database ${db_name}`, err));
