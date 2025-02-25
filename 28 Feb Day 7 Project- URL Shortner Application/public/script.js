// const BE_URL = "http://localhost:3000";
const BE_URL = "https://url-shortner-backend-y2qi.onrender.com";

function composeUrl(key) {
   return `${BE_URL}/${key}`;
}

async function getAllRoutes() {
   const res = await fetch(`${BE_URL}/getAll`);
   const { db } = await res.json();

   if (db) {
      Object.entries(db).map(([key, _]) => {
         const url = composeUrl(key);

         const a = document.createElement("a");
         a.href = url;
         a.target = "_blank";
         a.innerText = `short.url/${key}`;

         document.getElementById("result").appendChild(a);
      });
   }
}

window.addEventListener("load", getAllRoutes);

async function shortenUrl() {
   const url = document.getElementById("urlInput").value;
   if (!url || !url.startsWith("https://")) return alert("Enter a valid URL");

   const response = await fetch(`${BE_URL}/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
   });

   const data = await response.json();
   if (data.shortUrl) {
      const a = document.createElement("a");
      a.href = data.shortUrl;
      a.target = "_blank";
      a.innerText = data.shortUrl;

      document.getElementById("result").appendChild(a);
   } else {
      alert("Error shortening URL");
   }
}
