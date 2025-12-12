import React from "react";
import SettingsMenu from "./SettingsMenu";

export default function NavBar({ onExport, onImportClick, clearAllData }) {
  return (
    <nav className="app-nav">
      <div className="nav-inner">
        <div className="nav-left">
          <a className="nav-link" href="#list">List</a>
          <a className="nav-link" href="#analytics">Analytics</a>
          <a className="nav-link" href="#help">Help</a>
        </div>

        <div className="nav-right">
          <button className="nav-icon" title="Quick export" onClick={onExport}>Export</button>
          <SettingsMenu onImportClick={onImportClick} clearData={clearAllData} />
        </div>
      </div>
    </nav>
  );
}
