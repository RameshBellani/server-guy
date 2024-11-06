// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Dashboard.css";
// import { CiShare2 } from "react-icons/ci";

// const Dashboard = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [sortOption, setSortOption] = useState("popularity");
//   const [timeOption, setTimeOption] = useState("all");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const resultsPerPage = 10;
//   const [searchHistory, setSearchHistory] = useState([]);
//   const username = localStorage.getItem("username")
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Sync search query with URL parameters
//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const query = urlParams.get("query");
//     if (query) {
//       setSearchQuery(query);
//       fetchSearchResults(query);
//     }
//   }, [location.search, sortOption, timeOption, currentPage]);

//   const fetchSearchResults = async (query) => {
//     setLoading(true);
//     setError(null);

//     const baseUrl =
//       sortOption === "date"
//         ? "https://hn.algolia.com/api/v1/search_by_date"
//         : "https://hn.algolia.com/api/v1/search";

//     const now = Math.floor(Date.now() / 1000);
//     let timeFilter = "";
//     if (timeOption === "24h") timeFilter = `&numericFilters=created_at_i>${now - 86400}`;
//     else if (timeOption === "week") timeFilter = `&numericFilters=created_at_i>${now - 604800}`;
//     else if (timeOption === "month") timeFilter = `&numericFilters=created_at_i>${now - 2592000}`;
//     else if (timeOption === "year") timeFilter = `&numericFilters=created_at_i>${now - 31536000}`;

//     try {
//       const response = await fetch(
//         `${baseUrl}?query=${query}${timeFilter}&page=${currentPage - 1}`
//       );
//       const data = await response.json();
//       setSearchResults(data.hits);

//       // Log search history with timestamp
//       const timestamp = new Date().toLocaleString();
//       setSearchHistory((prevHistory) => [...prevHistory, { query, timestamp }]);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (event) => {
//     const query = event.target.value;
//     setSearchQuery(query);
//     setCurrentPage(1);
//     navigate(`?query=${query}`);
//   };

//   const handleSortChange = (event) => {
//     setSortOption(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleTimeChange = (event) => {
//     setTimeOption(event.target.value);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     fetchSearchResults(searchQuery);
//   };

//   const indexOfLastResult = currentPage * resultsPerPage;
//   const indexOfFirstResult = indexOfLastResult - resultsPerPage;
//   const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
//   const totalPages = Math.ceil(searchResults.length / resultsPerPage);

//   return (
//     <div>
//       <div className="min-h-screen dashboard-container">
//         <div className="dashboard-inner">
//           <header className="dashboard-header">
//             <div className="logo-container">
//               <img
//                 className="logo"
//                 src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730545520/ugal2hh8jb0jkjrdc8fx.png"
//                 alt="Logo"
//               />
//               <div className="logo-text">
//               {username || "Search Hacker News"}
//               </div>
//             </div>
//             <div className="search-input-container">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 className="search-input"
//                 placeholder="Search stories by title, url or author"
//               />
//               <div className="search-icon">
//                 <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
//                 </svg>
//               </div>
//               <div className="algolia-logo">
//                 <img
//                   className="logo-img"
//                   src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730561913/rbc6cvfnzxzpajgvqnbt.png"
//                   alt="Algolia"
//                 />
//               </div>
//             </div>
//           </header>
//         </div>
//       </div>

//       <div className="filters">
//         <span>Search</span>
//         <select value="stories" onChange={() => {}} className="filter-select">
//           <option value="stories">Stories</option>
//           <option value="comments">Comments</option>
//         </select>
//         <span>by</span>
//         <select value={sortOption} onChange={handleSortChange} className="filter-select">
//           <option value="popularity">Popularity</option>
//           <option value="date">Date</option>
//         </select>
//         <span>for</span>
//         <select value={timeOption} onChange={handleTimeChange} className="filter-select">
//           <option value="all">All time</option>
//           <option value="24h">Last 24h</option>
//           <option value="week">Past week</option>
//           <option value="month">Past month</option>
//           <option value="year">Past year</option>
//         </select>
//         <div className="result-stats">
//           <span>{searchResults.length} results</span>
//           <button className="share-button">
//             <CiShare2 />
//           </button>
//         </div>
//       </div>

