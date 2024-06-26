import { useEffect, useState } from "react";
import "./App.scss";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import api from "./axios";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute";
import ProductForm from "./pages/ProductForm";

function App() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/products");
      setProducts(data);
    })();
  }, []);

  // const handleSubmit = async (data) => {
  //   const res = await api.post("/products", data);
  //   setProducts([...products, res.data]);
  //   if (confirm("Add succefully, redirect to admin page?")) {
  //     navigate("/admin");
  //   }
  // };

  // const handleSubmitEdit = async (data) => {
  //   await api.patch(`/products/${data.id}`, data);
  //   const newData = await api.get("/products");
  //   setProducts(newData.data);
  //   if (confirm("Add succefully, redirect to admin page?")) {
  //     navigate("/admin");
  //   }
  // };

  const handleProduct = async (data) => {
    if (data.id) {
      await api.patch(`/products/${data.id}`, data);
      const newData = await api.get("/products");
      setProducts(newData.data);
    } else {
      const res = await api.post("/products", data);
      setProducts([...products, res.data]);
    }
    if (confirm("Add succefully, redirect to admin page?")) {
      navigate("/admin");
    }
  };

  const removeProduct = async (id) => {
    if (confirm("Are you sure?")) {
      await api.delete(`/products/${id}`);
      // Cach 1: fetch lai danh sach san pham
      // const newData = await api.get(`/products`);
      // setProducts(newData.data);

      //! Cach 2: filter bo qua san pham vua bi xoa
      const newData = products.filter((item) => item.id !== id && item);
      setProducts(newData);
    }
  };

  const logout = () => {
    if (confirm("Are you sure ? ")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };
  return (
    <div>
      <header>
        <div>
          <ul>
            <li>
              <Link to="/admin">Home</Link>
            </li>

            <li>
              <Link to="/register">Register</Link>
            </li>
            {user ? (
              <li>
                <button onClick={logout} className="btn btn-danger">
                  Hello {user?.user?.email} - Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/**Private route admin */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route
              path="/admin"
              element={<Home data={products} removeProduct={removeProduct} />}
            />
            <Route
              path="/admin/product-form"
              element={<ProductForm handleProduct={handleProduct} />}
            />
            <Route
              path="/admin/product-form/:id"
              element={<ProductForm handleProduct={handleProduct} />}
            />
          </Route>
        </Routes>
      </main>
      <footer>
        <h4>Copyright by hieuduc</h4>
      </footer>
    </div>
  );
}

export default App;
