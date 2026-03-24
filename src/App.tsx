import { useState } from "react";
import "./App.css";

// import Modal from "./components/modal";
// import Dropdown from "./components/dropdown";
// import Typehead, { type OptionType } from "./components/typehead";
// import Tabs, { PanelList, Tab, TabList, TabPanel } from "./components/tabs";
// import { useState } from "react";
// import Tooltip from "./components/tooltip";
import useToast, { ToastContextProvider } from "./components/toast/useToast";

// const top100Films = [
//   {
//     value: "The Shawshank Redemption",
//     label: "The Shawshank Redemption",
//     id: 1,
//   },
//   { value: "The Godfather", label: "The Godfather", id: 2 },
//   { value: "The Godfather: Part II", label: "The Godfather: Part II", id: 3 },
//   { value: "The Dark Knight", label: "The Dark Knight", id: 4 },
//   { value: "12 Angry Men", label: "12 Angry Men", id: 5 },
//   { value: "Schindler's List", label: "Schindler's List", id: 6 },
//   { value: "Pulp Fiction", label: "Pulp Fiction", id: 7 },
//   {
//     value: "The Lord of the Rings: The Return of the King",
//     label: "The Lord of the Rings: The Return of the King",
//     id: 8,
//   },
//   {
//     value: "The Good, the Bad and the Ugly",
//     label: "The Good, the Bad and the Ugly",
//     id: 9,
//   },
//   { value: "Fight Club", label: "Fight Club", id: 10 },
//   {
//     value: "The Lord of the Rings: The Fellowship of the Ring",
//     label: "The Lord of the Rings: The Fellowship of the Ring",
//     id: 11,
//   },
//   {
//     value: "Star Wars: Episode V - The Empire Strikes Back",
//     label: "Star Wars: Episode V - The Empire Strikes Back",
//     id: 12,
//   },
//   { value: "Forrest Gump", label: "Forrest Gump", id: 13 },
//   { value: "Inception", label: "Inception", id: 14 },
//   {
//     value: "The Lord of the Rings: The Two Towers",
//     label: "The Lord of the Rings: The Two Towers",
//     id: 15,
//   },
//   {
//     value: "One Flew Over the Cuckoo's Nest",
//     label: "One Flew Over the Cuckoo's Nest",
//     id: 16,
//   },
//   { value: "Goodfellas", label: "Goodfellas", id: 17 },
//   { value: "The Matrix", label: "The Matrix", id: 18 },
//   { value: "Seven Samurai", label: "Seven Samurai", id: 19 },
//   {
//     value: "Star Wars: Episode IV - A New Hope",
//     label: "Star Wars: Episode IV - A New Hope",
//     id: 20,
//   },
//   { value: "City of God", label: "City of God", id: 21 },
//   { value: "Se7en", label: "Se7en", id: 22 },
//   {
//     value: "The Silence of the Lambs",
//     label: "The Silence of the Lambs",
//     id: 23,
//   },
//   { value: "It's a Wonderful Life", label: "It's a Wonderful Life", id: 24 },
//   { value: "Life Is Beautiful", label: "Life Is Beautiful", id: 25 },
//   { value: "The Usual Suspects", label: "The Usual Suspects", id: 26 },
//   { value: "Léon: The Professional", label: "Léon: The Professional", id: 27 },
//   { value: "Spirited Away", label: "Spirited Away", id: 28 },
//   { value: "Saving Private Ryan", label: "Saving Private Ryan", id: 29 },
//   {
//     value: "Once Upon a Time in the West",
//     label: "Once Upon a Time in the West",
//     id: 30,
//   },
//   { value: "American History X", label: "American History X", id: 31 },
//   { value: "Interstellar", label: "Interstellar", id: 32 },
//   { value: "Casablanca", label: "Casablanca", id: 33 },
//   { value: "City Lights", label: "City Lights", id: 34 },
//   { value: "Psycho", label: "Psycho", id: 35 },
//   { value: "The Green Mile", label: "The Green Mile", id: 36 },
//   { value: "The Intouchables", label: "The Intouchables", id: 37 },
//   { value: "Modern Times", label: "Modern Times", id: 38 },
//   {
//     value: "Raiders of the Lost Ark",
//     label: "Raiders of the Lost Ark",
//     id: 39,
//   },
//   { value: "Rear Window", label: "Rear Window", id: 40 },
//   { value: "The Pianist", label: "The Pianist", id: 41 },
//   { value: "The Departed", label: "The Departed", id: 42 },
//   {
//     value: "Terminator 2: Judgment Day",
//     label: "Terminator 2: Judgment Day",
//     id: 43,
//   },
//   { value: "Back to the Future", label: "Back to the Future", id: 44 },
//   { value: "Whiplash", label: "Whiplash", id: 45 },
//   { value: "Gladiator", label: "Gladiator", id: 46 },
//   { value: "Memento", label: "Memento", id: 47 },
//   { value: "The Prestige", label: "The Prestige", id: 48 },
//   { value: "The Lion King", label: "The Lion King", id: 49 },
//   { value: "Apocalypse Now", label: "Apocalypse Now", id: 50 },
//   { value: "Alien", label: "Alien", id: 51 },
//   { value: "Sunset Boulevard", label: "Sunset Boulevard", id: 52 },
//   {
//     value:
//       "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
//     label:
//       "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
//     id: 53,
//   },
//   { value: "The Great Dictator", label: "The Great Dictator", id: 54 },
//   { value: "Cinema Paradiso", label: "Cinema Paradiso", id: 55 },
//   { value: "The Lives of Others", label: "The Lives of Others", id: 56 },
//   { value: "Grave of the Fireflies", label: "Grave of the Fireflies", id: 57 },
//   { value: "Paths of Glory", label: "Paths of Glory", id: 58 },
//   { value: "Django Unchained", label: "Django Unchained", id: 59 },
//   { value: "The Shining", label: "The Shining", id: 60 },
//   { value: "WALL·E", label: "WALL·E", id: 61 },
//   { value: "American Beauty", label: "American Beauty", id: 62 },
//   { value: "The Dark Knight Rises", label: "The Dark Knight Rises", id: 63 },
//   { value: "Princess Mononoke", label: "Princess Mononoke", id: 64 },
//   { value: "Aliens", label: "Aliens", id: 65 },
//   { value: "Oldboy", label: "Oldboy", id: 66 },
//   {
//     value: "Once Upon a Time in America",
//     label: "Once Upon a Time in America",
//     id: 67,
//   },
//   {
//     value: "Witness for the Prosecution",
//     label: "Witness for the Prosecution",
//     id: 68,
//   },
//   { value: "Das Boot", label: "Das Boot", id: 69 },
//   { value: "Citizen Kane", label: "Citizen Kane", id: 70 },
//   { value: "North by Northwest", label: "North by Northwest", id: 71 },
//   { value: "Vertigo", label: "Vertigo", id: 72 },
//   {
//     value: "Star Wars: Episode VI - Return of the Jedi",
//     label: "Star Wars: Episode VI - Return of the Jedi",
//     id: 73,
//   },
//   { value: "Reservoir Dogs", label: "Reservoir Dogs", id: 74 },
//   { value: "Braveheart", label: "Braveheart", id: 75 },
//   { value: "M", label: "M", id: 76 },
//   { value: "Requiem for a Dream", label: "Requiem for a Dream", id: 77 },
//   { value: "Amélie", label: "Amélie", id: 78 },
//   { value: "A Clockwork Orange", label: "A Clockwork Orange", id: 79 },
//   { value: "Like Stars on Earth", label: "Like Stars on Earth", id: 80 },
//   { value: "Taxi Driver", label: "Taxi Driver", id: 81 },
//   { value: "Lawrence of Arabia", label: "Lawrence of Arabia", id: 82 },
//   { value: "Double Indemnity", label: "Double Indemnity", id: 83 },
//   {
//     value: "Eternal Sunshine of the Spotless Mind",
//     label: "Eternal Sunshine of the Spotless Mind",
//     id: 84,
//   },
//   { value: "Amadeus", label: "Amadeus", id: 85 },
//   { value: "To Kill a Mockingbird", label: "To Kill a Mockingbird", id: 86 },
//   { value: "Toy Story 3", label: "Toy Story 3", id: 87 },
//   { value: "Logan", label: "Logan", id: 88 },
//   { value: "Full Metal Jacket", label: "Full Metal Jacket", id: 89 },
//   { value: "Dangal", label: "Dangal", id: 90 },
//   { value: "The Sting", label: "The Sting", id: 91 },
//   { value: "2001: A Space Odyssey", label: "2001: A Space Odyssey", id: 92 },
//   { value: "Singin' in the Rain", label: "Singin' in the Rain", id: 93 },
//   { value: "Toy Story", label: "Toy Story", id: 94 },
//   { value: "Bicycle Thieves", label: "Bicycle Thieves", id: 95 },
//   { value: "The Kid", label: "The Kid", id: 96 },
//   { value: "Inglourious Basterds", label: "Inglourious Basterds", id: 97 },
//   { value: "Snatch", label: "Snatch", id: 98 },
//   { value: "3 Idiots", label: "3 Idiots", id: 99 },
//   {
//     value: "Monty Python and the Holy Grail",
//     label: "Monty Python and the Holy Grail",
//     id: 100,
//   },
// ];

