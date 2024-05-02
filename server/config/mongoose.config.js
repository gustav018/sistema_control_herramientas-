const mongoose = require("mongoose");
const db_name = process.env.BASE_DATOS;

mongoose.connect(`mongodb://127.0.0.1/${db_name}`)
	.then(() => console.log(`Established a connection to the database ${db_name}`))
	.catch(err => console.log(`Something went wrong when connecting to the database ${db_name}`, err));
