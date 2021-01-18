import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="content">
        <div className="columns">
          <div className="column">
            <p><b>ClimbingTopos.com</b></p> 
            <p>
              <Link to="/about">About</Link>
              <br />
              <a href="https://forms.gle/Kki69djKcCP1mspw6" target="_blank" rel="noopener noreferrer">Contact</a>
              <br />
              <a href="https://forms.gle/y6Tt2nVdaVAMdf189" target="_blank" rel="noopener noreferrer">Report a Bug</a>
              <br />
            </p>
            <p>
              <Link to="#" className="has-text-dark mr-2">
                <i className="fab fa-github"></i>
              </Link>
              <Link to="#" className="has-text-dark">
                <i className="fab fa-instagram"></i>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