//       <div>
//         {loading ? (
//           <div className="loader">
//             <div className="spinner"></div>
//             Loading...
//           </div>
//         ) : (
//           <ul className="search-results">
//             {currentResults.length > 0 ? (
//               currentResults.map((result) => (
//                 <li key={result.objectID} className="list-items">
//                   <a href={result.url} className="title">
//                     {result.title}
//                   </a>
//                   <span className="metadata">
//                     {result.points} points by {result.author} {result.created_at}
//                   </span>
//                   <span className="comments">{result.num_comments} comments</span>
//                 </li>
//               ))
//             ) : (
//               <div className="no-results">No results found</div>
//             )}
//           </ul>
//         )}
//         {error && <div className="error">{error}</div>}
//       </div>

//       <div className="pagination">
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index + 1}
//             className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
//             onClick={() => handlePageChange(index + 1)}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>

//       <div className="search-history">
//         <h3>Search History</h3>
//         <ul>
//           {searchHistory.map((entry, idx) => (
//             <li key={idx}>
//               {entry.query} - <span>{entry.timestamp}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Dashboard.css";
// import { CiShare2 } from "react-icons/ci";

// const Dashboard = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [page, setPage] = useState(0);
//   const [nbPages, setNbPages] = useState(0);
//   const [sortOption, setSortOption] = useState("popularity");
//   const [timeOption, setTimeOption] = useState("all");
//   const username = localStorage.getItem("username")
//   useEffect(() => {
//     const fetchData = async () => {
//       const endpoint =
//         sortOption === "popularity"
//           ? "https://hn.algolia.com/api/v1/search"
//           : "https://hn.algolia.com/api/v1/search_by_date";
//       const response = await axios.get(endpoint, {
//         params: { query: searchQuery, page, tags: "story" },
//       });
//       setSearchResults(response.data.hits);
//       setNbPages(response.data.nbPages);
//     };
//     fetchData();
//   }, [searchQuery, page, sortOption]);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//     setPage(0); // reset to first page on new search
//   };
//   console.log(searchResults.length)
//   const handleSortChange = (e) => setSortOption(e.target.value);
//   const handleTimeChange = (e) => setTimeOption(e.target.value);
//   useEffect(() => {
//     const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
//     if (searchQuery) {
//       searchHistory.push({ query: searchQuery, time: new Date().toLocaleString() });
//       localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
//     }
//     window.history.replaceState(null, "", `?query=${searchQuery}`);
//   }, [searchQuery]);
//   const handlePageChange = (newPage) => setPage(newPage);

//   return (
//     <div>
//     <div className="min-h-screen dashboard-container">
//         <div className="dashboard-inner">
//           <header className="dashboard-header">
//             <div className="logo-container">
//               <img
//                 className="logo"
//                 src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730545520/ugal2hh8jb0jkjrdc8fx.png"
//                 alt="Logo"
//               />
//               <div className="logo-text">
//                 {username || "Search Hacker News"}
//               </div>
//             </div>
//             <div className="search-input-container">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 className="search-input"
//                 placeholder="Search stories by title, url or author"
//               />
//               <div className="search-icon">
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
//                 </svg>
//               </div>
//               <div className="algolia-logo">
//                 <img
//                   className="logo-img"
//                   src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730561913/rbc6cvfnzxzpajgvqnbt.png"
//                   alt="Algolia"
//                 />
//               </div>
//             </div>
//           </header>
//         </div>

