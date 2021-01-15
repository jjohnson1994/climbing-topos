import React, { useState } from "react";

function RouteLogContext({ children }: React.HTMLAttributes<Element>) {
  const [selectedRoutes, setSelectedRoutes] = useState();

  const btnDoneMultipleOnClick = () => {
  }
  
  const btnDoneSingleOnClick = () => {
  }

  const btnSaveMultipleToListOnClick = () => {
  }

  const btnSaveSingleToListOnClick = () => {
  }

  return (
    <>
      { children }
      <nav
        className="navbar has-shadow is-fixed-bottom"
        role="navigation"
      >
        <div className="is-justify-content-flex-end navbar-item" style={{  width: "100%"  }}>
          <div className="buttons">
            <button className="button is-outlined" onClick={ btnSaveMultipleToListOnClick }>
              <span className="icon">
                <i className="fas fw fa-list"></i>
              </span>
              <span>Save to List</span>
            </button>
            <button className="button is-primary" onClick={ btnDoneMultipleOnClick }>
              <span className="icon">
                <i className="fas fw fa-check"></i>
              </span>
              <span>Done</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default RouteLogContext;
