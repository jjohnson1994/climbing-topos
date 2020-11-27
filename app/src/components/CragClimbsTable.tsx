import React from "react";

function CragClimbsTable() {
  const climbs: [] = [];
  return (
    <table>
      <tr>
        <th>1</th>
      </tr>
      {climbs.map(() => (
        <tr>
          <td>1</td>
        </tr>
      ))}
    </table>
  );
}

export default CragClimbsTable;
