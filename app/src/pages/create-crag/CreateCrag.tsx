import React, {FormEvent, useState} from "react"
import { createCrag } from "../../api/crags";

function CreateCrag() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const formOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createCrag({
        title,
      });
      console.log('crag created');
    } catch (error) {
      console.error('Error creating crag', error);
    }
  };

  return (
    <form
      style={{ display: "flex", flexDirection: "column" }}
      onSubmit={e => formOnSubmit(e)}
    >
      <label htmlFor="edtTitle">Title</label>
      <input
        id="edtTitle"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <br />
      <label htmlFor="edtDescription">Description</label>
      <textarea
        id="edtDescription"
        value={description}
        onChange={e => setDescription(e.target.value)}
      ></textarea>
      <br />
      <label htmlFor="edtCountry">Country</label>
      <input
        id="edtCountry"
        value={country}
        onChange={e => setCountry(e.target.value)}
      />
      <br />
      <label htmlFor="edtRegion">Region</label>
      <input
        id="edtRegion"
        value={region}
        onChange={e => setRegion(e.target.value)}
      />
      <br />
      <button type="submit">Save</button>
    </form>
  );
}

export default CreateCrag
