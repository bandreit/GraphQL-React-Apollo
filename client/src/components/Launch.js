import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import className from "classnames";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LAUNCH_QUERY = gql`
  query LaunchQuery($flight_number: Int!) {
    launch(flight_number: $flight_number) {
      mission_name
      launch_year
      launch_date_local
      launch_success
      rocket {
        rocket_id
        rocket_name
        rocket_type
      }
    }
  }
`;

const Launch = (props) => {
  let { flight_number } = props.match.params;
  flight_number = parseInt(flight_number);
  const { loading, error, data } = useQuery(LAUNCH_QUERY, {
    variables: { flight_number },
  });

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
        <Loader type="Grid" color="#00BFFF" height={100} width={100} />
      </div>
    );

  const {
    mission_name,
    launch_year,
    launch_success,
    rocket: { rocket_id, rocket_name, rocket_type },
  } = data.launch;

  return (
    <div>
      <motion.div
        animate={{ scale: [0.7, 1, 1.2, 1] }}
        transition={{ duration: 1 }}
      >
        <h1 className="display-4 my-3">
          <span className="text-dark"> Mission:</span> {mission_name}
        </h1>
        <h4 className="mb-3">Launch Details</h4>
        <ul className="list-group">
          <li className="list-group-item">Flight Number: {flight_number}</li>
          <li className="list-group-item">Launch Year: {launch_year}</li>
          <li className="list-group-item">
            Launch Successful:{" "}
            <span
              className={className({
                "text-success": launch_success,
                "text-danger": !launch_success,
              })}
            >
              {launch_success ? "Yep" : "Nope"}
            </span>
          </li>
        </ul>
        <h4 className="my-3">Rocket Details</h4>
        <ul className="list-group">
          <li className="list-group-item">Rocket ID: {rocket_id}</li>
          <li className="list-group-item">Rocket Name: {rocket_name}</li>
          <li className="list-group-item">Rocket Type: {rocket_type}</li>
        </ul>

        <Link className="my-3 btn btn-secondary" to="/">
          BACK
        </Link>
      </motion.div>
    </div>
  );
};

export default Launch;
