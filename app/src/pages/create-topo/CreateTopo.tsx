import {useAuth0} from "@auth0/auth0-react";
import {yupResolver} from '@hookform/resolvers/yup';
import {NewTopoSchema} from "core/schemas";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useHistory, useParams} from "react-router-dom";
import * as yup from "yup";
import {topos} from "../../api";
import {popupError, popupSuccess} from "../../helpers/alerts";

const schema = NewTopoSchema(yup);

let image: File;

function CreateTopo() {
  const history = useHistory();
  const { getAccessTokenSilently } = useAuth0();
  const { cragSlug, areaSlug } = useParams<{ areaSlug: string; cragSlug: string }>();
  const [loading, setLoading] = useState<boolean>(false);

  const { register, watch, handleSubmit, setValue, errors } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      orientation: "unknown",
      imageFileName: "",
      areaSlug,
      cragSlug
    }
  });

  const watchImageFileName = watch("imageFileName");

  async function onImageSelected() {
    const files =
      (document.querySelector('input[type=file]') as HTMLInputElement).files;

    if (files) {
      const file = files.item(0);
      image = file as File;
      setValue("imageFileName", file?.name);
    } else {
      setValue("imageFileName", "");
    }
  }

  const formOnSubmit = handleSubmit(async (formData) => {
    setLoading(true);

    try {
      const token = await getAccessTokenSilently();
      await topos.createTopo({ ...formData, image }, token);
      await popupSuccess("Topo Created!");
      history.push(`/crags/${cragSlug}/areas/${areaSlug}`);
    } catch (error) {
      console.error('Error creating crag', error);
      popupError("Ahh, something has gone wrong...");
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className="section">
      <div className="container box">
        <form
          onSubmit={ formOnSubmit }
          style={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <input
            type="text"
            name="cragSlug"
            value={ cragSlug }
            ref={ register() }
            className="is-hidden"
          />
          <input
            type="text"
            name="areaSlug"
            value={ areaSlug }
            ref={ register() }
            className="is-hidden"
          />
          <input
            type="text"
            name="imageFileName"
            ref={ register({}) }
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
                    onChange={ onImageSelected }
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">
                      Choose a file…
                    </span>
                  </span>
                  <span className="file-name">
                    { watchImageFileName }
                  </span>
                </label>
              </div>
            </div>
            <p className="help is-danger">{ errors.imageFileName?.message }</p>
          </div>

          <div className="field">
            <label className="label">Orientation</label>
            <div className="control">
              <div className="select">
                <select name="orientation" ref={ register }>
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
            <p className="help is-danger">{ errors.orientation?.message }</p>
          </div>

          <div className="field">
            <div className="field is-flex is-justified-end">
              <div className="control">
                <button type="submit" className={`button is-primary ${loading ? "is-loading" : ""}`}>
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
