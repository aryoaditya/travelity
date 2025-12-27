import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../screens/Index";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";

const RootNavigator = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
    </Routes>
  </BrowserRouter>
);

export default RootNavigator;
