//cohort
const COHORT = "2411-FSA-ET-WEB-PT";
// API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}dm/events`;

/**
 * 👉 STEP 1: Create an object called state that holds an array for events objects
 */
const state = {
  events: [],
};

/**
 * 👉 STEP 2: Complete the function so that it:
 *    - uses `fetch` to make a GET request to the API
 *    - turns the response into json
 *    - stores the json of events into state
 *    - calls `renderAllEvents`
 */
const fetchAllevents = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    state.events = json.data;

    renderAllEvents();
  } catch (error) {
    console.log("ERROR in fetchAllEvents", error);
  }
};

/**
 * 👉 STEP 3: Complete the function so that it:
 *    - uses `fetch` to make a POST request to the API sending the data passed in the body of the request
 *    - turns the response into json
 *    - calls `fetchAllevents`
 *
 * Note: date isn't used in this API but you will need to know how to work with it in the workshop
 */
const createNewEvent = async (name, description, date, location) => {
  try {
    // console.log("date", date);
    // console.log("typeof date", typeof date);
    // console.log("ISO date", new Date(date).toISOString());

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        date,
        // date: new Date(date).toISOString(),
        location,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    fetchAllEvents();
  } catch (error) {
    console.log("ERROR in createNewevent", error);
  }
};

/**
 * 👉 STEP 4: Complete the function so that it:
 *    - uses `fetch` to make a DELETE request to the API to delete a event with the id passed to the function
 *    - calls `fetchAllevents`
 */
const removeEvent = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchAllEvents();
  } catch (error) {
    console.log("ERROR in removeevent", error);
  }
};

// render all events on the page
const renderAllEvents = () => {
  const eventsContainer = document.getElementById("events-container");
  const eventList = state.events;

  if (!eventsList || eventsList.length === 0) {
    eventsContainer.innerHTML = "<h3>No events found</h3>";
    return;
  }

  //resets html of all events
  eventsContainer.innerHTML = "";

  //creates a card for each event
  eventsList.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.classList.add("event-card");
    eventElement.innerHTML = `
            <h4>${event.name}</h4>
            <img src="${event.descriptionl}" alt="${event.name}">
            <p>${event.description}</p>
            <button class="delete-button" data-id="${event.id}">Remove</button>
        `;
    eventsContainer.appendChild(eventElement);

    const deleteButton = eventElement.querySelector(".delete-button");
    //add event listener to the delete button so we can delete a event
    deleteButton.addEventListener("click", (event) => {
      try {
        event.preventDefault();
        removeEvent(event.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

//  adds a listener to our form so when we submit the form we create a new event
const addListenerToForm = () => {
  const form = document.querySelector("#new-event-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewEvent(
      form.name.value,
      form.description.value,
      form.date.value,
      form.location.value
    );

    //clears the form after we create the new event
    form.name.value = "";
    form.description.value = "";
    form.date.value = "";
    form.location.value = "";
  });
};

//initial function when the page loads
const init = async () => {
  //gets all the events from the API
  await fetchAllevents();
  //adds a listener to the form so we can add a event when the user submits the form
  addListenerToForm();
};

init();
