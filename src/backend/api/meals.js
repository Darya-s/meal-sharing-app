const express = require("express");
const router = express.Router();
const knex = require("../database");
const pm = require("./current_timestamp");
const postman = require("postman");
const { json } = require("body-parser");
const { max } = require("../database");

router.get("/", async (request, response) => {
	const { maxPrice, title, dateAfter, dateBefore, sortKey, sortDir, limit } =
		request.query;

	try {
		let mealsQuery = knex("meal");
		if (
			!maxPrice &&
			!title &&
			!dateAfter &&
			!dateBefore &&
			!sortKey &&
			!sortDir &&
			!limit
		)
			mealsQuery = mealsQuery.select("*");

      if ("availableReservations" in request.query) {
        mealsQuery
          .innerJoin("reservations", "reservations.meal_id", "=", "meals.id")
          .groupBy("meals.id", "meals.title");
        if (request.query.availableReservations === "false") {
         mealsQuery.having(
            "meals.max_reservations",
            "<=",
            knex.raw("SUM(reservations.number_of_guests)")
          );
        } else {
          mealsQuery.having(
            "meals.max_reservations",
            ">",
            knex.raw("SUM(reservations.number_of_guests)")
          );
        }
      }
      

		if (maxPrice) {
			mealsQuery = mealsQuery.where("price", "<=", maxPrice);
		}
		if (title) {
			mealsQuery = mealsQuery.where("title", "like", `%${title}%`);
		}
		if (dateAfter) {
			const newDate = new Date(dateAfter);
			mealsQuery = mealsQuery.where("when_date", ">", dateAfter);
		}
		if (dateBefore) {
			const newDate = new Date(dateBefore);
			mealsQuery = mealsQuery.where("when_date", "<", dateBefore);
		}

		if (limit) {
			mealsQuery = mealsQuery.limit(parseInt(limit));
		}
		if (sortKey === "price" && sortDir === "asc") {
			mealsQuery = mealsQuery.orderBy("price", " asc");
		}
		if (sortKey === "price" && sortDir === "desc") {
			mealsQuery = mealsQuery.orderBy("price", "desc");
		}
		if (sortKey === "max_reservations" && sortDir === "asc") {
			mealsQuery = mealsQuery.select("*").orderBy("max_reservations", "asc");
		}
		if (sortKey === "max_reservations" && sortDir === "desc") {
			mealsQuery = mealsQuery.select("*").orderBy("max_reservations", "desc");
		}

		console.log(mealsQuery.toString());

		const meals = await mealsQuery;
		response.json(meals);
	} catch (error) {
		response.status(500).send(error.message);
	}
});

router.get("/future-meals", async (request, response) => {
	try {
		const titles = await knex.raw(
			"SELECT title,when_date FROM meal WHERE when_date>=NOW()"
		);
		response.header("Content-Type", "application/json");
		response.send(JSON.stringify(titles, null, 2));
	} catch (error) {
		throw error;
	}
});

router.get("/past-meals", async (request, response) => {
	try {
		const titles = await knex.raw(
			"SELECT title,when_date FROM meal WHERE when_date<=NOW()"
		);
		response.json(titles);
	} catch (error) {
		throw error;
	}
});

router.get("/all-meals", async (request, response) => {
	try {
		const titles = await knex.raw("SELECT title,id FROM meal ORDER BY id ASC");
		response.json(titles);
	} catch (error) {
		throw error;
	}
});

router.get("/first-meal", async (request, response) => {
	try {
		const [titles] = await knex.raw("select * from meal order by id LIMIT 1");
		if (titles.length === 0) {
			response.status(404).send("There are no available meals");
		} else {
			response.json(titles);
		}
	} catch (error) {
		throw error;
	}
});

router.get("/last-meal", async (request, response) => {
	try {
		const [titles] = await knex.raw(
			"select * from meal ORDER BY id DESC LIMIT 1"
		);

		if (titles.length === 0) {
			response.status(404).send("There are no available meals");
		}

		const newObject = Object.assign({}, titles);
		response.json(newObject);
	} catch (error) {
		throw error;
	}
});

router.post("/", async (request, response) => {
	try {
		const newtitle = request.body.title;
		const date = request.body.date;
		const newMeal = await knex("meal").insert({
			title: newtitle,
			created_date: date,
			when_date: date,
			descrip: "Somedescription10",
			loc: "Odense",
			price: 230,
			max_reservations: 20,
		});
		response.sendStatus(201).json(newMeal);
	} catch (error) {
		throw error;
	}
});

router.get("/:id", async (request, response) => {
	const id = request.params.id;
	try {
		const [idMeal] = await knex("meal").select("*").where({ id });
		if (!idMeal) {
			response.sendStatus(404);
		} else {
			response.json(idMeal);
		}
	} catch (error) {
		throw error;
	}
});

router.put("/:id", async (request, response) => {
	const id = request.params.id;
	try {
		const idMeal = await knex("meal").where({ id }).update({ title: "TITLE" });

		if (!idMeal) {
			return response.send("Updated");
		} else {
			response.sendStatus(201);
		}
	} catch (error) {
		throw error;
	}
});

router.delete("/:id", async (request, response) => {
	const id = request.params.id;
	try {
		const idMeal = await knex("meal").where({ id }).del();

		if (!idMeal) {
			return response.sendStatus(404);
		} else {
			response.send("Deleted");
		}
	} catch (error) {
		throw error;
	}
});


module.exports = router;
