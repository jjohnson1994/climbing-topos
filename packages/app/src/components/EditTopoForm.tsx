import { useState } from 'react';
import { useNavigate, useRouter, Link } from '@tanstack/react-router';
import type { Topo } from '@climbingtopos/types';
import { popupError, popupSuccess } from '@/helpers/alerts';
import { patchFn } from '@/data/actions/topos/patch';
import { compressImage, fileToBase64 } from '@/helpers/imageCompression';
import { FileInput } from '@/components/FileInput';
import { ImageCropModal } from '@/components/ImageCropModal';
import { flipImage } from '@/helpers/cropImage';

function EditTopoForm({
  topo,
  cragSlug,
  areaSlug,
  areaTitle,
  cragTitle,
}: {
  topo: Topo;
  cragSlug: string;
  areaSlug: string;
  areaTitle: string;
  cragTitle: string;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState(topo.orientation);
  const [imagePreview, setImagePreview] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  function compressAndPreview(file: File) {
    setCompressing(true);
    compressImage(file, 2000, 2000)
      .then(async (compressedFile) => {
        const base64 = await fileToBase64(compressedFile);
        setImageBase64(base64);
        setImagePreview(URL.createObjectURL(compressedFile));
        setCompressing(false);
      })
      .catch(() => {
        setCompressing(false);
        popupError('Image compression failed, please try again');
      });
  }

  function processImageFile(file: File) {
    setImageFileName(file.name);
    setOriginalSrc(URL.createObjectURL(file));
    compressAndPreview(file);
  }

  function onImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  }

  function onCropComplete(croppedFile: File) {
    setCropModalOpen(false);
    compressAndPreview(croppedFile);
    setOriginalSrc(URL.createObjectURL(croppedFile));
  }

  async function handleFlip(direction: 'horizontal' | 'vertical') {
    if (!imagePreview) return;
    const flipped = await flipImage(imagePreview, direction);
    const flippedUrl = URL.createObjectURL(flipped);
    setOriginalSrc(flippedUrl);
    compressAndPreview(flipped);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);

      const body: { orientation?: string; imageFileName?: string } = {};
      if (orientation !== topo.orientation) body.orientation = orientation;
      if (imageFileName) body.imageFileName = imageFileName;

      if (Object.keys(body).length === 0 && !imageBase64) {
        navigate({
          to: '/crags/$cragSlug/areas/$areaSlug',
          params: { cragSlug, areaSlug },
        });
        return;
      }

      await patchFn({
        data: {
          topoSlug: topo.slug!,
          body,
          imageBase64: imageBase64 ?? undefined,
        },
      });
      await router.invalidate();
      await popupSuccess('Topo Updated!');
      navigate({
        to: '/crags/$cragSlug/areas/$areaSlug',
        params: { cragSlug, areaSlug },
      });
    } catch {
      popupError('Ahh, something has gone wrong...');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {cropModalOpen && originalSrc && (
        <ImageCropModal
          imageSrc={originalSrc}
          onCropComplete={onCropComplete}
          onCancel={() => setCropModalOpen(false)}
        />
      )}
      <section className="section">
        <div className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <Link to="/crags/$cragSlug" params={{ cragSlug }}>
                  {cragTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug"
                  params={{ cragSlug, areaSlug }}
                >
                  {areaTitle}
                </Link>
              </li>
              <li className="is-active">
                <a>Edit Topo</a>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <section className="section">
        <div className="container box">
          <h1 className="title">Edit Topo</h1>
          <form
            onSubmit={onSubmit}
            style={{ display: 'flex', flexDirection: 'column' }}
            autoComplete="off"
          >
            <div className="field">
              <label className="label">Current Image</label>
              <figure className="image">
                <img src={imagePreview || (topo.image as string)} alt="topo" />
              </figure>
            </div>

            <div className="field">
              <label className="label">Replace Image</label>
              <div className="control">
                <FileInput onFileSelected={processImageFile}>
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      accept="image/*"
                      onChange={onImageSelected}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload" aria-hidden="true"></i>
                      </span>
                      <span className="file-label">Choose a file…</span>
                    </span>
                    <span className="file-name">{imageFileName}</span>
                  </label>
                </FileInput>
              </div>
            </div>

            {imagePreview && (
              <div className="field">
                <div className="buttons mt-2">
                  <button
                    type="button"
                    className="button is-small"
                    onClick={() => setCropModalOpen(true)}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-crop-alt" aria-hidden="true"></i>
                    </span>
                    <span>Crop</span>
                  </button>
                  <button
                    type="button"
                    className="button is-small"
                    disabled={compressing}
                    onClick={() => handleFlip('horizontal')}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-arrows-alt-h" aria-hidden="true"></i>
                    </span>
                    <span>Flip Horizontal</span>
                  </button>
                  <button
                    type="button"
                    className="button is-small"
                    disabled={compressing}
                    onClick={() => handleFlip('vertical')}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-arrows-alt-v" aria-hidden="true"></i>
                    </span>
                    <span>Flip Vertical</span>
                  </button>
                </div>
              </div>
            )}

            <div className="field">
              <label className="label">Orientation</label>
              <div className="control">
                <div className="select">
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                  >
                    <option value="unknown">Unknown</option>
                    <option value="north">North</option>
                    <option value="north-east">North East</option>
                    <option value="east">East</option>
                    <option value="south-east">South East</option>
                    <option value="south">South</option>
                    <option value="south-west">South West</option>
                    <option value="west">West</option>
                    <option value="north-west">North West</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button
                  type="submit"
                  className={`button is-primary ${loading || compressing ? 'is-loading' : ''}`}
                  disabled={compressing}
                >
                  Save Changes
                </button>
              </div>
              <div className="control">
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug"
                  params={{ cragSlug, areaSlug }}
                  className="button is-light"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default EditTopoForm;
