import React from "react";
import { Route } from "../../../core/types";

function CragRoutesTable({ routes }: { routes: Route[] | undefined }) {
  return (
    <table className="table is-full-width">
      <thead>
        <tr>
          <th>Route</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {routes?.map(route => (
          <tr>
            <td>{ route.title }</td>
            <td>{ route.grade }</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CragRoutesTable;
