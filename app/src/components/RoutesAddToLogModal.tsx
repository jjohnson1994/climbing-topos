import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { GradingSystem, Route, LogRequest } from "../../../core/types";
import { popupError, toastSuccess } from "../helpers/alerts";
import { globals, logs } from "../api";
import Modal from "./Modal";
import "./RoutesAddToLogModal.css";

interface Props {
  routes: Route[];
  visible: boolean;
  onCancel?: Function;
  onConfirm?: Function;
}

const schema = yup.object().shape({
  logs: yup.array().of(
    yup.object().shape({
      areaSlug: yup.string(),
      attempts: yup.string().required("Required"),
      comment: yup.string(),
      cragSlug: yup.string(),
      dateSent: yup.string().required("Required"),
      grade: yup.string(),
      gradeTaken: yup.string().required("Required"),
      gradingSystem: yup.string(),
      routeSlug: yup.string(),
      routeTitle: yup.string(),
      routeType: yup.string(),
      stars: yup.string(),
      tags: yup.array().min(1, "Select at least 1").of(
        yup.string()
      ),
    })
  )
});

function RoutesAddToLogModal({ routes, visible, onCancel, onConfirm }: Props) {
  const [routeTags, setRouteTags] = useState<string[]>([]);
  const [gradingSystems, setGradingSystems] = useState<GradingSystem[]>([]);

  const { register,  handleSubmit, errors, getValues, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const watchLogs = watch("logs", []);

  useEffect(() => {
    getGlobals();
  }, []);

  const getGlobals = async () => {
    try {
      const _routeTags = await globals.getRouteTags();
      const _gradingSystem = await globals.getGradingSystems();

      setRouteTags(_routeTags);
      setGradingSystems(_gradingSystem);
    } catch (error) {
      console.error("Error loading route tags", error);
    }
  }

  const getGradesFromGradingSystem = (gradingSystem: string) => {
    const grades = gradingSystems?.find(_gradingSystem => _gradingSystem.title === gradingSystem)?.grades;
    return grades;
  }

  const btnLogRoutesConfirmOnClick = () => {
    handleSubmit(
      data => {
        logRoutes(data.logs as LogRequest[]);
      }
    )();
  }

  const btnLogRoutesCancelOnClick = () => {
    if (onCancel) {
      onCancel();
    }
  }

  const logRoutes = async (routes: LogRequest[]) => {
    try {
      await logs.logRoutes(routes);
      toastSuccess("Routes Logged");
      onConfirm && onConfirm();
    } catch (error) {
      console.error("Error logging routes", error);
      popupError("Ah, there's been an error and those climbs could not be logged");
    }
  }

  return (
    <Modal
      btnCancelOnClick={ btnLogRoutesCancelOnClick }
      btnConfirmOnClick={ btnLogRoutesConfirmOnClick }
      btnConfirmText="Save to Log Book"
      title="Add Routes to Log Book"
      visible={ visible }
    >
      <form>
        {routes && routes.map((route, index) => (
          <div className="log-route-review-dropdown" key={ route.slug }>
            <input
              id={ `chkRoute${route.slug}` }
              type="radio"
              name="showLogRouteDetails"
              defaultChecked={ index === 0 ? true: false }
            />
            <label htmlFor={ `chkRoute${route.slug}` } className="label is-capitalized">
              <span>{ route.title }</span>
              <span className="has-text-danger">{ errors.logs?.[index] ? " Has Errors! " : "" }</span>
              {routes.length > 1 && (
                <>
                  <i className="far fas fa-chevron-up checked"></i>
                  <i className="far fas fa-chevron-down not-checked"></i>
                </>
              )}
            </label>
            <div>
              <input
                type="text"
                name={ `logs.[${index}].areaSlug` }
                ref={ register({}) }
                defaultValue={ route.areaSlug }
                style={{ display: "none" }}
              />
              <input
                type="text"
                name={ `logs.[${index}].cragSlug` }
                ref={ register({}) }
                defaultValue={ route.cragSlug }
                style={{ display: "none" }}
              />
              <input
                type="text"
                name={ `logs.[${index}].grade` }
                ref={ register({}) }
                defaultValue={ route.grade }
                style={{ display: "none" }}
              />
              <input
                type="text"
                name={ `logs.[${index}].gradingSystem` }
                ref={ register({}) }
                defaultValue={ route.gradingSystem }
                style={{ display: "none" }}
              />
              <input
                type="text"
                name={ `logs.[${index}].routeSlug` }
                ref={ register({}) }
                defaultValue={ route.slug }
                style={{ display: "none" }}
              />
              <input
                type="text"
                name={ `logs.[${index}].routeTitle` }
                ref={ register({}) }
                defaultValue={ route.title }
                style={{ display: "none" }}
              />
              <input
                type="text"
                name={ `logs.[${index}].routeType` }
                ref={ register({}) }
                defaultValue={ route.routeType }
                style={{ display: "none" }}
              />
              <div className="field is-grouped">
                <div className="control">
                  <div className="field">
                    <label className="label">Date Sent</label>
                    <div className="control">
                      <input
                        className="input"
                        type="date"
                        name={`logs.[${index}].dateSent`}
                        ref={register({})}
                        defaultValue={ new Date().toISOString().substr(0, 10) }
                      />
                    </div>
                    <p className="help is-danger">{ errors.logs?.[index]?.dateSent?.message }</p>
                  </div>
                </div>
                <div className="control">
                  <div className="field">
                    <label className="label">Grade</label>
                    <div className="control">
                      <div className="select">
                        <select name={`logs.[${index}].gradeTaken`} ref={register({})}>
                          {getGradesFromGradingSystem(route!.gradingSystem)!.map((grade) => (
                            <option value={ grade } key={ grade }>
                              { grade }
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p className="help is-danger">{ errors.logs?.[index]?.gradeTaken?.message }</p>
                  </div>
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <div className="field">
                    <label className="label">Stars</label>
                    <div className="control">
                      <div className="select">
                        <select name={`logs.[${index}].stars`} ref={register({})}>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>
                    <p className="help is-danger">{ errors.logs?.[index]?.stars?.message }</p>
                  </div>
                </div>
                <div className="control">
                  <div className="field">
                    <label className="label">Attempts</label>
                    <div className="control">
                      <div className="select">
                        <select name={ `logs.[${index}].attempts` } ref={register({})}>
                          <option value="0">Flash</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3+</option>
                        </select>
                      </div>
                    </div>
                    <p className="help is-danger">{ errors.logs?.[index]?.attempts?.message }</p>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Comments</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    name={ `logs.[${index}].comment` }
                    ref={register({})} 
                  ></textarea>
                </div>
                <p className="help is-danger">{ errors.logs?.[index]?.comment?.message }</p>
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
                          ${watchLogs[index]?.tags?.includes(tag) ? "is-primary" : ""}
                        `}
                      >
                        <input
                          type="checkbox"
                          name={ `logs.[${index}].tags` }
                          value={ tag }
                          ref={register({})}
                          style={{ display: "none" }}
                        />
                        { tag }
                      </label>
                    ))} 
                  </div>
                </div>
                <p className="help is-danger">{ errors.logs?.[index]?.tags?.message }</p>
              </div>
            </div>
          </div>
        ))}
      </form>
    </Modal>
  );
}

export default RoutesAddToLogModal;
