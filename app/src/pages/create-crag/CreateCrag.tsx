import { yupResolver } from "@hookform/resolvers/yup";
import { NewCragSchema } from "core/schemas";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { crags, globals } from "../../api";
import Message, { Color } from "../../components/Message";
import { popupError, popupSuccess } from "../../helpers/alerts";
import { getCurrentPosition } from "../../helpers/geolocation";
import { reverseLookup } from "../../helpers/nominatim";

const schema = NewCragSchema();

let image: File;

function CreateCrag() {
  const history = useHistory();
  const [carParkLocationLoadingIndex, setCarParkLocationLoadingIndex] =
    useState(-1);
  const [cragTags, setCragTags] = useState<string[]>([]);
  const [cragLocationLoading, setCragLocationLoading] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      access: "unknown",
      accessDetails: "",
      accessLink: "",
      approachNotes: "",
      carParks: [
        {
          title: "",
          latitude: "",
          longitude: "",
          description: "",
        },
      ],
      description: "",
      latitude: "",
      longitude: "",
      tags: [] as string[],
      title: "",
      imageFileName: "",
      acceptTerms: false,
    },
  });

  const watchImageFileName = watch("imageFileName");

  async function onImageSelected() {
    const files = (
      document.querySelector("input[type=file]") as HTMLInputElement
    ).files;

    if (files) {
      const file = files.item(0);
      const imagePreviewUrl = URL.createObjectURL(file);
      image = file as File;
      setValue("imageFileName", file?.name ?? 'Unnamed File');
      setImagePreview(imagePreviewUrl);
    } else {
      setValue("imageFileName", "");
    }
  }

  const {
    fields: carParks,
    append: appendCarPark,
    remove: removeCarPark,
    insert: insertCarPark,
  } = useFieldArray({
    control,
    name: "carParks",
  });

  const watchAllFields = watch();

  useEffect(() => {
    doGetTags();
  }, []);

  const doGetTags = async () => {
    const cragTags = await globals.getCragTags();
    setCragTags(cragTags);
  };

  const btnCragLocationFindMeOnClick = async () => {
    setCragLocationLoading(true);

    try {
      const location = await getCurrentPosition();
      setValue("latitude", `${location.coords.latitude}`);
      setValue("longitude", `${location.coords.longitude}`);
    } catch (error) {
      console.error("Error loading user location", error);
    } finally {
      setCragLocationLoading(false);
    }
  };

  const getCragNominatim = async (latitude: string, longitude: string) => {
    const osmData = await reverseLookup(latitude, longitude);
    return osmData;
  };

  const btnAddCarParkOnClick = () => {
    appendCarPark({
      title: "",
      latitude: "",
      longitude: "",
    });
  };

  const btnRemoveCarParkOnClick = (index: number) => {
    removeCarPark(index);
  };

  const btnCarParkFindMeOnClick = async (index: number) => {
    setCarParkLocationLoadingIndex(index);
    const location = await getCurrentPosition();
    const newCarPark = {
      ...carParks[index],
      latitude: `${location.coords.latitude}`,
      longitude: `${location.coords.longitude}`,
    };

    removeCarPark(index);
    insertCarPark(index, newCarPark);

    setCarParkLocationLoadingIndex(-1);
  };

  const formOnSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      const osmData = await getCragNominatim(
        formData.latitude,
        formData.longitude
      );
      const { slug } = await crags.createCrag(
        { ...formData, osmData, image },
      );
      await popupSuccess("Crag Created!");
      history.push(`/crags/${slug}`);
    } catch (error) {
      console.error("Error creating crag", error);

      if (error.error === "Unable to geocode") {
        popupError(
          "Could not find geolocation data! Check the Crag location coordinates are correct and try again"
        );
      } else {
        popupError("Ahh, something has gone wrong...");
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className="section">
      <div className="container box">
        <form
          onSubmit={formOnSubmit}
          style={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <input
            type="text"
            { ...register("imageFileName") }
            className="is-hidden"
          />

          <Message color={Color.isWarning} header="Terms & Conditions">
            <p>
              By creating a crag you agree to become the crag maintainer. That means you're in charge of approving new routes and keeping everything up to date. Please respect any access restrictions!
            </p>
            <br />
            <div className="is-flex">
              <div className="is-flex is-flex-direction-column is-align-items-flex-end">
                <label className="checkbox">
                  <input type="checkbox" { ...register("acceptTerms") } />
                  <span className="ml-2">Agree</span>
                </label>
                <p className="help is-danger">{errors.acceptTerms?.message}</p>
              </div>
            </div>
          </Message>

          <div className="field">
            <label className="label" htmlFor="title">
              Title
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                { ...register("title") }
              />
            </div>
            <p className="help is-danger">{errors.title?.message}</p>
          </div>

          <div className="field">
            <label className="label">Title Image</label>
            <div className="control">
              <div className="file has-name">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/*"
                    onChange={onImageSelected}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">Choose a file…</span>
                  </span>
                  <span className="file-name">{watchImageFileName}</span>
                </label>
              </div>
            </div>
            <p className="help is-danger">{errors.imageFileName?.message}</p>
          </div>

          {imagePreview && (
            <div className="field">
              <div className="control">
                <figure className="image">
                  <img src={imagePreview} alt="crag preview" />
                </figure>
              </div>
            </div>
          )}

          <div className="field">
            <label className="label" htmlFor="description">
              Description
            </label>
            <div className="control">
              <textarea
                className="textarea"
                { ...register("description") }
              ></textarea>
            </div>
            <p className="help is-danger">{errors.description?.message}</p>
          </div>

          <div className="field">
            <label className="label" htmlFor="approachNotes">
              Approach Notes
            </label>
            <div className="control">
              <textarea
                id="approachNotes"
                className="textarea"
                { ...register("approachNotes") }
              ></textarea>
            </div>
            <p className="help is-danger">{errors.approachNotes?.message}</p>
          </div>

          <div className="field">
            <label className="label">Tags</label>
            <div className="field is-grouped is-grouped-multiline">
              <div role="group" className="tags">
                {cragTags.map((tag) => (
                  <label
                    key={tag}
                    className={`
                      tag
                      ${watchAllFields?.tags?.includes?.(tag) ? "is-primary" : ""}
                    `}
                  >
                    <input
                      type="checkbox"
                      value={tag}
                      { ...register("tags") }
                      style={{ display: "none" }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
            <p className="help is-danger">{(errors.tags as any)?.message}</p>
          </div>

          <div className="field">
            <div className="field">
              <label className="label">Crag Location</label>
              <div className="field has-addons">
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={cragLocationLoading}
                    className="input"
                    type="text"
                    placeholder="Latitude"
                    { ...register("latitude") }
                  />
                </div>
                <div className="control is-expanded has-icons-right">
                  <input
                    disabled={cragLocationLoading}
                    className="input"
                    type="text"
                    placeholder="Logitude"
                    { ...register("longitude") }
                  />
                </div>
                <div className="control">
                  <button
                    type="button"
                    className={`
                      button
                      ${cragLocationLoading ? "is-loading" : ""}
                    `}
                    onClick={() => btnCragLocationFindMeOnClick()}
                  >
                    <span className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
                    <span>Find Me</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="help is-danger">{errors.latitude?.message}</div>
            <div className="help is-danger">{errors.longitude?.message}</div>
          </div>

          <div className="field">
            <label className="label">Parking Location</label>
            {carParks.map((_carPark, index) => (
              <div className="field" key={index}>
                <div className="field has-addons">
                  <div className="control is-expanded has-icons-right">
                    <input
                      type="text"
                      placeholder="Name"
                      className="input"
                      { ...register(`carParks.${index}.title`) }
                    />
                  </div>
                  {carParks.length && (
                    <div className="control">
                      <button
                        type="button"
                        className="button is-outlined"
                        onClick={() => btnRemoveCarParkOnClick(index)}
                      >
                        <span className="icon">
                          <i className="fas fa-trash-alt"></i>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <p className="help is-danger">
                  {errors.carParks?.[index]?.title?.message}
                </p>
                <div className="field has-addons">
                  <div className="control is-expanded has-icons-right">
                    <input
                      className="input"
                      type="text"
                      placeholder="Latitude"
                      { ...register(`carParks.${index}.latitude`) }
                    />
                  </div>
                  <div className="control is-expanded has-icons-right">
                    <input
                      className="input"
                      type="text"
                      placeholder="Longitude"
                      { ...register(`carParks.${index}.longitude`) }
                    />
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className={`
                        button
                        ${
                          carParkLocationLoadingIndex === index
                            ? "is-loading"
                            : ""
                        }
                      `}
                      onClick={() => btnCarParkFindMeOnClick(index)}
                    >
                      <span className="icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <span>Find Me</span>
                    </button>
                  </div>
                  <div className="help is-danger">
                    {errors.carParks?.[index]?.latitude?.message}
                  </div>
                  <div className="help is-danger">
                    {errors.carParks?.[index]?.longitude?.message}
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <textarea
                      placeholder="Description"
                      className="textarea"
                      { ...register(`carParks.${index}.description`) }
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="field">
            <div className="control">
              <button
                className="button"
                type="button"
                onClick={btnAddCarParkOnClick}
              >
                <span className="icon is-small">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add Car Park</span>
              </button>
            </div>
            {/**
              <div className="help is-danger">{ errors.carParks?.message }</div>
            */}
          </div>

          <div className="field">
            <label className="label">Access</label>
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  value="unknown"
                  { ...register("access") }
                />
                Unknown
              </label>
              <label className="radio">
                <input
                  type="radio"
                  value="permitted"
                  { ...register("access") }
                />
                Permitted
              </label>
              <label className="radio">
                <input
                  type="radio"
                  value="restricted"
                  { ...register("access") }
                />
                Restricted
              </label>
              <label className="radio">
                <input
                  type="radio"
                  value="banned"
                  { ...register("access") }
                />
                Banned
              </label>
            </div>
            <p className="help is-danger"></p>
          </div>

          <div className="field">
            <label className="label" htmlFor="accessDetails">
              Access Details
            </label>
            <div className="control">
              <textarea
                className="textarea"
                { ...register("accessDetails") }
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="accessLink">
              Access Details Link
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                { ...register("accessLink") }
              />
            </div>
            <p className="help is-danger">{errors.accessLink?.message}</p>
          </div>

          <div className="field">
            <div className="field is-flex is-justified-end">
              <div className="control">
                <button
                  type="submit"
                  className={`button is-primary ${loading ? "is-loading" : ""}`}
                >
                  <span>Create Crag</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateCrag;
