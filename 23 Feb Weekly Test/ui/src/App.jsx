import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

function App() {
   const [iplData, setIplData] = useState(null);

   useEffect(() => {
      fetch("http://localhost:5000/api/ipl-stats")
         .then((res) => res.json())
         .then((data) => setIplData(data.orangeCap));
   }, []);

   if (!iplData) return <p>Loading...</p>;

   const chartData = {
      labels: iplData.map((player) => player.player),
      datasets: [
         {
            label: "Runs",
            data: iplData.map((player) => parseInt(player.runs)),
            backgroundColor: "orange",
         },
      ],
   };

   return (
      <div>
         {JSON.stringify(chartData)}
         <h2>Top 10 Orange Cap Players</h2>
         <Bar data={chartData} />
      </div>
   );
}

export default App;
