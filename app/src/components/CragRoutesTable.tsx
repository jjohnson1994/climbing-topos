import React from "react";
import { Link } from "react-router-dom";
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
            <td>
              <Link
                to={ `/crags/${route.cragSlug}/areas/${route.areaSlug}` }
                className="is-capitalized"
              >
                { route.title }
              </Link>
            </td>
            <td>{ route.grade }</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CragRoutesTable;
