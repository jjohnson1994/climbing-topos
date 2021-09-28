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
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
