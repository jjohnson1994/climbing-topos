function CragTitleImage({ src }: { src: string }) {
  return (
    <div style={{
      backgroundImage: `url(${src})`,
      minHeight: '500px',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}>
    </div>
  )
}

export default CragTitleImage;
