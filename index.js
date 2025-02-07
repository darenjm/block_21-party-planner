//cohort
const COHORT = "2411-FSA-ET-WEB-PT";
// API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/recipes`;

/**
 * 👉 STEP 1: Create an object called state that holds an array for recipe objects
 */
const state = {
  recipes: [],
};

/**
 * 👉 STEP 2: Complete the function so that it:
 *    - uses `fetch` to make a GET request to the API
 *    - turns the response into json
 *    - stores the json of recipes into state
 *    - calls `renderAllRecipes`
 */
const fetchAllRecipes = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    state.recipes = json.data;

    renderAllRecipes();
  } catch (error) {
    console.log("ERROR in fetchAllRecipes", error);
  }
};

/**
 * 👉 STEP 3: Complete the function so that it:
 *    - uses `fetch` to make a POST request to the API sending the data passed in the body of the request
 *    - turns the response into json
 *    - calls `fetchAllRecipes`
 *
 * Note: date isn't used in this API but you will need to know how to work with it in the workshop
 */
const createNewRecipe = async (name, imageUrl, description, date) => {
  try {
    // console.log("date", date);
    // console.log("typeof date", typeof date);
    // console.log("ISO date", new Date(date).toISOString());

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name,
        imageUrl,
        description,
        // date: new Date(date).toISOString(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    fetchAllRecipes();
  } catch (error) {
    console.log("ERROR in createNewRecipe", error);
  }
};

/**
 * 👉 STEP 4: Complete the function so that it:
 *    - uses `fetch` to make a DELETE request to the API to delete a recipe with the id passed to the function
 *    - calls `fetchAllRecipes`
 */
const removeRecipe = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchAllRecipes();
  } catch (error) {
    console.log("ERROR in removeRecipe", error);
  }
};

// render all recipes on the page
const renderAllRecipes = () => {
  const recipesContainer = document.getElementById("recipes-container");
  const recipeList = state.recipes;

  if (!recipeList || recipeList.length === 0) {
    recipesContainer.innerHTML = "<h3>No recipes found</h3>";
    return;
  }

  //resets html of all recipes
  recipesContainer.innerHTML = "";

  //creates a card for each recipe
  recipeList.forEach((recipe) => {
    const recipeElement = document.createElement("div");
    recipeElement.classList.add("recipe-card");
    recipeElement.innerHTML = `
            <h4>${recipe.name}</h4>
            <img src="${recipe.imageUrl}" alt="${recipe.name}">
            <p>${recipe.description}</p>
            <button class="delete-button" data-id="${recipe.id}">Remove</button>
        `;
    recipesContainer.appendChild(recipeElement);

    const deleteButton = recipeElement.querySelector(".delete-button");
    //add event listener to the delete button so we can delete a recipe
    deleteButton.addEventListener("click", (event) => {
      try {
        event.preventDefault();
        removeRecipe(recipe.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

//  adds a listener to our form so when we submit the form we create a new recipe
const addListenerToForm = () => {
  const form = document.querySelector("#new-recipe-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewRecipe(
      form.name.value,
      form.imageUrl.value,
      form.description.value,
      form.date.value
    );

    //clears the form after we create the new recipe
    form.name.value = "";
    form.imageUrl.value = "";
    form.description.value = "";
    form.date.value = "";
  });
};

//initial function when the page loads
const init = async () => {
  //gets all the recipes from the API
  await fetchAllRecipes();
  //adds a listener to the form so we can add a recipe when the user submits the form
  addListenerToForm();
};

init();
