import { Route } from "core/types";
import React, { createContext, useState } from "react";
import RoutesAddToListModal from "./RoutesAddToListModal";
import RoutesAddToLogModal from "./RoutesAddToLogModal";
import { useHistory } from "react-router-dom";
import useUser from "../api/user";

interface RouteLogContextType {
  isSelectingMultiple: boolean;
  onInitSelectMultiple: (isSelectingMultiple: boolean, route: Route) => void;
  onRouteDeselected: (route: Route) => void;
  onRouteSelected: (route: Route) => void;
  onSingleRouteAddToList: (route: Route) => void;
  onSingleRouteDone: (route: Route) => void;
  routesJustLogged: Route[];
  selectedRoutes: Route[];
}

export const RouteLogContext = createContext<RouteLogContextType>({
  isSelectingMultiple: false,
  onInitSelectMultiple: () => {},
  onRouteDeselected: () => {},
  onRouteSelected: () => {},
  onSingleRouteAddToList: () => {},
  onSingleRouteDone: () => {},
  routesJustLogged: [],
  selectedRoutes: [],
});

function RouteLog({ children }: React.HTMLAttributes<Element>) {
  const { isAuthenticated } = useUser();
  const history = useHistory();
  const [selectedRoutes, setSelectedRoutes] = useState<Route[]>([]);
  const [isSelectingMultiple, setIsSelectingMultiple] =
    useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [showAddToListModal, setShowAddToListModal] = useState<boolean>(false);
  const [routesJustLogged, setRoutedJustLogged] = useState<Route[]>([]);

  const onRouteSelected = (route: Route) => {
    const newSelectedRoutes = Array.from(new Set([...selectedRoutes, route]));
    setSelectedRoutes(newSelectedRoutes);
  };

  const onRouteDeselected = (route: Route) => {
    const routeSlug: string = route.slug;
    const newSelectedRoutes = selectedRoutes.filter(
      ({ slug }) => slug !== routeSlug
    );
    setSelectedRoutes(newSelectedRoutes);

    if (newSelectedRoutes.length === 0) {
      setIsSelectingMultiple(false);
    }
  };

  const addToLogModalOnConfirm = () => {
    setShowLogModal(false);
    setSelectedRoutes([]);
  };

  const addToLogModalOnCancel = () => {
    setShowLogModal(false);
    if (isSelectingMultiple === false) {
      setSelectedRoutes([]);
    }
  };

  const addToListModalOnConfirm = () => {
    setShowAddToListModal(false);
    setSelectedRoutes([]);
  };

  const addToListModalOnCancel = () => {
    setShowAddToListModal(false);
    if (isSelectingMultiple === false) {
      setSelectedRoutes([]);
    }
  };

  const btnDoneMultipleOnClick = () => {
    if (!isAuthenticated) {
      history.push("/login");
    } else {
      setShowLogModal(true);
    }
  };

  const btnSaveMultipleToListOnClick = () => {
    if (!isAuthenticated) {
      history.push("/login");
    } else {
      setShowAddToListModal(true);
    }
  };

  const onInitSelectMultiple = (isSelectingMultiple: boolean, route: Route) => {
    setIsSelectingMultiple(isSelectingMultiple);
    setSelectedRoutes([route]);
  };

  const onRoutesLogged = () => {
    setRoutedJustLogged([...routesJustLogged, ...selectedRoutes]);
  };

  const onSingleRouteDone = (route: Route) => {
    setSelectedRoutes([route]);
    setShowLogModal(true);
  };

  const onSingleRouteAddToList = (route: Route) => {
    setSelectedRoutes([route]);
    setShowAddToListModal(true);
  };

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
        routesJustLogged,
      }}
    >
      {children}
      <RoutesAddToLogModal
        routes={selectedRoutes}
        visible={showLogModal}
        onConfirm={addToLogModalOnConfirm}
        onCancel={addToLogModalOnCancel}
        onRoutesLogged={onRoutesLogged}
      />
      <RoutesAddToListModal
        routes={selectedRoutes}
        visible={showAddToListModal}
        onConfirm={addToListModalOnConfirm}
        onCancel={addToListModalOnCancel}
      />
      {selectedRoutes.length ? (
        <nav className="navbar has-shadow is-fixed-bottom" role="navigation">
          <div className="is-flex is-flex-grow-1 is-justify-content-space-between">
            <span className="is-flex is-flex-column is-justify-content-center ml-3">
              {selectedRoutes.length} Routes Selected
            </span>
            <div className="is-justify-content-flex-end navbar-item">
              <div className="buttons">
                <button
                  className="button is-outlined"
                  onClick={btnSaveMultipleToListOnClick}
                >
                  <span className="icon">
                    <i className="fas fw fa-list"></i>
                  </span>
                  <span>Save to List</span>
                </button>
                <button
                  className="button is-primary"
                  onClick={btnDoneMultipleOnClick}
                >
                  <span className="icon">
                    <i className="fas fw fa-check"></i>
                  </span>
                  <span>Done</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        ""
      )}
    </RouteLogContext.Provider>
  );
}

export default RouteLog;
