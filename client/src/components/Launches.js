import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import moment from "moment/min/moment-with-locales";
import Loader from "react-loader-spinner";
import {
  motion,
  useViewportScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import LaunchItem from "./LaunchItem";
import MissionKey from "./MissionKey";

const LAUNCHES_QUERY = gql`
  query LaunchesQuery {
    launches {
      flight_number
      mission_name
      launch_date_local
      launch_success
    }
  }
`;

const Launches = () => {
  const [isComplete, setIsComplete] = useState(false);
  const { scrollYProgress } = useViewportScroll();
  const yRange = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const pathLength = useSpring(yRange, { stiffness: 400, damping: 90 });
  const [futureSort, setFutureSort] = useState(false);
  const [dateSort, setDateSort] = useState(false);

  useEffect(() => yRange.onChange((v) => setIsComplete(v >= 1)), [yRange]);

  const { loading, error, data } = useQuery(LAUNCHES_QUERY);

  if (loading)
    return (
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        style={{ textAlign: "center" }}
      />
    );
  if (error)
    return (
      <div style={{ textAlign: "center" }}>
        <p>Error :(</p>
        <br></br>
        <Loader
          type="Grid"
          color="#00BFFF"
          height={100}
          width={100}
          style={{ textAlign: "center" }}
        />
      </div>
    );

  const compare = (a, b) => {
    const dateA = a.launch_date_local;
    const dateB = b.launch_date_local;

    let comparison = 0;
    if (dateA > dateB) {
      comparison = dateSort ? 1 : -1;
    } else if (dateA < dateB) {
      comparison = dateSort ? -1 : 1;
    }
    return comparison;
  };

  const inTheFuture = (value) => {
    return futureSort
      ? true
      : !moment(value.launch_date_local).isAfter(moment());
  };

  const launches = data.launches
    .filter(inTheFuture)
    .sort(compare)
    .map((launch) => <LaunchItem key={launch.flight_number} launch={launch} />);

  return (
    <>
      <svg className="progress-icon" viewBox="0 0 60 60">
        <motion.path
          fill="none"
          strokeWidth="5"
          stroke="white"
          strokeDasharray="0 1"
          d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
          style={{
            pathLength,
            rotate: 90,
            translateX: 5,
            translateY: 5,
            scaleX: -1, // Reverse direction of line animation
          }}
        />
        <motion.path
          fill="none"
          strokeWidth="5"
          stroke="white"
          d="M14,26 L 22,33 L 35,16"
          initial={false}
          strokeDasharray="0 1"
          animate={{ pathLength: isComplete ? 1 : 0 }}
        />
      </svg>
      <div>
        <h1 className="display-4 my-3">Launches</h1>
        <div className="row">
          <div className="col-md-5">
            <MissionKey />
          </div>
          <div className="col-md-5 offset-md-2 my-auto">
            <div className="row d-flex justify-content-end align-items-center">
              <div className="col-md-5 custom-control custom-switch d-flex justify-content-center my-2">
                <input
                  type="checkbox"
                  checked={futureSort}
                  className="custom-control-input"
                  onChange={(e) => {
                    setFutureSort(!futureSort);
                  }}
                  id="switch1"
                />
                <label className="custom-control-label" htmlFor="switch1">
                  Show Future Launches
                </label>
              </div>
              <div className="col-md-5 form-group mb-2">
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  onChange={(e) => setDateSort(!dateSort)}
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {launches}
      </div>
    </>
  );
};

export default Launches;
