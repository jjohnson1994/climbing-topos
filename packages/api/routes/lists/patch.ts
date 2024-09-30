import * as yup from "yup";
import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import { ListAddRouteRequest } from "@climbingtopos/types";
import { lists, routes } from "@/services";
import { getUserFromEvent } from "@/utils/auth";
import { NewListSchema } from "@climbingtopos/schemas";
import { RequestValidator } from "@/utils/request-validator";

const validateBody: RequestValidator = async (
  event: APIGatewayProxyEventV2
) => {
  const schema = NewListSchema();
  const isValid = await schema.isValid(JSON.parse(`${event.body}`));

  if (isValid) {
    return true;
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};

const validateQuery: RequestValidator = async (
  event: APIGatewayProxyEventV2
) => {
  const schema = yup.object().shape({
    listSlug: yup.string().required(),
  });
  const isValid = await schema.isValid(JSON.parse(`${event.body}`));

  if (isValid) {
    return true;
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};

export const handler: APIGatewayProxyHandler = async (
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

    const userSub = event.requestContext.authorizer?.iam.cognitoIdentity.identityId


    if (!userSub) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
        }),
      }
    }

    const { slug } = event.pathParameters as {
      slug: string;
    };
    const newRoutes = JSON.parse(`${event.body}`) as ListAddRouteRequest[];
    const list = await lists.getListBySlug(userSub, slug);

    const routesToList = await Promise.all(
      newRoutes.map(async (routeReq) =>
        routes.listRoutes(
          userSub,
          routeReq.cragSlug,
          routeReq.areaSlug,
          routeReq.topoSlug,
          routeReq.routeSlug
        )
      )
    );

    const updateResponse = await lists.addRoutesToList(
      userSub,
      slug,
      routesToList.map((route) => ({
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
        topoSlug: route.topoSlug,
      }))
    );

    lists.incrementRoutesCount(slug, userSub).catch((error) => {
      console.error("Error incrementing list routes count", error);
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, ...updateResponse }),
    };
  } catch (error) {
    console.error("Error creating new list", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true }),
    };
  }
};
