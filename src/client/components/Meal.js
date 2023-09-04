import React from "react";
import { useContext, useState, useEffect } from "react";
import { MealsContext } from "./MealsContext";
import { Link, NavLink, useParams } from "react-router-dom";
import { AddReservation } from "./AddReservation";
import MealCard from "./MealCard";
import './MealCard.css'
import "./Meal.css"
import formatDate from "./FormatDate";

export default function Meal() {
  const { id } = useParams();
  const { getMeal, isSuccess } = useContext(MealsContext);
  const [reservations, setReservations] = useState({});

  async function getReservations() {
    const response = await fetch(`api/meals/${id}/reservation`);
    const data = await response.json();
    return data;
  }
  useEffect(() => {
    getReservations().then((data) => {
      setReservations(data);
    });
  }, []);

  if (!isSuccess()) {
    return <h1>loading...</h1>;
  }

  const meal = getMeal(id);

  if (!meal) {
    return <NavLink to="/" />;
  }

  console.log(meal.image_url);

  return (
    <>
      
        <div id="meal">
        <MealCard key={meal.id}>
          <Link to={`/meals/${meal.id}`}>
          <img alt='food' src={meal.image_url}/>
            <div className="card-info">
              <p className="text-title"> {meal.title}</p>
              <p className="text-body"> {meal.description}</p>
              <p className="text-body"> {meal.when_date}</p>
              <p className="text-title"> {meal.price} €</p>
              <p className="text-body">Guests number: {meal.max_reservations} </p>
              <p className="text-title">Location: {meal.location}</p>
            </div>
          </Link>
        </MealCard>

        <div
             style={{
            display:
              parseInt(reservations.total_guests) < meal.max_reservations
                ? "flex"
                : "none",
          }}
          className="login-container"
        >
          <AddReservation meal_id={meal.id} />
        </div>
        </div>
    
      

      <div id="link">
      <Link  to="/meals">
        BACK TO MEALS
      </Link>{" "}
      </div>
     
    </>
  );
}
