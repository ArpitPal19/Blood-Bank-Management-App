import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/API";

// Login
export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", {
        role,
        email,
        password,
      });

      // Store token and redirect user
      if (data.success) {
        alert(data.message);

        localStorage.setItem("token", data.token);

        // Role-based redirection
        if (role === "admin") {
          window.location.replace("/admin");
        } else if (role === "donar") {
          window.location.replace("/");
        } else if (role === "hospital") {
          window.location.replace("/hospital");
        } else if (role === "organisation") {
          window.location.replace("/organisation");
        }
      }

      return data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      return rejectWithValue(error.message);
    }
  },
);

// Register
export const userRegister = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      role,
      email,
      password,
      phone,
      organisationName,
      address,
      hospitalName,
      website,
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await API.post("/auth/register", {
        name,
        role,
        email,
        password,
        phone,
        organisationName,
        address,
        hospitalName,
        website,
      });

      console.log("Register API Response:", data);

      if (data?.success) {
        alert("User Registered Successfully");
      }

      return data;
    } catch (error) {
      console.log("Register Error:", error);

      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      return rejectWithValue(error.message);
    }
  },
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/auth/current-user");

      if (res.data) {
        return res.data;
      }
    } catch (error) {
      console.log(error);

      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      return rejectWithValue(error.message);
    }
  },
);
