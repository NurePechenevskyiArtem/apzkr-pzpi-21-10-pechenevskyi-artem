const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT

const routes = require("./src/routes/routes")


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/pizza', routes)
app.get('/pizza/:id', routes)
app.post('/pizza', routes)
app.put('/pizza/:id', routes)
app.delete('/pizza/:id', routes)

app.get('/vending-machine', routes)
app.get('/vending-machine/:id', routes)
app.post('/vending-machine', routes)

app.get('/pizza-availability', routes);
app.get('/pizza-availability/machine-id/:machine_id', routes);
app.post('/pizza-availability', routes);
app.delete('/pizza-availability/:pizza_id/:machine_id', routes);
app.put('/pizza-availability/edit-count/:pizza_id/:machine_id', routes);

app.post('/admin-reg', routes);
app.post('/admin-login', routes);
app.put('/admin-profile/edit', routes);
app.put('/admin/change-password', routes);
app.get('/admin-profile', routes);

app.post('/supplier-reg', routes);
app.post('/supplier-login', routes);
app.get('/supplier-profile', routes);
app.get('/supplier', routes);
app.put('/supplier-profile/edit', routes);
app.put('/supplier/change-password', routes);

app.post('/purchase-order', routes);
app.get('/purchase-order/supplier-id/:supplier_id', routes);
app.get('/purchase-order/admin-id/:admin_id', routes);
app.put('/purchase-order/set-completed/:order_id', routes);

app.get('/download-excel/:excelName', routes)


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});