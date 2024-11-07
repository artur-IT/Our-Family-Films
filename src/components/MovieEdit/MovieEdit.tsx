import { useState } from "react";

export const MovieEdit = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    year: "",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save movie data logic would go here
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Delete movie logic would go here
    if (window.confirm("Are you sure you want to delete this movie?")) {
      // Delete operation
    }
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="movie-edit">
      {isEditing ? (
        <div className="edit-form">
          <input type="text" name="title" value={movieData.title} onChange={handleChange} placeholder="Movie title" />
          <textarea name="description" value={movieData.description} onChange={handleChange} placeholder="Movie description" />
          <input type="text" name="year" value={movieData.year} onChange={handleChange} placeholder="Release year" />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="movie-actions">
          <button onClick={handleEdit}>Edit Movie</button>
          <button onClick={handleDelete} className="delete-btn">
            Delete Movie
          </button>
        </div>
      )}
    </div>
  );
};