//     </div>
//     <div className="filters">
//         <span>Search</span>
//         <select value="stories" onChange={() => {}} className="filter-select">
//         <option value="all">All</option>
//           <option value="story">Stories</option>
//           <option value="ask_hn">Ask HN</option>
//           <option value="launch_hn">Launch HN</option>
//           <option value="job">Jobs</option>
//         </select>
//         <span>by</span>
//         <select
//           value={sortOption}
//           onChange={handleSortChange}
//           className="filter-select"
//         >
//           <option value="popularity">Popularity</option>
//           <option value="date">Comments</option>
//         </select>
//         <span>for</span>
//         <select
//           value={timeOption}
//           onChange={handleTimeChange}
//           className="filter-select"
//         >
//           <option value="all">All time</option>
//           <option value="24h">Last 24h</option>
//           <option value="week">Past week</option>
//           <option value="month">Past month</option>
//           <option value="year">Past year</option>
//         </select>
//         <div className="result-stats">
//           <span>{searchResults.length} results</span>
//           <button className="share-button">
//             <CiShare2 />
//           </button>
//         </div>
//       </div>

//       <div className="results">
//         {searchResults.map((result) => (
//           <div
//             key={result.objectID}
//             className="result-item"
//             onClick={() => window.open(result.url, "_blank")}
//           >
//             <h3>{result.title}</h3>
//             <p>{result.author} | {result.points} points</p>
//           </div>
//         ))}
//       </div>

//       <div className="pagination">
//         <button disabled={page <= 0} onClick={() => handlePageChange(page - 1)}>Previous</button>
//         <span>Page {page + 1} of {nbPages}</span>
//         <button disabled={page >= nbPages - 1} onClick={() => handlePageChange(page + 1)}>Next</button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { CiShare2 } from "react-icons/ci";
// import "./Dashboard.css";

// const Dashboard = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [page, setPage] = useState(0);
//   const [nbPages, setNbPages] = useState(0);
//   const [sortOption, setSortOption] = useState("popularity");
//   const [timeOption, setTimeOption] = useState("all");
//   const [tagOption, setTagOption] = useState("story"); // filter by tag
//   const username = localStorage.getItem("username");

//   useEffect(() => {
//     const fetchData = async () => {
//       const endpoint =
//         sortOption === "popularity"
//           ? "https://hn.algolia.com/api/v1/search"
//           : "https://hn.algolia.com/api/v1/search_by_date";
//       const response = await axios.get(endpoint, {
//         params: { query: searchQuery, page, tags: tagOption },
//       });
//       setSearchResults(response.data.hits);
//       setNbPages(response.data.nbPages);
//     };
//     fetchData();

//     const searchParams = new URLSearchParams({
//       query: searchQuery,
//       tags: tagOption,
//       sort: sortOption,
//       time: timeOption,
//       page: page.toString(),
//     });
//     window.history.replaceState(null, "", `?${searchParams.toString()}`);
//   }, [searchQuery, page, sortOption, timeOption, tagOption]);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//     setPage(0); // reset to first page on new search
//   };

//   const handleSortChange = (e) => setSortOption(e.target.value);
//   const handleTimeChange = (e) => setTimeOption(e.target.value);
//   const handleTagChange = (e) => setTagOption(e.target.value);
//   const handlePageChange = (newPage) => setPage(newPage);

//   return (
//     <div>
//       <div className="min-h-screen dashboard-container">
//         <header className="dashboard-header">
//           <div className="logo-container">
//             <img
//               className="logo"
//               src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730545520/ugal2hh8jb0jkjrdc8fx.png"
//               alt="Logo"
//             />
//             <div className="logo-text">{username || "Search Hacker News"}</div>
//           </div>
//           <div className="search-input-container">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={handleSearch}
//               className="search-input"
//               placeholder="Search stories by title, url or author"
//             />
//             <div className="search-icon">
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
//               </svg>
//             </div>
//             <div className="algolia-logo">
//               <img
//                 className="logo-img"
//                 src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730561913/rbc6cvfnzxzpajgvqnbt.png"
//                 alt="Algolia"
//               />
//             </div>
//           </div>
//         </header>
//       </div>

