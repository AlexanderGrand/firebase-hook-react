import "bootstrap/dist/css/bootstrap.min.css";
import Store from "./component/firebase/Store";

const navBar = {
  backgroundColor: "orange",
  padding: 15,
  fontSize: "18px",
  color: "white",
};
function App() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 success" style={navBar}>
            Laboratorio Firebase Store v9.0.2
          </div>
        </div>
        <h5 className="text-muted">Created by Alexander Grand</h5>
        <Store />
      </div>
    </>
  );
}

export default App;
