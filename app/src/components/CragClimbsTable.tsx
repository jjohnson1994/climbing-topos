import React from "react";

function CragClimbsTable() {
  const climbs: [] = [];
  return (
    <table>
      <thead>
        <tr>
          <th>1</th>
        </tr>
      </thead>
      <tbody>
        {climbs.map(() => (
          <tr>
            <td>1</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CragClimbsTable;
