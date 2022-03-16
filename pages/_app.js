import "../styles/globals.css";
import { Navbar } from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col items-center justify-center mb-10">
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
