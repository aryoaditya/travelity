import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../screens/Index";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import ProtectedRoute from "./ProtectedRoute";

const RootNavigator = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
    </Routes>
  </BrowserRouter>
);

export default RootNavigator;
