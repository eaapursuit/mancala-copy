import React from "react";
import "./Rules.css";

export default function Rules() {
  return (
    <div className="rules-wrapper">
      <div className="rules-container">
        <section>
          <h2>Objective</h2>
          <p>The goal is to collect the most stones in your store.</p>
        </section>
        <section>
          <h2>Gameplay</h2>
          <ul>
            <li>
              Players take turns picking up all stones from one of their pits
              and sowing them counterclockwise, one stone per pit.
            </li>
            <li>
              If the last stone lands in your store, you take another turn.
            </li>
            <li>
              If the last stone lands in an empty pit on your side, you capture
              all stones in the directly opposite pit and add them to your
              store.
            </li>
          </ul>
        </section>
        <section>
          <h2>Endgame</h2>
          <p>
            The game ends when all six pits on one side are empty. The remaining
            stones on the other side are collected by that player. The player
            with the most stones in their store wins.
          </p>
        </section>
        <section>
          <h2>Tutorial Video</h2>
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/LMIidawf1FI"
              title="Mancala Game Rules Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
}
