import { gradingSystems } from "core/globals";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { profile } from "../api";
import { popupError, toastSuccess } from "../helpers/alerts";

function ProfileSettings() {
  const [preferedGradingSystems, setPreferedGradingSystems] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { register, setValue, handleSubmit } = useForm();

  useEffect(() => {
    const getProfileSettings = async () => {
      const newPreferedGradingSystems = await profile.getPreferedGradingSystems();
      setValue("preferedGradingSystems.Boulder", newPreferedGradingSystems.Boulder);
      setValue("preferedGradingSystems.Sport", newPreferedGradingSystems.Sport);
      setValue("preferedGradingSystems.Trad", newPreferedGradingSystems.Trad);
      console.log("settings prefered", newPreferedGradingSystems);
    };

    try {
      getProfileSettings();
    } catch (error) {
      console.error("Error loading user profile settings", error);
      popupError("Something has gone wrong, try again or give up");
    }
  }, []);

  const formOnSubmit = handleSubmit(async data => {
    try {
      setLoading(true);
      await profile.setPreferedGradingSystems(data.preferedGradingSystems);
      toastSuccess("Preferences Updated");
    } catch (error) {
      console.error("Error setting profile prefered grading systems", error);
      popupError("Sorry, something broke and your preferenced couldn't be updated");
    } finally {
      setLoading(false);
    }
  });

  const gradeOptions = () => {
    return gradingSystems.map(gradingSystem => (
      <option key={ gradingSystem.title } value={ gradingSystem.title }>{ gradingSystem.title }</option>
    ));
  }

  return (
    <div className="block box">
      <form className="form" onSubmit={ formOnSubmit }>
        <div className="field">
          <label className="label">Bouldering Grading System</label>
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select
                name="preferedGradingSystems.Boulder"
                defaultValue={ preferedGradingSystems["Boulder"] }
                ref={ register() }
              >
                { gradeOptions() }
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Sport Grading System</label>
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select
                name="preferedGradingSystems.Sport"
                defaultValue={ preferedGradingSystems["Sport"] }
                ref={ register() }
              >
                { gradeOptions() }
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Trad Grading System</label>
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select
                name="preferedGradingSystems.Trad"
                defaultValue={ preferedGradingSystems["Trad"] }
                ref={ register() }
              >
                { gradeOptions() }
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <div className="buttons is-right">
              <button className={ `button is-primary ${ loading ? "is-loading" : ""}` }>Save</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;
