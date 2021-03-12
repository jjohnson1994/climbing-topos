export const handler = (event) => {
  event.Records.forEach(record => {
    console.log("cragOnInsert")
  })
}
