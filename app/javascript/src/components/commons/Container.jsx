import React from "react";

import classnames from "classnames";
import Sidebar from "components/Sidebar";
import PropTypes from "prop-types";

const Container = ({ children, fullBleed, mainClassName }) => (
  <div className="flex min-h-screen bg-white">
    <Sidebar />
    <main
      className={classnames(
        "flex min-h-0 flex-1 flex-col",
        fullBleed ? "overflow-hidden" : "overflow-y-auto px-12 py-8",
        mainClassName
      )}
    >
      {children}
    </main>
  </div>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
  fullBleed: PropTypes.bool,
  mainClassName: PropTypes.string,
};

Container.defaultProps = {
  fullBleed: false,
  mainClassName: "",
};

export default Container;
