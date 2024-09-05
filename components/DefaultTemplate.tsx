import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function DefaultTemplate(props) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <NavBar />
      <main style={{ flex: 1, padding: "2rem" }}>{props.children}</main>
      <Footer />
    </div>
  );
}
