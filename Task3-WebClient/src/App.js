import './App.css';
import React from 'react';
import { Route, Routes } from "react-router-dom";
import Navigation from "./component/Navigation"
import Login from "./page/Login"
import ProfileAdmin from "./page/ProfileAdmin"
import ChangePassword from "./page/ChangePassword"
import MyVendingMachine from "./page/MyVendingMachine";
import Assortment from "./page/Assortment";
import PizzaDetails from "./page/PizzaDetails";
import CreatePizza from "./page/CreatePizza";
import PurchaseOrderAdmin from "./page/PurchaseOrderAdmin";
import LoginSupplier from "./page/LoginSupplier";
import ProfileSupplier from "./page/ProfileSupplier";
import MyOrders from "./page/MyOrders";
import VendingMachines from "./page/VendingMachines";
import VendingMachineDetails from "./page/VendingMachineDetails";
import Suppliers from "./page/Suppliers";

function App() {
  return (
      <div>
        <Navigation/>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profile-admin" element={<ProfileAdmin />} />
            <Route path="/password-change" element={<ChangePassword />} />
            <Route path="/my-vending-machine" element={<MyVendingMachine />} />
            <Route path="/assortment" element={<Assortment/>} />
            <Route path="/pizza/:id" element={<PizzaDetails/>} />
            <Route path="/pizza/create" element={<CreatePizza/>} />
            <Route path="/purchase-order/admin" element={<PurchaseOrderAdmin/>} />
            <Route path="/login/supplier" element={<LoginSupplier/>} />
            <Route path="/profile-supplier" element={<ProfileSupplier />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/vending-machines" element={<VendingMachines />} />
            <Route path="/vending-machine/:machine_id" element={<VendingMachineDetails />} />
            <Route path="/suppliers" element={<Suppliers />} />










        </Routes>
      </div>
  );
}

export default App;

//.