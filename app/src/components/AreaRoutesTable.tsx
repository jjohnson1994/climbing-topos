import React, { ChangeEvent } from "react";
import Tippy from '@tippyjs/react';
import { Route } from "../../../core/types";

interface Props {
  routes: Route[] | undefined,
  selectedRoutes: string[],
  isSelectingMultiple: Boolean | undefined,
  onInitSelectMultiple: Function,
  onRouteSelected: Function
  onRouteDeselected: Function
}

function AreaRoutesTable({
  routes,
  selectedRoutes,
  isSelectingMultiple,
  onInitSelectMultiple,
  onRouteSelected,
  onRouteDeselected,
}: Props) {
  const chkRouteOnChange = (event: ChangeEvent<HTMLInputElement>, routeSlug: string) => {
    console.log("chk on change", selectedRoutes, routeSlug);
    if (selectedRoutes.includes(routeSlug)) {
      onRouteDeselected(routeSlug);
    } else {
      onRouteSelected(routeSlug);
    }
  }

  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Route</th>
          <th>Grade</th>
          <th>Rating</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {routes?.map(route => (
          <tr key={ route.title }>
            <td>{ route.title }</td>
            <td>{ route.grade }</td>
            <td>{ route.rating }</td>
            <td> { isSelectingMultiple 
              ? (
                  <input
                    type="checkbox"
                    checked={ selectedRoutes.includes(String(route.slug)) }
                    onChange={ (e) => chkRouteOnChange(e, String(route.slug)) }
                  />
                )
              : (
                  <Tippy
                    trigger="click"
                    interactive={ true }
                    theme="light-border"
                    placement="bottom-end"
                    hideOnClick={ true }
                    content={
                      <div className="dropdown is-active">
                        <div className="dropdown-menu" style={{ position: "relative" }}>
                          <div className="dropdown-content">
                            <button
                              className="dropdown-item button is-white is-cursor-pointer"
                              onClick={ () => { onRouteSelected(route.slug) } }
                            >
                              <span className="icon">
                                <i className="fas fw fa-check"></i>
                              </span>
                              <span>Done</span>
                            </button>
                            <button
                              className="dropdown-item button is-white is-cursor-pointer"
                              onClick={ () => {} }
                            >
                              <span className="icon">
                                <i className="fas fw fa-list"></i>
                              </span>
                              <span>Save to List</span>
                            </button>
                            <hr className="dropdown-divider" />
                            <button
                              className="dropdown-item button is-white is-cursor-pointer"
                              onClick={ () => onInitSelectMultiple(true, route.slug) }
                            >
                              <span className="icon">
                                <i className="far fw fa-check-square"></i>
                              </span>
                              <span>Select Multiple</span>
                            </button> 
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </Tippy>
                )
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AreaRoutesTable;
