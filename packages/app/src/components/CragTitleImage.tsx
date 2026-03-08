function CragTitleImage({
  src,
  cragTitle,
}: {
  src: string;
  cragTitle: string;
}) {
  return (
    <div style={{ minHeight: '500px', overflow: 'hidden' }}>
      <img
        src={src}
        alt={`title image of ${cragTitle}`}
        aria-label={`title image of ${cragTitle}`}
        style={{
          width: '100%',
          height: '500px',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
}

export default CragTitleImage;
