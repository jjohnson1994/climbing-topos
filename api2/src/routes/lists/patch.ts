import * as yup from "yup";
import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";
import {ListAddRouteRequest} from "core/types";
import {lists, routes} from "../../services";
import { getAuth0UserFromEvent } from "../../utils/auth";
import { NewListSchema } from "core/schemas";
import {RequestValidator} from "../../utils/request-validator";

const validateBody: RequestValidator = async (event: APIGatewayProxyEventV2) => {
  const schema = NewListSchema(yup);
  const isValid = await schema.isValid(JSON.parse(`${event.body}`));

  if (isValid) {
    return true;
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}

const validateQuery: RequestValidator = async (event: APIGatewayProxyEventV2) => {
  const schema = yup.object().shape({
    listSlug: yup.string().required()
  })
  const isValid = await schema.isValid(JSON.parse(`${event.body}`));

  if (isValid) {
    return true;
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}


export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const bodyIsValid = await validateBody(event);

    if (bodyIsValid !== true) {
      return bodyIsValid;
    }

    const queryIsValid = await validateQuery(event);

    if (queryIsValid !== true) {
      return queryIsValid;
    }

    const { sub } = await getAuth0UserFromEvent(event);
    const { slug } = event.pathParameters as {
      slug: string;
    };
    const newRoutes = JSON.parse(`${event.body}`) as ListAddRouteRequest[];
    const list = await lists.getListBySlug(sub, slug);

    const routesToList = await Promise.all(
      newRoutes.map(async routeReq => routes.getRouteBySlug(
        sub,
        routeReq.cragSlug,
        routeReq.areaSlug,
        routeReq.topoSlug,
        routeReq.routeSlug
      )),
    );

    const updateResponse = await lists.addRoutesToList(
      sub,
      slug,
      routesToList.map(route => ({
        areaSlug: route.areaSlug,
        areaTitle: route.title,
        country: route.country,
        countryCode: route.countryCode,
        county: route.county,
        cragSlug: route.cragSlug,
        cragTitle: route.cragTitle,
        grade: route.grade,
        gradeModal: route.gradeModal,
        gradingSystem: route.gradingSystem,
        latitude: route.latitude,
        slug,
        listSlug: list.slug,
        listTitle: list.title,
        longitude: route.longitude,
        rockType: route.rockType,
        routeSlug: route.slug,
        routeType: route.routeType,
        state: route.state,
        title: route.title,
        topoSlug: route.topoSlug
      }))
    );

    lists.incrementRoutesCount(slug, sub)
      .catch(error => {
        console.error("Error incrementing list routes count", error);
      });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, ...updateResponse })
    }
  } catch (error) {
    console.error("Error creating new list", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}
