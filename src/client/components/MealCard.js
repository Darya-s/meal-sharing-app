import React from "react";

import './MealCard.css'

function MealCard({ children }) {
  return <div className="card">{children}</div>;
}

export default MealCard;
