interface Props {
  stars: number,
}

function RatingStarsDisplay({ stars }: Props) {
  return (
    <span>
      { new Array(Math.max(stars, 0)).fill(0).map((_star, index) => (
        <i className="fas fa-star is-size-6" key={index}></i>
      ))}
    </span>
  )
}

export default RatingStarsDisplay;
