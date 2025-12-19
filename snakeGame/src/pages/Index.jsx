import { Link } from "react-router-dom";
import "./Index.css";
export default function Index() {
    return (
        <>
            <h1 className="titulo">Index</h1>
            <Link to="/snake">Ir a Snake</Link>
        </>
    );
}