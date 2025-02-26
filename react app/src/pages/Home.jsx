import "./Home.css";
import Navbar from "../components/Navbar";

function Home() {
   return (
      <>
         <Navbar />
         <div className="home main">
            <div className="home-sub">
               <p className="welcome">Welcome to React</p>
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
               <button>Explore More !!!</button>
            </div>
         </div>
      </>
   );
}

export default Home;
