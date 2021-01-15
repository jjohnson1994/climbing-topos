import { Route } from "core/types";
import React, { createContext, useState } from "react";
import RoutesAddToLogModal from "./RoutesAddToLogModal";

interface RouteLogContextType {
  isSelectingMultiple: boolean;
  onInitSelectMultiple: (isSelectingMultiple: boolean, route: Route) => void;
  onRouteDeselected: (route: Route) => void;
  onRouteSelected: (route: Route) => void;
  onSingleRouteAddToList: (route: Route) => void;
  onSingleRouteDone: (route: Route) => void;
  selectedRoutes: Route[];
}

export const RouteLogContext = createContext<RouteLogContextType>({
  isSelectingMultiple: false,
  onInitSelectMultiple: () => {},
  onRouteDeselected: () => {},
  onRouteSelected: () => {},
  onSingleRouteAddToList: () => {},
  onSingleRouteDone: () => {},
  selectedRoutes: [],
});

function RouteLog({ children }: React.HTMLAttributes<Element>) {
  const [selectedRoutes, setSelectedRoutes] = useState<Route[]>([]);
  const [isSelectingMultiple, setIsSelectingMultiple] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  const onRouteSelected = (route: Route) => {
    const newSelectedRoutes = Array.from(new Set([ ...selectedRoutes, route ]));
    setSelectedRoutes(newSelectedRoutes);
  }

  const onRouteDeselected = (route: Route) => {
    const routeSlug: string = route.slug;
    const newSelectedRoutes = selectedRoutes.filter(({ slug }) => slug !== routeSlug)
    setSelectedRoutes(newSelectedRoutes);

    if (newSelectedRoutes.length === 0) {
      setIsSelectingMultiple(false);
    }
  }

  const btnDoneMultipleOnClick = () => {
    setShowLogModal(true);
  }

  const onInitSelectMultiple = (isSelectingMultiple: boolean, route: Route) => {
    setIsSelectingMultiple(isSelectingMultiple);
    setSelectedRoutes([route]);
  }
  
  const onSingleRouteDone = (route: Route) => {
    setSelectedRoutes([route]);
    setShowLogModal(true);
  }

  const onSingleRouteAddToList = (route: Route) => {
    setSelectedRoutes([route]);
  }

  const btnSaveMultipleToListOnClick = () => {
  }

  const addToLogModalOnConfirm = () => {
    setShowLogModal(false);
    setSelectedRoutes([]);
  }

  const addToLogModalOnCancel = () => {
    setShowLogModal(false);
    if (isSelectingMultiple === false) {
      setSelectedRoutes([]);
    }
  }

  return (
    <RouteLogContext.Provider
      value={{ 
        isSelectingMultiple,
        selectedRoutes,
        onInitSelectMultiple,
        onSingleRouteDone,
        onSingleRouteAddToList,
        onRouteSelected,
        onRouteDeselected,
      }}
    >
      { children }
      <RoutesAddToLogModal
        routes={ selectedRoutes }
        visible={ showLogModal } 
        onCancel={ addToLogModalOnCancel }
        onConfirm={ addToLogModalOnConfirm }
      />
      { selectedRoutes.length ? (
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
      ) : ""}
    </RouteLogContext.Provider>
  );
}

export default RouteLog;
