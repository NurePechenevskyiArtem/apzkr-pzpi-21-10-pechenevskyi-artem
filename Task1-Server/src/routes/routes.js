const express = require('express')
const router = express.Router()
const pizzaController = require("../controllers/pizzaController")
const vendingMachineController = require('../controllers/vendingMachineController')
const pizzaAvailabilityController = require('../controllers/pizzaAvailabilityController')
const adminController = require('../controllers/adminController')
const supplierController = require('../controllers/supplierController')
const purchaseOrderController = require('../controllers/purchaseOrderController')
const authenticateToken = require("../middleware/jwtVerify");
const {join} = require("path");

router.get('/pizza', pizzaController.getAllPizzas);
router.get('/pizza/:id', pizzaController.getPizzaById);
router.post('/pizza', pizzaController.createPizza);
router.put('/pizza/:id', pizzaController.updatePizzaById);
router.delete('/pizza/:id', pizzaController.deletePizzaById);

router.get('/vending-machine', vendingMachineController.getAllVendingMachines);
router.get('/vending-machine/:id', vendingMachineController.getVendingMachineById);
router.post('/vending-machine', vendingMachineController.createVendingMachine);

router.get('/pizza-availability', pizzaAvailabilityController.getAllPizzaAvailability);
router.get('/pizza-availability/machine-id/:machine_id', pizzaAvailabilityController.getPizzasByVendingMachineId);
router.post('/pizza-availability', pizzaAvailabilityController.createPizzaAvailability);
router.delete('/pizza-availability/:pizza_id/:machine_id', pizzaAvailabilityController.deletePizzaAvailabilityByPizzaIdAndMachineId);
router.put('/pizza-availability/edit-count/:pizza_id/:machine_id', pizzaAvailabilityController.updatePizzaCount);
router.post('/admin-reg', adminController.registerUser);
router.post('/admin-login', adminController.loginUser);
router.put('/admin-profile/edit', adminController.updateProfile);
router.put('/admin/change-password', adminController.changePassword);
router.get('/admin-profile', adminController.getProfile);

router.post('/supplier-reg', supplierController.registerSupplier);
router.post('/supplier-login', supplierController.loginSupplier);
router.get('/supplier-profile', supplierController.getSupplierProfile);
router.get('/supplier', supplierController.getAllSuppliers);
router.put('/supplier-profile/edit', supplierController.updateSupplierProfile);
router.put('/supplier/change-password', supplierController.changeSupplierPassword);

router.post('/purchase-order', purchaseOrderController.createPurchaseOrder);
router.get('/purchase-order/supplier-id/:supplier_id', purchaseOrderController.getOrdersBySupplierId);
router.get('/purchase-order/admin-id/:admin_id', purchaseOrderController.getOrdersByAdminId);
router.put('/purchase-order/set-completed/:order_id', purchaseOrderController.updateOrderStatus);

router.get('/download-excel/:excelName', (req, res) => {
    const { excelName } = req.params;
    const filePath = join(__dirname, '../excel', excelName);

    res.download(filePath, excelName, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Failed to download file');
        }
    });
});



module.exports = router