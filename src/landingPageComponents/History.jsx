import React from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";

function History() {
  const navigate = useNavigate();

  const handleHistoryBackBtn = () => {
    navigate("/");
  };
  return (
    <>
      
      <div className="history-wrapper">
        
        <div className="history-container">
          <h1>History</h1>
          <p>
            Mancala is one of the oldest known games in the world, with origins
            tracing back to ancient Africa around 6,000 to 7,000 years ago. The
            word mancala comes from the Arabic word <i>naqala</i>, meaning "to
            move&quot;, which reflects the gameplay mechanics of moving stones,
            seeds, or shells across a board.
          </p>
          <button className="history-bck-btn" onClick={handleHistoryBackBtn}>
        Back
      </button>
        </div>
      </div>
    </>
  );
}

export default History;
