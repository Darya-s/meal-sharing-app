import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form";
import "./AddReservation.css";
import Alert from "./Alert";
export function AddReservation({ meal_id }) {
   const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [reservation, setReservation] = useState({});
  const navigate=useNavigate();
  const getTodayDate = () => {
    var date = new Date();

    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const added = await fetch("api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal_id: meal_id,
          contact_email: data.contact_email,
          contact_name: data.contact_name,
          contact_phonenumber: data.contact_phonenumber,
          number_of_guests: data.number_of_guests,
          created_date: getTodayDate(),
        }),
      });
      if (added.status === 200 && added.statusText === "OK") {
        
        setAlertMessage(`We have reserved ${data.number_of_guests} spots for you!`);
        setShowAlert(true);

       setTimeout(() => {
       navigate('/');
       }, 3000);
      };
       } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form className="login-header" onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Email"
          className="login-input"
          type="email"
          name="contact_email"
          {...register("contact_email")}
        />

        <input
          placeholder="Name"
          className="login-input"
          type="text"
          name="contact_name"
          {...register("contact_name")}
        />

        <input
          placeholder="Phone number"
          className="login-input"
          type="text"
          name="contact_phonenumber"
          {...register("contact_phonenumber")}
        />

        <input
          placeholder="Number of guests"
          className="login-input"
          type="number"
          name="number_of_guests"
          {...register("number_of_guests")}
        />


        <button className="login-button" type="submit">
          Book seat
        </button>
 {showAlert && <Alert message={alertMessage} />}

      </form>
    </>
  );
}
