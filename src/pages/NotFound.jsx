import { Link } from "react-router-dom";


export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>Parece que te has perdido...</h1>

      <div className="back-home">
        <Link to="/">Volver al inicio</Link>
      </div>
    </div>
  );
}