//       <div className="filters">
//         <span>Search</span>
//         <select
//           value={tagOption}
//           onChange={handleTagChange}
//           className="filter-select"
//         >
//           <option value="all">All</option>
//           <option value="story">Stories</option>
//           <option value="ask_hn">Ask HN</option>
//           <option value="launch_hn">Launch HN</option>
//           <option value="job">Jobs</option>
//         </select>
//         <span>by</span>
//         <select
//           value={sortOption}
//           onChange={handleSortChange}
//           className="filter-select"
//         >
//           <option value="popularity">Popularity</option>
//           <option value="date">Date</option>
//         </select>
//         <span>for</span>
//         <select
//           value={timeOption}
//           onChange={handleTimeChange}
//           className="filter-select"
//         >
//           <option value="all">All time</option>
//           <option value="24h">Last 24h</option>
//           <option value="week">Past week</option>
//           <option value="month">Past month</option>
//           <option value="year">Past year</option>
//         </select>
//         <div className="result-stats">
//           <span>{searchResults.length} results</span>
//           <button className="share-button">
//             <CiShare2 />
//           </button>
//         </div>
//       </div>

//       <div className="results">
//         <ul className="Search-results">
//           {searchResults.map((result) => (
//             <li key={result.objectID} className="result-item">
//               <a
//                 href={result.url}
//                 className="title"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {result.title}
//               </a>
//               <div className="metadata">
//                 |{" "}
//                 <span className="points-author">
//                   {result.points} points by{" "}
//                   <span className="author">{result.author}</span>
//                 </span>
//                 |{" "}
//                 <span className="date">
//                   {new Date(result.created_at).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </span>
//                 |{" "}
//                 <span className="comments">{result.num_comments} comments</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="pagination">
//         <button disabled={page <= 0} onClick={() => handlePageChange(page - 1)}>
//           Previous
//         </button>
//         <span>
//           Page {page + 1} of {nbPages}
//         </span>
//         <button
//           disabled={page >= nbPages - 1}
//           onClick={() => handlePageChange(page + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiShare2 } from "react-icons/ci";
import "./Dashboard.css";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [nbPages, setNbPages] = useState(0);
  const [sortOption, setSortOption] = useState("popularity");
  const [timeOption, setTimeOption] = useState("all");
  const [tagOption, setTagOption] = useState("story");
  const [nbHits, setNbHits] = useState(0);

  const username = localStorage.getItem("username");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const endpoint =
  //       sortOption === "popularity"
  //         ? "https://hn.algolia.com/api/v1/search"
  //         : "https://hn.algolia.com/api/v1/search_by_date";

  //     let numericFilters = "";

  //     if (timeOption !== "all") {
  //       const now = new Date();
  //       let fromDate;
  //       switch (timeOption) {
  //         case "24h":
  //           fromDate = new Date(now.setDate(now.getDate() - 1));
  //           break;
  //         case "week":
  //           fromDate = new Date(now.setDate(now.getDate() - 7));
  //           break;
  //         case "month":
  //           fromDate = new Date(now.setMonth(now.getMonth() - 1));
  //           break;
  //         case "year":
  //           fromDate = new Date(now.setFullYear(now.getFullYear() - 1));
  //           break;
  //         default:
  //           fromDate = null;
  //       }
  //       if (fromDate) {
  //         numericFilters = `created_at_i>${Math.floor(
  //           fromDate.getTime() / 1000
  //         )}`;
  //       }
  //     }

  //     const response = await axios.get(endpoint, {
  //       params: {
  //         query: searchQuery,
  //         page,
  //         tags: tagOption,
  //         numericFilters,
  //       },
  //     });

  //     setSearchResults(response.data.hits);
  //     setNbPages(response.data.nbPages);

  //     const searchParams = new URLSearchParams({
  //       query: searchQuery,
  //       tags: tagOption,
  //       sort: sortOption,
  //       time: timeOption,
  //       page: page.toString(),
  //     });
  //     window.history.replaceState(null, "", `?${searchParams.toString()}`);
  //   };

  //   fetchData();
  // }, [searchQuery, page, sortOption, timeOption, tagOption]);
  useEffect(() => {
    const fetchData = async () => {
      const endpoint =
        sortOption === "popularity"
          ? "https://hn.algolia.com/api/v1/search"
          : "https://hn.algolia.com/api/v1/search_by_date";

      let numericFilters = "";

      if (timeOption !== "all") {
        const now = new Date();
        let fromDate;
        switch (timeOption) {
          case "24h":
            fromDate = new Date(now.setDate(now.getDate() - 1));
            break;
          case "week":
            fromDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case "month":
            fromDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case "year":
            fromDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            fromDate = null;
        }
        if (fromDate) {
          numericFilters = `created_at_i>${Math.floor(
            fromDate.getTime() / 1000
          )}`;
        }
      }

      try {
        const response = await axios.get(endpoint, {
          params: {
            query: searchQuery,
            page,
            tags: tagOption,
            numericFilters,
          },
        });
        setSearchResults(response.data.hits);
        setNbPages(response.data.nbPages);
        setNbHits(response.data.nbHits); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      
      const searchParams = new URLSearchParams({
        query: searchQuery,
        tags: tagOption,
        sort: sortOption,
        time: timeOption,
        page: page.toString(),
      });
      window.history.replaceState(null, "", `?${searchParams.toString()}`);
    };

    fetchData();
  }, [searchQuery, page, sortOption, timeOption, tagOption]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleTimeChange = (e) => setTimeOption(e.target.value);
  const handleTagChange = (e) => setTagOption(e.target.value);
  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div>
      <div className="min-h-screen dashboard-container">
        <header className="dashboard-header">
          <div className="logo-container">
            <img
              className="logo"
              src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730545520/ugal2hh8jb0jkjrdc8fx.png"
              alt="Logo"
            />
            <div className="logo-text">{username || "Search Hacker News"}</div>
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              
            </div>
            <div className="algolia-logos">
              <p>Search by </p>
              <img
                className="logo-img"
                src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730561913/rbc6cvfnzxzpajgvqnbt.png"
                alt="Algolia"
              />
            </div>
          </div>
        </header>
      </div>

      <div className="filters">
        <span>Search</span>
        <select
          value={tagOption}
          onChange={handleTagChange}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="story">Stories</option>
          <option value="ask_hn">Ask HN</option>
          <option value="launch_hn">Launch HN</option>
          <option value="job">Jobs</option>
        </select>
        <span>by</span>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="filter-select"
        >
          <option value="popularity">Popularity</option>
          <option value="date">Date</option>
        </select>
        <span>for</span>
        <select
          value={timeOption}
          onChange={handleTimeChange}
          className="filter-select"
        >
          <option value="all">All time</option>
          <option value="24h">Last 24h</option>
          <option value="week">Past week</option>
          <option value="month">Past month</option>
          <option value="year">Past year</option>
        </select>
        <div className="result-stats">
          <span>{nbHits} results</span>
          <button className="share-button">
            <CiShare2 />
          </button>
        </div>
      </div>

      {/* <div className="results">
        <ul className="Search-results">
          {searchResults.map((result) => (
            <li key={result.objectID} className="result-item">
              <a
                href={result.url}
                className="title"
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.title}
              </a>
              <div className="metadata">
                 | {" "}
                <span className="points-author">
                  {result.points} points by{" "}
                  <span className="author">{result.author}</span>
                </span>
                 | {" "}
                <span className="date">
                  {new Date(result.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                 | {" "}
                <span className="comments">{result.num_comments} comments</span>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="results">
        <ul className="Search-results">
          {searchResults.map((result) => {
            const createdAt = new Date(result.created_at);
            const now = new Date();
            const diffHours = Math.floor((now - createdAt) / (1000 * 60 * 60));

            return (
              <li key={result.objectID} className="result-item">
                <a
                  href={result.url}
                  className="title"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.title}
                </a>
                <div className="metadata">
                  | {" "}
                  <span className="points-author">
                    {result.points} points by{" "}
                    <span className="author">{result.author}</span>
                  </span>
                  | {" "}
                  <span className="date">
                    {diffHours < 24
                      ? `${diffHours} hours ago`
                      : createdAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                  </span>
                  | {" "}
                  <span className="comments">
                    {result.num_comments} comments
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pagination">
        <button disabled={page <= 0} onClick={() => handlePageChange(page - 1)}>
          Previous
        </button>
        <span>
          {page + 1} of {nbPages}
        </span>
        <button
          disabled={page >= nbPages - 1}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
