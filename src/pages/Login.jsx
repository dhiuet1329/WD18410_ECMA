import { zodResolver } from "@hookform/resolvers/zod";
// import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import api from "../axios";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
const Login = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post(`/login`, data);
      localStorage.setItem("user", JSON.stringify(res.data));
      console.log(res);
      if (confirm("Dang nhap thanh cong, tro lai admin page ?")) {
        nav("/admin");
      }
    } catch (error) {
      alert(error.response.data || "Dang nhap that bai");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Login</h1>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            email
          </label>
          <input className="form-control" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            password
          </label>
          <input
            className="form-control"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
