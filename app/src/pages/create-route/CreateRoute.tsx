import { useAuth0 } from "@auth0/auth0-react";
import { yupResolver } from '@hookform/resolvers/yup';
import { NewRouteScheme } from "core/schemas";
import { Area, RouteDrawing } from "core/types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from 'react-router-dom';
import * as yup from "yup";
import { areas, routes, topos } from "../../api";
import TopoCanvas from "../../components/TopoCanvas";
import { popupError, popupSuccess } from "../../helpers/alerts";
import { useGlobals } from "../../api/globals";

const schema = NewRouteScheme(yup);

function CreateRoute() {
  const history = useHistory();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { areaSlug, cragSlug, topoSlug } = useParams<{ areaSlug: string; cragSlug: string, topoSlug: string }>();
  const { routeTags, routeTypes, gradingSystems } = useGlobals();
  const [loading, setLoading] = useState<boolean>(false);
  const [area, setArea] = useState<Area | undefined>();
  const [backgroundImageURL, setBackgroundImageURL] = useState("");

  const { register, getValues, setValue, handleSubmit, errors, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      areaSlug,
      cragSlug,
      description: "",
      drawing: { path: [] },
      gradeIndex: "",
      gradingSystemId: "",
      rating: -1,
      routeTypeId: "",
      tags: [] as string[],
      title: "",
      topoSlug,
    }
  });

  const watchTags = watch("tags", []);
  const watchGradingSystem = watch("gradingSystemId", "");

  useEffect(() => {
    const doGetArea = async () => {
      try {
        const token = isAuthenticated
          ? await getAccessTokenSilently()
          : "";
        const area = await areas.getArea(areaSlug, token);
        setArea(area);
      } catch (error) {
        console.error("Error loading area", error);
        popupError("Oh dear, there was a problem loading this area");
      }
    };

    const doGetTopo = async () => {
      const topo = await topos.getTopo(topoSlug);
      setBackgroundImageURL(`${topo.image}`);
    }

    doGetArea();
    doGetTopo();
  }, [areaSlug, isAuthenticated, topoSlug]);

  const getGradesFromGradingSystem = (gradingSystemId: string): [string, number][] => {
    const grades = gradingSystems.find(({ id }) => `${id}` === gradingSystemId)?.grades;
    const gradesTitleValueMap = (grades || [])?.reduce((acc, cur, idx) => {
      acc.set(cur, idx);
      return acc;
    }, new Map());

    return Array.from(gradesTitleValueMap);
  }

  const onDrawingChanged = (drawing: RouteDrawing) => {
    setValue("drawing", JSON.stringify(drawing));
  }

  const formOnSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);

      if (!area) {
        throw new Error("Error creating route, area not found");
      }

      const token = await getAccessTokenSilently();
      const { routeSlug } = await routes.createRoute(
        {
          ...formData,
          rating: -1,
        },
        token
      );
      await popupSuccess("Route Created!");
      history.push(`/crags/${cragSlug}/areas/${areaSlug}#${routeSlug}`);
    } catch (error) {
      console.error('Error creating crag', error);
      popupError("Ahh, something has gone wrong...");
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <section className="section">
        <div className="container">
          <TopoCanvas
            routes={ area?.routes?.filter(route => route.topoSlug === topoSlug) }
            backgroundImageURL={ backgroundImageURL }
            onDrawingChanged={ onDrawingChanged }
          />
        </div>
      </section>
      <section className="section">
        <div className="container box">
          <form
            onSubmit={ formOnSubmit }
            style={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
            <input
              className="is-hidden"
              name="topoSlug"
              defaultValue={ topoSlug }
              ref={ register }
            />
            <input
              className="is-hidden"
              name="drawing"
              ref={ register }
            />
            <div className="field">
              <label className="label" htmlFor="title">Title</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="title"
                  ref={ register }
                />
              </div>
              <p className="help is-danger">{ errors.title?.message }</p>
            </div>

            <div className="field">
              <label className="label" htmlFor="description">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="description"
                  ref={ register }
                ></textarea> 
              </div>
              <p className="help is-danger">{ errors.description?.message }</p>
            </div>

            <div className="field">
              <label className="label">Tags</label>
              <div className="field is-grouped is-grouped-multiline">
                <div role="group" className="tags">
                  {routeTags.map(tag => (
                    <label
                      key={ tag.id }
                      className={`
                        tag
                        is-capitalized
                        ${watchTags.includes(`${tag.id}`) ? "is-primary" : ""}
                      `}
                    >
                      <input
                        type="checkbox"
                        name="tags"
                        value={ tag.id }
                        ref={ register() }
                        style={{ display: "none" }}
                      />
                      { tag.title }
                    </label>
                  ))} 
                </div>
              </div>
              <p className="help is-danger">{ (errors.tags as any)?.message }</p>
            </div>

            <div className="field">
              <label className="label">Route Type</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select name="routeTypeId" ref={ register }>
                    {routeTypes.map((routeType) => (
                      <option key={ routeType.id } value={ routeType.id }>{ routeType.title }</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="help is-danger">{ errors.routeTypeId?.message }</p>
            </div>

            <div className="field">
              <label className="label">Grading System</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select name="gradingSystemId" ref={ register }>
                    {gradingSystems.map((gradingSystem) => (
                      <option key={ gradingSystem.title } value={ gradingSystem.id }>{ gradingSystem.title }</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="help is-danger">{ errors.gradingSystemId?.message }</p>
            </div>

            <div className="field">
              <label className="label">Grade</label>
              <div className="contro is-expandedl">
                <div className="select is-fullwidth">
                  <select name="gradeIndex" ref={ register }>
                    {watchGradingSystem
                      && getGradesFromGradingSystem(getValues("gradingSystemId"))?.map(grade => (
                        <option key={ grade[1] } value={ grade[1] }>{ grade[0] }</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <p className="help is-danger">{ errors.gradeIndex?.message }</p>
            </div>

            <div className="field">
              <div className="field is-flex is-justified-end">
                <div className="control">
                  <button
                    className={ `button is-primary ${ loading ? "is-loading" : "" }` }
                  >
                    Create Route
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default CreateRoute;
