import React from "react";
import { Route } from "../../../core/types";

function AreaRoutesTable({ routes }: { routes: Route[] | undefined }) {
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Route</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {routes?.map(route => (
          <tr key={ route.title }>
            <td>{ route.title }</td>
            <td>{ route.grade }</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AreaRoutesTable;
