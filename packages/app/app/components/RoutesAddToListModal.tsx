import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { List, Route } from "core/types";
import { lists } from "../api";
import { popupError, toastSuccess } from "../helpers/alerts";
import Modal from "./Modal";
import "./RoutesAddToLogModal.css";
import { yup } from "@climbingtopos/schemas";
import { log } from "console";

interface Props {
  routes: Route[];
  visible: boolean;
  onCancel: Function;
  onConfirm: Function;
}

function RoutesAddToListModal({ routes, visible, onCancel, onConfirm }: Props) {
  const [userLists, setUserLists] = useState<List[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        newOrExisting: yup
          .string()
          .required("Required")
          .oneOf(["new", "existing"]),
        title: yup.string().when("newOrExisting", (newOrExisting: string) => {
          if (newOrExisting === "new") {
            return yup.string().required("Required");
          } else {
            return yup.string();
          }
        }),
        listSlug: yup
          .string()
          .when("newOrExisting", (newOrExisting: string) => {
            if (newOrExisting === "existing") {
              return yup.string().required("Required");
            } else {
              return yup.string();
            }
          }),
        routes: yup.array().of(yup.string()),
      })
    ),
    mode: "onChange",
    defaultValues: {
      newOrExisting: "existing",
      title: "",
      listSlug: "",
      routes: "",
    },
  });

  const watchNewOrExisting = watch("newOrExisting");

  useEffect(() => {
    getUserLists();
  }, []);

  const getUserLists = async () => {
    try {
      const newUserLists = await lists.getLists();
      setUserLists(newUserLists);
    } catch (error) {
      console.error("Error getting user lists", error);
    }
  };

  const createNewList = async (title: string) => {
    try {
      const { slug } = await lists.addList(title);

      return slug;
    } catch (error) {
      console.error("Error creating new list", error);
      popupError("There was an error creating your new list, try again");
      throw error;
    }
  };

  const addRoutesToList = async (listSlug: string) => {
    try {
      await lists.addRoutesToList(
        listSlug,
        routes.map((route) => ({
          cragSlug: route.cragSlug,
          areaSlug: route.areaSlug,
          topoSlug: route.topoSlug,
          routeSlug: route.slug,
        }))
      );
    } catch (error) {
      console.error("Error creating new list", error);
      popupError("There was an error adding routes to your list, try again");
      throw error;
    }
  };

  const btnSaveToListConfirmOnClick = handleSubmit(async (data) => {
  
    try {
      const listSlug =
        data.newOrExisting === "new"
          ? await createNewList(data.title)
          : data.listSlug;

      getUserLists();
      setValue("newOrExisting", "existing");
      setValue("listSlug", listSlug);

      await addRoutesToList(listSlug);

      toastSuccess("Routes Saved to List");
      onConfirm();
    } catch (error) {
      console.error("Error saving routes to list", error);
    }
  });

  const btnSaveToListCancelOnClick = () => {
    onCancel();
  };

  return (
    <Modal
      btnCancelOnClick={btnSaveToListCancelOnClick}
      btnConfirmOnClick={btnSaveToListConfirmOnClick}
      btnConfirmText="Save to List"
      title="Save Routes to List"
      visible={visible}
    >
      <form>
        <div className="field">
          <label className="label">Save to</label>
          <div className="control">
            <label className="radio">
              <input
                type="radio"
                value="existing"
                {...register("newOrExisting")}
              />
              Existing List
            </label>
            <label className="radio">
              <input
                type="radio"
                value="new"
                {...register("newOrExisting")}
                placeholder="e.g. 'Projects' or 'Font 2021'"
              />
              New List
            </label>
          </div>
        </div>

        {watchNewOrExisting === "existing" && (
          <div className="field">
            <label className="label">List</label>
            <div className="control is-expanded">
              <div className="select is-fullwidth">
                <select {...register("listSlug")}>
                  {userLists.map((list) => (
                    <option key={list.slug} value={list.slug}>
                      {list.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="help is-danger">{errors.listSlug?.message}</p>
          </div>
        )}

        {watchNewOrExisting === "new" && (
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input type="text" className="input" {...register("title")} />
            </div>
            <p className="help is-danger">{errors.title?.message}</p>
          </div>
        )}

        <input
          type="text"
          className="input is-hidden"
          {...register("routes")}
          defaultValue={JSON.stringify(routes)}
        />
      </form>
    </Modal>
  );
}

export default RoutesAddToListModal;
