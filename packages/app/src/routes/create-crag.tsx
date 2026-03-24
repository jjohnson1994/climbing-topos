// @ts-nocheck
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { NewCragSchema } from '@climbingtopos/schemas';
import { useRef, useTransition, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { cragTags } from '@climbingtopos/globals';
import Message, { Color } from '@/components/Message';
import { popupError, popupSuccess } from '@/helpers/alerts';
import { getCurrentPosition } from '@/helpers/geolocation';
import { reverseLookup } from '@/helpers/nominatim';
import { postFn } from '@/data/actions/crags/post';
import { compressImage, fileToBase64 } from '@/helpers/imageCompression';
import { FileInput } from '@/components/FileInput';
import { ImageCropModal } from '@/components/ImageCropModal';
import { flipImage } from '@/helpers/cropImage';

const schema = NewCragSchema();

export const Route = createFileRoute('/create-crag')({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  component: CreateCragPage,
});

function CreateCragPage() {
  const navigate = useNavigate();
  const [carParkLocationLoadingIndex, setCarParkLocationLoadingIndex] =
    useState(-1);
  const [cragLocationLoading, setCragLocationLoading] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      access: 'unknown',
      accessDetails: '',
      accessLink: '',
      approachNotes: '',
      carParks: [
        {
          title: '',
          latitude: '',
          longitude: '',
          description: '',
        },
      ],
      description: '',
      latitude: '',
      longitude: '',
      tags: [] as string[],
      title: '',
      imageFileName: '',
      acceptTerms: false,
    },
  });

  const watchImageFileName = watch('imageFileName');

  const carParkLongitudeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cragLongitudeRef = useRef<HTMLInputElement>(null);
  const { ref: cragLongitudeRegisterRef, ...cragLongitudeRegisterRest } =
    register('longitude');

  const cragLatitudeOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (text.includes(',')) {
      e.preventDefault();
      const [lat, lng] = text.split(',');
      setValue('latitude', lat.trim());
      setValue('longitude', lng.trim());
      cragLongitudeRef.current?.focus();
    }
  };

  const cragLatitudeOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',') {
      e.preventDefault();
      cragLongitudeRef.current?.focus();
    }
  };

  const carParkLatitudeOnPaste =
    (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData('text');
      if (text.includes(',')) {
        e.preventDefault();
        const [lat, lng] = text.split(',');
        setValue(`carParks.${index}.latitude`, lat.trim());
        setValue(`carParks.${index}.longitude`, lng.trim());
        carParkLongitudeRefs.current[index]?.focus();
      }
    };

  const carParkLatitudeOnKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === ',') {
        e.preventDefault();
        carParkLongitudeRefs.current[index]?.focus();
      }
    };

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
    setValue('imageFileName', file.name);
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

  const {
    fields: carParks,
    append: appendCarPark,
    remove: removeCarPark,
    insert: insertCarPark,
  } = useFieldArray({
    control,
    name: 'carParks',
  });

  const watchAllFields = watch();

  const btnCragLocationFindMeOnClick = async () => {
    setCragLocationLoading(true);

    try {
      const location = await getCurrentPosition();
      setValue('latitude', `${location.coords.latitude}`);
      setValue('longitude', `${location.coords.longitude}`);
    } finally {
      setCragLocationLoading(false);
    }
  };

  const getCragNominatim = async (latitude: string, longitude: string) => {
    return await reverseLookup(latitude, longitude);
  };

  const btnAddCarParkOnClick = () => {
    appendCarPark({
      title: '',
      latitude: '',
      longitude: '',
      description: '',
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

      if (!imageBase64) {
        popupError('Please select an image');
        return;
      }

      const osmData = await getCragNominatim(
        formData.latitude,
        formData.longitude,
      );

      startTransition(async () => {
        const result = await postFn({
          data: {
            acceptTerms: formData.acceptTerms,
            accessLink: formData.accessLink,
            accessDetails: formData.accessDetails,
            approachNotes: formData.approachNotes,
            carParks: formData.carParks,
            access: formData.access,
            longitude: formData.longitude,
            latitude: formData.latitude,
            tags: formData.tags,
            description: formData.description,
            title: formData.title,
            osmData,
            imageBase64,
          },
        });

        if (result?.slug) {
          await popupSuccess('Crag Created!');
          navigate({
            to: '/crags/$cragSlug',
            params: { cragSlug: result.slug },
          });
        }
      });
    } catch (error: any) {
      if (error.error === 'Unable to geocode') {
        popupError(
          'Could not find geolocation data! Check the Crag location coordinates are correct and try again',
        );
      } else {
        popupError('Ahh, something has gone wrong...');
      }
    } finally {
      setLoading(false);
    }
  });

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
        <div className="container box">
          <form
            onSubmit={formOnSubmit}
            style={{ display: 'flex', flexDirection: 'column' }}
            autoComplete="off"
          >
            <input
              type="text"
              {...register('imageFileName')}
              className="is-hidden"
            />

            <Message color={Color.isWarning} header="Terms & Conditions">
              <p>
                By creating a crag you agree to become the crag maintainer. That
                means you're in charge of approving new routes and keeping
                everything up to date. Please respect any access restrictions!
              </p>
              <br />
              <div className="is-flex">
                <div className="is-flex is-flex-direction-column is-align-items-flex-end">
                  <label className="checkbox">
                    <input type="checkbox" {...register('acceptTerms')} />
                    <span className="ml-2">Agree</span>
                  </label>
                  <p className="help is-danger">
                    {errors.acceptTerms?.message}
                  </p>
                </div>
              </div>
            </Message>

            <div className="field">
              <label className="label" htmlFor="title">
                Title
              </label>
              <div className="control">
                <input className="input" type="text" {...register('title')} />
              </div>
              <p className="help is-danger">{errors.title?.message}</p>
            </div>

            <div className="field">
              <label className="label">Title Image</label>
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
                    <span className="file-name">{watchImageFileName}</span>
                  </label>
                </FileInput>
              </div>
              <p className="help is-danger">{errors.imageFileName?.message}</p>
            </div>

            {imagePreview && (
              <div className="field">
                <div className="control">
                  <figure className="image">
                    <img src={imagePreview} alt="crag preview" />
                  </figure>
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
                      <span>Flip</span>
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
                      <span>Flip</span>
                    </button>
                  </div>
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
                  {...register('description')}
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
                  {...register('approachNotes')}
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
                      className={`tag ${watchAllFields?.tags?.includes?.(tag) ? 'is-primary' : ''}`}
                    >
                      <input
                        type="checkbox"
                        value={tag}
                        {...register('tags')}
                        style={{ display: 'none' }}
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
                      onPaste={cragLatitudeOnPaste}
                      onKeyDown={cragLatitudeOnKeyDown}
                      {...register('latitude')}
                    />
                  </div>
                  <div className="control is-expanded has-icons-right">
                    <input
                      disabled={cragLocationLoading}
                      className="input"
                      type="text"
                      placeholder="Longitude"
                      ref={(el) => {
                        cragLongitudeRegisterRef(el);
                        cragLongitudeRef.current = el;
                      }}
                      {...cragLongitudeRegisterRest}
                    />
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className={`button ${cragLocationLoading ? 'is-loading' : ''}`}
                      onClick={() => btnCragLocationFindMeOnClick()}
                    >
                      <span className="icon">
                        <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
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
                        {...register(`carParks.${index}.title`)}
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
                            <i className="fas fa-trash-alt" aria-hidden="true"></i>
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
                        onPaste={carParkLatitudeOnPaste(index)}
                        onKeyDown={carParkLatitudeOnKeyDown(index)}
                        {...register(`carParks.${index}.latitude`)}
                      />
                    </div>
                    <div className="control is-expanded has-icons-right">
                      {(() => {
                        const { ref: lngRegRef, ...lngRest } = register(
                          `carParks.${index}.longitude`,
                        );
                        return (
                          <input
                            className="input"
                            type="text"
                            placeholder="Longitude"
                            ref={(el) => {
                              lngRegRef(el);
                              carParkLongitudeRefs.current[index] = el;
                            }}
                            {...lngRest}
                          />
                        );
                      })()}
                    </div>
                    <div className="control">
                      <button
                        type="button"
                        className={`button ${carParkLocationLoadingIndex === index ? 'is-loading' : ''}`}
                        onClick={() => btnCarParkFindMeOnClick(index)}
                      >
                        <span className="icon">
                          <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
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
                        {...register(`carParks.${index}.description`)}
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
                    <i className="fas fa-plus" aria-hidden="true"></i>
                  </span>
                  <span>Add Car Park</span>
                </button>
              </div>
            </div>

            <div className="field">
              <label className="label">Access</label>
              <div className="control">
                <label className="radio">
                  <input type="radio" value="unknown" {...register('access')} />
                  Unknown
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    value="permitted"
                    {...register('access')}
                  />
                  Permitted
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    value="restricted"
                    {...register('access')}
                  />
                  Restricted
                </label>
                <label className="radio">
                  <input type="radio" value="banned" {...register('access')} />
                  Banned
                </label>
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="accessDetails">
                Access Details
              </label>
              <div className="control">
                <textarea className="textarea" {...register('accessDetails')} />
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
                  {...register('accessLink')}
                />
              </div>
              <p className="help is-danger">{errors.accessLink?.message}</p>
            </div>

            <div className="field">
              <div className="field is-flex is-justified-end">
                <div className="control">
                  <button
                    type="submit"
                    className={`button is-primary ${loading || pending || compressing ? 'is-loading' : ''}`}
                    disabled={compressing}
                  >
                    <span>Create Crag</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
