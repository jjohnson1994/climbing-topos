import React from "react";
import { Link } from "react-router-dom";
import { Route } from "../../../core/types";

interface Props {
  routes?: Route[]
}

function CragRoutesTable({ routes }: Props) {
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
          <tr key={ route.slug }>
            <td>
              <Link
                to={ `/crags/${route.cragSlug}/areas/${route.areaSlug}/routes/${route.slug}` }
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
