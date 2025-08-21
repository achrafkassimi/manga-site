const MangaCard = ({ manga }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img 
        src={manga.cover} 
        className="card-img-top" 
        alt={manga.title} 
        style={{ height: "200px", objectFit: "cover" }} 
      />
      <div className="card-body p-2">
        <h5 className="card-title small mb-1">{manga.title}</h5>
        <p className="card-text text-muted small">Ch. {manga.chapter}</p>
        <div className="d-flex flex-wrap gap-1">
          {manga.genres.map((g, idx) => (
            <span key={idx} className="badge bg-secondary text-truncate" style={{ fontSize: "0.6rem" }}>
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MangaCard;
