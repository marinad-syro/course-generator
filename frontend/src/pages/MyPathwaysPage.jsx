import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import NavBar from '../Components/NavBar';
import './MyPathwaysPage.css';

const MyPathwaysPage = () => {
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        const response = await api.get('/areas/');
        setPathways(response.data);
      } catch (err) {
        setError('Failed to load your pathways. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchPathways();
  }, []);

  if (loading) {
    return <div className="loading-container"><NavBar /><div>Loading...</div></div>;
  }

  if (error) {
    return <div className="error-container"><NavBar /><div>{error}</div></div>;
  }

  return (
    <div className="my-pathways-page">
      <NavBar />
      <div className="pathways-list-container">
        <h1>My Pathways</h1>
        {pathways.length > 0 ? (
          <ul className="pathways-list">
            {pathways.map((pathway) => (
              <li key={pathway.id}>
                <Link to={`/learning-pathway`} state={{ pathway }}>
                  {pathway.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't created any learning pathways yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyPathwaysPage;