// function App() {
//   const [value, setValue] = useState("");

//   async function fetchSuggestions(
//     query: string,
//     signal: AbortSignal
//   ): Promise<OptionType[]> {
//     try {
//       // const response = await fetch(
//       //   `https://restcountries.com/v3.1/name/${query}`,
//       //   {
//       //     signal,
//       //   }
//       // );
//       await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

//       // const temp = await response.json();

//       // return temp.map((obj: any) => {
//       //   return {
//       //     label: obj?.capital?.[0] || "None",
//       //     value: obj?.capital?.[0] || "None",
//       //     id: obj?.latlng[0],
//       //   };
//       // });

//       return top100Films.filter((option) =>
//         option.value.toLowerCase().includes(query.toLowerCase())
//       );
//     } catch (error) {
//       console.error(error);

//       throw error;
//     }
//   }

//   // return (
//   //   <div
//   //     style={{
//   //       padding: "1rem",
//   //     }}
//   //   >
//   //     <Typehead
//   //       label="Movie"
//   //       options={top100Films}
//   //       onSelect={(obj) => console.log("Selected ", obj)}
//   //       // fetchSuggestions={fetchSuggestions}
//   //     />
//   //   </div>
//   // );

//   return (
//     <div
//       style={{
//         padding: "1rem",
//       }}
//     >
//       <Tabs onChange={(num) => console.log(num)}>
//         <TabList>
//           <Tab>1</Tab>
//           <Tab>2</Tab>
//         </TabList>

//         <PanelList>
//           <TabPanel>
//             <div>TabPanel1</div>
//           </TabPanel>
//           <TabPanel>
//             <div>TabPanel2</div>
//           </TabPanel>
//           <TabPanel>
//             <div>TabPanel3</div>
//           </TabPanel>
//         </PanelList>
//       </Tabs>
//     </div>
//   );
// }

// function App() {
//   return (
//     <div
//       style={{
//         padding: "4rem",
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <Tooltip title="Button">
//         <span>Hover me</span>
//       </Tooltip>
//     </div>
//   );
// }

function App() {
  return (
    <ToastContextProvider>
      <TodosContainer />
    </ToastContextProvider>
  );
}

function TodosContainer() {
  const context = useToast();
  const [toastCount, setToastCount] = useState(0);

  return (
    <>
      <button
        onClick={() => {
          context.addToast(
            `Toast ${toastCount}`,
            toastCount % 3 === 0
              ? "error"
              : toastCount % 3 === 1
                ? "success"
                : "info",
          );

          setToastCount((prev) => prev + 1);
        }}
      >
        Add
      </button>
    </>
  );
}

export default App;
