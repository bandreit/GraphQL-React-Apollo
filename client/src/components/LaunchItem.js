import React from "react";
import className from "classnames";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../App.css";

const LaunchItem = ({
  launch: { flight_number, mission_name, launch_date_local, launch_success },
}) => {
  return (
    <div
      className="card card-body mb-3"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1957&q=80)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="row">
        <div className="col-md-9">
          <h4>
            Mission:{" "}
            <span
              className={className({
                "text-success": launch_success,
                "text-danger": !launch_success,
              })}
            >
              {mission_name}
            </span>
          </h4>
          <p>
            Date: <Moment format="YYYY-MM-DD HH:mm">{launch_date_local}</Moment>
          </p>
        </div>
        <div className="col-md-3 my-auto">
          <Link
            to={`/launch/${flight_number}`}
            style={{ textDecoration: "none" }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className="button"
            >
              Launch Details
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LaunchItem;
