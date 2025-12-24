import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../screens/Index";

const RootNavigator = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
    </Routes>
  </BrowserRouter>
);

export default RootNavigator;
