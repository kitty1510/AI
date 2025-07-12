import { Link } from "react-router-dom";

import { FiHome, FiArchive } from "react-icons/fi";
import { PiCatFill } from "react-icons/pi";
import { FaChartBar } from "react-icons/fa";

const Navbar = ({ show }) => {
  return (
    <div
      className={(show ? "sidenav active" : "sidenav") + " bg-slate-950 pt-20"}
    >
      <ul>
        <li className="p-0">
          <Link to="/" className="flex items-center gap-2">
            none
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 opacity-40 hover:opacity-100 transition"
          >
            <PiCatFill className="inline-block text-sky-100" />
            <span className="text-sky-100 ">Create Video</span>
          </Link>
          <Link
            to="/storage"
            className="flex items-center gap-2 opacity-40 hover:opacity-100 transition"
          >
            <FiArchive className="inline-block text-sky-100" />
            <span className="text-sky-100 ">Category</span>
          </Link>
          <Link
            to="/statistic"
            className="flex items-center gap-2 opacity-40 hover:opacity-100 transition"
          >
            <FaChartBar className="inline-block text-sky-100" />
            <span className="text-sky-100 ">Statistic</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
