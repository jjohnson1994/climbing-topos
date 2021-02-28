import { logs } from "../services";

export async function getProfileLogs(req, res) {
  try {
    const { user } = req;
    const { cragSlug, areaSlug, topoSlug, routeSlug } = req.query;

    if (!user.sub) {
      throw new Error("Cannot get profile logs, no usersub provided");
    }

    const userLogs = await logs.getUserLogs(user.sub, cragSlug, areaSlug, topoSlug, routeSlug);
    res.status(200).json(userLogs);
  } catch (error) {
    console.error("Error getting user logs", error);
    res.status(500).json({ error: true });
  }
}

export async function getUserLogs(req, res) {
  try {
    const { userSub: findUserSub } = req.params;
    const { cragSlug, areaSlug, topoSlug, routeSlug } = req.query;

    if (!findUserSub) {
      throw new Error("Cannot get user logs, no usersub provided");
    }

    const userLogs = await logs.getUserLogs(findUserSub, cragSlug, areaSlug, topoSlug, routeSlug);
    res.status(200).json(userLogs);
  } catch (error) {
    console.error("Error getting user logs", error);
    res.status(500).json({ error: true });
  }
}
