import {RouteRequest, Route, Auth0User} from "core/types";
import {areas, logs, routes, topos} from "../models";

export async function createRoute(routeDescription: RouteRequest, user: Auth0User) {
  const topo = await topos.getTopoBySlug(routeDescription.topoSlug);

  const newRouteDescription = {
    ...routeDescription,
    drawing: {
      ...routeDescription.drawing,
      backgroundImage: topo.image,
    }
  };

  const newRoute = await routes.createRoute(newRouteDescription, user);

  return newRoute;
}

export async function getRouteBySlug(
  userSub: string | undefined,
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string
): Promise<Route> {
  const route = await routes.getRouteBySlug(
    cragSlug,
    areaSlug,
    topoSlug,
    routeSlug
  );

  const [topo, area, siblingRoutes, userLogs] = await Promise.all([
    topos.getTopoBySlug(route.topoSlug),
    areas.getAreaBySlug(route.areaSlug),
    routes
      .getRoutesByTopoSlug(cragSlug, areaSlug, topoSlug)
      .then(res => res.filter(route => route.slug !== routeSlug)),
    userSub
      ? logs.getLogsForUser(userSub, cragSlug, areaSlug, topoSlug, routeSlug)
      : [],
  ]);

  return {
    ...route,
    topo,
    area,
    siblingRoutes,
    userLogs
  };
}

export async function decrementLogCount(
  cragSlug: string, 
  areaSlug: string,
  topoSlug: string,
  routeSlug: string
) {
  return routes.update(cragSlug, areaSlug, topoSlug, routeSlug, {
    UpdateExpression: "set #logCount = #logCount + :inc",
    ExpressionAttributeNames: { 
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": -1
    },
  });
}

export async function incrementLogCount(
  cragSlug: string, 
  areaSlug: string,
  topoSlug: string,
  routeSlug: string
) {
  return routes.update(cragSlug, areaSlug, topoSlug, routeSlug, {
    UpdateExpression: "set #logCount = #logCount + :inc",
    ExpressionAttributeNames: { 
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}

export async function updateMetricsOnLogInsert(
  cragSlug: string, 
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
  rating: number,
  grade: number,
  createdAt: string,
  user: {
    picture: string,
    nickname: string,
    sub: string,
  }
) {
  const { ratingTally, gradeTally, recentLogs } = await getRouteBySlug('', cragSlug, areaSlug, topoSlug, routeSlug);

  // Calc new rating
  const existingRatingTally = ratingTally[rating];
  const newRatingTally = {
    ...ratingTally,
    [rating]: typeof existingRatingTally !== 'undefined' ? existingRatingTally + 1 : 1,
  };
  const newRating = parseInt(Object.entries(newRatingTally).sort((a, b) => b[1] - a[1])[0][0], 10);

  // Calc new grade
  const existingGradeTally = gradeTally[grade];
  const newGradeTally = {
    ...gradeTally,
    [grade]: typeof existingGradeTally !== 'undefined' ? existingGradeTally + 1 : 1,
  };
  const newGrade = parseInt(Object.entries(newGradeTally).sort((a, b) => b[1] - a[1])[0][0], 10);

  // Calc new recent logs listStyle
  const newRecentLogs = [ { ...user, createdAt }, ...recentLogs || [] ]
    // .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0,100)
    // .reduce((acc, cur, _idx, arr) => {
    //   if (arr.findIndex(item => item.sub === cur.sub && item.createdAt === cur.createdAt) !== -1) {
    //     return [ ...acc, cur ];
    //   } else {
    //     return acc;
    //   }
    // }, [])

  return Promise.all([
    updateRouteRatingAndRatingTally(
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug,
      newRating,
      rating,
      existingRatingTally,
    ),
    updateRouteGradeAndGradeTally(
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug,
      newGrade,
      grade,
      existingGradeTally,
    ),
    updateRouteRecentLogs(
      cragSlug,
      areaSlug,
      topoSlug,
      routeSlug,
      newRecentLogs,
    ),
  ])
}

export async function updateRouteRatingAndRatingTally(
  cragSlug: string, 
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
  rating: number,
  tallyItemToIncrement: number,
  existingRatingTally: number | undefined
) {
  if (typeof existingRatingTally !== 'undefined') {
    return routes.update(cragSlug, areaSlug, topoSlug, routeSlug, {
      UpdateExpression: `
        set #ratingTally.#userVote = #ratingTally.#userVote + :inc,
        #rating = :rating
      `,
      ExpressionAttributeNames: { 
        "#ratingTally": "ratingTally",
        "#rating": "rating",
        "#userVote": `${tallyItemToIncrement}`,
      },
      ExpressionAttributeValues: {
        ":rating": rating,
        ":inc": 1,
      },
    });
  } else {
    return routes.update(cragSlug, areaSlug, topoSlug, routeSlug, {
      UpdateExpression: `
        set #ratingTally.#userVote = :inc,
        #rating = :rating
      `,
      ExpressionAttributeNames: { 
        "#ratingTally": "ratingTally",
        "#rating": "rating",
        "#userVote": `${tallyItemToIncrement}`,
      },
      ExpressionAttributeValues: {
        ":rating": rating,
        ":inc": 1,
      },
    });
  }
}

export async function updateRouteGradeAndGradeTally(
  cragSlug: string, 
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
  grade: number,
  tallyItemToIncrement: number,
  existingGradeTally: number | undefined
) {
  if (typeof existingGradeTally !== 'undefined') {
    return routes.update(cragSlug, areaSlug, topoSlug, routeSlug, {
      UpdateExpression: `
        set #gradeTally.#userVote = #gradeTally.#userVote + :inc,
        #gradeModal = :gradeModal
      `,
      ExpressionAttributeNames: { 
        "#gradeTally": "gradeTally",
        "#gradeModal": "gradeModal",
        "#userVote": `${tallyItemToIncrement}`,
      },
      ExpressionAttributeValues: {
        ":gradeModal": grade,
        ":inc": 1,
      },
    });
  } else {
    return routes.update(cragSlug, areaSlug, topoSlug, routeSlug, {
      UpdateExpression: `
        set #gradeTally.#userVote = :inc,
        #gradeModal = :gradeModal
      `,
      ExpressionAttributeNames: { 
        "#gradeTally": "gradeTally",
        "#gradeModal": "gradeModal",
        "#userVote": `${tallyItemToIncrement}`,
      },
      ExpressionAttributeValues: {
        ":gradeModal": grade,
        ":inc": 1,
      },
    });
  }
}

export async function updateRouteRecentLogs(
  cragSlug: string, 
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
  recentLogs: {
    picture: string,
    nickname: string,
    sub: string,
  }[]
) {
  return routes.update(cragSlug, areaSlug, topoSlug, routeSlug, {
    UpdateExpression: `
      set #recentLogs = :recentLogs
    `,
    ExpressionAttributeNames: { 
      "#recentLogs": 'recentLogs',
    },
    ExpressionAttributeValues: {
      ":recentLogs": recentLogs,
    },
  });
}
