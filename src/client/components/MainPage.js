import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./MainPage.css";
import MealCard from "./MealCard";
import formatDate from "./FormatDate";

function MainPage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetch("api/meals?limit=4").then((data) => data.json()); 

      const updatedMap = data.map((item) => {
        return {
          ...item,
          when_date: formatDate(item.when_date)
        };
      });
      setMeals(updatedMap)


      setMeals(data);
    })();
  }, []);

  return (
    <>
      <div className="container">
        {meals.map((meal) => {
          return (
            <MealCard key={meal.id}>
              <Link to={`/meals/${meal.id}`}>
                <img alt="food" src={meal.image_url} />
                <div className="card-info">
                  <p className="text-title"> {meal.title}</p>
                  <p className="text-body"> {meal.description}</p>
                  <p className="text-body"> {formatDate(meal.when_date)}</p>
                  <p className="text-title"> {meal.price} €</p>
                  <p className="text-body">
                    NUMBER OF GUESTS: {meal.max_reservations}{" "}
                  </p>
                  <p className="text-title">LOCATION: {meal.location}</p>
                </div>
              </Link>
            </MealCard>
          );
        })}
      </div>

      <div className="link-style">
        <Link to={"/meals"}>SHOW MORE MEALS...</Link>
      </div>
    </>
  );
}

export default MainPage;
