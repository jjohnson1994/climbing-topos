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
    <section className="section">
      <div className="container">
        <div className="box">
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
      </div>
    </section>
  )
}

export default RouteLogs;
