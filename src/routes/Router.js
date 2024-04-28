import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../shared/Layout";
import FormLogin from "../components/login/FormLogin";
import Home from "../components/Home/Home";
import Sales from "../components/Sales/Sales";
import Settings from "../components/Settings/Setting";
import Users from "../components/Users/Users";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={
            <Layout title={"home"}>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/sales"
          element={
            <Layout title={"sales"}>
              <Sales />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout title={"users"}>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout title={"settings"}>
              <Settings />
            </Layout>
          }
        />
        <Route path="/" element={<FormLogin />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
