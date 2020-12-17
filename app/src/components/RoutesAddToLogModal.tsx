import React, { useEffect, useState } from "react";
import {useForm} from "react-hook-form";

import { GradingSystem, Route } from "../../../core/types";
import { globals } from "../api";
import Modal from "./Modal";

interface Props {
  routes: Route[];
  visible: boolean;
}

function RoutesAddToLogModal({ routes, visible }: Props) {
  const [routeTags, setRouteTags] = useState<string[]>([]);
  const [gradingSystems, setGradingSystems] = useState<GradingSystem[]>([]);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    getGlobals();
  }, []);

  async function getGlobals() {
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

  function btnLogRoutesConfirmOnClick() {
  }

  function btnLogRoutesCancelOnClick() {
  }

  return (
    <Modal
      btnCancelOnClick={ btnLogRoutesCancelOnClick }
      btnConfirmOnClick={ btnLogRoutesConfirmOnClick }
      btnConfirmText="Save to Tick List"
      title="Add Routes to Tick List"
      visible={ visible }
    >
      {routes && routes.map((route, index) => (
        <div className="log-route-review-dropdown">
          <input
            id={ `chkRoute${route.slug}` }
            type="radio"
            name="showLogRouteDetails"
            checked={ index === 0 ? true: false }
          />
          <label htmlFor={ `chkRoute${route.slug}` } className="label is-capitalized">
            { route.title }
            {routes.length > 1 && (
              <>
                <i className="far fas fa-chevron-up checked"></i>
                <i className="far fas fa-chevron-down not-checked"></i>
              </>
            )}
          </label>
          <div>
            <div className="field is-grouped">
              <div className="control">
                <div className="field">
                  <label className="label">Date Sent</label>
                  <div className="control">
                    <input
                      className="input"
                      type="date"
                      name={`routes.[${index}].dateSent`}
                      ref={ register }
                    />
                  </div>
                </div>
              </div>
              <div className="control">
                <div className="field">
                  <label className="label">Grade</label>
                  <div className="control">
                    <div className="select">
                      <select name={`routes[${index}].gradeTaken`} ref={ register }>
                        {getGradesFromGradingSystem(route!.gradingSystem)!.map((grade) => (
                          <option value={ grade }>
                            { grade }
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <div className="field">
                  <label className="label">Stars</label>
                  <div className="control">
                    <div className="select">
                      <select name={`routes[${index}].stars`} ref={ register }>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="control">
                <div className="field">
                  <label className="label">Attempts</label>
                  <div className="control">
                    <div className="select">
                      <select name={ `routes[${index}].attempts` } ref={ register }>
                        <option value="0">Flash</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3+</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Comments</label>
              <div className="control">
                <textarea
                  className="textarea"
                  name={ `routes[${index}].comment` }
                  ref={ register } 
                ></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label">Tags</label>
              <div className="field is-grouped is-grouped-multiline">
                <div role="group" className="tags">
                  {routeTags.map(tag => (
                    <label
                      key={ tag }
                      className={`tag`}
                    >
                      <input
                        type="checkbox"
                        name={ `routes[${index}].tags` }
                        value={ tag }
                        ref={ register }
                        style={{ display: "none" }}
                      />
                      { tag }
                    </label>
                  ))} 
                </div>
              </div>
              <p className="help is-danger"></p>
            </div>
          </div>
        </div>
      ))}
    </Modal>
  );
}

export default RoutesAddToLogModal;
