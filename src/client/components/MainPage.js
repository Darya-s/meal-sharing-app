import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import './MainPage.css'
import MealCard from "./MealCard";

function MainPage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetch("api/meals?limit=5").then(
        (data) => data.json()
      );
      setMeals(data);
    })();
  }, []);



 
  const formatDate = (date) => {
    const sqlDate = new Date(date);

    const year = sqlDate.getFullYear();
    const month = (sqlDate.getMonth() + 1).toString().padStart(2, '0');
    const day = sqlDate.getDate().toString().padStart(2, '0');
    const hours = sqlDate.getHours().toString().padStart(2, '0');
    const minutes = sqlDate.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`+'   '+`${hours}:${minutes}`;
    
    return formattedDate;
  };

  return (
    <>
      <div className="container">
        {meals.map((meal) => {
          return (
            <MealCard key={meal.id}>
              <Link to={`/meals/${meal.id}`}>
                <img alt='food' src={meal.image_url}/>
                <div className="card-info">
                  <p className="text-title"> TITLE: {meal.title}</p>
                  <p className="text-body"> DESCRIPTION: {meal.description}</p>
                  <p className="text-body"> DATE: {formatDate(meal.when_date)}</p>
                  <p className="text-title"> PRICE: {meal.price} €</p>
                  <p className="text-body">
                    NUMBER OF GUESTS: {meal.max_reservations}{" "}
                  </p>
                  <p className="text-title">LOCATION: {meal.location}</p>
                </div>
              </Link>
            </MealCard>
          );
        })}
        <Link className="links-style" to={"/meals"}>
          Show more meals...
        </Link>
      </div>
    </>
  );
}

export default MainPage;
