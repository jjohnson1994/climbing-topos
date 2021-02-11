import { useAuth0 } from "@auth0/auth0-react";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm} from "react-hook-form";
import * as yup from "yup";
import { LogRequest, Route } from "core/types";
import { NewLogsSchema } from "core/schemas";
import { logs } from "../api";
import { popupError, toastSuccess } from "../helpers/alerts";
import Modal from "./Modal";
import "./RoutesAddToLogModal.css";
import { useUserPreferences } from "../api/profile";
import { useGlobals } from "../api/globals";

interface Props {
  routes: Route[];
  visible: boolean;
  onCancel?: Function;
  onConfirm?: Function;
  onRoutesLogged?: Function
}

const schema = NewLogsSchema(yup);

function RoutesAddToLogModal({ routes, visible, onCancel, onConfirm, onRoutesLogged }: Props) {
  const { getAccessTokenSilently } = useAuth0();
  const { routeTags, gradingSystems } = useGlobals();
  const { convertGradeToUserPreference, preferedGradingSystems } = useUserPreferences();

  const { register,  handleSubmit, errors, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const watchLogs = watch("logs", []);

  const getGradesFromGradingSystem = (gradingSystemId: string): [string, number][] => {
    const grades = gradingSystems.find(({ id }) => id === gradingSystemId)?.grades;
    const gradesTitleValueMap = (grades || [])?.reduce((acc, cur, idx) => {
      acc.set(cur, idx);
      return acc;
    }, new Map());

    return Array.from(gradesTitleValueMap);
  }

  const btnLogRoutesConfirmOnClick = handleSubmit(async data => {
    await logRoutes(data.logs as LogRequest[]);

    if (onRoutesLogged) {
      onRoutesLogged();
    }
  });

  const btnLogRoutesCancelOnClick = () => {
    if (onCancel) {
      onCancel();
    }
  }

  const logRoutes = async (routes: LogRequest[]) => {
    try {
      const token = await getAccessTokenSilently();
      await logs.logRoutes(routes, token);
      toastSuccess("Routes Logged");

      if (onConfirm) {
        onConfirm();
      }
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
              {routes.length > 1 && (
                <>
                  <i className="far fas fa-chevron-up checked mr-2"></i>
                  <i className="far fas fa-chevron-down not-checked mr-2"></i>
                </>
              )}
              <span>{ route.title }</span>
              <span className="has-text-danger">{ errors.logs?.[index] ? " Has Errors! " : "" }</span>
            </label>
            <div>
              <input
                type="text"
                name={ `logs.[${index}].routeSlug` }
                ref={ register({}) }
                defaultValue={ route.slug }
                className="is-hidden"
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
                        <select
                          name={ `logs.[${index}].gradeTaken` }
                          defaultValue={ route.gradeIndex }
                          ref={ register({}) }
                        >
                          {getGradesFromGradingSystem(route!.routeTypeId)?.map(grade => (
                            <option value={ grade[1] } key={ grade[1] }>
                              { grade[0] }
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
                        key={ tag.id }
                        className={`
                          tag
                          is-capitalized
                          ${watchLogs[index]?.tags?.includes(`${tag.id}`) ? "is-primary" : ""}
                        `}
                      >
                        <input
                          type="checkbox"
                          name={ `logs.[${index}].tags` }
                          value={ tag.id }
                          ref={ register() }
                          style={{ display: "none" }}
                        />
                        { tag.title }
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
