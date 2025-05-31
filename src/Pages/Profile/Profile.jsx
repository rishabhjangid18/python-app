import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './Profile.css';

// List of available movie genres
const movieGenresList = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Documentary',
  'Family', 'Fantasy', 'Film_Noir', 'History', 'Horror', 'Mystery', 'Musical', 'Romance', 'Sci_Fi',
  'Sports', 'Thriller', 'War', 'Western'
];

// List of available music genres
const musicGenresList = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'Reggae',
  'Blues', 'Metal', 'Folk', 'Punk', 'Soul', 'Funk', 'R&B', 'Gospel'
];

const UserProfile = () => {
  const [userData, setUserData] = useState({
    email: '',
    moviePreferences: [], // State for movie preferences
    musicPreferences: [], // State for music preferences
  });
  const [newMoviePref, setNewMoviePref] = useState('');
  const [newMusicPref, setNewMusicPref] = useState(''); // State for the selected new music genre
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/signin');
          return;
        }

        const token = await user.getIdToken();
        // Fetching preferences for both movies and music from a single endpoint
        const prefsRes = await fetch(`http://127.0.0.1:5000/get_preferences/${encodeURIComponent(user.email)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const prefsMusicRes = await fetch(`http://127.0.0.1:5000/get_music_preferences/${encodeURIComponent(user.email)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!prefsRes.ok) throw new Error('Failed to fetch preferences');
        if (!prefsMusicRes.ok) throw new Error('Failed to fetch preferences');

        const prefsData = await prefsRes.json();
        const prefsMusicData = await prefsMusicRes.json();
        setUserData({
          email: user.email,
          moviePreferences: prefsData.preferences || [], // Assuming backend returns movie prefs under 'preferences'
          musicPreferences: prefsMusicData.music_preferences || [], // Assuming backend returns music prefs under 'music_preferences'
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch preferences');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [auth, navigate]);

  // Function to update movie preferences on the backend
  const updateMoviePreferences = async (updatedPrefs) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const response = await fetch(`http://127.0.0.1:5000/save_preferences`, { // Endpoint for movie preferences
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email, genres: updatedPrefs }),
      });

      if (!response.ok) throw new Error('Update failed for movie preferences');

      setUserData((prev) => ({ ...prev, moviePreferences: updatedPrefs }));
      setNewMoviePref('');
    } catch (error) {
      console.error('Error updating movie preferences:', error.message);
      // Optionally, set an error message for the user
    }
  };

  // Function to update music preferences on the backend
  const updateMusicPreferences = async (updatedPrefs) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      // Endpoint for music preferences - ensure this endpoint exists on your Flask backend
      const response = await fetch(`http://127.0.0.1:5000/save_music_preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email, genres: updatedPrefs }), // Sending music genres
      });

      if (!response.ok) throw new Error('Update failed for music preferences');

      setUserData((prev) => ({ ...prev, musicPreferences: updatedPrefs })); // Update local state for music
      setNewMusicPref(''); // Clear the selected new music genre
    } catch (error) {
      console.error('Error updating music preferences:', error.message);
      // Optionally, set an error message for the user related to music preferences
    }
  };

  // Generic function to add a preference (either movie or music)
  const addPreference = (type, genre) => {
    if (!genre) return; // Do nothing if no genre is selected

    // Check if the genre already exists in the respective preferences list
    if (userData[`${type}Preferences`].includes(genre)) {
        console.warn(`${type} preference '${genre}' already exists.`);
        return;
    }

    const updatedPrefs = [...userData[`${type}Preferences`], genre];

    if (type === 'movie') {
      updateMoviePreferences(updatedPrefs);
    } else if (type === 'music') {
      updateMusicPreferences(updatedPrefs); // Call specific update function for music
    }
  };

  // Generic function to remove a preference (either movie or music)
  const removePreference = (type, genre) => {
    const updatedPrefs = userData[`${type}Preferences`].filter(g => g !== genre);
    if (type === 'movie') {
      updateMoviePreferences(updatedPrefs);
    } else if (type === 'music') {
      updateMusicPreferences(updatedPrefs); // Call specific update function for music
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <div className="header">
        <button onClick={handleGoBack}>Go Back</button>
        <h1>User Profile</h1>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="profile-section">
        <h2>Email: {userData.email}</h2>

        {/* Movie Preferences Section */}
        <div className="preferences">
          <h3>Movie Genre Preferences</h3>
          <ul>
            {userData.moviePreferences.map((genre, index) => (
              <li key={index}>
                {genre} <button onClick={() => removePreference('movie', genre)}>Remove</button>
              </li>
            ))}
          </ul>
          <select value={newMoviePref} onChange={(e) => setNewMoviePref(e.target.value)}>
            <option value="">Select a movie genre</option>
            {movieGenresList.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
          </select>
          <button onClick={() => addPreference('movie', newMoviePref)} disabled={!newMoviePref}>Add Movie Genre</button>
        </div>

        {/* Music Preferences Section - mirrors the movie preferences section */}
        <div className="preferences">
          <h3>Music Genre Preferences</h3>
          <ul>
            {userData.musicPreferences.map((genre, index) => (
              <li key={index}>
                {genre} <button onClick={() => removePreference('music', genre)}>Remove</button>
              </li>
            ))}
          </ul>
          <select value={newMusicPref} onChange={(e) => setNewMusicPref(e.target.value)}>
            <option value="">Select a music genre</option>
            {musicGenresList.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
          </select>
          <button onClick={() => addPreference('music', newMusicPref)} disabled={!newMusicPref}>Add Music Genre</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;