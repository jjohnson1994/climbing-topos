import { Log } from "core/types";
import React from "react";
import Table from "../elements/Table";
import RatingStarsDisplay from "./RatingStarsDisplay";

interface Props {
  logs: Log[];
}

const RouteLogs = ({ logs }: Props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        sortType: "basic",
      },
      {
        Header: "User",
        accessor: "user",
        sortType: "basic",
      },
      {
        Header: "Comment",
        accessor: "comment",
        sortType: "basic",
      },
      {
        Header: "Rating",
        accessor: "rating",
        sortType: "basic",
        Cell: (props: any) => <RatingStarsDisplay stars={ props.row.original.rating } />
      },
    ],
    []
  );

  const data = React.useMemo(
    () =>
      logs.map((log) => ({
        date: log.dateSent,
        user: log.user.nickname,
        comment: log.comment,
        rating: log.rating,
      })),
    [logs]
  );

  return (
    <div className="box">
      <h3 className="title" style={{ whiteSpace: "nowrap" }}>
        Logs
      </h3>
      <Table
        columns={columns}
        data={data}
        sortBy={{ id: "date", desc: true }}
      />
    </div>
  );
};

export default RouteLogs;
