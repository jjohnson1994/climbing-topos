import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { globals, routes, topos } from "../../api";
import { popupError, popupSuccess } from "../../helpers/alerts";
import { GradingSystem } from "../../../../core/types";

import TopoCanvas from "../../components/TopoCanvas";

const schema = yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  tags: yup.array().min(1, "Select at least 1").of(
    yup.string()
  ),
  routeType: yup.string().required("Required"),
  gradingSystem: yup.string().required("Required"),
  grade: yup.string().required("Required"),
});

function CreateRoute() {
  const history = useHistory();
  const { areaSlug, cragSlug, topoSlug } = useParams<{ areaSlug: string; cragSlug: string, topoSlug: string }>();
  const [routeTags, setRouteTags] = useState<string[]>([]);
  const [routeTypes, setRouteTypes] = useState<string[]>([]);
  const [gradingSystems, setGradingSystems] = useState<GradingSystem[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [backgroundImageURL, setBackgroundImageURL] = useState("");
  const [drawing, setDrawing] = useState({});

  const { register, getValues, handleSubmit, errors, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: "",
      description: "",
      tags: [] as string[],
      routeType: "",
      gradingSystem: "",
      grade: ""
    }
  });

  const watchTags = watch("tags", []);
  const watchGradingSystem = watch("gradingSystem", "");

  useEffect(() => {
    const doGetTopo = async () => {
      const topo = await topos.getTopo(topoSlug);
      setBackgroundImageURL(`${topo.image}`);
    }

    doGetTopo();
    doGetTags();
    doGetRouteTypes();
    doGetGradingSystem();
  }, [topoSlug]);

  const doGetTags = async () => {
    const routeTags = await globals.getRouteTags();
    setRouteTags(routeTags);
  }

  const doGetRouteTypes = async () => {
    const routeTypes = await globals.getRouteTypes();
    setRouteTypes(routeTypes);
  }

  const doGetGradingSystem = async () => {
    const gradingSystem = await globals.getGradingSystems();
    setGradingSystems(gradingSystem);
  }

  const getGradesFromGradingSystem = (gradingSystem: string) => {
    const grades = gradingSystems?.find(_gradingSystem => _gradingSystem.title === gradingSystem)?.grades;
    return grades;
  }

  const onDrawingChanged = (drawing: object) => {
    setDrawing(drawing);
    console.log(drawing);
  }

  const formOnSubmit = handleSubmit(async (formData) => {
    try {
      const { routeSlug } = await routes.createRoute({
        ...formData,
        drawing,
        cragSlug,
        areaSlug,
        topoSlug
      });
      await popupSuccess("Route Created!");
      history.push(`/crags/${cragSlug}/areas/${areaSlug}#${routeSlug}`);
    } catch (error) {
      console.error('Error creating crag', error);
      popupError("Ahh, something has gone wrong...");
    }
  });

  return (
    <>
      <section className="section">
        <div className="container">
          <TopoCanvas backgroundImageURL={ backgroundImageURL } onDrawingChanged={ onDrawingChanged } />
        </div>
      </section>
      <section className="section">
        <div className="container box">
          <form
            onSubmit={ formOnSubmit }
            style={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
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
                      key={ tag }
                      className={`
                        tag
                        ${watchTags?.includes(tag) ? "is-primary" : ""}
                      `}
                    >
                      <input type="checkbox" name="tags" value={ tag } ref={ register } style={{ display: "none" }} />
                      { tag }
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
                  <select name="routeType" ref={ register }>
                    {routeTypes.map((routeType) => (
                      <option key={ routeType } value={ routeType }>{ routeType }</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="help is-danger">{ errors.routeType?.message }</p>
            </div>

            <div className="field">
              <label className="label">Grading System</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select name="gradingSystem" ref={ register }>
                    {gradingSystems.map((gradingSystem) => (
                      <option key={ gradingSystem.title } value={ gradingSystem.title }>{ gradingSystem.title }</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="help is-danger">{ errors.gradingSystem?.message }</p>
            </div>

            <div className="field">
              <label className="label">Grade</label>
              <div className="contro is-expandedl">
                <div className="select is-fullwidth">
                  <select name="grade" ref={ register }>
                    {watchGradingSystem && getGradesFromGradingSystem(getValues("gradingSystem"))?.map((grade) => (
                      <option key={ grade } value={ grade }>{ grade }</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="help is-danger">{ errors.grade?.message }</p>
            </div>

            <div className="field">
              <div className="field is-flex is-justified-end">
                <div className="control">
                  <button className="button is-primary">Create Route</button>
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
