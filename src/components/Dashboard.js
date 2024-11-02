import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { CiShare2 } from "react-icons/ci";


const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState("popularity");
  const [timeOption, setTimeOption] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10; 

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      const baseUrl =
        sortOption === "date"
          ? "https://hn.algolia.com/api/v1/search_by_date"
          : "https://hn.algolia.com/api/v1/search";

      const now = Math.floor(Date.now() / 1000);
      let timeFilter = "";
      if (timeOption === "24h") timeFilter = `&numericFilters=created_at_i>${now - 86400}`;
      else if (timeOption === "week") timeFilter = `&numericFilters=created_at_i>${now - 604800}`;
      else if (timeOption === "month") timeFilter = `&numericFilters=created_at_i>${now - 2592000}`;
      else if (timeOption === "year") timeFilter = `&numericFilters=created_at_i>${now - 31536000}`;

      try {
        const response = await fetch(
          `${baseUrl}?query=${searchQuery}${timeFilter}`
        );
        const data = await response.json();
        setSearchResults(data.hits);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery, sortOption, timeOption]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); 
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1); 
  };

  const handleTimeChange = (event) => {
    setTimeOption(event.target.value);
    setCurrentPage(1); 
  };

  
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  return (
    <div>
      <div className="min-h-screen dashboard-container">
        <div className="dashboard-inner">
          <header className="dashboard-header">
            <div className="logo-container">
              <img
                className="logo"
                src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730545520/ugal2hh8jb0jkjrdc8fx.png"
                alt="Logo"
              />
              <div className="logo-text">
                Search
                <br /> Hacker News
              </div>
            </div>
            <div className="search-input-container">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
                placeholder="Search stories by title, url or author"
              />
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </svg>
              </div>
              <div className="algolia-logo">
                <img
                  className="logo-img"
                  src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730561913/rbc6cvfnzxzpajgvqnbt.png"
                  alt="Algolia"
                />
              </div>
            </div>
          </header>
        </div>
      </div>

      <div className="filters">
        <span>Search</span>
        <select value="stories" onChange={() => {}} className="filter-select">
          <option value="stories">Stories</option>
          <option value="comments">Comments</option>
        </select>
        <span>by</span>
        <select value={sortOption} onChange={handleSortChange} className="filter-select">
          <option value="popularity">Popularity</option>
          <option value="date">Date</option>
        </select>
        <span>for</span>
        <select value={timeOption} onChange={handleTimeChange} className="filter-select">
          <option value="all">All time</option>
          <option value="24h">Last 24h</option>
          <option value="week">Past week</option>
          <option value="month">Past month</option>
          <option value="year">Past year</option>
        </select>
        <div className="result-stats">
          <span>{searchResults.length} results</span>
          <button className="share-button">
            <CiShare2 />
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="loader">
          <div className="spinner"></div>
          Loading...
        </div>
        ) : (
          <ul className="search-results">
            {currentResults.length > 0 ? (
              currentResults.map((result) => (
                <li key={result.objectID} className="list-items">
                  <a href={result.url} className="title">
                    {result.title}
                  </a>
                  <span className="metadata">
                    {result.points} points by {result.author} {result.created_at}
                  </span>
                  <span className="comments">{result.num_comments} comments</span>
                </li>
              ))
            ) : (
              <div className="no-results">No results found</div>
            )}
          </ul>
        )}
        {error && <div className="error">{error}</div>}
      </div>

      
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
