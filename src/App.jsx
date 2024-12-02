import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header/Header.jsx";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
      </Router>
      <ToastContainer />
      <AppRoutes />
    </div>
  );
}

export default App;
