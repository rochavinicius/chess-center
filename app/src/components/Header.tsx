import * as React from "react";
import "./Header.css";

export default function Header() {
    return (
        <div className="header d-flex justify-content-between">
            <h1>
                <i className="fa-solid fa-chess-knight me-2"/>
                Chess Center
            </h1>
            <div>
                <button type="button" className="btn btn-primary me-2">
                    Sign In
                </button>
                <button type="button" className="btn btn-primary">
                    Register
                </button>
            </div>
        </div>
    );
}
