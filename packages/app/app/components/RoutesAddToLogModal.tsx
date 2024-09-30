import { yupResolver } from "@hookform/resolvers/yup";
import { NewLogsSchema } from "@climbingtopos/schemas";
import { GradingSystem, LogRequest, Route } from "core/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { globals, logs } from "../api";
import { popupError, toastSuccess } from "../helpers/alerts";
import Modal from "./Modal";
import "./RoutesAddToLogModal.css";

interface Props {
  routes: Route[];
  visible: boolean;
  onCancel?: Function;
  onConfirm?: Function;
  onRoutesLogged?: Function;
}

const schema = NewLogsSchema();

function RoutesAddToLogModal({
  routes,
  visible,
  onCancel,
  onConfirm,
  onRoutesLogged,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [routeTags, setRouteTags] = useState<string[]>([]);
  const [gradingSystems, setGradingSystems] = useState<GradingSystem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const watchFormFields = watch();

  useEffect(() => {
    getGlobals();
  }, []);

  const getGlobals = async () => {
    try {
      const newRouteTags = await globals.getRouteTags();
      const newGradingSystem = await globals.getGradingSystems();

      setRouteTags(newRouteTags);
      setGradingSystems(newGradingSystem);
    } catch (error) {
      console.error("Error loading route tags", error);
    }
  };

  const getGradeOptions = (gradingSystemTitle: string) => {
    const gradingSystem = gradingSystems.find(
      ({ title }) => title === gradingSystemTitle
    );

    if (!gradingSystem) {
      throw new Error(
        `Error, could not find grading system matching ${gradingSystemTitle}`
      );
    }

    const grades = gradingSystem.grades;
    return grades;
  };

  const btnLogRoutesConfirmOnClick = handleSubmit(async (data) => {
    setLoading(true)

    try {
      await logRoutes(data.logs as LogRequest[]);

      if (onRoutesLogged) {
        onRoutesLogged();
      }
    } catch (error) {
      console.error('Error logging routes', error)
    } finally {
      setLoading(false)
    }
  });

  const btnLogRoutesCancelOnClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const logRoutes = async (routes: LogRequest[]) => {
    try {
      await logs.logRoutes(routes);
      toastSuccess("Routes Logged");

      if (onConfirm) {
        onConfirm();
      }
    } catch (error) {
      console.error("Error logging routes", error);
      popupError(
        "Ah, there's been an error and your climbs could not be logged"
      );
    }
  };

  return (
    <Modal
      btnCancelOnClick={btnLogRoutesCancelOnClick}
      btnConfirmOnClick={btnLogRoutesConfirmOnClick}
      btnConfirmText="Save to Log Book"
      title="Add Routes to Log Book"
      visible={visible}
      confirmActionLoading={loading}
    >
      <form>
        {routes &&
          routes.map((route, index) => (
            <div className="log-route-review-dropdown" key={route.slug} data-testid={`formSection-${route.slug}`}>
              <input
                id={`chkRoute${route.slug}`}
                type="radio"
                name="showLogRouteDetails"
                defaultChecked={index === 0 ? true : false}
              />
              <label
                htmlFor={`chkRoute${route.slug}`}
                className="label is-capitalized"
              >
                <span>{route.title}</span>
                <span className="has-text-danger">
                  {errors.logs?.[index] ? " Has Errors! " : ""}
                </span>
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
                  {...register(`logs.[${index}].cragSlug`)}
                  defaultValue={route.cragSlug}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].areaSlug`)}
                  defaultValue={route.areaSlug}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].areaTitle`)}
                  defaultValue={route.areaTitle}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].country`)}
                  defaultValue={route.country}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].countryCode`)}
                  defaultValue={route.country}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].county`)}
                  defaultValue={route.country}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].cragTitle`)}
                  defaultValue={route.cragTitle}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].grade`)}
                  defaultValue={route.grade}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].gradeModal`)}
                  defaultValue={route.gradeModal}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].gradingSystem`)}
                  defaultValue={route.gradingSystem}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].rockType`)}
                  defaultValue={route.rockType}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].routeSlug`)}
                  defaultValue={route.slug}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].routeTitle`)}
                  defaultValue={route.title}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].routeType`)}
                  defaultValue={route.routeType}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].state`)}
                  defaultValue={route.state}
                  className="is-hidden"
                />
                <input
                  type="text"
                  {...register(`logs.[${index}].topoSlug`)}
                  defaultValue={route.topoSlug}
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
                          {...register(`logs.[${index}].dateSent`)}
                          defaultValue={new Date().toISOString().substr(0, 10)}
                        />
                      </div>
                      <p className="help is-danger">
                        {errors.logs?.[index]?.dateSent?.message}
                      </p>
                    </div>
                  </div>
                  <div className="control">
                    <div className="field">
                      <label className="label">Grade</label>
                      <div className="control">
                        <div className="select">
                          <select
                            {...register(`logs.[${index}].gradeTaken`)}
                            defaultValue={route.gradeModal}
                          >
                            {getGradeOptions(route.gradingSystem).map(
                              (grade, index) => (
                                <option value={index} key={grade}>
                                  {grade}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                      <p className="help is-danger">
                        {errors.logs?.[index]?.gradeTaken?.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <div className="field">
                      <label className="label">Rating</label>
                      <div className="control">
                        <div className="select">
                          <select {...register(`logs.[${index}].rating`)}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>
                      <p className="help is-danger">
                        {errors.logs?.[index]?.rating?.message}
                      </p>
                    </div>
                  </div>
                  <div className="control">
                    <div className="field">
                      <label className="label">Attempts</label>
                      <div className="control">
                        <div className="select">
                          <select
                            {...register(`logs.[${index}].attempts`)}
                          >
                            <option value="0">Flash</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                          </select>
                        </div>
                      </div>
                      <p className="help is-danger">
                        {errors.logs?.[index]?.attempts?.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Comments</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      {...register(`logs.[${index}].comment`)}
                    ></textarea>
                  </div>
                  <p className="help is-danger">
                    {errors.logs?.[index]?.comment?.message}
                  </p>
                </div>
                <div className="field">
                  <label className="label">Tags</label>
                  <div className="field is-grouped is-grouped-multiline">
                    <div role="group" className="tags">
                      {routeTags.map((tag) => (
                        <label
                          key={tag}
                          className={`
                          tag
                          ${watchFormFields?.logs?.[index]?.tags?.includes?.(tag)
                              ? "is-primary"
                              : ""
                            }
                        `}
                        >
                          <input
                            type="checkbox"
                            {...register(`logs.[${index}].tags`)}
                            value={tag}
                            style={{ display: "none" }}
                          />
                          {tag}
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="help is-danger">
                    {errors.logs?.[index]?.tags?.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </form>
    </Modal>
  );
}

export default RoutesAddToLogModal;
