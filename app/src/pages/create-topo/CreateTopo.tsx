import { yupResolver } from "@hookform/resolvers/yup";
import { NewTopoSchema } from "core/schemas";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { topos } from "../../api";
import { popupError, popupSuccess } from "../../helpers/alerts";

const schema = NewTopoSchema();

let image: File;

function CreateTopo() {
  const history = useHistory();
  const { cragSlug, areaSlug } =
    useParams<{ areaSlug: string; cragSlug: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      orientation: "unknown",
      imageFileName: "",
      areaSlug,
      cragSlug,
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
      setValue("imageFileName", file?.name ?? "Unnamed Image");
      setImagePreview(imagePreviewUrl);
    } else {
      setValue("imageFileName", "");
    }
  }

  const formOnSubmit = handleSubmit(async (formData) => {
    setLoading(true);

    try {
      await topos.createTopo({ ...formData, image });
      await popupSuccess("Topo Created!");
      history.push(`/crags/${cragSlug}/areas/${areaSlug}`);
    } catch (error) {
      console.error("Error creating crag", error);
      popupError("Ahh, something has gone wrong...");
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
            value={cragSlug}
            {...register("cragSlug")}
            className="is-hidden"
          />
          <input
            type="text"
            value={areaSlug}
            {...register("areaSlug")}
            className="is-hidden"
          />
          <input
            type="text"
            {...register("imageFileName")}
            className="is-hidden"
          />

          <div className="field">
            <label className="label">Image</label>
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
                  <img src={imagePreview} alt="topo preview" />
                </figure>
              </div>
            </div>
          )}

          <div className="field">
            <label className="label">Orientation</label>
            <div className="control">
              <div className="select">
                <select {...register("orientation")}>
                  <option value="unknown">Unknown</option>
                  <option value="north">North</option>
                  <option value="north-east">North East</option>
                  <option value="east">East</option>
                  <option value="south-east">South East</option>
                  <option value="south">South</option>
                  <option value="south-west">South West</option>
                  <option value="west">West</option>
                  <option value="noth-west">North West</option>
                </select>
              </div>
            </div>
            <p className="help is-danger">{errors.orientation?.message}</p>
          </div>

          <div className="field">
            <div className="field is-flex is-justified-end">
              <div className="control">
                <button
                  type="submit"
                  className={`button is-primary ${loading ? "is-loading" : ""}`}
                >
                  <span>Create Topo</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateTopo;
