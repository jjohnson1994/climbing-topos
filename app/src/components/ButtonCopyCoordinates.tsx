import {popupError, toastSuccess} from "../helpers/alerts";
import {clipboardWriteText} from "../helpers/clipboard";

interface Props {
  latitude: string;
  longitude: string;
  className?: string;
}

function ButtonCopyCoordinates({ latitude, longitude, className = "" }: Props) {

  const copyCoordinatedToClipboard = async () => {
    try {
      await clipboardWriteText(`${latitude}, ${longitude}`);
      toastSuccess("Coordinates Copied");
    } catch (error) {
      console.error("Error copying crag coordinates to clipboard", error);
      popupError("Coordinates could not be copied. Check permissions and try again");
    }
  }

  return (
    <button className={ `button is-rounded ${className}` } onClick={ copyCoordinatedToClipboard }>
      <span className="icon is-small">
        <i className="fas fa-map-marker-alt"></i>
      </span>
      <span>{ `${latitude}`.substring(0, 9) }, { `${longitude}`.substring(0, 9) }</span>
    </button>
  );
}

export default ButtonCopyCoordinates;
