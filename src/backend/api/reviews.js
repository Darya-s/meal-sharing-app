const express = require("express");
const router = express.Router();
const knex = require("../database");
//All reviews   
router.get("/", async(request, response) => {
    try {
       
        const titles = await knex("reviews");
        response.json(titles);
    } catch (error) {
        throw error;
    }
});



//Returns all reviews for a specific meal.

router.get("/meals/:meal_id/reviews", async (request, response) => {
    const specificMeal=request.params.meal_id;
    const query = await knex
    .select("reviews",'meals.title as mealTitle') 
    .from('reviews','meals')
    .innerJoin('meals', 'reviews.meal_id','=','meals.id')
    .having('reviews.meal_id','=',specificMeal)
    try {
       const results= await query;
      response.json(results);
    } catch (error) {
      throw error;
    }
  });


//Adds a new review 	
router.post("/", async (request, response) => {
    try {
          const newReview = await knex("reviews").insert(request.body);
      response.send("New review added");
    } catch (error) {
      throw error;
    }
  });
  //Returns review by id
  router.get("/:id", async (request, response) => {
    try {
      const reviews = await knex("reviews").where("id", parseInt(request.params.id));
      response.json(reviews);
    } catch (error) {
      throw error;
    }
  });
  //Updates the review by id	
  router.put("/:id", async (request, response) => {
    try {
        const reviews = await knex("reviews")
        .where("id", parseInt(request.params.id))
        .update(request.body);
      response.json(reviews);
    } catch (error) {
      throw error;
    }
  });
//Deletes the review by id
router.delete("/:id", async (request, response) => {
    try {
      const deleteReview = await knex("reviews")
        .where("id", parseInt(request.params.id))
        .del();
      response.json(deleteReview);
    } catch (error) {
      throw error;
    }
  });

module.exports = router;