import React from "react";

function CragQuickActions(crag: any) {
  const btnLikeOnClick = () => {
  }

  return (
    <div className="buttons has-addons is-right">
      <button className="button is-rounded" onClick={ btnLikeOnClick }>
        <span className={`
          icon is-small
          ${crag.liked ? 'has-text-danger' : ''}
        `}>
          <i
            className={`
              far fa-heart
              ${'fas' && crag.liked}
            `}
          ></i>
        </span>
        { (crag.liked === true && <span>Liked</span>) || <span>Like</span> }
      </button>
    </div>
  );
}

export default CragQuickActions;
