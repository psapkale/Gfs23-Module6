import Navbar from "../components/Navbar";

function Home() {
   return (
      <>
         <Navbar />
         <div
            className="home main text-center text-white flex items-center justify-center"
            style={{
               background: "linear-gradient(120deg,#040220,#8e0e00 250%)",
            }}
         >
            <div className="home-sub w-[90%] h-[70%] flex items-center justify-evenly flex-col text-center">
               <p className="welcome text-[350%]">Welcome to React</p>
               <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Nulla quos vero sunt at iusto sit id aut odio assumenda amet,
                  quas ipsa magnam. Suscipit dignissimos, et impedit voluptates
                  distinctio maxime vero labore? Veritatis reiciendis assumenda,
                  possimus saepe sed rem illo vel ipsum porro eius amet modi ab
                  dolor fuga voluptatem? Officiis maiores nisi quas adipisci
                  accusantium, harum dolor ea sunt aspernatur quisquam nobis
                  alias eos officia iusto nesciunt omnis magnam facere cum,
                  deleniti obcaecati dolore a nam? Eum aut molestias illum modi
                  temporibus, totam cupiditate deleniti incidunt autem
                  perferendis sapiente facere corporis dolore exercitationem
                  fugiat, sint saepe facilis necessitatibus nesciunt! Dolore,
                  asperiores tempore ea porro eligendi quae alias iste
                  blanditiis nihil, maiores aliquid? Dolores ullam quasi culpa
                  nemo laboriosam debitis cum officiis vel? Labore nisi veniam
                  est quaerat doloribus nulla.
               </p>
               <button className="border border-[rgb(16,16,212)] border-t-[rgb(113,113,250)] border-l-[(113,113,250)] text-[rgb(16,16,212)] rounded-md w-[200px] py-2 font-semibold">
                  Explore More !!!
               </button>
            </div>
         </div>
      </>
   );
}

export default Home;
