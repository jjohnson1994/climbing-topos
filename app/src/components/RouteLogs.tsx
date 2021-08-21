import { Log } from "core/types";
import Table from "../elements/Table";
import RatingStarsDisplay from "./RatingStarsDisplay";

interface Props {
  logs: Log[]
}

const RouteLogs = ({ logs }: Props) => {
  const getTableData = (): string[][] => {
    const tBody: string[][] = logs.map(log => ([
      log.dateSent,
      log.user.nickname,
      log.comment,
      `${log.rating}`
    ]))

    return tBody 
  }

  return (
    <div className="box">
      <h3 className="title" style={{ whiteSpace: "nowrap" }}>Logs</h3>
      <Table
        columns={['Date', 'User', 'Comment', 'Rating']}
        data={ getTableData() }
        special={{
          'Rating': rating => (
            <RatingStarsDisplay stars={ rating } />
          )
        }}
      />
    </div>
  )
}

export default RouteLogs;
