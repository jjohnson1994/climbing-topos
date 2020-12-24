import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { topos } from "../../api";
import { popupError, popupSuccess } from "../../helpers/alerts";

const schema = yup.object().shape({
  orientation: yup.string().required("Required"),
});

let image: File;

function CreateTopo() {
  const history = useHistory();
  const { cragSlug, areaSlug } = useParams<{ areaSlug: string; cragSlug: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("");

  const { register, handleSubmit, setValue, errors } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      orientation: "unknown",
      image: "",
    }
  });

  async function onImageSelected() {
    const files =
      (document.querySelector('input[type=file]') as HTMLInputElement).files;

    if (files) {
      const file = files.item(0);
      console.log(file);
      image = file as File;
      setImageName(file!.name);
    } else {
      setValue("image", "");
    }
  }

  const formOnSubmit = handleSubmit(async (formData) => {
    setLoading(true);

    try {
      await topos.createTopo({ ...formData, areaSlug, cragSlug, image });
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
                    { imageName }
                  </span>
                </label>
              </div>
            </div>
            <p className="help is-danger">{ errors.image?.message }</p>
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
                  <span>Continue</span>
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
