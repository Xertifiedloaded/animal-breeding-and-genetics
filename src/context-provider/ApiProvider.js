"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const Context = createContext({});
export const ApiProvider = ({ children }) => {
  const [row, setRow] = useState([]);
  const [locationData, setLocation] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState(null);

  const openModal = (type) => {
    setModalContentType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContentType(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/alumni/info");
      setRow(response.data.data); 
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitForm = async (
    errors,
    payload,
    setErrors,
    setLoading,
    setPayload
  ) => {
    try {
      const response = await fetch("/api/alumni/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        const formErrors = {};
        Object.keys(data.errors).forEach((field) => {
          formErrors[field] = (
            <span className="text-red-500 text-xs">{data.errors[field]}</span>
          );
        });
        setErrors(formErrors);
      } else {
        alert("Form submitted successfully!");
        setPayload({
          firstName: "",
          lastName: "",
          emailAddress: "",
          middleName: "",
          phoneNumber: "",
          graduatedYear: "",
          previousJob: "",
          currentJob: "",
          locationOrCountry: "",
          supervisor: "",
          advice: "",
          social: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Context.Provider
      value={{
        row,
        locationData,
        orders,
        isModalOpen,
        modalContentType,
        openModal,
        closeModal,
        handleSubmitForm,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useApiContext = () => useContext(Context);