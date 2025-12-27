import { Toaster } from "sonner";
import "./index.css";
import RootNavigator from "./navigation/RootNavigator";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <RootNavigator />
    </>
  );
}

export default App;
